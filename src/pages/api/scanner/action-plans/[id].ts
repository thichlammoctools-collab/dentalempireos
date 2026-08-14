// Authenticated owner API for normalized Scanner action plans.
// GET /api/scanner/action-plans/[id]?include_audit=1

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, notFound } from '../../../../lib/api-helpers';
import { createAuth } from '../../../../lib/auth';
import {
  getScannerActionPlanActionProgress,
  getScannerActionPlanActions,
  getScannerActionPlanForUser,
  getScannerActionPlanSnapshots,
  type ScannerActionStatus,
} from '../../../../lib/scanner-action-plan-db';

export const prerender = false;

function actionSummary(actions: Array<{ status: ScannerActionStatus }>) {
  const statuses: Record<ScannerActionStatus, number> = {
    not_started: 0,
    in_progress: 0,
    completed: 0,
    skipped: 0,
  };
  for (const action of actions) statuses[action.status] += 1;
  return { total: actions.length, ...statuses };
}

export const GET: APIRoute = async ({ params, request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'unauthorized' }, 401);

  const planId = params.id?.trim();
  if (!planId || planId.length > 100) return notFound('not_found');
  const plan = await getScannerActionPlanForUser(env.DB, planId, session.user.id);
  // Keep cross-user access non-enumerating, including for plans whose source was purged.
  // Legacy plans are intentionally withheld after source retention expiry rather
  // than rewritten, because historical ai_plan text was not PII-guarded.
  if (!plan || plan.retention_visibility === 'unavailable') return notFound('not_found');

  const includeAudit = new URL(request.url).searchParams.get('include_audit') === '1';
  const [actions, snapshots, audit] = await Promise.all([
    getScannerActionPlanActions(env.DB, plan.id),
    getScannerActionPlanSnapshots(env.DB, plan.id),
    includeAudit ? getScannerActionPlanActionProgress(env.DB, plan.id) : Promise.resolve(undefined),
  ]);
  return json({
    plan,
    actions,
    progressSummary: actionSummary(actions),
    snapshots: snapshots.map((snapshot) => ({
      id: snapshot.id,
      snapshot_kind: snapshot.snapshot_kind,
      score_total: snapshot.score_total,
      response_created_at: snapshot.response_created_at,
      created_at: snapshot.created_at,
    })),
    ...(audit ? { audit } : {}),
  });
};
