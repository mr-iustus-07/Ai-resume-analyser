import { z } from 'zod';

import type { AIProviderAnalyzeInput, AIProviderAnalyzeOutput } from '../analysis.types.js';
import type { AIProvider } from './AIProvider.js';
import { analysisResultSchema } from '../analysis.schema.js';

export class OpenAIProvider implements AIProvider {
  constructor(
    private readonly opts: {
      apiKey: string;
      model: string;
    },
  ) {}

  async analyzeResume(input: AIProviderAnalyzeInput): Promise<AIProviderAnalyzeOutput> {
    const { resume } = input;

    // Lazy import to avoid hard dependency surface in non-OpenAI environments.
    const { OpenAI } = await import('openai');

    const openai = new OpenAI({
      apiKey: this.opts.apiKey,
    });

    const systemPrompt =
      'You are a senior AI career coach and ATS optimization expert. ' +
      'Return ONLY valid JSON matching the provided schema. ' +
      'Do not include any extra keys. Scores must be integers 0-100.';

    const schemaJson = JSON.stringify(analysisResultSchema, null, 2);

    const userPrompt = {
      instructions:
        'Analyze the resume JSON for ATS compatibility, quality, strengths/weaknesses, missing skills/sections, and prioritized improvements. ' +
        'Use evidence from the provided structured resume JSON. ' +
        'If job description is provided, perform keyword matching; otherwise infer typical ATS requirements for the resume content.',
      resume,
      jobDescription: input.jobDescription ?? null,
      output_schema: schemaJson,
    };

    // Note: If your OpenAI SDK supports response_format JSON schema, use it.
    // Otherwise we enforce via prompt + response validation.
    const resp = await openai.chat.completions.create({
      model: this.opts.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(userPrompt) },
      ],
      temperature: 0.2,
    });

    const content = resp.choices[0]?.message?.content ?? '';
    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      // Last-resort: extract first JSON object from content.
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('OpenAI returned non-JSON output for analysis result.');
      parsed = JSON.parse(match[0]);
    }

    const validated = analysisResultSchema.parse(parsed);
    return validated;
  }
}
