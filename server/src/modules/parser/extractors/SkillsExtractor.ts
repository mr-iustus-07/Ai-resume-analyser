import { normalizeSkills, splitSkillsFromLines } from '../normalizers/SkillNormalizer.js';
import { normalizeWhitespace, toTitleCase } from '../normalizers/TextNormalizer.js';
import { mergeTokenLines, uniqueOrdered } from '../utils/SemanticPhraseBuilder.js';

type SkillsExtractionInput = {
  lines: string[];
};

const SOFT_SKILL_HINTS = [
  'communication',
  'leadership',
  'collaboration',
  'teamwork',
  'problem solving',
  'adaptability',
  'critical thinking',
  'time management',
  'stakeholder management',
  'mentoring',
];

const splitSkillChunks = (line: string): string[] =>
  normalizeWhitespace(line)
    .split(/[:]/g)
    .flatMap((part) => part.split(/[•,|/]/g))
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean);

export const extractSkills = ({ lines }: SkillsExtractionInput): { skills: string[]; softSkills: string[] } => {
  const phraseLines = mergeTokenLines(lines);
  const chunks = phraseLines.flatMap((line) => splitSkillChunks(line));
  const normalizedSkills = normalizeSkills(splitSkillsFromLines(chunks))
    .map((skill) => toTitleCase(normalizeWhitespace(skill)))
    .filter(Boolean);

  const skills = uniqueOrdered(normalizedSkills);
  const softSkills = skills.filter((skill) =>
    SOFT_SKILL_HINTS.some((hint) => skill.toLowerCase().includes(hint)),
  );

  return { skills, softSkills };
};
