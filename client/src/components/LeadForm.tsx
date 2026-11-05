import type { FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

export default function LeadForm() {
  function recordConsent(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const description = form.elements.namedItem("description");
    const message = form.querySelector<HTMLTextAreaElement>("#lead-message")?.value.trim() ?? "";
    const service = form.querySelector<HTMLSelectElement>("#business-service");
    const consent = form.querySelector<HTMLInputElement>("#lead-consent");

    if (!(description instanceof HTMLInputElement) || !service || !consent?.checked) {
      event.preventDefault();
      return;
    }

    description.value = [
      "Origem: formulário de proposta empresarial do site SerClin.",
      `Serviço empresarial solicitado: ${service.value}.`,
      message ? `Mensagem: ${message}` : "Mensagem: não informada.",
      "Consentimento LGPD: concedido para que o Instituto SerClin responda a esta solicitação. O usuário foi orientado a não inserir informações clínicas sensíveis.",
    ].join("\n");
  }

  return (
    <form
      className="multi-lead-form"
      action="https://webto.salesforce.com/servlet/index.php/WebToLead?encoding=UTF-8"
      method="POST"
      acceptCharset="UTF-8"
      onSubmit={recordConsent}
    >
      <input type="hidden" name="oid" value="00DgL00000L3Dav" />
      <input type="hidden" name="retURL" value="https://serclin.vercel.app/obrigado" />
      <input type="hidden" name="lead_source" value="Web" />
      <input type="hidden" name="lead_status" value="Aberto - Não contatado" />
      <input type="hidden" name="description" id="lead-description" value="" />

      <div className="multi-form-grid">
        <label>
          Seu nome
          <input name="last_name" type="text" autoComplete="name" required placeholder="Nome completo" />
        </label>
        <label>
          Empresa
          <input name="company" type="text" autoComplete="organization" required placeholder="Nome da empresa" />
        </label>
        <label>
          E-mail
          <input name="email" type="email" autoComplete="email" required placeholder="voce@empresa.com.br" />
        </label>
        <label>
          WhatsApp
          <input name="phone" type="tel" autoComplete="tel" required placeholder="(68) 99999-9999" />
        </label>
      </div>
      <label>
        Serviço empresarial de interesse
        <select id="business-service" required defaultValue="">
          <option value="" disabled>Selecione uma opção</option>
          <option value="Palestra presencial (2h)">Palestra presencial (2h)</option>
          <option value="Palestra online (1h30)">Palestra online (1h30)</option>
          <option value="Workshop corporativo (4h)">Workshop corporativo (4h)</option>
          <option value="Diagnóstico organizacional / clima">Diagnóstico organizacional / clima</option>
          <option value="Recrutamento e Seleção Psicológico">Recrutamento e Seleção Psicológico</option>
          <option value="Programa Mensal Essencial">Programa Mensal Essencial</option>
          <option value="Programa Mensal Avançado">Programa Mensal Avançado</option>
          <option value="Programa Mensal Premium">Programa Mensal Premium</option>
          <option value="Avaliação Neuropsicológica Corporativa">Avaliação Neuropsicológica Corporativa</option>
        </select>
      </label>
      <label>
        Conte brevemente o que sua empresa procura
        <textarea id="lead-message" rows={5} placeholder="Tamanho da equipe, serviço de interesse ou objetivo da proposta" />
      </label>
      <label className="multi-consent">
        <input id="lead-consent" type="checkbox" required />
        <span>Consentimento LGPD: concordo que os dados informados sejam enviados ao Instituto SerClin para responder a esta solicitação. Não incluirei informações clínicas sensíveis neste formulário.</span>
      </label>
      <button className="button button-primary" type="submit">
        Enviar solicitação <ArrowUpRight size={16} aria-hidden="true" />
      </button>
      <p className="multi-form-note">O formulário é para contato empresarial. Para atendimento de famílias, fale com a equipe pelo WhatsApp.</p>
    </form>
  );
}
