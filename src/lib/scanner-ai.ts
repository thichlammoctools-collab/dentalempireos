// Generic AI analysis for any survey scanner.
// Reads the prompt and config from survey_definition.ai_config (JSON).
// Replaces the hardcoded AI_PROMPT in ai-survey-analysis.ts.

import type { AiConfig, ScoringRules } from './survey-config-db';
import { parseAiConfig, parseScoringRules } from './survey-config-db';
import {
  getScannerResponse,
  buildAiContext,
  parseScores,
  updateAiAnalysis,
} from './scanner-response-db';
import { getSurveyDefinitionFull } from './survey-config-db';
import { getAiSettings } from './ai-settings-db';

interface AnthropicResponse {
  content: Array<{ type: string; text?: string }>;
  stop_reason?: string;
  usage?: { input_tokens: number; output_tokens: number };
}

/**
 * Main entry point: run AI analysis for a single scanner_response.
 * Loads definition + response, builds context, calls Claude, stores analysis.
 */
export async function runAiAnalysis(db: D1Database, responseId: number): Promise<void> {
  const response = await getScannerResponse(db, responseId);
  if (!response) {
    console.error(`[scanner-ai] Response ${responseId} not found`);
    return;
  }

  // Load full definition
  const full = await getSurveyDefinitionFull(db, response.survey_id);
  if (!full) {
    console.error(`[scanner-ai] Definition ${response.survey_id} not found`);
    return;
  }

  // Load AI settings
  const aiSettings = await getAiSettings(db);
  if (!aiSettings?.is_active) {
    console.warn('[scanner-ai] AI settings not active, skipping');
    return;
  }

  const aiConfig = parseAiConfig(full.definition.ai_config);
  const scoringRules = parseScoringRules(full.definition.scoring_rules);

  try {
    const analysis = await analyze(
      aiSettings.api_key,
      response,
      full,
      aiConfig,
      scoringRules,
      {
        baseUrl: aiSettings.base_url,
        model: aiSettings.model,
        maxTokens: aiSettings.max_tokens,
      },
    );

    await updateAiAnalysis(db, responseId, analysis);
  } catch (err) {
    console.error(`[scanner-ai] Failed for response ${responseId}:`, err);
  }
}

/** Build prompt with placeholders replaced from scores + context. */
function buildPrompt(
  promptTemplate: string,
  response: { lang: string; scores_json: string | null },
  scoringRules: ScoringRules | null,
): string {
  const scores = parseScores(response.scores_json);
  let prompt = promptTemplate;

  // Replace {{SCORE_<dim_id>}} placeholders
  if (scoringRules) {
    for (const dim of scoringRules.dimensions) {
      const val = scores[dim.id] ?? 0;
      prompt = prompt.replace(new RegExp(`\\{\\{SCORE_${dim.id.toUpperCase()}\\}\\}`, 'g'), String(val));
    }
  }
  // Replace {{SCORE_TOTAL}} if present
  prompt = prompt.replace(/\{\{SCORE_TOTAL\}\}/g, String(scores.total ?? 0));
  // Replace {{LANG}}
  prompt = prompt.replace(/\{\{LANG\}\}/g, response.lang === 'en' ? 'English' : 'Việt');

  return prompt;
}

/** Internal: call Claude API and return markdown analysis. */
async function analyze(
  apiKey: string,
  response: Awaited<ReturnType<typeof getScannerResponse>>,
  full: NonNullable<Awaited<ReturnType<typeof getSurveyDefinitionFull>>>,
  aiConfig: AiConfig,
  scoringRules: ScoringRules | null,
  opts: { baseUrl?: string; model?: string; maxTokens?: number } = {},
): Promise<string> {
  if (!response) throw new Error('No response');

  const lang = response.lang === 'en' ? 'en' : 'vi';
  const promptTemplate = lang === 'en'
    ? (aiConfig.prompt_en ?? aiConfig.prompt_vi ?? '')
    : (aiConfig.prompt_vi ?? aiConfig.prompt_en ?? '');

  if (!promptTemplate) {
    throw new Error(`No AI prompt configured for language '${lang}'`);
  }

  const systemPrompt = buildPrompt(promptTemplate, response, scoringRules);

  // Build user message: AI context (clinic info + scores + answers)
  const userContext = buildAiContext(response, full.sections.flatMap((s) => s.questions));
  const userMessage = JSON.stringify(userContext, null, 2);

  const baseUrl = (opts.baseUrl ?? 'https://api.anthropic.com').replace(/\/+$/, '');
  const url = `${baseUrl}/v1/messages`;
  const model = aiConfig.model_override ?? opts.model ?? 'claude-sonnet-4-6';
  const maxTokens = aiConfig.max_tokens_override ?? opts.maxTokens ?? 4096;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Anthropic API error (${resp.status}): ${errText}`);
  }

  const data = (await resp.json()) as AnthropicResponse;
  const text = data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('\n');

  if (!text) throw new Error('Empty response from Anthropic API');
  return text;
}