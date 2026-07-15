import { analyzeRequestSchema, analyzeResponseSchema } from './analysis.schema.js';
import type { AnalyzeResponse } from './analysis.schema.js';
import { AnalysisService } from './analysis.service.js';

export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  analyze = async (reqBody: unknown): Promise<AnalyzeResponse> => {
    const parsedReq = analyzeRequestSchema.parse(reqBody);
    const analysis = await this.analysisService.analyzeByUploadId(parsedReq);
    return analyzeResponseSchema.parse({ success: true, analysis });
  };
}
