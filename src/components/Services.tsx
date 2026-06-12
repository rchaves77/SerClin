import { Brain, HeartHandshake, BookOpen, Apple, Activity, Volume2, ShieldAlert } from "lucide-react";

export function Services() {
  const specs = [
    { icon: Brain, title: "Neuropsicologia", desc: "Avaliação cognitiva detalhada, testes de TDAH, Autismo, memória e foco com laudos de alto rigor técnico." },
    { icon: HeartHandshake, title: "Psicoterapia", desc: "Apoio clínico para ansiedade, depressão, burnout e autodescoberta para crianças, adultos e casais." },
    { icon: BookOpen, title: "Psicopedagogia", desc: "Suporte especializado para dificuldades de aprendizado, foco escolar, dislexia e organização de estudos." },
    { icon: ShieldAlert, title: "Psiquiatria", desc: "Diagnóstico médico, manejo seguro de medicações e suporte farmacológico em total sigilo profissional." },
    { icon: Volume2, title: "Fonoaudiologia", desc: "Terapia de linguagem, voz, motricidade orofacial e treino de oratória para todas as faixas etárias." },
    { icon: Apple, title: "Nutrição", desc: "Reeducação alimentar sob medida para emagrecimento, hipertrofia e suporte à saúde metabólica." },
    { icon: Activity, title: "Fisioterapia", desc: "Alívio de dores crônicas, reabilitação muscular e postural por terapias manuais integradas." },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
      {specs.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-md hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-primary/5 group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center mb-6 transition-all duration-300 shadow-sm">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-primary mb-3 group-hover:text-secondary transition-colors">
              {s.title}
            </h3>
            <p className="text-xs font-semibold text-slate-400 leading-relaxed">
              {s.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
