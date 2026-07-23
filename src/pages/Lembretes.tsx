import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle, Calendar as CalendarIcon, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Lembretes() {
  const navigate = useNavigate();
  const [agendamentosAmanha, setAgendamentosAmanha] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAmanha = async () => {
    setLoading(true);
    const amanha = addDays(new Date(), 1);
    const inicioDia = new Date(amanha.setHours(0, 0, 0, 0)).toISOString();
    const fimDia = new Date(amanha.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .gte("data_inicio", inicioDia)
      .lte("data_inicio", fimDia)
      .order("data_inicio", { ascending: true });

    if (!error) setAgendamentosAmanha(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAmanha(); }, []);

  const enviarMensagem = (ag: any) => {
    const tel = ag.paciente_telefone?.replace(/\D/g, "");
    if (!tel) return toast.error("Paciente sem telefone cadastrado.");

    const hora = format(new Date(ag.data_inicio), "HH:mm");
    const data = format(new Date(ag.data_inicio), "dd/MM");
    
    const msg = `Olá, *${ag.paciente_nome}*! Confirmamos seu horário no *Instituto SerClin* amanhã, dia ${data} às ${hora}. Podemos confirmar sua presença?`;
    
    window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-left font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/sistema")} className="gap-2 pl-0 font-bold uppercase text-xs text-gray-500 hover:bg-transparent">
          <ArrowLeft size={18} /> Voltar ao Painel
        </Button>

        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Confirmações de Amanhã</h1>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
              {format(addDays(new Date(), 1), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-xl shadow-lg">
            {agendamentosAmanha.length}
          </div>
        </header>

        <div className="grid gap-4">
          {loading ? (
            <p className="p-10 text-center font-bold text-gray-400 animate-pulse">Buscando agenda...</p>
          ) : agendamentosAmanha.length === 0 ? (
            <Card className="p-10 text-center border-dashed border-2 border-gray-200 bg-transparent">
              <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Nenhum agendamento para amanhã.</p>
            </Card>
          ) : (
            agendamentosAmanha.map((ag) => (
              <Card key={ag.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden rounded-2xl">
                <CardContent className="p-0 flex items-center">
                  <div className="bg-blue-600 w-2 h-20 shrink-0" />
                  <div className="p-5 flex-1 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horário</p>
                      <p className="text-lg font-black text-gray-800">{format(new Date(ag.data_inicio), "HH:mm")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paciente</p>
                      <p className="font-bold text-gray-700 uppercase truncate">{ag.paciente_nome}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => enviarMensagem(ag)}
                        className="bg-green-500 hover:bg-green-600 text-white font-black uppercase text-[10px] tracking-widest h-10 px-6 rounded-full gap-2 shadow-sm"
                      >
                        <MessageCircle size={16} /> Enviar Lembrete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}