globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest, s as slugify } from "./api-helpers_DYIwbpI_.mjs";
import { a as listApps, u as upsertApp } from "./app-db_BINE4Y41.mjs";
const prerender = false;
const GET = async () => {
  const apps = await listApps(env.DB);
  return json(apps);
};
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const {
    name,
    slug,
    type,
    description,
    status,
    is_free,
    config_json
  } = body;
  if (!name) return badRequest("name is required");
  if (!type) return badRequest("type is required");
  if (!["survey", "ebook_ai", "course_ai", "tool", "generator"].includes(type)) {
    return badRequest("type must be one of survey/ebook_ai/course_ai/tool/generator");
  }
  const finalSlug = slug?.trim() || slugify(name);
  const id = "app-" + finalSlug + "-" + Date.now().toString(36);
  await upsertApp(env.DB, {
    id,
    slug: finalSlug,
    name,
    description: description ?? null,
    type,
    status: status ?? "draft",
    is_free: is_free ? 1 : 0,
    config_json: config_json ?? null
  });
  return json({ id }, 201);
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
