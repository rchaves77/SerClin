import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { RefreshCw } from "lucide-react";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // 1. Verifica a sessão atual ao carregar
    const checkInitialSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(!!currentSession);
    };

    checkInitialSession();

    // 2. Escuta mudanças na autenticação em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(!!currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // TELA DE CARREGAMENTO COM IDENTIDADE SERCLIN
  if (session === null) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white">
        <RefreshCw className="h-10 w-10 animate-spin text-[#1e3a8a] mb-4" />
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
          Verificando Segurança SerClin...
        </p>
      </div>
    );
  }

  // Se não tem sessão, manda pro login, mas avisa de onde o usuário tentou vir
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se tem sessão, libera o acesso
  return <>{children}</>;
}