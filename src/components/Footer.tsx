import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import SerclinLogo from "./SerclinLogo";

interface FooterProps {
  setView: (view: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  return (
    <footer className="bg-[#041222] text-slate-400 border-t border-[#0a2d54]/30" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("home")}>
              <SerclinLogo variant="horizontal" isDarkBg={true} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cuidado integral, acolhimento humano e excelência médica. Nosso foco é promover sua saúde de forma integrada e personalizada.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#0a2d54]/25 p-3 rounded-xl border border-[#0a2d54]/30">
              <ShieldCheck className="w-4 h-4 text-[#bfa571] flex-shrink-0" />
              <span>Ambiente clínico regulamentado e higienizado.</span>
            </div>
          </div>

          {/* Specialties Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-4">Especialidades</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setView("home")} className="hover:text-[#bfa571] transition-colors cursor-pointer border-none bg-none text-left">
                  Psicologia Clínica
                </button>
              </li>
              <li>
                <button onClick={() => setView("home")} className="hover:text-[#bfa571] transition-colors cursor-pointer border-none bg-none text-left">
                  Psiquiatria Integrada
                </button>
              </li>
              <li>
                <button onClick={() => setView("home")} className="hover:text-[#bfa571] transition-colors cursor-pointer border-none bg-none text-left">
                  Nutrição Funcional
                </button>
              </li>
              <li>
                <button onClick={() => setView("home")} className="hover:text-[#bfa571] transition-colors cursor-pointer border-none bg-none text-left">
                  Fisioterapia & RPG
                </button>
              </li>
              <li>
                <button onClick={() => setView("home")} className="hover:text-[#bfa571] transition-colors cursor-pointer border-none bg-none text-left">
                  Fonoaudiologia
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-4">Acesso Rápido</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setView("home")} className="hover:text-[#bfa571] transition-colors cursor-pointer border-none bg-none text-left">
                  Especialistas do Corpo Clínico
                </button>
              </li>
              <li>
                <button onClick={() => setView("booking")} className="hover:text-[#bfa571] transition-colors font-medium text-[#bfa571] cursor-pointer border-none bg-none text-left">
                  Agendar Consulta
                </button>
              </li>
              <li>
                <button onClick={() => setView("checkin")} className="hover:text-[#bfa571] transition-colors cursor-pointer border-none bg-none text-left">
                  Área do Paciente
                </button>
              </li>
              <li>
                <button onClick={() => setView("chat")} className="hover:text-[#bfa571] transition-colors cursor-pointer border-none bg-none text-left">
                  Assistente de Sintomas (IA)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3 font-normal text-sm">
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-4">Contato</h3>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#bfa571] flex-shrink-0 mt-0.5" />
              <span>Av. Paulista, 1500 - Bela Vista, São Paulo - SP, 01310-200</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#bfa571]" />
              <span>(11) 3241-9988 / (11) 98877-6655</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#bfa571]" />
              <span>contato@institutoserclin.com.br</span>
            </div>
            <div className="flex items-start gap-2.5 pt-1">
              <Clock className="w-4 h-4 text-[#bfa571] flex-shrink-0 mt-0.5" />
              <div>
                <p>Segunda a Sexta: 07:00 as 21:00</p>
                <p>Sábado: 08:00 as 14:30</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[#0a2d54]/20 my-8" />

        {/* Bottom Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} Instituto SerClin S/A. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>Diretor Técnico Médico: Dr. Mateus Silva CRM-SP 142.509</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
