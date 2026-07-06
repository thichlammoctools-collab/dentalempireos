globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, n as notFound, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { d as getSurveyDefinitionById, r as deleteSurveyDefinition, g as getSurveyDefinitionFull, s as upsertSurveyDefinition } from "./survey-config-db_CRuLFWXk.mjs";
const prerender = false;
const GET = async ({ params, url }) => {
  const id = params.id;
  if (!id) return badRequest("id is required");
  const full = url.searchParams.get("full") === "1";
  const result = full ? await getSurveyDefinitionFull(env.DB, id) : await getSurveyDefinitionById(env.DB, id);
  if (!result) return notFound("Definition not found");
  return json(result);
};
const PATCH = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest("id is required");
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const existing = await getSurveyDefinitionById(env.DB, id);
  if (!existing) return notFound("Definition not found");
  const updated = await upsertSurveyDefinition(env.DB, {
    id: existing.id,
    slug: body.slug?.trim() || existing.slug,
    title_vi: body.title_vi?.trim() ?? existing.title_vi,
    title_en: body.title_en ?? existing.title_en,
    description_vi: body.description_vi !== void 0 ? body.description_vi : existing.description_vi,
    description_en: body.description_en !== void 0 ? body.description_en : existing.description_en,
    subtitle_vi: body.subtitle_vi !== void 0 ? body.subtitle_vi : existing.subtitle_vi,
    subtitle_en: body.subtitle_en !== void 0 ? body.subtitle_en : existing.subtitle_en,
    chapter_refs: body.chapter_refs !== void 0 ? body.chapter_refs : void 0,
    status: body.status ?? existing.status,
    is_free: body.is_free ?? existing.is_free,
    survey_type: body.survey_type ?? existing.survey_type,
    lead_fields: body.lead_fields !== void 0 ? body.lead_fields : void 0,
    scoring_rules: body.scoring_rules !== void 0 ? body.scoring_rules : void 0,
    ai_config: body.ai_config !== void 0 ? body.ai_config : void 0,
    translations_vi: body.translations_vi !== void 0 ? body.translations_vi : void 0,
    translations_en: body.translations_en !== void 0 ? body.translations_en : void 0,
    order_index: body.order_index ?? existing.order_index
  });
  return json({ id: updated.id, updated: true });
};
const DELETE = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("id is required");
  const existing = await getSurveyDefinitionById(env.DB, id);
  if (!existing) return notFound("Definition not found");
  await deleteSurveyDefinition(env.DB, id);
  return json({ deleted: true });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
