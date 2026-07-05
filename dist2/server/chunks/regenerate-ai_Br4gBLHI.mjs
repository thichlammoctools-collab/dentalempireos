globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { r as runAiAnalysis, a as runPlanAnalysis } from "./scanner-ai_Ct7era7K.mjs";
import { i as isAiEnabled } from "./ai-settings-db_DJhiMzYX.mjs";
import { g as getScannerResponse } from "./scanner-response-db_DlgoOmv3.mjs";
const prerender = false;
const POST = async ({ url, locals }) => {
  const isAdmin = locals.user && (env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean).includes(locals.user.email.toLowerCase());
  if (!isAdmin || !locals.user) {
    return json({ error: "unauthorized" }, 401);
  }
  const id = parseInt(url.searchParams.get("id") ?? "", 10);
  if (!id) return badRequest("id is required");
  const response = await getScannerResponse(env.DB, id);
  if (!response) return badRequest("Response not found");
  const aiEnabled = await isAiEnabled(env.DB);
  if (!aiEnabled) {
    return json({ error: "AI is not enabled. Please configure AI settings first." }, 400);
  }
  const results = {};
  try {
    await runAiAnalysis(env.DB, id);
    results.analysis = "done";
  } catch (err) {
    results.error = `Analysis failed: ${err instanceof Error ? err.message : String(err)}`;
  }
  try {
    await runPlanAnalysis(env.DB, id);
    results.plan = "done";
  } catch (err) {
    results.error = results.error ? `${results.error} | Plan failed: ${err instanceof Error ? err.message : String(err)}` : `Plan failed: ${err instanceof Error ? err.message : String(err)}`;
  }
  if (results.error) {
    return json(results, 500);
  }
  return json({ success: true, ...results });
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
