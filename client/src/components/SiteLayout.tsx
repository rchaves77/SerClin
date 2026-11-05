import { useState, type ReactNode } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

export const WHATSAPP_NUMBER = "5568992161717";
export const MAPS_URL = "https://maps.app.goo.gl/EBw3iRXYR7DGFqYNA";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppLink({
  children,
  message,
  className = "button button-primary",
}: {
  children: ReactNode;
  message: string;
  className?: string;
}) {
  return (
    <a className={className} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}

const navigation = [
  { label: "Início", href: "/" },
  { label: "Famílias", href: "/familias" },
  { label: "Empresas", href: "/empresas", business: true },
  { label: "Avaliação neuropsicológica", href: "/avaliacao-neuropsicologica" },
  { label: "Planos", href: "/planos" },
  { label: "Contato", href: "/contato" },
];

export default function SiteLayout({
  children,
  active,
}: {
  children: ReactNode;
  active: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell" id="inicio">
      <div className="topline">
        <span>Instituto SerClin <i aria-hidden="true" /> Rio Branco, Acre</span>
        <a href="tel:+5568992161717">+55 (68) 99216-1717</a>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="/" aria-label="Instituto SerClin — página inicial">
            <img className="brand-logo" src="/serclin-logo.png" alt="Instituto SerClin — Saúde e Bem-estar" width="604" height="413" />
          </a>
          <nav id="primary-navigation" className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Navegação principal">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${item.business ? "nav-business " : ""}${active === item.href ? "is-active" : ""}`.trim()}
                aria-current={active === item.href ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <WhatsAppLink
            className="button button-primary header-cta"
            message="Olá! Quero conversar com o Instituto SerClin."
          >
            Falar no WhatsApp
          </WhatsAppLink>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-about">
            <a className="brand" href="/" aria-label="Instituto SerClin — página inicial">
              <img className="brand-logo" src="/serclin-logo.png" alt="Instituto SerClin" width="604" height="413" />
            </a>
            <p>Neuropsicologia com rigor científico e acolhimento para famílias e empresas em Rio Branco.</p>
            <a className="instagram-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">Ver perfil no Google</a>
          </div>
          <div className="footer-column">
            <span className="footer-label">Navegue</span>
            <a href="/familias">Famílias</a>
            <a href="/empresas">Empresas</a>
            <a href="/avaliacao-neuropsicologica">Avaliação neuropsicológica</a>
            <a href="/planos">Planos de cuidado</a>
            <a href="/contato">Contato</a>
          </div>
          <div className="footer-column">
            <span className="footer-label">Fale conosco</span>
            <a href="tel:+5568992161717">+55 (68) 99216-1717</a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">Rua Sorocaba, 140, Doca Furtado</a>
            <a href={whatsappUrl("Olá! Quero conversar com o Instituto SerClin.")} target="_blank" rel="noopener noreferrer">WhatsApp do Instituto</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© Instituto SerClin · Rio Branco, AC</span>
          <span className="footer-care">Informação clara. Cuidado responsável.</span>
        </div>
      </footer>
    </div>
  );
}
