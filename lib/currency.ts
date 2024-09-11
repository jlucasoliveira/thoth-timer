export function currencyFormat(value?: number | null): string {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value ?? 0);
}
