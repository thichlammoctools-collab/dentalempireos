import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { getAiSettings, updateAiSettings } from '../../../lib/ai-settings-db';
import { getProviderById, listModels } from '../../../lib/ai-provider-db';

export const prerender = false;

// GET /api/admin/ai-settings — fetch current settings
// (api_key masked for safety)
export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const settings = await getAiSettings(env.DB);
  return json({
    base_url: settings.base_url,
    api_key: settings.api_key ? maskKey(settings.api_key) : '',
    api_key_set: settings.api_key.length > 0,
    model: settings.model,
    max_tokens: settings.max_tokens,
    is_active: settings.is_active === 1,
    chat_provider_id: settings.chat_provider_id,
    chat_model_id: settings.chat_model_id,
    embedding_provider_id: settings.embedding_provider_id,
    embedding_model_id: settings.embedding_model_id,
    updated_at: settings.updated_at,
  });
};

// POST /api/admin/ai-settings — update settings
export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON');

  const updates: Parameters<typeof updateAiSettings>[1] = {};

  if (typeof body.base_url === 'string') {
    updates.base_url = body.base_url.trim() || 'https://api.anthropic.com';
  }
  if (typeof body.model === 'string' && body.model.trim()) {
    updates.model = body.model.trim();
  }
  if (typeof body.max_tokens === 'number' && body.max_tokens > 0) {
    updates.max_tokens = Math.min(body.max_tokens, 8192);
  }
  if (typeof body.is_active === 'boolean') {
    updates.is_active = body.is_active ? 1 : 0;
  }
  if (typeof body.chat_provider_id === 'number' && typeof body.chat_model_id === 'number') {
    const [provider, models] = await Promise.all([
      getProviderById(env.DB, body.chat_provider_id),
      listModels(env.DB, body.chat_provider_id),
    ]);
    const model = models.find((item) => item.id === body.chat_model_id);
    if (!provider || !provider.is_active || !provider.api_key || !model || !model.is_active) {
      return badRequest('Provider hoặc model Chat Assistant không hợp lệ.');
    }
    updates.chat_provider_id = provider.id;
    updates.chat_model_id = model.id;
  }
  if (typeof body.embedding_provider_id === 'number' && typeof body.embedding_model_id === 'number') {
    const [provider, models] = await Promise.all([
      getProviderById(env.DB, body.embedding_provider_id),
      listModels(env.DB, body.embedding_provider_id),
    ]);
    const model = models.find((item) => item.id === body.embedding_model_id);
    const isEmbeddingModel = Boolean(model && `${model.name} ${model.model_id}`.toLowerCase().includes('embedding'));
    if (!provider || !provider.is_active || !provider.api_key || !model || !model.is_active || !isEmbeddingModel) {
      return badRequest('Provider hoặc model embedding không hợp lệ. Model phải có chữ "embedding" trong tên hoặc Model ID.');
    }
    updates.embedding_provider_id = provider.id;
    updates.embedding_model_id = model.id;
  }
  // api_key — if '•••' sent (placeholder meaning "keep current"), don't update
  // if empty string sent, clear it
  // otherwise, set it
  if (typeof body.api_key === 'string') {
    if (body.api_key === '•••') {
      // keep current
    } else {
      updates.api_key = body.api_key.trim();
    }
  }

  await updateAiSettings(env.DB, updates);
  const updated = await getAiSettings(env.DB);

  return json({
    success: true,
    settings: {
      base_url: updated.base_url,
      api_key: updated.api_key ? maskKey(updated.api_key) : '',
      api_key_set: updated.api_key.length > 0,
      model: updated.model,
      max_tokens: updated.max_tokens,
      is_active: updated.is_active === 1,
      chat_provider_id: updated.chat_provider_id,
      chat_model_id: updated.chat_model_id,
      embedding_provider_id: updated.embedding_provider_id,
      embedding_model_id: updated.embedding_model_id,
      updated_at: updated.updated_at,
    },
  });
};

// ── helpers ───────────────────────────────────────────────

function maskKey(key: string): string {
  if (key.length <= 8) return '•••';
  return key.slice(0, 4) + '••••' + key.slice(-4);
}
