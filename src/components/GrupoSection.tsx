import { Heart, Users, Compass, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";

export function GrupoSection() {
  const grupos = [
    {
      title: "Conexões Neuroatípicas",
      publico: "Adultos e Adolescentes",
      foco: "TDAH e TEA (Autismo)",
      desc: "Um espaço terapêutico de acolhimento e partilha de experiências para desenvolver habilidades de regulação, organização e fortalecer conexões entre pares neuroatípicos de forma leve e acolhedora.",
      tags: ["Foco", "Rotina", "Identidade", "Apoio Mútuo"],
    },
    {
      title: "Pais em Acolhimento",
      publico: "Mães, Pais e Cuidadores",
      foco: "Suporte e Orientação Parental",
      desc: "Grupo de apoio especializado para compartilhar desafios, receber orientação prática sobre regulação sensorial, comportamental e trocar vivências enriquecedoras com outras famílias.",
      tags: ["Acolhimento", "Orientação", "Regulação", "Troca"],
    },
    {
      title: "Habilidades Sociais Infantis",
      publico: "Crianças de 6 a 11 anos",
      foco: "Desenvolvimento Infantil e Integração",
      desc: "Dinâmicas lúdicas em pequenos grupos voltadas para a empatia, regulação emocional, escuta ativa e fortalecimento da autoconfiança de crianças no ambiente escolar e familiar.",
      tags: ["Lúdico", "Socialização", "Emoções", "Amizade"],
    },
  ];

  const steps = [
    { num: "01", title: "Acolhimento", desc: "Primeiro contato para entender suas demandas de forma empática." },
    { num: "02", title: "Triagem Técnica", desc: "Avaliação do perfil para garantir a melhor sinergia com o grupo." },
    { num: "03", title: "Integração", desc: "Ingresso no grupo ideal para sua jornada de desenvolvimento." },
  ];

  return (
    <section id="grupos-terapeuticos" className="py-32 bg-slate-50 text-left scroll-mt-24">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#bfa571] font-mono">Destaque do Programa</span>
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter italic leading-[0.8] text-[#0a2d54] font-serif">
            Grupos <span className="font-light text-slate-500 not-italic font-sans lowercase">Terapêuticos</span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-sm md:text-base font-medium font-sans pt-4">
            Acreditamos na força do coletivo. Nossos grupos são moderados por profissionais especialistas, promovendo o desenvolvimento e a troca mútua em um ambiente de total sigilo e acolhimento.
          </p>
        </div>

        {/* Group Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {grupos.map((g, i) => (
            <div
              key={i}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#bfa571] uppercase tracking-wider font-mono">
                    <Users className="w-3.5 h-3.5" /> {g.publico}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#0a2d54] uppercase tracking-tight font-serif leading-tight">
                    {g.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{g.foco}</p>
                </div>

                <p className="text-xs font-medium text-slate-500 leading-relaxed font-sans">
                  {g.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {g.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-slate-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    const tel = "5568992161717";
                    const msg = `Olá! Gostaria de mais informações sobre o Grupo Terapêutico *${g.title}*. Como funcionam os encontros e inscrições?`;
                    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  className="w-full bg-[#0a2d54]/5 hover:bg-[#bfa571] hover:text-white text-[#0a2d54] py-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border-none cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  Demonstrar Interesse <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Process Roadmap */}
        <div className="bg-white rounded-[3.5rem] p-8 md:p-16 border border-slate-100 shadow-xl max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#bfa571] font-mono block">Como Funciona?</span>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-[#0a2d54] font-serif leading-none">
                Sua Jornada de<br/><span className="font-light text-slate-400 not-italic font-sans lowercase">Ingresso</span>
              </h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed font-sans">
                Garantimos que cada membro do grupo esteja alinhado para propiciar a melhor experiência coletiva possível.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {steps.map((s, i) => (
                <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 relative">
                  <span className="text-4xl font-black text-[#bfa571]/20 font-serif absolute top-4 right-4">{s.num}</span>
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#0a2d54] mb-2 pr-8">{s.title}</h4>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed font-sans">{s.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
