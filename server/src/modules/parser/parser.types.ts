export type ResumePersonalInfo = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
};

export type ResumeEducationItem = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type ResumeExperienceItem = {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
};

export type ResumeProjectItem = {
  name: string;
  role: string;
  technologies: string[];
  description: string;
  link: string;
};

export type ResumeCertificationItem = {
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  credentialId: string;
};

export type ResumeFieldConfidence = {
  name: number;
  email: number;
  phone: number;
  location: number;
  linkedin: number;
  github: number;
  website: number;
  summary: number;
  skills: number;
  softSkills: number;
  education: number;
  experience: number;
  projects: number;
  certifications: number;
  languages: number;
  achievements: number;
};

export type ParsedResume = {
  personal: ResumePersonalInfo;
  summary: string;
  skills: string[];
  softSkills: string[];
  education: ResumeEducationItem[];
  experience: ResumeExperienceItem[];
  projects: ResumeProjectItem[];
  certifications: ResumeCertificationItem[];
  languages: string[];
  achievements: string[];
  confidence: ResumeFieldConfidence;
};

export type UploadLookupResult = {
  uploadId: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
};

export type ParseRequestBody = {
  uploadId?: string;
};

export type ParseErrorCode =
  | 'MISSING_UPLOAD_ID'
  | 'UPLOAD_NOT_FOUND'
  | 'UNSUPPORTED_FILE_TYPE'
  | 'EMPTY_RESUME'
  | 'INVALID_PDF_FILE'
  | 'PDF_PARSE_FAILURE'
  | 'CORRUPTED_FILE'
  | 'PARSER_FAILURE';

export class ParserError extends Error {
  public readonly code: ParseErrorCode;
  public readonly statusCode: number;

  constructor(message: string, code: ParseErrorCode, statusCode = 400) {
    super(message);
    this.name = 'ParserError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
