export function dateFormat(date: Date | number | string): string {
  if (typeof date !== "object") date = new Date(date);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(date);
}

export function dateTimeFormat(date: Date | number | string): string {
  if (typeof date !== "object") date = new Date(date);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
