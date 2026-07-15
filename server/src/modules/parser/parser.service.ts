import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { extractAchievements } from './extractors/AchievementExtractor.js';
import { extractCertifications } from './extractors/CertificationExtractor.js';
import { extractEducation } from './extractors/EducationExtractor.js';
import { extractExperience } from './extractors/ExperienceExtractor.js';
import { extractLanguages } from './extractors/LanguageExtractor.js';
import { extractPersonal } from './extractors/PersonalExtractor.js';
import { extractProjects } from './extractors/ProjectsExtractor.js';
import { extractSkills } from './extractors/SkillsExtractor.js';
import { normalizeLine, normalizeWhitespace } from './normalizers/TextNormalizer.js';
import { ParserFactory } from './parser.factory.js';
import {
  type ParsedResume,
  type ParserError,
  type ResumeFieldConfidence,
  type UploadLookupResult,
} from './parser.types.js';
import { ParserError as ResumeParserError } from './parser.types.js';
import { debugSectionBoundaries, detectSections } from './utils/HeadingDetector.js';
import { reconstructResumeText } from './utils/TextReconstructor.js';

const TEMP_UPLOAD_DIR = path.resolve(process.cwd(), 'server/temp/uploads');

const logTextStage = (label: string, text: string): void => {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const hash = createHash('sha256').update(text).digest('hex');
  console.info(`[Parser Debug][${label}] chars=${text.length} lines=${lines.length} sha256=${hash}`);
  console.info(`[Parser Debug][${label}] first20=`);
  lines.slice(0, 20).forEach((line, index) => {
    console.info(`[${index}] ${line}`);
  });
};

const ensureNotEmptyText = (text: string): string => {
  const normalized = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => normalizeWhitespace(line))
    .join('\n');

  if (!normalizeWhitespace(normalized)) {
    throw new ResumeParserError('Resume appears empty after parsing.', 'EMPTY_RESUME', 400);
  }

  return normalized;
};

const clampConfidence = (value: number): number => Math.max(0, Math.min(1, Number(value.toFixed(2))));

const presenceConfidence = (value: string): number => (value ? 1 : 0.2);

const listConfidence = (values: unknown[]): number => {
  if (!values.length) return 0.2;
  if (values.length <= 2) return 0.65;
  if (values.length <= 5) return 0.82;
  return 0.92;
};

const buildConfidence = (resume: Omit<ParsedResume, 'confidence'>): ResumeFieldConfidence => ({
  name: presenceConfidence(resume.personal.name),
  email: resume.personal.email ? 1 : 0.2,
  phone: resume.personal.phone ? 0.95 : 0.2,
  location: presenceConfidence(resume.personal.location),
  linkedin: resume.personal.linkedin ? 0.9 : 0.25,
  github: resume.personal.github ? 0.9 : 0.25,
  website: resume.personal.website ? 0.85 : 0.25,
  summary: presenceConfidence(resume.summary),
  skills: clampConfidence(listConfidence(resume.skills)),
  softSkills: clampConfidence(listConfidence(resume.softSkills)),
  education: clampConfidence(listConfidence(resume.education)),
  experience: clampConfidence(listConfidence(resume.experience)),
  projects: clampConfidence(listConfidence(resume.projects)),
  certifications: clampConfidence(listConfidence(resume.certifications)),
  languages: clampConfidence(listConfidence(resume.languages)),
  achievements: clampConfidence(listConfidence(resume.achievements)),
});

export const getUploadedFileById = async (uploadId: string): Promise<UploadLookupResult> => {
  const files = await fs.readdir(TEMP_UPLOAD_DIR).catch(() => []);
  const matched = files.find((filename) => filename.startsWith(`${uploadId}__`));

  if (!matched) {
    throw new ResumeParserError('Uploaded file not found for the provided uploadId.', 'UPLOAD_NOT_FOUND', 404);
  }

  const filePath = path.join(TEMP_UPLOAD_DIR, matched);
  const stats = await fs.stat(filePath);
  const originalName = matched.split('__').slice(1).join('__') || matched;
  const ext = path.extname(originalName).toLowerCase();

  const mimetype =
    ext === '.pdf'
      ? 'application/pdf'
      : ext === '.docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : ext === '.txt'
          ? 'text/plain'
          : 'application/octet-stream';

  return {
    uploadId,
    filename: originalName,
    path: filePath,
    mimetype,
    size: stats.size,
  };
};

export const parseResumeFromUploadId = async (uploadId: string): Promise<ParsedResume> => {
  const file = await getUploadedFileById(uploadId);

  const parser = ParserFactory.getParser(file.mimetype);
  const fileBuffer = await fs.readFile(file.path);
  const rawText = await parser.parseText(fileBuffer);
  if (process.env.NODE_ENV !== 'production') {
    logTextStage('Stage1-DecodedText', rawText);
  }

  const reconstructedText = reconstructResumeText(rawText);
  if (process.env.NODE_ENV !== 'production') {
    logTextStage('Stage2-ReconstructedText', reconstructedText);
  }

  const normalizedText = ensureNotEmptyText(reconstructedText);
  if (process.env.NODE_ENV !== 'production') {
    logTextStage('Stage3-BeforeDetectSections', normalizedText);
  }

  const sections = detectSections(normalizedText);
  const cleanedHeaderLines = sections.header.map((line) => normalizeLine(line)).filter(Boolean);

  const personal = extractPersonal({
    fullText: normalizedText,
    headerLines: cleanedHeaderLines,
  });

  const { skills, softSkills } = extractSkills({ lines: sections.skills });

  const resumeCore: Omit<ParsedResume, 'confidence'> = {
    personal,
    summary: normalizeWhitespace(sections.summary.join(' ')),
    skills,
    softSkills,
    education: extractEducation({ lines: sections.education }),
    experience: extractExperience({ lines: sections.experience }),
    projects: extractProjects({ lines: sections.projects }),
    certifications: extractCertifications({ lines: sections.certifications }),
    languages: extractLanguages({ lines: sections.languages }),
    achievements: extractAchievements({ lines: sections.achievements }),
  };

  const parsedResume: ParsedResume = {
    ...resumeCore,
    confidence: buildConfidence(resumeCore),
  };

  if (process.env.NODE_ENV !== 'production') {
    console.info('[Parser Debug] Original decoded text:\n', rawText);
    console.info('[Parser Debug] Reconstructed text:\n', reconstructedText);
    const sectionDebug = debugSectionBoundaries(normalizedText);
    console.info('[Parser Debug] Detected sections:\n', sections);
    console.info('[Parser Debug] Detected Section Boundaries:\n', sectionDebug.boundaries);
    console.info('[Parser Debug] Section Contents:\n', sections);
    console.info('[Parser Debug] Section Lengths:\n', sectionDebug.sectionLengths);
    console.info('[Parser Debug] Extraction summary:\n', {
      personal: parsedResume.personal,
      summaryLength: parsedResume.summary.length,
      skillsCount: parsedResume.skills.length,
      educationCount: parsedResume.education.length,
      experienceCount: parsedResume.experience.length,
      projectsCount: parsedResume.projects.length,
      certificationsCount: parsedResume.certifications.length,
      languagesCount: parsedResume.languages.length,
      achievementsCount: parsedResume.achievements.length,
    });
  }

  return parsedResume;
};

export const isParserError = (error: unknown): error is ParserError =>
  error instanceof ResumeParserError;
