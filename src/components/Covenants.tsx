import { motion } from "framer-motion";
import { Handshake, Sparkles, ArrowRight } from "lucide-react";

const partners = ["SINPROAC", "SINODONTO", "SINTEAC", "IGREJAS"];

export function Covenants() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto"
    >
      {/* 1. Grade de Alianças: Estética de "Lâminas de Cristal" */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
        {partners.map((partner, index) => (
          <motion.div
            key={partner}
            whileHover={{ y: -10 }}
            className="group relative"
          >
            {/* Efeito de brilho dourado sutil no hover */}
            <div className="absolute inset-0 bg-secondary/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            <div className="relative flex items-center justify-center p-12 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm group-hover:shadow-2xl group-hover:border-secondary/30 transition-all duration-500 overflow-hidden">
              {/* Marca d'água do nome no fundo do card */}
              <span className="absolute -bottom-4 -right-2 text-4xl font-black italic text-slate-50 select-none group-hover:text-secondary/5 transition-colors">
                {partner}
              </span>
              
              <span className="relative z-10 font-black text-2xl tracking-tighter italic text-primary opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all uppercase">
                {partner}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. Call to Action: O Protocolo Corporativo Premium */}
      <div className="relative group max-w-5xl mx-auto">
        {/* Sombra de profundidade para destacar o bloco no fundo claro */}
        <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] blur-3xl opacity-50" />
        
        <div className="relative bg-primary p-12 md:p-20 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-12 text-left overflow-hidden shadow-2xl">
          
          {/* Elemento Visual de Fundo (Ícone gigante de luxo) */}
          <Handshake className="absolute -right-16 -bottom-16 w-80 h-80 text-white/[0.03] -rotate-12 pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">
                Alianças de Prestígio
              </span>
            </div>
            
            <h4 className="text-4xl md:text-6xl font-black uppercase tracking-[-0.04em] text-white leading-[0.9] italic">
              Sua corporação <br/>
              <span className="not-italic font-light text-white/40 font-sans">fora da lista?</span>
            </h4>
            
            <p className="text-white/50 text-lg font-light max-w-md leading-relaxed">
              Inicie um protocolo de parceria exclusiva e ofereça o padrão de cuidado do <span className="text-white font-medium">Instituto SerClin</span> aos seus colaboradores.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button 
              onClick={() => window.open("https://wa.me/5568992161717?text=Gostaria de saber sobre parcerias corporativas.", "_blank")}
              className="bg-secondary text-primary hover:bg-white hover:scale-105 font-black px-12 py-7 rounded-2xl uppercase text-[11px] tracking-[0.2em] transition-all shadow-[0_20px_40px_-10px_rgba(212,143,22,0.4)] flex items-center gap-4 active:scale-95"
            >
              Consultar Cobertura <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}