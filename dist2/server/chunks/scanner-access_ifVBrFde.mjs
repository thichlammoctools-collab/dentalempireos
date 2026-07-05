globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
import { h as hasAccess } from "./payos-db_0fnCQ6tl.mjs";
import { l as listSurveyDefinitions } from "./survey-config-db_FzodKoeP.mjs";
const prerender = false;
const GET = async ({ locals }) => {
  if (!locals.user) return json({ items: [] });
  const surveys = await listSurveyDefinitions(env.DB, { status: "active" });
  const items = await Promise.all(
    surveys.map(async (s) => {
      let productPrice = null;
      let productId = null;
      try {
        const app = await env.DB.prepare('SELECT "id" FROM "ai_application" WHERE "slug" = ? OR "id" = ?').bind(s.slug, `survey-${s.id}`).first();
        if (app) {
          const prod = await env.DB.prepare('SELECT "id", "price" FROM "product" WHERE "app_id" = ? AND "is_active" = 1').bind(app.id).first();
          if (prod) {
            productId = prod.id;
            productPrice = prod.price;
          }
        }
      } catch {
      }
      let has_access = false;
      if (productId) {
        try {
          has_access = await hasAccess(env.DB, locals.user.id, productId);
        } catch {
        }
      }
      return {
        id: s.id,
        slug: s.slug,
        title: s.title_vi,
        is_free: s.is_free === 1,
        has_access,
        price: productPrice
      };
    })
  );
  return json({ items });
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
