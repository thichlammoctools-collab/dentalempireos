globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest, s as slugify } from "./api-helpers_DYIwbpI_.mjs";
import { b as listProducts, f as upsertProduct } from "./payos-db_0fnCQ6tl.mjs";
const prerender = false;
const GET = async () => {
  const products = await listProducts(env.DB);
  return json(products);
};
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { name, type, price, description, duration_days, reference_id, app_id, is_active } = body;
  if (!name) return badRequest("name is required");
  if (!type) return badRequest("type is required");
  if (price == null || price < 0) return badRequest("price must be >= 0");
  const id = slugify(name) + "-" + Date.now().toString(36);
  await upsertProduct(env.DB, {
    id,
    name,
    type,
    price,
    description,
    duration_days,
    reference_id,
    app_id: app_id || null,
    is_active
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
