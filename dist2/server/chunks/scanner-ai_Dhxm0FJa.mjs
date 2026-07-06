globalThis.process ??= {};
globalThis.process.env ??= {};
import { g as getSurveyDefinitionFull, d as parseAiConfig, c as parseScoringRules } from "./survey-config-db_AxTlbaW3.mjs";
import { g as getScannerResponse, u as updateAiAnalysisStatus, b as updateAiAnalysis, d as buildAiContext, e as updateAiPlanStatus, f as updateAiPlan, p as parseScores, a as parseResponses } from "./scanner-response-db_wxssrRMk.mjs";
import { g as getAiSettings } from "./ai-settings-db_DJhiMzYX.mjs";
import { c as createNotification } from "./question-db_BOj0TAm2.mjs";
import { s as sendScannerAiCompleteEmail } from "./resend_BvoaNmB7.mjs";
async function getUserIdForResponse(db, responseId) {
  const row = await db.prepare("SELECT user_id FROM scanner_history WHERE response_id = ? LIMIT 1").bind(responseId).first();
  return row?.user_id ?? null;
}
async function sendScannerNotification(db, responseId, type) {
  const userId = await getUserIdForResponse(db, responseId);
  if (!userId) {
    console.warn(`[notification] No user found for scanner response ${responseId}`);
    return;
  }
  const baseUrl = "https://dentalempireos.com";
  const link = `${baseUrl}/scanner/result/${responseId}`;
  const titles = {
    analysis: {
      vi: "Bản soi chiếu hệ thống đã sẵn sàng",
      en: "Your AI Analysis is Ready"
    },
    plan: {
      vi: "Kế hoạch 30 ngày đã được tạo",
      en: "Your 30-Day Plan is Ready"
    }
  };
  const bodies = {
    analysis: {
      vi: "Bản phân tích AI của bạn đã hoàn thành. Nhấn để xem chi tiết.",
      en: "Your AI analysis has been generated. Tap to view the results."
    },
    plan: {
      vi: "Kế hoạch hành động 30 ngày của bạn đã sẵn sàng. Nhấn để xem chi tiết.",
      en: "Your 30-day action plan is ready. Tap to view the details."
    }
  };
  const t = titles[type];
  const b = bodies[type];
  await createNotification(db, userId, `scanner_${type}_done`, t.vi, b.vi, link);
}
async function runAiAnalysis(db, responseId) {
  const response = await getScannerResponse(db, responseId);
  if (!response) {
    console.error(`[scanner-ai] Response ${responseId} not found`);
    return;
  }
  const full = await getSurveyDefinitionFull(db, response.survey_id);
  if (!full) {
    console.error(`[scanner-ai] Definition ${response.survey_id} not found`);
    return;
  }
  const aiSettings = await getAiSettings(db);
  if (!aiSettings?.is_active) {
    console.warn("[scanner-ai] AI settings not active, skipping");
    return;
  }
  const aiConfig = parseAiConfig(full.definition.ai_config);
  const scoringRules = parseScoringRules(full.definition.scoring_rules);
  try {
    await updateAiAnalysisStatus(db, responseId, "running");
    const analysis = await analyze(
      aiSettings.api_key,
      response,
      full,
      aiConfig,
      scoringRules,
      {
        baseUrl: aiSettings.base_url,
        model: aiSettings.model,
        maxTokens: aiSettings.max_tokens
      }
    );
    await updateAiAnalysis(db, responseId, analysis);
    await updateAiAnalysisStatus(db, responseId, "done");
    await Promise.allSettled([
      sendScannerAiCompleteEmail(db, responseId, "analysis").catch((err) => {
        console.error("[scanner-ai] email failed:", err);
      }),
      sendScannerNotification(db, responseId, "analysis").catch((err) => {
        console.error("[scanner-ai] notification failed:", err);
      })
    ]);
  } catch (err) {
    await updateAiAnalysisStatus(db, responseId, "failed");
    console.error(`[scanner-ai] Failed for response ${responseId}:`, err);
  }
}
async function runPlanAnalysis(db, responseId) {
  const response = await getScannerResponse(db, responseId);
  if (!response) {
    console.error(`[scanner-ai] Plan: Response ${responseId} not found`);
    return;
  }
  const full = await getSurveyDefinitionFull(db, response.survey_id);
  if (!full) {
    console.error(`[scanner-ai] Plan: Definition ${response.survey_id} not found`);
    return;
  }
  const aiSettings = await getAiSettings(db);
  if (!aiSettings?.is_active) {
    console.warn("[scanner-ai] Plan: AI settings not active, skipping");
    return;
  }
  const aiConfig = parseAiConfig(full.definition.ai_config);
  const scoringRules = parseScoringRules(full.definition.scoring_rules);
  const lang = response.lang === "en" ? "en" : "vi";
  const promptTemplate = lang === "en" ? aiConfig.plan_prompt_en ?? aiConfig.plan_prompt_vi ?? "" : aiConfig.plan_prompt_vi ?? aiConfig.plan_prompt_en ?? "";
  if (!promptTemplate) {
    console.warn(`[scanner-ai] Plan: No plan prompt configured for response ${responseId}`);
    return;
  }
  const allQuestions = full.sections.flatMap((s) => s.questions);
  const systemPrompt = buildPrompt(promptTemplate, response, scoringRules, allQuestions);
  const userContext = buildAiContext(response, allQuestions);
  const userMessage = JSON.stringify(userContext, null, 2);
  const baseUrl = (aiSettings.base_url ?? "https://api.anthropic.com").replace(/\/+$/, "");
  const url = `${baseUrl}/v1/messages`;
  const model = aiConfig.model_override ?? aiSettings.model ?? "claude-sonnet-4-6";
  const maxTokens = aiConfig.max_tokens_override ?? aiSettings.max_tokens ?? 4096;
  try {
    await updateAiPlanStatus(db, responseId, "running");
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": aiSettings.api_key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }]
      })
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Anthropic API error (${resp.status}): ${errText}`);
    }
    const data = await resp.json();
    const text = data.content.filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n");
    if (!text) throw new Error("Empty response from Anthropic API for plan");
    await updateAiPlan(db, responseId, text);
    await updateAiPlanStatus(db, responseId, "done");
    await Promise.allSettled([
      sendScannerAiCompleteEmail(db, responseId, "plan").catch((err) => {
        console.error("[scanner-ai] plan email failed:", err);
      }),
      sendScannerNotification(db, responseId, "plan").catch((err) => {
        console.error("[scanner-ai] plan notification failed:", err);
      })
    ]);
  } catch (err) {
    await updateAiPlanStatus(db, responseId, "failed");
    console.error(`[scanner-ai] Plan: Failed for response ${responseId}:`, err);
  }
}
function buildPrompt(promptTemplate, response, scoringRules, questions) {
  const scores = parseScores(response.scores_json);
  let prompt = promptTemplate;
  if (scoringRules) {
    for (const dim of scoringRules.dimensions) {
      const val = scores[dim.id] ?? 0;
      prompt = prompt.replace(new RegExp(`\\{\\{SCORE_${dim.id.toUpperCase()}\\}\\}`, "g"), String(val));
    }
  }
  prompt = prompt.replace(/\{\{SCORE_TOTAL\}\}/g, String(scores.total ?? 0));
  prompt = prompt.replace(/\{\{LANG\}\}/g, response.lang === "en" ? "English" : "Việt");
  if (prompt.includes("{{OPEN_RESPONSES}}")) {
    const parsed = parseResponses(response.responses_json);
    const openItems = [];
    for (const q of questions) {
      if (q.type === "textarea") {
        const v = parsed[q.question_id];
        if (v !== void 0 && v !== null && v !== "") {
          openItems.push(`[${q.label_vi}]: ${String(v)}`);
        }
      }
    }
    prompt = prompt.replace(/\{\{OPEN_RESPONSES\}\}/g, openItems.join("\n") || "(không có câu trả lời mở / no open answers)");
  }
  return prompt;
}
async function analyze(apiKey, response, full, aiConfig, scoringRules, opts = {}) {
  if (!response) throw new Error("No response");
  const lang = response.lang === "en" ? "en" : "vi";
  const promptTemplate = lang === "en" ? aiConfig.prompt_en ?? aiConfig.prompt_vi ?? "" : aiConfig.prompt_vi ?? aiConfig.prompt_en ?? "";
  if (!promptTemplate) {
    throw new Error(`No AI prompt configured for language '${lang}'`);
  }
  const allQuestions = full.sections.flatMap((s) => s.questions);
  const systemPrompt = buildPrompt(promptTemplate, response, scoringRules, allQuestions);
  const userContext = buildAiContext(response, allQuestions);
  const userMessage = JSON.stringify(userContext, null, 2);
  const baseUrl = (opts.baseUrl ?? "https://api.anthropic.com").replace(/\/+$/, "");
  const url = `${baseUrl}/v1/messages`;
  const model = aiConfig.model_override ?? opts.model ?? "claude-sonnet-4-6";
  const maxTokens = aiConfig.max_tokens_override ?? opts.maxTokens ?? 4096;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }]
    })
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Anthropic API error (${resp.status}): ${errText}`);
  }
  const data = await resp.json();
  const text = data.content.filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n");
  if (!text) throw new Error("Empty response from Anthropic API");
  return text;
}
export {
  runPlanAnalysis as a,
  runAiAnalysis as r
};
