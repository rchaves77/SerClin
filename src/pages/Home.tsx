import { useState } from "react";
import { 
  ShieldCheck, 
  Brain, 
  HeartHandshake, 
  Sparkles, 
  CalendarCheck, 
  ClipboardCheck, 
  UserCheck, 
  Star, 
  ChevronDown, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Menu, 
  X, 
  Check,
  Shield,
  User,
  Lock,
  Building2,
  GraduationCap,
  ExternalLink
} from "lucide-react";
import logoSerClin from "@/assets/logo-serclin.png";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // WhatsApp base link
  const whatsappUrl = "https://wa.me/5568992161717?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20no%20Instituto%20SerClin.";

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-[#0D4F5C] selection:text-white">
      <ScrollToTop />

      {/* TOP UTILITY BAR (Elegante e discreta) */}
      <div className="hidden lg:block bg-[#052A32] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 font-light">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Instituto SerClin — Hub de Engenharia Neuroeducacional</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Rio Branco - AC</span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="/checkin" 
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5 font-medium text-amber-200"
            >
              <User className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Portal do Paciente</span>
            </a>
            <span className="text-slate-600">•</span>
            <a 
              href="/login" 
              className="hover:text-white transition-colors flex items-center gap-1.5 font-medium text-slate-200"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Acesso Restrito (Sistema Clínico)</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <img 
              src={logoSerClin} 
              alt="Instituto SerClin" 
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <button onClick={() => scrollToSection("inicio")} className="hover:text-[#0D4F5C] transition-colors cursor-pointer py-1">
              Início
            </button>
            <button onClick={() => scrollToSection("especialidades")} className="hover:text-[#0D4F5C] transition-colors cursor-pointer py-1">
              Especialidades
            </button>
            <button onClick={() => scrollToSection("portais")} className="hover:text-[#0D4F5C] transition-colors cursor-pointer py-1">
              Portais
            </button>
            <button onClick={() => scrollToSection("investimento")} className="hover:text-[#0D4F5C] transition-colors cursor-pointer py-1">
              Planos
            </button>
            <button onClick={() => scrollToSection("contato")} className="hover:text-[#0D4F5C] transition-colors cursor-pointer py-1">
              Contato
            </button>
          </nav>

          {/* Desktop CTA Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Portal do Paciente */}
            <a
              href="/checkin"
              className="bg-[#D4A017] hover:bg-[#c29213] text-[#0A2329] px-3.5 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow transition-all flex items-center gap-1.5"
              title="Acesso exclusivo ao Portal do Paciente"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Portal do Paciente</span>
            </a>

            {/* Acesso Restrito (Sistema Clínico) */}
            <a
              href="/login"
              className="border border-[#0D4F5C] text-[#0D4F5C] hover:bg-[#0D4F5C] hover:text-white px-3.5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
              title="Acesso restrito ao Sistema da Clínica para profissionais"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acesso Restrito</span>
            </a>

            {/* Agendar no WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D4F5C] hover:bg-[#093D47] text-white px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow transition-all flex items-center gap-1.5 ml-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Agendar</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-2 font-medium text-slate-700 text-sm">
              <button 
                onClick={() => scrollToSection("inicio")} 
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-[#0D4F5C]"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection("especialidades")} 
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-[#0D4F5C]"
              >
                Especialidades
              </button>
              <button 
                onClick={() => scrollToSection("portais")} 
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-[#0D4F5C]"
              >
                Portais & Acessos
              </button>
              <button 
                onClick={() => scrollToSection("investimento")} 
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-[#0D4F5C]"
              >
                Planos
              </button>
              <button 
                onClick={() => scrollToSection("contato")} 
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-[#0D4F5C]"
              >
                Contato
              </button>
            </nav>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <a
                href="/checkin"
                className="w-full bg-[#D4A017] text-[#0A2329] py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <UserCheck className="w-4 h-4" />
                <span>Portal do Paciente</span>
              </a>

              <a
                href="/login"
                className="w-full border border-[#0D4F5C] text-[#0D4F5C] hover:bg-[#0D4F5C] hover:text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Acesso Restrito (Sistema Clínico)</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0D4F5C] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#D4A017]" />
                <span>Agendar no WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* 1. HERO SECTION */}
        <section id="inicio" className="relative bg-gradient-to-br from-[#0D4F5C] via-[#093D47] to-[#052A32] text-white py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#D4A017]/10 blur-3xl pointer-events-none"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs md:text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
              <span>Atendimento Humanizado & Especializado em Rio Branco - AC</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.15]">
              Sua mente merece o mesmo cuidado que seu corpo.
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 font-light leading-relaxed max-w-3xl mx-auto">
              Avaliação neuropsicológica de precisão, terapia e programas de desenvolvimento emocional — em um só lugar, com acompanhamento contínuo e humano.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#D4A017] hover:bg-[#c29213] text-[#0A2329] px-8 py-4 rounded-xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl hover:shadow-[#D4A017]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 min-h-[52px]"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Agendar Avaliação</span>
              </a>

              <a
                href="/checkin"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2.5 backdrop-blur-xs min-h-[52px]"
              >
                <UserCheck className="w-5 h-5 text-[#D4A017]" />
                <span>Portal do Paciente</span>
              </a>
            </div>
          </div>
        </section>

        {/* PORTAIS DE ACESSO DIRETO */}
        <section id="portais" className="py-16 md:py-24 bg-white px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[#0D4F5C] text-xs font-bold uppercase tracking-widest bg-[#0D4F5C]/5 px-3.5 py-1 rounded-full border border-[#0D4F5C]/10 inline-block">
                Portais & Ambientes Integrados
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#0D4F5C] tracking-tight">
                Acesse seu ambiente exclusivo
              </h2>
              <p className="text-slate-600 text-sm md:text-base font-light leading-relaxed">
                Plataformas dedicadas para pacientes, equipe clínica, instituições de ensino e parceiros corporativos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Portal 1: Paciente */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 hover:border-[#D4A017] hover:shadow-lg transition-all flex flex-col justify-between space-y-5 group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#D4A017]/15 text-[#8c6700] flex items-center justify-center group-hover:bg-[#D4A017] group-hover:text-[#0A2329] transition-colors">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#0D4F5C]">
                    Portal do Paciente
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-light">
                    Check-in prévio de acolhimento, validação de documentos, suporte pré e pós-consulta e guias.
                  </p>
                </div>
                <a
                  href="/checkin"
                  className="inline-flex items-center justify-between w-full bg-white hover:bg-[#D4A017] text-[#0D4F5C] hover:text-[#0A2329] px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Acessar Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Portal 2: Sistema Clínico */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 hover:border-[#0D4F5C] hover:shadow-lg transition-all flex flex-col justify-between space-y-5 group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0D4F5C]/10 text-[#0D4F5C] flex items-center justify-center group-hover:bg-[#0D4F5C] group-hover:text-white transition-colors">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#0D4F5C]">
                    Sistema Clínico (Acesso Restrito)
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-light">
                    Área restrita à equipe do Instituto SerClin: prontuários eletrônicos, gestão de laudos, agenda e financeiro.
                  </p>
                </div>
                <a
                  href="/login"
                  className="inline-flex items-center justify-between w-full bg-[#0D4F5C] hover:bg-[#093D47] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Entrar no Sistema</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Portal 3: Escola / Hub Neuroeducacional */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-600 hover:shadow-lg transition-all flex flex-col justify-between space-y-5 group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#0D4F5C]">
                    Hub Neuroeducacional
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-light">
                    Plataforma para escolas e professores: formulário de alerta de risco, acompanhamento e suporte pedagógico.
                  </p>
                </div>
                <a
                  href="/escola/alerta"
                  className="inline-flex items-center justify-between w-full bg-white hover:bg-emerald-600 text-[#0D4F5C] hover:text-white px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Alerta Escola</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Portal 4: Blindagem Corporativa B2B */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-600 hover:shadow-lg transition-all flex flex-col justify-between space-y-5 group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#0D4F5C]">
                    Blindagem Corporativa
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-light">
                    Mapeamento preditivo de risco psicossocial para empresas parceiras e check-in cognitivo para colaboradores.
                  </p>
                </div>
                <a
                  href="/corporativo/alerta"
                  className="inline-flex items-center justify-between w-full bg-white hover:bg-indigo-600 text-[#0D4F5C] hover:text-white px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Check-in B2B</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* 2. PROVA IMEDIATA (Faixa de números) */}
        <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            
            {/* Métrica 1 */}
            <div className="text-center space-y-1">
              {/* EDITÁVEL: NÚMERO DE PACIENTES */}
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0D4F5C] font-serif">
                2.500+
              </div>
              <p className="text-xs md:text-sm font-medium text-slate-600 uppercase tracking-wider">
                Pacientes Atendidos
              </p>
            </div>

            {/* Métrica 2 */}
            <div className="text-center space-y-1">
              {/* EDITÁVEL: ANOS DE ATUAÇÃO */}
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0D4F5C] font-serif">
                8+
              </div>
              <p className="text-xs md:text-sm font-medium text-slate-600 uppercase tracking-wider">
                Anos de Atuação
              </p>
            </div>

            {/* Métrica 3 */}
            <div className="text-center space-y-1">
              {/* EDITÁVEL: NOTA DE SATISFAÇÃO */}
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0D4F5C] font-serif flex items-center justify-center gap-1">
                4.9<span className="text-lg text-[#D4A017]">/5</span>
              </div>
              <p className="text-xs md:text-sm font-medium text-slate-600 uppercase tracking-wider">
                Satisfação dos Pacientes
              </p>
            </div>

            {/* Métrica 4 */}
            <div className="text-center space-y-1">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0D4F5C] font-serif py-1">
                Aprovada
              </div>
              <p className="text-xs md:text-sm font-medium text-slate-600 uppercase tracking-wider">
                Avaliação por Convênios
              </p>
            </div>

          </div>
        </section>

        {/* 3. O PROBLEMA (Espelhar a dor) */}
        <section className="bg-[#0A2329] text-white py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <span className="text-[#D4A017] text-xs md:text-sm font-bold uppercase tracking-widest block">
              Acolhimento & Compreensão
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Você não está imaginando.
            </h2>

            <div className="p-8 md:p-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl text-left md:text-center space-y-6">
              <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-slate-200 leading-relaxed">
                "A dificuldade de concentração do seu filho. A ansiedade que não passa. O esquecimento que assusta. O burnout que drena seus dias."
              </p>
              
              <div className="h-0.5 w-16 bg-[#D4A017] mx-auto opacity-80"></div>

              <p className="text-lg md:text-xl font-medium text-emerald-300">
                Isso tem causa. E tem solução.
              </p>
            </div>
          </div>
        </section>

        {/* 4. A SOLUÇÃO — 3 PILARES */}
        <section id="especialidades" className="py-20 md:py-28 bg-slate-100 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-[#0D4F5C] text-xs md:text-sm font-bold uppercase tracking-widest">
                Cuidado Especializado
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D4F5C]">
                Soluções Integradas para Sua Saúde Mental
              </h2>
              <p className="text-slate-600 text-base md:text-lg">
                Três frentes de atuação desenhadas para responder com exatidão a cada momento da sua vida.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Pilar 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0D4F5C]/10 text-[#0D4F5C] flex items-center justify-center group-hover:bg-[#0D4F5C] group-hover:text-white transition-colors">
                    <Brain className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0D4F5C]">
                    Avaliação Neuropsicológica
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Diagnóstico de precisão das funções cognitivas. Para crianças com dificuldades de aprendizagem, adultos com queixas de memória e processos judiciais.
                  </p>
                  
                  <ul className="space-y-3 pt-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Laudo técnico reconhecido</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Devolutiva clara e acolhedora</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Encaminhamento personalizado</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pilar 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0D4F5C]/10 text-[#0D4F5C] flex items-center justify-center group-hover:bg-[#0D4F5C] group-hover:text-white transition-colors">
                    <HeartHandshake className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0D4F5C]">
                    Terapia e Acompanhamento
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Psicoterapia individual, infantil e familiar com abordagem integrativa e foco em resultados transformadores.
                  </p>
                  
                  <ul className="space-y-3 pt-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Sessões presenciais e online</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Plano terapêutico personalizado</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Acompanhamento contínuo</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pilar 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0D4F5C]/10 text-[#0D4F5C] flex items-center justify-center group-hover:bg-[#0D4F5C] group-hover:text-white transition-colors">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0D4F5C]">
                    Programas de Desenvolvimento
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Oficina das Emoções (infantil), grupos terapêuticos e capacitação corporativa para escolas e empresas.
                  </p>
                  
                  <ul className="space-y-3 pt-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Inteligência emocional na prática</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Liderança e saúde mental no trabalho</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Formatos personalizados para escolas e empresas</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. COMO FUNCIONA (Jornada em 3 passos) */}
        <section className="py-20 md:py-28 bg-white px-4 sm:px-6 lg:px-8 border-t border-slate-200">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-[#0D4F5C] text-xs md:text-sm font-bold uppercase tracking-widest">
                Transparência e Simplicidade
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D4F5C]">
                Sua Jornada em 3 Passos Simples
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              
              {/* Passo 1 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-serif font-black text-[#0D4F5C]/30">01</span>
                  <div className="p-3 bg-[#0D4F5C] text-white rounded-xl">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0D4F5C]">
                  1. Agendamento
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Você fala com a gente no WhatsApp e conta o que está acontecendo. Nossa equipe orienta com empatia e agiliza seu primeiro atendimento.
                </p>
              </div>

              {/* Passo 2 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-serif font-black text-[#0D4F5C]/30">02</span>
                  <div className="p-3 bg-[#0D4F5C] text-white rounded-xl">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0D4F5C]">
                  2. Avaliação
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sessão de acolhimento + protocolo técnico adequado ao seu caso. Realizamos escuta ativa e testes validados cientificamente.
                </p>
              </div>

              {/* Passo 3 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-serif font-black text-[#0D4F5C]/30">03</span>
                  <div className="p-3 bg-[#0D4F5C] text-white rounded-xl">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0D4F5C]">
                  3. Plano de Cuidado
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Você recebe um plano personalizado e começa o acompanhamento contínuo com acompanhamento prático e acolhedor.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 6. DEPOIMENTOS (Prova Social) */}
        <section className="py-20 md:py-28 bg-slate-100 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-[#0D4F5C] text-xs md:text-sm font-bold uppercase tracking-widest">
                Vozes da Transformação
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D4F5C]">
                Histórias que se transformaram.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* DEPOIMENTO 1 */}
              {/* SUBSTITUIR POR DEPOIMENTO REAL */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#D4A017]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 italic text-sm leading-relaxed">
                    "Meu filho tinha muita dificuldade de concentração na escola e as notas estavam caindo. Após a avaliação neuropsicológica no SerClin, descobrimos o diagnóstico correto e iniciamos a terapia. Hoje ele está muito mais confiante."
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-[#0D4F5C]/10 text-[#0D4F5C] flex items-center justify-center font-bold text-base">
                    MR
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Mariana R., 34 anos</h4>
                    <p className="text-xs text-slate-500">Mãe do Lucas</p>
                  </div>
                </div>
              </div>

              {/* DEPOIMENTO 2 */}
              {/* SUBSTITUIR POR DEPOIMENTO REAL */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#D4A017]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 italic text-sm leading-relaxed">
                    "Cheguei à clínica no limite do burnout, sem conseguir trabalhar nem dormir direito. O acolhimento humano e a psicoterapia individual mudaram minha rotina. Voltei a ter qualidade de vida e clareza mental."
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-[#0D4F5C]/10 text-[#0D4F5C] flex items-center justify-center font-bold text-base">
                    CE
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Carlos E., 42 anos</h4>
                    <p className="text-xs text-slate-500">Empresário</p>
                  </div>
                </div>
              </div>

              {/* DEPOIMENTO 3 */}
              {/* SUBSTITUIR POR DEPOIMENTO REAL */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#D4A017]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 italic text-sm leading-relaxed">
                    "Sempre tive esquecimentos que me assustavam no trabalho. A equipe fez um protocolo cuidadoso, me explicou tudo na devolutiva de forma simples e agora sigo um plano cognitivo excelente."
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-[#0D4F5C]/10 text-[#0D4F5C] flex items-center justify-center font-bold text-base">
                    FM
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Fernanda M., 29 anos</h4>
                    <p className="text-xs text-slate-500">Arquiteta</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 7. PLANOS (Máximo 3) */}
        <section id="investimento" className="py-20 md:py-28 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-[#0D4F5C] text-xs md:text-sm font-bold uppercase tracking-widest">
                Acompanhamento Contínuo
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D4F5C]">
                Planos de Cuidado
              </h2>
              <p className="text-slate-600 text-base">
                Acompanhamento contínuo e flexível para garantir a evolução da sua saúde mental.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              
              {/* PLANO 1 — ESSENCIAL */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col justify-between space-y-8 hover:shadow-lg transition-all">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#0D4F5C]">Essencial</h3>
                    <p className="text-xs text-slate-500 mt-1">Para suporte contínuo focado</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 font-serif">R$ 149,90</span>
                    <span className="text-slate-500 text-sm font-medium">/mês</span>
                  </div>

                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>2 sessões/mês</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Sessões de 50 min</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Suporte por WhatsApp</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Orientação básica</span>
                    </li>
                  </ul>
                </div>

                <a
                  href="https://wa.me/5568992161717?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20o%20Plano%20Essencial."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0D4F5C] hover:bg-[#093D47] text-white py-3.5 rounded-xl font-bold text-center block transition-colors shadow-md"
                >
                  Agendar
                </a>
              </div>

              {/* PLANO 2 — COMPLETO (DESTACADO ⭐) */}
              <div className="bg-white rounded-2xl p-8 border-2 border-[#D4A017] shadow-xl relative flex flex-col justify-between space-y-8 transform md:-translate-y-2">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4A017] text-[#0A2329] px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> Mais Popular
                </div>

                <div className="space-y-6 pt-2">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#0D4F5C]">Completo</h3>
                    <p className="text-xs text-slate-500 mt-1">Desenvolvimento intensivo com relatório</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#0D4F5C] font-serif">R$ 249,90</span>
                    <span className="text-slate-500 text-sm font-medium">/mês</span>
                  </div>

                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-900">4 sessões/mês</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Sessões de 50 min</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Relatório trimestral</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Material exclusivo</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Acompanhamento prioritário</span>
                    </li>
                  </ul>
                </div>

                <a
                  href="https://wa.me/5568992161717?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20o%20Plano%20Completo."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#D4A017] hover:bg-[#c29213] text-[#0A2329] py-4 rounded-xl font-bold text-center block transition-all shadow-lg hover:shadow-xl font-sans"
                >
                  Agendar
                </a>
              </div>

              {/* PLANO 3 — FAMÍLIA */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col justify-between space-y-8 hover:shadow-lg transition-all">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#0D4F5C]">Família</h3>
                    <p className="text-xs text-slate-500 mt-1">Cuidado abrangente para o núcleo familiar</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 font-serif">R$ 399,90</span>
                    <span className="text-slate-500 text-sm font-medium">/mês</span>
                  </div>

                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Até 4 pessoas</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Sessões semanais</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Alinhamento familiar</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Acompanhamento prioritário</span>
                    </li>
                  </ul>
                </div>

                <a
                  href="https://wa.me/5568992161717?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20o%20Plano%20Fam%C3%ADlia."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0D4F5C] hover:bg-[#093D47] text-white py-3.5 rounded-xl font-bold text-center block transition-colors shadow-md"
                >
                  Agendar
                </a>
              </div>

            </div>

            <p className="text-center text-xs md:text-sm text-slate-500 italic pt-2">
              Sessões não cumulativas. Cancele quando quiser.
            </p>

          </div>
        </section>

        {/* 8. GARANTIA (Remoção de Risco) */}
        <section className="py-16 bg-slate-100 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-200">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-10 shadow-md border border-slate-200/80 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="p-4 bg-[#0D4F5C]/10 text-[#0D4F5C] rounded-2xl shrink-0">
              <Shield className="w-12 h-12 text-[#0D4F5C]" />
            </div>
            <div className="space-y-3 text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold text-[#0D4F5C]">
                Garantia de Acolhimento
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Se após a primeira sessão você sentir que não houve conexão com o profissional, não paga nada. Reagendamos com outro especialista, sem custo. Seu bem-estar vem antes de tudo.
              </p>
            </div>
          </div>
        </section>

        {/* 9. FAQ (Perguntas Frequentes) */}
        <section className="py-20 md:py-28 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="text-center space-y-4">
              <span className="text-[#0D4F5C] text-xs md:text-sm font-bold uppercase tracking-widest">
                Tire Suas Dúvidas
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#0D4F5C]">
                Perguntas Frequentes
              </h2>
            </div>

            <div className="space-y-4">
              
              {/* FAQ 1 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => toggleFaq(1)}
                  className="w-full p-5 text-left font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-base md:text-lg">1. Preciso de encaminhamento médico?</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${activeFaq === 1 ? 'rotate-180 text-[#0D4F5C]' : ''}`} />
                </button>
                {activeFaq === 1 && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 bg-white">
                    Não é obrigatório. Você pode agendar sua avaliação diretamente conosco. Caso já possua encaminhamento de neurologista, psiquiatra ou pediatra, ele será integrado ao seu protocolo.
                  </div>
                )}
              </div>

              {/* FAQ 2 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => toggleFaq(2)}
                  className="w-full p-5 text-left font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-base md:text-lg">2. A avaliação neuropsicológica é coberta por convênio?</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${activeFaq === 2 ? 'rotate-180 text-[#0D4F5C]' : ''}`} />
                </button>
                {activeFaq === 2 && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 bg-white">
                    Emitimos laudos e documentação técnica completa para reembolso junto ao seu plano de saúde. Também possuímos parcerias de encaminhamento e aceitamos modalidades específicas.
                  </div>
                )}
              </div>

              {/* FAQ 3 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => toggleFaq(3)}
                  className="w-full p-5 text-left font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-base md:text-lg">3. Como funcionam as sessões online?</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${activeFaq === 3 ? 'rotate-180 text-[#0D4F5C]' : ''}`} />
                </button>
                {activeFaq === 3 && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 bg-white">
                    As sessões virtuais ocorrem por videochamada criptografada e segura, com a mesma qualidade do atendimento presencial e total flexibilidade de horário.
                  </div>
                )}
              </div>

              {/* FAQ 4 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => toggleFaq(4)}
                  className="w-full p-5 text-left font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-base md:text-lg">4. Em quanto tempo vejo resultados?</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${activeFaq === 4 ? 'rotate-180 text-[#0D4F5C]' : ''}`} />
                </button>
                {activeFaq === 4 && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 bg-white">
                    Os primeiros alívios e clarezas surgem já na devolutiva inicial. O plano terapêutico estabelece metas graduais, ajustadas continuamente ao seu ritmo.
                  </div>
                )}
              </div>

              {/* FAQ 5 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => toggleFaq(5)}
                  className="w-full p-5 text-left font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-base md:text-lg">5. Vocês atendem crianças?</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${activeFaq === 5 ? 'rotate-180 text-[#0D4F5C]' : ''}`} />
                </button>
                {activeFaq === 5 && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 bg-white">
                    Sim! Contamos com equipe especializada em neuropsicologia infantil, avaliação do TDAH/TEA, orientação parental e a Oficina das Emoções.
                  </div>
                )}
              </div>

              {/* FAQ 6 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => toggleFaq(6)}
                  className="w-full p-5 text-left font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-base md:text-lg">6. Posso cancelar o plano quando quiser?</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${activeFaq === 6 ? 'rotate-180 text-[#0D4F5C]' : ''}`} />
                </button>
                {activeFaq === 6 && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 bg-white">
                    Sim, totalmente sem fidelidade forçada. Você pode solicitar o cancelamento a qualquer momento diretamente pelo nosso canal de atendimento no WhatsApp.
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* 10. CTA FINAL */}
        <section className="bg-gradient-to-br from-[#0D4F5C] via-[#093D47] to-[#052A32] text-white py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              O primeiro passo é o mais importante.
            </h2>
            <p className="text-lg md:text-xl text-slate-200 font-light max-w-2xl mx-auto">
              Você não precisa ter todas as respostas agora. Apenas comece.
            </p>

            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#D4A017] hover:bg-[#c29213] text-[#0A2329] px-10 py-5 rounded-2xl font-bold text-lg md:text-xl shadow-2xl hover:shadow-[#D4A017]/30 transition-all transform hover:-translate-y-1 active:translate-y-0 min-h-[56px]"
              >
                <MessageCircle className="w-6 h-6 fill-current" />
                <span>Agendar Avaliação no WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 11. FOOTER (Limpo) */}
      <footer id="contato" className="bg-[#051C21] text-slate-300 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            
            {/* Coluna 1: Marca & Tagline */}
            <div className="space-y-4 md:col-span-1">
              <img 
                src={logoSerClin} 
                alt="Instituto SerClin" 
                className="h-10 w-auto object-contain brightness-0 invert" 
              />
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Onde a excelência clínica e o acolhimento humano convergem para o desenvolvimento pleno.
              </p>
            </div>

            {/* Coluna 2: Navegação Simples */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-white text-sm">Navegação</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => scrollToSection("inicio")} className="hover:text-white transition-colors cursor-pointer">
                    Início
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("especialidades")} className="hover:text-white transition-colors cursor-pointer">
                    Especialidades
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("investimento")} className="hover:text-white transition-colors cursor-pointer">
                    Investimento
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("contato")} className="hover:text-white transition-colors cursor-pointer">
                    Contato
                  </button>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Endereço e Contato */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-white text-sm">Localização e Contato</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <a 
                    href="https://maps.google.com/?q=Rua+Sorocaba,+140,+Doca+Furtado,+Rio+Branco+-+AC" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Rua Sorocaba, 140 — Doca Furtado, Rio Branco - AC
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D4A017] shrink-0" />
                  <a href="tel:5568992161717" className="hover:text-white transition-colors">
                    (68) 99216-1717
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D4A017] shrink-0" />
                  <a href="mailto:institutoserclin@gmail.com" className="hover:text-white transition-colors">
                    institutoserclin@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 4: Redes Sociais */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-white text-sm">Redes Sociais</h4>
              <div className="flex items-center gap-3">
                <a 
                  href="https://instagram.com/institutoserclin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-white/10 hover:bg-[#D4A017] hover:text-[#0A2329] text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-white/10 hover:bg-emerald-600 hover:text-white text-white transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-white/5 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Instituto SerClin. Todos os direitos reservados.
          </div>

        </div>
      </footer>
    </div>
  );
}
