// Owner-only action progress update with optimistic concurrency.
// PATCH /api/scanner/action-plans/[id]/actions/[actionId]
// Body: { status?, note?, expected_updated_at }

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json, notFound } from '../../../../../../lib/api-helpers';
import { createAuth } from '../../../../../../lib/auth';
import {
  ScannerActionPlanConcurrencyError,
  ScannerActionPlanTransitionError,
  getNextScannerActionStatuses,
  getScannerActionPlanForUser,
  recordScannerActionPlanActionProgress,
  type ScannerActionStatus,
} from '../../../../../../lib/scanner-action-plan-db';

export const prerender = false;

const STATUS_VALUES: readonly ScannerActionStatus[] = ['not_started', 'in_progress', 'completed', 'skipped'];
const MAX_ID_LENGTH = 100;
const MAX_NOTE_LENGTH = 2_000;

export const PATCH: APIRoute = async ({ params, request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'unauthorized' }, 401);

  const planId = params.id?.trim();
  const actionId = params.actionId?.trim();
  if (!planId || !actionId || planId.length > MAX_ID_LENGTH || actionId.length > MAX_ID_LENGTH) return notFound('not_found');
  const plan = await getScannerActionPlanForUser(env.DB, planId, session.user.id);
  if (!plan || plan.retention_visibility === 'unavailable') return notFound('not_found');
  if (plan.retention_visibility === 'legacy_source_bound') return json({ error: 'action_plan_read_only' }, 403);

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return badRequest('invalid_json');
  const allowed = new Set(['status', 'note', 'expected_updated_at']);
  if (Object.keys(body).some((key) => !allowed.has(key))) return badRequest('unsupported_field');
  if (body.status !== undefined && (typeof body.status !== 'string' || !STATUS_VALUES.includes(body.status as ScannerActionStatus))) {
    return badRequest('invalid_status');
  }
  if (body.status === undefined && body.note === undefined) return badRequest('status_or_note_required');
  if (typeof body.expected_updated_at !== 'string' || !body.expected_updated_at.trim() || body.expected_updated_at.length > 64) {
    return badRequest('expected_updated_at_required');
  }
  if (body.note !== undefined && body.note !== null && (typeof body.note !== 'string' || body.note.trim().length > MAX_NOTE_LENGTH)) {
    return badRequest('invalid_note');
  }
  if (body.status === undefined && typeof body.note === 'string' && !body.note.trim()) return badRequest('status_or_note_required');

  try {
    const progress = await recordScannerActionPlanActionProgress(env.DB, {
      planId,
      actionId,
      userId: session.user.id,
      status: body.status as ScannerActionStatus | undefined,
      note: typeof body.note === 'string' ? body.note.trim() || null : undefined,
      expectedUpdatedAt: body.expected_updated_at.trim(),
    });
    const action = await env.DB.prepare(
      `SELECT action.* FROM "scanner_action_plan_action" action
       INNER JOIN "scanner_action_plan" plan ON plan."id" = action."plan_id"
       WHERE action."id" = ? AND action."plan_id" = ? AND plan."user_id" = ?`,
    ).bind(actionId, planId, session.user.id).first();
    return json({
      action: action ? { ...action, next_statuses: getNextScannerActionStatuses(action.status as ScannerActionStatus) } : null,
      progress,
    });
  } catch (error) {
    if (error instanceof ScannerActionPlanTransitionError) return json({ error: 'invalid_status_transition' }, 409);
    if (error instanceof ScannerActionPlanConcurrencyError) return json({ error: 'action_version_conflict' }, 409);
    if (error instanceof Error && /not found|archived/i.test(error.message)) return notFound('not_found');
    console.error('[scanner-action-plan] progress update failed:', error);
    return json({ error: 'action_update_failed' }, 500);
  }
};
