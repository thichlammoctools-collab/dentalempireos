globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { l as listUsers, t as toggleUserActive } from "./user-db_CM6xE649.mjs";
const prerender = false;
const GET = async () => {
  try {
    const users = await listUsers(env.DB);
    const active = users.filter((u) => u.is_active === 1).length;
    return json({ users, total: users.length, active, inactive: users.length - active });
  } catch (err) {
    console.error("list users error:", err);
    return badRequest("Failed to list users");
  }
};
const PATCH = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { userId } = body;
  if (!userId) return badRequest("userId is required");
  try {
    const updated = await toggleUserActive(env.DB, userId);
    if (!updated) return badRequest("User not found");
    return json({ ok: true, user: updated });
  } catch (err) {
    console.error("toggle user active error:", err);
    return badRequest("Failed to toggle user");
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
