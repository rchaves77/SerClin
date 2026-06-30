import { Check, Star, ShieldCheck, Sparkles, CreditCard, Users, ArrowUpRight } from "lucide-react";

export function ClubSection() {
  const benefits = [
    {
      icon: CreditCard,
      title: "Mensalidade Reduzida",
      desc: "Acesso a terapias e consultas com valores altamente reduzidos, garantindo a continuidade do seu cuidado sem pesar no orçamento.",
    },
    {
      icon: Users,
      title: "Suporte Familiar Amplo",
      desc: "Adicione seus dependentes diretos (filhos, cônjuge ou pais) sob uma única assinatura para cuidar de quem você mais ama.",
    },
    {
      icon: Sparkles,
      title: "Parceiros Conveniados",
      desc: "Descontos exclusivos em farmácias, laboratórios de análises clínicas, exames de imagem e médicos parceiros na região.",
    },
    {
      icon: ShieldCheck,
      title: "Agendamento Prioritário",
      desc: "Canal de atendimento exclusivo com prioridade na marcação de horários, reagendamentos e suporte contínuo da nossa central.",
    },
  ];

  return (
    <section id="club-serclin" className="py-24 bg-white scroll-mt-24 text-left">
      <div className="bg-[#0a2d54] rounded-[3.5rem] p-8 md:p-16 lg:p-20 text-white relative overflow-hidden shadow-2xl">
        {/* Decorative background watermark */}
        <div className="absolute -bottom-20 -left-10 text-[20rem] font-black text-white/[0.03] italic select-none pointer-events-none uppercase tracking-tighter">
          CLUB
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#bfa571]/20 border border-[#bfa571]/30 px-4 py-1.5 rounded-full text-[#dfca9e] text-xs font-black uppercase tracking-widest font-mono">
              <Star className="w-3.5 h-3.5 fill-[#dfca9e]" /> Clube de Benefícios
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter italic leading-none font-serif">
              Club <span className="font-light text-slate-300 not-italic font-sans lowercase">SerClin</span>
            </h2>
            <div className="h-1 w-20 bg-[#bfa571]"></div>
            <p className="text-white/70 text-base font-light leading-relaxed font-sans">
              Mais do que um convênio, um ecossistema completo de bem-estar. O Club Serclin foi desenhado para quem prioriza o autocuidado preventivo com previsibilidade financeira e atendimento de excelência.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const tel = "5568992161717";
                  const msg = "Olá! Gostaria de mais informações sobre como funciona o Club Serclin e quais são os planos disponíveis.";
                  window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, "_blank");
                }}
                className="bg-[#bfa571] hover:bg-[#9e814d] text-white font-black px-8 py-4 uppercase text-xs tracking-widest rounded-xl shadow-lg border-none cursor-pointer flex items-center gap-2 transition-all active:scale-95"
              >
                Aderir ao Clube <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Cards Box */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#bfa571]/20 text-[#dfca9e] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-[#dfca9e] mb-2 font-serif">
                    {b.title}
                  </h3>
                  <p className="text-xs font-light text-white/60 leading-relaxed font-sans">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
