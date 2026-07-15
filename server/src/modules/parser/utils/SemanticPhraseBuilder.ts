import { normalizeWhitespace, toTitleCase } from '../normalizers/TextNormalizer.js';

const BULLET_PREFIX = /^[-*•]\s*/;

const normalizeLine = (line: string): string => normalizeWhitespace(line.replace(BULLET_PREFIX, ''));

const isBoundaryLine = (line: string): boolean => {
  const normalized = normalizeLine(line);
  if (!normalized) return true;
  return /^[\-|]+$/.test(normalized) || normalized === '|';
};

const isConnectorToken = (token: string): boolean => /^(of|and|for|to|in|on|with|the|a|an)$/i.test(token);

const looksLikeDateToken = (line: string): boolean =>
  /\b(19|20)\d{2}\b/.test(line) || /\b(present|current)\b/i.test(line);

const looksLikeUrlToken = (line: string): boolean => /^https?:\/\//i.test(line);

export const splitSemanticBlocks = (lines: string[]): string[][] => {
  const blocks: string[][] = [];
  let current: string[] = [];

  lines.forEach((raw) => {
    const line = normalizeLine(raw);
    if (!line || isBoundaryLine(line)) {
      if (current.length) {
        blocks.push(current);
        current = [];
      }
      return;
    }

    current.push(line);
  });

  if (current.length) {
    blocks.push(current);
  }

  return blocks;
};

export const mergeFragmentedPhrase = (tokens: string[]): string => {
  const cleaned = tokens.map((token) => normalizeLine(token)).filter(Boolean);
  if (!cleaned.length) return '';

  const merged = cleaned.join(' ');
  return normalizeWhitespace(merged);
};

export const mergeTokenLines = (lines: string[]): string[] => {
  const result: string[] = [];
  let buffer: string[] = [];

  const flush = (): void => {
    if (!buffer.length) return;
    result.push(mergeFragmentedPhrase(buffer));
    buffer = [];
  };

  for (const raw of lines) {
    const line = normalizeLine(raw);
    if (!line) {
      flush();
      continue;
    }

    const singleWord = line.split(/\s+/).length === 1;
    if (singleWord || isConnectorToken(line) || looksLikeDateToken(line) || looksLikeUrlToken(line)) {
      buffer.push(line);
      continue;
    }

    if (buffer.length) {
      buffer.push(line);
      flush();
    } else {
      result.push(line);
    }
  }

  flush();
  return result.map((entry) => normalizeWhitespace(entry)).filter(Boolean);
};

export const uniqueOrdered = (values: string[]): string[] => {
  const seen = new Set<string>();
  const ordered: string[] = [];
  values.forEach((value) => {
    const normalized = normalizeWhitespace(value).toLowerCase();
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    ordered.push(normalizeWhitespace(value));
  });
  return ordered;
};

export const titleCaseArray = (values: string[]): string[] => values.map((value) => toTitleCase(value));
