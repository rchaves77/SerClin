import { ArrowRight, Check, HeartHandshake, Sparkles } from "lucide-react";
import SiteLayout, { WhatsAppLink } from "../components/SiteLayout";

const plans = [
  { title: "Cuidado Essencial", price: "R$ 149,90", period: "/mês", description: "Acompanhamento regular com sessões quinzenais.", features: ["Sessão quinzenal de 50 minutos", "Suporte via WhatsApp"] },
  { title: "Jornada Contínua", price: "R$ 319,90", period: "/mês", description: "Mais espaço para acompanhamento e metas.", features: ["Quatro sessões mensais", "Monitoramento de metas", "Relatório semestral"] },
  { title: "Família Prestige", price: "Sob consulta", period: "", description: "Uma proposta de cuidado para a família.", features: ["Até quatro pessoas", "Terapias semanais", "Alinhamento familiar"] },
];

export default function Plans() {
  return (
    <SiteLayout active="/planos">
      <section className="multi-page-hero">
        <span className="multi-kicker"><HeartHandshake size={15} aria-hidden="true" /> Planos de cuidado</span>
        <h1>Opções claras para cuidar de você e da sua família.</h1>
        <p className="multi-lede">Conheça os três planos de cuidado e o Club SerClin. Para confirmar qual opção se ajusta ao seu caso, converse com a equipe.</p>
      </section>
      <section className="multi-section multi-soft">
        <div className="multi-price-grid">
          {plans.map((plan) => <article className="multi-plan-card" key={plan.title}><span className="multi-card-label">Plano de cuidado</span><h2>{plan.title}</h2><p>{plan.description}</p><div className="multi-price-line"><strong className="multi-price">{plan.price}</strong><span>{plan.period}</span></div><ul>{plan.features.map((feature) => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul><WhatsAppLink className="multi-inline-cta" message={`Olá! Quero informações sobre o plano ${plan.title} do Instituto SerClin.`}>Consultar este plano <ArrowRight size={14} aria-hidden="true" /></WhatsAppLink></article>)}
        </div>
      </section>
      <section className="multi-section">
        <div className="multi-club-card">
          <span className="multi-club-icon"><Sparkles size={23} aria-hidden="true" /></span>
          <div><span className="multi-kicker">Clube de benefícios · separado dos planos de terapia</span><h2>Club SerClin</h2><p>Acolhimento em até 48 horas, valores exclusivos em Psiquiatria e Neuropsicologia e descontos recorrentes.</p></div>
          <div className="multi-club-price"><strong>R$ 127,90</strong><span>/mês</span></div>
          <WhatsAppLink message="Olá! Quero saber mais sobre o Club SerClin.">Consultar o Club</WhatsAppLink>
        </div>
      </section>
      <section className="multi-section multi-soft">
        <div className="multi-section-head"><span className="multi-kicker">Informações</span><h2>Converse com a equipe antes de escolher.</h2><p>Os planos de cuidado e o Club SerClin são propostas diferentes. O Programa de Desenvolvimento é apresentado na página de atendimento para famílias.</p></div>
        <WhatsAppLink message="Olá! Quero conversar sobre os planos de cuidado do Instituto SerClin.">Falar no WhatsApp</WhatsAppLink>
      </section>
    </SiteLayout>
  );
}
