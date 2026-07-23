import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, CreditCard, DollarSign, ArrowRight, CheckCircle2, TrendingDown, ArrowLeft } from 'lucide-react';

const TAXAS = {
  ton: {
    mastercard_visa: {
      debito: 0.57, '1x': 0.57, '2x': 3.97, '3x': 3.97, '4x': 4.97, '5x': 5.97,
      '6x': 6.97, '7x': 7.97, '8x': 7.97, '9x': 7.97, '10x': 7.97, '11x': 8.97, '12x': 8.97,
    },
    elo: {
      debito: 2.57, '1x': 4.34, '2x': 7.02, '3x': 7.58, '4x': 8.38, '5x': 9.38,
      '6x': 10.38, '7x': 10.98, '8x': 11.38, '9x': 12.38, '10x': 12.88, '11x': 13.38, '12x': 13.88,
    }
  },
  infinitepay: {
    todas: {
      debito: 0.75, '1x': 2.89, '2x': 4.09, '3x': 4.89, '4x': 5.69, '5x': 6.49,
      '6x': 7.29, '7x': 8.09, '8x': 8.89, '9x': 9.69, '10x': 10.49, '11x': 11.29, '12x': 12.09,
    }
  }
};

export function CalculadoraTaxas() {
  const navigate = useNavigate();
  const [valor, setValor] = useState<number>(100);
  const [modalidade, setModalidade] = useState<'debito' | string>('1x');
  const [tipoCalculo, setTipoCalculo] = useState<'repassar' | 'absorver'>('repassar');

  const taxaTonMasterVisa = TAXAS.ton.mastercard_visa[modalidade as keyof typeof TAXAS.ton.mastercard_visa] || 0;
  const taxaTonElo = TAXAS.ton.elo[modalidade as keyof typeof TAXAS.ton.elo] || 0;
  const taxaInfinite = TAXAS.infinitepay.todas[modalidade as keyof typeof TAXAS.infinitepay.todas] || 0;

  const calcularValores = (taxaPercentual: number) => {
    if (tipoCalculo === 'repassar') {
      const valorCobrar = valor / (1 - taxaPercentual / 100);
      const taxaR$ = valorCobrar - valor;
      return {
        valorCobrar,
        valorLiquido: valor,
        taxaR$,
        taxaPercentual,
        parcela: modalidade !== 'debito' ? valorCobrar / parseInt(modalidade) : valorCobrar
      };
    } else {
      const taxaR$ = valor * (taxaPercentual / 100);
      const valorLiquido = valor - taxaR$;
      return {
        valorCobrar: valor,
        valorLiquido,
        taxaR$,
        taxaPercentual,
        parcela: modalidade !== 'debito' ? valor / parseInt(modalidade) : valor
      };
    }
  };

  const tonMasterVisa = calcularValores(taxaTonMasterVisa);
  const tonElo = calcularValores(taxaTonElo);
  const infinite = calcularValores(taxaInfinite);

  const menorTaxa = Math.min(taxaTonMasterVisa, taxaInfinite);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-xl font-sans text-slate-800">
      
      {/* 🌟 BOTÃO VOLTAR (USA NAVEGAÇÃO DE HISTÓRICO PARA RETORNAR AO DASHBOARD CORRETAMENTE) */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-primary transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/60 cursor-pointer"
      >
        <ArrowLeft size={16} /> Voltar ao Dashboard
      </button>

      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <Calculator size={26} />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-black uppercase text-slate-900 tracking-tight">Simulador Inteligente de Taxas</h3>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Compare Ton (Visa/Master/Elo) vs InfinitePay em tempo real</p>
        </div>
      </div>

      {/* Controles do Simulador */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Valor da Operação (R$)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
            <input 
              type="number" 
              value={valor || ''} 
              onChange={(e) => setValor(Math.max(0, Number(e.target.value)))}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Forma de Pagamento</label>
          <select 
            value={modalidade}
            onChange={(e) => setModalidade(e.target.value)}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="debito">Débito</option>
            <option value="1x">Crédito à vista (1x)</option>
            {Array.from({ length: 11 }, (_, i) => `${i + 2}x`).map((p) => (
              <option key={p} value={p}>Crédito em {p}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Objetivo do Cálculo</label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setTipoCalculo('repassar')}
              className={`py-2.5 text-xs font-black uppercase rounded-xl transition-all ${
                tipoCalculo === 'repassar' ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Repassar Taxa
            </button>
            <button
              type="button"
              onClick={() => setTipoCalculo('absorver')}
              className={`py-2.5 text-xs font-black uppercase rounded-xl transition-all ${
                tipoCalculo === 'absorver' ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Absorver Taxa
            </button>
          </div>
        </div>
      </div>

      {/* Cards Comparativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Ton Master/Visa */}
        <div className={`p-6 rounded-[2rem] border relative flex flex-col justify-between transition-all ${
          taxaTonMasterVisa === menorTaxa 
            ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-400/20 shadow-lg' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          {taxaTonMasterVisa === menorTaxa && (
            <span className="absolute -top-3 right-6 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <TrendingDown size={12} /> Menor Taxa
            </span>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-extrabold text-sm uppercase tracking-wide text-slate-800">Ton (Visa / Master)</span>
              <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-lg">
                {tonMasterVisa.taxaPercentual.toFixed(2)}%
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">
                  {tipoCalculo === 'repassar' ? 'Cobrar do Cliente' : 'Valor Total'}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  R$ {tonMasterVisa.valorCobrar.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {modalidade !== 'debito' && (
                <div className="text-xs font-bold text-slate-500">
                  {modalidade} de R$ {tonMasterVisa.parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200/60 flex justify-between text-xs font-medium text-slate-600">
                <span>Desconto de Taxa:</span>
                <span className="font-bold text-red-500">- R$ {tonMasterVisa.taxaR$.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block">Recebimento Líquido</span>
            <span className="text-lg font-black text-emerald-600">
              R$ {tonMasterVisa.valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Ton Elo */}
        <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-extrabold text-sm uppercase tracking-wide text-slate-800">Ton (Elo)</span>
              <span className="text-xs font-black text-amber-600 bg-amber-100 px-2.5 py-1 rounded-lg">
                {tonElo.taxaPercentual.toFixed(2)}%
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">
                  {tipoCalculo === 'repassar' ? 'Cobrar do Cliente' : 'Valor Total'}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  R$ {tonElo.valorCobrar.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {modalidade !== 'debito' && (
                <div className="text-xs font-bold text-slate-500">
                  {modalidade} de R$ {tonElo.parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200/60 flex justify-between text-xs font-medium text-slate-600">
                <span>Desconto de Taxa:</span>
                <span className="font-bold text-red-500">- R$ {tonElo.taxaR$.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block">Recebimento Líquido</span>
            <span className="text-lg font-black text-slate-800">
              R$ {tonElo.valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* InfinitePay */}
        <div className={`p-6 rounded-[2rem] border relative flex flex-col justify-between transition-all ${
          taxaInfinite === menorTaxa 
            ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-400/20 shadow-lg' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          {taxaInfinite === menorTaxa && (
            <span className="absolute -top-3 right-6 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <TrendingDown size={12} /> Menor Taxa
            </span>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-extrabold text-sm uppercase tracking-wide text-slate-800">InfinitePay (Até 20k)</span>
              <span className="text-xs font-black text-blue-600 bg-blue-100 px-2.5 py-1 rounded-lg">
                {infinite.taxaPercentual.toFixed(2)}%
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">
                  {tipoCalculo === 'repassar' ? 'Cobrar do Cliente' : 'Valor Total'}
                </p>
                <p className="text-2xl font-black text-slate-900">
                  R$ {infinite.valorCobrar.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {modalidade !== 'debito' && (
                <div className="text-xs font-bold text-slate-500">
                  {modalidade} de R$ {infinite.parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200/60 flex justify-between text-xs font-medium text-slate-600">
                <span>Desconto de Taxa:</span>
                <span className="font-bold text-red-500">- R$ {infinite.taxaR$.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block">Recebimento Líquido</span>
            <span className="text-lg font-black text-emerald-600">
              R$ {infinite.valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}