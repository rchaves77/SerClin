import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import logoSerClin from "@/assets/logo-serclin.png";

const WHATSAPP_URL =
  "https://wa.me/5568992161717?text=" +
  encodeURIComponent("Olá! Quero agendar uma avaliação no Instituto SerClin.");

// Link oficial do Instituto no Google Maps
const MAPS_URL = "https://maps.app.goo.gl/EBw3iRXYR7DGFqYNA";

/** Rodapé das páginas públicas internas (mesmo visual da home). */
export function PublicFooter() {
  return (
    <footer className="public-footer border-t border-white/10 bg-[#051C21] px-4 py-14 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <img
              src={logoSerClin}
              alt="Instituto SerClin"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <p className="text-xs font-light leading-relaxed text-slate-400">
              Onde a excelência clínica e o acolhimento humano convergem para o desenvolvimento pleno.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white">Localização e Contato</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D4A017]" aria-hidden="true" />
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Rua Sorocaba, 140 — Doca Furtado, Rio Branco - AC
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#D4A017]" aria-hidden="true" />
                <a href="tel:+5568992161717" className="transition-colors hover:text-white">
                  (68) 99216-1717
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#D4A017]" aria-hidden="true" />
                <a
                  href="mailto:institutoserclin@gmail.com"
                  className="break-all transition-colors hover:text-white"
                >
                  institutoserclin@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white">Redes Sociais</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/institutoserclin"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/10 p-2.5 text-white transition-all hover:bg-[#D4A017] hover:text-[#0A2329]"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/10 p-2.5 text-white transition-all hover:bg-emerald-600"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Instituto SerClin. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
