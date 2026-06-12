export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  specialtyName: string;
  crm: string;
  role: string;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  availability: string[]; // Weekdays available, e.g., ["Segunda-feira", "Quarta-feira", "Sexta-feira"]
  hours: string[]; // e.g. ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
}

export interface Specialty {
  id: string;
  name: string;
  iconName: string; // Dynamic icon rendering based on key
  shortDesc: string;
  longDesc: string;
  benefits: string[];
}

export const SPECIALTIES: Specialty[] = [
  {
    id: "psicologia",
    name: "Psicologia",
    iconName: "Brain",
    shortDesc: "Psicoterapia individual, infantil e familiar para o equilíbrio mental e emocional.",
    longDesc: "Nosso setor de psicologia oferece acompanhamento psicoterapêutico especializado para todas as fases da vida. Trabalhamos com abordagens baseadas em evidências, como a Terapia Cognitivo-Comportamental (TCC), focando no manejo de estresse, autoconhecimento, conflitos familiares e promoção de saúde mental continuada.",
    benefits: [
      "Ambiente seguro e totalmente sigiloso",
      "Abordagens personalizadas para cada perfil",
      "Suporte no manejo de ansiedade, fobias e burnout",
      "Terapia focada na evolução e autonomia do paciente"
    ]
  },
  {
    id: "psiquiatria",
    name: "Psiquiatria",
    iconName: "ShieldAlert",
    shortDesc: "Diagnóstico e tratamento farmacológico de transtornos de humor e comportamento.",
    longDesc: "A psiquiatria no Instituto SerClin concilia o atendimento humanizado com o rigor científico. Nossos especialistas avaliam fatores biológicos, sociais e psicológicos para traçar planos terapêuticos eficazes para transtornos como depressão, ansiedade generalizada, TDAH, insônia e TOC.",
    benefits: [
      "Avaliação completa de histórico clínico e estilo de vida",
      "Abordagem integrada com a equipe de psicologia",
      "Acompanhamento cuidadoso de dosagens e efeitos",
      "Emissão de receitas digitais e relatórios periciais"
    ]
  },
  {
    id: "nutricao",
    name: "Nutrição",
    iconName: "Apple",
    shortDesc: "Reeducação alimentar, emagrecimento, nutrição esportiva e longevidade saudável.",
    longDesc: "Acreditamos que a alimentação é o pilar da vitalidade. Nosso serviço de nutrição funcional e esportiva desenvolve planos alimentares realistas, sem radicalismos, adaptados à sua rotina para que você atinja seus objetivos de saúde, performance física ou reeducação nutricional duradoura.",
    benefits: [
      "Avaliação de bioimpedância e medidas corporais",
      "Planos alimentares 100% personalizados",
      "Adaptação para restrições alimentares ou patologias",
      "Foco na mudança duradoura de hábitos"
    ]
  },
  {
    id: "fonoaudiologia",
    name: "Fonoaudiologia",
    iconName: "Volume2",
    shortDesc: "Diagnóstico e terapia de alterações de fala, voz, linguagem e deglutição.",
    longDesc: "Tratamento especializado para distúrbios da comunicação oral e escrita em crianças, adultos e idosos. Auxiliamos na correção de dicção, reabilitação física de voz para profissionais que a utilizam no trabalho e no tratamento de disfonia e problemas de mastigação/deglutição.",
    benefits: [
      "Triagem de processamento auditivo central",
      "Apoio ao desenvolvimento da fala infantil",
      "Técnicas modernas de exercícios para controle vocal",
      "Apoio a fonoaudiologia estética e respiratória"
    ]
  },
  {
    id: "fisioterapia",
    name: "Fisioterapia",
    iconName: "Activity",
    shortDesc: "Reabilitação mecânica, pilates clínico, alívio de dor e prevenção de lesões esportivas.",
    longDesc: "Nosso time de fisioterapia utiliza técnicas de ponta para reabilitar movimentos corporais, reduzir dores persistentes e promover a ergonomia funcional. Atuamos com traumato-ortopedia, fisioterapia esportiva e pilates clínico com acompanhamento rigoroso e individualizado.",
    benefits: [
      "Sessões individuais focadas na raiz do problema",
      "Uso de técnicas de terapia manual e eletroterapia",
      "Integração com pilates clínico personalizado",
      "Prevenção ativa de lesões e melhoria postural"
    ]
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: "dr-mateus-silva",
    name: "Dr. Mateus Silva",
    specialtyId: "psiquiatria",
    specialtyName: "Psiquiatria",
    crm: "CRM-SP 142.509",
    role: "Médico Psiquiatra de Adultos",
    description: "Especialista em psiquiatria clínica pela FMUSP, possui longa trajetória no tratamento de distúrbios de humor, depressão resistente, ansiedade de alta intensidade e TDAH. Oferece cuidado humanizado que valoriza a escuta ativa.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 142,
    availability: ["Segunda-feira", "Quarta-feira", "Quinta-feira"],
    hours: ["08:30", "09:30", "10:30", "14:00", "15:00", "16:30", "17:30"]
  },
  {
    id: "dra-laura-mendes",
    name: "Dra. Laura Mendes",
    specialtyId: "psicologia",
    specialtyName: "Psicologia",
    crm: "CRP-SP 06/118.420",
    role: "Psicóloga de Jovens e Adultos",
    description: "Focada em Terapia Cognitivo-Comportamental (TCC) e Terapia de Aceitação e Compromisso. Especialista em traumas, fobias urbanas, estresse pós-pandemia e autodescoberta. Autora de diversos artigos de psicologia clínica.",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600",
    rating: 5.0,
    reviewsCount: 218,
    availability: ["Terça-feira", "Quarta-feira", "Sexta-feira"],
    hours: ["09:00", "10:00", "11:00", "13:30", "14:30", "15:30", "16:30"]
  },
  {
    id: "dra-renata-borges",
    name: "Dra. Renata Borges",
    specialtyId: "psicologia",
    specialtyName: "Psicologia",
    crm: "CRP-SP 06/98.711",
    role: "Psicóloga Infantil e Hebiatria",
    description: "Especialista em neuropsicologia do desenvolvimento com mais de 10 anos de experiência clínica. Utiliza a ludoescuta e intervenções contextualizadas para ajudar crianças com hiperatividade, dificuldades escolares e regulação emocional.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    reviewsCount: 94,
    availability: ["Segunda-feira", "Terça-feira", "Quinta-feira"],
    hours: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  },
  {
    id: "dra-carolina-castro",
    name: "Dra. Carolina Castro",
    specialtyId: "nutricao",
    specialtyName: "Nutrição",
    crm: "CRN-SP 28.514",
    role: "Nutricionista Funcional e Esportiva",
    description: "Apaixonada por promover saúde através da comida inteligente. Ajuda atletas a aumentarem performance e pessoas comuns a recuperarem o equilíbrio metabólico e alcançarem o emagrecimento sustentável sem extremismos alimentares.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 165,
    availability: ["Quarta-feira", "Quinta-feira", "Sexta-feira"],
    hours: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]
  },
  {
    id: "dra-julia-santos",
    name: "Dra. Julia Santos",
    specialtyId: "fonoaudiologia",
    specialtyName: "Fonoaudiologia",
    crm: "CRFa-SP 4690",
    role: "Fonoaudióloga e Especialista em Voz",
    description: "Trabalha com reabilitação fonoaudiológica, processamento auditivo central e transição vocal. É mentora de profissionais de comunicação pública (palestrantes, professores) para otimização e saúde e estética vocal.",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    reviewsCount: 88,
    availability: ["Segunda-feira", "Terça-feira", "Quarta-feira"],
    hours: ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"]
  },
  {
    id: "dr-henrique-souza",
    name: "Dr. Henrique Souza",
    specialtyId: "fisioterapia",
    specialtyName: "Fisioterapia",
    crm: "CREFITO-SP 89.215",
    role: "Fisioterapeuta Postural e Osteopata",
    description: "Especialista em dor lombar crônica, reeducação postural global (RPG) e reabilitação esportiva. Integrou equipes de apoio em maratonas e hoje coordena a área de pilates clínico e osteopatia no Instituto SerClin.",
    image: "https://images.unsplash.com/photo-1622902047475-9612318a9463?auto=format&fit=crop&q=80&w=600",
    rating: 5.0,
    reviewsCount: 179,
    availability: ["Terça-feira", "Quinta-feira", "Sexta-feira"],
    hours: ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30", "18:00"]
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Carlos Eduardo Costa",
    role: "Paciente de Psiquiatria",
    text: "O Dr. Mateus mudou totalmente minha visão sobre saúde mental. A empatia dele no atendimento e o cuidado em me ouvir fizeram toda a diferença na minha recuperação.",
    rating: 5
  },
  {
    id: 2,
    name: "Mariana Alencar",
    role: "Paciente de Fisioterapia & Nutrição",
    text: "O atendimento conjunto da Nutricionista Carolina e do Fisioterapeuta Henrique resolveu as minhas dores e me trouxe mais energia para os treinos. Nota mil!",
    rating: 5
  },
  {
    id: 3,
    name: "Patrícia Silveira",
    role: "Mãe do paciente Leo (6 anos)",
    text: "Estávamos muito preocupados com o atraso de fala do meu filho. O atendimento lúdico da Dra. Renata e da Dra. Julia fez o Leo progredir em pouquíssimas semanas com muito amor.",
    rating: 5
  }
];
