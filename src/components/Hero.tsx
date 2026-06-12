import { ShieldCheck, Sparkles, Calendar, MessageSquare, ShieldAlert } from "lucide-react";

interface HeroProps {
  setView?: (view: string) => void;
}

export function Hero({ setView }: HeroProps) {
  const triggerView = (v: string) => {
    if (setView) setView(v);
  };

  return (
    <section className="bg-gradient-to-b from-brand-blue-light/30 via-slate-50 to-white pt-24 pb-16 md:pt-32 md:pb-24 border-b border-gray-100 text-left">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black tracking-widest uppercase font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#bfa571] animate-pulse" />
              <span>Presencial e Online em todo o Brasil</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8] text-primary">
              Acolhimento<br/>
              <span className="font-light text-slate-400 not-italic font-sans lowercase">e</span> ciência
            </h1>
            
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl font-medium font-sans">
              O <strong className="text-primary font-bold">Instituto SerClin</strong> é um centro clínico moderno de excelência em saúde integrativa. Unimos profissionais de referência nas áreas de Neuropsicologia, Psiquiatria, Psicoterapia, Fonoaudiologia e Nutrição focado na sua saúde física e mental.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => triggerView("booking")}
                className="px-8 py-5 bg-primary hover:bg-[#bfa571] text-white hover:text-white font-black rounded-2xl shadow-xl shadow-blue-50 flex items-center justify-center gap-2 uppercase text-xs tracking-widest transition-all duration-200 active:scale-95 cursor-pointer border-none"
              >
                <Calendar className="w-4 h-4 text-[#dfca9e]" />
                <span>Agendar Consulta</span>
              </button>
              
              <button
                onClick={() => triggerView("chat")}
                className="px-8 py-5 bg-white border-2 border-slate-200 hover:border-primary text-primary font-black rounded-2xl flex items-center justify-center gap-2 uppercase text-xs tracking-widest transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#bfa571]" />
                <span>Avaliar Sintomas IA</span>
              </button>
            </div>

            {/* Micro proof badges */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-100 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-widest">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-500 w-4 h-4" /> Sigilo Ético Certificado
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-amber-500 w-4 h-4" /> Corpo Clínico Registrado
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue-light/50 to-brand-gold-light/50 rounded-[3rem] transform rotate-3 scale-105 filter blur-xs"></div>
            
            <div className="relative rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-[#eff6ff] h-[400px] md:h-[480px]">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
                alt="Instituto SerClin Consultores" 
                className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700" 
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent p-8 text-white text-left">
                <p className="text-[10px] font-black uppercase text-[#bfa571] tracking-widest mb-1 font-mono">Nosso Espaço</p>
                <h4 className="font-extrabold text-lg leading-tight uppercase font-sans">Instalações projetadas para o seu máximo bem-estar.</h4>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
