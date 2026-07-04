// Admin API: Re-generate AI analysis + plan for a scanner response.
// POST /api/admin/scanner/regenerate-ai?id=<responseId>
// Admin-only (via middleware auth check)

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { runAiAnalysis, runPlanAnalysis } from '../../../../lib/scanner-ai';
import { isAiEnabled } from '../../../../lib/ai-settings-db';
import { getScannerResponse } from '../../../../lib/scanner-response-db';

export const prerender = false;

export const POST: APIRoute = async ({ url, locals }) => {
  // Admin auth check (middleware already validates, but double-check here)
  const isAdmin = locals.user && (env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(locals.user.email.toLowerCase());

  if (!isAdmin || !locals.user) {
    return json({ error: 'unauthorized' }, 401);
  }

  const id = parseInt(url.searchParams.get('id') ?? '', 10);
  if (!id) return badRequest('id is required');

  const response = await getScannerResponse(env.DB, id);
  if (!response) return badRequest('Response not found');

  const aiEnabled = await isAiEnabled(env.DB);
  if (!aiEnabled) {
    return json({ error: 'AI is not enabled. Please configure AI settings first.' }, 400);
  }

  const results: { analysis?: string; plan?: string; error?: string } = {};

  try {
    await runAiAnalysis(env.DB, id);
    results.analysis = 'done';
  } catch (err) {
    results.error = `Analysis failed: ${err instanceof Error ? err.message : String(err)}`;
  }

  try {
    await runPlanAnalysis(env.DB, id);
    results.plan = 'done';
  } catch (err) {
    results.error = results.error
      ? `${results.error} | Plan failed: ${err instanceof Error ? err.message : String(err)}`
      : `Plan failed: ${err instanceof Error ? err.message : String(err)}`;
  }

  if (results.error) {
    return json(results, 500);
  }

  return json({ success: true, ...results });
};
