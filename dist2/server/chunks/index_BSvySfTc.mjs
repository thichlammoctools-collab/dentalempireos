globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest, s as slugify } from "./api-helpers_DYIwbpI_.mjs";
import { l as listSurveyDefinitions, s as upsertSurveyDefinition } from "./survey-config-db_FzodKoeP.mjs";
const prerender = false;
const GET = async () => {
  const defs = await listSurveyDefinitions(env.DB);
  return json(defs);
};
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  if (!body.title_vi?.trim()) return badRequest("title_vi là bắt buộc");
  const slug = body.slug?.trim() || slugify(body.title_vi);
  const id = body.id?.trim() || `${slug}-${Date.now().toString(36)}`;
  const row = await upsertSurveyDefinition(env.DB, {
    id,
    slug,
    title_vi: body.title_vi.trim(),
    title_en: body.title_en?.trim() ?? "",
    description_vi: body.description_vi ?? null,
    description_en: body.description_en ?? null,
    subtitle_vi: body.subtitle_vi ?? null,
    subtitle_en: body.subtitle_en ?? null,
    chapter_refs: body.chapter_refs ?? null,
    status: body.status ?? "draft",
    is_free: body.is_free ?? 0,
    survey_type: body.survey_type ?? "full",
    lead_fields: body.lead_fields ?? null,
    scoring_rules: body.scoring_rules ?? null,
    ai_config: body.ai_config ?? null,
    translations_vi: body.translations_vi ?? null,
    translations_en: body.translations_en ?? null,
    order_index: body.order_index ?? 0
  });
  return json({ id: row.id, slug: row.slug }, 201);
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
