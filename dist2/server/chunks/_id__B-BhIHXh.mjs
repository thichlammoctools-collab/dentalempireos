globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { d as deleteReview } from "./review-db_BEpAiHjt.mjs";
const prerender = false;
const DELETE = async ({ params, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: "Unauthorized" }, 401);
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const deleted = await deleteReview(env.DB, id, user.id);
  if (!deleted) return json({ error: "Review not found or not yours" }, 404);
  return json({ ok: true });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
