import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, CheckCircle2, AlertCircle, ShieldCheck, Palette, Lock, Mail, User, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function CadastroUsuario() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [role, setRole] = useState("profissional");
  const [cor, setCor] = useState("#3b82f6"); // Azul SerClin padrão
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. FORMATAR EMAIL
      const emailFormatado = email.toLowerCase().trim();

      // 2. BUSCAR SE JÁ EXISTE ESSE EMAIL NA TABELA DE PERFIS
      const { data: perfilExistente } = await supabase
        .from('perfis')
        .select('email')
        .eq('email', emailFormatado)
        .maybeSingle();

      if (perfilExistente) {
        throw new Error("User already registered");
      }

      // 3. INSERIR NA TABELA DE PERFIS
      const { error: perfilError } = await supabase
        .from('perfis')
        .insert([
          { 
            nome: nome, 
            email: emailFormatado, 
            role: role,
            cor: cor 
          }
        ]);

      if (perfilError) throw perfilError;

      toast.success(`Profissional ${nome} pré-cadastrado com sucesso!`, {
        icon: <CheckCircle2 className="text-green-500" />,
      });
      
      // Limpa os campos do formulário
      setEmail("");
      setPassword("");
      setNome("");
      setRole("profissional");
      setCor("#3b82f6");

      // Opcional: Redireciona de volta após o sucesso para não precisar clicar em voltar
      setTimeout(() => {
        navigate("/sistema/usuarios");
      }, 1500);

    } catch (error: any) {
      console.error("Erro no cadastro SerClin:", error);
      
      let mensagemErro = "Ocorreu um erro ao processar o cadastro.";
      // 🌟 CORRIGIDO: De 'messageErro' para 'mensagemErro'
      if (error.message === "User already registered" || error.code === "23505") {
        mensagemErro = "Este e-mail já está em uso no sistema.";
      }

      toast.error("Falha no Cadastro", {
        description: mensagemErro, // Aqui já estava correto
        icon: <AlertCircle className="text-red-500" />,
      });
      // garante que o loading seja desativado em caso de erro
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-left font-sans pb-10">
      <div className="max-w-2xl mx-auto">
        
        {/* 🌟 CORRIGIDO: Agora volta perfeitamente para a listagem de profissionais sem ir para a Home */}
        <button
          onClick={() => navigate("/sistema/usuarios")}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors font-black uppercase tracking-widest pt-[calc(env(safe-area-inset-top,0px)+10px)]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Profissionais
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
                  className="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-xs font-black text-white hover:bg-black transition-all shadow-xl uppercase tracking-widest disabled:opacity-50"
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
