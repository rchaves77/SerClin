import SignatureCanvas from 'react-signature-canvas';
import { useRef, useState, useEffect } from 'react';
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

import 'react-big-calendar/lib/css/react-big-calendar.css';

const logoSer2 = "/logo_symbol.png";

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

// --- VISUAL SUPER CLEAN & LUXO PARA EVENTOS ---
const EventoCustomizado = ({ event }: any) => {
  const isPresenca = event.original?.status === 'Presenca' || event.original?.status === 'Presença';
  const isFalta = event.original?.status === 'Falta';
  
  return (
    <div className="h-full w-full flex items-center justify-start gap-1.5 px-2 py-0.5 overflow-hidden text-left rounded-lg transition-all">
      {isPresenca && (
        <CheckCircle size={13} className="text-white shrink-0 drop-shadow-sm" strokeWidth={2.5} />
      )}
      <div className="flex flex-col min-w-0 leading-tight">
        <span className={`text-white font-black text-[11px] uppercase tracking-wide truncate text-left ${isFalta ? 'line-through opacity-75' : ''}`}>
          {event.title}
        </span>
        {event.original?.profissional_nome && (
          <span className="text-[9px] font-medium text-white/80 truncate hidden sm:block">
            {event.original.profissional_nome}
          </span>
        )}
      </div>
    </div>
  );
};

interface DashboardProps {
  setView?: (v: string) => void;
}

export function Dashboard({ setView }: DashboardProps) {
  const { isAdmin, isSecretaria } = usePerfil();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [nomeLogado, setNomeLogado] = useState<string>(""); 
  const [isGestorSeguro, setIsGestorSeguro] = useState(false);
  const [meuPerfil, setMeuPerfil] = useState<any>(null);
  
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const [view, setCalendarView] = useState<View>(window.innerWidth < 768 ? Views.AGENDA : Views.WEEK);
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

  const navigate = (path: string) => {
    if (!setView) {
      window.location.href = path;
      return;
    }
    if (path === '/' || path === 'home') setView('home');
    else if (path === '/escola' || path === 'escola') setView('escola');
    else if (path.includes('paciente')) {
      if (path.startsWith('/sistema/pacientes/')) {
        window.location.href = path;
      } else {
        setView('pacientes');
      }
    }
    else if (path.includes('plano')) setView('planos');
    else if (path.includes('despesa')) setView('despesas');
    else if (path.includes('repasse')) setView('repasses');
    else if (path.includes('taxa')) setView('taxas');
    else if (path.includes('fechamento') || path.includes('caixa')) setView('fechamento');
    else if (path.includes('relatorio')) setView('relatorios');
    else if (path.includes('permissao') || path.includes('usuario') || path.includes('equipe')) setView('gestao-permissoes');
    else if (path.includes('encaminhamento') || path.includes('unimeta')) setView('encaminhamentos');
    else setView('acessos');
  };

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: todosPerfis } = await supabase.from('perfis').select('*').order('nome');
      
      let nomeParaFiltro = "";
      let ehGestorEfetivo = false;

      if (user && todosPerfis) {
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
              color: perfil?.cor || '#0a2d54',
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
      
      doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(10, 45, 84);
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
      toast.success("Agendamento removido!");
      setIsAgendamentoOpen(false); fetchData();
    } catch (err) { toast.error("Erro ao remover agendamento."); } finally { setLoading(false); }
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

      // 🌟 VALIDAÇÃO DE DIAS E HORÁRIOS DA CENTRAL DE CONFIGURAÇÃO
      const diasSemanaMap = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
      const diaDaSemanaDesejado = diasSemanaMap[dInicio.getDay()];

      const profissionalConfig = equipe.find(p => p.nome?.trim().toLowerCase() === form.profissional?.trim().toLowerCase());

      if (profissionalConfig) {
        let diasPermitidos: string[] = [];
        if (Array.isArray(profissionalConfig.dias_atendimento)) {
          diasPermitidos = profissionalConfig.dias_atendimento;
        } else if (typeof profissionalConfig.dias_atendimento === 'string') {
          try { diasPermitidos = JSON.parse(profissionalConfig.dias_atendimento); } 
          catch { diasPermitidos = profissionalConfig.dias_atendimento.split(','); }
        }

        if (diasPermitidos.length > 0 && !diasPermitidos.includes(diaDaSemanaDesejado)) {
          setLoading(false);
          return toast.error(`Este profissional não está configurado para atender na ${diaDaSemanaDesejado}.`, {
            description: "Ative este dia na tela de Configurações para liberar."
          });
        }

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

      let idDoPaciente = form.paciente_id;

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

      let assinaturaBase64 = form.assinatura_url;
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        assinaturaBase64 = sigCanvas.current.getCanvas().toDataURL('image/png');
      }

      const valorLimpo = parseFloat(
        form.valor_atendimento
          .toString()
          .replace(/\./g, "")
          .replace(",", ".")
      ) || 0;

      const salaNumero = parseInt(form.sala) || 1;

      const payload = {
        sala_id: salaNumero,
        profissional_nome: form.profissional,
        paciente_nome: buscaPaciente.toUpperCase(),
        paciente_id: idDoPaciente || null,
        paciente_telefone: form.telefone || "",
        data_inicio: dInicio.toISOString(),
        data_fim: dFim.toISOString(),
        status: mapearStatusParaBanco(form.status),
        assinatura_url: assinaturaBase64 || null,
        valor_atendimento: valorLimpo,
        forma_pagamento: form.forma_pagamento || "Pix"
      };

      const { error } = eventoSelecionadoId 
        ? await supabase.from('agendamentos').update(payload).eq('id', eventoSelecionadoId) 
        : await supabase.from('agendamentos').insert([payload]);

      if (error) {
        console.error("Erro detalhado do Supabase na tabela agendamentos:", error);
        throw new Error(`Erro no banco: ${error.message} (Código: ${error.code})`);
      }

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
         
      setIsAgendamentoOpen(false);
      setEventoSelecionadoId(null);
      fetchData();
      toast.success(eventoSelecionadoId ? "Agendamento atualizado!" : "Paciente agendado com sucesso!");

    } catch (err: any) {
      console.error("Erro SerClin Save:", err);
      
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

  // Filtro de Agendamentos de Amanhã
  const agendamentosAmanha = events
    .filter((e: any) => isSameDay(new Date(e.start), addDays(new Date(), 1)))
    .map((e: any) => e.original || e)
    .sort((a: any, b: any) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime());

  const minTime = new Date(2024, 0, 1, 7, 0, 0); 
  const maxTime = new Date(2024, 0, 1, 20, 0, 0);

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between selection:bg-[#0a2d54] selection:text-white">
      
      {/* CUSTOM CALENDAR STYLING */}
      <style>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-header {
          padding: 12px 6px !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          font-size: 11px !important;
          letter-spacing: 0.05em !important;
          color: #0a2d54 !important;
          border-bottom: 2px solid #f1f5f9 !important;
          background-color: #fafafa;
        }
        .rbc-today {
          background-color: #f0fdf4 !important;
        }
        .rbc-toolbar {
          padding: 16px 20px !important;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 0 !important;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
        }
        .rbc-toolbar-label {
          font-family: serif;
          font-weight: 900 !important;
          font-size: 1.125rem !important;
          text-transform: uppercase !important;
          color: #0a2d54 !important;
          letter-spacing: -0.02em !important;
        }
        .rbc-toolbar button {
          color: #0a2d54 !important;
          font-weight: 800 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          padding: 8px 16px !important;
          border-radius: 12px !important;
          border: 1px solid #e2e8f0 !important;
          background-color: #ffffff !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
        }
        .rbc-toolbar button:hover {
          background-color: #0a2d54 !important;
          color: #ffffff !important;
          border-color: #0a2d54 !important;
        }
        .rbc-toolbar button.rbc-active {
          background-color: #0a2d54 !important;
          color: #ffffff !important;
          border-color: #0a2d54 !important;
          box-shadow: 0 4px 12px rgba(10, 45, 84, 0.25) !important;
        }
        .rbc-event {
          border-radius: 10px !important;
          padding: 2px 4px !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1) !important;
          border: none !important;
        }
        .rbc-agenda-view table.rbc-agenda-table {
          border-collapse: separate !important;
          border-spacing: 0 8px !important;
          padding: 12px !important;
        }
        .rbc-agenda-view table.rbc-agenda-table tbody > tr {
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          border-radius: 16px;
        }
        .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
          padding: 12px 16px !important;
          color: #1e293b !important;
          font-weight: 800 !important;
          font-size: 13px !important;
          border: none !important;
        }
        .rbc-agenda-date-cell, .rbc-agenda-time-cell {
          color: #0a2d54 !important;
          font-weight: 900 !important;
        }
        .rbc-time-view {
          border: none !important;
        }
        .rbc-time-header {
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .rbc-timeslot-group {
          border-bottom: 1px solid #f8fafc !important;
        }
        .rbc-label {
          color: #94a3b8 !important;
          font-weight: 800 !important;
          font-size: 11px !important;
        }
      `}</style>

      {/* HEADER EXECUTIVO ULTRA PREMIUM */}
      <header className="bg-[#0a2d54] text-white border-b border-[#0a2d54]/30 shadow-xl sticky top-0 z-50">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand & Symbol */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/15">
              <img src={logoSer2} className="w-9 h-9 object-contain" alt="SerClin" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight font-serif uppercase text-white">SerClin</h1>
                <span className="bg-[#bfa571]/20 border border-[#bfa571]/40 text-[#dfca9e] text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono">
                  Gestão Integrada
                </span>
              </div>
              <p className="text-[10px] font-bold text-white/60 tracking-widest uppercase">
                Instituto de Neurodesenvolvimento
              </p>
            </div>
          </div>

          {/* Desktop Navigation Toolbar */}
          <div className="hidden lg:flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
            
            <button 
              onClick={() => navigate('/sistema/pacientes')}
              className="px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-blue-300" />
              <span>Pacientes</span>
            </button>

            {meuPerfil?.permissao_financeiro && (
              <>
                <button 
                  onClick={() => navigate('/sistema/planos')}
                  className="px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Planos</span>
                </button>

                <button 
                  onClick={() => navigate('/sistema/despesas')}
                  className="px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-red-400" />
                  <span>Despesas</span>
                </button>

                <button 
                  onClick={() => navigate('/sistema/repasses')}
                  className="px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <HandCoins className="w-3.5 h-3.5 text-blue-400" />
                  <span>Repasses</span>
                </button>

                <button 
                  onClick={() => navigate('/sistema/taxas')}
                  className="px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-400" />
                  <span>Taxas</span>
                </button>

                <button 
                  onClick={() => navigate('/sistema/fechamento')}
                  className="px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Caixa</span>
                </button>
              </>
            )}

            <button 
              onClick={() => navigate('/sistema/relatorios')}
              className="px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-amber-300" />
              <span>Relatórios</span>
            </button>

            {(isAdmin || isGestorSeguro) && (
              <button 
                onClick={() => navigate('/escola')}
                className="px-3 py-2 rounded-xl text-[#dfca9e] bg-[#bfa571]/20 hover:bg-[#bfa571]/30 border border-[#bfa571]/30 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <School className="w-3.5 h-3.5 text-[#dfca9e]" />
                <span>Painel Escola</span>
              </button>
            )}

            {(isAdmin || isGestorSeguro) && (
              <button 
                onClick={() => navigate('/sistema/permissoes')}
                className="px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-purple-300" />
                <span>Equipe</span>
              </button>
            )}

          </div>

          {/* Action Tools & User Status */}
          <div className="flex items-center gap-3">
            
            {/* Confirmar Amanhã / Segunda */}
            {meuPerfil?.permissao_confirmacao_amanha && (
              <button 
                onClick={() => setIsConfirmacaoAmanhaOpen(true)}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl h-10 px-3.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all relative"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">
                  {new Date().getDay() === 5 ? 'Confirmar Segunda' : 'Confirmar Amanhã'}
                </span>
                {agendamentosAmanha.length > 0 && (
                  <span className="bg-emerald-500 text-[#0a2d54] font-mono font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center ml-1 shadow-md">
                    {agendamentosAmanha.length}
                  </span>
                )}
              </button>
            )}

            {/* Agendar Button */}
            {meuPerfil?.permissao_agendar && (
              <Button 
                onClick={() => { setEventoSelecionadoId(null); setIsAgendamentoOpen(true); }}
                className="bg-[#bfa571] hover:bg-[#a68d5b] text-[#0a2d54] font-black rounded-xl h-10 px-5 text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg border-none cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Agendar</span>
              </Button>
            )}

            {/* User Profile Info */}
            <div className="hidden xl:flex flex-col text-right pl-2 border-l border-white/10">
              <span className="text-xs font-black text-white uppercase">{nomeLogado?.split(' ')[0]}</span>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">Online</span>
              </div>
            </div>

            {/* Exit Button */}
            <Button 
              variant="ghost" 
              onClick={async () => {
                try { await supabase.auth.signOut(); } catch (e) {}
                finally { window.location.href = "https://institutoserclin.vercel.app"; }
              }}
              className="text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl h-10 w-10 p-0 cursor-pointer"
              title="Sair do Sistema"
            >
              <LogOut className="w-4 h-4" />
            </Button>

            {/* Mobile Drawer Trigger */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuMobileOpen(true)} 
              className="lg:hidden text-white hover:bg-white/10 h-10 w-10 p-0"
            >
              <Menu className="w-6 h-6" />
            </Button>

          </div>
        </div>
      </header>

      {/* PAINEL CENTRAL MULTI-TENANT COM CALENDÁRIO */}
      <main className="max-w-[1700px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left flex-1 flex flex-col">
        
        {/* BARRA SUPERIOR DE FILTRO POR PROFISSIONAL */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0a2d54]/5 text-[#0a2d54] flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5 text-[#0a2d54]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#0a2d54] uppercase tracking-tight font-serif">
                Agenda de Atendimentos Clínicos
              </h2>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Instituto SerClin • Gestão de Salas e Prontuários
              </p>
            </div>
          </div>

          {isGestorSeguro && (
            <div className="w-full sm:w-auto min-w-[280px]">
              <Select value={filtroProfissional} onValueChange={setFiltroProfissional}>
                <SelectTrigger className="bg-slate-50 border-slate-200 text-[#0a2d54] font-black h-11 text-xs rounded-2xl px-4 shadow-sm w-full">
                  <div className="flex items-center gap-2 uppercase tracking-wider">
                    <Filter className="w-4 h-4 text-[#bfa571]" />
                    <SelectValue placeholder="Filtrar por Profissional" />
                  </div>
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="geral" className="font-black uppercase text-xs text-[#0a2d54]">
                    Visão Geral (Todos os Profissionais)
                  </SelectItem>
                  {equipe.map((p: any) => (
                    <SelectItem key={p.id} value={p.nome} className="font-bold uppercase text-xs text-slate-700">
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* CONTAINER DO CALENDÁRIO COM SHADOW E DESIGN EXECUTIVO */}
        <Card className="flex-1 border-slate-200 shadow-sm bg-white rounded-[2.5rem] overflow-hidden flex flex-col p-2">
          <CardContent className="p-0 flex-1 min-h-[600px]">
            <Calendar 
              style={{ height: '100%', minHeight: '68vh' }}
              localizer={localizer} 
              culture='pt-BR' 
              messages={mensagensPortugues}
              events={filtroProfissional === "geral" ? events : events.filter((e: any) => e.original?.profissional_nome === filtroProfissional)} 
              view={view} 
              onView={setCalendarView} 
              date={date} 
              onNavigate={setDate} 
              views={['day', 'week', 'month', 'agenda']} 
              min={minTime} 
              max={maxTime} 
              components={{ event: EventoCustomizado }} 
              eventPropGetter={(event: any) => ({ 
                style: { 
                  backgroundColor: event.color || '#0a2d54', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '10px', 
                  opacity: event.original?.status === 'Falta' ? 0.5 : 1 
                } 
              })}
              onSelectEvent={(e) => { 
                const evt = e.original; 
                setEventoSelecionadoId(evt.id); 
                setBuscaPaciente(evt.paciente_nome); 
                setForm({ 
                  ...form, 
                  profissional: evt.profissional_nome, 
                  paciente_nome: evt.paciente_nome, 
                  paciente_id: evt.paciente_id, 
                  telefone: aplicarMascaraTelefone(evt.paciente_telefone || ''), 
                  sala: evt.sala_id?.toString() || '1', 
                  inicio: format(new Date(evt.data_inicio), "yyyy-MM-dd'T'HH:mm"), 
                  status: evt.status === 'Presenca' ? 'Presença' : (evt.status || 'Agendado'), 
                  duracao: evt.original?.duracao || '40', 
                  assinatura_url: evt.assinatura_url || null, 
                  valor_atendimento: aplicarMascaraMoeda(evt.valor_atendimento?.toString() || "0"), 
                  forma_pagamento: evt.forma_pagamento || "Pix" 
                }); 
                setIsAgendamentoOpen(true); 
              }} 
            />
          </CardContent>
        </Card>

        {/* FAB MOBILE PARA AGENDAR */}
        {meuPerfil?.permissao_agendar && (
          <button 
            onClick={() => { 
              setEventoSelecionadoId(null); 
              setBuscaPaciente(""); 
              setForm({ 
                ...form, 
                profissional: isGestorSeguro ? '' : nomeLogado, 
                paciente_id: null, 
                status: 'Agendado', 
                duracao: '40', 
                assinatura_url: null, 
                inicio: format(new Date(), "yyyy-MM-dd'T'HH:mm"), 
                telefone: "", 
                valor_atendimento: "0,00", 
                forma_pagamento: "Pix" 
              }); 
              setIsAgendamentoOpen(true); 
            }} 
            className="md:hidden fixed bottom-6 right-6 z-[45] bg-[#0a2d54] text-white rounded-full h-14 px-6 flex items-center justify-center shadow-2xl active:scale-95 transition-transform border border-white/20"
          >
            <Plus className="w-5 h-5 mr-2 stroke-[3]" />
            <span className="font-black text-xs uppercase tracking-wider">Agendar</span>
          </button>
        )}
      </main>

      {/* DRAWER MOBILE EXECUTIVO */}
      {isMenuMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-black/60 flex justify-end backdrop-blur-sm" onClick={() => setIsMenuMobileOpen(false)}>
          <div className="w-[85%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col pt-6 animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center px-6 pb-6 border-b border-slate-100">
              <div>
                <span className="font-black text-[#0a2d54] uppercase text-lg font-serif block">Menu SerClin</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{nomeLogado || 'Colaborador'}</span>
              </div>
              <button onClick={() => setIsMenuMobileOpen(false)} className="text-slate-400 hover:text-red-500"><X className="w-6 h-6"/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-left">
              
              <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl font-black uppercase text-xs text-[#0a2d54]" onClick={() => { navigate('/sistema/pacientes'); setIsMenuMobileOpen(false); }}>
                <Users className="w-5 h-5 text-blue-600"/> Pacientes &amp; Prontuários
              </Button>

              {meuPerfil?.permissao_financeiro && (
                <>
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl font-black uppercase text-xs text-emerald-700" onClick={() => { navigate('/sistema/planos'); setIsMenuMobileOpen(false); }}>
                    <Wallet className="w-5 h-5 text-emerald-600"/> Planos de Cuidado
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl font-black uppercase text-xs text-red-600" onClick={() => { navigate('/sistema/despesas'); setIsMenuMobileOpen(false); }}>
                    <Receipt className="w-5 h-5 text-red-500"/> Gestão de Despesas
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl font-black uppercase text-xs text-blue-600" onClick={() => { navigate('/sistema/repasses'); setIsMenuMobileOpen(false); }}>
                    <HandCoins className="w-5 h-5 text-blue-600"/> Repasses Clínicos
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl font-black uppercase text-xs text-amber-600" onClick={() => { navigate('/sistema/taxas'); setIsMenuMobileOpen(false); }}>
                    <Calculator className="w-5 h-5 text-amber-500"/> Simulação de Taxas
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl font-black uppercase text-xs text-indigo-600" onClick={() => { navigate('/sistema/fechamento'); setIsMenuMobileOpen(false); }}>
                    <Scale className="w-5 h-5 text-indigo-600"/> Fechamento de Caixa
                  </Button>
                </>
              )}

              <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl font-black uppercase text-xs text-amber-700" onClick={() => { navigate('/sistema/relatorios'); setIsMenuMobileOpen(false); }}>
                <Search className="w-5 h-5 text-amber-600"/> Relatórios Gerenciais
              </Button>

              {(isAdmin || isGestorSeguro) && (
                <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl font-black uppercase text-xs text-[#0a2d54] bg-[#bfa571]/10" onClick={() => { navigate('/escola'); setIsMenuMobileOpen(false); }}>
                  <School className="w-5 h-5 text-[#bfa571]"/> Painel Escola (Inclusão)
                </Button>
              )}

              {(isAdmin || isGestorSeguro) && (
                <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl font-black uppercase text-xs text-purple-700" onClick={() => { navigate('/sistema/permissoes'); setIsMenuMobileOpen(false); }}>
                  <User className="w-5 h-5 text-purple-600"/> Gestão da Equipe
                </Button>
              )}

              <div className="pt-6 border-t border-slate-100 mt-6">
                <Button
                  onClick={async () => {
                    try { await supabase.auth.signOut(); } catch (e) {}
                    finally { window.location.href = "https://institutoserclin.vercel.app"; }
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 border-none font-black uppercase text-xs h-12 rounded-2xl flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sair da Conta
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÕES DE AMANHÃ */}
      {isConfirmacaoAmanhaOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[650px] border border-slate-200 overflow-hidden text-left">
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#bfa571] uppercase tracking-widest block">
                  Automação WhatsApp
                </span>
                <h3 className="font-black uppercase text-xl font-serif text-[#0a2d54]">
                  Lista de Confirmação de Consultas
                </h3>
                <p className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1.5 mt-1">
                  <CalendarIcon className="w-3.5 h-3.5"/> {format(addDays(new Date(), 1), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
              <button onClick={() => setIsConfirmacaoAmanhaOpen(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-6 h-6"/>
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto bg-slate-50/50 space-y-3">
              {agendamentosAmanha.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-slate-400 font-bold uppercase text-xs">Nenhum agendamento pendente para amanhã.</p>
                </div>
              ) : (
                agendamentosAmanha.map((ag: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-3xl border border-slate-200 shadow-sm gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-20 bg-[#0a2d54]/5 rounded-2xl flex items-center justify-center border border-[#0a2d54]/10 shrink-0">
                        <span className="font-black text-[#0a2d54] font-mono text-sm">{format(new Date(ag.data_inicio), "HH:mm")}</span>
                      </div>
                      <div>
                        <span className="font-black text-sm uppercase text-[#0a2d54] block font-serif">{ag.paciente_nome}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Prof: {ag.profissional_nome}</span>
                          <span className="text-[10px] font-bold text-blue-600 uppercase font-mono">Sala 0{ag.sala_id}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => enviarWhatsApp(ag.paciente_nome, ag.paciente_telefone, ag.profissional_nome, ag.data_inicio)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-11 px-5 flex items-center justify-center gap-2 shadow-md transition-all border-none cursor-pointer">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-black uppercase text-xs">Confirmar WhatsApp</span>
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
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setIsAgendamentoOpen(false)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[480px] max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 text-left">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#bfa571] uppercase tracking-widest block">
                  Recepção &amp; Consultórios
                </span>
                <h3 className="font-black uppercase text-lg font-serif text-[#0a2d54]">
                  {eventoSelecionadoId ? 'Editar Agendamento' : 'Novo Agendamento Clínico'}
                </h3>
              </div>
              <button onClick={() => setIsAgendamentoOpen(false)} className="text-slate-400 hover:text-red-500 p-1">
                <X className="w-6 h-6"/>
              </button>
            </div>
            
            <form onSubmit={handleSalvarAgendamento} className="p-6 space-y-4 overflow-y-auto flex-1 no-scrollbar">
              
              {eventoSelecionadoId && (
                <Button type="button" onClick={() => navigate(`/sistema/pacientes/${form.paciente_id}`)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black h-11 rounded-2xl flex items-center justify-center gap-2 uppercase text-xs shadow-sm mb-2 transition-all border-none cursor-pointer">
                  <FileText className="w-4 h-4" /> Acessar Prontuário Clínico
                </Button>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Status do Atendimento</label>
                  <Select value={form.status} onValueChange={(v) => setForm({...form, status: v})}>
                    <SelectTrigger className="bg-slate-50 border-slate-200 font-bold text-[#0a2d54] h-11 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[110]">
                      <SelectItem value="Agendado">Agendado</SelectItem>
                      <SelectItem value="Presença">Presença (Confirmada)</SelectItem>
                      <SelectItem value="Falta">Falta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Forma de Pagamento</label>
                  <Select value={form.forma_pagamento} onValueChange={(v) => setForm({...form, forma_pagamento: v})}>
                    <SelectTrigger className="bg-slate-50 border-slate-200 font-bold text-emerald-700 h-11 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[110]">
                      <SelectItem value="Pix">Pix</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Cartão">Cartão de Crédito/Débito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Valor Sessão (R$)</label>
                  <Input type="text" value={form.valor_atendimento} onChange={e => setForm({...form, valor_atendimento: aplicarMascaraMoeda(e.target.value)})} className="bg-slate-50 border-slate-200 h-11 font-bold text-xs text-slate-800 rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Duração Estipulada</label>
                  <Select value={form.duracao} onValueChange={(v) => setForm({...form, duracao: v})}>
                    <SelectTrigger className="bg-slate-50 border-slate-200 h-11 text-xs font-bold text-slate-800 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[110]">
                      <SelectItem value="30">30 Minutos</SelectItem>
                      <SelectItem value="40">40 Minutos</SelectItem>
                      <SelectItem value="50">50 Minutos</SelectItem>
                      <SelectItem value="60">60 Minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Nome do Paciente</label>
                <div className="relative">
                  <Input placeholder="Digite o nome do paciente..." className="bg-slate-50 border-slate-200 h-11 text-xs font-bold uppercase text-slate-800 rounded-xl" value={buscaPaciente} onChange={(e) => setBuscaPaciente(e.target.value)} required />
                  {pacientesSugeridos.length > 0 && (
                    <div className="absolute z-[110] w-full bg-white border border-slate-200 shadow-xl rounded-2xl mt-1 overflow-hidden">
                      {pacientesSugeridos.map((p: any) => (
                        <button key={p.id} type="button" className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 flex flex-col transition-colors cursor-pointer" onClick={() => { setForm({ ...form, paciente_nome: p.nome, paciente_id: p.id, telefone: aplicarMascaraTelefone(p.telefone || '') }); setBuscaPaciente(p.nome); setPacientesSugeridos([]); }}>
                          <span className="font-black text-xs uppercase text-[#0a2d54]">{p.nome}</span>
                          <span className="text-[10px] font-mono text-slate-400">{p.telefone || 'Sem telefone'}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Sala de Atendimento</label>
                  <Select value={form.sala} onValueChange={(v) => setForm({...form, sala: v})}>
                    <SelectTrigger className="bg-slate-50 border-slate-200 h-11 text-xs font-bold text-slate-800 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[110]">
                      <SelectItem value="1">Sala 01</SelectItem>
                      <SelectItem value="2">Sala 02</SelectItem>
                      <SelectItem value="3">Sala 03</SelectItem>
                      <SelectItem value="4">Sala 04</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">WhatsApp (Contato)</label>
                  <Input value={form.telefone} onChange={e => setForm({...form, telefone: aplicarMascaraTelefone(e.target.value)})} className="bg-slate-50 border-slate-200 h-11 text-slate-800 font-bold text-xs rounded-xl" placeholder="(68) 9 9999-9999" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Profissional Clínico</label>
                <Select value={form.profissional} onValueChange={(v) => setForm({...form, profissional: v})} disabled={!isGestorSeguro}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 h-11 font-bold text-xs text-slate-800 rounded-xl"><SelectValue placeholder="Selecione o profissional..." /></SelectTrigger>
                  <SelectContent className="z-[110]">
                    {isGestorSeguro ? equipe.map((p: any) => <SelectItem key={p.id} value={p.nome}>{p.nome}</SelectItem>) : <SelectItem value={nomeLogado}>{nomeLogado}</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Data &amp; Horário do Agendamento</label>
                <input type="datetime-local" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold h-11 text-slate-800 outline-none" value={form.inicio} onChange={e => setForm({...form, inicio: e.target.value})} />
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase flex justify-between">Assinatura Digital {form.assinatura_url && <span className="text-emerald-600 font-black">✓ Capturada</span>}</label>
                <div className="border border-dashed border-slate-300 rounded-2xl overflow-hidden bg-slate-50 min-h-[90px] flex items-center justify-center relative">
                  {form.assinatura_url ? (
                    <div className="group relative w-full h-full flex flex-col items-center justify-center bg-slate-100 p-2">
                      <img src={form.assinatura_url} alt="Assinatura" className="max-h-[60px] object-contain" />
                      <button type="button" onClick={() => setForm({ ...form, assinatura_url: null })} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 font-bold text-[10px] uppercase">Refazer Assinatura</button>
                    </div>
                  ) : (
                    <SignatureCanvas ref={sigCanvas} penColor='black' canvasProps={{width: 420, height: 90, className: 'sigCanvas w-full h-full'}} />
                  )}
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2 shrink-0 pb-4">
                {form.telefone && (
                  <Button type="button" onClick={() => enviarWhatsApp(form.paciente_nome, form.telefone, form.profissional, form.inicio)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-11 rounded-2xl flex items-center justify-center gap-2 uppercase text-xs transition-all border-none cursor-pointer">
                    <MessageCircle className="w-4 h-4" /> Confirmar via WhatsApp
                  </Button>
                )}

                {eventoSelecionadoId && (
                  <Button type="button" onClick={gerarComprovante} className="w-full bg-[#0a2d54] hover:bg-black text-white font-black h-11 rounded-2xl flex items-center justify-center gap-2 uppercase text-xs transition-all border-none cursor-pointer">
                    <FileText className="w-4 h-4" /> Gerar Atestado de Comparecimento
                  </Button>
                )}

                <div className="flex gap-2">
                  {eventoSelecionadoId && (
                    <Button type="button" variant="outline" onClick={handleExcluirAgendamento} className="px-5 border-red-200 text-red-600 hover:bg-red-50 h-12 rounded-2xl transition-all cursor-pointer">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                  {meuPerfil?.permissao_agendar && (
                    <Button type="submit" disabled={loading} className="flex-1 bg-[#0a2d54] hover:bg-[#bfa571] text-white hover:text-[#0a2d54] font-black h-12 rounded-2xl uppercase text-xs transition-all shadow-lg border-none cursor-pointer">
                      {loading ? <RefreshCw className="animate-spin"/> : 'Salvar Agendamento'}
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
