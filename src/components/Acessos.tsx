import { useState, useEffect } from "react";
import { 
  ArrowLeft, UserPlus, Shield, Trash2, 
  RefreshCw, KeyRound
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AcessosProps {
  setView: (view: string) => void;
}

export function Acessos({ setView }: AcessosProps) {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("perfis").select("*").order("nome");
      if (error) throw error;
      setUsuarios(data || []);
    } catch (err) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleMudarRole = async (id: string, novoRole: string) => {
    setAtualizandoId(id);
    try {
      const { error } = await supabase.from("perfis").update({ role: novoRole }).eq("id", id);
      if (error) throw error;
      toast.success("Nível de acesso atualizado!");
      fetchUsuarios();
    } catch (err) {
      toast.error("Erro ao atualizar nível");
    } finally {
      setAtualizandoId(null);
    }
  };

  const handleMudarCor = async (id: string, novaCor: string) => {
    try {
      const { error } = await supabase.from("perfis").update({ cor: novaCor }).eq("id", id);
      if (error) throw error;
      toast.success("Cor da agenda atualizada!");
      setUsuarios(usuarios.map(u => u.id === id ? { ...u, cor: novaCor } : u));
    } catch (err) {
      toast.error("Erro ao mudar cor");
    }
  };

  const handleResetSenha = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
      if (error) throw error;
      toast.success("E-mail de redefinição enviado!");
    } catch (err) {
      toast.error("Erro ao enviar e-mail.");
    }
  };

  const handleExcluirUsuario = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente remover o acesso de ${nome}?`)) return;
    try {
      const { error } = await supabase.from("perfis").delete().eq("id", id);
      if (error) throw error;
      toast.success("Usuário removido");
      fetchUsuarios();
    } catch (err) {
      toast.error("Erro ao remover usuário");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-8 text-left font-sans pb-20 mt-[60px]" id="acessos-view-wrapper">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
          <div>
            <button
              onClick={() => setView("home")}
              className="flex items-center text-[10px] text-gray-500 hover:text-blue-600 mb-2 transition-colors font-black uppercase tracking-widest cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Início / Capa
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
              <Shield className="text-purple-600 animate-pulse" size={28} />
              Gestão de Acessos
            </h1>
          </div>

          <Button 
            onClick={() => setView("cadastro-usuario")}
            className="w-full md:w-auto bg-blue-600 hover:bg-black text-white font-black rounded-xl px-6 h-12 shadow-lg transition-all flex items-center justify-center gap-2 uppercase text-xs cursor-pointer"
          >
            <UserPlus size={18} />
            Novo Profissional
          </Button>
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-blue-600" size={32} /></div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* VERSÃO MOBILE EM CARDS / DESKTOP EM TABELA */}
            <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Profissional</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Cor</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nível</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {usuarios.map((user) => (
                        <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full flex items-center justify-center font-black text-white uppercase text-xs border-2 border-white shadow-sm" style={{ backgroundColor: user.cor || "#3b82f6" }}>
                                {user.nome?.substring(0, 2)}
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="font-black text-gray-800 uppercase text-sm">{user.nome}</span>
                                <span className="text-xs text-gray-400">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-2">
                              <input type="color" value={user.cor || "#3b82f6"} onChange={(e) => handleMudarCor(user.id, e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none p-0 overflow-hidden bg-transparent" />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Select disabled={atualizandoId === user.id} value={user.role || "profissional"} onValueChange={(val) => handleMudarRole(user.id, val)}>
                              <SelectTrigger className="border-none h-9 font-black text-[10px] uppercase rounded-full px-4 bg-gray-100"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="secretaria">Secretária</SelectItem>
                                <SelectItem value="profissional">Profissional</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => handleResetSenha(user.email)} className="p-2 text-gray-300 hover:text-orange-500 cursor-pointer"><KeyRound size={18} /></button>
                              <button onClick={() => handleExcluirUsuario(user.id, user.nome)} className="p-2 text-gray-300 hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* VISUALIZAÇÃO MOBILE (CARDS) */}
                <div className="md:hidden divide-y divide-gray-100">
                  {usuarios.map((user) => (
                    <div key={user.id} className="p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-white uppercase text-sm shadow-md" style={{ backgroundColor: user.cor || "#3b82f6" }}>
                          {user.nome?.substring(0, 2)}
                        </div>
                        <div className="flex flex-col text-left flex-1 min-w-0">
                          <span className="font-black text-gray-800 uppercase text-sm truncate">{user.nome}</span>
                          <span className="text-[10px] text-gray-400 truncate">{user.email}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl flex flex-col gap-1">
                          <label className="text-[8px] font-black text-gray-400 uppercase">Cor da Agenda</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={user.cor || "#3b82f6"} onChange={(e) => handleMudarCor(user.id, e.target.value)} className="w-6 h-6 rounded-md border-none" />
                            <span className="text-[9px] font-mono font-bold text-gray-500">{user.cor || "#3b82f6"}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl flex flex-col gap-1">
                          <label className="text-[8px] font-black text-gray-400 uppercase">Nível</label>
                          <Select disabled={atualizandoId === user.id} value={user.role || "profissional"} onValueChange={(val) => handleMudarRole(user.id, val)}>
                            <SelectTrigger className="border-none h-6 p-0 bg-transparent font-black text-[10px] uppercase shadow-none"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="secretaria">Secretária</SelectItem>
                              <SelectItem value="profissional">Profissional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => handleResetSenha(user.email)} variant="outline" className="flex-1 h-10 rounded-xl text-[9px] font-black uppercase border-orange-100 text-orange-600 cursor-pointer">
                          <KeyRound size={14} className="mr-2"/> Reset Senha
                        </Button>
                        <Button onClick={() => handleExcluirUsuario(user.id, user.nome)} variant="outline" className="h-10 w-12 rounded-xl border-red-100 text-red-500 cursor-pointer">
                          <Trash2 size={16}/>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
