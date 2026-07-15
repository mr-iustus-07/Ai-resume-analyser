import { normalizeDateRange } from '../normalizers/DateNormalizer.js';
import { normalizeWhitespace } from '../normalizers/TextNormalizer.js';
import type { ResumeEducationItem } from '../parser.types.js';
import {
  mergeFragmentedPhrase,
  mergeTokenLines,
  splitSemanticBlocks,
} from '../utils/SemanticPhraseBuilder.js';
import { REGEX_LIBRARY } from '../utils/RegexLibrary.js';

type EducationExtractionInput = {
  lines: string[];
};

const DEGREE_HINTS =
  /(b\.?tech|m\.?tech|bachelor|master|phd|b\.?e|m\.?e|mba|bsc|msc|bs|ms|diploma|associate)/i;

const FIELD_HINTS =
  /(computer science|information technology|engineering|business|management|mathematics|physics|chemistry|economics|data science|artificial intelligence)/i;

const INSTITUTION_HINTS =
  /(university|college|institute|school|academy|polytechnic)/i;

const extractDate = (text: string): { startDate: string; endDate: string } => {
  const dateMatch = text.match(REGEX_LIBRARY.dateRange)?.[0] ?? '';
  return dateMatch ? normalizeDateRange(dateMatch) : { startDate: '', endDate: '' };
};

const extractGpa = (text: string): string => text.match(REGEX_LIBRARY.gpa)?.[0] ?? '';

const parseEducationBlock = (block: string[]): ResumeEducationItem | null => {
  const compact = mergeTokenLines(block);
  if (!compact.length) return null;

  const joined = mergeFragmentedPhrase(compact);
  const { startDate, endDate } = extractDate(joined);
  const gpa = extractGpa(joined);

  const separatorIndex = compact.findIndex((line) => line === '-');

  let left = compact;
  let right: string[] = [];
  if (separatorIndex >= 0) {
    left = compact.slice(0, separatorIndex);
    right = compact.slice(separatorIndex + 1);
  } else {
    const hintIndex = compact.findIndex((line) => INSTITUTION_HINTS.test(line));
    if (hintIndex > 0) {
      left = compact.slice(0, hintIndex);
      right = compact.slice(hintIndex);
    }
  }

  const degreeFieldCandidate = normalizeWhitespace(left.join(' '));
  const institutionCandidate = normalizeWhitespace(right.join(' '));

  const degree = DEGREE_HINTS.test(degreeFieldCandidate) ? degreeFieldCandidate : '';
  const field = FIELD_HINTS.test(degreeFieldCandidate) ? degreeFieldCandidate : '';
  const institution = institutionCandidate || compact.find((line) => INSTITUTION_HINTS.test(line)) || compact[0];

  return {
    institution: normalizeWhitespace(institution ?? ''),
    degree: normalizeWhitespace(degree),
    field: degree && field && degree !== field ? field : '',
    startDate,
    endDate,
    description: gpa,
  };
};

export const extractEducation = ({ lines }: EducationExtractionInput): ResumeEducationItem[] => {
  const blocks = splitSemanticBlocks(lines);
  return blocks.map((block) => parseEducationBlock(block)).filter((item): item is ResumeEducationItem => Boolean(item));
};
