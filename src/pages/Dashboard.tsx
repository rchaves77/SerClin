
import SignatureCanvas from 'react-signature-canvas';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMinutes, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  LogOut, Layout, Calendar as CalendarIcon, Plus, X, Trash2, 
  FileText, BarChart3, Shield, Clock, Users, GraduationCap,  
  CheckCircle, RefreshCw, Wallet, Receipt, Calculator, Scale, Search, 
  MessageCircle, Building, HandCoins, School, Send, User, Menu, Filter
} from "lucide-react";  
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import { usePerfil } from "@/hooks/usePerfil";

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import QRCode from 'qrcode'; 

import logoSer2 from "@/assets/ser2.png";
import 'react-big-calendar/lib/css/react-big-calendar.css';

// --- CONFIGURAÇÃO DE TRADUÇÃO ---
const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ 
  format, 
  parse, 
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }), 
  getDay, 
  locales 
});

const mensagensPortugues = {
  allDay: 'Dia Inteiro',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Nenhum agendamento neste período.',
  showMore: (total: number) => `+ ver mais (${total})`
};

const mapearStatusParaBanco = (statusVisual: string) => {
  const s = statusVisual.toLowerCase();
  if (s.includes('presen') || s.includes('atendido')) return 'Presenca';
  if (s.includes('falta')) return 'Falta';
  return 'Agendado';
};

// --- VISUAL SUPER CLEAN ---
const EventoCustomizado = ({ event }: any) => {
  const isPresenca = event.original?.status === 'Presenca' || event.original?.status === 'Presença';
  const isFalta = event.original?.status === 'Falta';
  
  return (
    <div className="h-full w-full flex items-center justify-start gap-1.5 px-1 overflow-hidden text-left">
      {isPresenca && (
        <CheckCircle size={13} className="text-white shrink-0" strokeWidth={3} />
      )}
      <span className={`text-white font-bold text-[11px] uppercase leading-tight truncate text-left ${isFalta ? 'line-through opacity-75' : ''}`}>
        {event.title}
      </span>
    </div>
  );
};

export function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin, isSecretaria } = usePerfil();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [nomeLogado, setNomeLogado] = useState<string>(""); 
  const [isGestorSeguro, setIsGestorSeguro] = useState(false);
  const [meuPerfil, setMeuPerfil] = useState<any>(null);
  
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const [view, setView] = useState<View>(window.innerWidth < 768 ? Views.AGENDA : Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [equipe, setEquipe] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modais e UI
  const [isAgendamentoOpen, setIsAgendamentoOpen] = useState(false);
  const [isConfirmacaoAmanhaOpen, setIsConfirmacaoAmanhaOpen] = useState(false);
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
  
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState<number | null>(null);
  const [filtroProfissional, setFiltroProfissional] = useState<string>("geral");
  const [buscaPaciente, setBuscaPaciente] = useState("");
  const [pacientesSugeridos, setPacientesSugeridos] = useState<any[]>([]);
  
  const [form, setForm] = useState({ 
    profissional: '', paciente_nome: '', paciente_id: null as number | null,
    telefone: '', sala: '1', inicio: '', duracao: '40', status: 'Agendado',
    assinatura_url: null as string | null,
    valor_atendimento: "0,00",
    forma_pagamento: "Pix"
  });

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: todosPerfis } = await supabase.from('perfis').select('*').order('nome');
      
      let nomeParaFiltro = "";
      let ehGestorEfetivo = false;

      if (!user) {
        const demoRaw = localStorage.getItem('serclin_demo_session');
        if (demoRaw) {
          try {
            const demoUser = JSON.parse(demoRaw);
            setUserEmail(demoUser.email || 'romulochaves77@gmail.com');
            setNomeLogado(demoUser.name || 'Gestor SerClin');
            setMeuPerfil({
              nome: demoUser.name || 'Gestor SerClin',
              role: demoUser.role || 'admin',
              email: demoUser.email || 'romulochaves77@gmail.com',
              permissao_financeiro: true,
              permissao_confirmacao_amanha: true
            });
            ehGestorEfetivo = true;
          } catch (e) {
            ehGestorEfetivo = true;
          }
        } else {
          ehGestorEfetivo = true; // garante visualização completa dos botões do sistema
        }
      } else if (todosPerfis) {
        const emailAutenticado = user.email?.toLowerCase().trim();
        setUserEmail(emailAutenticado ?? null);

        const perfilLogado = todosPerfis.find((p: any) => p.email?.toLowerCase().trim() === emailAutenticado);
        
        if (perfilLogado) {
          setMeuPerfil(perfilLogado);
          nomeParaFiltro = perfilLogado.nome || "";
          setNomeLogado(nomeParaFiltro);
          
          const roleNoBanco = (perfilLogado.role || "").toLowerCase().trim();
          
          if (
            emailAutenticado === 'romulochaves77@gmail.com' || 
            emailAutenticado === 'nahpsicologiachaves@gmail.com' ||
            roleNoBanco === 'admin' ||
            roleNoBanco === 'secretaria'
          ) {
            ehGestorEfetivo = true;
          }
        } else {
          ehGestorEfetivo = true;
        }
      }

      setIsGestorSeguro(ehGestorEfetivo);

      if (todosPerfis) {
        const filtrados = todosPerfis.filter((p: any) => {
          const n = (p.nome || "").toLowerCase();
          const r = (p.role || "").toLowerCase();
          const proibidos = ['instituto', 'recepcao', 'recepção'];
          if (n.includes('renata') && r === 'secretaria') return false;
          return !proibidos.some(termo => n.includes(termo)) && r !== 'secretaria';
        });
        setEquipe(filtrados);

        const { data: agendamentos, error } = await supabase.from('agendamentos').select('*');
        if (!error && agendamentos) {
          let permitidos = agendamentos;
          
          if (!ehGestorEfetivo && nomeParaFiltro) {
            const nomeLogadoNorm = nomeParaFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
            permitidos = agendamentos.filter((ag: any) => {
              const nomeAgNorm = (ag.profissional_nome || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
              return nomeAgNorm === nomeLogadoNorm;
            });
          }

          const eventosFormatados = permitidos.map((evt: any) => {
            const perfil = todosPerfis.find((p: any) => p.nome?.trim().toLowerCase() === evt.profissional_nome?.trim().toLowerCase());
            
            const dataInicio = new Date(evt.data_inicio);
            let dataFim = evt.data_fim ? new Date(evt.data_fim) : addMinutes(dataInicio, parseInt(evt.duracao || '40'));
            if (isNaN(dataFim.getTime())) { dataFim = addMinutes(dataInicio, 40); }

            return {
              id: evt.id,
              title: `${evt.paciente_nome} (S${evt.sala_id})`,
              start: dataInicio,
              end: dataFim,
              color: perfil?.cor || '#1e3a8a',
              original: evt
            };
          });
          setEvents(eventosFormatados);
        }
      }
    } catch (err) { toast.error("Erro ao carregar dados."); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const pesquisar = async () => {
      if (buscaPaciente.length < 2) { setPacientesSugeridos([]); return; }
      const { data } = await supabase.from('pacientes').select('id, nome, telefone').ilike('nome', `%${buscaPaciente}%`).limit(5);
      setPacientesSugeridos(data || []);
    };
    pesquisar();
  }, [buscaPaciente]);

  const aplicarMascaraTelefone = (value: string) => {
    if (!value) return "";
    const apenasNumeros = value.replace(/\D/g, "");
    return apenasNumeros.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3").slice(0, 16);
  };

  const aplicarMascaraMoeda = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, "");
    const valorFloat = parseFloat(apenasNumeros) / 100;
    if (isNaN(valorFloat)) return "0,00";
    return valorFloat.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const enviarWhatsApp = (nome: string, fone: string, prof: string, inicio: string) => {
    if (!fone) return toast.error("Paciente sem telefone.");
    const foneLimpo = fone.replace(/\D/g, '');
    const dataFormatada = format(new Date(inicio), "dd/MM/yyyy");
    const horaFormatada = format(new Date(inicio), "HH:mm");
    const mensagem = `Olá, ${nome}! Confirmamos sua consulta no *Instituto SerClin* com o(a) profissional ${prof} no dia *${dataFormatada}* às *${horaFormatada}*. Podemos confirmar sua presença?`;
    window.open(`https://wa.me/55${foneLimpo}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  const gerarComprovante = async () => {
    setLoading(true);
    try {
      const { data: val, error } = await supabase
        .from('validacoes')
        .insert([{ paciente_nome: form.paciente_nome, profissional_nome: form.profissional }])
        .select('id')
        .single();
        
      if (error) {
        toast.error(`Erro no Banco: A tabela 'validacoes' existe? Detalhe: ${error.message}`);
        setLoading(false);
        return;
      }

      const urlValidacao = `https://institutoserclin.vercel.app/validar/${val.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(urlValidacao);
      const doc = new jsPDF();
      
      doc.addImage(logoSer2, 'PNG', 75, 10, 60, 40);
      
      doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 58, 138);
      doc.text("ATESTADO DE COMPARECIMENTO", 105, 60, { align: "center" });
      
      const textoCorpo = `Declaramos para os devidos fins de comprovação que o(a) paciente ${form.paciente_nome.toUpperCase()} esteve presente no INSTITUTO SERCLIN para atendimento especializado no dia ${format(new Date(form.inicio), "dd/MM/yyyy")}. O atendimento teve início às ${format(new Date(form.inicio), "HH:mm")} sob a responsabilidade do(a) profissional ${form.profissional.toUpperCase()}.`;
      
      doc.setFontSize(12); doc.setFont("helvetica", "normal"); doc.setTextColor(0, 0, 0);
      doc.text(textoCorpo, 20, 85, { maxWidth: 170, align: "justify", lineHeightFactor: 1.5 });
      
      if (form.assinatura_url) {
        doc.addImage(form.assinatura_url, 'PNG', 20, 140, 50, 20);
      }
      
      doc.addImage(qrCodeDataUrl, 'PNG', 87, 195, 30, 30);
      doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(100, 100, 100);
      doc.text("Escaneie o QR Code acima ou acesse o link abaixo para validar a autenticidade:", 105, 230, { align: "center" });
      
      doc.setFont("helvetica", "bold"); doc.setTextColor(37, 99, 235);
      doc.text(urlValidacao, 105, 235, { align: "center" });
      doc.link(20, 231, 170, 6, { url: urlValidacao }); 
      
      doc.save(`Atestado_${form.paciente_nome.replace(/\s+/g, '_')}.pdf`);
      toast.success("Atestado Gerado com Sucesso!");
      
    } catch (err: any) { 
      toast.error(`Erro PDF: ${err.message || "Falha na construção do arquivo"}`); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleExcluirAgendamento = async () => {
    if (!eventoSelecionadoId || !confirm("⚠️ Deseja realmente apagar este agendamento?")) return;
    setLoading(true);
    try {
      await supabase.from('agendamentos').delete().eq('id', eventoSelecionadoId);
      toast.success("Removido!");
      setIsAgendamentoOpen(false); fetchData();
    } catch (err) { toast.error("Erro."); } finally { setLoading(false); }
  };

  const handleSalvarAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações de segurança
    if (!form.profissional || !form.inicio) return toast.error("Preencha o profissional e o horário.");
    if (!buscaPaciente && !form.paciente_id) return toast.error("Informe o nome do paciente.");
    
    setLoading(true);
    try {
      const dInicio = new Date(form.inicio);
      const dFim = addMinutes(dInicio, parseInt(form.duracao));

      // =========================================================================
      // 🌟 VALIDAÇÃO DE DIAS E HORÁRIOS DA CENTRAL DE CONFIGURAÇÃO (NÃO REMOVER)
      // =========================================================================
      const diasSemanaMap = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
      const diaDaSemanaDesejado = diasSemanaMap[dInicio.getDay()]; // Retorna 'DOM', 'SEG', etc.

      // Encontra as regras do profissional atual dentro do estado 'equipe' do seu Dashboard
      const profissionalConfig = equipe.find(p => p.nome?.trim().toLowerCase() === form.profissional?.trim().toLowerCase());

      if (profissionalConfig) {
        // 1. Validar Dias Permitidos
        let diasPermitidos: string[] = [];
        if (Array.isArray(profissionalConfig.dias_atendimento)) {
          diasPermitidos = profissionalConfig.dias_atendimento;
        } else if (typeof profissionalConfig.dias_atendimento === 'string') {
          try { diasPermitidos = JSON.parse(profissionalConfig.dias_atendimento); } 
          catch { diasPermitidos = profissionalConfig.dias_atendimento.split(','); }
        }

        // Se o gestor configurou os dias na central, valida se o dia atual está liberado
        if (diasPermitidos.length > 0 && !diasPermitidos.includes(diaDaSemanaDesejado)) {
          setLoading(false);
          return toast.error(`Este profissional não está configurado para atender na ${diaDaSemanaDesejado}.`, {
            description: "Ative este dia na tela de Configurações para liberar."
          });
        }

        // 2. Validar Limites de Horário (Início e Fim)
        if (profissionalConfig.hora_inicio && profissionalConfig.hora_fim) {
          const horaMinutosAgendamento = format(dInicio, "HH:mm:ss");
          const horaMinutosFimAgendamento = format(dFim, "HH:mm:ss");

          if (horaMinutosAgendamento < profissionalConfig.hora_inicio || horaMinutosFimAgendamento > profissionalConfig.hora_fim) {
            setLoading(false);
            return toast.error("Horário fora do expediente deste profissional!", {
              description: `Permitido: ${profissionalConfig.hora_inicio.substring(0,5)}h às ${profissionalConfig.hora_fim.substring(0,5)}h.`
            });
          }
        }
      }
      // =========================================================================

      let idDoPaciente = form.paciente_id;

      // 1. Lógica de Auto-cadastro de Paciente (Neuropsicologia costuma ter muitos novos)
      if (!idDoPaciente) {
        const { data: novoPac, error: pacErr } = await supabase
          .from("pacientes")
          .insert([{ 
            nome: buscaPaciente.toUpperCase(), 
            telefone: form.telefone, 
            convenio: "Particular" 
          }])
          .select('id')
          .single();
        
        if (pacErr) throw new Error("Erro ao cadastrar novo paciente.");
        if (novoPac) idDoPaciente = novoPac.id;
      }

      // 2. Processamento da Assinatura (Digitalização SerClin)
      let assinaturaBase64 = form.assinatura_url;
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        assinaturaBase64 = sigCanvas.current.getCanvas().toDataURL('image/png');
      }

      // 3. Sanitização Financeira (Trata 1.200,50 ou 1200.50)
      const valorLimpo = parseFloat(
        form.valor_atendimento
          .toString()
          .replace(/\./g, "")
          .replace(",", ".")
      ) || 0;

      // --- SANITIZAÇÃO E BLINDAGEM DE TIPOS PARA EVITAR ERRO 400 ---
      const salaNumero = parseInt(form.sala) || 1;

      const payload = {
        sala_id: salaNumero,
        profissional_nome: form.profissional,
        paciente_nome: buscaPaciente.toUpperCase(),
        paciente_id: idDoPaciente || null, // Garante null válido se não houver ID
        paciente_telefone: form.telefone || "",
        data_inicio: dInicio.toISOString(),
        data_fim: dFim.toISOString(),
        status: mapearStatusParaBanco(form.status),
        assinatura_url: assinaturaBase64 || null, // Evita undefined se estiver vazio
        valor_atendimento: valorLimpo,
        forma_pagamento: form.forma_pagamento || "Pix"
      };

      // 4. Update ou Insert do Agendamento
      const { error } = eventoSelecionadoId 
        ? await supabase.from('agendamentos').update(payload).eq('id', eventoSelecionadoId) 
        : await supabase.from('agendamentos').insert([payload]);

      // 🌟 DIAGNÓSTICO ATIVO: Mostra a coluna exata que quebrou no console F12
      if (error) {
        console.error("Erro detalhado do Supabase na tabela agendamentos:", error);
        throw new Error(`Erro no banco: ${error.message} (Código: ${error.code})`);
      }

      // =========================================================================
      // 🌟 REGISTRO AUTOMÁTICO DE EVOLUÇÃO DIÁRIA POR COMPARECIMENTO
      // =========================================================================
      if (mapearStatusParaBanco(form.status) === 'Presenca' && idDoPaciente) {
        const dataHoje = new Date();
        const dataFormatada = dataHoje.toLocaleDateString('pt-BR');
        const horaFormatada = dataHoje.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const textoPresencaGenerico = `[Registro Automático de Comparecimento]\n\n` +
          `• Status: Presença confirmada no consultório em ${dataFormatada} às ${horaFormatada}.\n` +
          `• Paciente: ${buscaPaciente.toUpperCase()}\n` +
          `• Profissional Responsável: ${form.profissional || 'Profissional SerClin'}\n` +
          `• Sala de Atendimento: Sala 0${form.sala || '1'}\n\n` +
          `--------------------------------------------------\n` +
          `EVOLUÇÃO CLÍNICA DA SESSÃO (Espaço reservado para o profissional):\n\n`;

        const { error: erroProntuario } = await supabase.from("prontuarios").insert([{
          paciente_id: idDoPaciente,
          tipo_registro: "Sessão", 
          descricao: textoPresencaGenerico,
          profissional_nome: form.profissional || "Profissional SerClin",
          historico: []
        }]);

        if (erroProntuario) {
          console.error("Erro detalhado ao gerar evolução automática:", erroProntuario);
        }
      }
      // =========================================================================
         
      // 5. Feedback e Refresh
      setIsAgendamentoOpen(false);
      setEventoSelecionadoId(null);
      fetchData(); // Certifique-se que sua função de carregar se chama fetchData
      toast.success(eventoSelecionadoId ? "Agendamento atualizado!" : "Paciente agendado com sucesso!");

    } catch (err: any) {
      console.error("Erro SerClin Save:", err);
      
      // Mapeia o erro de choque de horário do banco de dados para a secretária entender
      if (err.toString().includes("no_profissional_overlap") || (err.message && err.message.includes("no_profissional_overlap"))) {
        toast.error("⚠️ CHOQUE DE HORÁRIO DETECTADO!", {
          description: "O(A) profissional selecionado(a) já possui outro atendimento agendado nesta mesma faixa de horário. Escolha outro horário ou verifique a agenda deste profissional.",
          duration: 8000,
        });
      } else {
        toast.error(err.message || "Erro ao salvar na agenda.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtro de Agendamentos de Amanhã (Para o botão do Header)

  // Filtro de Agendamentos de Amanhã (Para o botão do Header)
  const agendamentosAmanha = events
    .filter((e: any) => isSameDay(new Date(e.start), addDays(new Date(), 1)))
    .map((e: any) => e.original || e) // Garante compatibilidade com o formato do BigCalendar
    .sort((a: any, b: any) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime());

  // Limites do Calendário (7h às 20h)
  const minTime = new Date(2024, 0, 1, 7, 0, 0); 
  const maxTime = new Date(2024, 0, 1, 20, 0, 0);

  return (
    <div className="h-[100dvh] w-full bg-[#f1f5f9] flex font-sans overflow-hidden text-left">
      <style>{`
        .rbc-agenda-view table.rbc-agenda-table tbody > tr > td { color: #1f2937 !important; font-weight: 800 !important; font-size: 14px !important; }
        .rbc-agenda-view { background-color: #ffffff; border-radius: 1.25rem; overflow: hidden; border: 1px solid #e2e8f0; }
        .rbc-agenda-date-cell, .rbc-agenda-time-cell { color: #0e1e28 !important; font-weight: 800 !important; }
        .rbc-toolbar button { color: #0e1e28 !important; font-weight: bold; font-size: 12px !important; border-radius: 8px !important; }
        .rbc-toolbar button.rbc-active { background-color: #0e1e28 !important; color: white !important; }
        .rbc-event-content { font-size: 12px !important; font-weight: 700 !important; }
        .rbc-time-view { border-radius: 1.25rem; overflow: hidden; border: 1px solid #e2e8f0; background: #ffffff; }
        .rbc-timeslot-group { border-bottom: 1px solid #f1f5f9 !important; }
        .rbc-label { color: #64748b !important; font-weight: 700 !important; font-size: 11px !important; }
        .rbc-header { padding: 8px !important; font-weight: 800 !important; color: #1e293b !important; font-size: 12px !important; text-transform: uppercase; background: #f8fafc; border-bottom: 2px solid #e2e8f0 !important; }

        @media (max-width: 768px) {
          .rbc-toolbar { flex-direction: column; gap: 8px; height: auto !important; padding: 10px !important; }
          .fixed.inset-0 .bg-white.rounded-\[2\.5rem\] { max-width: 100% !important; width: 100% !important; height: 100% !important; border-radius: 0 !important; margin: 0 !important; padding-top: env(safe-area-inset-top, 20px) !important; }
          .sigCanvas { width: 100% !important; height: 120px !important; }
        }
      `}</style>

     {/* HEADER INTEGRAL SERCLIN - AJUSTADO PARA MOBILE LIMPO */}
      {/* SIDEBAR NAVEGAÇÃO MEDCLOUD (DESKTOP) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0e1e28] text-slate-300 border-r border-[#1a2d3b] shrink-0 z-30 select-none">
        {/* TOPO: BRAND SERCLIN */}
        <div className="h-16 px-5 border-b border-[#182a38] flex items-center gap-3 bg-[#0a161f]">
          <img src={logoSer2} className="w-9 h-9 object-contain" alt="SerClin" />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider text-white uppercase font-serif">SerClin</span>
            <span className="text-[9px] font-semibold text-cyan-400/80 uppercase tracking-widest">Gestão Integrada</span>
          </div>
        </div>

        {/* LISTA DE MENU CATEGORIZADA */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 text-xs font-medium custom-scrollbar">
          
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Atendimento & Agenda
          </div>

          <button
            onClick={() => navigate('/sistema')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#182e3d] text-white font-semibold border-l-4 border-[#D4A017] shadow-xs transition-all text-left cursor-pointer"
          >
            <CalendarIcon size={16} className="text-[#D4A017]" />
            <span>Agenda Médica</span>
          </button>

          <button
            onClick={() => navigate('/sistema/pacientes')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#152633] hover:text-white transition-all text-left cursor-pointer"
          >
            <Users size={16} className="text-cyan-400" />
            <span>Pacientes & Prontuários</span>
          </button>

          <button
            onClick={() => navigate('/sistema/permissoes')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#152633] hover:text-white transition-all text-left cursor-pointer"
          >
            <Shield size={16} className="text-purple-400" />
            <span>Corpo Clínico & Equipe</span>
          </button>

          <div className="px-3 pt-4 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-[#162734] mt-2">
            Faturamento & Financeiro
          </div>

          <button
            onClick={() => navigate('/sistema/planos')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#152633] hover:text-white transition-all text-left cursor-pointer"
          >
            <Wallet size={16} className="text-emerald-400" />
            <span>Planos de Saúde</span>
          </button>

          <button
            onClick={() => navigate('/sistema/despesas')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#152633] hover:text-white transition-all text-left cursor-pointer"
          >
            <Receipt size={16} className="text-rose-400" />
            <span>Despesas & Contas</span>
          </button>

          <button
            onClick={() => navigate('/sistema/repasses')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#152633] hover:text-white transition-all text-left cursor-pointer"
          >
            <HandCoins size={16} className="text-blue-400" />
            <span>Repasses Médicos</span>
          </button>

          <button
            onClick={() => navigate('/sistema/taxas')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#152633] hover:text-white transition-all text-left cursor-pointer"
          >
            <Calculator size={16} className="text-amber-400" />
            <span>Simular Taxas</span>
          </button>

          <button
            onClick={() => navigate('/sistema/fechamento')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#152633] hover:text-white transition-all text-left cursor-pointer"
          >
            <Scale size={16} className="text-indigo-400" />
            <span>Caixa & Fechamento</span>
          </button>

          <div className="px-3 pt-4 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-[#162734] mt-2">
            Portais & Relatórios
          </div>

          <button
            onClick={() => navigate('/sistema/relatorios')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#152633] hover:text-white transition-all text-left cursor-pointer"
          >
            <Search size={16} className="text-amber-400" />
            <span>Relatórios Gerenciais</span>
          </button>

          <button
            onClick={() => navigate('/escola')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#152633] hover:text-white transition-all text-left cursor-pointer"
          >
            <School size={16} className="text-purple-400" />
            <span>Hub Neuroeducacional</span>
          </button>

          <button
            onClick={() => navigate('/corporativo')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#152633] hover:text-white transition-all text-left cursor-pointer"
          >
            <Building size={16} className="text-sky-400" />
            <span>Blindagem Corporativa</span>
          </button>

        </nav>

        {/* RODAPÉ SIDEBAR - USUÁRIO E LOGOUT */}
        <div className="p-3 border-t border-[#182a38] bg-[#0a161f] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#182e3d] flex items-center justify-center text-xs font-bold text-cyan-400 border border-cyan-500/30 shrink-0">
              {nomeLogado ? nomeLogado.substring(0, 2).toUpperCase() : 'SC'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-200 truncate">{nomeLogado || 'Gestor'}</span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Conectado
              </span>
            </div>
          </div>

          <button
            title="Sair do Sistema"
            onClick={async () => {
              try { await supabase.auth.signOut(); } catch (e) {}
              localStorage.removeItem('serclin_demo_session');
              window.dispatchEvent(new Event('storage'));
              navigate('/');
            }}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-[#1a2e3d] rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* CONTAINER PRINCIPAL DIREITA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        {/* TOP BAR SUPERIOR TIPO MEDCLOUD */}
        <header className="h-16 bg-[#0e1e28] text-white px-4 flex items-center justify-between border-b border-[#1b2d3a] shrink-0 z-20">
          
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setIsMenuMobileOpen(true)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-[#182b38]"
            >
              <Menu size={20} />
            </button>

            {/* FILTRO RÁPIDO DE PROFISSIONAIS */}
            {isGestorSeguro && (
              <div className="w-48 sm:w-64">
                <Select value={filtroProfissional} onValueChange={setFiltroProfissional}>
                  <SelectTrigger className="bg-[#142531] border-[#1d3242] text-slate-200 font-medium h-9 text-xs rounded-xl px-3">
                    <div className="flex items-center gap-2 truncate">
                      <Filter size={14} className="text-[#D4A017] shrink-0" />
                      <SelectValue placeholder="Todos Profissionais" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="z-[100] bg-[#0e1e28] border-[#1f3342] text-slate-200">
                    <SelectItem value="geral" className="font-bold text-xs text-[#D4A017]">Visão Geral (Todos)</SelectItem>
                    {equipe.map((p: any) => (
                      <SelectItem key={p.id} value={p.nome} className="text-xs text-slate-200 hover:bg-[#182b38]">
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* BOTOES DE AÇÃO RÁPIDA (AGENDAR E CONFIRMAR) */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsConfirmacaoAmanhaOpen(true)}
              variant="outline"
              className="bg-[#142531] border-[#1d3242] hover:bg-[#1a2f3e] text-emerald-400 hover:text-emerald-300 h-9 px-3 text-xs font-semibold rounded-xl gap-2 transition-all cursor-pointer"
            >
              <Send size={14} className="text-emerald-400" />
              <span className="hidden sm:inline">Confirmar Amanhã</span>
            </Button>

            {meuPerfil?.permissao_agendar && (
              <Button
                onClick={() => {
                  setEventoSelecionadoId(null);
                  setBuscaPaciente("");
                  setForm({ ...form, profissional: isGestorSeguro ? '' : nomeLogado, paciente_id: null, status: 'Agendado', duracao: '40', assinatura_url: null, inicio: format(new Date(), "yyyy-MM-dd'T'HH:mm"), telefone: "", valor_atendimento: "0,00", forma_pagamento: "Pix" });
                  setIsAgendamentoOpen(true);
                }}
                className="bg-[#0D4F5C] hover:bg-[#093a44] text-white font-bold h-9 px-4 text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer border border-cyan-500/20"
              >
                <Plus size={16} className="text-[#D4A017]" />
                <span>Novo Agendamento</span>
              </Button>
            )}
          </div>
        </header>

        {/* DRAWER MENU MOBILE */}
        {isMenuMobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex md:hidden" onClick={() => setIsMenuMobileOpen(false)}>
            <div className="w-72 bg-[#0e1e28] h-full text-slate-200 p-4 flex flex-col space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-3 border-b border-[#182a38]">
                <div className="flex items-center gap-2">
                  <img src={logoSer2} className="w-8 h-8 object-contain" alt="SerClin" />
                  <span className="font-serif font-bold text-sm text-white">SerClin</span>
                </div>
                <button onClick={() => setIsMenuMobileOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 text-xs">
                <button onClick={() => { navigate('/sistema'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#182e3d] text-white font-semibold text-left">
                  <CalendarIcon size={16} className="text-[#D4A017]" /> Agenda
                </button>
                <button onClick={() => { navigate('/sistema/pacientes'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-[#152633] text-left">
                  <Users size={16} className="text-cyan-400" /> Pacientes & Prontuários
                </button>
                <button onClick={() => { navigate('/sistema/permissoes'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-[#152633] text-left">
                  <Shield size={16} className="text-purple-400" /> Equipe & Permissões
                </button>
                <button onClick={() => { navigate('/sistema/planos'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-[#152633] text-left">
                  <Wallet size={16} className="text-emerald-400" /> Planos
                </button>
                <button onClick={() => { navigate('/sistema/despesas'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-[#152633] text-left">
                  <Receipt size={16} className="text-rose-400" /> Despesas
                </button>
                <button onClick={() => { navigate('/sistema/repasses'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-[#152633] text-left">
                  <HandCoins size={16} className="text-blue-400" /> Repasses
                </button>
                <button onClick={() => { navigate('/sistema/taxas'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-[#152633] text-left">
                  <Calculator size={16} className="text-amber-400" /> Simular Taxas
                </button>
                <button onClick={() => { navigate('/sistema/fechamento'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-[#152633] text-left">
                  <Scale size={16} className="text-indigo-400" /> Caixa
                </button>
                <button onClick={() => { navigate('/sistema/relatorios'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-[#152633] text-left">
                  <Search size={16} className="text-amber-400" /> Relatórios
                </button>
                <button onClick={() => { navigate('/escola'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-[#152633] text-left">
                  <School size={16} className="text-purple-400" /> Hub Escola
                </button>
                <button onClick={() => { navigate('/corporativo'); setIsMenuMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-[#152633] text-left">
                  <Building size={16} className="text-sky-400" /> Blindagem Corp
                </button>
              </div>

              <button
                onClick={async () => {
                  try { await supabase.auth.signOut(); } catch (e) {}
                  localStorage.removeItem('serclin_demo_session');
                  window.dispatchEvent(new Event('storage'));
                  navigate('/');
                }}
                className="w-full bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 p-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs text-center"
              >
                <LogOut size={16} /> Sair do Sistema
              </button>
            </div>
          </div>
        )}









      
      {/* ÁREA PRINCIPAL DO DASHBOARD */}
      <main className="flex-1 p-2 md:p-4 overflow-hidden text-left flex flex-col relative">

          {isGestorSeguro && (
            <div className="mb-3 flex justify-end z-10 shrink-0">
              <Select value={filtroProfissional} onValueChange={setFiltroProfissional}>
                <SelectTrigger className="bg-white border border-gray-100 text-[#1e3a8a] font-black h-11 text-xs rounded-2xl px-4 shadow-sm w-full md:w-[250px]">
                  <div className="flex items-center gap-2 uppercase tracking-widest">
                    <Filter size={16} className="text-emerald-500" />
                    <SelectValue placeholder="Filtrar Agenda" />
                  </div>
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="geral" className="font-black uppercase text-xs text-blue-700">Visão Geral (Todos)</SelectItem>
                  {equipe.map((p: any) => (
                    <SelectItem key={p.id} value={p.nome} className="font-bold uppercase text-xs text-gray-600">
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Card className="flex-1 border-none shadow-sm bg-white rounded-[2rem] overflow-hidden flex flex-col">
            <CardContent className="p-0 flex-1 min-h-[500px]">
              <Calendar 
                style={{ height: '100%', minHeight: '65vh' }}
                localizer={localizer} culture='pt-BR' messages={mensagensPortugues}
                events={filtroProfissional === "geral" ? events : events.filter((e: any) => e.original?.profissional_nome === filtroProfissional)} 
                view={view} onView={setView} date={date} onNavigate={setDate} 
                views={['day', 'week', 'month', 'agenda']} 
                min={minTime} 
                max={maxTime} 
                components={{ event: EventoCustomizado }} 
                eventPropGetter={(event: any) => ({ style: { backgroundColor: event.color, color: 'white', border: 'none', borderRadius: '6px', opacity: event.original?.status === 'Falta' ? 0.5 : 1 } })}
                onSelectEvent={(e) => { 
                  const evt = e.original; 
                  setEventoSelecionadoId(evt.id); 
                  setBuscaPaciente(evt.paciente_nome); 
                  setForm({ ...form, profissional: evt.profissional_nome, paciente_nome: evt.paciente_nome, paciente_id: evt.paciente_id, telefone: aplicarMascaraTelefone(evt.paciente_telefone || ''), sala: evt.sala_id?.toString() || '1', inicio: format(new Date(evt.data_inicio), "yyyy-MM-dd'T'HH:mm"), status: evt.status === 'Presenca' ? 'Presença' : (evt.status || 'Agendado'), duracao: evt.original?.duracao || '40', assinatura_url: evt.assinatura_url || null, valor_atendimento: aplicarMascaraMoeda(evt.valor_atendimento?.toString() || "0"), forma_pagamento: evt.forma_pagamento || "Pix" }); 
                  setIsAgendamentoOpen(true); 
                }} 
              />
            </CardContent>
          </Card>

          {meuPerfil?.permissao_agendar && (
            <button 
              onClick={() => { 
                setEventoSelecionadoId(null); 
                setBuscaPaciente(""); 
                setForm({ ...form, profissional: isGestorSeguro ? '' : nomeLogado, paciente_id: null, status: 'Agendado', duracao: '40', assinatura_url: null, inicio: format(new Date(), "yyyy-MM-dd'T'HH:mm"), telefone: "", valor_atendimento: "0,00", forma_pagamento: "Pix" }); 
                setIsAgendamentoOpen(true); 
              }} 
              className="md:hidden fixed bottom-6 right-6 z-[45] bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 px-6 flex items-center justify-center shadow-[0_8px_30px_rgb(37,99,235,0.4)] active:scale-95 transition-transform"
            >
              <Plus size={20} className="mr-1.5" />
              <span className="font-black text-[13px] uppercase tracking-widest">Agendar</span>
            </button>
          )}
        </main>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE AMANHÃ */}
      {isConfirmacaoAmanhaOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[650px] border border-gray-100 overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-white text-left">
              <div>
                <h3 className="font-black uppercase text-xl tracking-tighter text-[#1e3a8a]">Lista de Confirmação</h3>
                <p className="text-[12px] font-bold text-emerald-600 uppercase flex items-center gap-2">
                  <CalendarIcon size={14}/> {format(addDays(new Date(), 1), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
              <button onClick={() => setIsConfirmacaoAmanhaOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                <X size={24}/>
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto bg-gray-50/50 space-y-3 text-left">
              {agendamentosAmanha.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 font-bold uppercase text-xs text-left">Nenhum agendamento para amanhã.</p>
                </div>
              ) : (
                agendamentosAmanha.map((ag: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm group">
                    <div className="flex items-center gap-5 text-left">
                      <div className="h-14 w-20 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                        <span className="font-black text-[#1e3a8a]">{format(new Date(ag.data_inicio), "HH:mm")}</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-black text-[15px] uppercase text-gray-800 leading-tight">{ag.paciente_nome}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Prof: {ag.profissional_nome}</span>
                          <span className="text-[10px] font-bold text-blue-500 uppercase">Sala {ag.sala_id}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => enviarWhatsApp(ag.paciente_nome, ag.paciente_telefone, ag.profissional_nome, ag.data_inicio)} className="bg-emerald-500 text-white rounded-2xl h-14 px-6 flex items-center gap-3 shadow-lg transition-all">
                      <MessageCircle size={20} />
                      <span className="font-black uppercase text-[11px] hidden sm:block">Confirmar</span>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE AGENDAMENTO COMPLETO */}
      {isAgendamentoOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-0 md:p-2 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setIsAgendamentoOpen(false)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[440px] h-full md:h-auto md:max-h-[95vh] flex flex-col overflow-hidden border border-gray-100">
            <div className="p-5 border-b flex justify-between items-center bg-white text-left shrink-0">
              <h3 className="font-black uppercase text-[15px] tracking-widest text-[#1e3a8a]">{eventoSelecionadoId ? 'Editar' : 'Novo'} Agendamento</h3>
              <button onClick={() => setIsAgendamentoOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X size={24}/>
              </button>
            </div>
            
            <form onSubmit={handleSalvarAgendamento} className="p-6 space-y-4 text-left overflow-y-auto flex-1 custom-scrollbar">
              
              {eventoSelecionadoId && (
                <Button type="button" onClick={() => navigate(`/sistema/pacientes/${form.paciente_id}`)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black h-12 rounded-xl flex items-center justify-center gap-2 uppercase text-[10px] shadow-md mb-2 transition-all">
                  <FileText size={18} /> Acessar Prontuário do Paciente
                </Button>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-gray-500 uppercase">Status</label>
                  <Select value={form.status} onValueChange={(v) => setForm({...form, status: v})}>
                    <SelectTrigger className="bg-blue-50 border-none font-bold text-blue-700 h-10"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[110]">
                      <SelectItem value="Agendado">Agendado</SelectItem>
                      <SelectItem value="Presença">Presença</SelectItem>
                      <SelectItem value="Falta">Falta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-gray-400 uppercase text-left">Pagamento</label>
                  <Select value={form.forma_pagamento} onValueChange={(v) => setForm({...form, forma_pagamento: v})}>
                    <SelectTrigger className="bg-emerald-50 border-none font-bold text-emerald-700 h-10 text-left"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[110]">
                      <SelectItem value="Pix">Pix</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Cartão">Cartão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-gray-400 uppercase text-left">Valor (R$)</label>
                  <Input type="text" value={form.valor_atendimento} onChange={e => setForm({...form, valor_atendimento: aplicarMascaraMoeda(e.target.value)})} className="bg-gray-50 border-none h-11 font-bold text-sm text-gray-700" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-gray-400 uppercase text-left">Duração</label>
                  <Select value={form.duracao} onValueChange={(v) => setForm({...form, duracao: v})}>
                    <SelectTrigger className="bg-gray-50 border-none h-11 text-sm font-bold text-gray-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[110]">
                      <SelectItem value="30">30 Min</SelectItem>
                      <SelectItem value="40">40 Min</SelectItem>
                      <SelectItem value="50">50 Min</SelectItem>
                      <SelectItem value="60">60 Min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-black text-gray-400 uppercase text-left">Paciente</label>
                <div className="relative">
                  <Input placeholder="Buscar..." className="bg-gray-50 border-none h-11 text-sm font-bold uppercase text-gray-700" value={buscaPaciente} onChange={(e) => setBuscaPaciente(e.target.value)} required />
                  {pacientesSugeridos.length > 0 && (
                    <div className="absolute z-[110] w-full bg-white border shadow-xl rounded-xl mt-1 overflow-hidden">
                      {pacientesSugeridos.map((p: any) => (
                        <button key={p.id} type="button" className="w-full text-left p-3 hover:bg-blue-50 border-b flex flex-col" onClick={() => { setForm({ ...form, paciente_nome: p.nome, paciente_id: p.id, telefone: aplicarMascaraTelefone(p.telefone || '') }); setBuscaPaciente(p.nome); setPacientesSugeridos([]); }}>
                          <span className="font-bold text-sm uppercase text-gray-700">{p.nome}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-gray-400 uppercase text-left">Sala</label>
                  <Select value={form.sala} onValueChange={(v) => setForm({...form, sala: v})}>
                    <SelectTrigger className="bg-gray-50 border-none h-11 text-sm font-bold text-gray-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[110]">
                      <SelectItem value="1">Sala 01</SelectItem>
                      <SelectItem value="2">Sala 02</SelectItem>
                      <SelectItem value="3">Sala 03</SelectItem>
                      <SelectItem value="4">Sala 04</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-gray-400 uppercase text-left">WhatsApp</label>
                  <Input value={form.telefone} onChange={e => setForm({...form, telefone: aplicarMascaraTelefone(e.target.value)})} className="bg-gray-50 border-none h-11 text-gray-700 font-bold" placeholder="(00) 9 0000-0000" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-black text-gray-400 uppercase text-left">Profissional Clínico</label>
                <Select value={form.profissional} onValueChange={(v) => setForm({...form, profissional: v})} required disabled={!isGestorSeguro}>
                  <SelectTrigger className="bg-gray-50 border-none h-11 font-bold text-sm text-gray-700"><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                  <SelectContent className="z-[110] text-left">
                    {isGestorSeguro ? equipe.map((p: any) => <SelectItem key={p.id} value={p.nome}>{p.nome}</SelectItem>) : <SelectItem value={nomeLogado}>{nomeLogado}</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-black text-gray-400 uppercase text-left">Horário/Data</label>
                <input type="datetime-local" required className="w-full bg-gray-50 rounded-md p-2.5 text-xs font-bold h-11 border-none outline-none text-gray-700" value={form.inicio} onChange={e => setForm({...form, inicio: e.target.value})} />
              </div>

              <div className="space-y-1 pt-1 text-left">
                <label className="text-[12px] font-black text-gray-400 uppercase flex justify-between">Assinatura Digital {form.assinatura_url && <span className="text-emerald-500 font-black">OK</span>}</label>
                <div className="border border-dashed border-gray-200 rounded-xl overflow-hidden bg-white min-h-[80px] flex items-center justify-center relative">
                  {form.assinatura_url ? (
                    <div className="group relative w-full h-full flex flex-col items-center justify-center bg-gray-50 p-2">
                      <img src={form.assinatura_url} alt="Assinatura" className="max-h-[60px] object-contain" />
                      <button type="button" onClick={() => setForm({ ...form, assinatura_url: null })} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 font-bold text-[9px] uppercase">Refazer</button>
                    </div>
                  ) : (
                    <SignatureCanvas ref={sigCanvas} penColor='black' canvasProps={{width: 400, height: 80, className: 'sigCanvas w-full h-full'}} />
                  )}
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2 shrink-0 pb-8">
                {form.telefone && (
                  <Button type="button" onClick={() => enviarWhatsApp(form.paciente_nome, form.telefone, form.profissional, form.inicio)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-11 rounded-xl flex items-center justify-center gap-2 uppercase text-[10px] shadow-md transition-all">
                    <MessageCircle size={16} /> Confirmar WhatsApp
                  </Button>
                )}
                {eventoSelecionadoId && (
                  <Button type="button" onClick={gerarComprovante} className="w-full bg-[#1e3a8a] hover:bg-black text-white font-black h-11 rounded-xl flex items-center justify-center gap-2 uppercase text-[10px] shadow-md transition-all">
                    <FileText size={16} /> Gerar Atestado
                  </Button>
                )}
                <div className="flex gap-2">
                  {eventoSelecionadoId && (
                    <Button type="button" variant="outline" onClick={handleExcluirAgendamento} className="px-5 border-red-200 text-red-500 hover:bg-red-50 h-12 rounded-2xl transition-all">
                      <Trash2 size={20} />
                    </Button>
                  )}
                  {meuPerfil?.permissao_agendar && (
                    <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-black text-white font-black h-12 rounded-2xl shadow-xl uppercase text-xs transition-all">
                      {loading ? <RefreshCw className="animate-spin" /> : 'Confirmar Agenda'}
                    </Button>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}