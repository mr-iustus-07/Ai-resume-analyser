import { z } from 'zod';

export const analyzeRequestSchema = z.object({
  uploadId: z.string().min(1),
});

export const keywordAnalysisSchema = z.object({
  present: z.array(z.string()),
  missing: z.array(z.string()),
});

export const analysisResultSchema = z.object({
  overall_score: z.number().min(0).max(100),
  ats_score: z.number().min(0).max(100),
  interview_readiness: z.number().min(0).max(100).optional(),

  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),

  missing_sections: z.array(z.string()),
  missing_skills: z.array(z.string()),

  grammar_issues: z.array(z.string()),
  formatting_issues: z.array(z.string()),

  keyword_analysis: keywordAnalysisSchema,

  recommendations: z.array(z.string()),
  priority_actions: z.array(z.string()),

  // Optional premium outputs
  career_level: z.string().optional(),
  industry_match: z.number().min(0).max(100).optional(),
  writing_tone: z.string().optional(),
  readability: z.number().min(0).max(100).optional(),

  skills_radar: z
    .object({
      core: z.array(z.string()),
      advanced: z.array(z.string()),
      gaps: z.array(z.string()),
    })
    .optional(),
});

export const analyzeResponseSchema = z.object({
  success: z.boolean(),
  analysis: analysisResultSchema,
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
