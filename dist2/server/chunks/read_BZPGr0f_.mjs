globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
import { m as markNotificationRead, d as markAllNotificationsRead } from "./question-db_BOj0TAm2.mjs";
const prerender = false;
const POST = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: "unauthorized" }, 401);
  const body = await request.json().catch(() => null);
  if (body?.id) {
    await markNotificationRead(env.DB, body.id);
  } else {
    await markAllNotificationsRead(env.DB, user.id);
  }
  return json({ ok: true });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
