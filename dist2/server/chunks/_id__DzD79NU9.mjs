globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, n as notFound, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { g as getResource, d as deleteResource, u as upsertResource } from "./resource-db_vN7y6pUI.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const row = await getResource(env.DB, id);
  if (!row) return notFound();
  return json(row);
};
const PUT = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const existing = await getResource(env.DB, id);
  if (!existing) return notFound();
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { title, description, icon, file_ext, file_url, category, tier, tag, sort_order } = body;
  await upsertResource(env.DB, {
    id,
    title: title ?? existing.title,
    description: description ?? existing.description,
    icon: icon ?? existing.icon,
    file_ext: file_ext ?? existing.file_ext,
    file_url: file_url ?? existing.file_url,
    category: category ?? existing.category,
    tier: tier ?? existing.tier,
    tag: tag ?? existing.tag,
    sort_order: sort_order ?? existing.sort_order
  });
  return json({ id, updated: true });
};
const DELETE = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const existing = await getResource(env.DB, id);
  if (!existing) return notFound();
  await deleteResource(env.DB, id);
  return json({ deleted: true });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
