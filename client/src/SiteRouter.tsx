import SiteLayout from "./components/SiteLayout";
import Companies from "./pages/Companies";
import Contact from "./pages/Contact";
import Families from "./pages/Families";
import Home from "./pages/Home";
import Neuropsychology from "./pages/Neuropsychology";
import Plans from "./pages/Plans";
import ThankYou from "./pages/ThankYou";

function NotFound() {
  return <SiteLayout active="/"><section className="multi-section multi-thank-you"><span className="multi-kicker">Instituto SerClin</span><h1>Esta página não foi encontrada.</h1><p>O endereço pode ter mudado. Volte à página inicial para escolher o atendimento adequado.</p><a className="button button-primary" href="/">Ir para a página inicial</a></section></SiteLayout>;
}

export default function SiteRouter() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  switch (path) {
    case "/": return <Home />;
    case "/familias": return <Families />;
    case "/empresas": return <Companies />;
    case "/avaliacao-neuropsicologica": return <Neuropsychology />;
    case "/planos": return <Plans />;
    case "/contato": return <Contact />;
    case "/obrigado": return <ThankYou />;
    default: return <NotFound />;
  }
}
