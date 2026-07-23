import { ShieldCheck, ArrowRight, Sparkles, MessageCircle, AlertTriangle, Users, Target, Briefcase } from "lucide-react";

export function GrupoSection() {
  
  const handleAgendarTriagem = () => {
    const telefoneClinica = "5568992161717"; 
    const mensagem = "Olá! Faço parte da comunidade Autonomia Neuroatípico e gostaria de agendar a minha sessão de triagem obrigatória para o Grupo Terapêutico com a Dra. Helenara Chaves.";
    window.open(`https://wa.me/${telefoneClinica}?text=${encodeURIComponent(mensagem)}`, "_blank");
  };

  return (
    <section id="grupo-terapeutico" className="py-40 bg-white border-t border-slate-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        
        {/* CABEÇALHO NO PADRÃO SIGNATURE DO SITE */}
        <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary flex items-center justify-center gap-2 font-sans">
            <Sparkles size={12} className="text-secondary animate-pulse" /> VAGAS PRIORITÁRIAS ABERTAS COMUNIDADE
          </span>
          
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-primary font-serif leading-tight">
            Programa de Desenvolvimento <br />
            <span className="font-sans font-light text-slate-500 not-italic lowercase block mt-2">
              de conexões sociais
            </span>
          </h2>
          
          <p className="text-slate-600 text-lg md:text-xl font-normal max-w-3xl mx-auto pt-2 leading-relaxed font-sans">
            Um grupo terapêutico prático, acolhedor e focado na autonomia de adultos neuroatípicos, liderado pela Dra. Helenara Chaves no Instituto SerClin.
          </p>
        </div>

        {/* ESTRUTURA DO PRODUTO EM DUAS COLUNAS */}
        <div className="grid lg:grid-cols-12 gap-12 items-stretch mt-16">
          
          {/* LADO ESQUERDO: PILARES DO QUE SERÁ TRABALHADO */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xl font-black uppercase tracking-wider text-primary font-sans">
                O que vamos trabalhar na prática?
              </h4>
              <div className="h-1 w-16 bg-secondary"></div>
            </div>

            {/* FONTES CORRIGIDAS: Nítidas, legíveis e sem o visual antigo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <MessageCircle size={22} />
                </div>
                <h5 className="font-extrabold text-[16px] uppercase text-slate-900 tracking-wide">Comunicação & Nuances</h5>
                <p className="text-[15px] text-slate-600 font-normal leading-relaxed tracking-normal">
                  Leitura de ironia, sarcasmo e desenvolvimento de conversas cotidianas (o famoso *small talk*).
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <Briefcase size={22} />
                </div>
                <h5 className="font-extrabold text-[16px] uppercase text-slate-900 tracking-wide">Contexto Profissional</h5>
                <p className="text-[15px] text-slate-600 font-normal leading-relaxed tracking-normal">
                  Entrevistas de emprego, reuniões, devolutivas de feedback e decodificação de regras implícitas do ambiente de trabalho.
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4 sm:col-span-2 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <Target size={22} />
                </div>
                <h5 className="font-extrabold text-[16px] uppercase text-slate-900 tracking-wide">Relações & Autonomia Adulta</h5>
                <p className="text-[15px] text-slate-600 font-normal leading-relaxed tracking-normal">
                  Construção e manutenção de amizades na vida adulta, dinâmicas de paquera/relacionamentos afetivos e estratégias avançadas de autorregulação emocional.
                </p>
              </div>
            </div>

            {/* REGRAS DE FUNCIONAMENTO */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-[2rem] p-6 flex items-start gap-4 font-sans shadow-sm">
              <Users size={24} className="text-primary mt-1 shrink-0" />
              <div className="space-y-2">
                <h5 className="font-extrabold text-xs uppercase text-primary tracking-wider">Funcionamento do Grupo</h5>
                <p className="text-[15px] text-slate-700 font-normal leading-relaxed tracking-normal">
                  Ciclo fechado de <strong className="font-bold text-primary">12 encontros semanais</strong> (90 minutos cada), realizado presencialmente no Instituto SerClin. Grupo estritamente limitado a <strong className="font-bold text-primary">no máximo 8 participantes</strong> para foco individual completo.
                </p>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: CARD DE VALORES */}
          <div className="lg:col-span-5 bg-primary text-white rounded-[3.5rem] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden shadow-2xl font-sans">
            <div className="absolute -right-10 -bottom-10 text-[18rem] font-black text-white/[0.01] italic select-none pointer-events-none uppercase">
              8V
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary block">
                  INVESTIMENTO DO PROGRAMA
                </span>
                <h4 className="text-3xl font-black uppercase tracking-tight text-white font-serif italic">
                  Condições <span className="font-sans font-light text-white/60 not-italic lowercase">Exclusivas</span>
                </h4>
              </div>

              {/* Tabela de Preços Nítida */}
              <div className="space-y-4 border-b border-white/10 pb-6">
                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 shadow-inner">
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Passo 1 (Obrigatório)</p>
                    <p className="text-base font-bold text-white/95">Sessão de Triagem Individual</p>
                  </div>
                  <span className="font-black text-xl text-secondary">R$ 100</span>
                </div>

                <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 shadow-inner">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Passo 2 (O Ciclo - 3 Meses)</p>
                    <p className="text-base font-bold text-white/95">Parcelado ou À Vista</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl text-white tracking-tight">3x R$ 380</p>
                    <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wide mt-0.5">ou R$ 980 no PIX</p>
                  </div>
                </div>
              </div>

                            {/* Alerta de Vagas - Legibilidade Máxima */}
                <div className="flex items-start gap-4 bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl font-sans">
                <AlertTriangle className="text-secondary shrink-0 mt-0.5" size={20} />
                <p className="text-[14px] text-white/90 font-medium leading-relaxed tracking-wide">
                    Como são apenas <strong className="text-secondary font-black">8 vagas para a turma toda</strong>, o preenchimento das cadeiras será rigorosamente por ordem de agendamento e aprovação na sessão de triagem.
                </p>
                </div>
            </div>

            {/* BOTÃO DE RESERVA */}
            <button
              onClick={handleAgendarTriagem}
              className="w-full mt-10 bg-secondary hover:bg-white text-primary font-black uppercase text-xs tracking-[0.2em] py-6 rounded-2xl transition-all shadow-xl shadow-secondary/10 flex items-center justify-center gap-2 group relative z-10"
            >
              Garantir Minha Triagem <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}