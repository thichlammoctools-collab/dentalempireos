// Owner-only plan lookup from a still-retained scanner response.
// GET /api/scanner/[id]/action-plan

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, notFound } from '../../../../lib/api-helpers';
import { createAuth } from '../../../../lib/auth';
import { getScannerActionPlanForResponseForUser } from '../../../../lib/scanner-action-plan-db';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'unauthorized' }, 401);

  const responseId = Number(params.id);
  if (!Number.isSafeInteger(responseId) || responseId <= 0) return notFound('not_found');
  const plan = await getScannerActionPlanForResponseForUser(env.DB, responseId, session.user.id);
  if (!plan || plan.retention_visibility === 'unavailable') return notFound('not_found');
  return json({ planId: plan.id, generationState: plan.generation_state, status: plan.status });
};
