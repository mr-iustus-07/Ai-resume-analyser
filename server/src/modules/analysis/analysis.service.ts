import { parseResumeFromUploadId } from '../parser/parser.service.js';
import type { AnalysisResult, AIProviderAnalyzeInput } from './analysis.types.js';
import { analysisResultSchema, analyzeRequestSchema } from './analysis.schema.js';
import { getAIProvider } from './providers/provider.factory.js';

export class AnalysisService {
  async analyzeByUploadId(input: unknown): Promise<AnalysisResult> {
    const req = analyzeRequestSchema.parse(input);

    // Retrieve parsed resume using the frozen parser pipeline.
    const parsedResume = await parseResumeFromUploadId(req.uploadId);

    const providerInput: AIProviderAnalyzeInput = {
      resume: parsedResume,
      jobDescription: null,
    };

    const provider = getAIProvider();
    const result = await provider.analyzeResume(providerInput);

    // Enforce response schema on the server-side as the single source of truth.
    // (OpenAIProvider already validates, but double-guard for production safety.)
    return analysisResultSchema.parse(result);
  }
}
