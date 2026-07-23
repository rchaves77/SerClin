import { motion } from "framer-motion";
import trainingImg from "@/assets/training.jpg";
import workshopImg from "@/assets/workshop.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Eye, Gem, Sparkles } from "lucide-react";

export function About() {
  return (
    <div className="space-y-40">
      {/* 1. Pilares: Missão, Visão e Valores */}
      <div className="grid md:grid-cols-3 gap-12">
        {[
          { 
            icon: Target, 
            title: "Nossa Missão", 
            text: "Promover saúde mental e desenvolvimento humano integral através de excelência clínica e educativa, acolhendo a singularidade." 
          },
          { 
            icon: Eye, 
            title: "Nossa Visão", 
            text: "Ser a referência absoluta no Acre em serviços clínicos integrados e capacitação de alta performance para gestores." 
          },
          { 
            icon: Gem, 
            title: "Nossos Valores", 
            text: "Humanização, Ética Inegociável, Inovação Científica e o compromisso inabalável com o Bem-estar Social." 
          }
        ].map((pilar, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center p-12 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-secondary/20 transition-all duration-500 group"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-sm group-hover:bg-primary transition-colors duration-500">
              <pilar.icon className="w-8 h-8 text-secondary group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-primary mb-4 italic leading-none">
              {pilar.title}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {pilar.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 2. Destaque: Oficinas (Layout Editorial) */}
      <div className="grid lg:grid-cols-2 gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -top-6 -left-6 w-2/3 h-full bg-secondary/10 rounded-[4rem] -z-10 blur-2xl group-hover:bg-secondary/20 transition-all duration-700" />
          <img 
            src={workshopImg} 
            alt="Oficina das Emoções" 
            className="rounded-[3.5rem] shadow-2xl w-full object-cover aspect-[4/3] grayscale-[30%] hover:grayscale-0 transition-all duration-1000" 
          />
          <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[2.5rem] shadow-2xl border-l-8 border-secondary max-w-xs hidden md:block">
            <h4 className="text-xl font-black uppercase tracking-tighter text-primary italic leading-none mb-2">Oficina das Emoções</h4>
            <p className="text-sm text-slate-800 font-medium italic">Inteligência emocional para o desenvolvimento humano.</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
            <Sparkles size={14} className="text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Desenvolvimento</span>
          </div>
          <h3 className="text-6xl font-black uppercase tracking-tighter leading-[0.85] text-primary italic">
            Grupos <br/>
            <span className="font-light text-slate-500 not-italic lowercase">Terapêuticos</span>
          </h3>
          <p className="text-slate-800 text-xl font-light leading-relaxed">
            Um espaço seguro e acolhedor focado no reconhecimento e manejo das emoções, fortalecendo habilidades sociais e autoestima.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Público Infantil e Juvenil", "Dinâmicas Interativas", "Foco Socioemocional", "Gestão de Especialistas"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700 font-bold text-sm uppercase tracking-tight">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full" /> {item}
              </li>
            ))}
          </ul>
          <Button 
            className="bg-primary hover:bg-secondary text-white hover:text-primary font-black px-10 py-7 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all group"
            asChild
          >
            <a href="https://wa.me/5568992161717" target="_blank">
              Solicitar Protocolo <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </motion.div>
      </div>

      {/* 3. Destaque: Capacitação (Inverted Layout) */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center pb-20 px-4 lg:px-0">
        
        {/* LADO DO TEXTO: Centralizado no mobile, alinhado à direita no Desktop */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-2 lg:order-1 space-y-6 lg:space-y-8 text-center lg:text-right flex flex-col items-center lg:items-end"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
              Educação Corporativa
            </span>
          </div>
          
          <h3 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.85] text-primary italic">
            Capacitação <br/>
            <span className="font-light text-slate-600 not-italic lowercase">Profissional</span>
          </h3>
          
          <p className="text-slate-800 text-lg lg:text-xl font-light leading-relaxed max-w-md lg:max-w-none">
            Desenvolvemos programas personalizados para docentes e gestores escolares, focando em liderança e saúde mental no trabalho.
          </p>
          
          <Button 
            variant="outline"
            className="w-full lg:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white font-black px-12 py-7 rounded-2xl uppercase text-[10px] tracking-widest transition-all"
            asChild
          >
            <a href="https://wa.me/5568992161717" target="_blank" rel="noopener noreferrer">
              Proposta Corporativa
            </a>
          </Button>
        </motion.div>
        
        {/* LADO DA IMAGEM: Aparece em cima no mobile, na direita no Desktop */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2 relative"
        >
          {/* Efeito decorativo de fundo */}
          <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 w-2/3 h-full bg-primary/5 rounded-[2.5rem] lg:rounded-[4rem] -z-10 blur-xl" />
          
          <img 
            src={trainingImg} 
            alt="Capacitação Profissional" 
            className="rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl w-full object-cover aspect-[4/3] border-[8px] lg:border-[16px] border-slate-50" 
          />
        </motion.div>
      </div>
    </div>
  );
}