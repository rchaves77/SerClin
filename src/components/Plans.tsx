import { motion } from "framer-motion";
import { Check, Star, Zap, Brain, Crown, Heart, Sparkles, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Plano Essencial", price: "99,90", description: "A porta de entrada para o seu autocuidado.", features: ["Atendimento Quinzenal", "Sessões de 40 min", "Orientação básica"], icon: Heart },
  { name: "Plano Acolher", price: "149,90", description: "Manutenção emocional com suporte regular.", features: ["Atendimento Quinzenal", "Sessões de 50 min", "Suporte via WhatsApp"], icon: Star },
  { name: "Cuidado Premium", price: "189,90", description: "Ferramentas práticas de evolução.", features: ["Exercícios de fixação", "Curadoria de materiais", "Devolutiva trimestral"], highlight: true, popular: true, icon: Zap },
  { name: "Mente Brilhante", price: "249,90", description: "Foco total em desempenho cognitivo.", features: ["Treino de memória e foco", "Organização de rotina", "Material PDF exclusivo"], icon: Brain },
  { name: "Jornada Contínua", price: "319,90", description: "Acelere resultados com foco semanal.", features: ["4 sessões mensais", "Relatório Semestral", "Monitoramento de metas"], highlight: true, icon: Sparkles },
  { name: "Família Prestige", price: "Sob Consulta", description: "O cuidado integral para seu patrimônio.", features: ["Até 4 pessoas", "Terapias Semanais", "Alinhamento familiar"], gold: true, icon: Crown, warning: "Sessões não cumulativas" },
  { name: "Empresarial", price: "Sob Consulta", description: "Saúde mental corporativa.", features: ["Recrutamento e Seleção (R&S)", "Orientação Profissional e Transição de Carreira", "Saúde Mental e Qualidade de Vida no Trabalho (QVT", "Treinamento e Desenvolvimento (T&D", "Clima e Cultura Organizacional"], icon: Briefcase }
];

export function Plans() {
  return (
    <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.6 }}
          viewport={{ once: true }}
          className={`w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] max-w-sm flex group`}
        >
          <div className={`flex flex-col w-full p-10 rounded-[3.5rem] border transition-all duration-500 relative
            ${plan.gold 
              ? "bg-[#05070a] border-amber-500/30 shadow-[0_30px_60px_-15px_rgba(212,143,22,0.3)] text-white" 
              : plan.popular 
                ? "bg-white border-secondary/50 shadow-2xl scale-105 z-10" 
                : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl"
            }`}
          >
            {/* Badges de Status */}
            {plan.popular && !plan.gold && (
              <div className="absolute top-6 right-8 bg-secondary text-primary text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                Popular
              </div>
            )}
            {plan.gold && (
              <div className="absolute top-6 right-8 bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                Exclusive
              </div>
            )}

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 
              ${plan.gold ? "bg-amber-500/10 text-amber-500" : "bg-primary/5 text-primary"}`}>
              <plan.icon size={28} />
            </div>

            <div className="mb-8">
              <h4 className={`text-2xl font-black uppercase tracking-tighter leading-tight ${plan.gold ? "text-white" : "text-primary"}`}>
                {plan.name}
              </h4>
              <p className={`text-sm font-medium mt-2 ${plan.gold ? "text-white/40" : "text-slate-400"}`}>
                {plan.description}
              </p>
            </div>

            <div className="mb-10 flex items-baseline gap-1">
              <span className="text-xs font-bold opacity-40 uppercase">R$</span>
              <span className={`text-5xl font-black tracking-tighter ${plan.gold ? "text-amber-500" : "text-primary"}`}>
                {plan.price}
              </span>
              {plan.price !== "Sob Consulta" && <span className="text-[10px] font-bold opacity-30 uppercase ml-1">/mês</span>}
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold">
                  <Check size={18} className={plan.gold ? "text-amber-500" : "text-secondary"} />
                  <span className={plan.gold ? "text-white/70" : "text-slate-600"}>{feature}</span>
                </li>
              ))}
            </ul>

            {plan.warning && (
              <p className="mb-6 text-[9px] font-black uppercase tracking-widest text-amber-500/60 text-center italic">
                {plan.warning}
              </p>
            )}

            <Button 
              className={`w-full py-8 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all
                ${plan.gold 
                  ? "bg-amber-500 text-black hover:bg-white" 
                  : "bg-primary text-white hover:bg-secondary hover:text-primary shadow-lg"}`}
              asChild
            >
              <a href={`https://wa.me/5568992161717?text=Interesse no ${plan.name}`} target="_blank">
                Selecionar Protocolo
              </a>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}