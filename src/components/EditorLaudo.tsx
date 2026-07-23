import React, { useRef, useState } from "react";
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  CheckCircle2, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner"; // <--- ERA AQUI QUE ESTAVA DANDO ERRO!

interface EditorLaudoProps {
  paciente: any;
  perfil: any;
  onClose: () => void;
  onSave: (pdfBlob: Blob, nomeArquivo: string) => Promise<void>;
}

export function EditorLaudo({ paciente, perfil, onClose, onSave }: EditorLaudoProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [gerando, setGerando] = useState(false);

  // Comandos de formatação (Estilo Word)
  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
  };

  const gerarPDFPremium = async () => {
    if (!editorRef.current) return;
    setGerando(true);
    try {
      const doc = new jsPDF();
      const m = 25;
      let y = 30;

      // 1. Cabeçalho Premium / Brasão SerClin
      doc.setFont("times", "bold"); doc.setFontSize(22); doc.setTextColor(30, 58, 138);
      doc.text("INSTITUTO SERCLIN", 105, y, { align: "center" });
      y += 8;
      doc.setFontSize(10); doc.setFont("times", "italic"); doc.setTextColor(100);
      doc.text("Gestão em Saúde e Reabilitação Cognitiva", 105, y, { align: "center" });
      y += 10;
      doc.setDrawColor(30, 58, 138); doc.setLineWidth(0.5); doc.line(25, y, 185, y);
      y += 20;

      // 2. Título
      doc.setFontSize(14); doc.setFont("times", "bold"); doc.setTextColor(0);
      doc.text("LAUDO PSICOLÓGICO – AVALIAÇÃO NEUROPSICOLÓGICA", 105, y, { align: "center" });
      y += 15;

      // 3. Conteúdo processado do Editor
      doc.setFont("times", "normal"); doc.setFontSize(11);
      const content = editorRef.current.innerText;
      const splitText = doc.splitTextToSize(content, 160);
      
      // Paginação caso o texto passe de uma folha
      for (let i = 0; i < splitText.length; i++) {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.text(splitText[i], m, y);
        y += 6;
      }

      // 4. Rodapé e Assinatura
      if (y > 240) { doc.addPage(); y = 20; }
      const pH = doc.internal.pageSize.getHeight();
      y = pH - 45;
      doc.setDrawColor(0); doc.setLineWidth(0.2); doc.line(65, y, 145, y);
      y += 6; doc.setFont("times", "bold"); 
      doc.text(perfil?.nome || "Profissional SerClin", 105, y, { align: "center" });
      y += 5; doc.setFont("times", "normal"); doc.setFontSize(9);
      doc.text(`Psicóloga e Neuropsicóloga - CRP ${perfil?.crp || perfil?.conselho || '24/02216'}`, 105, y, { align: "center" });
      
      // QR Code Placeholder
      doc.setDrawColor(200); doc.rect(170, pH - 32, 16, 16); 
      doc.setFontSize(5); doc.setTextColor(150); 
      doc.text("AUTENTICIDADE\nDIGITAL", 178, pH - 12, { align: "center" });

      const pdfBlob = doc.output('blob');
      const nomeArquivo = `Laudo_${paciente?.nome?.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      
      await onSave(pdfBlob, nomeArquivo);
      toast.success("Laudo finalizado com sucesso!");
    } catch (e) {
      console.error("Erro PDF:", e);
      toast.error("Erro ao gerar documento.");
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex flex-col items-center p-4 md:p-8 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col h-full overflow-hidden border border-white/20">
        
        {/* Toolbar Estilo Word */}
        <div className="bg-gray-50 p-4 border-b flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border shadow-sm">
            <button onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-100 rounded-lg" title="Negrito"><Bold size={18}/></button>
            <button onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-100 rounded-lg" title="Itálico"><Italic size={18}/></button>
            <button onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-100 rounded-lg" title="Sublinhado"><Underline size={18}/></button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-100 rounded-lg" title="Alinhar à Esquerda"><AlignLeft size={18}/></button>
            <button onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-gray-100 rounded-lg" title="Centralizar"><AlignCenter size={18}/></button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <select onChange={(e) => execCommand('fontSize', e.target.value)} className="bg-transparent text-xs font-bold px-2 outline-none cursor-pointer">
              <option value="3">Tamanho: Normal</option>
              <option value="5">Tamanho: Médio</option>
              <option value="7">Tamanho: Grande</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={onClose} variant="ghost" className="text-gray-400 font-black uppercase text-[10px]">Cancelar e Voltar</Button>
            <Button onClick={gerarPDFPremium} disabled={gerando} className="bg-[#1e3a8a] text-white font-black uppercase text-xs px-8 rounded-full h-12 shadow-lg hover:scale-105 transition-all">
              {gerando ? <RefreshCw className="animate-spin mr-2"/> : <CheckCircle2 className="mr-2" size={18}/>}
              Gerar PDF Assinado
            </Button>
          </div>
        </div>

        {/* Área de Escrita (Simula Folha A4) */}
        <div className="flex-1 overflow-y-auto bg-gray-200/50 p-6 md:p-12 flex justify-center">
          <div 
            ref={editorRef}
            contentEditable 
            className="bg-white w-full max-w-[210mm] min-h-[297mm] p-16 md:p-24 shadow-xl outline-none text-gray-800 font-serif leading-relaxed text-[11pt] text-left"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            <p style={{textAlign: "center", fontSize: "16pt", fontWeight: "bold", color: "#1e3a8a"}}>INSTITUTO SERCLIN</p>
            <p style={{textAlign: "center", fontStyle: "italic", color: "#666", marginBottom: "30px"}}>Gestão em Saúde e Reabilitação Cognitiva</p>
            
            <p><b>1. IDENTIFICAÇÃO PROFISSIONAL</b></p>
            <p>Nome: {perfil?.nome || 'Helenara Maria da Silva Mendes Chaves'}</p>
            <p>CRP: {perfil?.crp || perfil?.conselho || '24/02216'}</p>
            <br />

            <p><b>2. IDENTIFICAÇÃO DO PACIENTE</b></p>
            <p>Nome: {paciente?.nome}</p>
            <p>Nascimento: {paciente?.data_nascimento ? new Date(paciente.data_nascimento).toLocaleDateString('pt-BR') : '---'}</p>
            <br />

            <p><b>3. DESCRIÇÃO DA DEMANDA</b></p>
            <p>O paciente apresenta características compatíveis com...</p>
            <br />

            <p><b>4. PROCEDIMENTOS E RESULTADOS</b></p>
            <p>(Descreva aqui as sessões realizadas e os testes aplicados)</p>
            <br />

            <p><b>5. CONCLUSÃO DIAGNÓSTICA</b></p>
            <p>Diante dos achados clínicos, conclui-se que o quadro é compatível com TEA (CID-11: 6A02.0) associado a TDAH (CID-11: 6A05.2).</p>
            <br />

            <p><b>6. ENCAMINHAMENTOS</b></p>
            <p>1. Psicoterapia ABA;<br/>2. Terapia Ocupacional com Integração Sensorial;<br/>3. Acompanhamento com Neuropediatra.</p>
          </div>
        </div>
      </div>
    </div>
  );
}