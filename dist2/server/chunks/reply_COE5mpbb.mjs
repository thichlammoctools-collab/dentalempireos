globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, n as notFound, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { g as getQuestion, r as replyToQuestion } from "./question-db_BOj0TAm2.mjs";
const prerender = false;
const POST = async ({ params, request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: "unauthorized" }, 401);
  const id = params.id;
  if (!id) return notFound();
  const question = await getQuestion(env.DB, id);
  if (!question) return notFound();
  if (question.user_id !== user.id) return notFound();
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { body: content } = body;
  if (!content) return badRequest("body is required");
  try {
    const reply = await replyToQuestion(env.DB, id, user.id, content, false);
    return json(reply, 201);
  } catch (err) {
    console.error("[POST /api/questions/:id/reply] DB error:", err);
    return json({ error: "Database error" }, 500);
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
