import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Plans } from "@/components/Plans";
import { Covenants } from "@/components/Covenants";
import { Footer } from "@/components/Footer";
import { ClubSection } from "@/components/ClubSection";
import { GrupoSection } from "../components/GrupoSection";
import { ShieldCheck, School, Building, LayoutDashboard, AlertTriangle, ShieldAlert } from "lucide-react"; 

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900 selection:bg-secondary">
      <Navbar />

      <main className="relative">
        {/* 1. INÍCIO */}
        <Hero />
        
        {/* 2. SOBRE */}
        <section id="sobre" className="relative z-10 -mt-24 px-4 md:px-0 scroll-mt-24">
          <About />
        </section>

        {/* 3. SERVIÇOS / NOSSA ENTREGA */}
        <section id="servicos" className="py-40 bg-white scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-24 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Especialidades</span>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8] text-primary">
                Nossa <span className="font-light text-slate-500 not-italic font-sans lowercase">Entrega</span>
              </h2>
            </div>
            <Services />
          </div>
        </section>

        {/* 4. CLUB SERCLIN */}
        <div id="club" className="container mx-auto px-4 py-12 scroll-mt-24">
          <ClubSection />
        </div>

        {/* 5. GRUPO TERAPÊUTICO */}
        <GrupoSection />

        {/* 6. PLANOS / SEU INVESTIMENTO */}
        <section id="planos" className="py-40 bg-slate-50 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-24 space-y-4">
               <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8] text-primary font-serif">
                Planos <span className="font-light text-slate-500 not-italic font-sans lowercase">de Cuidado</span>
              </h2>
            </div>
            <Plans />
          </div>
        </section>

        {/* ==========================================
            🚀 PORTAIS INSTITUCIONAIS (SERCLIN EDUCADOR & CORPORATIVO)
            ========================================== */}
        <section id="portais" className="py-24 bg-slate-100 border-y border-slate-200 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12 space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-primary">Acesso Restrito a Parceiros</h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Portais de monitoramento neurocognitivo B2B</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              
              {/* CARD ESCOLA */}
              <div className="rounded-[2rem] border-none shadow-xl bg-white p-8 space-y-6 flex flex-col justify-between transition-transform hover:-translate-y-1">
                <div>
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                    <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl">
                      <School size={28} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-black text-lg uppercase text-slate-800 leading-tight">SerClin Educador</h3>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Módulo Escolar Integrado</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed text-left">
                    Área restrita para a coordenação escolar monitorar alertas e docentes registrarem triagens rápidas em sala de aula.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <button onClick={() => navigate('/escola')} className="w-full bg-primary hover:bg-secondary text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <LayoutDashboard size={16} /> Painel da Coordenação
                  </button>
                  <button onClick={() => navigate('/escola/alerta')} className="w-full border-2 border-amber-200 text-amber-700 hover:bg-amber-50 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <AlertTriangle size={16} /> Checklist do Professor
                  </button>
                </div>
              </div>

              {/* CARD CORPORATIVO */}
              <div className="rounded-[2rem] border-none shadow-xl bg-white p-8 space-y-6 flex flex-col justify-between transition-transform hover:-translate-y-1">
                <div>
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl">
                      <Building size={28} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-black text-lg uppercase text-slate-800 leading-tight">SerClin Corporativo</h3>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Módulo Empresarial de RH</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed text-left">
                    Ferramenta preditiva para o departamento de Recursos Humanos monitorar índices de sobrecarga e saúde da equipe.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <button onClick={() => navigate('/corporativo')} className="w-full bg-primary hover:bg-secondary text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <LayoutDashboard size={16} /> Painel Analítico do RH
                  </button>
                  <button onClick={() => navigate('/corporativo/alerta')} className="w-full border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <ShieldAlert size={16} /> Termômetro do Colaborador
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 7. CONTATO / FORMULÁRIO SALESFORCE */}
        <section id="contato" className="py-40 bg-white border-t border-slate-100 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-[4rem] shadow-2xl overflow-hidden grid md:grid-cols-2 border border-slate-100">
              
              <div className="bg-primary p-20 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                  <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-[0.8] font-serif">
                    Inicie sua<br/><span className="text-secondary not-italic font-sans">Jornada</span>
                  </h2>
                  <div className="h-1 w-20 bg-secondary"></div>
                  <p className="text-white/60 text-xl font-light leading-relaxed">
                    Um ambiente seguro para o seu development. Agende seu atendimento exclusivo.
                  </p>
                </div>
                <div className="relative z-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/30">
                  <ShieldCheck size={20} className="text-secondary" /> Protocolo de Sigilo Ético
                </div>
                <div className="absolute -bottom-20 -right-10 text-[20rem] font-black text-white/5 italic select-none pointer-events-none uppercase tracking-tighter">SC</div>
              </div>

              <div className="p-16 md:p-24 bg-white">
                <form action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8" method="POST" className="space-y-6">
                  <input type="hidden" name="oid" value="00DgL00000L3Dav" />
                  <input type="hidden" name="retURL" value="https://institutoserclin.vercel.app/obrigado" />
                  <input type="hidden" name="company" value="Instituto SerClin - Site" />
                  <input type="hidden" name="lead_source" value="Web" />
                  <input type="hidden" name="lead_status" value="Aberto - Não contatado" />

                  <div className="space-y-6 text-left">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Identificação</label>
                      <input name="last_name" type="text" required className="w-full p-4 border-b-2 border-slate-100 focus:border-secondary outline-none text-primary font-bold text-lg transition-all" placeholder="Nome Completo" />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">WhatsApp (Celular)</label>
                      <input 
                        name="phone" 
                        type="tel" 
                        required 
                        className="w-full p-4 border-b-2 border-slate-100 focus:border-secondary outline-none text-primary font-bold text-lg transition-all" 
                        placeholder="(68) 99999-9999"
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "");
                          if (v.length > 11) v = v.slice(0, 11);
                          if (v.length > 10) v = v.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
                          else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
                          else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
                          e.target.value = v;
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Área de Interesse</label>
                      <select name="00NgL00003Dnk2H" className="w-full p-4 border-b-2 border-slate-100 focus:border-secondary outline-none text-primary font-bold text-lg bg-transparent">
                        <option value="">-- Selecione --</option>
                        <option value="Neuropsicologia">Neuropsicologia</option>
                        <option value="Psicopedagogia">Psicopedagogia</option>
                        <option value="Psicoterapia">Psicoterapia</option>
                      </select>
                    </div>

                    <button type="submit" className="w-full bg-primary hover:bg-secondary text-white hover:text-primary font-black py-8 rounded-2xl uppercase text-[11px] tracking-[0.4em] shadow-xl transition-all active:scale-95">
                      Solicitar Atendimento
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* 8. CONVÊNIOS */}
        <section id="convenios" className="py-40 bg-primary text-white scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-20 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Parcerias</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.8] text-white font-serif">
                Nossos <span className="font-sans font-light text-white/40 not-italic lowercase">Convênios</span>
              </h2>
            </div>
            <Covenants />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}