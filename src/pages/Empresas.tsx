import { useEffect } from "react";
import {
  BarChart3,
  Building2,
  Check,
  ClipboardCheck,
  Clock,
  HeartHandshake,
  Mic,
  Search,
  ShieldCheck,
  Star,
  Users,
  MessageCircle,
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
const MAPS_URL = "https://maps.app.goo.gl/EBw3iRXYR7DGFqYNA";

const PAGE_TITLE = "Saúde mental para empresas em Rio Branco (AC) | Instituto SerClin";
const PAGE_DESCRIPTION =
  "Programas mensais de saúde mental, palestras e diagnóstico organizacional para empresas de Rio Branco. Equipe liderada por neuropsicóloga formada na USP-SP. Peça sua proposta.";

/* PREÇOS — valores do plano de negócio B2B.
   CONFIRMAR antes de publicar: o plano não marca quais preços são públicos.
   Para esconder todos os valores e mostrar "sob proposta", troque por false. */
const SHOW_PRICES = true;

/* =====================================================================
   COPY
   ===================================================================== */

const TRUST_STATS = [
  { value: "+10 anos", label: "de experiência clínica" },
  { value: "USP-SP", label: "formação da neuropsicóloga" },
  { value: "5,0", label: "nota no Google" },
  { value: "Presencial", label: "atendimento humano" },
];

const PAIN_POINTS = [
  "Atestados e afastamentos que se repetem na mesma equipe.",
  "Bons profissionais indo embora e vaga aberta por meses.",
  "Time cansado, com mais erros e menos entrega.",
  "Dúvida se a empresa está em dia com a gestão de riscos psicossociais da NR-1.",
];

const PROTOCOL_STEPS = [
  {
    icon: Search,
    title: "Escutar",
    text: "Mapeamos clima, carga de trabalho e sinais de risco psicossocial, junto com o RH.",
  },
  {
    icon: ClipboardCheck,
    title: "Priorizar",
    text: "Transformamos o que achamos em um plano curto: poucas prioridades, com responsável e prazo.",
  },
  {
    icon: HeartHandshake,
    title: "Cuidar",
    text: "Triagem, atendimentos, palestras e workshops com roteiro padronizado, todo mês.",
  },
  {
    icon: BarChart3,
    title: "Medir",
    text: "Relatório com dados do grupo e reunião trimestral com o RH para ajustar o rumo.",
  },
];

const PROGRAM_INCLUDES = [
  "Triagem de saúde mental dos colaboradores",
  "Atendimentos em grupo e individuais, conforme o plano",
  "Relatório do grupo para o RH, sem expor casos individuais",
  "Reunião trimestral de resultados",
];

const PROGRAMS = [
  {
    name: "Essencial",
    size: "Até 20 colaboradores",
    price: "R$ 990",
  },
  {
    name: "Avançado",
    size: "De 21 a 100 colaboradores",
    price: "R$ 2.400",
  },
  {
    name: "Premium",
    size: "Acima de 100 colaboradores",
    price: "R$ 4.900",
  },
];

const ONE_OFFS = [
  {
    name: "Palestra presencial",
    detail: "2 horas",
    price: "R$ 2.000",
  },
  {
    name: "Palestra online",
    detail: "Para equipes à distância",
    price: "R$ 1.200",
  },
  {
    name: "Workshop",
    detail: "4 horas, até 20 pessoas",
    price: "R$ 3.500",
  },
];

const TALK_THEMES = ["Oficina das Emoções", "Prevenção de Burnout", "Gestão de Pessoas"];

const HIRING_STEPS = [
  {
    title: "Converse no WhatsApp",
    text: "Conte o tamanho da equipe e o que preocupa você. Dá para começar por uma palestra ou pelo diagnóstico.",
  },
  {
    title: "Receba a proposta em até 5 dias",
    text: "Um documento claro, com escopo e valor, ajustado para a sua empresa.",
  },
  {
    title: "Comece o programa",
    text: "Combinamos a agenda e damos o primeiro passo com o seu RH.",
  },
];

const FAQ_ITEMS = [
  {
    question: "O RH vê quem usou o atendimento?",
    answer:
      "Não. O RH recebe dados do grupo, sem expor casos individuais. O sigilo profissional vale para todo atendimento.",
  },
  {
    question: "Quanto custa?",
    answer: SHOW_PRICES
      ? "Os programas mensais custam R$ 990 (até 20 colaboradores), R$ 2.400 (21 a 100) e R$ 4.900 (acima de 100). Palestras e workshops têm valor fechado, e o diagnóstico começa em R$ 4.200. Peça a proposta e receba em até 5 dias."
      : "O valor depende do tamanho da equipe e do serviço. Peça a proposta e receba em até 5 dias.",
  },
  {
    question: "O programa deixa minha empresa em dia com a NR-1?",
    answer:
      "Ele apoia a gestão dos riscos psicossociais que a NR-1 passou a exigir, com diagnóstico e relatórios. A responsabilidade legal e o gerenciamento de riscos continuam com a empresa e com o responsável por segurança e saúde do trabalho. Não emitimos certificado de conformidade.",
  },
  {
    question: "Como funciona o diagnóstico organizacional?",
    answer:
      "É um projeto de 1 mês para entender clima, carga de trabalho e riscos psicossociais da equipe. No fim, você recebe um plano com prioridades. Ele é a melhor porta de entrada para quem não sabe por onde começar.",
  },
  {
    question: "Quais temas de palestra vocês oferecem?",
    answer:
      "Oficina das Emoções, Prevenção de Burnout e Gestão de Pessoas. Também adaptamos o tema à necessidade da sua equipe.",
  },
  {
    question: "Vocês atendem empresas pequenas?",
    answer:
      "Sim. O programa Essencial é para equipes de até 20 colaboradores. Os planos Avançado e Premium atendem equipes maiores.",
  },
  {
    question: "Vocês fazem avaliação psicológica para contratar?",
    answer:
      "Fazemos seleção psicológica e avaliação neuropsicológica corporativa, conforme a agenda. Toda avaliação exige o consentimento de quem é avaliado e segue as regras de sigilo e a LGPD. Peça um orçamento.",
  },
  {
    question: "Por que a agenda é limitada?",
    answer:
      "Atendemos poucas empresas por vez para manter a qualidade e o cuidado de cada equipe. Se a agenda estiver cheia, você entra na fila de espera.",
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
      className={`empresas-cta-button inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl px-8 py-4 text-base font-bold shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 sm:w-auto md:text-lg ${toneClasses}`}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}

function AuthorityLine({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm font-medium tracking-wide ${className}`}>
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

function PriceTag({ price, suffix }: { price: string; suffix?: string }) {
  if (!SHOW_PRICES) {
    return <p className="text-sm font-bold text-[#0D4F5C]">Sob proposta</p>;
  }
  return (
    <p className="font-serif text-3xl font-bold text-[#0D4F5C]">
      {price}
      {suffix && (
        <span className="ml-1 font-sans text-sm font-medium text-slate-500">{suffix}</span>
      )}
    </p>
  );
}

/* =====================================================================
   PÁGINA
   ===================================================================== */

export default function Empresas() {
  usePageSeo();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#0D4F5C] selection:text-white">
      <PublicHeader />

      <main>
        {/* 1. HERO — promessa, CTA e autoridade */}
        <section
          id="inicio"
          className="empresas-hero bg-gradient-to-br from-[#0D4F5C] via-[#093D47] to-[#052A32] px-4 pb-14 pt-14 text-white md:pb-20 md:pt-20"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#D4A017] md:text-sm">
              SerClin Empresas • Rio Branco, AC
            </p>
            <h1 className="mb-6 font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
              Saúde mental que gera resultado para a sua empresa.
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg font-light text-slate-200 md:text-xl">
              Programas mensais, palestras e diagnóstico organizacional para
              empresas de Rio Branco.{" "}
              <strong className="font-bold text-white">
                Proposta em até 5 dias.
              </strong>
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <WhatsAppButton
                label="Receber proposta no WhatsApp"
                message="Olá! Quero receber uma proposta do SerClin Empresas para a minha equipe."
              />
              <a
                href="#programas"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl border border-white/30 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                Ver programas
              </a>
            </div>

            <AuthorityLine className="mt-8 text-slate-300" />

            <dl className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {TRUST_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4 backdrop-blur-sm"
                >
                  <dt className="font-serif text-2xl font-bold text-[#D4A017] md:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs text-slate-200 md:text-sm">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 2. DOR (PAS) */}
        <section id="problema" className="bg-white px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center font-serif text-2xl font-bold leading-tight text-[#0D4F5C] md:text-4xl">
              Quando a equipe adoece, quem paga é a empresa.
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
              Esperar o problema virar afastamento sai caro: em custo, em
              clima e em tempo do gestor. E a NR-1 agora pede que a empresa
              olhe para os riscos psicossociais.
            </p>
            <p className="mb-8 text-base leading-relaxed text-slate-800 md:text-lg">
              <strong>A saída é cuidar antes, com método.</strong> O Instituto
              SerClin traz psicologia organizacional e o rigor clínico de quem
              avalia pessoas há mais de 10 anos.
            </p>

            <div className="text-center">
              <WhatsAppButton
                tone="teal"
                label="Quero entender como funciona"
                message="Olá! Quero entender como o SerClin Empresas pode ajudar a minha equipe."
              />
            </div>
          </div>
        </section>

        {/* 3. PROTOCOLO SERCLIN EMPRESAS */}
        <section
          id="protocolo"
          className="bg-gradient-to-br from-[#0D4F5C] via-[#093D47] to-[#052A32] px-4 py-16 text-white md:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              tone="dark"
              eyebrow="Protocolo SerClin Empresas"
              title="Quatro passos, do diagnóstico ao relatório."
            />

            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROTOCOL_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4A017] font-bold text-[#0A2329]"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <step.icon className="h-6 w-6 text-[#D4A017]" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-slate-200">{step.text}</p>
                </li>
              ))}
            </ol>

            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-300">
              Método baseado no ciclo da psicologia organizacional: diagnosticar,
              intervir e avaliar. Não prometemos resultado clínico garantido.
            </p>
          </div>
        </section>

        {/* 4. PROGRAMAS MENSAIS */}
        <section id="programas" className="bg-white px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Programas mensais"
              title="Um preço fixo por mês, conforme o tamanho da equipe."
            />

            <div className="grid gap-4 md:grid-cols-3">
              {PROGRAMS.map((program) => (
                <article
                  key={program.name}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0D4F5C] text-[#D4A017]">
                      <Building2 className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#0D4F5C]">
                        {program.name}
                      </h3>
                      <p className="text-sm text-slate-600">{program.size}</p>
                    </div>
                  </div>

                  <PriceTag price={program.price} suffix="/mês" />

                  <ul className="mb-6 mt-5 flex-1 space-y-2">
                    {PROGRAM_INCLUDES.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-slate-700">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#0D4F5C]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <WhatsAppButton
                    tone="teal"
                    label={`Quero o ${program.name}`}
                    message={`Olá! Tenho interesse no programa ${program.name} do SerClin Empresas para a minha equipe.`}
                  />
                </article>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-600">
              O número de atendimentos individuais e em grupo fica definido na
              proposta, conforme o plano.
            </p>
          </div>
        </section>

        {/* 5. COMECE PEQUENO — palestras, workshop e diagnóstico */}
        <section id="comece-pequeno" className="bg-slate-100 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Comece pelo menor passo"
              title="Palestra, workshop ou diagnóstico: entre sem contrato mensal."
            />

            <div className="grid gap-4 md:grid-cols-3">
              {ONE_OFFS.map((item) => (
                <article
                  key={item.name}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0D4F5C]/10">
                    <Mic className="h-6 w-6 text-[#0D4F5C]" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0D4F5C]">
                    {item.name}
                  </h3>
                  <p className="mb-3 text-sm text-slate-600">{item.detail}</p>
                  <PriceTag price={item.price} />
                  <div className="mt-5">
                    <WhatsAppButton
                      tone="teal"
                      label="Pedir esta ação"
                      message={`Olá! Quero contratar: ${item.name} (${item.detail}) do SerClin Empresas.`}
                    />
                  </div>
                </article>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-slate-600">
              Temas: {TALK_THEMES.join(" • ")}.
            </p>

            <article className="mx-auto mt-10 max-w-3xl rounded-2xl border-2 border-[#D4A017] bg-white p-6 shadow-md md:p-8">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0D4F5C] text-[#D4A017]">
                  <Users className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0D4F5C] md:text-2xl">
                  Diagnóstico organizacional e de clima
                </h3>
              </div>
              <p className="mb-4 text-base leading-relaxed text-slate-700">
                Projeto de 1 mês para entender clima, carga de trabalho e riscos
                psicossociais. Você sai com um plano de prioridades e sabe qual
                programa faz sentido para a sua equipe.
              </p>
              {SHOW_PRICES ? (
                <p className="mb-5 font-serif text-2xl font-bold text-[#0D4F5C]">
                  <span className="mr-1 font-sans text-sm font-medium text-slate-500">
                    a partir de
                  </span>
                  R$ 4.200
                </p>
              ) : (
                <p className="mb-5 text-sm font-bold text-[#0D4F5C]">Sob proposta</p>
              )}
              <WhatsAppButton
                label="Quero o diagnóstico"
                message="Olá! Quero saber mais sobre o diagnóstico organizacional e de clima do SerClin Empresas."
              />
            </article>
          </div>
        </section>

        {/* 6. COMO CONTRATAR */}
        <section id="como-contratar" className="bg-white px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <SectionHeading eyebrow="Como contratar" title="Três passos, sem burocracia." />

            <ol className="space-y-4">
              {HIRING_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D4F5C] font-bold text-white"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="mb-1 font-serif text-xl font-bold text-[#0D4F5C]">
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed text-slate-600">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 7. POR QUE O SERCLIN + AGENDA LIMITADA */}
        <section id="por-que-serclin" className="bg-[#0D4F5C]/5 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="Por que o SerClin"
              title="Atendimento humano, com o rigor de quem avalia pessoas todo mês."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <ShieldCheck className="mb-3 h-7 w-7 text-[#0D4F5C]" aria-hidden="true" />
                <h3 className="mb-1 font-serif text-lg font-bold text-[#0D4F5C]">
                  Quem lidera tem formação e rotina
                </h3>
                <p className="text-base leading-relaxed text-slate-600">
                  Helenara Chaves, formada na USP-SP, com mais de 10 anos em
                  avaliação neuropsicológica, e equipe multiprofissional.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6">
                <Users className="mb-3 h-7 w-7 text-[#0D4F5C]" aria-hidden="true" />
                <h3 className="mb-1 font-serif text-lg font-bold text-[#0D4F5C]">
                  Presencial, com gente de verdade
                </h3>
                <p className="text-base leading-relaxed text-slate-600">
                  Atendimento humano e avaliação clínica real, o que aplicativos
                  de bem-estar não entregam.
                </p>
              </article>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-[#D4A017] bg-white p-6">
              <Clock className="mt-1 h-6 w-6 shrink-0 text-[#D4A017]" aria-hidden="true" />
              <p className="text-base leading-relaxed text-slate-800">
                <strong>Agenda limitada.</strong> Atendemos poucas empresas por
                vez para manter a qualidade. Se a agenda estiver cheia, você
                entra na fila de espera.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-[#0D4F5C]">
              <div className="flex gap-1 text-[#D4A017]" aria-label="Nota 5,0 no Google">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-current" aria-hidden="true" />
                ))}
              </div>
              <span className="text-sm font-bold">Nota 5,0 no Google</span>
            </div>

            <AuthorityLine className="mt-6 text-center text-[#0D4F5C]/70" />
          </div>
        </section>

        {/* 8. FAQ */}
        <section id="duvidas" className="bg-white px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Dúvidas frequentes"
              title="O que o RH e a diretoria perguntam antes de contratar."
            />

            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-base font-semibold text-[#0D4F5C]">
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
          id="proposta"
          className="bg-gradient-to-br from-[#0D4F5C] via-[#093D47] to-[#052A32] px-4 py-16 text-center text-white md:py-24"
        >
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 font-serif text-2xl font-bold leading-tight text-white md:text-4xl">
              Peça a proposta da sua empresa.
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg font-light text-slate-200">
              Chame no WhatsApp, conte o tamanho da equipe e receba a proposta
              em até 5 dias.
            </p>
            <WhatsAppButton
              label="Receber proposta no WhatsApp"
              message="Olá! Quero receber uma proposta do SerClin Empresas para a minha equipe."
            />
            <p className="mt-6 text-sm text-slate-300">
              Prefere o formulário?{" "}
              <a
                href="/#contato"
                className="font-bold text-[#D4A017] underline underline-offset-4"
              >
                Deixe seus dados aqui
              </a>
              .
            </p>
            <AuthorityLine className="mt-8 text-slate-300" />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
