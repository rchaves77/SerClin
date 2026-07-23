import { motion } from "framer-motion";
import { Brain, Heart, Users, BookOpen, Stethoscope, Baby } from "lucide-react";

const services = [
  { icon: Brain, title: "Avaliação Neuropsicológica", description: "Diagnóstico de alta precisão das funções cognitivas e comportamentais." },
  { icon: Heart, title: "Psicoterapia Individual", description: "Cuidado clínico especializado focado no bem-estar emocional profundo." },
  { icon: BookOpen, title: "Psicopedagogia", description: "Intervenção estratégica nos processos de aprendizagem." },
  { icon: Users, title: "Oficina das Emoções", description: "Grupos exclusivos para o desenvolvimento da inteligência emocional." },
  { icon: Stethoscope, title: "Capacitação Profissional", description: "Treinamentos de alta performance para docentes e gestores." },
  { icon: Baby, title: "Intervenção Precoce", description: "Estimulação personalizada e essencial nos primeiros anos de vida." }
];

export function Services() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      {services.map((service, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="h-full p-12 rounded-[3.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-secondary/30 transition-all duration-500 relative overflow-hidden">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-primary transition-colors duration-500">
              <service.icon className="w-8 h-8 text-primary group-hover:text-secondary transition-colors duration-500" />
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-2xl uppercase tracking-tighter text-primary leading-tight group-hover:text-secondary transition-colors">
                {service.title}
              </h4>
              <div className="w-8 h-1 bg-slate-200 group-hover:w-16 group-hover:bg-secondary transition-all duration-500" />
              <p className="text-slate-500 font-medium leading-relaxed pt-2">
                {service.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}