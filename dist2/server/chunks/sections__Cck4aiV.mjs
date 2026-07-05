globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json, n as notFound } from "./api-helpers_DYIwbpI_.mjs";
import { o as listSectionsBySurvey, d as getSurveyDefinitionById, q as addSection } from "./survey-config-db_CRuLFWXk.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const surveyId = params.id;
  if (!surveyId) return badRequest("id is required");
  const sections = await listSectionsBySurvey(env.DB, surveyId);
  return json(sections);
};
const POST = async ({ params, request }) => {
  const surveyId = params.id;
  if (!surveyId) return badRequest("id is required");
  const def = await getSurveyDefinitionById(env.DB, surveyId);
  if (!def) return notFound("Definition not found");
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  if (!body.title_vi?.trim()) return badRequest("title_vi là bắt buộc");
  const row = await addSection(env.DB, {
    survey_id: surveyId,
    order_idx: body.order_idx,
    title_vi: body.title_vi.trim(),
    title_en: body.title_en ?? "",
    subtitle_vi: body.subtitle_vi ?? null,
    subtitle_en: body.subtitle_en ?? null,
    ref: body.ref ?? null,
    icon: body.icon ?? null
  });
  return json({ id: row.id }, 201);
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
