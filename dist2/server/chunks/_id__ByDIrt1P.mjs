globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, n as notFound, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { d as getProduct, e as deleteProduct, f as upsertProduct } from "./payos-db_0fnCQ6tl.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const row = await getProduct(env.DB, id);
  if (!row) return notFound();
  return json(row);
};
const PATCH = async ({ params, request, locals }) => {
  if (!locals.user) return json({ error: "unauthorized" }, 401);
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const existing = await getProduct(env.DB, id);
  if (!existing) return notFound();
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON");
  const updates = {};
  if (typeof body.price === "number" && body.price >= 0) updates.price = body.price;
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active ? 1 : 0;
  if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim();
  if (typeof body.description === "string") updates.description = body.description.trim();
  if (typeof body.app_id === "string" || body.app_id === null) updates.app_id = body.app_id ?? null;
  if (Object.keys(updates).length === 0) return badRequest("No fields to update");
  await upsertProduct(env.DB, {
    id,
    name: updates.name ?? existing.name,
    type: existing.type,
    price: updates.price ?? existing.price,
    description: updates.description ?? existing.description ?? void 0,
    duration_days: existing.duration_days,
    reference_id: existing.reference_id,
    app_id: updates.app_id !== void 0 ? updates.app_id : existing.app_id,
    is_active: updates.is_active ?? existing.is_active
  });
  return json({ success: true });
};
const PUT = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const existing = await getProduct(env.DB, id);
  if (!existing) return notFound();
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { name, type, price, description, duration_days, reference_id, app_id, is_active } = body;
  await upsertProduct(env.DB, {
    id,
    name: name ?? existing.name,
    type: type ?? existing.type,
    price: price ?? existing.price,
    description: description ?? existing.description ?? void 0,
    duration_days: duration_days ?? existing.duration_days,
    reference_id: reference_id ?? existing.reference_id,
    app_id: app_id !== void 0 ? app_id : existing.app_id,
    is_active: is_active ?? existing.is_active
  });
  return json({ id, updated: true });
};
const DELETE = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const existing = await getProduct(env.DB, id);
  if (!existing) return notFound();
  await deleteProduct(env.DB, id);
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
