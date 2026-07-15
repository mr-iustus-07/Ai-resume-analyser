import { env } from '../../../config/env.js';
import type { AIProvider } from './AIProvider.js';
import { OpenAIProvider } from './OpenAIProvider.js';
import { AnthropicProvider } from './AnthropicProvider.js';
import { GeminiProvider } from './GeminiProvider.js';
import { OpenRouterProvider } from './OpenRouterProvider.js';
import { OllamaProvider } from './OllamaProvider.js';

export type ProviderName = 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'ollama';

export const getAIProvider = (): AIProvider => {
  // env.ts currently does not define AI_PROVIDER, so default to OpenAI.
  if (!env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY in environment.');
  }

  return new OpenAIProvider({
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL || 'gpt-4o-mini',
  });
};
