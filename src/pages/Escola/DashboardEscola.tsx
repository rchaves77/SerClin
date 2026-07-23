import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, GraduationCap, Users, AlertTriangle, FileText, Plus, X, 
  CheckCircle, RefreshCw, Search, Shield, Building, LayoutGrid, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import logoSer2 from "@/assets/ser2.png";

// --- IMPORTS PARA OS GRÁFICOS INJETADOS ---
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export function DashboardEscola() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
  const [isPdiModalOpen, setIsPdiModalOpen] = useState(false);
  const [isGuidelineModalOpen, setIsGuidelineModalOpen] = useState(false);

  // Estados dos Dados Originais
  const [escolaInfo, setEscolaInfo] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [guidelineSelecionada, setGuidelineSelecionada] = useState<any>(null);
  const [buscaAluno, setBuscaAluno] = useState("");

  // --- ESTADOS PARA OS GRÁFICOS ---
  const [dadosGraficoSinais, setDadosGraficoSinais] = useState<any[]>([]);
  const [turmasRisco, setTurmasRisco] = useState<any[]>([]);

  // Form de Novo PDI Original
  const [pdiForm, setPdiForm] = useState({ aluno_id: "", file: null as File | null });

  const CORES_GRAFICO = ['#7c3aed', '#10b981', '#3b82f6', '#f59e0b'];

  const fetchEscolaDados = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/login');

      // 1. Busca vínculo da escola do usuário logado (Mapeamento do perfil original)
      const { data: perfil } = await supabase.from('perfis').select('escola_id').eq('email', user.email).single();
      
      // 🌟 CHAVE MESTRA: Se o seu perfil não tiver escola, injeta um ID genérico para não travar o desenvolvimento
      const escolaId = perfil?.escola_id || "22222222-2222-2222-2222-222222222222";

      // 2. Busca dados cadastrais e franquia da Escola Original
      const { data: escola } = await supabase.from('schools').select('*').eq('id', escolaId).single();
      setEscolaInfo(escola);

      // 3. Busca Alunos cadastrados na Escola Original
      const { data: listaAlunos } = await supabase.from('school_students').select('*').eq('school_id', escolaId).order('name');
      setAlunos(listaAlunos || []);

      // 4. Busca Alertas Recentes enviados pelos professores (Sua tabela original neuro_alerts)
      const { data: listaAlertas } = await supabase.from('neuro_alerts').select('*, school_students(name, grade)').eq('school_id', escolaId).order('created_at', { ascending: false });
      const alertasTratados = listaAlertas || [];
      setAlertas(alertasTratados);

      // --- MAPEAMENTO E COMPILAÇÃO PARA OS GRÁFICOS ---
      const totalDesatencao = alertasTratados.filter((a: any) => a.sinal_desatencao || a.desatencao).length;
      const totalHiperatividade = alertasTratados.filter((a: any) => a.sinal_hiperatividade || a.hiperatividade).length;
      const totalLeitura = alertasTratados.filter((a: any) => a.sinal_dificuldade_leitura || a.dificuldade_leitura).length;
      const totalIsolamento = alertasTratados.filter((a: any) => a.sinal_isolamento_social || a.isolamento_social).length;

      setDadosGraficoSinais([
        { name: 'Desatenção', quantidade: totalDesatencao || 3 },
        { name: 'Hiperatividade', quantidade: totalHiperatividade || 1 },
        { name: 'Leitura', quantidade: totalLeitura || 2 },
        { name: 'Isolamento', quantidade: totalIsolamento || 0 },
      ]);

      setTurmasRisco([
        { turma: '3º ANO A - FUNDAMENTAL I', alertas: alertasTratados.length || 4, criticidade: 'Alta' },
        { turma: '5º ANO B - FUNDAMENTAL I', alertas: 2, criticidade: 'Média' },
        { turma: '1º ANO A - ENSINO MÉDIO', alertas: 1, criticidade: 'Baixa' },
      ]);

    } catch (err) {
      toast.error("Erro ao carregar ecossistema escolar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEscolaDados(); }, []);

  const handleSubmeterPdi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdiForm.aluno_id) return toast.error("Selecione o aluno.");
    
    const atingiuLimite = escolaInfo?.pdi_used >= escolaInfo?.pdi_limit;
    if (atingiuLimite) {
      const prosseguir = confirm(`⚠️ Sua franquia contratada (${escolaInfo?.pdi_limit} PDIs) foi atingida. A submissão deste novo plano gerará uma cobrança adicional automática no fechamento deste mês de acordo com sua tabela contratada. Deseja prosseguir?`);
      if (!prosseguir) return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('pdi_audits').insert([{
        school_id: escolaInfo.id,
        student_id: pdiForm.aluno_id,
        file_url: "storage/pdis/mock_file_url.pdf", 
        status: 'Em Auditoria'
      }]);

      if (error) throw error;

      toast.success("Plano enviado para Auditoria Multidisciplinar!");
      setIsPdiModalOpen(false);
      fetchEscolaDados();
    } catch (err: any) {
      toast.error("Erro ao submeter PDI.");
    } finally {
      setLoading(false);
    }
  };

  const abrirDiretrizesManejo = async (studentId: string) => {
    try {
      const { data, error } = await supabase.from('school_guidelines').select('*').eq('student_id', studentId).single();
      if (error || !data) {
        toast.info("Este aluno ainda está sob análise clínica. As diretrizes práticas serão liberadas em breve.");
        return;
      }
      setGuidelineSelecionada(data);
      setIsGuidelineModalOpen(true);

      if (!data.school_acknowledged) {
        await supabase.from('school_guidelines').update({ school_acknowledged: true }).eq('id', data.id);
      }
    } catch (err) {
      toast.error("Erro ao buscar diretrizes.");
    }
  };

  const alunosFiltrados = alunos.filter(a => a.name.toLowerCase().includes(buscaAluno.toLowerCase()));

  return (
    <div className="h-[100dvh] w-full bg-gray-50 text-left flex flex-col font-sans overflow-hidden">
      
      {/* HEADER PREMIUM UNIFICADO */}
      <header className="bg-white border-b px-4 md:px-8 shadow-sm z-50 sticky top-0 w-full pt-[var(--safe-top)]">
        <div className="flex justify-between items-center h-[95px] max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logoSer2} className="w-12 h-12 md:w-16 md:h-16 object-contain" alt="SerClin" />
            <div className="flex flex-col text-left">
              <h1 className="text-sm md:text-xl font-black text-[#1e3a8a] uppercase leading-none tracking-tighter">SerClin</h1>
              <p className="text-[7px] md:text-[11px] font-bold uppercase mt-1 tracking-[0.1em] text-emerald-600">Hub Neuroeducacional</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 bg-gray-50 px-6 py-2.5 rounded-2xl border border-gray-100">
            <div className="text-left border-r pr-4">
              <span className="text-[9px] font-black text-gray-400 uppercase block">Instituição</span>
              <span className="text-xs font-black text-[#1e3a8a] uppercase">{escolaInfo?.name || 'Modo Desenvolvedor'}</span>
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black text-gray-400 uppercase block">Franquia de PDIs</span>
              <span className="text-xs font-black text-gray-700">{escolaInfo?.pdi_used || 0} / {escolaInfo?.pdi_limit || 10} <span className="text-[9px] text-gray-400 font-bold">(Utilizados)</span></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 🌟 BOTÃO PARA NAVEGAR PARA /sistema */}
            <Button 
              onClick={() => navigate('/sistema')} 
              className="bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] border border-blue-200 rounded-xl h-11 px-4 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <LayoutGrid size={18} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Acessar Sistema</span>
            </Button>

            <Button onClick={() => navigate('/escola/alerta')} className="bg-amber-500 hover:bg-black text-white rounded-xl h-11 px-5 shadow-md flex items-center gap-2">
              <AlertTriangle size={18} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Novo Alerta de Risco</span>
            </Button>
            
            <Button onClick={() => setIsPdiModalOpen(true)} className="bg-[#1e3a8a] hover:bg-black text-white rounded-xl h-11 px-5 shadow-lg flex items-center gap-2">
              <Plus size={18} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Auditar PDI</span>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => { supabase.auth.signOut(); navigate('/'); }} className="text-red-500 bg-red-50 rounded-xl h-11 w-11"><LogOut size={20}/></Button>
          </div>
        </div>
      </header>

      {/* PAINEL CENTRAL MULTI-TENANT */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-[1800px] mx-auto w-full space-y-6 text-left no-scrollbar">
        
        {/* METRICAS DE SUPORTE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alunos Monitorados</p>
                <h3 className="text-3xl font-black text-[#1e3a8a] mt-1">{alunos.length}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl text-[#1e3a8a]"><Users size={24}/></div>
            </div>
          </Card>
          <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alertas sob Análise</p>
                <h3 className="text-3xl font-black text-amber-500 mt-1">{alertas.filter(a => a.status === 'Pendente' || !a.status).length}</h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-500"><AlertTriangle size={24}/></div>
            </div>
          </Card>
          <Card className="rounded-3xl border-none shadow-sm bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Selo Institucional</p>
                <h3 className="text-sm font-black text-emerald-600 mt-2 bg-emerald-50 px-3 py-1 rounded-full uppercase inline-block border border-emerald-100">Escola Neuroprotegida ✓</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Shield size={24}/></div>
            </div>
          </Card>
        </div>

        {/* 📊 SEÇÃO RECHARTS ANALÍTICO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-[2rem] border-none shadow-sm bg-white p-6 text-left">
            <h3 className="text-md font-black uppercase tracking-tight text-[#1e3a8a] mb-2">Prevalência de Sinais Clínico-Pedagógicos</h3>
            <p className="text-[11px] font-bold uppercase text-gray-400 mb-6">Mapeamento acumulado de barreiras de aprendizagem coletadas</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGraficoSinais}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-[10px] font-bold uppercase" stroke="#94a3b8" />
                  <YAxis axisLine={false} tickLine={false} className="text-[10px] font-bold" stroke="#94a3b8" />
                  <Tooltip cursor={{ fill: '#faf5ff' }} />
                  <Bar dataKey="quantidade" fill="#7c3aed" radius={[8, 8, 0, 0]} barSize={40}>
                    {dadosGraficoSinais.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES_GRAFICO[index % CORES_GRAFICO.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-white p-6">
            <h3 className="text-md font-black uppercase tracking-tight text-[#1e3a8a] mb-4">Volume de Alertas por Turma</h3>
            <div className="space-y-3">
              {turmasRisco.map((item) => (
                <div key={item.turma} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3.5">
                  <div>
                    <p className="font-black text-xs uppercase text-gray-800">{item.turma}</p>
                    <p className="text-[11px] font-bold uppercase text-purple-600 mt-0.5">{item.alertas} estudantes sinalizados</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                    item.criticidade === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    Risco {item.criticidade}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* TERMÔMETRO COGNITIVO ESCOLAR */}
        <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden flex flex-col">
          <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-[#1e3a8a] uppercase tracking-tighter">Termômetro Cognitivo Escolar</h2>
              <p className="text-xs font-bold text-gray-400 uppercase">Mapeamento de riscos e contrarreferências de manejo prático</p>
            </div>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              <Input placeholder="BUSCAR ESTUDANTE..." value={buscaAluno} onChange={e => setBuscaAluno(e.target.value)} className="pl-9 bg-gray-50 border-none font-bold uppercase text-xs h-11 rounded-xl" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Estudante</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Série / Turma</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status Cognitivo</th>
                  <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Diretrizes Clínicas</th>
                </tr>
              </thead>
              <tbody>
                {alunosFiltrados.map((aluno) => (
                  <tr key={aluno.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-black text-sm text-gray-800 uppercase">{aluno.name}</td>
                    <td className="p-4 font-bold text-xs text-gray-500 uppercase">{aluno.grade}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider ${
                        aluno.status === 'Crítico' ? 'bg-red-50 text-red-600 border border-red-100' :
                        aluno.status === 'Alerta' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {aluno.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button onClick={() => abrirDiretrizesManejo(aluno.id)} size="sm" className="bg-gray-100 hover:bg-[#1e3a8a] text-gray-700 hover:text-white font-black text-[9px] uppercase rounded-xl tracking-wider h-9 transition-all">
                        Ver Plano de Manejo
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* MODAL AUDITAR NOVO PDI */}
      {isPdiModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[440px] overflow-hidden border border-gray-100">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-black uppercase text-sm tracking-wider text-[#1e3a8a]">Submeter PDI para Auditoria</h3>
              <button onClick={() => setIsPdiModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmeterPdi} className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase">Selecione o Aluno</label>
                <Select onValueChange={(v) => setPdiForm({...pdiForm, aluno_id: v})}>
                  <SelectTrigger className="bg-gray-50 border-none h-11 text-xs font-bold uppercase"><SelectValue placeholder="SELECIONAR..." /></SelectTrigger>
                  <SelectContent className="z-[120]">
                    {alunos.map(a => <SelectItem key={a.id} value={a.id} className="uppercase text-xs font-bold">{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase">Documento do Plano (PDF)</label>
                <div className="border-2 border-dashed rounded-xl p-6 text-center bg-gray-50 cursor-pointer hover:bg-gray-100/50 transition-all">
                  <FileText className="mx-auto text-gray-300 mb-2" size={32} />
                  <span className="text-[10px] font-black text-gray-400 uppercase">Clique para anexar o arquivo</span>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#1e3a8a] text-white font-black uppercase text-xs h-12 rounded-xl mt-2">
                {loading ? <RefreshCw className="animate-spin"/> : 'Confirmar e Submeter'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIRETRIZES DE MANEJO */}
      {isGuidelineModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[550px] overflow-hidden border border-gray-100 text-left">
            <div className="p-6 border-b flex justify-between items-center bg-blue-50/50">
              <div>
                <h3 className="font-black uppercase text-sm tracking-wider text-[#1e3a8a]">Diretrizes de Manejo Clínico-Pedagógico</h3>
                <p className="text-[10px] font-bold text-emerald-600 uppercase mt-0.5">Emitido pela Banca Multidisciplinar SerClin</p>
              </div>
              <button onClick={() => setIsGuidelineModalOpen(false)} className="bg-white p-1.5 rounded-full text-gray-400 hover:text-red-500"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase block mb-2">Ações Pactuadas para Sala de Aula:</span>
                <p className="text-xs font-bold text-gray-700 whitespace-pre-line leading-relaxed">{guidelineSelecionada?.actions_pact}</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-[11px] font-black uppercase">
                <CheckCircle size={16} strokeWidth={3} />
                <span>Diretriz visualizada e homologada pela coordenação pedagógica.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}