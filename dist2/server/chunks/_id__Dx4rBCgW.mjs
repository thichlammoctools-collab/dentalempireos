globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { n as notFound, j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { g as getQuestion, a as getReplies, u as updateQuestionStatus } from "./question-db_BOj0TAm2.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const id = params.id;
  if (!id) return notFound();
  const question = await getQuestion(env.DB, id);
  if (!question) return notFound();
  const replies = await getReplies(env.DB, id);
  return json({ question, replies });
};
const PATCH = async ({ params, request }) => {
  const id = params.id;
  if (!id) return notFound();
  const question = await getQuestion(env.DB, id);
  if (!question) return notFound();
  const body = await request.json().catch(() => null);
  if (!body?.status) return badRequest("status is required");
  const validStatuses = ["open", "answered", "closed"];
  if (!validStatuses.includes(body.status)) {
    return badRequest(`status must be one of: ${validStatuses.join(", ")}`);
  }
  await updateQuestionStatus(env.DB, id, body.status);
  return json({ ok: true });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
