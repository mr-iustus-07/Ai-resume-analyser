import { normalizeDateRange } from '../normalizers/DateNormalizer.js';
import { normalizeWhitespace } from '../normalizers/TextNormalizer.js';
import { REGEX_LIBRARY } from '../utils/RegexLibrary.js';
import type { ResumeCertificationItem } from '../parser.types.js';

type CertificationExtractionInput = {
  lines: string[];
};

const parseCertificationLine = (line: string): ResumeCertificationItem => {
  const normalized = normalizeWhitespace(line);
  const dateMatch = normalized.match(REGEX_LIBRARY.dateRange)?.[0] ?? '';
  const normalizedDate = dateMatch ? normalizeDateRange(dateMatch) : { startDate: '', endDate: '' };
  const segments = normalized.split('|').map((segment) => segment.trim()).filter(Boolean);

  return {
    name: segments[0] ?? normalized,
    issuer: segments[1] ?? '',
    issuedDate: normalizedDate.startDate,
    expiryDate: normalizedDate.endDate,
    credentialId: '',
  };
};

export const extractCertifications = ({
  lines,
}: CertificationExtractionInput): ResumeCertificationItem[] =>
  lines.filter(Boolean).map((line) => parseCertificationLine(line));
