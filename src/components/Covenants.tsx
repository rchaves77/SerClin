import { ShieldCheck, HeartPulse } from "lucide-react";

export function Covenants() {
  const plans = [
    "Unimed", "Bradesco Saúde", "Amil", "Cassi",
    "Mediservice", "SulAmérica", "Porto Seguro", "Golden Cross"
  ];

  return (
    <div className="max-w-6xl mx-auto text-center space-y-12 py-12">
      <div className="space-y-4">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-400 font-mono">Praticidade</span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none text-white">
          Atendimento <span className="font-light text-slate-300 not-italic font-sans lowercase">por</span> Convênios
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto font-medium lead-relaxed">
          Atendemos por reembolso assistido! Fornecemos notas fiscais detalhadas, laudos estruturados e relatórios com todos os códigos de diagnóstico necessários para que você solicite o reembolso total ou parcial direto ao seu plano.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        {plans.map((p, i) => (
          <div key={i} className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-3xl p-6 border border-white/10 text-center flex flex-col justify-center items-center gap-2 group transition-all duration-300">
            <HeartPulse className="w-5 h-5 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm font-black uppercase tracking-wide text-white font-sans">{p}</span>
          </div>
        ))}
      </div>

      <div className="bg-white/5 rounded-3xl p-6 max-w-3xl mx-auto flex items-center justify-center gap-4 text-left border border-white/5">
        <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          Precisa de orientação sobre como solicitar o reembolso? Fale com a nossa recepção antes ou após a sua consulta. Oferecemos todo o suporte burocrático e preparamos os documentos!
        </p>
      </div>
    </div>
  );
}
