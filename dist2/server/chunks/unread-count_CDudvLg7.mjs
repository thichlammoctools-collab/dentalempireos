globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
import { e as getUnreadCount } from "./question-db_BOj0TAm2.mjs";
const prerender = false;
const GET = async ({ locals }) => {
  const user = locals.user;
  if (!user) return json({ error: "unauthorized" }, 401);
  const count = await getUnreadCount(env.DB, user.id);
  return json({ count });
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
