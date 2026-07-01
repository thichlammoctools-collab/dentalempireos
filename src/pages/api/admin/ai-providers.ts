import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import {
  listProviders,
  upsertProvider,
  toggleProviderActive,
  deleteProvider,
  listModels,
  upsertModel,
  deleteModel,
} from '../../../lib/ai-provider-db';

export const prerender = false;

// GET — list providers + their models
export const GET: APIRoute = async () => {
  const providers = await listProviders(env.DB);
  const models = await listModels(env.DB);
  const modelsByProvider = new Map<number, typeof models>();
  for (const m of models) {
    if (!modelsByProvider.has(m.provider_id)) modelsByProvider.set(m.provider_id, []);
    modelsByProvider.get(m.provider_id)!.push(m);
  }
  return json({ providers, models: modelsByProvider });
};

// POST — create/update provider
export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => null)) as {
    action?: string;
    provider?: { name: string; slug: string; base_url: string; api_key?: string; is_active?: boolean };
    provider_id?: number;
    model?: { provider_id: number; name: string; model_id: string; max_tokens?: number };
    model_id?: number;
    active?: boolean;
  } | null;

  if (!body) return badRequest('Invalid JSON');

  // Provider CRUD
  if (body.action === 'upsert_provider' && body.provider) {
    const p = await upsertProvider(env.DB, {
      name: body.provider.name,
      slug: body.provider.slug,
      base_url: body.provider.base_url,
      api_key: body.provider.api_key || '',
      is_active: body.provider.is_active ? 1 : 0,
    });
    return json({ ok: true, provider: p });
  }

  if (body.action === 'toggle_provider') {
    if (!body.provider_id) return badRequest('Missing provider_id');
    await toggleProviderActive(env.DB, body.provider_id, !!body.active);
    return json({ ok: true });
  }

  if (body.action === 'delete_provider') {
    if (!body.provider_id) return badRequest('Missing provider_id');
    await deleteProvider(env.DB, body.provider_id);
    return json({ ok: true });
  }

  // Model CRUD
  if (body.action === 'upsert_model' && body.model) {
    const m = await upsertModel(env.DB, {
      provider_id: body.model.provider_id,
      name: body.model.name,
      model_id: body.model.model_id,
      max_tokens: body.model.max_tokens,
    });
    return json({ ok: true, model: m });
  }

  if (body.action === 'delete_model') {
    if (!body.model_id) return badRequest('Missing model_id');
    await deleteModel(env.DB, body.model_id);
    return json({ ok: true });
  }

  if (body.action === 'toggle_model') {
    if (!body.model_id) return badRequest('Missing model_id');
    await env.DB
      .prepare('UPDATE "ai_model" SET "is_active" = ? WHERE "id" = ?')
      .bind(body.active ? 1 : 0, body.model_id)
      .run();
    return json({ ok: true });
  }

  return badRequest('Unknown action');
};
