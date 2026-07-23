import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
  return (
    <section id="contato" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
          
          {/* Lado Esquerdo: Identidade Visual SerClin */}
          <div className="bg-primary p-12 text-white flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold mb-6">Inicie seu Atendimento</h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Preencha os dados abaixo e nossa equipe entrará em contato para agendar sua triagem no Instituto SerClin.
            </p>
            <div className="space-y-4 text-sm">
              <p className="flex items-center gap-2">📍 Rio Branco, Acre</p>
              <p className="flex items-center gap-2">📞 (68) 99216-1717</p>
            </div>
          </div>

          {/* Lado Direito: Integração Salesforce Web-to-Lead */}
          <div className="p-12">
            <form action="https://webto.salesforce.com/servlet/index.php/WebToLead?encoding=UTF-8" method="POST">
              
              {/* ID da Organização (OID) do Rômulo */}
              <input type="hidden" name="oid" value="00DgL00000L3Dav" />
              
              {/* URL de retorno após envio */}
              <input type="hidden" name="retURL" value="https://serclin.com.br" />

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/60">Nome Completo</label>
                  <Input name="last_name" placeholder="Nome do paciente" required className="rounded-xl border-primary/20" />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/60">E-mail</label>
                  <Input name="email" type="email" placeholder="email@exemplo.com" required className="rounded-xl border-primary/20" />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/60">WhatsApp</label>
                  <Input name="phone" placeholder="(68) 99999-9999" className="rounded-xl border-primary/20" />
                </div>

                {/* CAMPO PERSONALIZADO: ÁREA DE INTERESSE */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/60">Especialidade Desejada</label>
                  <select 
                    name="00NgL00003Dnk2H" 
                    className="flex h-10 w-full rounded-xl border border-primary/20 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="Neuropsicologia">Neuropsicologia</option>
                    <option value="Psicoterapia">Psicoterapia</option>
                    <option value="Psicopedagogia">Psicopedagogia</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-primary/60">Queixa ou Mensagem</label>
                  <Textarea name="description" placeholder="Conte-nos brevemente o motivo do contato" className="rounded-xl border-primary/20" />
                </div>

                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold py-6 rounded-xl shadow-lg transition-all active:scale-95">
                  Enviar para o Instituto
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}