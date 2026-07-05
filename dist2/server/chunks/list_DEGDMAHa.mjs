globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
import { S as SEED_REGISTRY } from "./registry_CVQmd__G.mjs";
const prerender = false;
const GET = async () => {
  let existingIds = /* @__PURE__ */ new Set();
  try {
    const result = await env.DB.prepare('SELECT id FROM "survey_definition"').all();
    existingIds = new Set((result.results ?? []).map((r) => r.id));
  } catch {
  }
  const seeds = Object.values(SEED_REGISTRY).map((s) => ({
    id: s.id,
    slug: s.slug,
    title_vi: s.title_vi,
    type: s.survey_type ?? "full",
    is_free: s.is_free ?? 0,
    sections: s.sections.length,
    questions: s.sections.reduce((sum, sec) => sum + sec.questions.length, 0),
    inDb: existingIds.has(s.id)
  }));
  return json({ seeds });
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
