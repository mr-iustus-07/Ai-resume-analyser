import type { AIProvider } from './AIProvider.js';
import type { AIProviderAnalyzeInput, AIProviderAnalyzeOutput } from '../analysis.types.js';

export class AnthropicProvider implements AIProvider {
  async analyzeResume(_input: AIProviderAnalyzeInput): Promise<AIProviderAnalyzeOutput> {
    throw new Error('AnthropicProvider not implemented yet.');
  }
}
