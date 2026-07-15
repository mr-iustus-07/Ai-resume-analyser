import type { ParsedResume } from '../parser/parser.types.js';

export type AnalyzeResumeRequest = {
  uploadId: string;
};

export type KeywordAnalysis = {
  present: string[];
  missing: string[];
};

export type AnalysisResult = {
  overall_score: number; // 0-100
  ats_score: number; // 0-100
  interview_readiness?: number; // 0-100 (optional)
  strengths: string[];
  weaknesses: string[];
  missing_sections: string[];
  missing_skills: string[];
  grammar_issues: string[];
  formatting_issues: string[];
  keyword_analysis: KeywordAnalysis;
  recommendations: string[];
  priority_actions: string[];

  // Additional premium outputs
  career_level?: string;
  industry_match?: number; // 0-100
  writing_tone?: string;
  readability?: number; // 0-100
  skills_radar?: {
    core: string[];
    advanced: string[];
    gaps: string[];
  };
};

export type AIProviderAnalyzeInput = {
  resume: ParsedResume;
  // optional future: jobDescription matching
  jobDescription?: string | null;
};

export type AIProviderAnalyzeOutput = AnalysisResult;

export type UploadParsedResume = {
  uploadId: string;
  parsedResume: ParsedResume;
};
