import { normalizeWhitespace } from './TextNormalizer.js';

const monthMap: Record<string, string> = {
  january: '01',
  jan: '01',
  february: '02',
  feb: '02',
  march: '03',
  mar: '03',
  april: '04',
  apr: '04',
  may: '05',
  june: '06',
  jun: '06',
  july: '07',
  jul: '07',
  august: '08',
  aug: '08',
  september: '09',
  sep: '09',
  sept: '09',
  october: '10',
  oct: '10',
  november: '11',
  nov: '11',
  december: '12',
  dec: '12',
};

const normalizeMonthYear = (value: string): string => {
  const cleaned = normalizeWhitespace(value).replace(/[.,]/g, '');
  const presentLike = /^(present|current|now)$/i.test(cleaned);
  if (presentLike) return 'Present';

  const mmYYYY = cleaned.match(/^(\d{1,2})\/(\d{4})$/);
  if (mmYYYY) {
    const mm = mmYYYY[1]!.padStart(2, '0');
    return `${mm}/${mmYYYY[2]}`;
  }

  const monthYear = cleaned.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const month = monthMap[monthYear[1]!.toLowerCase()];
    if (month) return `${month}/${monthYear[2]}`;
  }

  const yearOnly = cleaned.match(/^\d{4}$/);
  if (yearOnly) return cleaned;

  return cleaned;
};

export const normalizeDate = (value: string): string => normalizeMonthYear(value);

export const normalizeDateRange = (
  value: string,
): {
  startDate: string;
  endDate: string;
} => {
  const cleaned = normalizeWhitespace(value).replace(/\s*(–|—|to)\s*/gi, ' - ');
  const parts = cleaned.split(' - ').map((part) => part.trim()).filter(Boolean);

  if (parts.length >= 2) {
    return {
      startDate: normalizeDate(parts[0]!),
      endDate: normalizeDate(parts[1]!),
    };
  }

  return {
    startDate: normalizeDate(cleaned),
    endDate: '',
  };
};
