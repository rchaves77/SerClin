import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  ArrowLeft, Shield, Check, X, KeyRound, Clock, Calendar,
  User, RefreshCw, Trash2, Edit2, Wallet, BarChart3, 
  BellRing, CalendarPlus, FileText, History
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Permissoes() {
  const navigate = useNavigate();
  const [equipe, setEquipe] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  // Estados para controle de edição inline de nome
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState("");

  const carregarEquipe = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('perfis').select('*').order('nome');
      if (error) throw error;
      
      // 🌟 REGRAS DE NEGÓCIO UNIFICADAS: Filtra para focar nos profissionais de atendimento da clínica,
      // mas mantém a secretária Renata caso ela também precise de configurações.
      const equipeFiltrada = (data || []).filter(
        p => p.role !== 'secretaria' || p.nome?.includes('Renata')
      );
      
      setEquipe(equipeFiltrada);
    } catch (err) {
      toast.error("Erro ao carregar dados da equipe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEquipe();
  }, []);

  // 1. Atualiza Nome do Profissional
  const handleSalvarNome = async (id: string) => {
    if (!novoNome.trim()) return toast.error("O nome não pode ficar vazio");
    setAtualizandoId(`${id}-nome`);
    try {
      const { error } = await supabase.from('perfis').update({ nome: novoNome.trim() }).eq('id', id);
      if (error) throw error;
      toast.success("Nome atualizado com sucesso!");
      setEquipe(equipe.map(p => p.id === id ? { ...p, nome: novoNome.trim() } : p));
      setEditandoId(null);
    } catch (err) {
      toast.error("Erro ao atualizar nome");
    } finally {
      setAtualizandoId(null);
    }
  };

  // 2. Controla Chaves de Permissão (Liga/Desliga)
  const togglePermissao = async (userId: string, campo: string, valorAtual: boolean) => {
    setAtualizandoId(`${userId}-${campo}`);
    try {
      const { error } = await supabase.from('perfis').update({ [campo]: !valorAtual }).eq('id', userId);
      if (error) throw error;
      setEquipe(equipe.map(u => u.id === userId ? { ...u, [campo]: !valorAtual } : u));
      toast.success("Acesso atualizado!");
    } catch (err) {
      toast.error("Falha ao salvar permissão no banco");
    } finally {
      setAtualizandoId(null);
    }
  };

  // 3. Controla Nível de Acesso (Role)
  const handleMudarRole = async (id: string, novoRole: string) => {
    setAtualizandoId(`${id}-role`);
    try {
      const { error } = await supabase.from('perfis').update({ role: novoRole }).eq('id', id);
      if (error) throw error;
      toast.success("Nível de acesso alterado!");
      setEquipe(equipe.map(p => p.id === id ? { ...p, role: novoRole } : p));
    } catch (err) {
      toast.error("Erro ao mudar nível");
    } finally {
      setAtualizandoId(null);
    }
  };

  // 4. Controla Cor da Agenda
  const handleMudarCor = async (id: string, novaCor: string) => {
    try {
      const { error } = await supabase.from('perfis').update({ cor: novaCor }).eq('id', id);
      if (error) throw error;
      toast.success("Cor da agenda atualizada!");
      setEquipe(equipe.map(p => p.id === id ? { ...p, cor: novaCor } : p));
    } catch (err) {
      toast.error("Erro ao mudar cor");
    }
  };

  // 5. Controla Expediente Diário (Início / Fim)
  const handleHorarioChange = async (id: string, campo: string, valor: string) => {
    const valorFormatado = valor + ':00';
    setEquipe(equipe.map(p => p.id === id ? { ...p, [campo]: valorFormatado } : p));
    try {
      const { error } = await supabase.from('perfis').update({ [campo]: valorFormatado }).eq('id', id);
      if (error) throw error;
      toast.success("Horário de expediente atualizado!");
    } catch (err) {
      toast.error("Erro ao salvar horário");
      carregarEquipe();
    }
  };

  // 6. Controla Dias Semanais de Atendimento
  const toggleDiaAtendimento = async (id: string, profissional: any, dia: string) => {
    let diasAtuais: string[] = [];
    if (Array.isArray(profissional.dias_atendimento)) {
      diasAtuais = profissional.dias_atendimento;
    } else if (typeof profissional.dias_atendimento === 'string') {
      try { diasAtuais = JSON.parse(profissional.dias_atendimento); } 
      catch { diasAtuais = profissional.dias_atendimento.split(','); }
    }

    const novosDias = diasAtuais.includes(dia)
      ? diasAtuais.filter(d => d !== dia)
      : [...diasAtuais, dia];

    setEquipe(equipe.map(p => p.id === id ? { ...p, dias_atendimento: novosDias } : p));

    try {
      const { error } = await supabase.from('perfis').update({ dias_atendimento: novosDias }).eq('id', id);
      if (error) throw error;
      toast.success(`Agenda de ${dia} modificada!`);
    } catch (err) {
      toast.error("Erro ao salvar dias de atendimento");
      carregarEquipe();
    }
  };

  // 7. Remove Usuário/Profissional
  const handleExcluirUsuario = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente remover o acesso de ${nome}?`)) return;
    try {
      const { error } = await supabase.from('perfis').delete().eq('id', id);
      if (error) throw error;
      toast.success("Usuário removido");
      carregarEquipe();
    } catch (err) {
      toast.error("Erro ao remover usuário");
    }
  };

  const diasSemana = [
    { key: 'SEG', label: 'S' }, { key: 'TER', label: 'T' }, { key: 'QUA', label: 'Q' },
    { key: 'QUI', label: 'Q' }, { key: 'SEX', label: 'S' }, { key: 'SAB', label: 'S' }, { key: 'DOM', label: 'D' }
  ];

  const inputClass = "flex h-11 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all";

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-8 text-left font-sans pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <header className="pt-[calc(env(safe-area-inset-top,0px)+12px)]">
          <button
            onClick={() => navigate("/sistema")}
            className="flex items-center text-[11px] text-gray-500 hover:text-blue-600 mb-2 font-black uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Painel
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                <Shield className="text-emerald-600" size={32} /> Central Unificada de Gestão
              </h1>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Controle total de acessos, dias de atendimento e expediente</p>
            </div>
            <Button 
              onClick={() => navigate("/sistema/usuarios/novo")}
              className="w-full md:w-auto bg-blue-600 hover:bg-black text-white font-black rounded-xl px-6 h-12 shadow-lg transition-all uppercase text-xs"
            >
              Novo Profissional
            </Button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-emerald-600" size={36} /></div>
        ) : (
          <div className="space-y-6">
            {equipe.map((user) => {
              const diasAtendidos = Array.isArray(user.dias_atendimento) 
                ? user.dias_atendimento 
                : (typeof user.dias_atendimento === 'string' ? user.dias_atendimento.split(',') : []);

              return (
                <Card key={user.id} className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
                  
                  {/* CABEÇALHO DO CARD DO PROFISSIONAL */}
                  <div className="bg-gray-900 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-md shrink-0" style={{ backgroundColor: user.cor || '#3b82f6' }}>
                        {user.nome?.substring(0, 2).toUpperCase()}
                      </div>
                      
                      {editandoId === user.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input 
                            type="text" 
                            value={novoNome} 
                            onChange={(e) => setNovoNome(e.target.value)}
                            className="border border-blue-400 rounded-xl px-3 py-1.5 text-sm font-black bg-white text-gray-900 uppercase outline-none w-full max-w-sm"
                            autoFocus
                          />
                          <button onClick={() => handleSalvarNome(user.id)} className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"><Check size={16} /></button>
                          <button onClick={() => setEditandoId(null)} className="p-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600"><X size={16} /></button>
                        </div>
                      ) : (
                        <div className="text-left flex-1 min-w-0 group/name">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-white uppercase text-base truncate tracking-tight">{user.nome}</h3>
                            <button onClick={() => { setEditandoId(user.id); setNovoNome(user.nome || ""); }} className="text-gray-400 hover:text-white transition-colors p-1"><Edit2 size={14} /></button>
                          </div>
                          <span className="text-[11px] font-bold text-gray-400 tracking-wide block truncate">{user.email}</span>
                        </div>
                      )}
                    </div>

                    {/* METADADOS RÁPIDOS (COR, NÍVEL E EXCLUSÃO) */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t border-gray-800 pt-3 sm:pt-0 sm:border-none">
                      <input type="color" value={user.cor || '#3b82f6'} onChange={(e) => handleMudarCor(user.id, e.target.value)} className="w-9 h-9 rounded-xl cursor-pointer border-none p-0 bg-transparent shrink-0" title="Cor na Agenda" />
                      
                      <Select disabled={atualizandoId === `${user.id}-role`} value={user.role || 'profissional'} onValueChange={(val) => handleMudarRole(user.id, val)}>
                        <SelectTrigger className="border-none h-9 font-black text-[11px] uppercase rounded-xl px-4 bg-gray-800 text-white w-32"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="secretaria">Secretária</SelectItem><SelectItem value="profissional">Profissional</SelectItem></SelectContent>
                      </Select>

                      <button onClick={() => handleExcluirUsuario(user.id, user.nome)} className="p-2 text-gray-500 hover:text-red-500 transition-colors shrink-0" title="Remover Profissional"><Trash2 size={20} /></button>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-8">
                    
                    {/* GRADE 1: CHAVES DE PERMISSÃO */}
                    <div className="space-y-4">
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b pb-1 flex items-center gap-1.5"><KeyRound size={14}/> Chaves de Segurança e Operação</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ItemPermissao icon={<CalendarPlus size={18} className="text-blue-600"/>} label="Permitir Agendar" sub="Criação de novos horários" checked={user.permissao_agendar} loading={atualizandoId === `${user.id}-permissao_agendar`} onToggle={() => togglePermissao(user.id, 'permissao_agendar', user.permissao_agendar)} />
                        <ItemPermissao icon={<Wallet size={18} className="text-emerald-600"/>} label="Financeiro Total" sub="Fluxo de Caixa e Repasses" checked={user.permissao_financeiro} loading={atualizandoId === `${user.id}-permissao_financeiro`} onToggle={() => togglePermissao(user.id, 'permissao_financeiro', user.permissao_financeiro)} />
                        <ItemPermissao icon={<BarChart3 size={18} className="text-orange-500"/>} label="Ver Relatórios" sub="Estatísticas e Performance" checked={user.permissao_relatorios} loading={atualizandoId === `${user.id}-permissao_relatorios`} onToggle={() => togglePermissao(user.id, 'permissao_relatorios', user.permissao_relatorios)} />
                        <ItemPermissao icon={<User size={18} className="text-purple-600"/>} label="Gerir Acessos" sub="Configurar permissões da equipe" checked={user.permissao_acessos} loading={atualizandoId === `${user.id}-permissao_acessos`} onToggle={() => togglePermissao(user.id, 'permissao_acessos', user.permissao_acessos)} />
                        <ItemPermissao icon={<BellRing size={18} className="text-indigo-600"/>} label="Confirmar Amanhã" sub="Lista ativa de disparos WhatsApp" checked={user.permissao_confirmacao_amanha} loading={atualizandoId === `${user.id}-permissao_confirmacao_amanha`} onToggle={() => togglePermissao(user.id, 'permissao_confirmacao_amanha', user.permissao_confirmacao_amanha)} />
                        <ItemPermissao icon={<Trash2 size={18} className="text-red-500"/>} label="Editar/Excluir Prontuário" sub="Controle crítico de dados clínicos" checked={user.permissao_excluir} loading={atualizandoId === `${user.id}-permissao_excluir`} onToggle={() => togglePermissao(user.id, 'permissao_excluir', user.permissao_excluir)} />
                        <ItemPermissao icon={<FileText size={18} className="text-teal-600"/>} label="Gerar Atestados" sub="Emissão de PDFs e Documentos" checked={user.permissao_gerar_atestado} loading={atualizandoId === `${user.id}-permissao_gerar_atestado`} onToggle={() => togglePermissao(user.id, 'permissao_gerar_atestado', user.permissao_gerar_atestado)} />
                        <ItemPermissao icon={<History size={18} className="text-gray-600"/>} label="Ver Auditoria" sub="Acesso a logs do sistema" checked={user.permissao_auditoria} loading={atualizandoId === `${user.id}-permissao_auditoria`} onToggle={() => togglePermissao(user.id, 'permissao_auditoria', user.permissao_auditoria)} />
                      </div>
                    </div>

                    {/* REGRAS DE AGENDA (DIAS E EXPEDIENTE CONSOLIDADOS) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                      
                      {/* DIAS SEMANAIS */}
                      <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={14} className="text-blue-600"/> Dias Semanais de Atendimento</p>
                        <div className="flex flex-wrap gap-2 pt-1 justify-between sm:justify-start">
                          {diasSemana.map(dia => {
                            const ativo = diasAtendidos.includes(dia.key);
                            return (
                              <button
                                key={dia.key}
                                type="button"
                                onClick={() => toggleDiaAtendimento(user.id, user, dia.key)}
                                className={`w-11 h-11 rounded-xl font-black text-xs transition-all flex items-center justify-center border uppercase shadow-sm ${ativo ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400 hover:border-blue-300'}`}
                              >
                                {dia.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* HORÁRIOS EXPEDIENTE */}
                      <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-center">
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><Clock size={14} className="text-emerald-600"/> Horário de Expediente Diário</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Início</label>
                            <input type="time" value={user.hora_inicio ? user.hora_inicio.substring(0,5) : "07:00"} onChange={(e) => handleHorarioChange(user.id, 'hora_inicio', e.target.value)} className={inputClass} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Fim</label>
                            <input type="time" value={user.hora_fim ? user.hora_fim.substring(0,5) : "20:00"} onChange={(e) => handleHorarioChange(user.id, 'hora_fim', e.target.value)} className={inputClass} />
                          </div>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemPermissao({ icon, label, sub, checked, onToggle, loading }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all shrink-0">
          {loading ? <RefreshCw size={18} className="animate-spin text-emerald-600" /> : icon}
        </div>
        <div className="text-left">
          <p className="text-[11px] font-black text-gray-800 uppercase leading-none tracking-tight">{label}</p>
          <p className="text-[8px] font-black text-gray-400 uppercase mt-1.5 tracking-tighter leading-none">{sub}</p>
        </div>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onToggle} 
        disabled={loading}
        className="data-[state=checked]:bg-emerald-500 scale-105"
      />
    </div>
  );
}