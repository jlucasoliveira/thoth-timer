export function getPagination(
  page?: string | number | null,
  size = 10,
): [number, number] {
  if (typeof page === "string") page = Number(page);
  if (typeof page !== "number" && !page) page = 1;

  const from = size * (page - 1);
  const to = from + size - 1;

  return [from, to];
}

export function getPages(count?: number | null, size = 10) {
  if (typeof count !== "number") count = 0;

  return Math.ceil(count / size);
}
