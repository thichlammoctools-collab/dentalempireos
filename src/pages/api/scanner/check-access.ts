// Public API: Check if user has unlocked a scanner response (for paywall).
// GET /api/scanner/check-access?id=<responseId>&product_id=<productId>

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { getScannerResponse } from '../../../lib/scanner-response-db';
import { hasAccess } from '../../../lib/payos-db';
import { createAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ url, request }) => {
  const responseId = parseInt(url.searchParams.get('id') ?? '', 10);
  const productId = url.searchParams.get('product_id');

  if (!responseId) return badRequest('id is required');
  if (!productId) return badRequest('product_id is required');

  // Try to resolve user: first from session (logged-in), then from response email
  let userId: string | null = null;

  // 1. Check if user is logged in via session
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user) {
    userId = session.user.id;
  }

  // 2. Fall back to response email if no session
  if (!userId) {
    const response = await getScannerResponse(env.DB, responseId);
    if (response?.email) {
      const user = await env.DB
        .prepare('SELECT id FROM "user" WHERE email = ? LIMIT 1')
        .bind(response.email)
        .first<{ id: string }>();
      userId = user?.id ?? null;
    }
  }

  if (!userId) return json({ hasAccess: false });

  // Check access (handles Scanner Pack, direct product, and Mini Scanner Pro)
  const access = await hasAccess(env.DB, userId, productId);
  return json({ hasAccess: access });
};