globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest, s as slugify } from "./api-helpers_DYIwbpI_.mjs";
import { l as listResources, u as upsertResource } from "./resource-db_vN7y6pUI.mjs";
const prerender = false;
const GET = async () => {
  const resources = await listResources(env.DB);
  return json(resources);
};
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { title, description, icon, file_ext, file_url, category, tier, tag, sort_order } = body;
  if (!title) return badRequest("title is required");
  const id = slugify(title);
  await upsertResource(env.DB, {
    id,
    title,
    description,
    icon,
    file_ext,
    file_url,
    category,
    tier,
    tag,
    sort_order
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
