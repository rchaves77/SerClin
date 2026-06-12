import { Check, Star } from "lucide-react";

export function Plans() {
  const plans = [
    { nome: "Protocolo Essencial", preco: "99,90", desc: "A porta de entrada para o seu autocuidado com atendimento quinzenal.", destaque: null, itens: ["Atendimento Quinzenal", "Sessões de até 40 minutos", "Acolhimento pontual", "Orientação básica"] },
    { nome: "Protocolo Acolher", preco: "149,90", desc: "Manutenção emocional e suporte regular para suas metas.", destaque: null, itens: ["Atendimento Quinzenal", "Sessões de 50 minutos", "Suporte via WhatsApp", "Horários diferenciados"] },
    { nome: "Cuidado Premium", preco: "189,90", desc: "Para quem busca ferramentas práticas de evolução diária.", destaque: "MAIS PROCURADO", itens: ["Atendimento Quinzenal de 50 minutos", "Exercícios de fixação entre sessões", "Curadoria de materiais exclusivos", "Devolutiva verbal trimestral"] },
    { nome: "Mente Brilhante", preco: "249,90", desc: "Foco total em desempenho de foco, cognitivo e estudos.", destaque: null, itens: ["Ideal para estudantes ou concurseiros", "Treino de memória e foco", "Organização e planejamento de rotinas", "E-books pedagógicos inclusos"] },
    { nome: "Jornada Contínua", preco: "319,90", desc: "Acelere seus resultados com suporte terapêutico semanal.", destaque: null, itens: ["Atendimento Semanal (4 sessões/mês)", "Relatórios de Evoluções", "Acompanhamento de metas contínuo", "1 Sessão Bônus semestral"] },
    { nome: "Família Prestige", preco: "1.200,00", desc: "Cuidado integral e simultâneo para o seu maior patrimônio.", destaque: "EXCLUSIVO", itens: ["Cobertura para até 4 familiares", "Terapias Semanais para todos", "Encontros mensais de alinhamento", "Suporte prioritário via central"] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left max-w-7xl mx-auto">
      {plans.map((p, i) => (
        <div key={i} className={`bg-white rounded-[2.5rem] border ${p.destaque ? "border-[#bfa571] ring-4 ring-[#bfa571]/10" : "border-slate-100"} p-8 shadow-md relative overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300`}>
          
          {p.destaque && (
            <div className="absolute top-0 right-0 bg-[#bfa571] text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-bl-2xl">
              {p.destaque}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <p className="text-[9px] font-black text-[#bfa571] uppercase tracking-widest font-mono">Plano de Cuidado</p>
              <h3 className="text-2xl font-black uppercase leading-none tracking-tight text-[#0a2d54] mt-1">{p.nome}</h3>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed mt-2">{p.desc}</p>
            </div>

            <div className="flex items-end gap-1">
              <span className="text-sm font-bold text-slate-400">R$</span>
              <span className="text-4xl font-black text-[#0a2d54] leading-none">{p.preco}</span>
              <span className="text-xs font-bold text-slate-400 mb-1">/mês</span>
            </div>

            <div className="h-px bg-slate-100"></div>

            <ul className="space-y-3">
              {p.itens.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium leading-relaxed">
                  <div className="bg-[#bfa571]/10 text-[#9e814d] p-0.5 rounded-full mt-0.5 shrink-0">
                    <Check className="w-3 h-3 font-black" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <button
              onClick={() => {
                const tel = "5568992161717";
                const msg = `Olá! Vi o plano *${p.nome}* no site e gostaria de tirar mais dúvidas sobre agendamento e contratação.`;
                window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, "_blank");
              }}
              className={`w-full py-4 rounded-xl text-center text-xs font-black uppercase tracking-widest border-none cursor-pointer transition-all ${
                p.destaque 
                  ? "bg-[#bfa571] hover:bg-[#9e814d] text-white shadow-lg shadow-[#bfa571]/20" 
                  : "bg-slate-100 hover:bg-[#0a2d54] hover:text-white text-[#0a2d54]"
              }`}
            >
              Contratar Protocolo
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
