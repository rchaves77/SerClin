import { ArrowRight, Building2, Check } from "lucide-react";
import LeadForm from "../components/LeadForm";
import SiteLayout from "../components/SiteLayout";

const services = [
  { title: "Palestra presencial", price: "R$ 2.000", unit: "2 horas · até 50 participantes", text: "Temas: estresse, burnout, saúde mental e neurociência do comportamento." },
  { title: "Palestra online", price: "R$ 1.200", unit: "1h30", text: "Conteúdo para equipes remotas, com a mesma qualidade de preparação e condução." },
  { title: "Workshop corporativo", price: "R$ 3.500", unit: "4 horas · até 20 pessoas", text: "Atividade prática sobre gestão de emoções, comunicação e produtividade cognitiva." },
  { title: "Diagnóstico organizacional / clima", price: "R$ 4.200", unit: "Projeto de 1 mês", text: "Pesquisa de clima, análise e devolutiva com plano de ação, alinhado à NR-1." },
  { title: "Recrutamento e seleção psicológica", price: "R$ 650 / vaga", unit: "Por vaga", text: "Avaliação psicológica estruturada de candidatos e parecer técnico." },
  { title: "Avaliação neuropsicológica corporativa", price: "Sob consulta", unit: "Por caso", text: "Avaliação de executivos e colaboradores indicados pela empresa." },
];

const programs = [
  { title: "Programa Mensal Essencial", range: "Até 20 colaboradores", price: "R$ 990/mês", items: ["Canal de acolhimento", "Sessões avulsas com desconto", "Ações mensais de conscientização"] },
  { title: "Programa Mensal Avançado", range: "21 a 100 colaboradores", price: "R$ 2.400/mês", items: ["Tudo do Essencial", "Sessões inclusas", "Indicadores trimestrais e apoio em afastamentos"] },
  { title: "Programa Mensal Premium", range: "100+ colaboradores", price: "R$ 4.900/mês", items: ["Atendimento recorrente", "Comitê de saúde mental", "Relatórios gerenciais e suporte ao RH"] },
];

const steps = [
  ["01", "Conversa diagnóstica", "Conversa inicial gratuita de 30 minutos para compreender o contexto da empresa."],
  ["02", "Proposta sob medida", "A proposta é preparada em até 5 dias, conforme os objetivos acordados."],
  ["03", "Implantação e acompanhamento", "Implantação do programa com acompanhamento mensal."],
];

export default function Companies() {
  return (
    <SiteLayout active="/empresas">
      <section className="multi-page-hero multi-business-hero">
        <span className="multi-kicker"><Building2 size={15} aria-hidden="true" /> Soluções empresariais · Rio Branco, AC</span>
        <h1>Saúde mental que gera resultado para a sua empresa.</h1>
        <p className="multi-lede">Programas recorrentes de saúde mental, avaliação psicológica em processos seletivos, palestras e diagnósticos organizacionais — conduzidos por neuropsicóloga formada pela USP-SP.</p>
        <a className="button button-primary" href="#proposta">Solicitar proposta <ArrowRight size={15} aria-hidden="true" /></a>
      </section>

      <section className="multi-section multi-soft">
        <div className="multi-section-head"><span className="multi-kicker">Catálogo empresarial</span><h2>Serviços para diferentes necessidades.</h2><p>Valores públicos do catálogo SerClin. Para avaliação neuropsicológica corporativa, solicite uma proposta por caso.</p></div>
        <div className="multi-catalog-grid">
          {services.map((item) => <article className="multi-catalog-card" key={item.title}><span className="multi-card-label">{item.unit}</span><h3>{item.title}</h3><strong className="multi-price">{item.price}</strong><p>{item.text}</p><a className="multi-card-link" href="#proposta">Pedir informações <ArrowRight size={14} aria-hidden="true" /></a></article>)}
        </div>
      </section>

      <section className="multi-section">
        <div className="multi-section-head"><span className="multi-kicker">Programas mensais recorrentes</span><h2>Um parceiro de saúde mental para a equipe.</h2><p>As faixas de colaboradores e inclusões seguem o catálogo aprovado.</p></div>
        <div className="multi-price-grid">
          {programs.map((program) => <article className="multi-plan-card" key={program.title}><span className="multi-card-label">{program.range}</span><h3>{program.title}</h3><strong className="multi-price">{program.price}</strong><ul>{program.items.map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul><a className="multi-card-link" href="#proposta">Solicitar proposta <ArrowRight size={14} aria-hidden="true" /></a></article>)}
        </div>
        <p className="multi-contract-note">Contrato mensal, sem multa de saída após o 3º mês. Sua empresa tem um parceiro de saúde mental fixo por menos do que o custo de uma diária.</p>
      </section>

      <section className="multi-section multi-dark-section">
        <div className="multi-section-head"><span className="multi-kicker">Como começar</span><h2>Uma contratação em três passos.</h2></div>
        <div className="multi-process-grid">{steps.map(([number, title, text]) => <article className="multi-process-card" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <a className="button button-light" href="#proposta">Solicitar conversa diagnóstica <ArrowRight size={15} aria-hidden="true" /></a>
      </section>

      <section id="proposta" className="multi-section multi-soft multi-contact-layout" aria-label="Solicitação de proposta para empresas">
        <article className="multi-contact-family">
          <span className="multi-kicker">Fale com o Instituto SerClin</span>
          <h2>Conte sobre a necessidade da sua empresa.</h2>
          <p>O formulário registra o serviço escolhido e sua mensagem para que a equipe possa responder à solicitação.</p>
        </article>
        <article className="multi-contact-business">
          <span className="multi-kicker">Formulário de proposta B2B</span>
          <LeadForm />
        </article>
      </section>
    </SiteLayout>
  );
}
