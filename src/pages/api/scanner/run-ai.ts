// API: Trigger AI analysis/plan generation on-demand (click-to-run).
// POST /api/scanner/run-ai
// Body: { response_id: number, type: 'analysis' | 'plan' | 'all' }
// Requires auth — returns 401 if not logged in.
// Uses ctx.waitUntil() to run AI in background, returns 202 immediately.

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { runAiAnalysis, runPlanAnalysis } from '../../../lib/scanner-ai';
import { isResponseOwnedByUser } from '../../../lib/scanner-history-db';
import { createAuth } from '../../../lib/auth';
import { getScannerResponse } from '../../../lib/scanner-response-db';
import { hasScannerAccess } from '../../../lib/payos-db';
import { getUserByEmail } from '../../../lib/user-db';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const body = (await ctx.request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');

  const responseId = typeof body.response_id === 'number' ? body.response_id : parseInt(String(body.response_id), 10);
  if (!responseId || Number.isNaN(responseId)) {
    return badRequest('response_id is required');
  }

  const type = typeof body.type === 'string' ? body.type : 'all';
  if (!['analysis', 'plan', 'all'].includes(type)) {
    return badRequest('type must be "analysis", "plan", or "all"');
  }

  // Auth check
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return json({ error: 'Vui lòng đăng nhập' }, 401);
  }

  const response = await getScannerResponse(env.DB, responseId);
  if (!response) return json({ error: 'Không tìm thấy kết quả này' }, 404);

  const owned = await isResponseOwnedByUser(env.DB, session.user.id, responseId);
  const ownsByEmail = response.email
    ? (await getUserByEmail(env.DB, response.email))?.id === session.user.id
    : false;
  if (!owned && !ownsByEmail) {
    return json({ error: 'Không có quyền với kết quả này' }, 403);
  }

  const definition = await env.DB
    .prepare('SELECT is_free FROM "survey_definition" WHERE id = ?')
    .bind(response.survey_id)
    .first<{ is_free: number }>();
  if (!definition) return json({ error: 'Không tìm thấy scanner' }, 404);

  if (definition.is_free === 0 && type !== 'plan' && !await hasScannerAccess(env.DB, session.user.id, response.survey_id)) {
    return json({ error: 'Bạn cần mở khóa scanner này để chạy phân tích AI.' }, 402);
  }

  // Queue AI work in background via waitUntil
  const tasks: Promise<void>[] = [];
  if (type === 'analysis' || type === 'all') {
    tasks.push(runAiAnalysis(env.DB, responseId));
  }
  if (type === 'plan' || type === 'all') {
    tasks.push(runPlanAnalysis(env.DB, responseId));
  }

  if (ctx.waitUntil) {
    ctx.waitUntil(Promise.allSettled(tasks));
  } else {
    // Fallback if waitUntil is unavailable — still run async but won't survive request termination
    Promise.allSettled(tasks).catch((err) => {
      console.error('[run-ai] Background task error:', err);
    });
  }

  return json({ queued: true, type }, 202);
};
