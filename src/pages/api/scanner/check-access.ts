// Public API: Check if user has unlocked a scanner (for paywall).
// GET /api/scanner/check-access?scanner_id=<scannerId>

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { hasScannerAccess } from '../../../lib/payos-db';
import { createAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ url, request }) => {
  const scannerId = url.searchParams.get('scanner_id');
  if (!scannerId) return badRequest('scanner_id is required');

  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ hasAccess: false });

  // Handles every active product mapped to this scanner, including packs.
  const access = await hasScannerAccess(env.DB, session.user.id, scannerId);
  return json({ hasAccess: access });
};
