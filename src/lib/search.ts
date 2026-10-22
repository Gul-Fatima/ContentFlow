export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

export function matchesQuery(
  query: string,
  fields: (string | undefined)[]
): boolean {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (terms.length === 0) return true;
  const searchableText = normalize(fields.filter(Boolean).join(' '));
  return terms.every((term) => searchableText.includes(term));
}

export function filterBySearch<T>(
  items: T[],
  query: string,
  getFields: (item: T) => (string | undefined)[]
): T[] {
  return items.filter((item) => matchesQuery(query, getFields(item)));
}
