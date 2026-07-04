// Public API: Check if user has unlocked a scanner response (for paywall).
// GET /api/scanner/check-access?id=<responseId>&product_id=<productId>

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { getScannerResponse } from '../../../lib/scanner-response-db';
import { hasAccess } from '../../../lib/payos-db';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const responseId = parseInt(url.searchParams.get('id') ?? '', 10);
  const productId = url.searchParams.get('product_id');

  if (!responseId) return badRequest('id is required');
  if (!productId) return badRequest('product_id is required');

  // Resolve user via response email
  const response = await getScannerResponse(env.DB, responseId);
  if (!response || !response.email) return json({ hasAccess: false });

  const user = await env.DB
    .prepare('SELECT id FROM "user" WHERE email = ? LIMIT 1')
    .bind(response.email)
    .first<{ id: string }>();
  if (!user) return json({ hasAccess: false });

  // Check access (handles Scanner Pack, direct product, and Mini Scanner Pro)
  const access = await hasAccess(env.DB, user.id, productId);
  return json({ hasAccess: access });
};