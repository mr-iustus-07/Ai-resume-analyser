export const APP_NAME = 'AI Resume Analyzer';
export const APP_TAGLINE = 'Build a Resume That Gets Interviews';

export const SUPPORTED_UPLOAD_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const ANALYSIS_VERSION = 'v1';
export const DEFAULT_LANGUAGE = 'en';
