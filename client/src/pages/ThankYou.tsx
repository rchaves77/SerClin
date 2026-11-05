import { Check } from "lucide-react";
import SiteLayout, { WhatsAppLink } from "../components/SiteLayout";

export default function ThankYou() {
  return (
    <SiteLayout active="/contato">
      <section className="multi-section multi-thank-you">
        <span className="multi-thank-icon"><Check size={28} aria-hidden="true" /></span>
        <span className="multi-kicker">Instituto SerClin</span>
        <h1>Recebemos sua solicitação.</h1>
        <p>A equipe SerClin retornará pelos dados informados. Se preferir, você também pode falar diretamente pelo WhatsApp.</p>
        <WhatsAppLink message="Olá! Enviei uma solicitação pelo site e gostaria de conversar com a equipe SerClin.">Falar no WhatsApp</WhatsAppLink>
        <a className="text-link" href="/">Voltar à página inicial</a>
      </section>
    </SiteLayout>
  );
}
