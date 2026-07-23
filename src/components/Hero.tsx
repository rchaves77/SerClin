import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { ArrowRight, MousePointer2 } from "lucide-react";

export function Hero({ setView }: { setView?: (view: string) => void }) {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-[#05070a]">
      {/* 1. Background com Overlay Cinematográfico */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroBg} 
          alt="Instituto SerClin" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-[#05070a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent opacity-80" />
      </div>

      {/* 2. Conteúdo com Sistema Tipográfico Signature */}
      <div className="container relative z-10 px-4">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-10"
          >
            {/* Tag de Prestígio - Sans Black com Tracking Extremo */}
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-secondary" />
              <span className="text-[10px] font-sans font-black uppercase tracking-[0.6em] text-secondary">
                Saúde & Excelência Humana
              </span>
            </div>

            {/* Título Principal - O Contraste de Ouro (Serif Italic + Sans Bold) */}
            <h1 className="text-white uppercase leading-[0.8] tracking-[-0.04em]">
              <span className="font-serif text-6xl md:text-8xl lg:text-[9.5rem] font-black italic block mb-2">
                Instituto
              </span>
              <span className="font-sans text-5xl md:text-7xl lg:text-[8.5rem] font-bold block tracking-tight">
                SerClin
              </span>
            </h1>

            {/* Subtexto Refinado - Sans Medium com Leading Amplo */}
            <p className="text-lg md:text-2xl text-white/50 max-w-2xl font-sans font-medium leading-relaxed italic">
              Onde a alta performance clínica encontra o <br />
              <span className="text-white not-italic font-bold border-b border-secondary/30">acolhimento humano.</span>
            </p>

            {/* Botões Signature - Unificação de Fonte Sans Black */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6 font-sans">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-white text-primary font-black text-[11px] px-12 py-8 rounded-2xl shadow-[0_20px_50px_-10px_rgba(212,143,22,0.4)] transition-all uppercase tracking-[0.2em] group border-none"
                asChild
              >
                <a href="https://wa.me/5568992161717" target="_blank" className="flex items-center gap-3">
                  Agendar Protocolo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              <Button 
                size="lg" 
                variant="outline"
                className="bg-primary/20 border border-white/10 text-white hover:bg-white hover:text-primary font-black text-[11px] px-12 py-8 rounded-2xl transition-all uppercase tracking-[0.2em] shadow-xl backdrop-blur-md"
                asChild
              >
                <a href="#servicos">Explorar Especialidades</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* 3. Indicador de Rolagem Minimalista */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-[9px] font-sans font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-secondary to-transparent" />
      </motion.div>
    </section>
  );
}