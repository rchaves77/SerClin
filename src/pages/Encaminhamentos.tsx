import { useState, useEffect } from 'react';
import { format, differenceInYears, parseISO } from 'date-fns';
import { FileText, Plus, User, FileDigit, Phone, Calendar, GraduationCap, Stethoscope, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import logoSer2 from '@/assets/ser2.png';

const carregarImagem = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

export function Encaminhamentos() {
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(true);
  const [encaminhamentos, setEncaminhamentos] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    paciente_nome: '',
    paciente_cpf: '',
    paciente_telefone: '',
    paciente_nascimento: '',
    aluno_remetente: '',
    psicologo_responsavel: '',
  });

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email?.toLowerCase().trim();
      // Verificação para o seu email de admin
      if (email === 'romulochaves77@gmail.com' || email === 'romulochaves@gmail.com') {
        setIsAdmin(true);
      }
    };
    checkAdmin();
    fetchEncaminhamentos();
  }, []);

  const fetchEncaminhamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('encaminhamentos_unimeta')
        .select('*')
        .order('criado_em', { ascending: false });
      if (!error && data) setEncaminhamentos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return '';
    try {
      return differenceInYears(new Date(), parseISO(dataNascimento)).toString();
    } catch { return ''; }
  };

  const aplicarMascaraCPF = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  };

  const aplicarMascaraTelefone = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})$/, '$1-$2').slice(0, 15);
  };

  const gerarPDF = async (dados: any, validacaoId: string) => {
    try {
      const urlValidacao = `https://institutoserclin.vercel.app/validar/${validacaoId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(urlValidacao);
      const doc = new jsPDF();
      
      const imgSer = await carregarImagem(logoSer2);
      doc.addImage(imgSer, 'PNG', 75, 15, 60, 40);

      doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(30, 58, 138);
      doc.text("ENCAMINHAMENTO CLÍNICO INSTITUCIONAL", 105, 65, { align: "center" });
      doc.setFontSize(10); doc.setTextColor(100, 100, 100);
      doc.text("Instituto SerClin - Encaminhamento Clínico Especializado", 105, 72, { align: "center" });
      
      const dataHoje = format(new Date(), "dd/MM/yyyy");
      const idade = calcularIdade(dados.paciente_nascimento);
      const textoCorpo = `Pelo presente documento, encaminhamos o(a) paciente ${dados.paciente_nome.toUpperCase()}, portador(a) do CPF ${dados.paciente_cpf}, nascido(a) em ${format(parseISO(dados.paciente_nascimento), "dd/MM/yyyy")} (${idade} anos de idade), com telefone de contato ${dados.paciente_telefone}, para fins de avaliação neuropsicológica especializada no Instituto SerClin.`;
      
      doc.setFontSize(12); doc.setFont("helvetica", "normal"); doc.setTextColor(0, 0, 0);
      doc.text(textoCorpo, 20, 95, { maxWidth: 170, align: "justify", lineHeightFactor: 1.5 });
      
      const textoResponsabilidade = `Este encaminhamento foi emitido em ${dataHoje} pelo aluno responsável ${dados.aluno_remetente.toUpperCase()}, sob a supervisão direta do(a) psicólogo(a) responsável ${dados.psicologo_responsavel.toUpperCase()}.`;
      doc.text(textoResponsabilidade, 20, 125, { maxWidth: 170, align: "justify", lineHeightFactor: 1.5 });

      doc.setDrawColor(0, 0, 0); doc.line(30, 180, 85, 180);
      doc.setFontSize(10); doc.text("Aluno(a) Remetente", 57.5, 185, { align: "center" });
      doc.line(125, 180, 180, 180); doc.text("Psicólogo(a) Supervisor(a)", 152.5, 185, { align: "center" });

      doc.addImage(qrCodeDataUrl, 'PNG', 87, 210, 30, 30);
      doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(100, 100, 100);
      doc.text("Escaneie o QR Code para validar a autenticidade deste documento:", 105, 245, { align: "center" });
      doc.setFont("helvetica", "bold"); doc.setTextColor(37, 99, 235);
      doc.text(urlValidacao, 105, 250, { align: "center" });
      
      doc.save(`Encaminhamento_SerClin_${dados.paciente_nome.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Erro no PDF:", error);
      toast.error("Erro ao gerar o PDF.");
    }
  };

  const handleExcluir = async (id: any) => {
    if (!isAdmin) {
      toast.error("Acesso negado.");
      return;
    }

    if (!window.confirm("Excluir este registro permanentemente?")) return;

    try {
      // 1. Deletar no Supabase
      const { error } = await supabase
        .from('encaminhamentos_unimeta')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 2. Atualização Otimista: Remove da tela imediatamente
      setEncaminhamentos(prev => prev.filter(enc => enc.id !== id));
      
      toast.success("Excluído com sucesso!");
    } catch (error: any) { 
      toast.error("Erro ao excluir: " + error.message); 
      fetchEncaminhamentos(); // Recarrega se der erro
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: valData, error: valError } = await supabase
        .from('validacoes')
        .insert([{ paciente_nome: form.paciente_nome, profissional_nome: form.psicologo_responsavel, tipo_documento: 'Encaminhamento Institucional' }])
        .select('id').single();
      if (valError) throw valError;
      const { error: encError } = await supabase.from('encaminhamentos_unimeta').insert([{ ...form, validacao_id: valData.id }]);
      if (encError) throw encError;
      toast.success("Salvo!");
      await gerarPDF(form, valData.id);
      setForm({ paciente_nome: '', paciente_cpf: '', paciente_telefone: '', paciente_nascimento: '', aluno_remetente: '', psicologo_responsavel: '' });
      fetchEncaminhamentos();
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 md:gap-4 justify-center w-full md:w-auto">
            <img src={logoSer2} alt="SerClin" className="h-14 md:h-20 object-contain" />
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-xl md:text-2xl font-black text-[#1e3a8a] uppercase tracking-tighter">Encaminhamentos</h1>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Instituto SerClin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
            <div className="bg-[#1e3a8a] p-4 text-white">
              <h2 className="font-black uppercase text-sm flex items-center gap-2 text-yellow-400"><Plus size={18}/> Novo Registro</h2>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Paciente</label>
                  <Input required value={form.paciente_nome} onChange={e => setForm({...form, paciente_nome: e.target.value})} className="bg-gray-50 border-none font-bold text-sm uppercase" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">CPF</label>
                    <Input required value={form.paciente_cpf} onChange={e => setForm({...form, paciente_cpf: aplicarMascaraCPF(e.target.value)})} className="bg-gray-50 border-none font-bold text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Telefone</label>
                    <Input required value={form.paciente_telefone} onChange={e => setForm({...form, paciente_telefone: aplicarMascaraTelefone(e.target.value)})} className="bg-gray-50 border-none font-bold text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Nascimento</label>
                    <Input required type="date" value={form.paciente_nascimento} onChange={e => setForm({...form, paciente_nascimento: e.target.value})} className="bg-gray-50 border-none font-bold text-sm text-gray-600" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Idade</label>
                    <Input disabled value={calcularIdade(form.paciente_nascimento) ? `${calcularIdade(form.paciente_nascimento)} anos` : ''} className="bg-gray-100 border-none font-black text-sm text-gray-500" />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 space-y-4 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Acadêmico Remetente</label>
                    <Input required value={form.aluno_remetente} onChange={e => setForm({...form, aluno_remetente: e.target.value})} className="bg-emerald-50 text-emerald-900 border-none font-bold text-sm uppercase" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Psicólogo Supervisor</label>
                    <Input required value={form.psicologo_responsavel} onChange={e => setForm({...form, psicologo_responsavel: e.target.value})} className="bg-blue-50 text-blue-900 border-none font-bold text-sm uppercase" />
                  </div>
                </div>
                <Button disabled={loading} type="submit" className="w-full bg-[#1e3a8a] hover:bg-black text-white font-bold h-13 rounded-xl uppercase text-xs shadow-lg mt-4">
                  {loading ? <RefreshCw className="animate-spin" /> : "Gerar Encaminhamento"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-black text-gray-800 uppercase text-sm tracking-widest">Histórico</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="p-4">Data</th>
                    <th className="p-4">Paciente</th>
                    <th className="p-4">Responsáveis</th>
                    {isAdmin && <th className="p-4 text-right">Ações</th>}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {encaminhamentos.map((enc) => (
                    <tr key={enc.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 font-black text-gray-600">{format(new Date(enc.criado_em), "dd/MM")}</td>
                      <td className="p-4 uppercase">
                        <p className="font-black text-gray-800">{enc.paciente_nome}</p>
                        <p className="text-[10px] font-bold text-gray-400 italic">CPF: {enc.paciente_cpf}</p>
                      </td>
                      <td className="p-4 text-[11px]">
                        <p className="font-bold text-gray-700 uppercase">Acadêmico: {enc.aluno_remetente}</p>
                        <p className="font-bold text-blue-500 uppercase">Supervisor: {enc.psicologo_responsavel}</p>
                      </td>
                      {isAdmin && (
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleExcluir(enc.id)} className="text-red-500 hover:bg-red-50 transition-all">
                            <Trash2 size={18} />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}