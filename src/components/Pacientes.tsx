import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  ArrowLeft, Search, UserPlus, Phone, CreditCard, 
  Trash2, FileText, Upload, Calendar, Clock, Clipboard, Star
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PacientesProps {
  setView: (view: string) => void;
  patientId?: string;
}

export function Pacientes({ setView, patientId }: PacientesProps) {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any>(null);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form para novo paciente
  const [isNovoPacienteOpen, setIsNovoPacienteOpen] = useState(false);
  const [novoForm, setNovoForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    convenio: "Particular",
    responsavel_cpf: ""
  });

  const fetchPacientes = async () => {
    const { data } = await supabase.from("pacientes").select("*").order("nome");
    if (data) {
      setPacientes(data);
      if (patientId) {
        const found = data.find((p: any) => p.id === patientId);
        if (found) {
          selecionarPaciente(found);
        }
      }
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, [patientId]);

  const selecionarPaciente = async (paciente: any) => {
    setPacienteSelecionado(paciente);
    
    // Buscar consultas (agendamentos) do médico/geral desse paciente
    const { data: ags } = await supabase
      .from("agendamentos")
      .select("*")
      .eq("paciente_id", paciente.id)
      .order("data_inicio", { ascending: false });
    if (ags) setConsultas(ags);

    // Buscar prontuários/arquivos anexados
    const { data: docs } = await supabase
      .from("arquivos")
      .select("*")
      .eq("paciente_id", paciente.id);
    if (docs) setDocumentos(docs);
  };

  const handleCreatePaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoForm.nome || !novoForm.telefone) return toast.error("Por favor preencha nome e WhatsApp.");
    setLoading(true);
    const { data, error } = await supabase.from("pacientes").insert([{
      ...novoForm,
      nome: novoForm.nome.toUpperCase()
    }]);
    setLoading(false);
    if (!error) {
      toast.success("Paciente cadastrado com sucesso!");
      setIsNovoPacienteOpen(false);
      setNovoForm({ nome: "", cpf: "", telefone: "", convenio: "Particular", responsavel_cpf: "" });
      fetchPacientes();
    } else {
      toast.error("Erro ao cadastrar paciente.");
    }
  };

  const handleDeletePaciente = async (id: string) => {
    if (!confirm("⚠️ Atenção: Excluir o paciente apagará permanentemente todos os seus agendamentos e prontuários. Confirmar exclusão?")) return;
    const { error } = await supabase.from("pacientes").delete().eq("id", id);
    if (!error) {
      toast.success("Paciente removido do sistema.");
      setPacienteSelecionado(null);
      fetchPacientes();
    }
  };

  const uploadProntuario = async () => {
    const nomeDoc = prompt("Nome/Descrição do Documento:");
    if (!nomeDoc) return;
    
    const { error } = await supabase.from("arquivos").insert([{
      paciente_id: pacienteSelecionado.id,
      tipo_documento: nomeDoc,
      nome_arquivo: `${nomeDoc.replace(/\s+/g, "_")}.pdf`,
      url_arquivo: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      created_at: new Date().toISOString()
    }]);

    if (!error) {
      toast.success("Arquivo de Prontuário anexado com sucesso!");
      selecionarPaciente(pacienteSelecionado);
    }
  };

  const pacientesFiltrados = pacientes.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (p.cpf && p.cpf.includes(busca)) ||
    (p.telefone && p.telefone.includes(busca))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans space-y-8 text-left mt-20 animate-in fade-in duration-500 min-h-screen pb-24">
      
      {/* HEADER PRINCIPAL */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setView('acessos')} 
            className="rounded-full border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar ao Painel
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#0a2d54] uppercase flex items-center gap-2">
              <Clipboard className="text-[#bfa571]" size={30} /> Prontuários e Família
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase mt-1 tracking-widest">Base de Dados de Pacientes e Triagens</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsNovoPacienteOpen(true)}
          className="bg-blue-600 hover:bg-[#bfa571] text-white rounded-2xl h-12 px-6 font-black uppercase text-xs shadow-lg transition-all border-none cursor-pointer flex items-center gap-2"
        >
          <UserPlus size={16} /> Adicionar Paciente
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: LISTA E BUSCA (Lg: 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Nome, CPF ou Telefone..." 
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="pl-10 h-12 bg-white border-gray-200 shadow-sm rounded-xl font-bold uppercase text-xs"
            />
          </div>

          <Card className="shadow-sm border-gray-100 overflow-hidden bg-white max-h-[70vh] overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {pacientesFiltrados.map(p => (
                <button
                  key={p.id}
                  onClick={() => selecionarPaciente(p)}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors border-none flex items-center gap-4 cursor-pointer ${pacienteSelecionado?.id === p.id ? 'bg-blue-50/70 border-l-4 border-l-[#0a2d54]' : ''}`}
                >
                  <div className="h-10 w-10 rounded-full bg-[#0a2d54] text-white text-xs font-black flex items-center justify-center shrink-0">
                    {p.nome.substring(0,2).toUpperCase()}
                  </div>
                  <div className="truncate flex-1">
                    <p className="font-black text-xs uppercase text-gray-800 truncate leading-snug">{p.nome}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{p.convenio || "Particular"}</p>
                  </div>
                </button>
              ))}
              {pacientesFiltrados.length === 0 && (
                <div className="p-8 text-center text-gray-400 italic text-xs font-bold uppercase">Nenhum paciente encontrado.</div>
              )}
            </div>
          </Card>
        </div>

        {/* COLUNA DIREITA: PRONTUÁRIO COMPLETO (Lg: 8 cols) */}
        <div className="lg:col-span-8">
          {pacienteSelecionado ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* CARD DETALHES GERAIS */}
              <Card className="rounded-[2.5rem] bg-white border-none shadow-sm overflow-hidden text-left">
                <div className="p-6 md:p-8 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-5 text-left">
                    <div className="h-16 w-16 md:h-18 md:w-18 rounded-[1.5rem] bg-[#0a2d54] flex items-center justify-center text-white font-black text-2xl shadow-md border-2 border-[#bfa571]/20 shrink-0">
                      {pacienteSelecionado.nome.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-black text-[#0a2d54] uppercase tracking-tight leading-none">{pacienteSelecionado.nome}</h2>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-black uppercase tracking-wider">{pacienteSelecionado.convenio || "Particular"}</span>
                        {pacienteSelecionado.cpf && (
                          <span className="text-[10px] text-gray-500 font-black uppercase">CPF: {pacienteSelecionado.cpf}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => handleDeletePaciente(pacienteSelecionado.id)}
                    className="text-red-500 hover:bg-red-50 rounded-xl h-10 px-4 font-black uppercase text-[10px] cursor-pointer"
                  >
                    <Trash2 size={16} className="mr-1.5" /> Excluir Paciente
                  </Button>
                </div>

                <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  {/* Informações de Contato / Responsáveis */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-1.5">
                      <Star size={13} className="text-[#bfa571]" /> Dados Cadastrais
                    </h3>
                    <div className="space-y-4 font-black text-xs text-gray-700">
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-[#bfa571] shrink-0" />
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase">WhatsApp / Contato</p>
                          <p className="text-sm mt-0.5">{pacienteSelecionado.telefone || "Sem telefone cadastrado"}</p>
                        </div>
                      </div>
                      {pacienteSelecionado.responsavel_cpf && (
                        <div className="flex items-center gap-3">
                          <CreditCard size={16} className="text-blue-500 shrink-0" />
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase">CPF do Responsável Legal</p>
                            <p className="text-sm mt-0.5">{pacienteSelecionado.responsavel_cpf}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações Rápidas */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2">Funções Clínicas</h3>
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={uploadProntuario}
                        className="bg-[#0a2d54] hover:bg-[#bfa571] text-white rounded-xl h-12 font-black uppercase text-xs w-full cursor-pointer flex justify-center items-center gap-2"
                      >
                        <Upload size={16} /> Anexar Prontuário Clínico (PDF)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ABAS / SEÇÕES DE HISTÓRICO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                {/* HISTÓRICO DE CONSULTAS / EVOLUÇÕES */}
                <Card className="rounded-3xl bg-white border-none shadow-sm overflow-hidden">
                  <div className="p-5 border-b bg-gray-50 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-700" />
                    <h4 className="font-black text-[#0a2d54] uppercase tracking-wider text-xs">Evoluções & Consultas ({consultas.length})</h4>
                  </div>
                  <CardContent className="p-4 space-y-3 max-h-[40vh] overflow-y-auto">
                    {consultas.map(c => (
                      <div key={c.id} className="p-4 bg-slate-50/50 rounded-2xl border border-gray-100 flex flex-col text-left gap-1 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(new Date(c.data_inicio), "dd/MM/yyyy")} às {format(new Date(c.data_inicio), "HH:mm")}</span>
                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${c.status === "Presenca" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{c.status || "Agendado"}</span>
                        </div>
                        <p className="font-black text-xs text-slate-800 uppercase leading-snug mt-1">Sala {c.sala_id} • Conduzido por: {c.profissional_nome}</p>
                        {c.observacao && (
                          <div className="bg-white p-2.5 rounded-xl border border-dotted border-gray-200 text-[11px] text-gray-500 font-bold mt-1 max-h-16 overflow-y-auto leading-relaxed">{c.observacao}</div>
                        )}
                      </div>
                    ))}
                    {consultas.length === 0 && (
                      <div className="p-10 text-center text-gray-400 italic text-xs font-bold uppercase">Nenhum atendimento histórico.</div>
                    )}
                  </CardContent>
                </Card>

                {/* HISTÓRICO DE DOCUMENTOS EMITIDOS / ANEXADOS */}
                <Card className="rounded-3xl bg-white border-none shadow-sm overflow-hidden">
                  <div className="p-5 border-b bg-gray-50 flex items-center gap-2">
                    <FileText size={16} className="text-[#bfa571]" />
                    <h4 className="font-black text-[#0a2d54] uppercase tracking-wider text-xs">Atestados, Prontuários & PDF ({documentos.length})</h4>
                  </div>
                  <CardContent className="p-4 space-y-3 max-h-[40vh] overflow-y-auto">
                    {documentos.map(d => (
                      <div key={d.id} className="p-4 bg-slate-50/50 rounded-2xl border border-gray-100 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                        <div className="text-left flex-1 min-w-0">
                          <p className="font-black text-xs text-[#0a2d54] uppercase truncate leading-none">{d.tipo_documento}</p>
                          <span className="text-[8px] text-gray-400 font-bold mt-1 block uppercase">{d.created_at ? format(new Date(d.created_at), "dd/MM/yyyy • HH:mm") : ""}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(d.url_arquivo, "_blank")}
                          className="font-black text-[9px] uppercase tracking-widest text-[#0a2d54] h-9 px-3 border-gray-200 rounded-xl cursor-pointer"
                        >
                          Visualizar
                        </Button>
                      </div>
                    ))}
                    {documentos.length === 0 && (
                      <div className="p-10 text-center text-gray-400 italic text-xs font-bold uppercase">Nenhum documento anexado.</div>
                    )}
                  </CardContent>
                </Card>

              </div>

            </div>
          ) : (
            <div className="bg-[#0a2d54]/5 rounded-[2.5rem] border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center h-full min-h-[50vh]">
              <Clipboard size={48} className="text-[#0a2d54] opacity-20 mb-4 animate-bounce" />
              <h3 className="font-black text-[#0a2d54] uppercase text-sm leading-none tracking-widest">Selecione um Paciente</h3>
              <p className="text-xs font-bold text-gray-400 uppercase mt-2 max-w-sm">Busque ou clique em um paciente na barra lateral para acessar o histórico clínico completo.</p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL ADICIONAR PACIENTE */}
      {isNovoPacienteOpen && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[420px] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b flex justify-between items-center text-left">
              <h3 className="font-black uppercase text-sm tracking-wider text-[#0a2d54]">Novo Cadastro de Paciente</h3>
              <button onClick={() => setIsNovoPacienteOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer border-none bg-transparent">
                X
              </button>
            </div>
            <form onSubmit={handleCreatePaciente} className="p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase pl-1">Nome Completo</label>
                <Input value={novoForm.nome} onChange={e => setNovoForm({...novoForm, nome: e.target.value})} placeholder="EX: ANA DE SOUZA" required className="font-bold uppercase" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase pl-1">WhatsApp / Telefone</label>
                <Input value={novoForm.telefone} onChange={e => setNovoForm({...novoForm, telefone: e.target.value})} placeholder="EX: (68) 9 9216-1717" required className="font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase pl-1">CPF (Opcional)</label>
                <Input value={novoForm.cpf} onChange={e => setNovoForm({...novoForm, cpf: e.target.value})} placeholder="EX: 123.456.789-00" className="font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase pl-1">Convênio</label>
                <Input value={novoForm.convenio} onChange={e => setNovoForm({...novoForm, convenio: e.target.value})} placeholder="Particular, Bradesco, Unimed..." className="font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase pl-1">CPF Responsável (Menores de idade)</label>
                <Input value={novoForm.responsavel_cpf} onChange={e => setNovoForm({...novoForm, responsavel_cpf: e.target.value})} placeholder="EX: 123.456.789-00" className="font-bold" />
              </div>

              <div className="pt-4 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsNovoPacienteOpen(false)} className="flex-1 rounded-xl font-bold h-11 uppercase text-[10px] cursor-pointer">Fechar</Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-[#bfa571] text-white rounded-xl font-black h-11 uppercase text-[10px] cursor-pointer border-none">{loading ? "Salvando..." : "Salvar"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
