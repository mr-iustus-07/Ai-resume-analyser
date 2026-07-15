import { normalizeWhitespace, uniqueByNormalizedKey } from '../normalizers/TextNormalizer.js';
import { mergeTokenLines, splitSemanticBlocks } from '../utils/SemanticPhraseBuilder.js';

type AchievementExtractionInput = {
  lines: string[];
};

export const extractAchievements = ({ lines }: AchievementExtractionInput): string[] => {
  const blocks = splitSemanticBlocks(lines);
  const merged = blocks.flatMap((block) => mergeTokenLines(block));
  const normalized = merged
    .map((item) => normalizeWhitespace(item.replace(/^[\-*]\s*/, '')))
    .filter(Boolean);

  return uniqueByNormalizedKey(normalized);
};
