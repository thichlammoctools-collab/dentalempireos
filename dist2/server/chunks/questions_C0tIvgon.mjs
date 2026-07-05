globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { h as listQuestionsByUser, i as createQuestion } from "./question-db_BOj0TAm2.mjs";
const prerender = false;
const GET = async ({ locals }) => {
  const user = locals.user;
  if (!user) return json({ error: "unauthorized" }, 401);
  const questions = await listQuestionsByUser(env.DB, user.id);
  return json(questions);
};
const POST = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: "unauthorized" }, 401);
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { chapter_id, section_id, title, body: content } = body;
  if (!chapter_id || !title || !content) {
    return badRequest("chapter_id, title, body are required");
  }
  const question = await createQuestion(
    env.DB,
    user.id,
    chapter_id,
    section_id ?? null,
    title,
    content
  );
  return json(question, 201);
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
