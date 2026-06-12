import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { ArrowLeft, UserPlus, CheckCircle2, AlertCircle, ShieldCheck, Palette, Lock, Mail, User, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CadastroUsuarioProps {
  setView: (view: string) => void;
}

export function CadastroUsuario({ setView }: CadastroUsuarioProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [role, setRole] = useState("profissional");
  const [cor, setCor] = useState("#3b82f6"); // Azul SerClin padrão
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Criar o usuário na Autenticação (Auth)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: nome },
        },
      });

      if (error) throw error;

      // 2. Inserir ou Atualizar o Perfil na tabela 'perfis'
      if (data?.user) {
        const { error: perfilError } = await supabase
          .from("perfis")
          .upsert([
            { 
              id: data.user.id, 
              nome: nome, 
              email: email.toLowerCase().trim(), 
              role: role,
              cor: cor 
            }
          ], { onConflict: "id" });

        if (perfilError) throw perfilError;

        toast.success(`Profissional ${nome} criado com sucesso!`, {
          icon: <CheckCircle2 className="text-green-500" />,
        });
        
        setEmail("");
        setPassword("");
        setNome("");
        setRole("profissional");
        setCor("#3b82f6");
        
        // Go back to accesses
        setView("acessos");
      }
    } catch (error: any) {
      console.error("Erro no cadastro SerClin:", error);
      
      let mensagemErro = "Ocorreu um erro ao processar o cadastro.";
      if (error.message === "User already registered") {
        mensagemErro = "Este e-mail já está em uso no sistema.";
      }

      toast.error("Falha no Cadastro", {
        description: mensagemErro,
        icon: <AlertCircle className="text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-left font-sans pb-10 mt-[60px]" id="cadastro-usuario-view-wrapper">
      <div className="max-w-2xl mx-auto">
        
        {/* BOTÃO VOLTAR */}
        <button
          onClick={() => setView("acessos")}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors font-black uppercase tracking-widest cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Acessos
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                <UserPlus size={28} />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">Novo Profissional</h1>
                <p className="text-[11px] text-gray-400 font-bold uppercase mt-1 tracking-wider font-mono">SerClin ID Management</p>
              </div>
            </div>
          </div>

          <div className="p-8 text-left">
            <form onSubmit={handleCadastro} className="space-y-6">
              
              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} className="text-blue-600" /> Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dra. Helenara Chaves"
                  className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm font-bold uppercase focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} className="text-blue-600" /> E-mail de Acesso
                </label>
                <input
                  type="email"
                  placeholder="nome@institutoserclin.com"
                  className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} className="text-blue-600" /> Nível de Acesso
                  </label>
                  <select
                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="profissional">PROFISSIONAL</option>
                    <option value="secretaria">SECRETÁRIA</option>
                    <option value="admin">ADMINISTRADOR</option>
                  </select>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={14} className="text-blue-600" /> Cor na Agenda
                  </label>
                  <div className="flex gap-3 items-center h-12 px-4 border border-gray-200 rounded-xl bg-gray-50/50">
                    <input
                      type="color"
                      className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                      value={cor}
                      onChange={(e) => setCor(e.target.value)}
                    />
                    <span className="text-xs font-black text-gray-500 uppercase font-mono">{cor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={14} className="text-blue-600" /> Senha Provisória
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-xs font-black text-white hover:bg-black transition-all shadow-xl uppercase tracking-widest disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Finalizar Cadastro
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
