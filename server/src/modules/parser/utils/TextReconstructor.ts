import { normalizeLine, normalizeWhitespace, toTitleCase } from '../normalizers/TextNormalizer.js';
import { headingAliases } from './HeadingDetector.js';

const US_STATE_CODE = /^[A-Z]{2}$/;
const WORD_TOKEN = /^[A-Za-z][A-Za-z.'-]*$/;
const EMAIL_TOKEN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const URL_TOKEN = /^https?:\/\/[^\s]+$/i;
const PHONE_FRAGMENT = /^(\+?\d[\d\s().-]*)$/;

type LineType =
  | 'heading'
  | 'email'
  | 'url'
  | 'phone'
  | 'listItem'
  | 'paragraphFragment'
  | 'empty'
  | 'other';

const normalizeHeadingCandidate = (line: string): string =>
  normalizeLine(line)
    .toLowerCase()
    .replace(/[:\-|]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const knownHeadingSet = new Set(
  Object.values(headingAliases)
    .flatMap((aliases) => aliases)
    .map((alias) => normalizeHeadingCandidate(alias)),
);

const isHeading = (line: string): boolean => {
  const candidate = normalizeHeadingCandidate(line);
  if (!candidate) return false;
  if (knownHeadingSet.has(candidate)) return true;
  return false;
};

const isLikelyNameToken = (line: string): boolean => {
  const value = normalizeLine(line);
  if (!value || value.length > 30) return false;
  if (/[0-9@:/]/.test(value)) return false;
  if (!WORD_TOKEN.test(value)) return false;
  return value === value.toUpperCase() || value === toTitleCase(value);
};

const isLikelyListItem = (line: string): boolean => {
  const value = normalizeLine(line);
  if (!value) return false;
  if (isHeading(value) || EMAIL_TOKEN.test(value) || URL_TOKEN.test(value)) return false;
  if (PHONE_FRAGMENT.test(value) && /\d/.test(value)) return false;
  if (value.length > 32) return false;
  if (/[.!?]$/.test(value)) return false;
  return true;
};

const classifyLine = (line: string): LineType => {
  const value = normalizeLine(line);
  if (!value) return 'empty';
  if (isHeading(value)) return 'heading';
  if (EMAIL_TOKEN.test(value)) return 'email';
  if (URL_TOKEN.test(value)) return 'url';
  if (PHONE_FRAGMENT.test(value) && /\d/.test(value)) return 'phone';
  if (isLikelyListItem(value)) return 'listItem';
  if (value.length <= 80) return 'paragraphFragment';
  return 'other';
};

const mergeName = (lines: string[]): { merged: string; consumed: number } | null => {
  if (lines.length < 2) return null;
  const a = normalizeLine(lines[0] ?? '');
  const b = normalizeLine(lines[1] ?? '');
  if (!isLikelyNameToken(a) || !isLikelyNameToken(b)) return null;
  return { merged: toTitleCase(`${a} ${b}`), consumed: 2 };
};

const mergeLocation = (lines: string[]): { merged: string; consumed: number } | null => {
  if (lines.length < 3) return null;
  const cityA = normalizeLine(lines[0] ?? '');
  const cityB = normalizeLine(lines[1] ?? '');
  const state = normalizeLine(lines[2] ?? '');

  if (
    cityA &&
    cityB &&
    US_STATE_CODE.test(state.toUpperCase()) &&
    WORD_TOKEN.test(cityA) &&
    WORD_TOKEN.test(cityB)
  ) {
    return { merged: `${toTitleCase(cityA)} ${toTitleCase(cityB)}, ${state.toUpperCase()}`, consumed: 3 };
  }

  return null;
};

const mergePhone = (lines: string[]): { merged: string; consumed: number } | null => {
  if (lines.length < 3) return null;
  const a = normalizeLine(lines[0] ?? '');
  const b = normalizeLine(lines[1] ?? '');
  const c = normalizeLine(lines[2] ?? '');

  if (!PHONE_FRAGMENT.test(a) || !PHONE_FRAGMENT.test(b) || !PHONE_FRAGMENT.test(c)) return null;
  if (!/\d/.test(`${a}${b}${c}`)) return null;

  const merged = normalizeWhitespace(`${a} ${b} ${c}`);
  return { merged, consumed: 3 };
};

const mergeParagraphFragments = (lines: string[], start: number): { merged: string; consumed: number } | null => {
  const parts: string[] = [];
  let i = start;

  while (i < lines.length) {
    const current = normalizeLine(lines[i] ?? '');
    if (!current) break;

    const kind = classifyLine(current);
    if (kind === 'heading' || kind === 'email' || kind === 'url' || kind === 'phone') break;
    if (isLikelyListItem(current) && parts.length > 0) break;

    parts.push(current);
    if (/[.!?]$/.test(current)) {
      i += 1;
      break;
    }
    i += 1;

    if (parts.length >= 12) break;
  }

  if (parts.length <= 1) return null;

  return {
    merged: normalizeWhitespace(parts.join(' ')),
    consumed: parts.length,
  };
};

const reconstructWithinSection = (lines: string[], sectionName: string): string[] => {
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const current = normalizeLine(lines[i] ?? '');
    if (!current) {
      i += 1;
      continue;
    }

    if (sectionName === 'header') {
      const mergedName = mergeName(lines.slice(i, i + 3));
      if (mergedName) {
        out.push(mergedName.merged);
        i += mergedName.consumed;
        continue;
      }

      const mergedPhone = mergePhone(lines.slice(i, i + 4));
      if (mergedPhone) {
        out.push(mergedPhone.merged);
        i += mergedPhone.consumed;
        continue;
      }

      const mergedLocation = mergeLocation(lines.slice(i, i + 4));
      if (mergedLocation) {
        out.push(mergedLocation.merged);
        i += mergedLocation.consumed;
        continue;
      }
    }

    if (sectionName === 'summary') {
      const paragraph = mergeParagraphFragments(lines, i);
      if (paragraph) {
        out.push(paragraph.merged);
        i += paragraph.consumed;
        continue;
      }
    }

    if (sectionName === 'skills') {
      out.push(current);
      i += 1;
      continue;
    }

    if (sectionName === 'education' || sectionName === 'experience' || sectionName === 'projects') {
      const paragraph = mergeParagraphFragments(lines, i);
      if (paragraph) {
        out.push(paragraph.merged);
        i += paragraph.consumed;
        continue;
      }
    }

    out.push(current);
    i += 1;
  }

  return out;
};

type SectionBlock = { heading: string; key: string; lines: string[] };

const resolveSectionKey = (headingLine: string): string => {
  const candidate = normalizeHeadingCandidate(headingLine);
  for (const [section, aliases] of Object.entries(headingAliases)) {
    if (aliases.some((alias) => normalizeHeadingCandidate(alias) === candidate)) {
      return section;
    }
  }
  return 'header';
};

export const reconstructResumeText = (rawText: string): string => {
  const baseLines = rawText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => normalizeLine(line));

  const blocks: SectionBlock[] = [];
  let current: SectionBlock = { heading: '', key: 'header', lines: [] };

  for (const rawLine of baseLines) {
    const line = normalizeLine(rawLine);
    if (!line) continue;

    if (isHeading(line)) {
      blocks.push(current);
      current = { heading: line, key: resolveSectionKey(line), lines: [] };
      continue;
    }

    current.lines.push(line);
  }
  blocks.push(current);

  const reconstructed: string[] = [];

  for (const block of blocks) {
    const sectionName = block.key;
    const mergedLines = reconstructWithinSection(block.lines, sectionName);

    if (block.heading) {
      reconstructed.push(block.heading.toUpperCase());
    }

    for (const line of mergedLines) {
      reconstructed.push(normalizeWhitespace(line));
    }
  }

  return reconstructed.filter(Boolean).join('\n').trim();
};
