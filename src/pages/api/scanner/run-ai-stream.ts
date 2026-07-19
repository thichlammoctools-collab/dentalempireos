// API: Streaming AI analysis/plan via Server-Sent Events.
// POST /api/scanner/run-ai-stream
// Body: { response_id: number, type: 'analysis' | 'plan' | 'all' }
// Auth: Session + ownership check
// Response: text/event-stream
//   event: status  data: { status: string, message?: string }
//   event: chunk   data: { text: string }
//   event: done    data: { type: string, r2_key?: string }

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { sseResponse, sseEnqueue } from '../../../lib/sse';
import { streamAndSaveToR2, scannerAiR2Key } from '../../../lib/r2-storage';
import { getScannerResponse, updateAiAnalysis, updateAiPlan, updateAiAnalysisStatus, updateAiPlanStatus } from '../../../lib/scanner-response-db';
import { getSurveyDefinitionFull, parseAiConfig, parseScoringRules } from '../../../lib/survey-config-db';
import { getScannerAiConfig, buildAnalysisStream, buildPlanStream } from '../../../lib/scanner-ai';
import { isResponseOwnedByUser } from '../../../lib/scanner-history-db';
import { getUserByEmail } from '../../../lib/user-db';
import { createAuth } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const body = (await ctx.request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const responseId = typeof body.response_id === 'number' ? body.response_id : parseInt(String(body.response_id), 10);
  if (!responseId || Number.isNaN(responseId)) {
    return new Response(JSON.stringify({ error: 'response_id is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const type = typeof body.type === 'string' ? body.type : 'all';
  if (!['analysis', 'plan', 'all'].includes(type)) {
    return new Response(JSON.stringify({ error: 'type must be "analysis", "plan", or "all"' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Auth check
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Vui lòng đăng nhập' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  // Load response first to check email ownership
  const response = await getScannerResponse(env.DB, responseId);
  if (!response) {
    return new Response(JSON.stringify({ error: 'Response not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  // Ownership check — match [id].astro logic: allow both scanner_history and email match
  const owned = await isResponseOwnedByUser(env.DB, session.user.id, responseId);
  const ownsByEmail = response.email
    ? (await getUserByEmail(env.DB, response.email))?.id === session.user.id
    : false;

  if (!owned && !ownsByEmail) {
    return new Response(JSON.stringify({ error: 'Không có quyền với kết quả này' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  const full = await getSurveyDefinitionFull(env.DB, response.survey_id);
  if (!full) {
    return new Response(JSON.stringify({ error: 'Survey definition not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  const aiConfig = await getScannerAiConfig(env.DB);
  if (!aiConfig) {
    return new Response(JSON.stringify({ error: 'AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  const surveyAiConfig = parseAiConfig(full.definition.ai_config);
  const scoringRules = parseScoringRules(full.definition.scoring_rules);
  const modelConfig = {
    ...aiConfig.config,
    max_tokens: surveyAiConfig.max_tokens_override ?? aiConfig.maxTokens,
  };

  const types: Array<'analysis' | 'plan'> = type === 'all' ? ['analysis', 'plan'] : [type as 'analysis' | 'plan'];
  const r2Keys: Record<string, string> = {};

  const setStatus = (resultType: 'analysis' | 'plan', status: 'pending' | 'running' | 'done' | 'failed') => (
    resultType === 'analysis'
      ? updateAiAnalysisStatus(env.DB, responseId, status)
      : updateAiPlanStatus(env.DB, responseId, status)
  );

  const stream = new ReadableStream({
    async start(controller) {
      let activeType: 'analysis' | 'plan' | null = null;
      try {
        for (const t of types) {
          activeType = t;
          sseEnqueue(controller, 'status', { status: 'streaming', message: `Đang phân tích ${t === 'analysis' ? 'phân tích' : 'kế hoạch'}...` });

          let fullText = '';

          // Build the stream
          let aiStream: ReadableStream<string>;
          if (t === 'analysis') {
            aiStream = buildAnalysisStream(response, full, surveyAiConfig, scoringRules, modelConfig);
          } else {
            aiStream = buildPlanStream(response, full, surveyAiConfig, scoringRules, modelConfig);
          }

          // Set status to running
          await setStatus(t, 'running');

          // Stream chunks to client, accumulate for R2
          const reader = aiStream.getReader();

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const text = value;
              if (text) {
                // ai-client.ts streams raw text chunks (not SSE-encoded).
                fullText += text;
                sseEnqueue(controller, 'chunk', { text, type: t });
              }
            }
          } finally {
            reader.releaseLock();
          }

          if (!fullText.trim()) throw new Error('AI returned an empty result');

          // Save to R2 and update DB
          sseEnqueue(controller, 'status', { status: 'saving', message: 'Đang lưu kết quả...' });

          try {
            const r2Key = scannerAiR2Key(responseId, t);
            await streamAndSaveToR2(env, r2Key, new ReadableStream({
              start(c) { c.enqueue(new TextEncoder().encode(fullText)); c.close(); }
            }));
            r2Keys[t] = r2Key;

            if (t === 'analysis') {
              await updateAiAnalysis(env.DB, responseId, fullText);
              await updateAiAnalysisStatus(env.DB, responseId, 'done');
            } else {
              await updateAiPlan(env.DB, responseId, fullText);
              await updateAiPlanStatus(env.DB, responseId, 'done');
            }

            sseEnqueue(controller, 'status', { status: 'done', message: 'Hoàn tất', type: t });
          } catch (saveErr) {
            console.error(`[run-ai-stream] Failed to save ${t} to R2:`, saveErr);
            // Still save to DB even if R2 fails
            if (t === 'analysis') {
              await updateAiAnalysis(env.DB, responseId, fullText);
              await updateAiAnalysisStatus(env.DB, responseId, 'done');
            } else {
              await updateAiPlan(env.DB, responseId, fullText);
              await updateAiPlanStatus(env.DB, responseId, 'done');
            }
            sseEnqueue(controller, 'status', { status: 'done', message: 'Hoàn tất (lưu DB)', type: t });
          }
        }

        // Send final done event
        sseEnqueue(controller, 'done', { r2_keys: r2Keys });
        controller.close();
      } catch (err) {
        console.error('[run-ai-stream] Stream error:', err);
        if (activeType) await setStatus(activeType, 'failed');
        sseEnqueue(controller, 'error', { message: String(err) });
        controller.close();
      }
    },
  });

  return sseResponse(stream);
};
