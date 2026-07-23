import { Instagram, MapPin, Mail, Phone, MessageCircle, ShieldCheck, Award } from "lucide-react";

export function Footer() {
  return (
    <footer id="contato" className="bg-primary text-white pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      
      {/* 1. Marca d'água de Prestígio (Sutil e Coesa) */}
      <div className="absolute top-0 right-0 text-[18rem] font-black text-white/[0.02] italic pointer-events-none select-none tracking-tighter uppercase">
        SerClin
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Coluna 1: Identidade Signature */}
          <div className="space-y-8">
            <h3 className="font-serif text-3xl font-black tracking-tighter italic text-secondary uppercase leading-[0.8]">
              Instituto <br /> <span className="not-italic text-white font-sans tracking-tight uppercase text-2xl">SerClin</span>
            </h3>
            <p className="text-white/60 leading-relaxed text-sm font-medium italic max-w-xs font-sans">
              Onde a excelência clínica e o acolhimento humano de elite convergem para o desenvolvimento pleno.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/institutoserclin/" 
                target="_blank" 
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all border border-white/10 group shadow-2xl"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://wa.me/5568992161717" 
                target="_blank" 
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all border border-white/10 group shadow-2xl"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação (Sans Black para Autoridade) */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-secondary">Navegação</h4>
            <ul className="space-y-5 text-[12px] font-bold uppercase tracking-[0.2em] font-sans">
              <li><a href="#" className="text-white/40 hover:text-white transition-colors block">Experience Início</a></li>
              <li><a href="#sobre" className="text-white/40 hover:text-white transition-colors block">O Instituto</a></li>
              <li><a href="#servicos" className="text-white/40 hover:text-white transition-colors block">Especialidades</a></li>
              <li><a href="#planos" className="text-white/40 hover:text-white transition-colors block">Investimento</a></li>
            </ul>
          </div>

          {/* Coluna 3: Concierge (Foco em Precisão Visual) */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-secondary">Concierge</h4>
            <ul className="space-y-8 text-[12px] font-bold uppercase tracking-widest font-sans">
              <li className="flex items-start gap-4 group text-white/50 transition-colors hover:text-white">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Rua+Sorocaba+140+Doca+Furtado+Rio+Branco+AC" 
                  target="_blank" 
                  className="leading-relaxed tracking-[0.1em]"
                >
                  Rua Sorocaba, 140<br />
                  Doca Furtado, Rio Branco - AC
                </a>
              </li>
              <li className="flex items-center gap-4 group text-white/50 transition-colors hover:text-white">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <a href="tel:+5568992161717" className="tracking-tighter text-base font-black">
                  (68) 99216-1717
                </a>
              </li>
              <li className="flex items-center gap-4 group text-white/50 transition-colors hover:text-white">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <a href="mailto:institutoserclin@gmail.com" className="lowercase italic font-medium tracking-normal">
                  institutoserclin@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Disponibilidade (Tabela de Elite) */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-10 text-secondary">Disponibilidade</h4>
            <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest font-sans">
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-white/80 italic font-medium">Segunda - Sexta</span>
                <span className="text-white/80">08:00 — 18:00</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-white/80 italic font-medium">Sábado</span>
                <span className="text-white/80">08:00 — 12:00</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-white/80 italic font-medium">Domingo</span>
                <span className="text-secondary font-black italic">Private Access</span>
              </li>
            </ul>
            <div className="pt-4 flex items-center gap-2 text-[9px] font-black text-white/60 uppercase tracking-[0.3em]">
              <ShieldCheck size={14} className="text-secondary/40" /> Protocolos Signature
            </div>
          </div>
        </div>

        {/* 2. Rodapé Final (Minimalismo de Luxo) */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 font-sans">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} Instituto SerClin Signature. All rights reserved.
          </p>
          <div className="flex items-center gap-8 opacity-40">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                <Award size={16} className="text-secondary" /> Padrão de Excelência
             </div>
             <div className="h-4 w-px bg-white/20" />
             <div className="text-[10px] font-black uppercase tracking-[0.2em]">
                Rio Branco - AC
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}