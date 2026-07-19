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
import { getAiSettings } from './ai-settings-db';
import { getActiveModelsWithProvider } from './ai-provider-db';
import { chatCompletion, chatCompletionStream, withRetry } from './ai-client';
import type { ModelConfig, ChatMessage } from './ai-client';
import { sendScannerNotification } from './notification';
import { sendScannerAiCompleteEmail } from './resend';

export interface ScannerAiConfig {
  config: ModelConfig;
  maxTokens: number;
}

/**
 * Resolve the active AI config for scanner AI.
 * Priority: ai_provider + ai_model (production) > ai_settings (legacy).
 */
export async function getScannerAiConfig(db: D1Database): Promise<ScannerAiConfig | null> {
  try {
    const models = await getActiveModelsWithProvider(db);
    for (const [, { provider, models: providerModels }] of models) {
      if (providerModels.length > 0) {
        const model = providerModels[0];
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
  } catch {
    // ai_provider/ai_model not available — fall through to legacy
  }

  const settings = await getAiSettings(db);
  if (!settings?.is_active) return null;

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

// ─── Streaming exports ─────────────────────────────────────────────────────────

export function buildAnalysisStream(
  response: Awaited<ReturnType<typeof getScannerResponse>>,
  full: NonNullable<Awaited<ReturnType<typeof getSurveyDefinitionFull>>>,
  aiConfig: AiConfig,
  scoringRules: ScoringRules | null,
  modelConfig: ModelConfig,
): ReadableStream<string> {
  const { systemPrompt, messages } = buildMessages(response, full, aiConfig, scoringRules);
  return chatCompletionStream(modelConfig, messages, systemPrompt);
}

export function buildPlanStream(
  response: Awaited<ReturnType<typeof getScannerResponse>>,
  full: NonNullable<Awaited<ReturnType<typeof getSurveyDefinitionFull>>>,
  aiConfig: AiConfig,
  scoringRules: ScoringRules | null,
  modelConfig: ModelConfig,
): ReadableStream<string> {
  if (!response) throw new Error('No response');

  const lang = response.lang === 'en' ? 'en' : 'vi';
  const promptTemplate = lang === 'en'
    ? (aiConfig.plan_prompt_en ?? aiConfig.plan_prompt_vi ?? '')
    : (aiConfig.plan_prompt_vi ?? aiConfig.plan_prompt_en ?? '');

  if (!promptTemplate) throw new Error('No plan prompt configured');

  const allQuestions = full.sections.flatMap((s) => s.questions);
  const systemPrompt = buildPrompt(promptTemplate, response, scoringRules, allQuestions);
  const userContext = buildAiContext(response, allQuestions);
  const userMessage = JSON.stringify(userContext, null, 2);

  return chatCompletionStream(
    modelConfig,
    [{ role: 'user', content: userMessage }],
    systemPrompt,
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
  return chatCompletion(modelConfig, messages, systemPrompt);
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
  const systemPrompt = buildPrompt(promptTemplate, response, scoringRules, allQuestions);
  const userContext = buildAiContext(response, allQuestions);
  const userMessage = JSON.stringify(userContext, null, 2);

  return chatCompletion(
    modelConfig,
    [{ role: 'user', content: userMessage }],
    systemPrompt,
  );
}

// ─── Main entry points ─────────────────────────────────────────────────────────

/**
 * Run AI analysis with retry (3 attempts, exponential backoff).
 */
export async function runAiAnalysis(db: D1Database, responseId: number): Promise<void> {
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

    const analysis = await withRetry(
      () => doAnalyze(db, response, full, config, scoringRules, modelConfig),
      3,
    );

    await updateAiAnalysis(db, responseId, analysis);
    await updateAiAnalysisStatus(db, responseId, 'done');

    await Promise.allSettled([
      sendScannerAiCompleteEmail(db, responseId, 'analysis').catch((err) => console.error('[scanner-ai] email failed:', err)),
      sendScannerNotification(db, responseId, 'analysis').catch((err) => console.error('[scanner-ai] notification failed:', err)),
    ]);
  } catch (err) {
    await updateAiAnalysisStatus(db, responseId, 'failed');
    console.error(`[scanner-ai] Analysis failed for ${responseId}:`, err);
  }
}

/**
 * Run AI plan generation with retry (3 attempts, exponential backoff).
 */
export async function runPlanAnalysis(db: D1Database, responseId: number): Promise<void> {
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

    const plan = await withRetry(
      () => doPlan(db, response, full, config, scoringRules, modelConfig),
      3,
    );

    await updateAiPlan(db, responseId, plan);
    await updateAiPlanStatus(db, responseId, 'done');

    await Promise.allSettled([
      sendScannerAiCompleteEmail(db, responseId, 'plan').catch((err) => console.error('[scanner-ai] plan email failed:', err)),
      sendScannerNotification(db, responseId, 'plan').catch((err) => console.error('[scanner-ai] plan notification failed:', err)),
    ]);
  } catch (err) {
    await updateAiPlanStatus(db, responseId, 'failed');
    console.error(`[scanner-ai] Plan: Failed for ${responseId}:`, err);
  }
}
