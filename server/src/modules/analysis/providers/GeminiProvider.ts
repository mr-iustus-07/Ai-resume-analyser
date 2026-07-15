import type { AIProvider } from './AIProvider.js';
import type { AIProviderAnalyzeInput, AIProviderAnalyzeOutput } from '../analysis.types.js';

export class GeminiProvider implements AIProvider {
  async analyzeResume(_input: AIProviderAnalyzeInput): Promise<AIProviderAnalyzeOutput> {
    throw new Error('GeminiProvider not implemented yet.');
  }
}
