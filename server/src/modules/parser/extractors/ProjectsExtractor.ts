import { normalizeWhitespace } from '../normalizers/TextNormalizer.js';
import type { ResumeProjectItem } from '../parser.types.js';
import {
  mergeFragmentedPhrase,
  mergeTokenLines,
  splitSemanticBlocks,
  uniqueOrdered,
} from '../utils/SemanticPhraseBuilder.js';
import { REGEX_LIBRARY, cleanTrailingPunctuation } from '../utils/RegexLibrary.js';

type ProjectsExtractionInput = {
  lines: string[];
};

const TECH_SPLITTER = /[,|/]| and /i;
const TECH_HINT = /(technologies|tech stack|stack|tools|built with|using)/i;

const extractTech = (lines: string[]): string[] => {
  const raw = lines
    .flatMap((line) => line.split(':'))
    .filter((line) => TECH_HINT.test(line) || /react|node|python|java|sql|aws|docker|kubernetes/i.test(line))
    .flatMap((line) => line.split(TECH_SPLITTER))
    .map((item) => normalizeWhitespace(item.replace(TECH_HINT, '')))
    .filter((item) => item.length > 1);

  return uniqueOrdered(raw);
};

const parseProjectBlock = (block: string[]): ResumeProjectItem | null => {
  const compact = mergeTokenLines(block);
  if (!compact.length) return null;

  const joined = mergeFragmentedPhrase(compact);
  const link = cleanTrailingPunctuation(joined.match(REGEX_LIBRARY.url)?.[0] ?? '');
  const technologies = extractTech(compact);

  const nameCandidate =
    compact.find((line) => !TECH_HINT.test(line) && !REGEX_LIBRARY.url.test(line)) ?? compact[0] ?? '';
  const name = normalizeWhitespace(nameCandidate);

  const description = normalizeWhitespace(
    compact
      .filter((line) => line !== nameCandidate && !TECH_HINT.test(line))
      .join(' '),
  );

  return {
    name,
    role: '',
    technologies,
    description,
    link,
  };
};

export const extractProjects = ({ lines }: ProjectsExtractionInput): ResumeProjectItem[] => {
  const blocks = splitSemanticBlocks(lines);
  return blocks.map((block) => parseProjectBlock(block)).filter((item): item is ResumeProjectItem => Boolean(item));
};
