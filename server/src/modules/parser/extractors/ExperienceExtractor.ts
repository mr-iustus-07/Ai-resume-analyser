import { normalizeDateRange } from '../normalizers/DateNormalizer.js';
import { normalizeWhitespace } from '../normalizers/TextNormalizer.js';
import type { ResumeExperienceItem } from '../parser.types.js';
import {
  mergeFragmentedPhrase,
  mergeTokenLines,
  splitSemanticBlocks,
} from '../utils/SemanticPhraseBuilder.js';
import { REGEX_LIBRARY } from '../utils/RegexLibrary.js';

type ExperienceExtractionInput = {
  lines: string[];
};

const TITLE_HINTS =
  /(engineer|developer|manager|lead|architect|intern|analyst|consultant|specialist|administrator|director|designer)/i;

const LOCATION_HINTS =
  /(remote|hybrid|onsite|on-site|[A-Za-z]+\s*,\s*[A-Z]{2}\b|[A-Za-z]+\s+[A-Z]{2}\b)/i;

const extractDate = (text: string): { startDate: string; endDate: string } => {
  const dateMatch = text.match(REGEX_LIBRARY.dateRange)?.[0] ?? '';
  return dateMatch ? normalizeDateRange(dateMatch) : { startDate: '', endDate: '' };
};

const parseExperienceBlock = (block: string[]): ResumeExperienceItem | null => {
  const compact = mergeTokenLines(block);
  if (!compact.length) return null;

  const joined = mergeFragmentedPhrase(compact);
  const { startDate, endDate } = extractDate(joined);

  const separatorIndex = compact.findIndex((line) => line === '-');
  let left = compact;
  let right: string[] = [];

  if (separatorIndex >= 0) {
    left = compact.slice(0, separatorIndex);
    right = compact.slice(separatorIndex + 1);
  } else if (compact.length >= 2) {
    left = [compact[0] ?? ''];
    right = compact.slice(1);
  }

  let title = normalizeWhitespace(left.join(' '));
  let company = normalizeWhitespace(right.join(' '));
  if (!TITLE_HINTS.test(title) && TITLE_HINTS.test(company)) {
    const swap = title;
    title = company;
    company = swap;
  }

  const location =
    compact.find((line) => LOCATION_HINTS.test(line)) ??
    (joined.match(REGEX_LIBRARY.location)?.[0] ?? '');

  const descriptionLines = compact.filter(
    (line) =>
      line !== '-' &&
      !line.includes(title) &&
      !line.includes(company) &&
      !line.includes(startDate) &&
      !line.includes(endDate),
  );

  return {
    company: normalizeWhitespace(company),
    title: normalizeWhitespace(title),
    startDate,
    endDate,
    location: normalizeWhitespace(location),
    description: normalizeWhitespace(descriptionLines.join(' ')),
  };
};

export const extractExperience = ({ lines }: ExperienceExtractionInput): ResumeExperienceItem[] => {
  const blocks = splitSemanticBlocks(lines);
  return blocks.map((block) => parseExperienceBlock(block)).filter((item): item is ResumeExperienceItem => Boolean(item));
};
