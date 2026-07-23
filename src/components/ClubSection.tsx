import { ShieldCheck, ArrowRight, CheckCircle2, Sparkles, HelpCircle, Users, Calendar, ShieldAlert } from "lucide-react";

export function ClubSection() {
  const handleAdesaoClub = () => {
    window.open("https://invoice.infinitepay.io/plans/instituto-serclin/0HJPOIpqjg", "_blank");
  };

  const handleConsultarTabelaZap = () => {
    const telefoneClinica = "5568992161717"; 
    const mensagem = "Olá! Gostaria de consultar a tabela de valores exclusivos e condições especiais do Club SerClin.";
    window.open(`https://wa.me/${telefoneClinica}?text=${encodeURIComponent(mensagem)}`, "_blank");
  };

  return (
    <section id="club" className="py-32 bg-primary text-white relative overflow-hidden rounded-[4rem] my-16 shadow-[0_40px_100px_-30px_rgba(5,7,10,0.5)]">
      
      {/* Grafismo de fundo */}
      <div className="absolute -right-24 -bottom-24 text-[26rem] font-black text-white/[0.02] italic select-none pointer-events-none uppercase tracking-tighter">
        SERCLIN
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Ajustado o container geral para max-w-7xl expandindo a área útil de visualização */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10 px-6 md:px-12">
        
        {/* LADO ESQUERDO: Chamada Institucional Premium */}
        <div className="lg:col-span-4 space-y-8 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary flex items-center gap-2">
                <Sparkles size={12} /> PROTOCOLO DE BENEFÍCIOS
              </span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.8] text-white font-serif">
              Club <br />
              <span className="text-secondary not-italic font-sans">
                SerClin
              </span>
            </h2>
          </div>
          
          <div className="h-1 w-20 bg-secondary"></div>
          
          <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed">
            Acolhimento humanizado e estrutura particular ao alcance da sua família em Rio Branco por um modelo de assinatura mensal recorrente.
          </p>
        </div>

        {/* LADO DIREITO: O Quadro Maior de Altíssima Legibilidade */}
        <div className="lg:col-span-8 w-full">
          <div className="bg-white rounded-[3.5rem] p-8 md:p-14 border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between gap-12 relative overflow-hidden text-left text-slate-900">
            
            {/* Bloco de Benefícios com espaçamento expandido */}
            <div className="flex-1 space-y-10 relative z-10 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary block">
                  Vantagens Inclusas
                </span>
                <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-primary font-serif italic">
                  O que você <span className="font-sans font-light text-slate-500 not-italic lowercase">recebe</span>
                </h4>
              </div>

              {/* Lista estruturada de forma mais espaçada e com textos maiores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex items-start gap-4">
                  <Users className="text-primary mt-1 shrink-0" size={24} />
                  <div className="space-y-1">
                    <h5 className="font-black text-sm uppercase text-gray-800 tracking-tight">Titular + 1 Dependente</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        <li>Cobertura direta inclusa para cônjuge ou filho sem cobrança adicional.</li>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="text-emerald-600 mt-1 shrink-0" size={24} />
                  <div className="space-y-1">
                    <h5 className="font-black text-sm uppercase text-gray-800 tracking-tight">04 Sessões Mensais</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        <li>Atendimentos individuais de psicoterapia de 40 minutos por mês.</li>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-blue-600 mt-1 shrink-0" size={24} />
                  <div className="space-y-1">
                    <h5 className="font-black text-sm uppercase text-gray-800 tracking-tight">Condições Exclusivas</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed"> 
                        <li>Acesso direto a valores exclusivos para Psiquiatria e Neuropsicologia.</li>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ShieldAlert className="text-amber-500 mt-1 shrink-0" size={24} />
                  <div className="space-y-1">
                    <h5 className="font-black text-sm uppercase text-gray-800 tracking-tight">Regras Claras</h5>
                    <ul className="text-xs text-slate-500 font-medium leading-relaxed space-y-1 list-disc list-inside">
                      <li>Sessão de Acolhimento em até 48h</li>
                      <li>30 dias de carência para terapias</li>
                      <li>Liberação médica imediata</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={handleConsultarTabelaZap}
                  className="text-[11px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 hover:text-primary transition-colors py-1"
                >
                  <HelpCircle size={16} className="text-emerald-500" /> Consultar Tabela de Valores via WhatsApp
                </button>
              </div>
            </div>

            {/* Bloco Dinâmico de Preço Ampliado */}
            <div className="w-full md:w-[260px] bg-slate-50 rounded-[2rem] p-8 flex flex-col justify-between text-center border border-slate-100 shrink-0 relative z-10">
              <div className="space-y-4 my-auto">
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest block mx-auto w-max">
                  RECORRÊNCIA
                </span>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Assinatura</span>
                  <div className="flex items-baseline justify-center text-primary">
                    <span className="text-sm font-black opacity-60">R$</span>
                    <span className="text-5xl font-black tracking-tighter">127,90</span>
                    <span className="text-xs font-bold text-slate-400 ml-1">/mês</span>
                  </div>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed px-1">
                  Sem burocracia. Desconto mensal na função assinatura sem ocupar o limite total.
                </p>
              </div>

              <button
                onClick={handleAdesaoClub}
                className="w-full bg-[#1e3a8a] hover:bg-emerald-500 text-white font-black uppercase text-[11px] tracking-[0.2em] py-5 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group mt-8"
              >
                ASSINAR <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}