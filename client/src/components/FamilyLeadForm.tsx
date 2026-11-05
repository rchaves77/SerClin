import type { FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

export default function FamilyLeadForm() {
  function recordConsent(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const description = form.elements.namedItem("description");
    const interest = form.elements.namedItem("00NgL00003Dnk2H");
    const message = form.querySelector<HTMLTextAreaElement>("#family-lead-message")?.value.trim() ?? "";
    const consent = form.querySelector<HTMLInputElement>("#family-lead-consent");

    if (!(description instanceof HTMLInputElement) || !(interest instanceof HTMLSelectElement) || !consent?.checked) {
      event.preventDefault();
      return;
    }

    description.value = [
      "Origem: formulário de contato familiar do site SerClin.",
      `Área de interesse: ${interest.value || "não informada"}.`,
      message ? `Mensagem: ${message}` : "Mensagem: não informada.",
      "Consentimento LGPD: concedido para que o Instituto SerClin responda a esta solicitação. O usuário foi orientado a não inserir informações clínicas sensíveis.",
    ].join("\n");
  }

  return (
    <form
      className="multi-lead-form"
      action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8"
      method="POST"
      acceptCharset="UTF-8"
      onSubmit={recordConsent}
    >
      <input type="hidden" name="oid" value="00DgL00000L3Dav" />
      <input type="hidden" name="retURL" value="https://serclin.vercel.app/obrigado" />
      <input type="hidden" name="company" value="Instituto SerClin - Site" />
      <input type="hidden" name="lead_source" value="Web" />
      <input type="hidden" name="lead_status" value="Aberto - Não contatado" />
      <input type="hidden" name="description" id="family-lead-description" value="" />

      <div className="multi-form-grid">
        <label>
          Seu nome completo
          <input name="last_name" type="text" autoComplete="name" required placeholder="Nome completo" />
        </label>
        <label>
          E-mail
          <input name="email" type="email" autoComplete="email" required placeholder="voce@email.com" />
        </label>
        <label>
          WhatsApp
          <input name="phone" type="tel" autoComplete="tel" required placeholder="(68) 99999-9999" />
        </label>
        <label>
          Área de interesse
          <select name="00NgL00003Dnk2H" required defaultValue="">
            <option value="" disabled>Selecione uma opção</option>
            <option value="Neuropsicologia">Neuropsicologia</option>
            <option value="Psicoterapia">Psicoterapia</option>
            <option value="Psicopedagogia">Psicopedagogia</option>
          </select>
        </label>
      </div>
      <label>
        Mensagem
        <textarea id="family-lead-message" rows={4} placeholder="Conte brevemente como podemos entrar em contato. Não inclua informações clínicas sensíveis." />
      </label>
      <label className="multi-consent">
        <input id="family-lead-consent" type="checkbox" required />
        <span>Consentimento LGPD: concordo que os dados informados sejam enviados ao Instituto SerClin para responder a esta solicitação. Não incluirei informações clínicas sensíveis neste formulário.</span>
      </label>
      <button className="button button-primary" type="submit">
        Enviar solicitação <ArrowUpRight size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
