globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { r as runAiAnalysis, a as runPlanAnalysis } from "./scanner-ai_Dhxm0FJa.mjs";
import { i as isResponseOwnedByUser } from "./scanner-history-db_dHxdXqnG.mjs";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
const prerender = false;
const POST = async (ctx) => {
  const body = await ctx.request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const responseId = typeof body.response_id === "number" ? body.response_id : parseInt(String(body.response_id), 10);
  if (!responseId || Number.isNaN(responseId)) {
    return badRequest("response_id is required");
  }
  const type = typeof body.type === "string" ? body.type : "all";
  if (!["analysis", "plan", "all"].includes(type)) {
    return badRequest('type must be "analysis", "plan", or "all"');
  }
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return json({ error: "Vui lòng đăng nhập" }, 401);
  }
  const owned = await isResponseOwnedByUser(env.DB, session.user.id, responseId);
  if (!owned) {
    return json({ error: "Không có quyền với kết quả này" }, 403);
  }
  const tasks = [];
  if (type === "analysis" || type === "all") {
    tasks.push(runAiAnalysis(env.DB, responseId));
  }
  if (type === "plan" || type === "all") {
    tasks.push(runPlanAnalysis(env.DB, responseId));
  }
  if (ctx.waitUntil) {
    ctx.waitUntil(Promise.allSettled(tasks));
  } else {
    Promise.allSettled(tasks).catch((err) => {
      console.error("[run-ai] Background task error:", err);
    });
  }
  return json({ queued: true, type }, 202);
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
