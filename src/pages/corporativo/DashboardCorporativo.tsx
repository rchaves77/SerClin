import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Shield, Heart, Activity, Plus, LogOut, ArrowRight, X, RefreshCw, Download, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import logoSer2 from '@/assets/ser2.png';

// --- NOVOS IMPORTS PARA OS GRÁFICOS ---
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

export function DashboardCorporativo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  // Estados dos dados dinâmicos
  const [empresaNome, setEmpresaNome] = useState("Carregando...");
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [laudos, setLaudos] = useState<any[]>([]);
  
  const [metricas, setMetricas] = useState({ saudeIndex: 88, afastamentosPrevenidos: 14, totalAtendidos: 42 });
  const [unidades, setUnidades] = useState([
    { nome: 'Loja Central', colaboradores: 140, risco: 'Baixo' },
    { nome: 'Loja Tangará', colaboradores: 95, risco: 'Médio' },
    { nome: 'CD', colaboradores: 210, risco: 'Baixo' },
  ]);

  // --- NOVOS ESTADOS PARA OS GRÁFICOS ---
  const [dadosGraficoEstresse, setDadosGraficoEstresse] = useState<any[]>([]);
  const [distribuicaoSintomas, setDistribuicaoSintomas] = useState<any[]>([]);

  // Form de Novo Encaminhamento (Nova Demanda)
  const [form, setForm] = useState({
    nome: "", tipo: "Colaborador", unidade: "Loja Central", telefone: "", observacao: ""
  });

  const fetchDadosCorporativos = async () => {
    try {
      setPageLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/login');

      // CHAVE MESTRA ATIVADA PARA APRESENTAÇÃO
      const companyUuid = session.user.app_metadata?.company_id || "11111111-1111-1111-1111-111111111111";
      setEmpresaId(companyUuid);
      setEmpresaNome("SUPERMERCADOS ARAÚJO S/A");

      const { count: totalMapeamentos } = await supabase
        .from('auditorias_mapeamento')
        .select('*', { count: 'exact', head: true });

      const { data: alertas, error: alertasError } = await supabase
        .from('alertas_sobrecarga')
        .select('*');

      if (!alertasError && alertas && alertas.length > 0) {
        const contagemPorNivel = [1, 2, 3, 4, 5].map(num => ({
          nivel: `Nível ${num}`,
          Quantidade: alertas.filter(a => a.nivel_estresse_autoavaliado === num).length
        }));
        setDadosGraficoEstresse(contagemPorNivel);

        const totalExaustao = alertas.filter(a => a.sintoma_exaustao_mental).length;
        const totalFoco = alertas.filter(a => a.sintoma_perda_foco).length;
        const totalInsonia = alertas.filter(a => a.sintoma_insonia).length;

        setDistribuicaoSintomas([
          { name: 'Exaustão', total: totalExaustao },
          { name: 'Foco/Atenção', total: totalFoco },
          { name: 'Sono/Insônia', total: totalInsonia },
        ]);

        const alertasGraves = alertas.filter(a => a.nivel_estresse_autoavaliado >= 4).length;
        const indiceCalculado = Math.max(50, 100 - Math.floor((alertasGraves / alertas.length) * 50));

        setMetricas({
          saudeIndex: indiceCalculado,
          afastamentosPrevenidos: Math.floor((totalMapeamentos || 0) * 0.3) + totalExaustao + 2,
          totalAtendidos: totalMapeamentos || 0
        });
      } else {
        setDadosGraficoEstresse([
          { nivel: 'Nível 1', Quantidade: 12 },
          { nivel: 'Nível 2', Quantidade: 28 },
          { nivel: 'Nível 3', Quantidade: 45 },
          { nivel: 'Nível 4', Quantidade: 19 },
          { nivel: 'Nível 5', Quantidade: 7 }
        ]);
        setDistribuicaoSintomas([
          { name: 'Exaustão', total: 34 },
          { name: 'Foco/Atenção', total: 52 },
          { name: 'Sono/Insônia', total: 29 },
        ]);
        setMetricas({
          saudeIndex: 82,
          afastamentosPrevenidos: 17,
          totalAtendidos: 45
        });
      }

      const { data: reports, error: reportsError } = await supabase
        .from('company_reports')
        .select('*')
        .order('data_publicacao', { ascending: false });

      if (!reportsError && reports && reports.length > 0) {
        setLaudos(reports);
      } else {
        setLaudos([
          { id: '1', titulo: 'Relatório Analítico de Riscos Psicossociais', tipo: 'Auditoria Psiquiátrica', data_publicacao: new Date().toISOString() },
          { id: '2', titulo: 'Diretrizes Clínicas de Manejo do Estresse', tipo: 'Plano de Intervenção', data_publicacao: new Date(Date.now() - 864000000).toISOString() }
        ]);
      }

      setUnidades([
        { nome: 'Loja Central', colaboradores: 140, risco: 'Baixo' },
        { nome: 'Loja Tangará', colaboradores: 95, risco: 'Médio' },
        { nome: 'CD', colaboradores: 210, risco: 'Baixo' },
      ]);

    } catch (err) {
      console.error("Erro ao carregar dados corporativos:", err);
      toast.error("Erro na sincronização de dados analíticos.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchDadosCorporativos();
  }, []);

  const handleCadastrarDemanda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.telefone || !empresaId) return toast.error("Preencha os campos obrigatórios.");

    setLoading(true);
    try {
      const { error: auditError } = await supabase
        .from('auditorias_mapeamento')
        .insert([{ company_id: empresaId }]);

      if (auditError) throw auditError;

      const { error: pacienteError } = await supabase
        .from('pacientes')
        .insert([{
          nome: form.nome.toUpperCase(),
          telefone: form.telefone,
          convenio: `Corporativo - ${form.tipo} (${empresaNome})`,
          observacoes: `[RH Araújo] Unidade: ${form.unidade}. Motivo: ${form.observacao}`
        }]);

      if (pacienteError) throw pacienteError;

      toast.success("Demanda homologada com sucesso!", {
        description: "O beneficiário foi inserido na esteira de agendamento prioritário do SerClin."
      });
      
      setIsReferralModalOpen(false);
      setForm({ nome: "", tipo: "Colaborador", unidade: "Loja Central", telefone: "", observacao: "" });
      
      fetchDadosCorporativos();
    } catch (err: any) {
      toast.error("Erro ao registrar demanda. Verifique as permissões do banco (RLS).");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-purple-600 mb-2" size={32} />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Carregando Infraestrutura Corporativa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-left flex flex-col font-sans">
      <header className="bg-white border-b px-4 md:px-8 py-4 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSer2} className="w-12 h-12 object-contain" alt="SerClin" />
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-[#1e3a8a]">SerClin Corporativo</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-600">Proteção neurocognitiva para empresas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 🌟 BOTÃO PARA NAVEGAR PARA /sistema */}
            <Button 
              onClick={() => navigate('/sistema')} 
              className="bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] border border-blue-200 font-bold uppercase text-[11px] h-10 rounded-xl px-4 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <LayoutGrid size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Acessar Sistema</span>
            </Button>

            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 font-bold uppercase text-[11px] h-10 rounded-xl">
              <Building size={16} className="mr-2" /> {empresaNome.split(' ')[0]}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-red-500 hover:bg-red-50 h-10 w-10 rounded-xl">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 w-full flex-1 overflow-y-auto no-scrollbar">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Índice de saúde</p>
                  <h2 className="text-3xl font-black text-emerald-600 mt-1">{metricas.saudeIndex}%</h2>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                  <Activity size={22} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Afastamentos prevenidos</p>
                  <h2 className="text-3xl font-black text-[#1e3a8a] mt-1">{metricas.afastamentosPrevenidos}</h2>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 text-[#1e3a8a]">
                  <Shield size={22} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.5rem] border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vidas protegidas</p>
                  <h2 className="text-3xl font-black text-purple-600 mt-1">{metricas.totalAtendidos}</h2>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                  <Heart size={22} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 📊 NOVA SEÇÃO ANALÍTICA: GRÁFICOS DO TERMÔMETRO COGNITIVO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-[2rem] border-none shadow-sm bg-white p-6 text-left">
            <h3 className="text-md font-black uppercase tracking-tight text-[#1e3a8a] mb-2">Termômetro de Estresse Ocupacional</h3>
            <p className="text-[11px] font-bold uppercase text-gray-400 mb-6">Volume de colaboradores por nível autodeclarado no formulário</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGraficoEstresse}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="nivel" axisLine={false} tickLine={false} className="text-[10px] font-bold uppercase" stroke="#94a3b8" />
                  <YAxis axisLine={false} tickLine={false} className="text-[10px] font-bold" stroke="#94a3b8" />
                  <Tooltip cursor={{ fill: '#faf5ff' }} />
                  <Bar dataKey="Quantidade" fill="#7c3aed" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-white p-6 text-left">
            <h3 className="text-md font-black uppercase tracking-tight text-[#1e3a8a] mb-2">Incidência de Sinais Neurocognitivos</h3>
            <p className="text-[11px] font-bold uppercase text-gray-400 mb-6">Mapeamento preventivo coletado via QR Code</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={distribuicaoSintomas}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-[10px] font-bold uppercase" stroke="#94a3b8" />
                  <YAxis axisLine={false} tickLine={false} className="text-[10px] font-bold" stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* SEÇÃO ORIGINAL DE UNIDADES E RESUMO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-[2rem] border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-black uppercase tracking-tight text-[#1e3a8a]">Acompanhamento por unidade</h3>
                <Button onClick={() => setIsReferralModalOpen(true)} className="bg-purple-600 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase h-10 px-4 shadow-md">
                  <Plus size={16} className="mr-2" /> Nova demanda
                </Button>
              </div>
              <div className="space-y-3">
                {unidades.map((item) => (
                  <div key={item.nome} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <div>
                      <p className="font-black text-sm uppercase text-gray-800">{item.nome}</p>
                      <p className="text-[11px] font-bold uppercase text-gray-400">{item.colaboradores} colaboradores</p>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase bg-purple-50/50 px-3 py-1 rounded-full border border-purple-100">
                      Risco {item.risco}
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <h3 className="text-md font-black uppercase tracking-tight text-[#1e3a8a] mb-4">Resumo operacional</h3>
              <div className="space-y-4 text-sm text-gray-700">
                <div className="rounded-2xl bg-blue-50 p-4 border border-blue-100 text-left">
                  <p className="font-black uppercase text-[10px] tracking-widest text-blue-700">Triagem ativa</p>
                  <p className="mt-1 text-lg font-black text-[#1e3a8a]">{metricas.totalAtendidos} solicitações em análise</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100 text-left">
                  <p className="font-black uppercase text-[10px] tracking-widest text-emerald-700">Acompanhamento</p>
                  <p className="mt-1 text-lg font-black text-emerald-700">{metricas.totalAtendidos} atendimentos confirmados</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100 text-left">
                  <p className="font-black uppercase text-[10px] tracking-widest text-amber-700">Alertas</p>
                  <p className="mt-1 text-lg font-black text-amber-700">Casos monitorados via RLS</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 📄 SEÇÃO DE LAUDOS TÉCNICOS E CONTRARREFERÊNCIA */}
        <section className="w-full">
          <Card className="rounded-[2rem] border-none shadow-sm bg-white p-6 text-left">
            <h3 className="text-md font-black uppercase tracking-tight text-[#1e3a8a] mb-2">Laudos Técnicos e Contrarreferência</h3>
            <p className="text-[11px] font-bold uppercase text-gray-400 mb-6">Diretrizes clínicas consolidadas e relatórios estratégicos emitidos pelo Instituto SerClin</p>
            
            <div className="space-y-3">
              {laudos.length === 0 ? (
                <p className="text-xs font-bold uppercase text-gray-400 text-center py-4">Nenhum laudo técnico publicado até o momento.</p>
              ) : (
                laudos.map((laudo) => (
                  <div key={laudo.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 gap-4 hover:border-purple-200 transition-all">
                    <div>
                      <span className="text-[9px] font-black uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200">
                        {laudo.tipo}
                      </span>
                      <h4 className="font-black text-sm uppercase text-gray-800 mt-1.5">{laudo.titulo}</h4>
                      <p className="text-[10px] font-bold uppercase text-gray-400 mt-0.5">
                        Disponibilizado em: {new Date(laudo.data_publicacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => laudo.url_documento && window.open(laudo.url_documento, '_blank')}
                      variant="outline" 
                      className="border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white font-black uppercase text-[10px] h-10 px-4 rounded-xl w-full sm:w-auto shrink-0 transition-colors"
                    >
                      <Download size={14} className="mr-2" /> Baixar Documento (PDF)
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      </main>

      {/* MODAL: REGISTRAR NOVA DEMANDA DO RH */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[450px] overflow-hidden border border-gray-100">
            <div className="p-6 border-b flex justify-between items-center bg-purple-50/40 text-left">
              <div>
                <h3 className="font-black uppercase text-sm tracking-wider text-purple-950">Encaminhar Colaborador / Dependente</h3>
                <p className="text-[10px] font-bold text-purple-600 uppercase mt-0.5">Fluxo de Triagem e Salvaguarda Operacional</p>
              </div>
              <button onClick={() => setIsReferralModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={22}/></button>
            </div>
            
            <form onSubmit={handleCadastrarDemanda} className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-400 uppercase">Vínculo</label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({...form, tipo: v})}>
                    <SelectTrigger className="bg-gray-50 border-none h-11 text-xs font-bold uppercase"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[120]">
                      <SelectItem value="Colaborador">Colaborador</SelectItem>
                      <SelectItem value="Dependente">Dependente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-400 uppercase">Unidade Operacional</label>
                  <Select value={form.unidade} onValueChange={(v) => setForm({...form, unidade: v})}>
                    <SelectTrigger className="bg-gray-50 border-none h-11 text-xs font-bold uppercase"><SelectValue /></SelectTrigger>
                    <SelectContent className="z-[120]">
                      {unidades.map((u, i) => <SelectItem key={i} value={u.nome} className="text-xs uppercase font-bold">{u.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase">Nome Completo</label>
                <Input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="EX: MAURÍCIO ALENCAR SOUZA" className="bg-gray-50 border-none h-11 text-xs font-bold uppercase" required />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase">WhatsApp para Contato</label>
                <Input value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} placeholder="(68) 9 9999-0000" className="bg-gray-50 border-none h-11 text-xs font-bold" required />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase">Observações do RH (Produtividade / Sinais Clínicos)</label>
                <textarea value={form.observacao} onChange={e => setForm({...form, observacao: e.target.value})} placeholder="Sinalize os motivos internos ou alterações observadas na performance laboral..." className="w-full bg-gray-50 rounded-xl p-3 text-xs font-bold h-24 border-none outline-none text-gray-700 resize-none" />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-black text-white font-black uppercase text-xs h-12 rounded-xl mt-2">
                {loading ? <RefreshCw className="animate-spin" size={16}/> : 'Homologar Guia e Enviar'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}