import { normalizeWhitespace, toTitleCase, uniqueByNormalizedKey } from '../normalizers/TextNormalizer.js';

type LanguageExtractionInput = {
  lines: string[];
};

export const extractLanguages = ({ lines }: LanguageExtractionInput): string[] => {
  const flattened = lines
    .flatMap((line) => line.split(/[•,|]/g))
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean)
    .map((item) => toTitleCase(item));

  return uniqueByNormalizedKey(flattened);
};
