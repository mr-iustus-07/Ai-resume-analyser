import { normalizeWhitespace } from './TextNormalizer.js';

export const normalizePhone = (value: string): string => {
  const cleaned = normalizeWhitespace(value);
  const hasPlus = cleaned.startsWith('+');
  const digitsOnly = cleaned.replace(/\D/g, '');

  if (!digitsOnly) return '';

  if (hasPlus) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  if (digitsOnly.length > 10) {
    return `+${digitsOnly}`;
  }

  return digitsOnly;
};
