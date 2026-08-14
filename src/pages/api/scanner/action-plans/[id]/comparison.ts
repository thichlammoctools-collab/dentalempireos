// Owner-only deterministic comparison of retained Scanner action-plan snapshots.
// GET /api/scanner/action-plans/[id]/comparison?rescan_snapshot_id=<snapshot UUID>

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, notFound } from '../../../../../lib/api-helpers';
import { createAuth } from '../../../../../lib/auth';
import { getScannerActionPlanComparison } from '../../../../../lib/scanner-action-plan-comparison';

export const prerender = false;

const SNAPSHOT_ID_MAX_LENGTH = 100;

export const GET: APIRoute = async ({ params, request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'unauthorized' }, 401);

  const planId = params.id?.trim();
  if (!planId || planId.length > 100) return notFound('not_found');
  const requestedSnapshot = new URL(request.url).searchParams.get('rescan_snapshot_id')?.trim();
  if (requestedSnapshot && requestedSnapshot.length > SNAPSHOT_ID_MAX_LENGTH) return notFound('not_found');

  const comparison = await getScannerActionPlanComparison(env.DB, {
    planId,
    userId: session.user.id,
    rescanSnapshotId: requestedSnapshot || undefined,
  });
  if (!comparison) return notFound('not_found');
  // A foreign or baseline selection is intentionally indistinguishable from no valid rescan.
  if (requestedSnapshot && !comparison.selectedRescan) return notFound('not_found');
  return json(comparison);
};
