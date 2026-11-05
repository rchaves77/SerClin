import { MessageCircle } from "lucide-react";
import logoSerClin from "@/assets/logo-serclin.png";

const WHATSAPP_URL =
  "https://wa.me/5568992161717?text=" +
  encodeURIComponent("Olá! Quero agendar uma avaliação no Instituto SerClin.");

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Especialidades", href: "/#especialidades" },
  { label: "Empresas", href: "/empresas" },
  { label: "Planos", href: "/#investimento" },
  { label: "Contato", href: "/#contato" },
];

/** Cabeçalho das páginas públicas internas (mesmo visual da home). */
export function PublicHeader() {
  return (
    <header className="public-header sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20 lg:px-8">
        <a href="/" className="group flex items-center gap-3" aria-label="Instituto SerClin — início">
          <img
            src={logoSerClin}
            alt="Instituto SerClin"
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105 md:h-12"
          />
        </a>

        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-600 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="py-1 transition-colors hover:text-[#0D4F5C]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-[#0D4F5C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#093D47] hover:shadow"
        >
          <MessageCircle className="h-3.5 w-3.5 text-[#D4A017]" aria-hidden="true" />
          <span>Agendar</span>
        </a>
      </div>
    </header>
  );
}
