import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Loader2, ArrowLeft, ShieldCheck, UserCheck, KeyRound } from "lucide-react";
import logoSerClin from "@/assets/logo-serclin.png";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Tenta fazer login no Supabase
      const { error: supaError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supaError) {
        if (supaError.status === 401 || supaError.message?.includes('Invalid login')) {
          setError('Credenciais não encontradas ou inválidas no Supabase.');
        } else {
          setError(supaError.message || 'Erro ao conectar com o serviço de autenticação.');
        }
        setLoading(false);
      } else {
        localStorage.removeItem('serclin_demo_session');
        window.dispatchEvent(new Event('storage'));
        navigate('/sistema');
      }
    } catch (err: any) {
      setError('Falha de conexão com o banco de dados.');
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'admin' | 'profissional' | 'secretaria' = 'admin', customEmail?: string) => {
    const demoEmail = customEmail || email || (role === 'admin' ? 'romulochaves77@gmail.com' : 'profissional@serclin.com.br');
    const demoData = {
      email: demoEmail,
      role: role,
      name: role === 'admin' ? 'Gestor SerClin' : 'Profissional SerClin'
    };
    localStorage.setItem('serclin_demo_session', JSON.stringify(demoData));
    window.dispatchEvent(new Event('storage'));
    navigate('/sistema');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-[#D4A017] rounded-3xl overflow-hidden bg-white">
        <CardHeader className="text-center space-y-3 pt-8 pb-4">
          <div className="flex justify-center mb-1">
            <img 
              src={logoSerClin} 
              alt="Instituto SerClin" 
              className="h-16 object-contain" 
            />
          </div>
          <CardTitle className="text-2xl font-serif font-bold text-[#0D4F5C]">
            Área Restrita SerClin
          </CardTitle>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Acesso ao Sistema Clínico & Prontuários
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-8 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="email" 
                  placeholder="seu.email@institutoserclin.com" 
                  className="pl-10 h-11 text-sm border-slate-200 rounded-xl font-medium focus:border-[#0D4F5C]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-11 text-sm border-slate-200 rounded-xl font-medium focus:border-[#0D4F5C]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="space-y-2 bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-900">
                <p className="font-semibold flex items-center gap-1.5 text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{error}</span>
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Para fins de teste e navegação no painel, você pode entrar diretamente com o modo demonstrativo.
                </p>
                <Button 
                  type="button" 
                  onClick={() => handleDemoLogin('admin')}
                  className="w-full bg-[#D4A017] hover:bg-[#c29213] text-[#0A2329] font-bold h-9 text-xs uppercase tracking-wider rounded-xl shadow-xs"
                >
                  Entrar como Gestor (Modo Teste)
                </Button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#0D4F5C] hover:bg-[#093D47] text-white font-bold h-12 text-sm uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#D4A017]" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </Button>
          </form>

          {/* ACESSO RÁPIDO PARA TESTES */}
          <div className="pt-3 border-t border-slate-200/80 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              Opções de Acesso Rápido
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                className="h-10 text-xs font-semibold text-[#0D4F5C] border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>Gestor / Admin</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('profissional')}
                className="h-10 text-xs font-semibold text-[#0D4F5C] border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Profissional</span>
              </Button>
            </div>
          </div>

          <div className="text-center pt-2">
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-slate-500 hover:text-slate-800 text-xs gap-1.5 font-medium"
            >
              <ArrowLeft size={14} /> Voltar para a página inicial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}