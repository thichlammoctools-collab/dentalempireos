globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { l as listProviders, a as listModels, u as upsertProvider, t as toggleProviderActive, d as deleteProvider, b as upsertModel, c as deleteModel } from "./ai-provider-db_DV3FpOjN.mjs";
const prerender = false;
const GET = async () => {
  const providers = await listProviders(env.DB);
  const models = await listModels(env.DB);
  const modelsByProvider = /* @__PURE__ */ new Map();
  for (const m of models) {
    if (!modelsByProvider.has(m.provider_id)) modelsByProvider.set(m.provider_id, []);
    modelsByProvider.get(m.provider_id).push(m);
  }
  return json({ providers, models: modelsByProvider });
};
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON");
  if (body.action === "upsert_provider" && body.provider) {
    const p = await upsertProvider(env.DB, {
      name: body.provider.name,
      slug: body.provider.slug,
      base_url: body.provider.base_url,
      api_key: body.provider.api_key || "",
      is_active: body.provider.is_active ? 1 : 0
    });
    return json({ ok: true, provider: p });
  }
  if (body.action === "toggle_provider") {
    if (!body.provider_id) return badRequest("Missing provider_id");
    await toggleProviderActive(env.DB, body.provider_id, !!body.active);
    return json({ ok: true });
  }
  if (body.action === "delete_provider") {
    if (!body.provider_id) return badRequest("Missing provider_id");
    await deleteProvider(env.DB, body.provider_id);
    return json({ ok: true });
  }
  if (body.action === "upsert_model" && body.model) {
    const m = await upsertModel(env.DB, {
      provider_id: body.model.provider_id,
      name: body.model.name,
      model_id: body.model.model_id,
      max_tokens: body.model.max_tokens
    });
    return json({ ok: true, model: m });
  }
  if (body.action === "delete_model") {
    if (!body.model_id) return badRequest("Missing model_id");
    await deleteModel(env.DB, body.model_id);
    return json({ ok: true });
  }
  if (body.action === "toggle_model") {
    if (!body.model_id) return badRequest("Missing model_id");
    await env.DB.prepare('UPDATE "ai_model" SET "is_active" = ? WHERE "id" = ?').bind(body.active ? 1 : 0, body.model_id).run();
    return json({ ok: true });
  }
  return badRequest("Unknown action");
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
