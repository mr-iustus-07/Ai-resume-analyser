import { z } from 'zod';

export const SkillSchema = z.object({
  name: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  category: z.enum(['technical', 'soft', 'tooling', 'domain']).optional(),
});

export const StrengthWeaknessSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});

export const AtsAnalysisSchema = z.object({
  atsScore: z.number().min(0).max(100),
  missingKeywords: z.array(z.string()),
  formattingIssues: z.array(z.string()),
  sectionOrderIssues: z.array(z.string()),
  contactDetailsCheck: z.object({
    hasEmail: z.boolean(),
    hasPhone: z.boolean(),
    hasLinkedIn: z.boolean(),
    hasLocation: z.boolean(),
  }),
  keywordDensity: z.record(z.string(), z.number()),
  suggestions: z.array(z.string()),
});

export const JobMatchSchema = z.object({
  overallMatchPercent: z.number().min(0).max(100),
  missingSkills: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  recommendedImprovements: z.array(z.string()),
  interviewReadiness: z.number().min(0).max(100),
});

export const ResumeScoreBreakdownSchema = z.object({
  overallScore: z.number().min(0).max(100),
  grammar: z.number().min(0).max(100),
  formatting: z.number().min(0).max(100),
  impact: z.number().min(0).max(100),
  readability: z.number().min(0).max(100),
  professionalism: z.number().min(0).max(100),
  achievements: z.number().min(0).max(100),
});

export const ResumeAnalysisSchema = z.object({
  summary: z.string(),
  careerLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  industryMatch: z.array(z.string()),
  scoreBreakdown: ResumeScoreBreakdownSchema,
  strengthsAndWeaknesses: StrengthWeaknessSchema,
  detectedSkills: z.array(SkillSchema),
  missingSkills: z.array(z.string()),
  duplicateSkills: z.array(z.string()),
  actionVerbSuggestions: z.array(z.string()),
  rewrittenBulletPoints: z.array(
    z.object({
      original: z.string(),
      improved: z.string(),
      reason: z.string(),
    }),
  ),
  educationAnalysis: z.array(z.string()),
  experienceAnalysis: z.array(z.string()),
  projectAnalysis: z.array(z.string()),
  certificationAnalysis: z.array(z.string()),
  leadershipSignals: z.array(z.string()),
  communicationSignals: z.array(z.string()),
  careerCoachSuggestions: z.object({
    careerPath: z.array(z.string()),
    expectedSalaryRange: z.string(),
    recommendedCertifications: z.array(z.string()),
    learningRoadmap: z.array(z.string()),
    portfolioSuggestions: z.array(z.string()),
    projectIdeas: z.array(z.string()),
  }),
  quickWins: z.array(z.string()),
  longTermImprovements: z.array(z.string()),
});

export type AtsAnalysis = z.infer<typeof AtsAnalysisSchema>;
export type JobMatch = z.infer<typeof JobMatchSchema>;
export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;
