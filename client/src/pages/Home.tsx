import { ArrowRight, Building2, Brain, HeartHandshake, Star, UsersRound } from "lucide-react";
import SiteLayout, { WhatsAppLink } from "../components/SiteLayout";

const MAPS_URL = "https://maps.app.goo.gl/EBw3iRXYR7DGFqYNA";

export default function Home() {
  return (
    <SiteLayout active="/">
      <section className="multi-hero multi-home-hero">
        <div className="multi-hero-copy">
          <span className="multi-kicker"><Brain size={15} aria-hidden="true" /> Neuropsicologia em Rio Branco, Acre</span>
          <h1>Neuropsicologia com rigor científico para famílias e empresas.</h1>
          <p className="multi-lede">Avaliação neuropsicológica completa em Rio Branco, com acolhimento, laudo detalhado e devolutiva clara, conduzida por profissional formada pela USP-SP e com mais de 10 anos de experiência.</p>
          <div className="multi-actions">
            <WhatsAppLink message="Olá! Quero agendar uma avaliação neuropsicológica no Instituto SerClin.">Agendar avaliação</WhatsAppLink>
            <a className="text-link" href="/avaliacao-neuropsicologica">Conhecer a avaliação <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
          <div className="multi-credential-line"><span>USP-SP</span><i /> <span>+10 anos de experiência</span><i /> <span>Equipe multiprofissional</span></div>
          <div className="multi-audience-intro"><span className="multi-kicker">Escolha seu caminho</span><span>Atendimento com informação clara para cada público.</span></div>
          <div className="multi-audience-grid">
            <a className="multi-audience-card" href="/familias">
              <span className="multi-card-icon"><HeartHandshake size={23} aria-hidden="true" /></span>
              <span className="multi-card-label">Cuidado individual e familiar</span>
              <h3>Sou Família</h3>
              <p>Avaliação neuropsicológica, psicoterapia e psicopedagogia para crianças, adolescentes e adultos.</p>
              <span className="multi-card-link">Conhecer o atendimento <ArrowRight size={16} aria-hidden="true" /></span>
            </a>
            <a className="multi-audience-card multi-audience-business" href="/empresas">
              <span className="multi-card-icon"><Building2 size={23} aria-hidden="true" /></span>
              <span className="multi-card-label">Saúde mental no trabalho</span>
              <h3>Sou Empresa</h3>
              <p>Programas recorrentes, palestras, workshops, diagnóstico organizacional e seleção psicológica.</p>
              <span className="multi-card-link">Ver soluções empresariais <ArrowRight size={16} aria-hidden="true" /></span>
            </a>
          </div>
        </div>
        <div className="multi-hero-visual" aria-label="Marca oficial do Instituto SerClin">
          <span className="multi-visual-caption">Saúde e bem-estar</span>
          <img src="/serclin-logo.png" alt="Logo oficial do Instituto SerClin em azul-marinho e dourado" width="604" height="413" />
          <span className="multi-visual-location">Rio Branco · AC</span>
        </div>
      </section>

      <section className="multi-proof-section">
        <div className="multi-proof-grid">
          <a className="multi-proof-card" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
            <span className="multi-proof-icon"><Star size={18} aria-hidden="true" /></span>
            <strong>Nota 5,0 no Google</strong>
            <span>Ver o perfil do Instituto</span>
          </a>
          <div className="multi-proof-card"><span className="multi-proof-icon"><Brain size={18} aria-hidden="true" /></span><strong>Formação USP-SP</strong><span>Helenara Chaves</span></div>
          <div className="multi-proof-card"><span className="multi-proof-icon"><UsersRound size={18} aria-hidden="true" /></span><strong>Mais de 10 anos</strong><span>Experiência em avaliação neuropsicológica</span></div>
          <div className="multi-proof-card"><span className="multi-proof-icon"><HeartHandshake size={18} aria-hidden="true" /></span><strong>Equipe multiprofissional</strong><span>Parcerias institucionais informadas, como AFAC</span></div>
        </div>
      </section>

      <section className="multi-section multi-final-call">
        <span className="multi-kicker">Instituto SerClin · Rio Branco</span>
        <h2>Um primeiro contato pode ajudar a organizar os próximos passos.</h2>
        <p>O acolhimento começa pelo WhatsApp. A primeira consulta acontece em até 48 horas, conforme o agendamento da equipe.</p>
        <WhatsAppLink message="Olá! Gostaria de conversar com a equipe do Instituto SerClin.">Falar com a equipe</WhatsAppLink>
      </section>
    </SiteLayout>
  );
}
