globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { g as getScannerResponse } from "./scanner-response-db_DlgoOmv3.mjs";
import { h as hasAccess } from "./payos-db_0fnCQ6tl.mjs";
const prerender = false;
const GET = async ({ url }) => {
  const responseId = parseInt(url.searchParams.get("id") ?? "", 10);
  const productId = url.searchParams.get("product_id");
  if (!responseId) return badRequest("id is required");
  if (!productId) return badRequest("product_id is required");
  const response = await getScannerResponse(env.DB, responseId);
  if (!response || !response.email) return json({ hasAccess: false });
  const user = await env.DB.prepare('SELECT id FROM "user" WHERE email = ? LIMIT 1').bind(response.email).first();
  if (!user) return json({ hasAccess: false });
  const access = await hasAccess(env.DB, user.id, productId);
  return json({ hasAccess: access });
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
