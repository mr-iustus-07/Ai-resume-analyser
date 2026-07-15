export const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

export const normalizeLine = (value: string): string =>
  value.replace(/\u2022/g, '•').replace(/\t/g, ' ').replace(/\s+/g, ' ').trim();

export const normalizeBlockLines = (lines: string[]): string[] =>
  lines.map((line) => normalizeLine(line)).filter(Boolean);

export const toTitleCase = (value: string): string =>
  normalizeWhitespace(value)
    .toLowerCase()
    .split(' ')
    .map((part) => (part ? `${part[0]!.toUpperCase()}${part.slice(1)}` : part))
    .join(' ')
    .trim();

export const uniqueByNormalizedKey = (items: string[]): string[] => {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const item of items) {
    const normalized = normalizeWhitespace(item).toLowerCase();
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    unique.push(item.trim());
  }

  return unique;
};
