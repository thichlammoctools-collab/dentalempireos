// Generic AI analysis for any survey scanner.
// Reads the prompt and config from survey_definition.ai_config (JSON).
// Replaces the hardcoded AI_PROMPT in ai-survey-analysis.ts.

import type { AiConfig, ScoringRules } from './survey-config-db';
import { parseAiConfig, parseScoringRules } from './survey-config-db';
import {
  getScannerResponse,
  buildAiContext,
  parseScores,
  parseResponses,
  updateAiAnalysis,
  updateAiPlan,
  updateAiAnalysisStatus,
  updateAiPlanStatus,
} from './scanner-response-db';
import { getSurveyDefinitionFull } from './survey-config-db';
import { getAiGatewayConfig } from './ai-gateway';
import { getAiSettings } from './ai-settings-db';
import { getActiveModelsWithProvider } from './ai-provider-db';
import { chatCompletion, chatCompletionStream, withRetry } from './ai-client';
import type { ModelConfig, ChatMessage } from './ai-client';
import { sendScannerNotification } from './notification';
import { sendScannerAiCompleteEmail } from './resend';
import { logAiUsage } from './ai-usage-log';
import { buildWebsiteContext, searchWebsite } from './rag-website-search';
import { claimScannerAiJob, finishScannerAiJob, reserveAiQuota, requestId } from './ai-operations';

export interface ScannerAiConfig {
  config: ModelConfig;
  maxTokens: number;
}

/**
 * Resolve the active AI config for scanner AI.
 * Prefer Cloudflare AI Gateway, while retaining configured providers and the
 * legacy setting as operational fallbacks during Gateway migration.
 */
export async function getScannerAiConfig(db: D1Database): Promise<ScannerAiConfig | null> {
  const gatewayConfig = await getAiGatewayConfig(db, 'scanner');
  if (gatewayConfig) {
    return { config: gatewayConfig, maxTokens: gatewayConfig.max_tokens ?? 4096 };
  }

  try {
    const modelsByProvider = await getActiveModelsWithProvider(db);
    for (const [, { provider, models }] of modelsByProvider) {
      const model = models[0];
      if (model) {
        return {
          config: {
            provider_id: String(provider.id),
            base_url: provider.base_url,
            api_key: provider.api_key,
            model_id: model.model_id,
            max_tokens: model.max_tokens ?? 4096,
          },
          maxTokens: model.max_tokens ?? 4096,
        };
      }
    }
  } catch (error) {
    // Provider tables may not exist until their migrations have been applied.
    console.warn('[scanner-ai] Unable to load configured AI providers:', error);
  }

  const settings = await getAiSettings(db);
  if (!settings.is_active || !settings.api_key) return null;

  return {
    config: {
      provider_id: 'legacy',
      base_url: settings.base_url || 'https://api.anthropic.com',
      api_key: settings.api_key,
      model_id: settings.model || 'claude-sonnet-4-6',
      max_tokens: settings.max_tokens,
    },
    maxTokens: settings.max_tokens,
  };
}

// ─── Build prompt helpers ──────────────────────────────────────────────────────

function buildPrompt(
  promptTemplate: string,
  response: { lang: string; scores_json: string | null; responses_json: string },
  scoringRules: ScoringRules | null,
  questions: Array<{ question_id: string; label_vi: string; type: string }>,
): string {
  const scores = parseScores(response.scores_json);
  let prompt = promptTemplate;

  if (scoringRules) {
    for (const dim of scoringRules.dimensions) {
      const val = scores[dim.id] ?? 0;
      prompt = prompt.replace(new RegExp(`\\{\\{SCORE_${dim.id.toUpperCase()}\\}\\}`, 'g'), String(val));
    }
  }
  prompt = prompt.replace(/\{\{SCORE_TOTAL\}\}/g, String(scores.total ?? 0));
  prompt = prompt.replace(/\{\{LANG\}\}/g, response.lang === 'en' ? 'English' : 'Việt');

  if (prompt.includes('{{OPEN_RESPONSES}}')) {
    const parsed = parseResponses(response.responses_json);
    const openItems: string[] = [];
    for (const q of questions) {
      if (q.type === 'textarea') {
        const v = parsed[q.question_id];
        if (v !== undefined && v !== null && v !== '') {
          openItems.push(`[${q.label_vi}]: ${String(v)}`);
        }
      }
    }
    prompt = prompt.replace(/\{\{OPEN_RESPONSES\}\}/g, openItems.join('\n') || '(không có câu trả lời mở / no open answers)');
  }

  return prompt;
}

function buildMessages(
  response: Awaited<ReturnType<typeof getScannerResponse>>,
  full: NonNullable<Awaited<ReturnType<typeof getSurveyDefinitionFull>>>,
  aiConfig: AiConfig,
  scoringRules: ScoringRules | null,
): { systemPrompt: string; messages: ChatMessage[] } {
  if (!response) throw new Error('No response');

  const lang = response.lang === 'en' ? 'en' : 'vi';
  const promptTemplate = lang === 'en'
    ? (aiConfig.prompt_en ?? aiConfig.prompt_vi ?? '')
    : (aiConfig.prompt_vi ?? aiConfig.prompt_en ?? '');

  if (!promptTemplate) throw new Error(`No AI prompt configured for language '${lang}'`);

  const allQuestions = full.sections.flatMap((s) => s.questions);
  const systemPrompt = buildPrompt(promptTemplate, response, scoringRules, allQuestions);
  const userContext = buildAiContext(response, allQuestions);
  const userMessage = JSON.stringify(userContext, null, 2);

  return {
    systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  };
}

/**
 * Retrieves only the book passages relevant to this scanner and its weakest
 * areas. Retrieval failure is deliberately non-fatal: scanner prompts remain
 * useful before the knowledge base has been indexed.
 */
async function getBookContext(
  db: D1Database,
  env: Env,
  response: NonNullable<Awaited<ReturnType<typeof getScannerResponse>>>,
  full: NonNullable<Awaited<ReturnType<typeof getSurveyDefinitionFull>>>,
  scoringRules: ScoringRules | null,
): Promise<string> {
  const scores = parseScores(response.scores_json);
  const weakDimensions = (scoringRules?.dimensions ?? [])
    .map((dimension) => ({ label: dimension.name_vi, score: scores[dimension.id] ?? 0 }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((dimension) => `${dimension.label}: ${dimension.score}/100`);
  const sectionTitles = full.sections.map((section) => section.title_vi).slice(0, 4);
  const query = [
    full.definition.title_vi,
    full.definition.description_vi,
    ...sectionTitles,
    ...weakDimensions,
  ].filter(Boolean).join('\n');

  if (!query) return '';

  try {
    const chunks = await Promise.race([
      searchWebsite(db, query, 4, { contentType: 'book' }, env),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Book retrieval timed out')), 8000)),
    ]);
    // A bounded context keeps generation responsive and focused on the result.
    return buildWebsiteContext(chunks).slice(0, 6000);
  } catch (error) {
    console.warn('[scanner-ai] Book retrieval failed; continuing without RAG:', error);
    return '';
  }
}

function addBookContext(systemPrompt: string, bookContext: string, lang: 'vi' | 'en'): string {
  if (!bookContext) return systemPrompt;

  const instruction = lang === 'vi'
    ? `\n\n# NGỮ CẢNH ĐÃ KIỂM CHỨNG TỪ SÁCH DENTAL EMPIRE OS\n${bookContext}\n# HẾT NGỮ CẢNH\nDùng ngữ cảnh này để làm phân tích và hành động bám sát framework của sách. Chỉ nêu chi tiết thuộc sách khi chúng có trong ngữ cảnh; không bịa tên chương, số liệu hoặc khuyến nghị.`
    : `\n\n# VERIFIED DENTAL EMPIRE OS BOOK CONTEXT\n${bookContext}\n# END CONTEXT\nUse this context to ground the analysis and actions in the book's framework. Only state book-specific details that appear in this context; do not invent chapter names, numbers, or recommendations.`;
  return `${systemPrompt}${instruction}`;
}

function withOperationalPlanFormat(prompt: string, lang: 'vi' | 'en'): string {
  const format = lang === 'vi'
    ? `\n\n# ĐỊNH DẠNG BẮT BUỘC ĐỂ CÓ THỂ IN VÀ GIAO VIỆC\nTrả lời bằng Markdown, không dùng lời mở đầu hoặc kết luận chung chung.\n- Dùng ## cho từng tuần/giai đoạn.\n- Mỗi hành động bắt đầu bằng ### Hành động N: [tên ngắn, hướng hành động].\n- Ngay dưới tiêu đề hành động, viết chính xác ba dòng có nhãn in đậm:\n  - **Việc cần làm:** các bước cụ thể, có thể giao ngay.\n  - **Mục tiêu:** lý do hoặc kết quả vận hành cần đạt.\n  - **Hoàn thành khi:** tiêu chí kiểm chứng được, có con số/thời hạn nếu phù hợp.\n- Khi hữu ích, thêm **Người phụ trách gợi ý:** và **Thời hạn:**.\n- Mỗi hành động là một khối độc lập, ngắn gọn, để có thể copy/paste hoặc in trực tiếp cho nhân sự.`
    : `\n\n# REQUIRED PRINT-READY FORMAT\nReply in Markdown only. Do not add a generic introduction or conclusion.\n- Use ## for each week/phase.\n- Start every action with ### Action N: [short action-oriented title].\n- Directly below each action title, write exactly these bold labels:\n  - **What to do:** concrete, assignable steps.\n  - **Objective:** the operational outcome.\n  - **Done when:** a verifiable completion criterion, with a number/deadline where useful.\n- Add **Suggested owner:** and **Due date:** when useful.\n- Keep each action an independent, concise block that can be copied or printed for the team.`;
  return `${prompt}${format}`;
}

// ─── Streaming exports ─────────────────────────────────────────────────────────

export async function buildAnalysisStream(
  db: D1Database,
  env: Env,
  response: Awaited<ReturnType<typeof getScannerResponse>>,
  full: NonNullable<Awaited<ReturnType<typeof getSurveyDefinitionFull>>>,
  aiConfig: AiConfig,
  scoringRules: ScoringRules | null,
  modelConfig: ModelConfig,
): Promise<ReadableStream<string>> {
  const { systemPrompt, messages } = buildMessages(response, full, aiConfig, scoringRules);
  if (!response) throw new Error('No response');
  const bookContext = await getBookContext(db, env, response, full, scoringRules);
  return chatCompletionStream(modelConfig, messages, addBookContext(systemPrompt, bookContext, response.lang === 'en' ? 'en' : 'vi'));
}

export async function buildPlanStream(
  db: D1Database,
  env: Env,
  response: Awaited<ReturnType<typeof getScannerResponse>>,
  full: NonNullable<Awaited<ReturnType<typeof getSurveyDefinitionFull>>>,
  aiConfig: AiConfig,
  scoringRules: ScoringRules | null,
  modelConfig: ModelConfig,
): Promise<ReadableStream<string>> {
  if (!response) throw new Error('No response');

  const lang = response.lang === 'en' ? 'en' : 'vi';
  const promptTemplate = lang === 'en'
    ? (aiConfig.plan_prompt_en ?? aiConfig.plan_prompt_vi ?? '')
    : (aiConfig.plan_prompt_vi ?? aiConfig.plan_prompt_en ?? '');

  if (!promptTemplate) throw new Error('No plan prompt configured');

  const allQuestions = full.sections.flatMap((s) => s.questions);
  const systemPrompt = withOperationalPlanFormat(
    buildPrompt(promptTemplate, response, scoringRules, allQuestions),
    lang,
  );
  const userContext = buildAiContext(response, allQuestions);
  const userMessage = JSON.stringify(userContext, null, 2);

  const bookContext = await getBookContext(db, env, response, full, scoringRules);
  return chatCompletionStream(
    modelConfig,
    [{ role: 'user', content: userMessage }],
    addBookContext(systemPrompt, bookContext, lang),
  );
}

// ─── Non-streaming (backward compat + background) ──────────────────────────────

async function doAnalyze(
  db: D1Database,
  response: Awaited<ReturnType<typeof getScannerResponse>>,
  full: NonNullable<Awaited<ReturnType<typeof getSurveyDefinitionFull>>>,
  aiConfig: AiConfig,
  scoringRules: ScoringRules | null,
  modelConfig: ModelConfig,
): Promise<string> {
  const { systemPrompt, messages } = buildMessages(response, full, aiConfig, scoringRules);
  const bookContext = await getBookContext(db, env, response, full, scoringRules);
  return chatCompletion(modelConfig, messages, addBookContext(systemPrompt, bookContext, response.lang === 'en' ? 'en' : 'vi'));
}

async function doPlan(
  db: D1Database,
  response: Awaited<ReturnType<typeof getScannerResponse>>,
  full: NonNullable<Awaited<ReturnType<typeof getSurveyDefinitionFull>>>,
  aiConfig: AiConfig,
  scoringRules: ScoringRules | null,
  modelConfig: ModelConfig,
): Promise<string> {
  if (!response) throw new Error('No response');

  const lang = response.lang === 'en' ? 'en' : 'vi';
  const promptTemplate = lang === 'en'
    ? (aiConfig.plan_prompt_en ?? aiConfig.plan_prompt_vi ?? '')
    : (aiConfig.plan_prompt_vi ?? aiConfig.plan_prompt_en ?? '');

  if (!promptTemplate) throw new Error('No plan prompt configured');

  const allQuestions = full.sections.flatMap((s) => s.questions);
  const systemPrompt = withOperationalPlanFormat(
    buildPrompt(promptTemplate, response, scoringRules, allQuestions),
    lang,
  );
  const userContext = buildAiContext(response, allQuestions);
  const userMessage = JSON.stringify(userContext, null, 2);

  const bookContext = await getBookContext(db, env, response, full, scoringRules);
  return chatCompletion(
    modelConfig,
    [{ role: 'user', content: userMessage }],
    addBookContext(systemPrompt, bookContext, lang),
  );
}

// ─── Main entry points ─────────────────────────────────────────────────────────

/**
 * Run AI analysis with retry (3 attempts, exponential backoff).
 */
export async function runAiAnalysis(db: D1Database, responseId: number): Promise<void> {
  const request = requestId();
  const job = await claimScannerAiJob(db, responseId, 'analysis');
  if (!job.claimed) return;
  const response = await getScannerResponse(db, responseId);
  if (!response) { console.error(`[scanner-ai] Response ${responseId} not found`); return; }

  const full = await getSurveyDefinitionFull(db, response.survey_id);
  if (!full) { console.error(`[scanner-ai] Definition ${response.survey_id} not found`); return; }

  const aiConfig = await getScannerAiConfig(db);
  if (!aiConfig) { console.warn('[scanner-ai] AI not configured, skipping'); return; }

  const config = parseAiConfig(full.definition.ai_config);
  const scoringRules = parseScoringRules(full.definition.scoring_rules);

  const modelConfig: ModelConfig = {
    ...aiConfig.config,
    max_tokens: config.max_tokens_override ?? aiConfig.maxTokens,
  };

  try {
    await updateAiAnalysisStatus(db, responseId, 'running');

    const analysisStartedAt = Date.now();
    const analysis = await withRetry(
      () => doAnalyze(db, response, full, config, scoringRules, modelConfig),
      3,
    );

    await updateAiAnalysis(db, responseId, analysis);
    await updateAiAnalysisStatus(db, responseId, 'done');
    await finishScannerAiJob(db, responseId, 'analysis', job.runId, 'done');
    await logAiUsage(db, { provider_id: modelConfig.provider_id, model_id: modelConfig.model_id, user_id: response.email ?? undefined, feature: 'scanner_analysis', success: true, latency_ms: Date.now() - analysisStartedAt, input_tokens: Math.ceil(JSON.stringify(response).length / 4), output_tokens: Math.ceil(analysis.length / 4), request_id: request, attempt_count: 3 }).catch((err) => console.warn('[scanner-ai] usage log failed:', err));

    await Promise.allSettled([
      sendScannerAiCompleteEmail(db, responseId, 'analysis').catch((err) => console.error('[scanner-ai] email failed:', err)),
      sendScannerNotification(db, responseId, 'analysis').catch((err) => console.error('[scanner-ai] notification failed:', err)),
    ]);
  } catch (err) {
    await updateAiAnalysisStatus(db, responseId, 'failed');
    await finishScannerAiJob(db, responseId, 'analysis', job.runId, 'failed');
    await logAiUsage(db, { provider_id: modelConfig.provider_id, model_id: modelConfig.model_id, feature: 'scanner_analysis', success: false, error_message: String(err).slice(0, 500), request_id: request }).catch(() => undefined);
    console.error(`[scanner-ai] Analysis failed for ${responseId}:`, err);
  }
}

/**
 * Run AI plan generation with retry (3 attempts, exponential backoff).
 */
export async function runPlanAnalysis(db: D1Database, responseId: number): Promise<void> {
  const request = requestId();
  const job = await claimScannerAiJob(db, responseId, 'plan');
  if (!job.claimed) return;
  const response = await getScannerResponse(db, responseId);
  if (!response) { console.error(`[scanner-ai] Plan: Response ${responseId} not found`); return; }

  const full = await getSurveyDefinitionFull(db, response.survey_id);
  if (!full) { console.error(`[scanner-ai] Plan: Definition ${response.survey_id} not found`); return; }

  const aiConfig = await getScannerAiConfig(db);
  if (!aiConfig) { console.warn('[scanner-ai] Plan: AI not configured, skipping'); return; }

  const config = parseAiConfig(full.definition.ai_config);
  const scoringRules = parseScoringRules(full.definition.scoring_rules);

  const modelConfig: ModelConfig = {
    ...aiConfig.config,
    max_tokens: config.max_tokens_override ?? aiConfig.maxTokens,
  };

  try {
    await updateAiPlanStatus(db, responseId, 'running');

    const planStartedAt = Date.now();
    const plan = await withRetry(
      () => doPlan(db, response, full, config, scoringRules, modelConfig),
      3,
    );

    await updateAiPlan(db, responseId, plan);
    await updateAiPlanStatus(db, responseId, 'done');
    await finishScannerAiJob(db, responseId, 'plan', job.runId, 'done');
    await logAiUsage(db, { provider_id: modelConfig.provider_id, model_id: modelConfig.model_id, feature: 'scanner_plan', success: true, latency_ms: Date.now() - planStartedAt, input_tokens: Math.ceil(JSON.stringify(response).length / 4), output_tokens: Math.ceil(plan.length / 4), request_id: request, attempt_count: 3 }).catch((err) => console.warn('[scanner-ai] plan usage log failed:', err));

    await Promise.allSettled([
      sendScannerAiCompleteEmail(db, responseId, 'plan').catch((err) => console.error('[scanner-ai] plan email failed:', err)),
      sendScannerNotification(db, responseId, 'plan').catch((err) => console.error('[scanner-ai] plan notification failed:', err)),
    ]);
  } catch (err) {
    await updateAiPlanStatus(db, responseId, 'failed');
    await finishScannerAiJob(db, responseId, 'plan', job.runId, 'failed');
    await logAiUsage(db, { provider_id: modelConfig.provider_id, model_id: modelConfig.model_id, feature: 'scanner_plan', success: false, error_message: String(err).slice(0, 500), request_id: request }).catch(() => undefined);
    console.error(`[scanner-ai] Plan: Failed for ${responseId}:`, err);
  }
}
