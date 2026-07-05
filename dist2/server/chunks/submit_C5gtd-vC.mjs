globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { d as getSurveyDefinitionById, a as parseScoringRules } from "./survey-config-db_CRuLFWXk.mjs";
import { e as buildResponsesMap, v as validateRequiredAnswers, f as createScannerResponse, p as parseScores, h as getScoreLevel } from "./scanner-response-db_CWaYXhV5.mjs";
import { r as runAiAnalysis, a as runPlanAnalysis } from "./scanner-ai_BD286-j4.mjs";
import { i as isAiEnabled } from "./ai-settings-db_DJhiMzYX.mjs";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
import { u as upsertClinicProfile } from "./clinic-profile-db_Pku6qJUb.mjs";
import { a as addToHistory } from "./scanner-history-db_dHxdXqnG.mjs";
import { h as hasAccess } from "./payos-db_0fnCQ6tl.mjs";
const prerender = false;
function asString(v) {
  if (v === null || v === void 0) return null;
  if (typeof v === "string") return v.trim() || null;
  if (typeof v === "number") return String(v);
  return null;
}
function asInt(v) {
  if (v === null || v === void 0 || v === "") return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}
const POST = async (ctx) => {
  const body = await ctx.request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const surveyId = asString(body.survey_id);
  if (!surveyId) return badRequest("survey_id is required");
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return json({ requiresAuth: true, message: "Vui lòng đăng nhập để tiếp tục" }, 401);
  }
  const lang = body.lang === "en" ? "en" : "vi";
  const def = await getSurveyDefinitionById(env.DB, surveyId);
  if (!def) return badRequest("Survey not found");
  if (def.status !== "active") return badRequest("Survey is not active");
  if (!def.is_free) {
    const appRow = await env.DB.prepare('SELECT "id" FROM "ai_application" WHERE "slug" = ? OR "id" = ?').bind(def.slug, `survey-${def.id}`).first();
    if (appRow) {
      const prodRow = await env.DB.prepare('SELECT "id" FROM "product" WHERE "app_id" = ? AND "is_active" = 1').bind(appRow.id).first();
      if (prodRow) {
        const canAccess = await hasAccess(env.DB, session.user.id, prodRow.id);
        if (!canAccess) {
          return json({ requiresAuth: true, message: "Bạn cần mở khóa scanner này trước." }, 403);
        }
      }
    }
  }
  const clinicName = asString(body.clinic_name);
  if (!clinicName) return badRequest("clinic_name is required");
  const email = asString(body.email);
  if (email && !email.includes("@")) return badRequest("Invalid email");
  const sectionsResult = await env.DB.prepare(
    `SELECT q.*
       FROM "survey_question" q
       INNER JOIN "survey_section" s ON q."section_id" = s."id"
       WHERE s."survey_id" = ?`
  ).bind(surveyId).all();
  const allQuestions = sectionsResult.results ?? [];
  const responsesMap = buildResponsesMap(body, allQuestions);
  const requiredCheck = validateRequiredAnswers(responsesMap, allQuestions);
  if (!requiredCheck.ok) {
    return badRequest(`Missing required answers: ${requiredCheck.missing.join(", ")}`);
  }
  const scoringRules = parseScoringRules(def.scoring_rules);
  const { id } = await createScannerResponse(env.DB, {
    survey_id: surveyId,
    lang,
    owner_name: asString(body.owner_name),
    clinic_name: clinicName,
    clinic_address: asString(body.clinic_address),
    email,
    years_in_operation: asInt(body.years_in_operation),
    staff_count: asInt(body.staff_count),
    responses: responsesMap
  }, scoringRules);
  const scoringResult = await env.DB.prepare("SELECT scores_json FROM scanner_response WHERE id = ?").bind(id).first();
  const parsedScores = scoringResult?.scores_json ? parseScores(scoringResult.scores_json) : {};
  const totalScore = parsedScores.total ?? 0;
  const level = getScoreLevel(totalScore, scoringRules ?? {
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  }, lang);
  const saveProfile = body.save_profile === true;
  if (saveProfile) {
    await upsertClinicProfile(env.DB, {
      id: session.user.id,
      name: asString(body.owner_name),
      clinic_name: clinicName,
      clinic_address: asString(body.clinic_address)
    });
  }
  await addToHistory(env.DB, {
    user_id: session.user.id,
    survey_id: surveyId,
    response_id: id,
    score_total: totalScore,
    score_label: level.label_vi
  });
  if (await isAiEnabled(env.DB)) {
    runAiAnalysis(env.DB, id).catch((err) => {
      console.error("[submit] AI analysis failed:", err);
    });
    runPlanAnalysis(env.DB, id).catch((err) => {
      console.error("[submit] AI plan failed:", err);
    });
  }
  return json(
    {
      success: true,
      id,
      redirect: `/scanner/result/${id}`
    },
    201
  );
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
