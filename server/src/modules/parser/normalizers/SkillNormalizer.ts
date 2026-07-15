import { normalizeWhitespace, toTitleCase, uniqueByNormalizedKey } from './TextNormalizer.js';

const LOWER_KEEP = new Set([
  'javascript',
  'typescript',
  'node.js',
  'react',
  'next.js',
  'express',
  'postgresql',
  'mongodb',
  'mysql',
  'redis',
  'aws',
  'gcp',
  'azure',
  'ci/cd',
  'html',
  'css',
  'sql',
  'nosql',
  'api',
  'rest',
  'graphql',
]);

const normalizeSingleSkill = (skill: string): string => {
  const cleaned = normalizeWhitespace(skill).replace(/^[•\-*]\s*/, '');
  if (!cleaned) return '';
  const lower = cleaned.toLowerCase();
  if (LOWER_KEEP.has(lower)) {
    if (lower === 'node.js') return 'Node.js';
    if (lower === 'next.js') return 'Next.js';
    if (lower === 'ci/cd') return 'CI/CD';
    if (lower === 'gcp') return 'GCP';
    if (lower === 'aws') return 'AWS';
    if (lower === 'api') return 'API';
    if (lower === 'rest') return 'REST';
    return lower.toUpperCase() === lower ? lower : lower[0]!.toUpperCase() + lower.slice(1);
  }
  return toTitleCase(cleaned);
};

export const normalizeSkills = (skills: string[]): string[] => {
  const normalized = skills.map((skill) => normalizeSingleSkill(skill)).filter(Boolean);
  return uniqueByNormalizedKey(normalized);
};

export const splitSkillsFromLines = (lines: string[]): string[] =>
  lines
    .flatMap((line) => line.split(/[•,|/]/g))
    .map((item) => normalizeWhitespace(item))
    .filter((item) => item.length > 1);
