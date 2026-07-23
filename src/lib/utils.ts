import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Função para combinar classes do Tailwind (MANTIDA)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- ADICIONE ESTA FUNÇÃO PARA CORRIGIR A TELA BRANCA ---
export function formatCurrency(value: number | string) {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(amount)) return "R$ 0,00";

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}