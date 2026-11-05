import { ArrowRight, Brain, FileCheck2, UsersRound } from "lucide-react";
import SiteLayout, { WhatsAppLink } from "../components/SiteLayout";

const areas = [
  ["Atenção e comportamento", "Investigar questões como TDAH e TEA com entrevistas, testes e análise profissional."],
  ["Aprendizagem", "Compreender dificuldades escolares e hipóteses como dislexia, respeitando a história de cada pessoa."],
  ["Memória e envelhecimento", "Avaliar queixas de memória e outras funções cognitivas ao longo da vida, inclusive em adultos que relatam questões relacionadas à ansiedade ou depressão."],
  ["Relatórios e documentos", "Produzir informação técnica que pode apoiar decisões na escola, em concursos ou no INSS; a aceitação depende das regras de cada instituição."],
];

const steps = [
  ["01", "Acolhimento e conversa inicial", "A equipe recebe o contato imediatamente e orienta como começar. A primeira consulta acontece em até 48 horas, conforme o agendamento."],
  ["02", "Entrevista e história", "Conversamos sobre desenvolvimento, saúde, escola, trabalho e rotina para entender o contexto."],
  ["03", "Sessões de testes", "Testes e atividades são escolhidos conforme a idade e as questões que precisam ser investigadas."],
  ["04", "Devolutiva e laudo", "Os resultados são explicados em linguagem clara. O laudo é entregue em até 30 dias após a conclusão das sessões de testes."],
];

const faqs = [
  ["A avaliação confirma um diagnóstico?", "A avaliação investiga hipóteses e reúne informações para a análise profissional. Não é possível garantir previamente um diagnóstico ou resultado."],
  ["Para quais idades é indicada?", "O Instituto atende crianças, adolescentes, adultos e idosos. A equipe orienta sobre o formato adequado durante a conversa inicial."],
  ["Em quanto tempo recebo o laudo?", "Em até 30 dias depois da conclusão das sessões de testes neuropsicológicos; o prazo não começa no primeiro contato."],
  ["O laudo pode ser levado à escola, concurso ou INSS?", "O documento pode apoiar decisões, mas sua aceitação e uso dependem das regras da escola, do órgão ou do processo correspondente."],
  ["O que recebo ao final?", "Laudo detalhado, devolutiva presencial e recomendações práticas. O laudo SerClin inclui QR Code para conferência de autenticidade."],
  ["Quanto custa a avaliação?", "O valor depende das necessidades e do formato da avaliação. Fale com a equipe pelo WhatsApp para receber orientação e orçamento."],
];

export default function Neuropsychology() {
  return (
    <SiteLayout active="/avaliacao-neuropsicologica">
      <section className="multi-page-hero">
        <span className="multi-kicker"><Brain size={15} aria-hidden="true" /> Avaliação neuropsicológica · Rio Branco</span>
        <h1>Avaliação neuropsicológica completa em Rio Branco.</h1>
        <p className="multi-lede">Um processo cuidadoso para compreender atenção, memória, aprendizagem e comportamento, com acolhimento e orientação em cada etapa.</p>
        <div className="multi-actions"><WhatsAppLink message="Olá! Quero conversar sobre uma avaliação neuropsicológica no Instituto SerClin.">Agendar avaliação</WhatsAppLink><a className="text-link" href="/familias">Ver atendimento para famílias <ArrowRight size={15} aria-hidden="true" /></a></div>
        <div className="multi-credential-line"><span>Helenara Chaves</span><i /><span>USP-SP</span><i /><span>Mais de 10 anos de experiência</span></div>
      </section>

      <section className="multi-section multi-soft">
        <div className="multi-section-head"><span className="multi-kicker">O que pode investigar</span><h2>Uma avaliação para perguntas diferentes.</h2><p>Indicada para crianças, adolescentes, adultos e idosos. A conclusão depende dos dados obtidos e da análise profissional.</p></div>
        <div className="multi-needs-grid">{areas.map(([title, text], index) => <article className="multi-need-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="multi-section">
        <div className="multi-section-head"><span className="multi-kicker">Etapas</span><h2>O processo, explicado do começo ao fim.</h2></div>
        <div className="multi-steps">{steps.map(([number, title, text]) => <article className="multi-step" key={number}><span className="multi-step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>

      <section className="multi-section multi-soft">
        <div className="multi-outcomes-grid">
          <article><span className="multi-card-icon"><FileCheck2 size={22} aria-hidden="true" /></span><h2>O que o laudo entrega</h2><p>Um documento detalhado, com devolutiva presencial e recomendações práticas. O laudo SerClin tem QR Code para conferência de autenticidade.</p></article>
          <article><span className="multi-card-icon"><UsersRound size={22} aria-hidden="true" /></span><h2>Por que o Instituto SerClin</h2><p>Condução de Helenara Chaves, formada pela USP-SP e com mais de 10 anos de experiência em avaliação neuropsicológica, com equipe multiprofissional.</p></article>
        </div>
      </section>

      <section className="multi-section">
        <div className="multi-section-head"><span className="multi-kicker">Perguntas frequentes</span><h2>O que é útil saber antes de agendar.</h2></div>
        <div className="multi-faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>
      <section className="multi-section multi-final-call"><h2>Comece com uma conversa acolhedora.</h2><p>O acolhimento é imediato; a primeira consulta acontece em até 48 horas, conforme disponibilidade de agendamento.</p><WhatsAppLink message="Olá! Quero agendar uma avaliação neuropsicológica no Instituto SerClin.">Falar no WhatsApp</WhatsAppLink></section>
    </SiteLayout>
  );
}
