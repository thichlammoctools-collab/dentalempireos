globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
import { h as hasAccess } from "./payos-db_0fnCQ6tl.mjs";
async function checkUserAccess(db, userId, productId) {
  return hasAccess(db, userId, productId);
}
async function checkUserAccessBatch(db, userId, productIds) {
  const result = /* @__PURE__ */ new Map();
  if (productIds.length === 0) return result;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const placeholders = productIds.map(() => "?").join(",");
  const { results } = await db.prepare(
    `SELECT "product_id", "expires_at" FROM "access"
       WHERE "user_id" = ? AND "product_id" IN (${placeholders}) AND "is_active" = 1`
  ).bind(userId, ...productIds).all();
  const activeSet = new Set(
    results.filter((r) => !r.expires_at || r.expires_at > now).map((r) => r.product_id)
  );
  for (const id of productIds) {
    result.set(id, activeSet.has(id));
  }
  return result;
}
const prerender = false;
const GET = async ({ url, locals }) => {
  const orderId = url.searchParams.get("order_id");
  if (orderId) {
    try {
      const order = await env.DB.prepare('SELECT status, product_id FROM "order" WHERE id = ? LIMIT 1').bind(orderId).first();
      if (order) {
        return json({ status: order.status, product_id: order.product_id });
      }
    } catch {
    }
    return json({ status: "unknown" });
  }
  if (!locals.user) return json({ hasAccess: false });
  const productId = url.searchParams.get("product_id");
  const productIds = url.searchParams.get("product_ids");
  if (productId) {
    const access = await checkUserAccess(env.DB, locals.user.id, productId);
    return json({ hasAccess: access });
  }
  if (productIds) {
    const ids = productIds.split(",").filter(Boolean);
    const accessMap = await checkUserAccessBatch(env.DB, locals.user.id, ids);
    const result = {};
    accessMap.forEach((v, k) => {
      result[k] = v;
    });
    return json({ access: result });
  }
  return json({ error: "Thiếu product_id hoặc product_ids" }, 400);
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
