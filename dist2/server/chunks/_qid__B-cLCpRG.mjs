globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json, n as notFound } from "./api-helpers_DYIwbpI_.mjs";
import { f as deleteQuestion, h as getQuestionById, v as validateQuestionInput, u as updateQuestion } from "./survey-config-db_CRuLFWXk.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const qid = parseInt(params.qid ?? "", 10);
  if (!qid) return badRequest("qid is required");
  const row = await getQuestionById(env.DB, qid);
  if (!row) return notFound("Question not found");
  return json(row);
};
const PATCH = async ({ params, request }) => {
  const qid = parseInt(params.qid ?? "", 10);
  if (!qid) return badRequest("qid is required");
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const validation = validateQuestionInput(body);
  if (!validation.ok) {
    return badRequest(`Validation failed: ${validation.errors.join(", ")}`);
  }
  const updated = await updateQuestion(env.DB, qid, body);
  if (!updated) return notFound("Question not found");
  return json({ id: qid, updated: true });
};
const DELETE = async ({ params }) => {
  const qid = parseInt(params.qid ?? "", 10);
  if (!qid) return badRequest("qid is required");
  await deleteQuestion(env.DB, qid);
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
