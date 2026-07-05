globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
import { a as listOrders } from "./payos-db_0fnCQ6tl.mjs";
const prerender = false;
const GET = async ({ url }) => {
  const status = url.searchParams.get("status") ?? void 0;
  const userId = url.searchParams.get("user_id") ?? void 0;
  const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);
  const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
  const result = await listOrders(env.DB, {
    status,
    user_id: userId,
    limit,
    offset
  });
  return json(result);
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
