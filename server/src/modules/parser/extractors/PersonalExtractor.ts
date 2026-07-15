import { normalizePhone } from '../normalizers/PhoneNormalizer.js';
import { normalizeLine, normalizeWhitespace, toTitleCase } from '../normalizers/TextNormalizer.js';
import { REGEX_LIBRARY, cleanTrailingPunctuation } from '../utils/RegexLibrary.js';

type PersonalExtractionInput = {
  fullText: string;
  headerLines: string[];
};

type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
};

const safeFirst = (matches: string[] | null | undefined): string =>
  matches && matches.length > 0 ? matches[0]! : '';

const isLikelyPersonToken = (value: string): boolean => {
  const cleaned = normalizeLine(value);
  if (!cleaned) return false;
  if (cleaned.length < 2 || cleaned.length > 30) return false;
  if (/[0-9@:/]/.test(cleaned)) return false;
  return /^[A-Za-z][A-Za-z.'-]*$/.test(cleaned);
};

const extractName = (headerLines: string[]): string => {
  const cleaned = headerLines.map((line) => normalizeLine(line)).filter(Boolean);

  for (let i = 0; i < cleaned.length; i += 1) {
    const one = cleaned[i] ?? '';
    const two = [one, cleaned[i + 1] ?? ''].filter(Boolean).join(' ').trim();

    const oneValid =
      one.length >= 3 &&
      one.length <= 60 &&
      !/[0-9@]/.test(one) &&
      /^[A-Za-z][A-Za-z\s.'-]+$/.test(one) &&
      one.split(/\s+/).length >= 2;

    if (oneValid) return toTitleCase(one);

    const twoParts = two.split(/\s+/).filter(Boolean);
    if (twoParts.length >= 2 && twoParts.length <= 4 && twoParts.every((part) => isLikelyPersonToken(part))) {
      return toTitleCase(two);
    }
  }

  return '';
};

const extractEmail = (text: string): string => {
  const email = safeFirst(text.match(REGEX_LIBRARY.email));
  return normalizeWhitespace(email).toLowerCase();
};

const extractPhone = (text: string): string => {
  const phone = safeFirst(text.match(REGEX_LIBRARY.phone));
  return phone ? normalizePhone(phone) : '';
};

const extractLocation = (text: string): string => {
  const normalizedText = normalizeWhitespace(text);
  const directMatch = safeFirst(normalizedText.match(REGEX_LIBRARY.location));
  if (directMatch) return cleanTrailingPunctuation(directMatch);

  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => normalizeLine(line))
    .filter(Boolean);

  for (let i = 0; i < lines.length; i += 1) {
    const current = lines[i] ?? '';
    const next = lines[i + 1] ?? '';
    const third = lines[i + 2] ?? '';

    const candidateTwo = normalizeWhitespace(`${current} ${next}`);
    const candidateThree = normalizeWhitespace(`${current} ${next} ${third}`);

    const twoMatch = safeFirst(candidateTwo.match(REGEX_LIBRARY.location));
    if (twoMatch) return cleanTrailingPunctuation(twoMatch);

    const threeMatch = safeFirst(candidateThree.match(REGEX_LIBRARY.location));
    if (threeMatch) return cleanTrailingPunctuation(threeMatch);

    if (
      current &&
      next &&
      third &&
      /^[A-Za-z][A-Za-z\s.'-]+$/.test(current) &&
      /^[A-Za-z][A-Za-z\s.'-]+$/.test(next) &&
      /^[A-Z]{2}$/.test(third)
    ) {
      return cleanTrailingPunctuation(`${toTitleCase(current)} ${toTitleCase(next)}, ${third.toUpperCase()}`);
    }
  }

  return '';
};

const extractLinks = (text: string): Pick<PersonalInfo, 'linkedin' | 'github' | 'website'> => {
  const urls = text.match(REGEX_LIBRARY.url) ?? [];
  const linkedin = urls.find((url) => /linkedin\.com/i.test(url)) ?? '';
  const github = urls.find((url) => /github\.com/i.test(url)) ?? '';
  const website = urls.find((url) => !/linkedin\.com|github\.com/i.test(url)) ?? '';

  return {
    linkedin: cleanTrailingPunctuation(linkedin),
    github: cleanTrailingPunctuation(github),
    website: cleanTrailingPunctuation(website),
  };
};

export const extractPersonal = ({ fullText, headerLines }: PersonalExtractionInput): PersonalInfo => {
  const links = extractLinks(fullText);
  return {
    name: extractName(headerLines),
    email: extractEmail(fullText),
    phone: extractPhone(fullText),
    location: extractLocation(headerLines.join(' ')) || extractLocation(fullText),
    linkedin: links.linkedin,
    github: links.github,
    website: links.website,
  };
};
