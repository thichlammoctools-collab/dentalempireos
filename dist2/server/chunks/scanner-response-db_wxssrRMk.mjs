globalThis.process ??= {};
globalThis.process.env ??= {};
import { p as parseScaleLabels } from "./survey-config-db_AxTlbaW3.mjs";
const DEFAULT_THRESHOLDS = {
  excellent: 75,
  good: 55,
  needs_work: 35,
  critical: 0
};
function scale1to5to100(avg5) {
  if (!Number.isFinite(avg5)) return 0;
  return Math.round((avg5 - 1) / 4 * 100 * 10) / 10;
}
function dimensionAverage(responses, questionIds) {
  const values = [];
  for (const id of questionIds) {
    const v = responses[id];
    if (typeof v === "number" && v >= 1 && v <= 5) {
      values.push(v);
    }
  }
  if (values.length === 0) return 0;
  const sum = values.reduce((s, v) => s + v, 0);
  return sum / values.length;
}
function dimensionCountIf(responses, questionIds, predicate) {
  let count = 0;
  for (const id of questionIds) {
    if (predicate(responses[id])) count++;
  }
  return count;
}
function calculateDimensionScore(responses, dimension) {
  switch (dimension.formula) {
    case "avg":
      return scale1to5to100(dimensionAverage(responses, dimension.question_ids));
    case "sum":
      return dimensionCountIf(responses, dimension.question_ids, (v) => typeof v === "number");
    case "count_if":
      return dimensionCountIf(
        responses,
        dimension.question_ids,
        (v) => v === "yes" || v === true || v === 1
      );
    default:
      return 0;
  }
}
function calculateAllScores(responses, rules) {
  const scores = {};
  for (const dim of rules.dimensions) {
    scores[dim.id] = calculateDimensionScore(responses, dim);
  }
  const dimScores = rules.dimensions.map((d) => scores[d.id] ?? 0);
  if (rules.total_formula === "weighted_average") {
    let totalWeight = 0;
    let weightedSum = 0;
    rules.dimensions.forEach((d, i) => {
      const w = d.weight ?? 1;
      totalWeight += w;
      weightedSum += dimScores[i] * w;
    });
    scores.total = totalWeight > 0 ? Math.round(weightedSum / totalWeight * 10) / 10 : 0;
  } else {
    if (dimScores.length === 0) {
      scores.total = 0;
    } else {
      const avg = dimScores.reduce((s, v) => s + v, 0) / dimScores.length;
      scores.total = Math.round(avg * 10) / 10;
    }
  }
  return scores;
}
function getScoreLevel(score, rules, lang = "vi") {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...rules.thresholds };
  if (score >= thresholds.excellent) {
    return lang === "vi" ? { label_vi: "Vững mạnh", label_en: "Strong", color: "#10b981" } : { label_vi: "Strong", label_en: "Strong", color: "#10b981" };
  }
  if (score >= thresholds.good) {
    return lang === "vi" ? { label_vi: "Đang phát triển", label_en: "Growing", color: "#3b82f6" } : { label_vi: "Growing", label_en: "Growing", color: "#3b82f6" };
  }
  if (score >= thresholds.needs_work) {
    return lang === "vi" ? { label_vi: "Cần chú ý", label_en: "Needs attention", color: "#f59e0b" } : { label_vi: "Needs attention", label_en: "Needs attention", color: "#f59e0b" };
  }
  return lang === "vi" ? { label_vi: "Cần soi chiếu", label_en: "Needs illumination", color: "#ef4444" } : { label_vi: "Needs illumination", label_en: "Needs illumination", color: "#ef4444" };
}
function parseResponses(json) {
  if (!json) return {};
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}
function parseScores(json) {
  if (!json) return {};
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}
function maskEmail(email) {
  const atIdx = email.indexOf("@");
  if (atIdx <= 0) return "***";
  const local = email.slice(0, atIdx);
  const domain = email.slice(atIdx);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"*".repeat(Math.max(3, local.length - 2))}${domain}`;
}
function buildResponsesMap(raw, questions) {
  const map = {};
  for (const q of questions) {
    const value = raw[q.question_id];
    if (value === void 0 || value === null || value === "") continue;
    if (q.type === "select" || q.type === "yesno") {
      const num = typeof value === "number" ? value : parseInt(String(value), 10);
      if (Number.isFinite(num)) {
        map[q.question_id] = num;
      }
    } else {
      map[q.question_id] = String(value);
    }
  }
  return map;
}
function validateRequiredAnswers(responses, questions) {
  const missing = [];
  for (const q of questions) {
    if (q.required === 1) {
      const v = responses[q.question_id];
      if (v === void 0 || v === null || v === "") {
        missing.push(q.question_id);
      }
    }
  }
  return { ok: missing.length === 0, missing };
}
async function createScannerResponse(db, input, scoringRules) {
  const scores = scoringRules ? calculateAllScores(input.responses, scoringRules) : {};
  const result = await db.prepare(
    `INSERT INTO "scanner_response"
        ("survey_id","lang","owner_name","clinic_name","clinic_address","email",
         "years_in_operation","staff_count","responses_json","scores_json")
       VALUES (?,?,?,?,?,?,?,?,?,?)
       RETURNING "id"`
  ).bind(
    input.survey_id,
    input.lang ?? "vi",
    input.owner_name ?? null,
    input.clinic_name ?? null,
    input.clinic_address ?? null,
    input.email ?? null,
    input.years_in_operation ?? null,
    input.staff_count ?? null,
    JSON.stringify(input.responses),
    JSON.stringify(scores)
  ).first();
  if (!result) throw new Error("Failed to insert scanner response");
  return { id: result.id, scores };
}
async function getScannerResponse(db, id) {
  return await db.prepare('SELECT * FROM "scanner_response" WHERE "id" = ?').bind(id).first() ?? null;
}
async function listScannerResponses(db, opts = {}) {
  const { surveyId, limit = 50, offset = 0, minTotalScore, maxTotalScore } = opts;
  const where = ["1=1"];
  const params = [];
  if (surveyId) {
    where.push('"survey_id" = ?');
    params.push(surveyId);
  }
  if (typeof minTotalScore === "number") {
    where.push(`CAST(json_extract("scores_json", '$.total') AS REAL) >= ?`);
    params.push(minTotalScore);
  }
  if (typeof maxTotalScore === "number") {
    where.push(`CAST(json_extract("scores_json", '$.total') AS REAL) <= ?`);
    params.push(maxTotalScore);
  }
  params.push(limit, offset);
  const sql = `
    SELECT * FROM "scanner_response"
    WHERE ${where.join(" AND ")}
    ORDER BY "created_at" DESC
    LIMIT ? OFFSET ?
  `;
  const result = await db.prepare(sql).bind(...params).all();
  return result.results ?? [];
}
async function countScannerResponses(db, surveyId) {
  const sql = surveyId ? 'SELECT COUNT(*) AS total FROM "scanner_response" WHERE "survey_id" = ?' : 'SELECT COUNT(*) AS total FROM "scanner_response"';
  const stmt = db.prepare(sql);
  const row = surveyId ? await stmt.bind(surveyId).first() : await stmt.first();
  return row?.total ?? 0;
}
async function updateAiAnalysis(db, id, analysis) {
  await db.prepare(
    `UPDATE "scanner_response"
       SET "ai_analysis" = ?, "ai_analyzed_at" = datetime('now')
       WHERE "id" = ?`
  ).bind(analysis, id).run();
}
async function updateAiPlan(db, id, plan) {
  await db.prepare(
    `UPDATE "scanner_response"
       SET "ai_plan" = ?
       WHERE "id" = ?`
  ).bind(plan, id).run();
}
function buildAiContext(response, questions) {
  const responses = parseResponses(response.responses_json);
  const scores = parseScores(response.scores_json);
  const enrichedResponses = {};
  for (const q of questions) {
    const v = responses[q.question_id];
    if (v === void 0) continue;
    if (q.type === "select") {
      const labels = parseScaleLabels(q.scale_labels_vi);
      enrichedResponses[q.question_id] = {
        value: v,
        label_vi: labels[String(v)] ?? String(v),
        question_vi: q.label_vi,
        dimension: q.dimension
      };
    } else if (q.type === "radio") {
      enrichedResponses[q.question_id] = {
        value: v,
        question_vi: q.label_vi,
        dimension: q.dimension
      };
    } else {
      enrichedResponses[q.question_id] = {
        value: v,
        question_vi: q.label_vi,
        dimension: q.dimension
      };
    }
  }
  return {
    survey_id: response.survey_id,
    clinic: response.clinic_name,
    owner: response.owner_name,
    years_in_operation: response.years_in_operation,
    staff_count: response.staff_count,
    lang: response.lang,
    scores,
    responses: enrichedResponses
  };
}
async function updateAiAnalysisStatus(db, id, status) {
  await db.prepare(`UPDATE "scanner_response" SET "ai_analysis_status" = ? WHERE "id" = ?`).bind(status, id).run();
}
async function updateAiPlanStatus(db, id, status) {
  await db.prepare(`UPDATE "scanner_response" SET "ai_plan_status" = ? WHERE "id" = ?`).bind(status, id).run();
}
export {
  parseResponses as a,
  updateAiAnalysis as b,
  countScannerResponses as c,
  buildAiContext as d,
  updateAiPlanStatus as e,
  updateAiPlan as f,
  getScannerResponse as g,
  buildResponsesMap as h,
  createScannerResponse as i,
  getScoreLevel as j,
  listScannerResponses as l,
  maskEmail as m,
  parseScores as p,
  updateAiAnalysisStatus as u,
  validateRequiredAnswers as v
};
