import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, ShieldCheck, Calendar, User, Stethoscope, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button"; // <--- Adicionado para o botão
import logoSer2 from "@/assets/ser2.png";

export function Validar() {
  const { id } = useParams();
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    async function verificarAutenticidade() {
      if (!id) {
        setStatus('invalid');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('validacoes')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          setStatus('invalid');
        } else {
          setDados(data);
          setStatus('valid');
        }
      } catch (err) {
        setStatus('invalid');
      }
    }

    verificarAutenticidade();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      {/* LOGO INSTITUCIONAL */}
      <img src={logoSer2} className="h-24 mb-8 object-contain" alt="Instituto SerClin" />
      
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-gray-100 relative overflow-hidden">
        {/* BARRA DE TOPO DECORATIVA */}
        <div className={`absolute top-0 left-0 w-full h-2 ${status === 'valid' ? 'bg-emerald-500' : status === 'invalid' ? 'bg-red-500' : 'bg-[#1e3a8a]'}`}></div>

        {status === 'loading' && (
          <div className="py-10 space-y-4">
            <RefreshCw className="animate-spin text-[#1e3a8a] mx-auto" size={40} />
            <p className="font-black text-[#1e3a8a] uppercase text-xs tracking-widest">Verificando Assinatura Digital...</p>
          </div>
        )}
        
        {status === 'valid' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <CheckCircle size={64} className="text-emerald-500 mx-auto" />
            
            <div>
              <h1 className="text-xl font-black text-[#1e3a8a] uppercase leading-none">Documento Autêntico</h1>
              <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2 tracking-widest">Validado pelo Instituto SerClin</p>
            </div>

            <div className="space-y-3 text-left bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div className="flex items-start gap-3">
                <User size={16} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">Paciente</p>
                  <p className="text-sm font-black text-gray-800 uppercase">{dados.paciente_nome}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Stethoscope size={16} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">Profissional Responsável</p>
                  <p className="text-sm font-black text-gray-800 uppercase">{dados.profissional_nome}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">Data de Emissão</p>
                  <p className="text-sm font-black text-gray-800 uppercase">
                    {new Date(dados.data_emissao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* BOTÃO PARA VISUALIZAR O PDF ORIGINAL SE EXISTIR */}
            {dados.arquivo_url && (
              <Button 
                onClick={() => window.open(dados.arquivo_url, '_blank')} 
                className="w-full bg-[#1e3a8a] hover:bg-black text-white rounded-2xl h-14 font-black uppercase text-xs shadow-lg transition-all"
              >
                <FileText className="mr-2" size={18} /> Ver Documento Original
              </Button>
            )}

            <p className="text-[10px] text-gray-400 leading-relaxed italic px-2">
              Este documento foi emitido eletronicamente e possui validade jurídica em todo território nacional.
            </p>
          </div>
        )}

        {status === 'invalid' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <XCircle size={64} className="text-red-500 mx-auto" />
            <div>
              <h1 className="text-xl font-black text-red-600 uppercase leading-none">Documento Inválido</h1>
              <p className="text-[10px] text-red-400 font-bold uppercase mt-2 tracking-widest">Falha na Verificação</p>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed px-4">
              O código de validação consultado não foi encontrado em nossa base de dados ou foi revogado por inconsistências.
            </p>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Dúvidas? Entre em contato:</p>
              <p className="text-xs font-black text-[#1e3a8a] mt-1">contato@institutoserclin.com</p>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-10 flex items-center gap-2 opacity-40">
        <ShieldCheck size={16} className="text-[#1e3a8a]" />
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
          SerClin Autenticidade Digital &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}