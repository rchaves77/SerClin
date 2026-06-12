import { Shield, Sparkles, Heart, Activity, Milestone } from "lucide-react";

export function About() {
  const values = [
    { icon: Shield, title: "Sigilo Absoluto", desc: "Seguimos à risca o código de ética profissional nos laudos e atendimentos." },
    { icon: Heart, title: "Acolhimento Humano", desc: "Consultórios confortáveis projetados para diminuir a ansiedade e dar suporte." },
    { icon: Activity, title: "Abordagem Integrada", desc: "Sua saúde física e mental discutidas em equipe multidisciplinar para melhores resultados." },
  ];

  return (
    <div className="max-w-7xl mx-auto container text-left">
      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 p-8 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary font-mono">Quem Somos</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none text-primary">
            Espaço<br/>
            <span className="font-light text-slate-400 not-italic font-sans lowercase">de</span> evolução
          </h2>
          <div className="h-1 w-20 bg-secondary"></div>
          <p className="text-sm font-medium text-slate-500 leading-relaxed font-sans">
            O Instituto SerClin nasceu do desejo de criar um ambiente verdadeiramente acolhedor e seguro, que une atendimento humanizado com rigor técnico e científico de ponta.
          </p>
          <p className="text-sm font-medium text-slate-500 leading-relaxed font-sans">
            Nossos terapeutas e médicos trabalham de forma colaborativa, proporcionando um plano de cuidado sob medida que respeita o tempo e a singularidade de cada pessoa.
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:bg-brand-gold-light/40 hover:border-brand-gold/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-4 shadow-md shadow-blue-105">
                  <Icon className="w-6 h-6 text-[#dfca9e]" />
                </div>
                <h3 className="font-black text-xs uppercase tracking-widest text-primary mb-2">{v.title}</h3>
                <p className="text-xs font-semibold text-slate-400 leading-relaxed font-sans">{v.desc}</p>
              </div>
            );
          })}
          
          <div className="bg-gradient-to-br from-primary to-brand-blue-dark rounded-3xl p-6 text-white flex flex-col justify-between shadow-xl">
            <Milestone className="w-8 h-8 text-[#dfca9e] mb-6" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-gold font-mono mb-1">Nosso Objetivo</p>
              <h4 className="font-extrabold text-sm uppercase leading-snug font-sans">Promover o autocuidado pleno de forma realista e acessível.</h4>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
