globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json, n as notFound } from "./api-helpers_DYIwbpI_.mjs";
import { i as listQuestionsBySection, j as getSectionById, v as validateQuestionInput, k as addQuestion } from "./survey-config-db_AxTlbaW3.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const sectionId = parseInt(params.sid ?? "", 10);
  if (!sectionId) return badRequest("sid is required");
  const questions = await listQuestionsBySection(env.DB, sectionId);
  return json(questions);
};
const POST = async ({ params, request }) => {
  const sectionId = parseInt(params.sid ?? "", 10);
  if (!sectionId) return badRequest("sid is required");
  const section = await getSectionById(env.DB, sectionId);
  if (!section) return notFound("Section not found");
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const validation = validateQuestionInput(body);
  if (!validation.ok) {
    return badRequest(`Validation failed: ${validation.errors.join(", ")}`);
  }
  const row = await addQuestion(env.DB, {
    section_id: sectionId,
    question_id: body.question_id,
    order_idx: body.order_idx,
    type: body.type,
    label_vi: body.label_vi,
    label_en: body.label_en ?? "",
    placeholder_vi: body.placeholder_vi ?? null,
    placeholder_en: body.placeholder_en ?? null,
    options_vi: body.options_vi ?? null,
    options_en: body.options_en ?? null,
    scale_labels_vi: body.scale_labels_vi ?? null,
    scale_labels_en: body.scale_labels_en ?? null,
    required: body.required ?? 0,
    anchor: body.anchor ?? 0,
    weight: body.weight ?? null,
    dimension: body.dimension ?? null
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
