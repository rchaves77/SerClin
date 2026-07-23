import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, GraduationCap, AlertTriangle, ArrowLeft, RefreshCw, 
  User, CheckSquare, Square, FileText
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import logoSer2 from "@/assets/ser2.png";

// Opções de checklists baseadas nos sinais preditivos do Hub Neuroeducacional
const SINAIS_RISCO_PADRAO = [
  { id: "foco", label: "Oscilação brusca de foco / desatenção extrema" },
  { id: "comportamento", label: "Comportamento disruptivo ou agressividade atípica" },
  { id: "isolamento", label: "Isolamento social ou choro sem causa aparente" },
  { id: "rendimento", label: "Queda acentuada no rendimento das avaliações" },
  { id: "execucao", label: "Dificuldade extrema na execução de comandos simples" },
];

export function AlertaProfessor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Estados de controle e dados
  const [escolaInfo, setEscolaInfo] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);
  
  // Form do Alerta
  const [professorNome, setProfessorNome] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState("");
  const [sinaisMarcados, setSinaisMarcados] = useState<string[]>([]);
  const [descricaoLivre, setDescricaoLivre] = useState("");

  useEffect(() => {
    const carregarDadosProfessor = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return navigate('/login');

        // =========================================================================
        // 🛠️ CONFIGURAÇÃO DE AMBIENTE: PRODUÇÃO VS TESTE LOCAL
        // =========================================================================
        
        // MODO PRODUÇÃO (Descomente as linhas abaixo quando for para a Vercel):
        const { data: perfil } = await supabase.from('perfis').select('escola_id, nome').eq('email', user.email).single();
        if (perfil?.nome) setProfessorNome(perfil.nome);
        const escolaId = perfil?.escola_id;

        // MODO TESTE LOCAL (Basta colar o UUID gerado na tabela 'schools' do seu Supabase):
        // setProfessorNome("PROFESSOR DE TESTE");
        // const escolaId = "COLE_AQUI_O_ID_DA_SUA_ESCOLA_MOCK";

        // =========================================================================

        if (!escolaId) {
          toast.error("Professor sem escola vinculada no sistema.");
          return;
        }

        // Busca dados cadastrais da Escola
        const { data: escola } = await supabase.from('schools').select('*').eq('id', escolaId).single();
        setEscolaInfo(escola);

        // Busca Alunos vinculados a esta escola (Corrigido escopo de escolaId)
        const { data: listaAlunos } = await supabase.from('school_students').select('*').eq('school_id', escolaId).order('name');
        setAlunos(listaAlunos || []);

      } catch (err) {
        toast.error("Erro ao carregar ecossistema do professor.");
      }
    };

    carregarDadosProfessor();
  }, [navigate]);

  const toggleSinal = (id: string) => {
    if (sinaisMarcados.includes(id)) {
      setSinaisMarcados(sinaisMarcados.filter(item => item !== id));
    } else {
      setSinaisMarcados([...sinaisMarcados, id]);
    }
  };

  const handleDispararAlerta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoSelecionado) return toast.error("Selecione o estudante em observação.");
    if (sinaisMarcados.length === 0 && !descricaoLivre.trim()) {
      return toast.error("Marque ao menos um sinal clínico de risco ou descreva o episódio.");
    }

    setLoading(true);
    try {
      // Dispara o alerta preditivo para a tabela do Supabase
      const { error } = await supabase.from('neuro_alerts').insert([{
        school_id: escolaInfo?.id,
        student_id: alunoSelecionado,
        reporter_name: professorNome.toUpperCase(),
        observed_signs: sinaisMarcados,
        description: descricaoLivre, // Corrigido erro de digitação
        status: 'Pendente'
      }]);

      if (error) throw error;

      // Altera dinamicamente o termômetro do aluno para "Alerta" se houver sinais críticos
      await supabase.from('school_students').update({ status: 'Alerta' }).eq('id', alunoSelecionado);

      toast.success("Alerta Preditivo disparado com sucesso para a equipe SerClin!", {
        description: "Nossos especialistas multidisciplinares analisarão o caso imediatamente."
      });
      
      // Retorna para a tela de monitoramento da escola
      navigate('/escola');
    } catch (err) {
      toast.error("Erro ao processar o envio do Alerta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-gray-50 flex flex-col font-sans overflow-hidden text-left">
      
      {/* HEADER DE NAVEGAÇÃO RÁPIDA */}
      <header className="bg-white border-b px-4 md:px-8 shadow-sm z-50 sticky top-0 w-full pt-[var(--safe-top)] shrink-0">
        <div className="flex justify-between items-center h-[95px] max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/escola')} className="text-gray-500 hover:text-[#1e3a8a] bg-gray-100 rounded-xl h-11 w-11">
              <ArrowLeft size={20} strokeWidth={3} />
            </Button>
            <div className="flex flex-col text-left">
              <h1 className="text-sm md:text-lg font-black text-[#1e3a8a] uppercase leading-none tracking-tighter">Sinalizar Risco Cognitivo</h1>
              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{escolaInfo?.name || 'Hub Neuroeducacional'}</p>
            </div>
          </div>
          <img src={logoSer2} className="w-12 h-12 object-contain" alt="SerClin" />
        </div>
      </header>

      {/* FORMULÁRIO RESPONSIVO DO PROFESSOR */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-[700px] mx-auto w-full text-left no-scrollbar pb-10">
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden p-6 md:p-8">
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-800">
            <AlertTriangle className="shrink-0 mt-0.5 text-amber-600" size={20} strokeWidth={3} />
            <div className="text-xs font-bold leading-relaxed">
              <span className="font-black uppercase block mb-0.5">Atenção Professor:</span>
              Preencha este formulário de triagem digital ao notar variações nítidas e repetitivas de aprendizado ou comportamento no aluno. Esse alerta aciona a equipe do Instituto SerClin em tempo real.
            </div>
          </div>

          <form onSubmit={handleDispararAlerta} className="space-y-6">
            {/* Campo 1: Seleção do Aluno */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Selecione o Estudante</label>
              <Select onValueChange={setAlunoSelecionado} required>
                <SelectTrigger className="bg-gray-50 border-none h-12 text-xs font-bold uppercase tracking-tight text-gray-700">
                  <SelectValue placeholder="SELECIONAR ALUNO DA TURMA..." />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {alunos.map(aluno => (
                    <SelectItem key={aluno.id} value={aluno.id} className="uppercase text-xs font-bold text-gray-600">
                      {aluno.name} — <span className="text-blue-500">{aluno.grade}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campo 2: Checklist Estilizado de Sinais */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Sinais Neurocognitivos / Comportamentais Observados</label>
              <div className="space-y-2">
                {SINAIS_RISCO_PADRAO.map((sinal) => {
                  const marcado = sinaisMarcados.includes(sinal.id);
                  return (
                    <div 
                      key={sinal.id} 
                      onClick={() => toggleSinal(sinal.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                        marcado 
                          ? 'bg-blue-50/70 border-blue-200 text-[#1e3a8a] font-black' 
                          : 'bg-gray-50/50 border-gray-100 text-gray-600 font-bold hover:bg-gray-50'
                      }`}
                    >
                      {marcado 
                        ? <CheckSquare size={20} className="text-[#1e3a8a] shrink-0" strokeWidth={3} /> 
                        : <Square size={20} className="text-gray-300 shrink-0" />
                      }
                      <span className="text-xs uppercase tracking-tight text-left">{sinal.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campo 3: Descrição de Texto Livre */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Descrição Resumida do Episódio ou Comportamento</label>
              <textarea 
                value={descricaoLivre} 
                onChange={e => setDescricaoLivre(e.target.value)}
                placeholder="Descreva brevemente fatores adicionais, como gatilhos da crise, reações em sala de aula ou interações com colegas..."
                className="w-full bg-gray-50 rounded-2xl p-4 text-xs font-bold h-28 border-none outline-none text-gray-700 resize-none placeholder:text-gray-300 border border-transparent focus:bg-white focus:border-gray-200 transition-all"
              />
            </div>

            {/* Ação de Disparo */}
            <Button type="submit" disabled={loading} className="w-full bg-[#1e3a8a] hover:bg-black text-white font-black uppercase text-xs h-14 rounded-2xl shadow-xl tracking-widest transition-all active:scale-[0.98]">
              {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Disparar Alerta ao SerClin'}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}