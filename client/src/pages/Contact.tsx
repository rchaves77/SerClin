import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import FamilyLeadForm from "../components/FamilyLeadForm";
import SiteLayout, { MAPS_URL, WhatsAppLink } from "../components/SiteLayout";

export default function Contact() {
  return (
    <SiteLayout active="/contato">
      <section className="multi-page-hero">
        <span className="multi-kicker">Instituto SerClin · Rio Branco, AC</span>
        <h1>Fale com a equipe SerClin.</h1>
        <p className="multi-lede">Famílias podem iniciar pelo WhatsApp ou pelo formulário. Empresas têm uma página própria para solicitar propostas.</p>
      </section>

      <section className="multi-section multi-soft multi-contact-layout" aria-label="Contato para famílias">
        <article className="multi-contact-family" id="familias">
          <span className="multi-card-icon"><MessageCircle size={22} aria-hidden="true" /></span>
          <span className="multi-kicker">Para famílias</span>
          <h2>Comece por uma conversa.</h2>
          <p>O acolhimento é imediato pelo WhatsApp. A primeira consulta acontece em até 48 horas, conforme o agendamento da equipe.</p>
          <WhatsAppLink message="Olá! Quero conversar sobre atendimento para minha família no Instituto SerClin.">Conversar pelo WhatsApp</WhatsAppLink>
          <div className="multi-contact-details">
            <a href="tel:+5568992161717">+55 (68) 99216-1717</a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"><MapPin size={15} aria-hidden="true" />Rua Sorocaba, 140, Doca Furtado, Rio Branco–AC <ArrowRight size={14} aria-hidden="true" /></a>
          </div>
        </article>

        <article className="multi-contact-business" id="formulario-familias">
          <span className="multi-kicker">Formulário de atendimento familiar</span>
          <h2>Prefere deixar seus dados?</h2>
          <p>A equipe entrará em contato sobre sua solicitação. O formulário não é apropriado para informações clínicas sensíveis.</p>
          <FamilyLeadForm />
        </article>
      </section>

      <section className="multi-section multi-dark-section">
        <div className="multi-section-head">
          <span className="multi-kicker">Para empresas</span>
          <h2>Precisa de uma proposta empresarial?</h2>
          <p>Conheça o catálogo B2B, os programas recorrentes e envie uma solicitação pela página dedicada a empresas.</p>
          <a className="button button-light" href="/empresas">Ir para Empresas <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </section>
    </SiteLayout>
  );
}
