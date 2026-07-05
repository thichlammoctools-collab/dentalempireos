globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, n as notFound, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { g as getApp, d as deleteApp, u as upsertApp } from "./app-db_BINE4Y41.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const row = await getApp(env.DB, id);
  if (!row) return notFound();
  return json(row);
};
const PATCH = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const existing = await getApp(env.DB, id);
  if (!existing) return notFound();
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON");
  await upsertApp(env.DB, {
    id,
    slug: typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : existing.slug,
    name: typeof body.name === "string" && body.name.trim() ? body.name.trim() : existing.name,
    description: typeof body.description === "string" ? body.description : existing.description,
    type: existing.type,
    status: typeof body.status === "string" ? body.status : existing.status,
    is_free: typeof body.is_free === "number" ? body.is_free : existing.is_free,
    config_json: body.config_json !== void 0 ? body.config_json : existing.config_json,
    linked_scanner_id: existing.linked_scanner_id
  });
  return json({ success: true });
};
const PUT = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const existing = await getApp(env.DB, id);
  if (!existing) return notFound();
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  await upsertApp(env.DB, {
    id,
    slug: body.slug ?? existing.slug,
    name: body.name ?? existing.name,
    description: body.description ?? existing.description,
    type: body.type ?? existing.type,
    status: body.status ?? existing.status,
    is_free: body.is_free ?? existing.is_free,
    config_json: body.config_json ?? existing.config_json,
    linked_scanner_id: existing.linked_scanner_id
  });
  return json({ id, updated: true });
};
const DELETE = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const existing = await getApp(env.DB, id);
  if (!existing) return notFound();
  await deleteApp(env.DB, id);
  return json({ deleted: true });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PATCH,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
