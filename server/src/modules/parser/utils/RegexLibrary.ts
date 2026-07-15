export const REGEX_LIBRARY = {
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  phone: /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,5}[\s-]?\d{4,}/g,
  linkedin: /https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/gi,
  github: /https?:\/\/(?:www\.)?github\.com\/[^\s)]+/gi,
  url: /https?:\/\/[^\s)]+/gi,
  location:
    /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s?[A-Z]{2}\b|[A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s?[A-Z][a-z]+)\b/g,
  dateRange:
    /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*(?:-|–|to)\s*(Present|Current|Now|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\b/gi,
  year: /\b(19|20)\d{2}\b/g,
  gpa: /\b(?:GPA|CGPA)\s*[:\-]?\s*(\d+(\.\d+)?(?:\/\d+(\.\d+)?)?)\b/gi,
} as const;

export const cleanTrailingPunctuation = (value: string): string =>
  value.replace(/[;,.\s]+$/g, '').trim();
