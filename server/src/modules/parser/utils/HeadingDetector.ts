import { normalizeLine, normalizeWhitespace } from '../normalizers/TextNormalizer.js';

const SECTION_ALIASES: Record<string, string[]> = {
  summary: [
    'summary',
    'professional summary',
    'profile',
    'career objective',
    'objective',
    'about',
  ],
  skills: [
    'skills',
    'technical skills',
    'core skills',
    'competencies',
    'core competencies',
    'technology stack',
    'tech stack',
    'soft skills',
  ],
  education: ['education', 'academic background', 'qualifications', 'education history'],
  experience: [
    'experience',
    'work experience',
    'professional experience',
    'employment',
    'employment history',
    'career history',
  ],
  projects: ['projects', 'project experience', 'academic projects', 'personal projects'],
  certifications: ['certifications', 'licenses', 'licences', 'credentials'],
  languages: ['languages', 'language proficiency'],
  achievements: ['achievements', 'awards', 'accomplishments', 'honors', 'honours'],
};

export type ParsedSections = Record<
  | 'header'
  | 'summary'
  | 'skills'
  | 'education'
  | 'experience'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'achievements',
  string[]
>;

const createEmptySections = (): ParsedSections => ({
  header: [],
  summary: [],
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
});

const normalizeHeadingCandidate = (line: string): string =>
  normalizeLine(line)
    .toLowerCase()
    .replace(/[:\-|]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const resolveSectionHeading = (line: string): keyof ParsedSections | null => {
  const candidate = normalizeHeadingCandidate(line);
  if (!candidate) return null;

  const matched = Object.entries(SECTION_ALIASES).find(([, aliases]) =>
    aliases.some((alias) => candidate === normalizeHeadingCandidate(alias)),
  );

  return (matched?.[0] as keyof ParsedSections | undefined) ?? null;
};

const looksLikeHeadingToken = (line: string): boolean => {
  const normalized = normalizeLine(line);
  if (!normalized) return false;
  if (normalized.length > 28) return false;
  if (/[0-9@]/.test(normalized)) return false;

  const compact = normalized.replace(/\s+/g, '');
  return compact.length <= 20 && normalized === normalized.toUpperCase();
};

const mergeFragmentedHeadingLines = (lines: string[]): string[] => {
  const merged: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const current = normalizeLine(lines[i] ?? '');
    if (!current) {
      i += 1;
      continue;
    }

    if (resolveSectionHeading(current)) {
      merged.push(current);
      i += 1;
      continue;
    }

    let bestCombined = '';
    let bestSpan = 0;

    for (let span = 2; span <= 4; span += 1) {
      const chunk = lines.slice(i, i + span).map((line) => normalizeLine(line)).filter(Boolean);
      if (chunk.length !== span) break;
      if (!chunk.every((token) => looksLikeHeadingToken(token))) break;

      const combined = normalizeWhitespace(chunk.join(' '));
      if (resolveSectionHeading(combined)) {
        bestCombined = combined;
        bestSpan = span;
      }
    }

    if (bestCombined && bestSpan > 0) {
      merged.push(bestCombined);
      i += bestSpan;
      continue;
    }

    merged.push(current);
    i += 1;
  }

  return merged.filter(Boolean);
};

export const detectSections = (text: string): ParsedSections => {
  const sections = createEmptySections();

  const stage4RawLines = text.replace(/\r\n/g, '\n').split('\n');
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[Parser Debug][Stage4-DetectSections-Input] lines.length=${stage4RawLines.length}`);
    stage4RawLines.forEach((line, index) => {
      console.info(`[Parser Debug][Stage4-DetectSections-Input][${index}] ${JSON.stringify(line)}`);
    });
  }

  const lines = mergeFragmentedHeadingLines(stage4RawLines.map((line) => normalizeLine(line)));
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[Parser Debug][Stage5-AfterMerge] lines.length=${lines.length}`);
    lines.forEach((line, index) => {
      console.info(`[Parser Debug][Stage5-AfterMerge][${index}] ${JSON.stringify(line)}`);
    });
  }

  let activeSection: keyof ParsedSections = 'header';

  for (const line of lines) {
    if (!line) {
      continue;
    }

    const previousSection = activeSection;
    const resolved = resolveSectionHeading(line);
    if (resolved) {
      activeSection = resolved;
      if (process.env.NODE_ENV !== 'production') {
        console.info(
          `[Parser Debug][Stage6-Transitions] line=${JSON.stringify(line)} matched=true previous=${previousSection} new=${activeSection} transition=${previousSection}->${activeSection}`,
        );
      }
      continue;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.info(
        `[Parser Debug][Stage6-Transitions] line=${JSON.stringify(line)} matched=false previous=${previousSection} new=${activeSection} transition=none`,
      );
    }

    sections[activeSection].push(line);
  }

  return sections;
};

export type SectionBoundaryRow = {
  lineNumber: number;
  originalLine: string;
  normalizedLine: string;
  detectedSection: keyof ParsedSections;
  sectionStart: boolean;
};

export const debugSectionBoundaries = (text: string): {
  boundaries: SectionBoundaryRow[];
  sectionLengths: Record<keyof ParsedSections, number>;
} => {
  const lines = mergeFragmentedHeadingLines(
    text
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => normalizeLine(line)),
  );

  const sectionLengths: Record<keyof ParsedSections, number> = {
    header: 0,
    summary: 0,
    skills: 0,
    education: 0,
    experience: 0,
    projects: 0,
    certifications: 0,
    languages: 0,
    achievements: 0,
  };

  const boundaries: SectionBoundaryRow[] = [];
  let activeSection: keyof ParsedSections = 'header';

  lines.forEach((raw, index) => {
    const normalized = normalizeLine(raw);
    if (!normalized) return;

    const resolved = resolveSectionHeading(normalized);
    if (resolved) {
      activeSection = resolved;
      boundaries.push({
        lineNumber: index + 1,
        originalLine: raw,
        normalizedLine: normalized,
        detectedSection: activeSection,
        sectionStart: true,
      });
      return;
    }

    sectionLengths[activeSection] += 1;
    boundaries.push({
      lineNumber: index + 1,
      originalLine: raw,
      normalizedLine: normalized,
      detectedSection: activeSection,
      sectionStart: false,
    });
  });

  return { boundaries, sectionLengths };
};

export const headingAliases = SECTION_ALIASES;
