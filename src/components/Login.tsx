import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface LoginProps {
  setView: (view: string) => void;
}

export function Login({ setView }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Attempt login
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message || 'E-mail ou senha incorretos.');
      toast.error('Erro de autenticação: Verifique seus dados.');
      setLoading(false);
    } else {
      toast.success('Acesso autorizado! Bem-vindo(a).');
      // If correct, redirect to the dashboard view
      setView('acessos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans" id="login-viewport-container">
      <div 
        id="login-card-container" 
        className="w-full max-w-md shadow-2xl border-t-4 border-t-[#0a2d54] rounded-[2.5rem] bg-white text-left animate-in fade-in duration-500 overflow-hidden border border-gray-100"
      >
        <div className="p-8 pb-4 text-center space-y-3" id="login-header-block">
          <div className="mx-auto bg-blue-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-2 shadow-inner border border-blue-100" id="login-icon-box">
            <Lock className="w-10 h-10 text-[#0a2d54]" />
          </div>
          <h2 className="text-2xl font-black text-[#0a2d54] uppercase tracking-tight" id="login-card-title">
            Área Restrita SerClin
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Acesso exclusivo para profissionais e gestores</p>
        </div>
        <div className="p-8 pt-2" id="login-card-content">
          <form onSubmit={handleLogin} className="space-y-5" id="login-form-element">
            <div className="space-y-1.5" id="login-email-group">
              <label className="text-[10px] font-black text-gray-400 uppercase pl-1" htmlFor="login-email-input">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  id="login-email-input"
                  type="email" 
                  placeholder="EX: helenara@institutoserclin.com" 
                  className="pl-11 h-12 bg-white border border-gray-200 shadow-sm rounded-xl font-bold uppercase text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1.5" id="login-password-group">
              <label className="text-[10px] font-black text-gray-400 uppercase pl-1" htmlFor="login-password-input">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  id="login-password-input"
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-11 h-12 bg-white border border-gray-200 shadow-sm rounded-xl font-bold text-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-xs text-center font-bold uppercase bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse" id="login-error-alert">
                {error}
              </div>
            )}

            <Button 
              id="login-submit-button"
              type="submit" 
              className="w-full bg-[#0a2d54] hover:bg-[#bfa571] text-white rounded-2xl h-12 font-black uppercase text-xs shadow-lg transition-all border-none cursor-pointer flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Verificando...
                </>
              ) : 'Entrar no Sistema'}
            </Button>
            
            <div className="text-center mt-6" id="login-back-button-box">
              <Button 
                id="login-back-btn"
                variant="ghost" 
                onClick={() => setView('home')} 
                className="text-gray-400 hover:text-gray-600 rounded-xl font-black uppercase text-[10px] gap-2 cursor-pointer"
              >
                <ArrowLeft size={14} /> Voltar ao site principal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
