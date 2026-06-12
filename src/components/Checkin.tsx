import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  CheckCircle, Search, Clock, ArrowRight, User, 
  CalendarDays, FileText, ShoppingBag, History, Camera, LogOut,
  Check, Brain, AlertTriangle, BookOpen, Play, 
  ExternalLink, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SerclinLogo from "./SerclinLogo";
import { format, startOfDay, endOfDay, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

// FALLBACK TYPOGRAPHY ICON INSTEAD of MISSING IMAGE
const logoSer2 = "";

const planosSerClin = [
  { nome: "Protocolo Essencial", preco: "99,90", desc: "A porta de entrada para o seu autocuidado.", destaque: null, link: "https://invoice.infinitepay.io/plans/instituto-serclin/wCZ4iNP4x", itens: ["Atendimento Quinzenal", "Sessões de até 40 minutos", "Acolhimento pontual", "Orientação básica"] },
  { nome: "Protocolo Acolher", preco: "149,90", desc: "Manutenção emocional com suporte regular.", destaque: null, link: "https://invoice.infinitepay.io/plans/instituto-serclin/7VchlOCeiX", itens: ["Atendimento Quinzenal", "Sessões de 50 minutos", "Suporte via WhatsApp", "Horários diferenciados"] },
  { nome: "Protocolo Cuidado Premium", preco: "189,90", desc: "Para quem busca ferramentas práticas de evolução.", destaque: "MAIS PROCURADO", link: "https://invoice.infinitepay.io/plans/instituto-serclin/7Vcj15B2cN", itens: ["Atendimento Quinzenal (50 min)", "Exercícios de fixação entre sessões", "Curadoria de materiais (livros/vídeos)", "Devolutiva verbal trimestral"] },
  { nome: "Protocolo Mente Brilhante", preco: "249,90", desc: "Foco total em desempenho cognitivo e estudos.", destaque: null, link: "https://invoice.infinitepay.io/plans/instituto-serclin/7VclVHytVV", itens: ["Ideal para estudantes/concurseiros", "Treino de memória e foco", "Organização de rotina de estudos", "Material PDF exclusivo"] },
  { nome: "Protocolo Jornada Contínua", preco: "319,90", desc: "Acelere resultados com acompanhamento semanal.", destaque: null, link: "https://invoice.infinitepay.io/plans/instituto-serclin/JOrjMk9CT", itens: ["Atendimento Semanal (4 sessões/mês)", "Relatório de Evolução Semestral", "Monitoramento contínuo de metas", "1 Sessão Bônus a cada 6 meses"] },
  { nome: "Protocolo Família Prestige", preco: "1.200,00", desc: "Cuidado integral para o seu maior patrimônio.", destaque: "EXCLUSIVO FAMÍLIA", link: "https://invoice.infinitepay.io/plans/instituto-serclin/1FbTSP1Qcr", itens: ["Cobertura para até 4 pessoas", "Terapias Semanais para todos", "Reunião mensal de alinhamento familiar", "Cuidado completo", "Sessões mensais não cumulativas"] },
];

// DADOS DOS E-BOOKS (ESTILO NETFLIX)
const ebooksSerClin = [
  { id: 1, titulo: "Entendendo o TDAH", subtitulo: "Guia prático para pais", cor: "from-[#0a2d54] to-slate-905" },
  { id: 2, titulo: "Rotinas Saudáveis", subtitulo: "Autismo no dia a dia", cor: "from-amber-500 to-orange-600" },
  { id: 3, titulo: "Regulação Emocional", subtitulo: "Exercícios em casa", cor: "from-emerald-500 to-teal-700" },
  { id: 4, titulo: "A Magia do Brincar", subtitulo: "Ludoterapia essencial", cor: "from-purple-600 to-indigo-800" },
];

export function Checkin() {
  const [identificacao, setIdentificacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [telaAtiva, setTelaAtiva] = useState<0 | 1>(0);
  const [abaAtiva, setAbaAtiva] = useState<"inicio" | "historico" | "servicos" | "perfil">("inicio");
  const [paciente, setPaciente] = useState<any>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [arquivos, setArquivos] = useState<any[]>([]); // INJETADO
  const [consultaHoje, setConsultaHoje] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FUNÇÃO INJETADA
  const carregarArquivos = async (pacienteId: any) => {
    const { data } = await supabase
      .from("pacientes_arquivos")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("created_at", { ascending: false });
    if (data) setArquivos(data);
  };

  // VIGIA DE ATUALIZAÇÃO
  useEffect(() => {
    if (paciente?.id && abaAtiva === "perfil") {
      carregarArquivos(paciente.id);
    }
  }, [abaAtiva, paciente?.id]);

  // --- MÁSCARA INTELIGENTE ---
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length <= 9) {
      v = v.replace(/^(\d{4,5})(\d{4})$/, "$1-$2");
    } else if (v.length === 10) {
      v = v.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (v.length === 11) {
      if (v[0] !== "0" && v[2] === "9") {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      } else {
        v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      }
    }
    setIdentificacao(v);
  };

  const entrarNoPortal = async (e: FormEvent) => {
    e.preventDefault();
    const limpo = identificacao.replace(/\D/g, "");
    
    if (limpo.length < 8) return toast.error("Digite o número completo (mínimo de 8 dígitos).");

    setLoading(true);
    try {
      const { data: todosPacientes, error: errPac } = await supabase.from("pacientes").select("*");
      if (errPac || !todosPacientes) throw errPac;

      const pEncontrado = todosPacientes.find(p => {
        const cpf = (p.cpf || "").replace(/\D/g, "");
        const resp = (p.responsavel_cpf || "").replace(/\D/g, "");
        const tel = (p.telefone || "").replace(/\D/g, "");
        if (cpf === limpo || resp === limpo) return true;
        if (tel && (tel === limpo || tel.endsWith(limpo))) return true;
        return false;
      });

      if (!pEncontrado) {
        toast.error("Cadastro não encontrado. Verifique o número ou fale com a recepção.");
        setLoading(false);
        return;
      }

      setPaciente(pEncontrado);
      
      // --- AJUSTADO: ADICIONADO AWAIT PARA GARANTIR A CARGA ---
      await carregarArquivos(pEncontrado.id); 

      const { data: meusAgendamentos, error: errAg } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("paciente_id", pEncontrado.id)
        .order("data_inicio", { ascending: false });

      if (!errAg && meusAgendamentos) {
        setAgendamentos(meusAgendamentos);
        const hojeInicio = startOfDay(new Date());
        const hojeFim = endOfDay(new Date());
        const hoje = meusAgendamentos.find((ag: any) => {
          const d = new Date(ag.data_inicio);
          return d >= hojeInicio && d <= hojeFim;
        });
        setConsultaHoje(hoje || null);
      }
      setTelaAtiva(1);
    } catch (error) {
      toast.error("Erro no sistema.");
    } finally {
      setLoading(false);
    }
  };

  const confirmarChegada = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("agendamentos").update({ status: "Presenca" }).eq("id", consultaHoje.id);
      if (error) throw error;
      setConsultaHoje({ ...consultaHoje, status: "Presenca" });
      toast.success("Recepção notificada com sucesso!");
    } catch (error) {
      toast.error("Erro ao confirmar presença.");
    } finally {
      setLoading(false);
    }
  };

  const handleFotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setLoading(true);
      try {
        const { error } = await supabase.from("pacientes").update({ foto_url: base64String }).eq("id", paciente.id);
        if (error) throw error;
        setPaciente({ ...paciente, foto_url: base64String });
        toast.success("Foto de perfil atualizada!");
      } catch (err) {
        toast.error("Erro ao salvar foto.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const sair = () => {
    setPaciente(null);
    setIdentificacao("");
    setTelaAtiva(0);
    setAbaAtiva("inicio");
  };

  // --- FUNÇÃO PARA COMPRAR SERVIÇO COM REDIRECIONAMENTO INTELIGENTE ---
  const handleComprarServico = (nomeDoServico: string, linkCheckout?: string) => {
    if (linkCheckout && linkCheckout.startsWith("http")) {
      window.open(linkCheckout, "_blank");
      return;
    }

    const telefoneClinica = "5568992161717"; 
    const mensagem = `Olá! Sou o(a) paciente *${paciente?.nome.trim()}* e tenho interesse em contratar o *${nomeDoServico}* pelo Portal SerClin. Podem me passar as orientações?`;
    const url = `https://wa.me/${telefoneClinica}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const consultasFuturas = agendamentos.filter(ag => isAfter(new Date(ag.data_inicio), endOfDay(new Date())));
  const consultasPassadas = agendamentos.filter(ag => isBefore(new Date(ag.data_inicio), startOfDay(new Date())));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased selection:bg-blue-100 relative overflow-hidden text-left mt-[60px]" id="checkin-portal-root">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      {/* --- TELA 0: LOGIN --- */}
      {telaAtiva === 0 && (
        <div className="flex-1 flex items-center justify-center p-4 py-12 md:py-24">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-8 md:p-10 relative z-10 border border-gray-100 text-center">
            <div className="flex flex-col items-center mb-8">
              <SerclinLogo variant="vertical" className="mb-4" />
              <h1 className="text-xl font-black text-[#0a2d54] uppercase tracking-tighter mt-2">Portal do Paciente</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Seu Espaço SerClin</p>
            </div>

            <form onSubmit={entrarNoPortal} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefone, CPF do Paciente ou Responsável</label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-300 pointer-events-none" />
                  <Input type="tel" required placeholder="Digite os números..." value={identificacao} onChange={handleInput} className="bg-gray-50 border-none h-14 pl-12 text-sm font-bold rounded-2xl text-gray-700 w-full" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#0a2d54] hover:bg-[#bfa571] text-white font-black uppercase tracking-widest h-14 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none">
                {loading ? "Acessando..." : <>Entrar no Portal <ArrowRight size={18} /></>}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* --- TELA 1: PORTAL INTERNO --- */}
      {telaAtiva === 1 && paciente && (
        <div className="flex-1 flex flex-col z-10 w-full max-w-md mx-auto bg-white shadow-2xl min-h-screen relative pb-24">
          
          <div className="bg-[#0a2d54] px-6 pt-12 pb-6 text-white rounded-b-[2rem] shadow-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center overflow-hidden">
                  {paciente.foto_url ? <img src={paciente.foto_url} alt="Perfil" className="w-full h-full object-cover" /> : <User size={24} className="text-white" />}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#dfca9e] uppercase tracking-widest">Bem-vindo (a),</p>
                <h2 className="text-lg font-black uppercase leading-tight text-white">{paciente.nome.split(" ")[0]}</h2>
              </div>
            </div>
            <button onClick={sair} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition cursor-pointer">
              <LogOut size={18} className="text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* ABA: INÍCIO */}
            {abaAtiva === "inicio" && (
              <div className="space-y-6 animate-in fade-in">
                <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest">Consulta de Hoje</h3>
                
                {consultaHoje ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 relative overflow-hidden shadow-sm text-left">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="text-blue-500" size={20} />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Horário</p>
                        <p className="text-base font-black text-[#1e3a8a]">{format(new Date(consultaHoje.data_inicio), "HH:mm", { locale: ptBR })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <User className="text-blue-500" size={20} />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Profissional</p>
                        <p className="text-sm font-bold text-[#1e3a8a]">{consultaHoje.profissional_nome}</p>
                      </div>
                    </div>

                    {consultaHoje.status === "Presenca" || consultaHoje.status === "Presença" ? (
                      <div className="bg-emerald-100 text-emerald-700 font-black uppercase tracking-widest h-12 rounded-xl flex items-center justify-center gap-2 text-[11px]">
                        <CheckCircle size={18} /> Recepção Avisada
                      </div>
                    ) : (
                      <Button onClick={confirmarChegada} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest h-14 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer border-none">
                        {loading ? "Avisando..." : "Cheguei na Clínica"}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 text-center">
                    <CalendarDays size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-xs font-bold text-gray-400 uppercase">Você não tem consultas agendadas para hoje.</p>
                  </div>
                )}

                {consultasFuturas.length > 0 && (
                  <div className="pt-4 text-left">
                    <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest mb-4">Próximos Agendamentos</h3>
                    <div className="space-y-3">
                      {consultasFuturas.map(ag => (
                        <div key={ag.id} className="bg-white border rounded-2xl p-4 flex justify-between items-center shadow-sm">
                          <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase">{format(new Date(ag.data_inicio), "dd/MM/yyyy")}</p>
                            <p className="text-sm font-bold text-gray-700">{ag.profissional_nome}</p>
                          </div>
                          <span className="font-black text-gray-800">{format(new Date(ag.data_inicio), "HH:mm")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ABA: HISTÓRICO */}
            {abaAtiva === "historico" && (
              <div className="space-y-4 animate-in fade-in text-left">
                <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest mb-4">Meu Histórico Clínico</h3>
                {consultasPassadas.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-10 font-bold uppercase">Nenhum histórico encontrado.</p>
                ) : (
                  consultasPassadas.map(ag => {
                    const isFalta = ag.status === "Falta";
                    return (
                      <div key={ag.id} className={`bg-white border rounded-2xl p-4 shadow-sm ${isFalta ? "opacity-60" : ""}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">{format(new Date(ag.data_inicio), "dd/MM/yyyy 'às' HH:mm")}</p>
                            <p className="text-sm font-bold text-gray-800 uppercase">{ag.profissional_nome}</p>
                          </div>
                          <span className={`text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-widest ${isFalta ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                            {isFalta ? "Falta" : "Concluído"}
                          </span>
                        </div>
                        <Button variant="outline" className="w-full h-10 text-[10px] font-black uppercase text-blue-600 border-blue-100 bg-blue-50/50 flex gap-2 rounded-xl cursor-pointer">
                          <FileText size={14} /> Ver Laudo / Evolução
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ABA: SERVIÇOS (NETFLIX + OFICINA + PROTOCOLOS) */}
            {abaAtiva === "servicos" && (
              <div className="space-y-8 animate-in fade-in pb-4 text-left">
                
                {/* SECÇÃO 1: E-BOOKS (Estilo Netflix) */}
                <div className="space-y-3">
                  <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest flex items-center gap-2">
                    <BookOpen size={18} className="text-amber-500"/> E-books SerClin
                  </h3>
                  
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {ebooksSerClin.map((ebook) => (
                      <div key={ebook.id} className={`min-w-[140px] h-[200px] rounded-2xl bg-gradient-to-br ${ebook.cor} p-4 flex flex-col justify-end relative shadow-lg snap-center shrink-0 group cursor-pointer hover:scale-105 transition-transform`} onClick={() => toast.info("Visualizador em PDF carregando...")}>
                        <div className="absolute inset-0 bg-black/20 rounded-2xl group-hover:bg-transparent transition-colors"></div>
                        <div className="relative z-10 text-left">
                          <p className="text-[9px] font-black text-white/80 uppercase tracking-widest mb-1">{ebook.subtitulo}</p>
                          <h4 className="text-sm font-black text-white leading-tight mb-3">{ebook.titulo}</h4>
                          <button className="bg-white text-gray-900 text-[10px] font-black uppercase px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md cursor-pointer border-none">
                            <Play size={10} fill="currentColor" /> Ler
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECÇÃO 2: OFICINA DAS EMOÇÕES (Destaque) */}
                <div className="space-y-3">
                  <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest">Serviços Especiais</h3>
                  <div className="bg-gradient-to-r from-orange-400 to-amber-500 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-20">
                      <User size={100} />
                    </div>
                    <h4 className="font-black uppercase text-xl mb-1 relative z-10">Oficina das Emoções</h4>
                    <p className="text-xs font-bold text-orange-55 uppercase mb-4 w-4/5 relative z-10">
                      Desenvolvimento infantil através da ludoterapia em grupo. Em breve novas turmas!
                    </p>
                    <Button 
                      onClick={() => handleComprarServico("Oficina das Emoções (Lista de Espera)")}
                      className="bg-white text-orange-600 hover:bg-orange-50 font-black text-[10px] uppercase h-10 rounded-xl relative z-10 shadow-sm cursor-pointer border-none"
                    >
                      Entrar na Lista
                    </Button>
                  </div>
                </div>

                {/* SECÇÃO 3: PROTOCOLOS DE CUIDADOS */}
                <div className="space-y-4 pt-2">
                  <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest">Protocolos de Cuidados</h3>
                  
                  <div className="bg-gradient-to-br from-primary to-brand-blue-dark border border-[#0a2d54]/60 rounded-3xl p-6 shadow-md relative overflow-hidden text-left">
                    <div className="absolute -right-4 -top-4 opacity-10">
                      <Brain size={120} className="text-white" />
                    </div>
                    <h4 className="font-black text-[#dfca9e] uppercase text-sm mb-3 flex items-center gap-2">
                      <AlertTriangle size={18} /> Benefício Exclusivo
                    </h4>
                    <p className="text-xs font-medium text-slate-200 leading-relaxed mb-5">
                      A partir do <strong>3º mês</strong> de protocolo ativo, adquire o direito de realizar a <strong>Avaliação Neuropsicológica</strong> por um valor especial de <strong>R$ 850,00</strong>.
                    </p>
                    
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm relative z-10">
                      <p className="text-[12px] font-black text-[#dfca9e] uppercase tracking-widest mb-2">Regras de Utilização:</p>
                      <ul className="text-[12px] text-blue-50 space-y-2 ml-4 list-disc font-medium">
                        <li>O benefício é pessoal e <strong>intransferível</strong>.</li>
                        <li>No protocolo <strong>Família Prestige</strong>, a regra aplica-se igualmente: cada membro registado no protocolo paga a sua própria avaliação (R$ 850,00 cada).</li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {planosSerClin.map((plano, idx) => (
                      <div key={idx} className={`bg-white rounded-3xl shadow-sm border ${plano.destaque ? "border-[#bfa571] ring-2 ring-[#bfa571]/20" : "border-gray-100"} p-6 relative overflow-hidden`}>
                        
                        {plano.destaque && (
                          <div className="absolute top-0 right-0 bg-[#bfa571] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm">
                            {plano.destaque}
                          </div>
                        )}

                        <h4 className="font-black text-[#0a2d54] text-lg mb-1">{plano.nome}</h4>
                        <p className="text-[14px] text-gray-500 font-medium mb-4 pr-10 h-8">{plano.desc}</p>
                        
                        <div className="flex items-end gap-1 mb-5">
                          <span className="text-sm font-bold text-gray-400">R$</span>
                          <span className="text-3xl font-black text-[#0a2d54] leading-none">{plano.preco}</span>
                          <span className="text-xs font-bold text-gray-400 mb-1">/mês</span>
                        </div>

                        <div className="space-y-3 mb-6">
                          {plano.itens.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="mt-0.5 bg-[#bfa571]/10 rounded-full p-0.5 shrink-0">
                                <Check size={10} className="text-[#9e814d] font-bold" />
                              </div>
                              <p className="text-[14px] font-medium text-gray-700 leading-snug">{item}</p>
                            </div>
                          ))}
                        </div>

                        <Button 
                          onClick={() => handleComprarServico(plano.nome, plano.link)}
                          className={`w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border-none ${plano.destaque ? "bg-[#bfa571] hover:bg-[#9e814d] text-white shadow-md shadow-[#bfa571]/20" : "bg-gray-100 hover:bg-gray-200 text-[#0a2d54]"}`}
                        >
                          Quero este Protocolo
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ABA: PERFIL */}
            {abaAtiva === "perfil" && (
              <div className="space-y-6 animate-in fade-in text-center">
                <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest text-left mb-6">Meu Cadastro</h3>
                
                <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <div className="relative mb-4 group">
                    <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                      {paciente.foto_url ? <img src={paciente.foto_url} alt="Perfil" className="w-full h-full object-cover" /> : <User size={40} className="text-gray-300" />}
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFotoUpload} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-colors cursor-pointer border-none">
                      <Camera size={18} />
                    </button>
                  </div>
                  <h2 className="text-lg font-black uppercase text-gray-800">{paciente.nome}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Clique na câmera para alterar a foto</p>
                </div>

                {/* INJETADO: LISTA DE DOCUMENTOS E LAUDOS */}
                <div className="space-y-4">
                  <h3 className="font-black text-gray-800 uppercase text-[12px] tracking-[0.2em] flex items-center gap-2 px-2 text-left">
                    <FileText size={16} className="text-blue-600"/> Meus Documentos e Laudos
                  </h3>
                  
                  {arquivos.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {arquivos.map((doc) => (
                        <div key={doc.id} className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between text-left">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                              <FileText size={20} />
                            </div>
                            <div className="max-w-[180px]">
                              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{doc.tipo_documento || "Documento"}</p>
                              <p className="text-[11px] font-bold text-gray-700 truncate">{doc.nome_arquivo}</p>
                            </div>
                          </div>
                          <a 
                            href={doc.url_arquivo} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-3 bg-white text-blue-600 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex-shrink-0"
                          >
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-10 text-center border-2 border-dashed border-gray-100">
                      <FileText className="mx-auto text-gray-200 mb-2" size={32} />
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                        Nenhum documento <br/> disponível para visualização.
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-3">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Telefone / WhatsApp</p>
                    <p className="text-sm font-bold text-gray-700">
                      {paciente.telefone 
                        ? paciente.telefone.replace(/\D/g, "").length === 11 
                          ? paciente.telefone.replace(/\D/g, "").replace(/(\d{2})(\d)(\d{4})(\d{4})/, "($1) $2 $3-$4")
                          : paciente.telefone.replace(/\D/g, "").replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
                        : "Não informado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Convênio</p>
                    <p className="text-sm font-bold text-gray-700">{paciente.convenio || "Particular"}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* BOTTOM TAB MENU */}
          <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 pb-4 pt-2 px-4 flex justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <button onClick={() => setAbaAtiva("inicio")} className={`flex flex-col items-center p-2 w-16 transition-colors cursor-pointer bg-transparent border-none ${abaAtiva === "inicio" ? "text-[#0a2d54] font-bold" : "text-gray-400"}`}>
              <CalendarDays size={22} className="mb-1" />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">Início</span>
            </button>
            <button onClick={() => setAbaAtiva("historico")} className={`flex flex-col items-center p-2 w-16 transition-colors cursor-pointer bg-transparent border-none ${abaAtiva === "historico" ? "text-[#0a2d54] font-bold" : "text-gray-400"}`}>
              <History size={22} className="mb-1" />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">Histórico</span>
            </button>
            <button onClick={() => setAbaAtiva("servicos")} className={`flex flex-col items-center p-2 w-16 transition-colors cursor-pointer bg-transparent border-none ${abaAtiva === "servicos" ? "text-[#0a2d54] font-bold" : "text-gray-400"}`}>
              <ShoppingBag size={22} className="mb-1" />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">Serviços</span>
            </button>
            <button onClick={() => setAbaAtiva("perfil")} className={`flex flex-col items-center p-2 w-16 transition-colors cursor-pointer bg-transparent border-none ${abaAtiva === "perfil" ? "text-[#0a2d54] font-bold" : "text-gray-400"}`}>
              <User size={22} className="mb-1" />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">Perfil</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
