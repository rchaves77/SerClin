import { useState, useEffect } from 'react';
import { 
  ArrowLeft, RefreshCw, 
  Wallet, BarChart3, CalendarPlus, BellRing, FileText, History, Trash2, ShieldAlert
} from "lucide-react";
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface GestaoPermissoesProps {
  setView: (view: string) => void;
}

export function GestaoPermissoes({ setView }: GestaoPermissoesProps) {
  const navigate = (path: string) => {
    if (path === "/sistema/acessos") {
      setView("acessos"); // back to dashboard
    } else {
      setView("acessos");
    }
  };

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('perfis').select('*').order('nome');
      if (error) throw error;
      setUsuarios(data || []);
    } catch (err) {
      toast.error("Erro ao carregar permissões");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const togglePermissao = async (userId: string, campo: string, valorAtual: boolean) => {
    setAtualizandoId(`${userId}-${campo}`);
    try {
      const { error } = await supabase
        .from('perfis')
        .update({ [campo]: !valorAtual })
        .eq('id', userId);

      if (error) throw error;
      
      setUsuarios(usuarios.map(u => u.id === userId ? { ...u, [campo]: !valorAtual } : u));
      toast.success("Acesso atualizado!");
    } catch (err) {
      toast.error("Falha ao salvar no banco");
    } finally {
      setAtualizandoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-8 text-left font-sans pb-24 mt-20">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER SAFE AREA IPHONE */}
        <header className="pt-[calc(env(safe-area-inset-top,0px)+12px)]">
          <button
            onClick={() => navigate("/sistema/acessos")}
            className="flex items-center text-[10px] text-gray-500 hover:text-blue-600 mb-2 font-black uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                <ShieldAlert className="text-emerald-600" size={32} /> Central de Chaves
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Controle unitário de funções SerClin</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-blue-600" size={32} /></div>
        ) : (
          <div className="space-y-6">
            {usuarios.map((user) => (
              <Card key={user.id} className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
                {/* TOPO DO CARD DO USUÁRIO */}
                <div className="bg-gray-50/80 px-6 py-5 border-b flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-md" style={{ backgroundColor: user.cor || '#3b82f6' }}>
                      {user.nome?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <h3 className="font-black text-gray-800 uppercase text-sm leading-tight">{user.nome}</h3>
                      <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase">{user.role}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* COLUNA 1: MENU E ÍCONES */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">Visibilidade de Ícones</p>
                      <ItemPermissao 
                        icon={<Wallet size={18} className="text-emerald-500"/>} 
                        label="Financeiro" 
                        sub="Wallet, Receipt, Calculator, Scale"
                        checked={user.permissao_financeiro}
                        loading={atualizandoId === `${user.id}-permissao_financeiro`}
                        onToggle={() => togglePermissao(user.id, 'permissao_financeiro', user.permissao_financeiro)}
                      />
                      <ItemPermissao 
                        icon={<BarChart3 size={18} className="text-orange-500"/>} 
                        label="Relatórios" 
                        sub="Acesso ao BarChart"
                        checked={user.permissao_relatorios}
                        loading={atualizandoId === `${user.id}-permissao_relatorios`}
                        onToggle={() => togglePermissao(user.id, 'permissao_relatorios', user.permissao_relatorios)}
                      />
                      <ItemPermissao 
                        icon={<BellRing size={18} className="text-blue-500"/>} 
                        label="Botão Amanhã" 
                        sub="Lista de Confirmação"
                        checked={user.permissao_confirmacao_amanha}
                        loading={atualizandoId === `${user.id}-permissao_confirmacao_amanha`}
                        onToggle={() => togglePermissao(user.id, 'permissao_confirmacao_amanha', user.permissao_confirmacao_amanha)}
                      />
                    </div>

                    {/* COLUNA 2: AÇÕES CLÍNICAS */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">Operação Clínica</p>
                      <ItemPermissao 
                        icon={<CalendarPlus size={18} className="text-blue-700"/>} 
                        label="Permitir Agendar" 
                        sub="Novo Agendamento"
                        checked={user.permissao_agendar}
                        loading={atualizandoId === `${user.id}-permissao_agendar`}
                        onToggle={() => togglePermissao(user.id, 'permissao_agendar', user.permissao_agendar)}
                      />
                      <ItemPermissao 
                        icon={<FileText size={18} className="text-indigo-500"/>} 
                        label="Gerar Arquivos" 
                        sub="Atestados e Declarações"
                        checked={user.permissao_gerar_atestado}
                        loading={atualizandoId === `${user.id}-permissao_gerar_atestado`}
                        onToggle={() => togglePermissao(user.id, 'permissao_gerar_atestado', user.permissao_gerar_atestado)}
                      />
                    </div>

                    {/* COLUNA 3: SEGURANÇA */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">Dados e Segurança</p>
                      <ItemPermissao 
                        icon={<History size={18} className="text-gray-600"/>} 
                        label="Ver Auditoria" 
                        sub="Histórico de Logs"
                        checked={user.permissao_auditoria}
                        loading={atualizandoId === `${user.id}-permissao_auditoria`}
                        onToggle={() => togglePermissao(user.id, 'permissao_auditoria', user.permissao_auditoria)}
                      />
                      <ItemPermissao 
                        icon={<Trash2 size={18} className="text-red-500"/>} 
                        label="Excluir Dados" 
                        sub="Apagar Registros/Pacientes"
                        checked={user.permissao_excluir}
                        loading={atualizandoId === `${user.id}-permissao_excluir`}
                        onToggle={() => togglePermissao(user.id, 'permissao_excluir', user.permissao_excluir)}
                      />
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Auxiliar para o Switch
function ItemPermissao({ icon, label, sub, checked, onToggle, loading }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
          {loading ? <RefreshCw size={18} className="animate-spin text-blue-600" /> : icon}
        </div>
        <div className="text-left">
          <p className="text-[11px] font-black text-gray-800 uppercase leading-none">{label}</p>
          <p className="text-[8px] font-bold text-gray-400 uppercase mt-1 tracking-tighter">{sub}</p>
        </div>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onToggle} 
        disabled={loading}
        className="data-[state=checked]:bg-emerald-500"
      />
    </div>
  );
}
