import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

import { hasMotapisApiKey } from '../../../lib/ai-gateway';

export const POST: APIRoute = async () => {
  try {
    // Keep the full catalog available in the editor even when Cloudflare is
    // not the active provider. Per-tool routing determines the actual provider.
    const models = [
      // Chat/Text Generation models
      { id: 'openai/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'OpenAI', category: 'chat' },
      { id: 'openai/gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', category: 'chat' },
      { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', category: 'chat' },
      { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', category: 'chat' },
      { id: 'anthropic/claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'Anthropic', category: 'chat' },
      { id: 'anthropic/claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', category: 'chat' },
      { id: 'anthropic/claude-sonnet-4-20250514', name: 'Claude Sonnet 4', provider: 'Anthropic', category: 'chat' },
      { id: 'anthropic/claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', provider: 'Anthropic', category: 'chat' },
      { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', provider: 'Google', category: 'chat' },
      { id: 'google/gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash', provider: 'Google', category: 'chat' },
      { id: 'meta-llama/llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout 17B', provider: 'Meta', category: 'chat' },
      { id: 'meta-llama/llama-4-maverick-17b-128e-instruct', name: 'Llama 4 Maverick 17B', provider: 'Meta', category: 'chat' },
      { id: 'deepseek/deepseek-r1-distill-qwen-32b', name: 'DeepSeek R1 32B', provider: 'DeepSeek', category: 'chat' },

      // Embedding models
      { id: 'openai/text-embedding-3-small', name: 'Text Embedding 3 Small', provider: 'OpenAI', category: 'embedding' },
      { id: 'openai/text-embedding-3-large', name: 'Text Embedding 3 Large', provider: 'OpenAI', category: 'embedding' },
      { id: 'baai/bge-base-en-v1.5', name: 'BGE Base EN v1.5', provider: 'BAAI', category: 'embedding' },
      { id: 'baai/bge-small-en-v1.5', name: 'BGE Small EN v1.5', provider: 'BAAI', category: 'embedding' },
    ];

    const motapisModels: typeof models = [];
    if (hasMotapisApiKey()) {
      try {
        const response = await fetch('https://motapis.com/v1/models', {
          headers: { Authorization: `Bearer ${env.MOTAPIS_API_KEY}` },
        });
        if (response.ok) {
          const payload = await response.json() as { data?: Array<{ id?: string; name?: string }> };
          for (const model of payload.data ?? []) {
            if (!model.id) continue;
            motapisModels.push({
              id: model.id,
              name: model.name || model.id,
              provider: 'Motapis',
              category: 'chat',
            });
          }
        }
      } catch {
        // Cloudflare models remain available when Motapis cannot be reached.
      }
    }

    return new Response(JSON.stringify({ models: [...models, ...motapisModels], motapis_available: hasMotapisApiKey() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi lấy danh sách model';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
