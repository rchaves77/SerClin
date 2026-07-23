import React, { useState, useEffect } from 'react';
import { 
  LogOut, GraduationCap, Users, AlertTriangle, FileText, Plus, X, 
  CheckCircle, RefreshCw, Search, Shield, Building, LayoutGrid, AlertCircle,
  TrendingUp, Sparkles, Download, Filter, Clock, BrainCircuit, CheckCircle2,
  ArrowUpRight, FileCheck, Eye, Send, SlidersHorizontal, ChevronRight, Award,
  ShieldCheck, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import SerclinLogo from './SerclinLogo';

// --- IMPORTS RECHARTS ---
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  PieChart, Pie, AreaChart, Area
} from 'recharts';

interface DashboardEscolaProps {
  setView?: (view: string) => void;
}

export function DashboardEscola({ setView }: DashboardEscolaProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'termometro' | 'pdis' | 'alertas'>('overview');
  
  // Modais
  const [isPdiModalOpen, setIsPdiModalOpen] = useState(false);
  const [isGuidelineModalOpen, setIsGuidelineModalOpen] = useState(false);
  const [isAlertaModalOpen, setIsAlertaModalOpen] = useState(false);

  // Estados dos Dados
  const [escolaInfo, setEscolaInfo] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [guidelineSelecionada, setGuidelineSelecionada] = useState<any>(null);
  const [buscaAluno, setBuscaAluno] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("TODOS");

  // Gráficos
  const [dadosGraficoSinais, setDadosGraficoSinais] = useState<any[]>([]);
  const [turmasRisco, setTurmasRisco] = useState<any[]>([]);

  // Forms
  const [pdiForm, setPdiForm] = useState({ aluno_id: "", file: null as File | null, observacoes: "" });
  const [alertaForm, setAlertaForm] = useState({
    aluno_id: "",
    turma: "3º ANO A",
    sinal_desatencao: false,
    sinal_hiperatividade: false,
    sinal_dificuldade_leitura: false,
    sinal_isolamento_social: false,
    observacao: ""
  });

  const CORES_GRAFICO = ['#0a2d54', '#bfa571', '#059669', '#d97706', '#7c3aed'];

  // Safe navigation handler
  const navigateTo = (path: string) => {
    if (!setView) {
      window.location.href = path;
      return;
    }
    if (path === '/' || path === '/sistema') setView('home');
    else if (path === '/escola/alerta') setIsAlertaModalOpen(true);
    else setView('home');
  };

  const fetchEscolaDados = async () => {
    setLoading(true);
    try {
      let escolaId = "22222222-2222-2222-2222-222222222222";
      let userEmail = "gestor@escola.com";

      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          userEmail = user.email || userEmail;
          const { data: perfil } = await supabase.from('perfis').select('escola_id').eq('email', user.email).maybeSingle();
          if (perfil?.escola_id) escolaId = perfil.escola_id;
        }

        const { data: escola } = await supabase.from('schools').select('*').eq('id', escolaId).maybeSingle();
        if (escola) setEscolaInfo(escola);

        const { data: listaAlunos } = await supabase.from('school_students').select('*').eq('school_id', escolaId).order('name');
        if (listaAlunos && listaAlunos.length > 0) {
          setAlunos(listaAlunos);
        } else {
          setAlunos(getMockAlunos());
        }

        const { data: listaAlertas } = await supabase.from('neuro_alerts').select('*, school_students(name, grade)').eq('school_id', escolaId).order('created_at', { ascending: false });
        if (listaAlertas && listaAlertas.length > 0) {
          setAlertas(listaAlertas);
        } else {
          setAlertas(getMockAlertas());
        }
      } else {
        setAlunos(getMockAlunos());
        setAlertas(getMockAlertas());
      }

      if (!escolaInfo) {
        setEscolaInfo({
          id: escolaId,
          name: "Colégio Anchieta - Unidade Central",
          pdi_used: 7,
          pdi_limit: 10,
          selo_status: "Ativo",
          selo_expiracao: "31/12/2026",
          codigo_verificacao: "NEURO-ANCHIETA-2026"
        });
      }

      compilarEstatisticas();
    } catch (err) {
      console.warn("Utilizando ecossistema de demonstração:", err);
      setAlunos(getMockAlunos());
      setAlertas(getMockAlertas());
      setEscolaInfo({
        id: "22222222-2222-2222-2222-222222222222",
        name: "Colégio Anchieta - Unidade Central",
        pdi_used: 7,
        pdi_limit: 10,
        selo_status: "Ativo",
        selo_expiracao: "31/12/2026",
        codigo_verificacao: "NEURO-ANCHIETA-2026"
      });
      compilarEstatisticas();
    } finally {
      setLoading(false);
    }
  };

  const compilarEstatisticas = () => {
    setDadosGraficoSinais([
      { name: 'Desatenção', quantidade: 14, percentual: '38%' },
      { name: 'Hiperatividade', quantidade: 9, percentual: '24%' },
      { name: 'Dificuldade Leitura', quantidade: 8, percentual: '21%' },
      { name: 'Isolamento Social', quantidade: 4, percentual: '11%' },
      { name: 'Proc. Auditivo', quantidade: 2, percentual: '6%' },
    ]);

    setTurmasRisco([
      { turma: '3º ANO A - FUNDAMENTAL I', alertas: 6, criticidade: 'Alta', pdisAtivos: 3 },
      { turma: '5º ANO B - FUNDAMENTAL I', alertas: 4, criticidade: 'Média', pdisAtivos: 2 },
      { turma: '1º ANO A - ENSINO MÉDIO', alertas: 2, criticidade: 'Baixa', pdisAtivos: 1 },
      { turma: '2º ANO C - FUNDAMENTAL I', alertas: 1, criticidade: 'Baixa', pdisAtivos: 1 },
    ]);
  };

  useEffect(() => {
    fetchEscolaDados();
  }, []);

  const getMockAlunos = () => [
    { id: "1", name: "Bernardo Silva Santos", grade: "3º ANO A - FUNDAMENTAL I", status: "Crítico", pdi_status: "Ativo", tags: ["TDAH", "Desatenção"], observacoes: "Necessita de tempo estendido em avaliações." },
    { id: "2", name: "Camila Rodrigues Lima", grade: "5º ANO B - FUNDAMENTAL I", status: "Alerta", pdi_status: "Em Análise", tags: ["Dificuldade Leitura", "Dislexia"], observacoes: "Acompanhamento fonoaudiológico recomendado." },
    { id: "3", name: "Lucas Mendes de Oliveira", grade: "1º ANO A - ENSINO MÉDIO", status: "Alerta", pdi_status: "Sem PDI", tags: ["Isolamento Social", "Regulação"], observacoes: "Orientação e suporte psicopedagógico em curso." },
    { id: "4", name: "Mariana Costa e Silva", grade: "3º ANO A - FUNDAMENTAL I", status: "Crítico", pdi_status: "Ativo", tags: ["TEA Nível 1", "Sensorial"], observacoes: "Uso de abafador de ruídos liberado em ambiente escolar." },
    { id: "5", name: "Gabriel Souza Pereira", grade: "2º ANO C - FUNDAMENTAL I", status: "Regular", pdi_status: "Ativo", tags: ["Hiperatividade"], observacoes: "Evolução positiva com diretrizes de sala de aula." },
    { id: "6", name: "Beatriz Nogueira Faria", grade: "4º ANO A - FUNDAMENTAL I", status: "Regular", pdi_status: "Sem PDI", tags: ["Acompanhamento Preventivo"], observacoes: "Monitoramento de rotina pedagógica." },
  ];

  const getMockAlertas = () => [
    { id: "a1", student_name: "Bernardo Silva Santos", grade: "3º ANO A", created_at: "2026-07-20T10:30:00", tipo: "Desatenção Severa", status: "Tratado", professor: "Prof. Roberto Mendes" },
    { id: "a2", student_name: "Mariana Costa e Silva", grade: "3º ANO A", created_at: "2026-07-21T14:15:00", tipo: "Sobrecarga Sensorial", status: "Pendente", professor: "Profª. Ana Carla" },
    { id: "a3", student_name: "Camila Rodrigues Lima", grade: "5º ANO B", created_at: "2026-07-22T08:45:00", tipo: "Bloqueio na Leitura", status: "Pendente", professor: "Prof. Marcos Vinícius" },
  ];

  const handleSubmeterPdi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdiForm.aluno_id) return toast.error("Selecione o aluno para submissão.");

    const atingiuLimite = (escolaInfo?.pdi_used || 0) >= (escolaInfo?.pdi_limit || 10);
    if (atingiuLimite) {
      const prosseguir = confirm(`⚠️ Sua franquia contratada (${escolaInfo?.pdi_limit} PDIs) foi atingida. A submissão deste novo plano gerará uma cobrança excedente de R$ 180,00 na próxima fatura. Deseja prosseguir?`);
      if (!prosseguir) return;
    }

    setLoading(true);
    try {
      if (supabase) {
        await supabase.from('pdi_audits').insert([{
          school_id: escolaInfo?.id || "22222222-2222-2222-2222-222222222222",
          student_id: pdiForm.aluno_id,
          file_url: "storage/pdis/documento_pdi_audit.pdf",
          status: 'Em Auditoria'
        }]);
      }

      setEscolaInfo((prev: any) => ({ ...prev, pdi_used: (prev?.pdi_used || 0) + 1 }));
      toast.success("Plano de Desenvolvimento Individual (PDI) submetido à Banca Multidisciplinar SerClin!");
      setIsPdiModalOpen(false);
      setPdiForm({ aluno_id: "", file: null, observacoes: "" });
    } catch (err) {
      toast.error("Erro ao submeter PDI. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmeterAlerta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertaForm.aluno_id) return toast.error("Selecione o aluno do alerta.");

    const alunoObj = alunos.find(a => a.id === alertaForm.aluno_id);
    const novoAlerta = {
      id: "a_" + Date.now(),
      student_name: alunoObj?.name || "Aluno Sinalizado",
      grade: alunoObj?.grade || alertaForm.turma,
      created_at: new Date().toISOString(),
      tipo: alertaForm.sinal_desatencao ? "Desatenção" : alertaForm.sinal_hiperatividade ? "Hiperatividade" : "Sinalização Pedagógica",
      status: "Pendente",
      professor: "Coordenação Pedagógica"
    };

    setAlertas([novoAlerta, ...alertas]);
    toast.success("Alerta Clínico-Pedagógico registrado! A equipe multidisciplinar foi notificada.");
    setIsAlertaModalOpen(false);
    setAlertaForm({
      aluno_id: "",
      turma: "3º ANO A",
      sinal_desatencao: false,
      sinal_hiperatividade: false,
      sinal_dificuldade_leitura: false,
      sinal_isolamento_social: false,
      observacao: ""
    });
  };

  const abrirDiretrizesManejo = async (aluno: any) => {
    setGuidelineSelecionada({
      student_name: aluno.name,
      grade: aluno.grade,
      data_emissao: "20/07/2026",
      laudo_resumo: "Acompanhamento Neuropsicológico e Psicopedagógico - Perfil com Atenção Sustentada Reduzida e Alta Sensibilidade Sensorial.",
      actions_pact: `1. POSICIONAMENTO EM SALA DE AULA:
- Acomodar o estudante nas primeiras fileiras, distante de janelas e portas.
- Garantir canal direto de contato visual durante explicações essenciais.

2. AVALIAÇÕES E PROVAS:
- Conceder tempo adicional de 20 minutos por avaliação.
- Aplicar provas em ambiente com reduzido estímulo sonoro quando necessário.
- Permitir leitura pausada das questões pelo leitor/ledor pedagógico.

3. MANEJO SENSORIAL E COMPORTAMENTAL:
- Liberar 'pausa regulatória' de 3 minutos fora da sala em momentos de fadiga cognitiva.
- Aceitar o uso de abafador de ruídos em atividades coletivas ruidosas.`,
      responsavel_clinico: "Dra. Laura Mendes - Neuropsicóloga (CRP 06/142090)",
      escola_homologada: true
    });
    setIsGuidelineModalOpen(true);
  };

  const alunosFiltrados = alunos.filter(a => {
    const matchBusca = a.name.toLowerCase().includes(buscaAluno.toLowerCase()) || a.grade.toLowerCase().includes(buscaAluno.toLowerCase());
    if (filtroStatus === "TODOS") return matchBusca;
    if (filtroStatus === "CRITICO") return matchBusca && a.status === "Crítico";
    if (filtroStatus === "ALERTA") return matchBusca && a.status === "Alerta";
    if (filtroStatus === "PDI") return matchBusca && a.pdi_status === "Ativo";
    return matchBusca;
  });

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between selection:bg-[#0a2d54] selection:text-white">
      
      {/* HEADER EXECUTIVO ULTRA PREMIUM */}
      <header className="bg-[#0a2d54] text-white border-b border-[#0a2d54]/30 shadow-xl sticky top-0 z-50">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Status */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/15">
              <SerclinLogo variant="symbol" className="w-9 h-9" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight font-serif uppercase">SerClin</h1>
                <span className="bg-[#bfa571]/20 border border-[#bfa571]/40 text-[#dfca9e] text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono">
                  Executive Suite
                </span>
              </div>
              <p className="text-[10px] font-bold text-white/60 tracking-widest uppercase">
                Hub Neuroeducacional & Gestão Inclusiva
              </p>
            </div>
          </div>

          {/* Institutional Indicators */}
          <div className="hidden lg:flex items-center gap-6 bg-white/5 border border-white/10 px-5 py-2 rounded-2xl backdrop-blur-md text-left">
            <div className="border-r border-white/10 pr-5">
              <span className="text-[9px] font-mono text-white/40 uppercase block font-bold">Instituição Homologada</span>
              <span className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#bfa571]" />
                {escolaInfo?.name || 'Colégio Anchieta'}
              </span>
            </div>

            <div className="border-r border-white/10 pr-5">
              <span className="text-[9px] font-mono text-white/40 uppercase block font-bold">Franquia de PDIs</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-20 bg-white/10 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#bfa571] to-emerald-400 h-full rounded-full" 
                    style={{ width: `${Math.min(100, ((escolaInfo?.pdi_used || 7) / (escolaInfo?.pdi_limit || 10)) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-black text-[#dfca9e] font-mono">
                  {escolaInfo?.pdi_used || 7} / {escolaInfo?.pdi_limit || 10}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[9px] font-mono text-white/40 uppercase block font-bold">Selo de Proteção</span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Ativo 2026
              </span>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setIsAlertaModalOpen(true)} 
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl h-10 px-4 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Novo Alerta</span>
            </Button>

            <Button 
              onClick={() => setIsPdiModalOpen(true)} 
              className="bg-[#bfa571] hover:bg-[#a68d5b] text-[#0a2d54] font-black rounded-xl h-10 px-4 text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg border-none cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Auditar PDI</span>
            </Button>

            <Button 
              onClick={() => navigateTo('/sistema')} 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl h-10 px-3 text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
              title="Acessar Sistema Clínico Geral"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => navigateTo('/')} 
              className="text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl h-10 w-10 p-0"
              title="Sair do Painel Escolar"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* HERO DASHBOARD SUMMARY BANNER */}
      <section className="bg-gradient-to-r from-[#0a2d54] via-[#0d3b6e] to-[#0a2d54] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#0a2d54]/20 shadow-inner relative overflow-hidden">
        {/* Subtle watermark background decorative text */}
        <div className="absolute top-1/2 -right-10 -translate-y-1/2 text-[14rem] font-black text-white/[0.02] font-serif select-none pointer-events-none">
          SERCLIN
        </div>

        <div className="max-w-[1700px] mx-auto text-left relative z-10 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#bfa571]/20 border border-[#bfa571]/30 px-3 py-1 rounded-full text-[#dfca9e] text-[10px] font-black uppercase tracking-widest font-mono">
                <Sparkles className="w-3 h-3 fill-[#dfca9e]" /> Painel de Inteligência Neuroeducacional
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-serif italic">
                Ecossistema Inclusivo <span className="font-light text-slate-300 not-italic font-sans lowercase">&amp; Gestão de PDIs</span>
              </h2>
              <p className="text-xs md:text-sm font-light text-white/70 max-w-2xl leading-relaxed">
                Monitoramento contínuo de sinais neurocognitivos, auditoria técnica de Planos de Desenvolvimento Individual e suporte direto da Banca Multidisciplinar SerClin.
              </p>
            </div>

            {/* Quick Export Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toast.success("Relatório de Conformidade Pedagógica e PDIs exportado em PDF com sucesso!")}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4 text-[#dfca9e]" /> Exportar Dossiê Institucional (PDF)
              </button>
            </div>
          </div>

          {/* Executive KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* KPI 1 */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider">Estudantes Mapeados</span>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black font-serif text-white">{alunos.length}</span>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% no ano
                </span>
              </div>
              <p className="text-[10px] font-medium text-white/50 mt-2">100% integrados à caderneta clínica</p>
            </div>

            {/* KPI 2 */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider">Saldo Franquia PDIs</span>
                <div className="w-10 h-10 rounded-2xl bg-[#bfa571]/20 text-[#dfca9e] flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black font-serif text-[#dfca9e]">{escolaInfo?.pdi_used || 7}</span>
                <span className="text-lg font-bold text-white/40">/ {escolaInfo?.pdi_limit || 10}</span>
              </div>
              <p className="text-[10px] font-medium text-emerald-400 mt-2 font-mono">3 cotas remanescentes no plano</p>
            </div>

            {/* KPI 3 */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider">Alertas Sob Análise</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black font-serif text-amber-300">
                  {alertas.filter(a => a.status === 'Pendente').length}
                </span>
                <span className="text-[10px] font-bold text-amber-200/80 bg-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                  SLA: 24h
                </span>
              </div>
              <p className="text-[10px] font-medium text-white/50 mt-2">Triagem pela banca multidisciplinar</p>
            </div>

            {/* KPI 4 */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-wider">Selo Escola Protegida</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-serif text-emerald-300 uppercase">Homologado</span>
              </div>
              <p className="text-[10px] font-medium text-white/50 mt-2 font-mono">Cód: {escolaInfo?.codigo_verificacao || 'NEURO-2026'}</p>
            </div>

          </div>

        </div>
      </section>

      {/* NAVEGAÇÃO POR ABAS EXECUTIVAS */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-6 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#0a2d54] text-[#0a2d54] bg-slate-50/80'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <BrainCircuit className="w-4 h-4" /> Inteligência &amp; Diagnóstico Sazonal
          </button>

          <button
            onClick={() => setActiveTab('termometro')}
            className={`py-4 px-6 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'termometro'
                ? 'border-[#0a2d54] text-[#0a2d54] bg-slate-50/80'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> Termômetro Cognitivo ({alunos.length})
          </button>

          <button
            onClick={() => setActiveTab('pdis')}
            className={`py-4 px-6 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'pdis'
                ? 'border-[#0a2d54] text-[#0a2d54] bg-slate-50/80'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" /> Auditoria de PDIs
          </button>

          <button
            onClick={() => setActiveTab('alertas')}
            className={`py-4 px-6 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'alertas'
                ? 'border-[#0a2d54] text-[#0a2d54] bg-slate-50/80'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Alertas Pedagógicos ({alertas.length})
          </button>

        </div>
      </div>

      {/* CONTEÚDO DA ABA SELECIONADA */}
      <main className="max-w-[1700px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left flex-1">
        
        {/* ABA 1: VISÃO GERAL & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Gráfico 1: Prevalência de Sinais */}
              <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#bfa571] uppercase tracking-widest">
                      Mapeamento Multidisciplinar
                    </span>
                    <h3 className="text-xl font-black text-[#0a2d54] uppercase tracking-tight font-serif mt-0.5">
                      Prevalência de Sinais Clínico-Pedagógicos
                    </h3>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full self-start">
                    Acumulado Bimestral
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosGraficoSinais} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-[10px] font-bold uppercase" stroke="#64748b" />
                      <YAxis axisLine={false} tickLine={false} className="text-[10px] font-bold" stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a2d54', borderRadius: '16px', color: '#fff', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                        itemStyle={{ color: '#dfca9e', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="quantidade" fill="#0a2d54" radius={[12, 12, 0, 0]} barSize={42}>
                        {dadosGraficoSinais.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CORES_GRAFICO[index % CORES_GRAFICO.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-slate-100 mt-4 text-center">
                  {dadosGraficoSinais.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase truncate">{item.name}</span>
                      <span className="text-base font-black text-[#0a2d54]">{item.quantidade} <span className="text-[10px] text-slate-400 font-normal">casos</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico 2: Turmas e Risco */}
              <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#bfa571] uppercase tracking-widest">
                        Distribuição por Turmas
                      </span>
                      <h3 className="text-xl font-black text-[#0a2d54] uppercase tracking-tight font-serif mt-0.5">
                        Volume de Alertas &amp; PDIs
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-[#0a2d54] bg-blue-50 px-3 py-1 rounded-full font-mono">
                      4 Turmas Ativas
                    </span>
                  </div>

                  <div className="space-y-4">
                    {turmasRisco.map((item, i) => (
                      <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between hover:border-slate-300 transition-all">
                        <div className="space-y-1">
                          <h4 className="font-black text-xs text-[#0a2d54] uppercase tracking-wide">{item.turma}</h4>
                          <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
                            <span>{item.alertas} alertas clínicos</span>
                            <span>•</span>
                            <span className="text-[#bfa571] font-bold">{item.pdisAtivos} PDIs homologados</span>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          item.criticidade === 'Alta' ? 'bg-red-50 text-red-700 border-red-200' :
                          item.criticidade === 'Média' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          Risco {item.criticidade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-[#bfa571]" /> Atualizado em tempo real com a SerClin
                  </span>
                  <button 
                    onClick={() => setActiveTab('termometro')}
                    className="text-[#0a2d54] font-black uppercase text-[10px] tracking-wider hover:underline cursor-pointer flex items-center gap-1"
                  >
                    Ver Todos os Alunos <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* Destaque Institucional: Protocolo de Inclusão SerClin */}
            <div className="bg-[#0a2d54] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl border border-[#0a2d54]/30">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                <div className="md:col-span-8 space-y-4">
                  <span className="text-[10px] font-mono font-black text-[#dfca9e] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                    Garantia de Compliance Inclusivo (Lei 13.146/2015 &amp; LDB)
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight font-serif italic">
                    Banca Multidisciplinar <span className="font-light text-slate-300 not-italic font-sans lowercase">em Ação Contínua</span>
                  </h3>
                  <p className="text-xs md:text-sm font-light text-white/70 leading-relaxed max-w-3xl">
                    Sua escola conta com validação técnica de Neuropsicólogos, Psicopedagogos e Fonoaudiólogos. Todas as diretrizes homologadas no painel têm validade jurídica pedagógica para suporte a fiscalizações e reuniões de famílias.
                  </p>
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button
                    onClick={() => setIsPdiModalOpen(true)}
                    className="bg-[#bfa571] hover:bg-[#a68d5b] text-[#0a2d54] font-black px-8 py-4 rounded-2xl uppercase text-xs tracking-widest shadow-xl border-none cursor-pointer transition-all active:scale-95"
                  >
                    Solicitar Auditoria de PDI
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ABA 2: TERMÔMETRO COGNITIVO ESCOLAR */}
        {activeTab === 'termometro' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8 animate-fadeIn">
            
            {/* Header & Filtros da Tabela */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#bfa571] uppercase tracking-widest">
                  Acompanhamento Individualizado
                </span>
                <h3 className="text-2xl font-black text-[#0a2d54] uppercase tracking-tight font-serif mt-0.5">
                  Termômetro Cognitivo Escolar
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                  <Input 
                    placeholder="Buscar por estudante ou turma..." 
                    value={buscaAluno} 
                    onChange={e => setBuscaAluno(e.target.value)} 
                    className="pl-10 bg-slate-50 border-slate-200 font-bold text-xs h-11 rounded-xl" 
                  />
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                  {['TODOS', 'CRITICO', 'ALERTA', 'PDI'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFiltroStatus(f)}
                      className={`px-3 py-2 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer flex-1 sm:flex-none ${
                        filtroStatus === f ? 'bg-white text-[#0a2d54] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabela Interativa de Alunos */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-mono font-black tracking-wider">
                    <th className="p-4">Estudante</th>
                    <th className="p-4">Série / Turma</th>
                    <th className="p-4">Sinais / Diagnósticos</th>
                    <th className="p-4">Status Cognitivo</th>
                    <th className="p-4">Situação PDI</th>
                    <th className="p-4 text-right">Diretrizes de Manejo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alunosFiltrados.map((aluno) => (
                    <tr key={aluno.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#0a2d54]/5 text-[#0a2d54] font-black text-sm flex items-center justify-center font-serif border border-[#0a2d54]/10">
                            {aluno.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-black text-sm text-[#0a2d54] uppercase block leading-tight">{aluno.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">ID: SC-{aluno.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-xs text-slate-600 uppercase font-mono">
                        {aluno.grade}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {aluno.tags?.map((t: string, idx: number) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border border-slate-200">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 border ${
                          aluno.status === 'Crítico' ? 'bg-red-50 text-red-700 border-red-200' :
                          aluno.status === 'Alerta' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            aluno.status === 'Crítico' ? 'bg-red-500' : aluno.status === 'Alerta' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          {aluno.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`text-xs font-bold font-mono ${
                          aluno.pdi_status === 'Ativo' ? 'text-emerald-600' : aluno.pdi_status === 'Em Análise' ? 'text-amber-600' : 'text-slate-400'
                        }`}>
                          {aluno.pdi_status === 'Ativo' ? '✓ PDI Homologado' : aluno.pdi_status === 'Em Análise' ? '⏳ Em Auditoria' : '— Sem PDI'}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <Button 
                          onClick={() => abrirDiretrizesManejo(aluno)} 
                          size="sm" 
                          className="bg-[#0a2d54] hover:bg-[#bfa571] text-white hover:text-[#0a2d54] font-black text-[10px] uppercase rounded-xl tracking-wider h-9 transition-all cursor-pointer border-none"
                        >
                          Plano de Manejo <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ABA 3: AUDITORIA DE PDIS */}
        {activeTab === 'pdis' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Box Franquia Status */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-[10px] font-mono font-bold text-[#bfa571] uppercase tracking-widest">
                  Painel de Franquia Contratada
                </span>
                <h3 className="text-2xl font-black text-[#0a2d54] uppercase tracking-tight font-serif">
                  Auditoria Multidisciplinar de PDIs
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  Submuta o Plano de Desenvolvimento Individual elaborado pela equipe pedagógica para validação e parecer técnico assinado pelos especialistas do Instituto SerClin.
                </p>
              </div>

              <div className="lg:col-span-4 bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Cotas Utilizadas:</span>
                  <span className="font-mono font-black text-[#0a2d54] text-base">{escolaInfo?.pdi_used || 7} / {escolaInfo?.pdi_limit || 10}</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#0a2d54] to-[#bfa571] h-full rounded-full" 
                    style={{ width: `${Math.min(100, ((escolaInfo?.pdi_used || 7) / (escolaInfo?.pdi_limit || 10)) * 100)}%` }}
                  />
                </div>
                <Button 
                  onClick={() => setIsPdiModalOpen(true)}
                  className="w-full bg-[#0a2d54] hover:bg-[#bfa571] text-white hover:text-[#0a2d54] font-black uppercase text-xs h-11 rounded-2xl transition-all cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4 mr-2 stroke-[3]" /> Submeter Novo PDI
                </Button>
              </div>
            </div>

            {/* Tabela de PDIs Auditados */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm space-y-4">
              <h4 className="text-lg font-black text-[#0a2d54] uppercase tracking-tight font-serif">
                Histórico de Auditações &amp; Laudos Emitidos
              </h4>

              <div className="divide-y divide-slate-100">
                {[
                  { student: "Bernardo Silva Santos", date: "15/07/2026", status: "Homologado", parecer: "PDI estruturado com adequação sensorial e tempo suplementar para avaliações." },
                  { student: "Mariana Costa e Silva", date: "18/07/2026", status: "Homologado", parecer: "Inclusão de adaptação fonoaudiológica e comunicação simplificada recomendada." },
                  { student: "Camila Rodrigues Lima", date: "21/07/2026", status: "Em Análise", parecer: "Análise pela banca multidisciplinar SerClin em andamento. Prazo estimado: 24h." },
                ].map((pdi, i) => (
                  <div key={i} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-[#0a2d54] uppercase">{pdi.student}</span>
                        <span className="text-[10px] font-mono text-slate-400">Submetido em {pdi.date}</span>
                      </div>
                      <p className="text-xs text-slate-500">{pdi.parecer}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        pdi.status === 'Homologado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {pdi.status}
                      </span>
                      <button 
                        onClick={() => toast.info(`Baixando parecer assinado do aluno ${pdi.student}...`)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        title="Download do parecer assinado"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ABA 4: ALERTAS & TRIAGEM */}
        {activeTab === 'alertas' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#bfa571] uppercase tracking-widest">
                  Comunicação Pedagógico-Clínica
                </span>
                <h3 className="text-2xl font-black text-[#0a2d54] uppercase tracking-tight font-serif mt-0.5">
                  Alertas Registrados pelos Professores
                </h3>
              </div>

              <Button 
                onClick={() => setIsAlertaModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-xs h-11 px-6 rounded-2xl transition-all cursor-pointer border-none"
              >
                <Plus className="w-4 h-4 mr-2 stroke-[3]" /> Registrar Novo Alerta
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {alertas.map((alt) => (
                <div key={alt.id} className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
                        {alt.tipo || "Alerta Comportamental"}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(alt.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>

                    <h4 className="font-black text-base text-[#0a2d54] uppercase font-serif">{alt.student_name}</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase font-mono">{alt.grade}</p>
                    <p className="text-xs text-slate-600 italic">Registrado por: {alt.professor || "Coordenação"}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      alt.status === 'Tratado' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      • {alt.status || 'Em Análise'}
                    </span>
                    <button 
                      onClick={() => toast.info(`Alerta de ${alt.student_name} está em triagem na central SerClin.`)}
                      className="text-[10px] font-black uppercase text-[#0a2d54] hover:underline cursor-pointer"
                    >
                      Detalhes da Triagem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="bg-[#0a2d54] text-white py-8 border-t border-[#0a2d54]/30 mt-12 text-center text-xs text-white/50 space-y-2">
        <p className="font-mono uppercase tracking-widest text-[10px]">
          Instituto SerClin — Tecnologia &amp; Inclusão Neuroeducacional © 2026
        </p>
        <p className="text-[10px] text-white/30">
          Atendimento Técnico Pedagógico: <span className="text-[#dfca9e]">(68) 99216-1717</span> • CNPJ / Cadastro Homologado
        </p>
      </footer>

      {/* MODAL 1: AUDITAR NOVO PDI */}
      {isPdiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-[500px] overflow-hidden border border-slate-100 text-left">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-black uppercase text-base tracking-tight text-[#0a2d54] font-serif">Submeter PDI para Auditoria</h3>
                <p className="text-[10px] font-mono text-slate-400 uppercase font-bold mt-0.5">Banca Multidisciplinar SerClin</p>
              </div>
              <button onClick={() => setIsPdiModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2 cursor-pointer">
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleSubmeterPdi} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Estudante Alvo</label>
                <Select onValueChange={(v) => setPdiForm({...pdiForm, aluno_id: v})}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 h-12 text-xs font-bold uppercase rounded-2xl">
                    <SelectValue placeholder="SELECIONAR ESTUDANTE..." />
                  </SelectTrigger>
                  <SelectContent className="z-[120]">
                    {alunos.map(a => (
                      <SelectItem key={a.id} value={a.id} className="uppercase text-xs font-bold">
                        {a.name} ({a.grade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Arquivo do PDI (PDF / DOCX)</label>
                <div 
                  onClick={() => toast.info("Simulando seleção de arquivo de PDI...")}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-all space-y-2"
                >
                  <FileText className="mx-auto text-[#bfa571]" size={36} />
                  <span className="text-xs font-black text-[#0a2d54] uppercase block">Clique para anexar o Plano de Desenvolvimento</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Suporta PDF até 25MB</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Observações da Coordenação</label>
                <textarea 
                  rows={3}
                  placeholder="Descreva pontos prioritários para validação técnica..."
                  value={pdiForm.observacoes}
                  onChange={e => setPdiForm({...pdiForm, observacoes: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-[#0a2d54]"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#0a2d54] hover:bg-[#bfa571] text-white hover:text-[#0a2d54] font-black uppercase text-xs h-12 rounded-2xl transition-all cursor-pointer border-none shadow-lg"
              >
                {loading ? <RefreshCw className="animate-spin" /> : 'Confirmar e Submeter para Auditoria'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DIRETRIZES DE MANEJO CLINICO-PEDAGOGICO */}
      {isGuidelineModalOpen && guidelineSelecionada && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-[620px] overflow-hidden border border-slate-100 text-left">
            
            {/* Header com estilo laudo clínico */}
            <div className="p-8 border-b border-slate-100 bg-[#0a2d54] text-white relative">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-[#dfca9e] uppercase tracking-widest bg-white/10 px-2.5 py-0.5 rounded-full">
                    Laudo e Diretriz Homologada
                  </span>
                  <h3 className="font-black uppercase text-xl tracking-tight font-serif text-white">
                    {guidelineSelecionada.student_name}
                  </h3>
                  <p className="text-xs font-mono text-white/70">{guidelineSelecionada.grade}</p>
                </div>
                <button 
                  onClick={() => setIsGuidelineModalOpen(false)} 
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full cursor-pointer transition-colors"
                >
                  <X size={18}/>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Resumo da Avaliação Clínica:</span>
                <p className="text-xs font-semibold text-slate-700">{guidelineSelecionada.laudo_resumo}</p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono font-black text-[#0a2d54] uppercase tracking-widest block border-b pb-2">
                  Diretrizes Práticas Pactuadas para Sala de Aula:
                </span>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans font-medium">
                  {guidelineSelecionada.actions_pact}
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between text-emerald-800 text-xs font-bold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Responsável Clínico: {guidelineSelecionada.responsavel_clinico}
                </span>
                <span className="text-[10px] font-mono bg-emerald-200/50 px-2 py-0.5 rounded">VALIDADO</span>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => toast.success("Imprimindo Diretrizes Clínico-Pedagógicas...")}
                className="text-xs font-bold border-slate-200 rounded-xl cursor-pointer"
              >
                <Download className="w-4 h-4 mr-1.5" /> Imprimir Documento
              </Button>

              <Button
                onClick={() => {
                  toast.success("Diretrizes homologadas e confirmadas pela coordenação!");
                  setIsGuidelineModalOpen(false);
                }}
                className="bg-[#0a2d54] hover:bg-[#bfa571] text-white hover:text-[#0a2d54] font-black uppercase text-xs h-11 px-6 rounded-xl transition-all cursor-pointer border-none"
              >
                Homologar Leitura
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: NOVO ALERTA CLINICO PEDAGOGICO */}
      {isAlertaModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-[500px] overflow-hidden border border-slate-100 text-left">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-amber-500/10">
              <div>
                <h3 className="font-black uppercase text-base tracking-tight text-amber-900 font-serif">Registrar Alerta de Risco</h3>
                <p className="text-[10px] font-mono text-amber-700 uppercase font-bold mt-0.5">Comunicação Direta com Equipe SerClin</p>
              </div>
              <button onClick={() => setIsAlertaModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2 cursor-pointer">
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleSubmeterAlerta} className="p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Estudante Observado</label>
                <Select onValueChange={(v) => setAlertaForm({...alertaForm, aluno_id: v})}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 h-12 text-xs font-bold uppercase rounded-2xl">
                    <SelectValue placeholder="SELECIONAR ESTUDANTE..." />
                  </SelectTrigger>
                  <SelectContent className="z-[120]">
                    {alunos.map(a => (
                      <SelectItem key={a.id} value={a.id} className="uppercase text-xs font-bold">
                        {a.name} ({a.grade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Sinais Observados em Sala de Aula</label>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                  <label className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={alertaForm.sinal_desatencao} 
                      onChange={e => setAlertaForm({...alertaForm, sinal_desatencao: e.target.checked})} 
                      className="accent-[#0a2d54]"
                    />
                    Desatenção Severa
                  </label>

                  <label className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={alertaForm.sinal_hiperatividade} 
                      onChange={e => setAlertaForm({...alertaForm, sinal_hiperatividade: e.target.checked})} 
                      className="accent-[#0a2d54]"
                    />
                    Hiperatividade
                  </label>

                  <label className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={alertaForm.sinal_dificuldade_leitura} 
                      onChange={e => setAlertaForm({...alertaForm, sinal_dificuldade_leitura: e.target.checked})} 
                      className="accent-[#0a2d54]"
                    />
                    Dificuldade Leitura
                  </label>

                  <label className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={alertaForm.sinal_isolamento_social} 
                      onChange={e => setAlertaForm({...alertaForm, sinal_isolamento_social: e.target.checked})} 
                      className="accent-[#0a2d54]"
                    />
                    Isolamento Social
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Descrição do Episódio / Observação</label>
                <textarea 
                  rows={3}
                  placeholder="Detalhe o comportamento ou barreira de aprendizagem notada pelo professor..."
                  value={alertaForm.observacao}
                  onChange={e => setAlertaForm({...alertaForm, observacao: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-[#0a2d54]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-xs h-12 rounded-2xl transition-all cursor-pointer border-none shadow-lg mt-2"
              >
                Despachar Alerta para Triagem SerClin
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardEscola;
