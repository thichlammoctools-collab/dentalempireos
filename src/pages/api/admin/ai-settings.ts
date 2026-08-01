import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { getAiSettings, updateAiSettings } from '../../../lib/ai-settings-db';
import { hasAiGatewayToken, hasMotapisApiKey } from '../../../lib/ai-gateway';

export const prerender = false;

// GET /api/admin/ai-settings — fetch central Gateway settings.
export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const settings = await getAiSettings(env.DB);
  return json({
    max_tokens: settings.max_tokens,
    gateway_enabled: settings.gateway_enabled === 1,
    gateway_account_id: settings.gateway_account_id ?? '',
    gateway_id: settings.gateway_id,
    gateway_default_model: settings.gateway_default_model ?? '',
    gateway_chat_model: settings.gateway_chat_model ?? '',
    gateway_embedding_model: settings.gateway_embedding_model ?? '',
    gateway_token_set: hasAiGatewayToken(),
    ai_provider: settings.ai_provider,
    motapis_enabled: settings.motapis_enabled === 1,
    motapis_model: settings.motapis_model ?? '',
    motapis_scanner_model: settings.motapis_scanner_model ?? '',
    motapis_chat_model: settings.motapis_chat_model ?? '',
    motapis_api_key_set: hasMotapisApiKey(),
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

  if (typeof body.max_tokens === 'number' && body.max_tokens > 0) {
    updates.max_tokens = Math.min(body.max_tokens, 8192);
  }
  if (typeof body.gateway_enabled === 'boolean') {
    updates.gateway_enabled = body.gateway_enabled ? 1 : 0;
  }
  if (body.ai_provider === 'cloudflare' || body.ai_provider === 'motapis') {
    updates.ai_provider = body.ai_provider;
  }
  if (typeof body.motapis_enabled === 'boolean') {
    updates.motapis_enabled = body.motapis_enabled ? 1 : 0;
  }
  for (const field of ['motapis_model', 'motapis_scanner_model', 'motapis_chat_model'] as const) {
    if (typeof body[field] === 'string') {
      const model = body[field].trim();
      if (model.length > 128 || (model && !/^[a-zA-Z0-9._:/-]+$/.test(model))) {
        return badRequest('Motapis model ID chỉ gồm chữ, số, dấu chấm, gạch ngang, gạch dưới, dấu hai chấm hoặc dấu gạch chéo.');
      }
      updates[field] = model || null;
    }
  }
  if (typeof body.gateway_account_id === 'string') {
    const accountId = body.gateway_account_id.trim();
    if (accountId && !/^[a-f0-9]{32}$/i.test(accountId)) {
      return badRequest('Cloudflare Account ID phải gồm 32 ký tự hexadecimal.');
    }
    updates.gateway_account_id = accountId || null;
  }
  if (typeof body.gateway_id === 'string') {
    const gatewayId = body.gateway_id.trim();
    if (!gatewayId || gatewayId.length > 64 || !/^[a-zA-Z0-9_-]+$/.test(gatewayId)) {
      return badRequest('Gateway ID chỉ gồm chữ, số, dấu gạch ngang và gạch dưới.');
    }
    updates.gateway_id = gatewayId;
  }
  for (const field of ['gateway_default_model', 'gateway_chat_model', 'gateway_embedding_model'] as const) {
    if (typeof body[field] === 'string') {
      const model = body[field].trim();
      if (model && !/^(openai|anthropic|google|@cf)\//.test(model)) {
        return badRequest(`Model ${field} phải dùng ID Cloudflare, ví dụ openai/gpt-4.1-mini hoặc @cf/...`);
      }
      updates[field] = model || null;
    }
  }

  await updateAiSettings(env.DB, updates);
  const updated = await getAiSettings(env.DB);

  return json({
    success: true,
    settings: {
       max_tokens: updated.max_tokens,
       gateway_enabled: updated.gateway_enabled === 1,
       gateway_account_id: updated.gateway_account_id ?? '',
       gateway_id: updated.gateway_id,
        gateway_default_model: updated.gateway_default_model ?? '',
        gateway_chat_model: updated.gateway_chat_model ?? '',
        gateway_embedding_model: updated.gateway_embedding_model ?? '',
        gateway_token_set: hasAiGatewayToken(),
        ai_provider: updated.ai_provider,
        motapis_enabled: updated.motapis_enabled === 1,
        motapis_model: updated.motapis_model ?? '',
        motapis_scanner_model: updated.motapis_scanner_model ?? '',
        motapis_chat_model: updated.motapis_chat_model ?? '',
        motapis_api_key_set: hasMotapisApiKey(),
      updated_at: updated.updated_at,
    },
  });
};

