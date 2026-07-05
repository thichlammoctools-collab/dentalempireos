globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
import { l as listAllQuestions, b as getQuestionStats } from "./question-db_BOj0TAm2.mjs";
const prerender = false;
const GET = async ({ url }) => {
  const status = url.searchParams.get("status") ?? "all";
  const questions = await listAllQuestions(env.DB, status);
  const stats = await getQuestionStats(env.DB);
  return json({ questions, stats });
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
