import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Activity, Brain, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import logoSer2 from '@/assets/ser2.png';

export function FormularioAlerta() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const companyId = searchParams.get('cid') || 'e3b0c442-98fc-4569-bdc0-mockcompanyid';
  const unidade = searchParams.get('unidade') || 'Geral';

  const [estresse, setEstresse] = useState<number>(3);
  const [sintomas, setSintomas] = useState({
    exaustao: false,
    foco: false,
    insonia: false,
  });

  const handleEnviarAlerta = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('alertas_sobrecarga').insert([
        {
          company_id: companyId,
          unidade_operacional: unidade,
          sintoma_exaustao_mental: sintomas.exaustao,
          sintoma_perda_foco: sintomas.foco,
          sintoma_insonia: sintomas.insonia,
          nivel_estresse_autoavaliado: estresse,
        },
      ]);

      if (error) throw error;

      setEnviado(true);
      toast.success('Mapeamento preventivo computado!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao transmitir indicadores de saúde.');
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center font-sans">
        <Card className="max-w-sm rounded-[2rem] border-none shadow-xl p-8 bg-white flex flex-col items-center">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-xl font-black uppercase text-slate-800 tracking-tight">
            Obrigado pela sua contribuição!
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
            Seus indicadores de sobrecarga foram enviados de forma segura e criptografada. O Instituto SerClin monitora os índices para salvaguardar a saúde coletiva da sua empresa.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="w-full mt-6 bg-purple-600 hover:bg-black font-black uppercase text-xs h-11 rounded-xl"
          >
            Voltar ao Início
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-left flex flex-col font-sans p-4 justify-center items-center">
      <Card className="w-full max-w-md rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
        <div className="p-6 bg-purple-50/50 border-b border-purple-100 flex items-center gap-3">
          <img src={logoSer2} className="w-10 h-10 object-contain" alt="SerClin" />
          <div>
            <h2 className="font-black uppercase text-sm tracking-wider text-[#1e3a8a]">
              Termômetro de Sobrecarga
            </h2>
            <p className="text-[10px] font-bold text-purple-600 uppercase mt-0.5">
              Check-in de Saúde Mental e Performance
            </p>
          </div>
        </div>

        <form onSubmit={handleEnviarAlerta} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Como você avalia seu nível de estresse hoje?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setEstresse(num)}
                  className={`h-12 rounded-xl font-black text-sm flex items-center justify-center transition-all border ${
                    estresse === num
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 px-1">
              <span>Tranquilo</span>
              <span>Extremo</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Sinalize se tem percebido algum destes sintomas com frequência:
            </label>

            <button
              type="button"
              onClick={() => setSintomas({ ...sintomas, exaustao: !sintomas.exaustao })}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                sintomas.exaustao ? 'border-purple-200 bg-purple-50/40' : 'border-slate-100 bg-slate-50/50'
              }`}
            >
              <div className={`p-2 rounded-xl border ${sintomas.exaustao ? 'bg-purple-600 text-white' : 'bg-white text-slate-400'}`}>
                <Brain size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-slate-800">Fadiga ou Exaustão Mental Crônica</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Sensação de esgotamento antes ou após o expediente</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSintomas({ ...sintomas, foco: !sintomas.foco })}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                sintomas.foco ? 'border-purple-200 bg-purple-50/40' : 'border-slate-100 bg-slate-50/50'
              }`}
            >
              <div className={`p-2 rounded-xl border ${sintomas.foco ? 'bg-purple-600 text-white' : 'bg-white text-slate-400'}`}>
                <ShieldAlert size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-slate-800">Oscilação de Foco e Atenção</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Dificuldade de concentração ou lapsos de memória recentes</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSintomas({ ...sintomas, insonia: !sintomas.insonia })}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                sintomas.insonia ? 'border-purple-200 bg-purple-50/40' : 'border-slate-100 bg-slate-50/50'
              }`}
            >
              <div className={`p-2 rounded-xl border ${sintomas.insonia ? 'bg-purple-600 text-white' : 'bg-white text-slate-400'}`}>
                <Activity size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-slate-800">Alteração ou Distúrbio do Sono</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Insônia frequente ou acordar com sensação de cansaço</p>
              </div>
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-black text-white font-black uppercase text-xs h-12 rounded-xl mt-4 shadow-md"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : 'Transmitir Indicadores Anonimamente'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default FormularioAlerta;
