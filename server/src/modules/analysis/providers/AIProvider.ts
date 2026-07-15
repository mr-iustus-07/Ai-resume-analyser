import type { AIProviderAnalyzeInput, AIProviderAnalyzeOutput } from '../analysis.types.js';

export interface AIProvider {
  analyzeResume(input: AIProviderAnalyzeInput): Promise<AIProviderAnalyzeOutput>;
}
