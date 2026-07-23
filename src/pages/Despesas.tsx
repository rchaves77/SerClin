import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Receipt, Plus, Trash2, CheckCircle, 
  AlertCircle, Calendar, ArrowLeft, RefreshCw 
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

export function Despesas() {
  const navigate = useNavigate();
  const [despesas, setDespesas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    descricao: "",
    recebedor: "",
    valor: "",
    data_vencimento: format(new Date(), "yyyy-MM-dd"),
    forma_pagamento: "Pix",
    categoria: "Geral"
  });

  const fetchDespesas = async () => {
    const { data } = await supabase
      .from("despesas")
      .select("*")
      .order("data_vencimento", { ascending: true });
    if (data) setDespesas(data);
  };

  useEffect(() => { fetchDespesas(); }, []);

  const handleAddDespesa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("despesas").insert([{
      ...form,
      valor: parseFloat(form.valor.replace(",", "."))
    }]);
    setLoading(false);
    if (error) {
      toast.error("Erro ao salvar despesa.");
    } else {
      toast.success("Despesa registrada!");
      setForm({ 
        descricao: "", 
        recebedor: "", 
        valor: "", 
        data_vencimento: format(new Date(), "yyyy-MM-dd"), 
        forma_pagamento: "Pix",
        categoria: "Geral" 
      });
      fetchDespesas();
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Pago" ? "Pendente" : "Pago";
    const { error } = await supabase.from("despesas").update({ 
      status: newStatus,
      data_pagamento: newStatus === "Pago" ? new Date().toISOString() : null 
    }).eq("id", id);
    if (!error) fetchDespesas();
  };

  const deleteDespesa = async (id: string) => {
    if (!confirm("Excluir esta despesa permanentemente?")) return;
    const { error } = await supabase.from("despesas").delete().eq("id", id);
    if (!error) {
      toast.success("Despesa excluída.");
      fetchDespesas();
    }
  };

  const totalPendente = despesas.filter(d => d.status === "Pendente").reduce((acc, d) => acc + d.valor, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans space-y-8 animate-in fade-in duration-500 text-left">
      
      {/* CABEÇALHO COM BOTÃO VOLTAR E RESUMO */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/sistema')} 
            className="rounded-full border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-black text-[#1e3a8a] uppercase flex items-center gap-3">
              <Receipt className="text-red-500" size={28} /> Gestão de Despesas
            </h1>
            <p className="text-gray-500 text-sm mt-1">Controle de saídas e vencimentos da SerClin.</p>
          </div>
        </div>
        
        <Card className="bg-red-50 border-red-100 px-6 py-3 shadow-sm">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Total Pendente</p>
          <p className="text-2xl font-black text-red-600">{formatCurrency(totalPendente)}</p>
        </Card>
      </header>

      {/* FORMULÁRIO DE CADASTRO CONSOLIDADO */}
      <Card className="shadow-sm border-gray-100 overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b">
          <CardTitle className="text-xs font-black text-gray-400 uppercase">Nova Despesa / Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleAddDespesa} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-1 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Descrição</label>
              <Input value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} placeholder="Ex: Aluguel" required className="h-10 font-bold" />
            </div>
            <div className="md:col-span-1 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Recebedor</label>
              <Input value={form.recebedor} onChange={e => setForm({...form, recebedor: e.target.value})} placeholder="Nome" required className="h-10 font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Valor (R$)</label>
              <Input type="number" step="0.01" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="0,00" required className="h-10 font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Vencimento</label>
              <Input type="date" value={form.data_vencimento} onChange={e => setForm({...form, data_vencimento: e.target.value})} required className="h-10 font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Forma</label>
              <Select value={form.forma_pagamento} onValueChange={v => setForm({...form, forma_pagamento: v})}>
                <SelectTrigger className="h-10 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Cartão">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="bg-[#1e3a8a] hover:bg-black h-10 font-black uppercase text-xs">
              {loading ? <RefreshCw className="animate-spin" /> : "Lançar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* TABELA DE GESTÃO COMPLETA */}
      <Card className="shadow-sm border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 border-b">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4">Forma</th>
                <th className="px-6 py-4">Descrição / Recebedor</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-bold">
              {despesas.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors ${item.status === 'Pago' ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(item.id, item.status)} 
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${item.status === 'Pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 hover:bg-emerald-50'}`}
                    >
                      {item.status === 'Pago' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {item.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-300" /> 
                      {format(new Date(item.data_vencimento), "dd/MM/yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 uppercase text-[10px]">{item.forma_pagamento}</td>
                  <td className="px-6 py-4">
                    <p className="font-black text-[#1e3a8a] uppercase text-xs">{item.descricao}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.recebedor}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{formatCurrency(item.valor)}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => deleteDespesa(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {despesas.length === 0 && (
            <div className="p-10 text-center text-gray-400 italic text-sm">Nenhuma despesa lançada.</div>
          )}
        </div>
      </Card>
    </div>
  );
}