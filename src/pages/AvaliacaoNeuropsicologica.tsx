import { useEffect } from "react";
import {
  Brain,
  Clock,
  FileText,
  GraduationCap,
  MapPin,
  MessageCircle,
  Puzzle,
  QrCode,
  Scale,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* =====================================================================
   CONFIGURAÇÃO — edite só aqui
   ===================================================================== */

const WHATSAPP_NUMBER = "5568992161717";

// Link do Instituto no Google Maps
const MAPS_URL = "https://maps.app.goo.gl/EBw3iRXYR7DGFqYNA";

const PAGE_TITLE =
  "Avaliação Neuropsicológica em Rio Branco (AC) | Instituto SerClin";
const PAGE_DESCRIPTION =
  "Avaliação neuropsicológica em Rio Branco (AC): primeira consulta em até 48h e laudo em até 30 dias após os testes. Profissional formada na USP-SP, +10 anos.";

/* CONFIRMAR: estimativa conservadora (25 laudos/mês x ~11 meses ativos
   x 10 anos = ~2.750). Troque pelo número real do sistema quando tiver. */
const AUTHORITY_STATS = [
  { value: "+10 anos", label: "de avaliação neuropsicológica" },
  { value: "+2.500", label: "avaliações realizadas" },
  { value: "48h", label: "para a primeira consulta" },
  { value: "30 dias", label: "para o laudo, após os testes" },
];

/* PROVA SOCIAL — regra do plano do site: sem depoimentos, sem nomes de
   pacientes e sem contagem de avaliações. Só a nota do Google (5,0,
   conferida em 05/11/2026), credenciais e equipe.
   Cole o link do perfil em GOOGLE_REVIEWS_URL para mostrar o botão
   "Ver as avaliações no Google". */
const GOOGLE_REVIEWS_URL = "";
const GOOGLE_RATING = "5,0";

/* PLANO PÓS-LAUDO — assinatura para quem conclui a avaliação.
   Espelha o "Plano Completo" já publicado na Home (4 sessões/mês de 50 min,
   relatório trimestral, acompanhamento prioritário), sem preço na página.
   Para ocultar a seção, troque o valor por null. */
type PostEvaluationPlan = {
  title: string;
  text: string;
  cta: string;
  whatsappMessage: string;
};
const POST_EVALUATION_PLAN = {
  title: "Depois do laudo, o cuidado continua.",
  text: "Quem conclui a avaliação pode seguir no Plano Completo: 4 sessões por mês de 50 minutos, relatório trimestral e acompanhamento prioritário. Sessões não cumulativas, e você cancela quando quiser.",
  cta: "Quero saber do plano pós-laudo",
  whatsappMessage:
    "Olá! Fiz ou vou fazer a avaliação neuropsicológica e quero saber do Plano Completo de acompanhamento.",
} as PostEvaluationPlan | null;

/* =====================================================================
   COPY
   ===================================================================== */

const PAIN_POINTS = [
  "Seu filho se esforça, mas as notas não acompanham.",
  "A escola diz uma coisa, o pediatra diz outra.",
  "Você perde o foco, esquece tudo e vive atrasado, sem saber por quê.",
  "Um familiar idoso anda esquecendo coisas e ninguém sabe se é da idade.",
];

const USE_CASES = [
  {
    icon: Zap,
    title: "TDAH",
    text: "Entender se atenção, agitação e impulsividade fogem do esperado.",
  },
  {
    icon: Puzzle,
    title: "TEA (autismo)",
    text: "Investigar comunicação, interação social e comportamento.",
  },
  {
    icon: GraduationCap,
    title: "Dificuldades de aprendizagem",
    text: "Achar onde trava a leitura, a escrita ou a matemática.",
  },
  {
    icon: Brain,
    title: "Memória e envelhecimento",
    text: "Avaliar perdas de memória e investigar sinais de demência.",
  },
  {
    icon: Scale,
    title: "Laudo para escola ou Justiça",
    text: "Documento técnico para apoiar decisões na escola ou em processos.",
  },
];

const STEPS = [
  {
    title: "Conversa inicial",
    text: "Você chama no WhatsApp e é acolhido de imediato. Explicamos o processo e marcamos a primeira consulta.",
    deadline: "Primeira consulta em até 48h",
  },
  {
    title: "Entrevista",
    text: "Ouvimos a história: desenvolvimento, saúde, escola ou trabalho e rotina.",
  },
  {
    title: "Testes e observação",
    text: "Sessões com testes e atividades adequados à idade de quem é avaliado.",
  },
  {
    title: "Devolutiva e laudo",
    text: "Explicamos tudo em linguagem simples. O laudo completo sai em até 30 dias depois das sessões de testes.",
    deadline: "Laudo em até 30 dias após os testes",
  },
];

const DIFFERENTIALS = [
  {
    icon: ShieldCheck,
    title: "Quem avalia tem formação e rotina",
    text: "Helenara Chaves, formada na USP-SP, com mais de 10 anos em avaliação neuropsicológica.",
  },
  {
    icon: Users,
    title: "Equipe multiprofissional",
    text: "Psicologia e psicopedagogia no Instituto, com psiquiatria parceira quando o caso pede.",
  },
  {
    icon: QrCode,
    title: "Laudo com QR Code",
    text: "Escola, médico ou advogado confere na hora se o documento é verdadeiro.",
  },
  {
    icon: FileText,
    title: "Depois do laudo, você não fica sozinho",
    text: "Se precisar de acompanhamento, o Instituto oferece psicoterapia e psicopedagogia.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Em quanto tempo recebo o resultado?",
    answer:
      "O laudo completo sai em até 30 dias depois das sessões de testes. A primeira consulta acontece em até 48h depois do seu contato.",
  },
  {
    question: "Em quanto tempo é a primeira consulta?",
    answer:
      "O acolhimento é imediato, assim que você chama no WhatsApp. A primeira consulta acontece em até 48h.",
  },
  {
    question: "O que é a devolutiva?",
    answer:
      "É a conversa em que explicamos os resultados em linguagem simples e tiramos suas dúvidas.",
  },
  {
    question: "Preciso de encaminhamento médico?",
    answer:
      "Não é obrigatório. Você pode agendar direto com a gente. Se já tem encaminhamento de neurologista, psiquiatra ou pediatra, ele é integrado à sua avaliação.",
  },
  {
    question: "Para quais idades a avaliação serve?",
    answer:
      "Atendemos crianças, adolescentes, adultos e idosos. Na conversa inicial, indicamos o formato mais adequado para cada caso.",
  },
  {
    question: "A avaliação dá um diagnóstico?",
    answer:
      "Ela reúne dados de testes, entrevistas e observação para esclarecer o quadro. Ajuda a confirmar ou descartar hipóteses, como TDAH e TEA. Não prometemos um resultado específico: entregamos uma resposta honesta, baseada em evidências.",
  },
  {
    question: "Quanto custa?",
    answer:
      "O valor depende do tipo de avaliação e da idade de quem será avaliado. Chame no WhatsApp e receba o orçamento.",
  },
  {
    question: "Vocês aceitam convênio ou reembolso?",
    answer:
      "Emitimos o laudo e a documentação técnica completa para você pedir reembolso ao seu plano de saúde. Temos também parcerias com sindicatos e instituições, como o SINPROAC. Pergunte no WhatsApp sobre a sua cobertura.",
  },
  {
    question: "Posso entregar o laudo na escola?",
    answer:
      "Sim. O laudo é seu e você decide com quem compartilhar. Ele tem QR Code para conferir se o documento é verdadeiro. A aceitação final depende de cada instituição.",
  },
  {
    question: "O que acontece depois do laudo?",
    answer:
      "Na devolutiva, explicamos os resultados em linguagem simples. Se precisar de acompanhamento, o Instituto tem psicoterapia e psicopedagogia, e encaminhamos para psiquiatria parceira quando o caso pede.",
  },
];

/* =====================================================================
   AUXILIARES
   ===================================================================== */

function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function usePageSeo() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    let metaDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    const createdMeta = !metaDescription;
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    const previousDescription = metaDescription.content;
    metaDescription.content = PAGE_DESCRIPTION;

    const jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "MedicalBusiness",
          name: "Instituto SerClin",
          url: window.location.origin,
          telephone: "+5568992161717",
          hasMap: MAPS_URL,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Rua Sorocaba, 140",
            addressLocality: "Rio Branco",
            addressRegion: "AC",
            addressCountry: "BR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -9.9682963,
            longitude: -67.8347864,
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        },
      ],
    });
    document.head.appendChild(jsonLd);

    window.scrollTo({ top: 0 });

    return () => {
      document.title = previousTitle;
      if (createdMeta) metaDescription.remove();
      else metaDescription.content = previousDescription;
      jsonLd.remove();
    };
  }, []);
}

function WhatsAppButton({
  label,
  message,
  tone = "gold",
}: {
  label: string;
  message: string;
  tone?: "gold" | "teal";
}) {
  const toneClasses =
    tone === "gold"
      ? "bg-[#D4A017] text-[#0A2329] hover:bg-[#c29213] hover:shadow-[#D4A017]/30"
      : "bg-[#0D4F5C] text-white hover:bg-[#093D47]";

  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`neuro-cta-button inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl px-8 py-4 text-base font-bold shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 sm:w-auto md:text-lg ${toneClasses}`}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}

function AuthorityLine({ className = "" }: { className?: string }) {
  return (
    <p
      className={`neuro-authority-line text-sm font-medium tracking-wide ${className}`}
    >
      Helenara Chaves • USP-SP • +10 anos • Equipe multiprofissional
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl space-y-3 text-center md:mb-14">
      <p
        className={`text-xs font-bold uppercase tracking-widest md:text-sm ${
          tone === "dark" ? "text-[#D4A017]" : "text-[#0D4F5C]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-serif text-2xl font-bold leading-tight md:text-4xl ${
          tone === "dark" ? "text-white" : "text-[#0D4F5C]"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

/* =====================================================================
   PÁGINA
   ===================================================================== */

export default function AvaliacaoNeuropsicologica() {
  usePageSeo();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#0D4F5C] selection:text-white">
      <PublicHeader />

      <main>
        {/* 1. HERO — promessa, prazo, CTA e autoridade */}
        <section
          id="inicio"
          className="neuro-hero bg-gradient-to-br from-[#0D4F5C] via-[#093D47] to-[#052A32] px-4 pb-14 pt-14 text-white md:pb-20 md:pt-20"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#D4A017] md:text-sm">
              Avaliação Neuropsicológica • Rio Branco, AC
            </p>
            <h1 className="mb-6 font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
              Avaliação neuropsicológica completa em Rio Branco, com laudo em até 30 dias.
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg font-light text-slate-200 md:text-xl">
              Descubra como você ou seu filho pensa, aprende e se comporta.{" "}
              <strong className="font-bold text-white">Laudo em até 30 dias</strong>{" "}
              depois das sessões de testes.
            </p>

            <WhatsAppButton
              label="Agendar minha avaliação no WhatsApp"
              message="Olá! Quero agendar uma avaliação neuropsicológica no Instituto SerClin."
            />
            <p className="mt-4 text-sm text-slate-300">
              Acolhimento imediato. Primeira consulta em até 48h.
            </p>

            <AuthorityLine className="mt-8 text-slate-300" />

            <dl className="neuro-stats mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {AUTHORITY_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4 backdrop-blur-sm"
                >
                  <dt className="font-serif text-2xl font-bold text-[#D4A017] md:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs text-slate-200 md:text-sm">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 2. DOR (PAS) — problema, consequência, solução */}
        <section id="problema" className="neuro-problem bg-white px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center font-serif text-2xl font-bold leading-tight text-[#0D4F5C] md:text-4xl">
              Quando algo não encaixa, a dúvida pesa na casa inteira.
            </h2>

            <ul className="mb-8 space-y-3">
              {PAIN_POINTS.map((pain) => (
                <li
                  key={pain}
                  className="rounded-xl border-l-4 border-[#D4A017] bg-slate-50 p-4 text-base font-medium text-slate-800 md:text-lg"
                >
                  {pain}
                </li>
              ))}
            </ul>

            <p className="mb-4 text-base leading-relaxed text-slate-600 md:text-lg">
              Sem uma resposta clara, cada um chuta uma explicação. A criança
              ouve que é preguiçosa. O adulto acha que falta força de vontade.
              E o tempo passa.
            </p>
            <p className="mb-8 text-base leading-relaxed text-slate-800 md:text-lg">
              <strong>A avaliação neuropsicológica troca palpite por dados.</strong>{" "}
              Com testes e entrevistas, medimos atenção, memória, linguagem e
              raciocínio. No fim, você recebe um laudo claro e um caminho a seguir.
            </p>

            <div className="text-center">
              <WhatsAppButton
                label="Quero entender meu caso"
                message="Olá! Quero entender se uma avaliação neuropsicológica faz sentido no meu caso."
                tone="teal"
              />
            </div>
          </div>
        </section>

        {/* 3. PARA QUE SERVE */}
        <section id="para-que-serve" className="neuro-use-cases bg-slate-100 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Para que serve"
              title="Uma avaliação, cinco tipos de dúvida respondidos."
            />

            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {USE_CASES.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D4F5C]/10 text-[#0D4F5C] transition-colors group-hover:bg-[#0D4F5C] group-hover:text-white">
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-bold text-[#0D4F5C]">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-slate-600">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-500">
              Não prometemos um diagnóstico específico. Entregamos uma resposta
              honesta, baseada em testes.
            </p>
          </div>
        </section>

        {/* 4. COMO FUNCIONA — 4 etapas com prazos */}
        <section id="como-funciona" className="neuro-steps bg-[#0A2329] px-4 py-16 text-white md:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Como funciona"
              title="Quatro passos, sem surpresa e com prazo."
              tone="dark"
            />

            <ol className="mx-auto max-w-3xl space-y-4">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4A017] font-bold text-[#0A2329]"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="mb-1 font-serif text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed text-slate-300">
                      {step.text}
                    </p>
                    {step.deadline && (
                      <p className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#D4A017]">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        {step.deadline}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 text-center">
              <WhatsAppButton
                label="Começar pelo passo 1"
                message="Olá! Quero começar o processo de avaliação neuropsicológica."
              />
            </div>
          </div>
        </section>

        {/* 5. POR QUE O SERCLIN — diferenciais reais */}
        <section id="por-que-serclin" className="neuro-differentials bg-white px-4 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Por que o SerClin"
              title="Avaliação feita por quem faz isso todo mês, há mais de 10 anos."
            />

            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
              {DIFFERENTIALS.map((item) => (
                <article
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0D4F5C] text-[#D4A017]">
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-serif text-lg font-bold text-[#0D4F5C]">
                      {item.title}
                    </h3>
                    <p className="text-base leading-relaxed text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <AuthorityLine className="mt-10 text-center text-[#0D4F5C]/70" />
          </div>
        </section>

        {/* 6. PROVA SOCIAL — só a nota do Google, sem falas, nomes ou contagem */}
        {GOOGLE_RATING && (
          <section id="avaliacao-google" className="neuro-reviews bg-slate-100 px-4 py-12 md:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <div
                className="mb-3 flex items-center justify-center gap-1 text-[#D4A017]"
                aria-label={`Nota ${GOOGLE_RATING} no Google`}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-6 w-6 fill-current" aria-hidden="true" />
                ))}
              </div>
              <p className="font-serif text-2xl font-bold text-[#0D4F5C] md:text-3xl">
                Nota {GOOGLE_RATING} no Google
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Avaliação pública dos pacientes do Instituto SerClin, em Rio Branco.
              </p>

              {GOOGLE_REVIEWS_URL && (
                <p className="mt-6">
                  <a
                    href={GOOGLE_REVIEWS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#0D4F5C] underline underline-offset-4 hover:text-[#093D47]"
                  >
                    Ver as avaliações no Google
                  </a>
                </p>
              )}
            </div>
          </section>
        )}

        {/* 7. PRÓXIMO PASSO APÓS O LAUDO — só aparece quando POST_EVALUATION_PLAN for preenchido */}
        {POST_EVALUATION_PLAN && (
          <section id="depois-do-laudo" className="neuro-next-step bg-[#D4A017]/15 px-4 py-14 md:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-3 font-serif text-2xl font-bold text-[#0D4F5C] md:text-3xl">
                {POST_EVALUATION_PLAN.title}
              </h2>
              <p className="mb-6 text-base leading-relaxed text-slate-800 md:text-lg">
                {POST_EVALUATION_PLAN.text}
              </p>
              <WhatsAppButton
                label={POST_EVALUATION_PLAN.cta}
                message={POST_EVALUATION_PLAN.whatsappMessage}
                tone="teal"
              />
            </div>
          </section>
        )}

        {/* 8. FAQ — objeções, sem preço */}
        <section id="duvidas" className="neuro-faq bg-white px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Dúvidas frequentes"
              title="O que as famílias perguntam antes de começar."
            />

            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger className="font-serif text-base font-semibold text-[#0D4F5C] md:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-slate-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 9. CTA FINAL */}
        <section
          id="agendar"
          className="neuro-final-cta bg-gradient-to-br from-[#0D4F5C] via-[#093D47] to-[#052A32] px-4 py-16 text-center text-white md:py-24"
        >
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 font-serif text-2xl font-bold leading-tight text-white md:text-4xl">
              Dê o primeiro passo hoje.
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg font-light text-slate-200">
              Chame no WhatsApp e seja acolhido de imediato. Primeira consulta
              em até 48h, laudo em até 30 dias depois dos testes.
            </p>
            <WhatsAppButton
              label="Agendar minha avaliação no WhatsApp"
              message="Olá! Quero agendar uma avaliação neuropsicológica no Instituto SerClin."
            />
            <p className="mt-6 text-sm text-slate-300">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-[#D4A017] underline underline-offset-4"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Como chegar: Rua Sorocaba, 140 — Doca Furtado
              </a>
            </p>
            <AuthorityLine className="mt-8 text-slate-300" />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
