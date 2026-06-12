export function formatCurrency(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Simple clsx-like fallback if needed
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
