import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ArrowLeft, Clock, Save, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HorariosProps {
  setView: (view: string) => void;
}

export function Horarios({ setView }: HorariosProps) {
  const navigate = (path: string) => {
    if (path === "/sistema") {
      setView("acessos");
    } else {
      setView("acessos");
    }
  };

  const [equipe, setEquipe] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarEquipe = async () => {
    const { data, error } = await supabase.from('perfis').select('*').order('nome');
    if (!error && data) {
      // Filtra para não mostrar a recepção geral nas configurações individuais (opcional)
      const profissionais = data.filter((p: any) => p.role !== 'secretaria' || p.nome.includes('Renata'));
      setEquipe(profissionais);
    }
  };

  useEffect(() => {
    carregarEquipe();
  }, []);

  const handleChange = (id: string, campo: string, valor: string) => {
    setEquipe(equipe.map(p => p.id === id ? { ...p, [campo]: valor } : p));
  };

  const salvarHorarios = async () => {
    setLoading(true);
    try {
      // Salva um por um no banco
      for (const p of equipe) {
        const { error } = await supabase
          .from('perfis')
          .update({ 
            hora_inicio: p.hora_inicio || '07:00:00', 
            hora_fim: p.hora_fim || '20:00:00' 
          })
          .eq('id', p.id);
        
        if (error) throw error;
      }
      toast.success("Horários atualizados com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-black text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-left mt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 pt-[calc(env(safe-area-inset-top,0px)+24px)] md:pt-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/sistema")} className="p-2 -ml-2 text-gray-400 hover:text-green-600 transition-colors cursor-pointer">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-800 flex items-center gap-2 uppercase tracking-tighter">
                <Clock className="text-green-600" size={24}/> Gestão de Horários
              </h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Configuração da Agenda por Profissional</p>
            </div>
          </div>
          <Button onClick={salvarHorarios} disabled={loading} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-2xl shadow-lg transition-all cursor-pointer border-none">
            {loading ? "Salvando..." : <><Save size={16} className="mr-2"/> Salvar Alterações</>}
          </Button>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-gray-600">
            <UserCheck size={18} />
            <h2 className="font-black uppercase tracking-widest text-xs">Equipe Clínica</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {equipe.map((prof) => (
              <div key={prof.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-green-50/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-black text-lg shadow-inner">
                    {prof.nome.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm">{prof.nome}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{prof.role === 'admin' ? 'Gestor' : 'Profissional'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="space-y-1 flex-1 md:w-32">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Início</label>
                    <input 
                      type="time" 
                      value={prof.hora_inicio ? prof.hora_inicio.substring(0,5) : "07:00"} 
                      onChange={(e) => handleChange(prof.id, 'hora_inicio', e.target.value + ':00')}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1 flex-1 md:w-32">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Fim</label>
                    <input 
                      type="time" 
                      value={prof.hora_fim ? prof.hora_fim.substring(0,5) : "20:00"} 
                      onChange={(e) => handleChange(prof.id, 'hora_fim', e.target.value + ':00')}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
