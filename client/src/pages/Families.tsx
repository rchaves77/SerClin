import { ArrowRight, BookOpen, Brain, Heart, Puzzle } from "lucide-react";
import SiteLayout, { WhatsAppLink } from "../components/SiteLayout";

const services = [
  {
    icon: Brain,
    number: "01",
    title: "Avaliação neuropsicológica",
    text: "O exame completo da mente: atenção, memória, aprendizagem e comportamento. Pode investigar TDAH, TEA, dislexia, dificuldades escolares e queixas de memória; adultos também procuram avaliação em questões relacionadas à ansiedade ou depressão.",
    link: "/avaliacao-neuropsicologica",
    linkText: "Entenda a avaliação",
  },
  {
    icon: Heart,
    number: "02",
    title: "Psicoterapia",
    text: "Atendimento individual para crianças, adolescentes e adultos, com acompanhamento contínuo e humanizado.",
    link: "/contato",
    linkText: "Converse com a equipe",
  },
  {
    icon: Puzzle,
    number: "03",
    title: "Psicopedagogia",
    text: "Avaliação e intervenção nas dificuldades de aprendizagem, em parceria com a família e a escola.",
    link: "/contato",
    linkText: "Converse com a equipe",
  },
];

const faqs = [
  ["Para quais idades há atendimento?", "O Instituto atende crianças, adolescentes, adultos e idosos. A equipe conversa com você para orientar o formato adequado para cada caso."],
  ["A avaliação dá um diagnóstico garantido?", "Não. A avaliação investiga hipóteses com entrevistas, testes e análise profissional; nenhum resultado específico pode ser prometido."],
  ["Quais são os prazos da avaliação?", "O acolhimento é imediato, a primeira consulta acontece em até 48 horas e o laudo é entregue em até 30 dias após as sessões de testes."],
  ["Como conheço os planos?", "A página Planos apresenta os valores e inclusões publicados pelo Instituto. Para confirmar disponibilidade ou conversar sobre um serviço, fale com a equipe."],
];

export default function Families() {
  return (
    <SiteLayout active="/familias">
      <section className="multi-page-hero">
        <span className="multi-kicker">Para famílias · Rio Branco, AC</span>
        <h1>Avaliação neuropsicológica completa em <em>Rio Branco</em></h1>
        <p className="multi-lede">Com rigor científico e acolhimento. Conduzida por profissional formada pela USP-SP, com mais de 10 anos de experiência. Laudo detalhado, devolutiva clara e um plano de cuidado para a sua família.</p>
        <div className="multi-actions">
          <WhatsAppLink message="Olá! Quero saber qual atendimento do Instituto SerClin pode ajudar minha família.">Agendar conversa</WhatsAppLink>
          <a className="text-link" href="/planos">Ver planos de cuidado <ArrowRight size={15} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="multi-section multi-soft">
        <div className="multi-section-head">
          <span className="multi-kicker">Nossos serviços</span>
          <h2>Um cuidado integrado, sem perder de vista cada pessoa.</h2>
        </div>
        <div className="multi-service-grid">
          {services.map(({ icon: Icon, number, title, text, link, linkText }) => (
            <article className="multi-service-card" key={number}>
              <span className="multi-service-number">{number}</span>
              <span className="multi-card-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
              <a className="multi-card-link" href={link}>{linkText} <ArrowRight size={15} aria-hidden="true" /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="multi-section">
        <div className="multi-two-column">
          <div>
            <span className="multi-kicker">Planos de cuidado</span>
            <h2>Três opções para conhecer.</h2>
            <p>Os planos são apresentados em uma página própria, com valores e inclusões para você comparar com calma.</p>
          </div>
          <div className="multi-plan-teaser">
            <a href="/planos"><span>Cuidado Essencial</span><ArrowRight size={16} aria-hidden="true" /></a>
            <a href="/planos"><span>Jornada Contínua</span><ArrowRight size={16} aria-hidden="true" /></a>
            <a href="/planos"><span>Família Prestige</span><ArrowRight size={16} aria-hidden="true" /></a>
            <a className="multi-card-link" href="/planos">Ver planos e valores <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="multi-section multi-soft">
        <div className="multi-two-column">
          <div>
            <span className="multi-kicker">Programa de Desenvolvimento</span>
            <h2>Apoio organizado para a jornada de aprendizagem.</h2>
            <p>Uma proposta de triagem e ciclo de acompanhamento apresentada separadamente dos planos de terapia.</p>
          </div>
          <article className="multi-program-card">
            <BookOpen size={24} aria-hidden="true" />
            <h3>Programa de Desenvolvimento</h3>
            <p>Triagem individual: <strong>R$ 100</strong>.</p>
            <p>Ciclo de 3 meses: <strong>3x de R$ 380</strong> ou <strong>R$ 980 no PIX</strong>.</p>
            <WhatsAppLink message="Olá! Quero saber mais sobre o Programa de Desenvolvimento do Instituto SerClin." className="multi-inline-cta">Tirar dúvidas pelo WhatsApp</WhatsAppLink>
          </article>
        </div>
      </section>

      <section className="multi-section">
        <div className="multi-two-column">
          <div>
            <span className="multi-kicker">Parcerias institucionais</span>
            <h2>Converse com a equipe sobre as condições disponíveis.</h2>
            <p>O Instituto informa parcerias e convênios institucionais, incluindo AFAC (Associação Família Azul) e SINPROAC. Consulte a equipe para confirmar se alguma condição se aplica ao seu caso.</p>
          </div>
          <a className="multi-rating-card" href="https://maps.app.goo.gl/EBw3iRXYR7DGFqYNA" target="_blank" rel="noopener noreferrer">
            <span className="multi-rating">5,0 <span aria-label="cinco estrelas">★★★★★</span></span>
            <strong>Nota no Google</strong>
            <span>Confira o perfil do Instituto SerClin</span>
          </a>
        </div>
      </section>

      <section className="multi-section multi-soft">
        <div className="multi-section-head"><span className="multi-kicker">Dúvidas frequentes</span><h2>Informação clara, antes de começar.</h2></div>
        <div className="multi-faq-list">
          {faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
      </section>
      <section className="multi-section multi-final-call"><h2>Comece por uma conversa.</h2><p>O acolhimento é imediato pelo WhatsApp; a primeira consulta acontece em até 48 horas, conforme o agendamento.</p><WhatsAppLink message="Olá! Quero conversar sobre atendimento para minha família no Instituto SerClin.">Falar com a equipe</WhatsAppLink></section>
    </SiteLayout>
  );
}
