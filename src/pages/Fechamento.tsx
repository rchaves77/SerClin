import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, Printer, TrendingUp, TrendingDown, 
  Scale, CheckCircle, Receipt, Wallet 
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

export function Fechamento() {
  const navigate = useNavigate();
  const [dataFiltro, setDataFiltro] = useState(format(new Date(), "yyyy-MM-dd"));
  const [entradas, setEntradas] = useState<any[]>([]);
  const [saidas, setSaidas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDados = async () => {
    setLoading(true);
    
    // Início e fim do dia para busca no Supabase
    const inicioDia = `${dataFiltro}T00:00:00Z`;
    const fimDia = `${dataFiltro}T23:59:59Z`;

    // Buscar Entradas (Atendimentos confirmados no dia)
    const { data: atends } = await supabase
      .from("agendamentos")
      .select("*")
      .eq("status", "Presenca")
      .gte("data_inicio", inicioDia)
      .lte("data_inicio", fimDia);

    // Buscar Saídas (Despesas pagas no dia)
    const { data: desp } = await supabase
      .from("despesas")
      .select("*")
      .eq("status", "Pago")
      .eq("data_pagamento", dataFiltro);

    if (atends) setEntradas(atends);
    if (desp) setSaidas(desp);
    setLoading(false);
  };

  useEffect(() => { 
    fetchDados(); 
  }, [dataFiltro]);

  const totalEntradas = entradas.reduce((acc, curr) => acc + (curr.valor_atendimento || 0), 0);
  const totalSaidas = saidas.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const saldoFinal = totalEntradas - totalSaidas;

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans space-y-8 text-left animate-in fade-in duration-500">
      
      {/* HEADER COM NAVEGAÇÃO E FILTRO */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/sistema')} 
            className="rounded-full border-gray-200 hover:bg-gray-100 transition-all"
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-black text-[#1e3a8a] uppercase flex items-center gap-3">
              <Scale className="text-blue-600" size={28} /> Fechamento de Caixa
            </h1>
            <p className="text-gray-500 text-sm mt-1">Resumo operacional diário da SerClin.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Input 
            type="date" 
            value={dataFiltro} 
            onChange={(e) => setDataFiltro(e.target.value)} 
            className="font-bold w-44 bg-white shadow-sm h-10"
          />
          <Button onClick={() => window.print()} variant="outline" className="h-10 text-gray-400 hover:text-blue-600">
            <Printer size={20} />
          </Button>
        </div>
      </header>

      {/* CARDS DE RESUMO FINANCEIRO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-emerald-50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Entradas Confirmadas</CardTitle>
            <TrendingUp size={16} className="text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-emerald-600">{formatCurrency(totalEntradas)}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-red-50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black text-red-700 uppercase tracking-widest">Saídas Pagas</CardTitle>
            <TrendingDown size={16} className="text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-red-600">{formatCurrency(totalSaidas)}</p>
          </CardContent>
        </Card>

        <Card className={`border-none shadow-md ${saldoFinal >= 0 ? 'bg-[#1e3a8a] text-white' : 'bg-orange-600 text-white'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase opacity-80 tracking-widest">Saldo do Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{formatCurrency(saldoFinal)}</p>
          </CardContent>
        </Card>
      </div>

      {/* DETALHAMENTO DAS MOVIMENTAÇÕES */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* RECEBIMENTOS (ENTRADAS) */}
        <Card className="shadow-sm border-gray-100 overflow-hidden">
          <CardHeader className="bg-emerald-50/50 border-b">
            <CardTitle className="text-xs font-black text-emerald-700 uppercase flex items-center gap-2">
              <CheckCircle size={14} /> Recebimentos Detalhados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead className="bg-gray-50/50 border-b text-[9px] font-black text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Paciente</th>
                  <th className="px-4 py-3 text-center">Forma</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entradas.map(at => (
                  <tr key={at.id} className="hover:bg-gray-50 transition-colors font-bold">
                    <td className="p-4 text-gray-700 uppercase">{at.paciente_nome}</td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] uppercase">{at.forma_pagamento || 'Pix'}</span>
                    </td>
                    <td className="p-4 text-right text-emerald-600">{formatCurrency(at.valor_atendimento)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {entradas.length === 0 && (
              <div className="p-10 text-center text-gray-400 italic">Nenhum recebimento registrado para este dia.</div>
            )}
          </CardContent>
        </Card>

        {/* PAGAMENTOS (SAÍDAS) */}
        <Card className="shadow-sm border-gray-100 overflow-hidden">
          <CardHeader className="bg-red-50/50 border-b">
            <CardTitle className="text-xs font-black text-red-700 uppercase flex items-center gap-2">
              <Receipt size={14} /> Pagamentos Realizados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead className="bg-gray-50/50 border-b text-[9px] font-black text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Descrição</th>
                  <th className="px-4 py-3 text-center">Forma</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {saidas.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors font-bold">
                    <td className="p-4 text-gray-700 uppercase">
                      {s.descricao}
                      <span className="block text-[9px] text-gray-400 font-normal">{s.recebedor}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px] uppercase">{s.forma_pagamento || 'Pix'}</span>
                    </td>
                    <td className="p-4 text-right text-red-600">{formatCurrency(s.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {saidas.length === 0 && (
              <div className="p-10 text-center text-gray-400 italic">Nenhum pagamento registrado para este dia.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}