import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function usePerfil() {
  const [perfil, setPerfil] = useState<{role: string, email: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPerfil() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // --- A MÁGICA ESTÁ AQUI ---
          // Trocamos 'id' por 'email' e single() por maybeSingle() para matar o Erro 406
          const { data, error } = await supabase
            .from('perfis')
            .select('role, email') 
            .eq('email', user.email) 
            .maybeSingle();

          if (!error && data) {
            // Normaliza o conteúdo da coluna 'role'
            const roleBruta = data.role || 'profissional';
            const roleLimpa = roleBruta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            
            setPerfil({
              role: roleLimpa,
              email: data.email?.toLowerCase() || user.email?.toLowerCase() || ''
            });
          } else {
            // Caso não encontre o perfil, define como profissional por segurança
            setPerfil({ role: 'profissional', email: user.email?.toLowerCase() || '' });
          }
        } else {
          setPerfil(null);
        }
      } catch (err) {
        console.error("Erro SerClin Perfil:", err);
      } finally {
        setLoading(false);
      }
    }
    getPerfil();
  }, []);

  const role = perfil?.role || 'profissional';
  const email = perfil?.email || '';

  // Regras de permissão baseadas na coluna 'role' do banco
  const isAdmin = role === 'admin' || email === 'romulochaves77@gmail.com' || email === 'nahpsicologiachaves@gmail.com';
  const isSecretaria = role === 'secretaria' || role.includes('recep');
  
  return { 
    role, 
    loading, 
    isAdmin,
    isSecretaria,
    isGestorSeguro: isAdmin || isSecretaria 
  };
}