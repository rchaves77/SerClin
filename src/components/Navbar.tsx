import { Menu, X, User, Calendar, MessageSquare, Home, Shield } from "lucide-react";
import { useState } from "react";
import SerclinLogo from "./SerclinLogo";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  hasAppointments: boolean;
}

export default function Navbar({ currentView, setView, hasAppointments }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Início", icon: Home },
    { id: "booking", label: "Agendar Consulta", icon: Calendar },
    { id: "checkin", label: "Área do Paciente", icon: User, badge: hasAppointments },
    { id: "acessos", label: "Gestão Clínica", icon: Shield },
    { id: "chat", label: "Assistente Virtual", icon: MessageSquare },
  ];

  const handleNavClick = (id: string) => {
    setView(id);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick("home")} 
            className="cursor-pointer group flex items-center"
            id="brand-logo"
          >
            <SerclinLogo variant="horizontal" className="hover:scale-[1.02] transition-transform duration-300" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" id="desktop-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-4 h-11 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-[#0a2d54] bg-[#f0f4f8] font-semibold"
                      : "text-slate-600 hover:text-[#0a2d54] hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#bfa571]" : "text-slate-400"}`} />
                  {item.label}
                  {item.badge && (
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bfa571] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#bfa571]"></span>
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={() => handleNavClick("booking")}
              id="cta-schedule-nav"
              className="ml-4 px-5 py-2.5 text-sm font-semibold text-white bg-[#0a2d54] hover:bg-[#bfa571] hover:text-white active:bg-[#0a2d54] rounded-xl shadow-lg shadow-blue-50 transition-all duration-300 transform active:scale-95 cursor-pointer border-none"
            >
              Agendar Agora
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-500 hover:text-[#0a2d54] hover:bg-slate-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-b border-slate-100 divide-y divide-slate-50 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "text-[#0a2d54] bg-[#f0f4f8] font-semibold"
                    : "text-slate-600 hover:text-[#0a2d54] hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#bfa571]" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto flex h-20 w-2 rounded-full bg-[#bfa571]"></span>
                )}
              </button>
            );
          })}
          <div className="pt-4 px-2">
            <button
              onClick={() => handleNavClick("booking")}
              id="mobile-cta-nav"
              className="w-full text-center px-4 py-3 font-semibold text-sm text-white bg-[#0a2d54] hover:bg-[#bfa571] rounded-xl shadow-md transition-all active:scale-95 cursor-pointer border-none"
            >
              Agendar Nova Consulta
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
