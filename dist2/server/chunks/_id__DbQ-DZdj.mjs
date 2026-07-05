globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, n as notFound } from "./api-helpers_DYIwbpI_.mjs";
import { g as getQuestion, a as getReplies } from "./question-db_BOj0TAm2.mjs";
const prerender = false;
const GET = async ({ params, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: "unauthorized" }, 401);
  const id = params.id;
  if (!id) return notFound();
  const question = await getQuestion(env.DB, id);
  if (!question) return notFound();
  if (question.user_id !== user.id) return notFound();
  const replies = await getReplies(env.DB, id);
  return json({ question, replies });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
