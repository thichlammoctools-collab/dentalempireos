// Authenticated API: Get a scanner response for its owner or an admin.
// GET /api/scanner/[id]

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../lib/api-helpers';
import { getOwnedScannerResponsePollingDto } from '../../../lib/scanner-response-db';
import { createAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const id = parseInt(params.id ?? '', 10);
  if (!id) return badRequest('id is required');

  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'Vui lòng đăng nhập' }, 401);

  const response = await getOwnedScannerResponsePollingDto(env.DB, id, session.user.id);
  // Missing, foreign, and expired raw reports intentionally share this response.
  if (!response) return notFound('Response not found');
  return json(response);
};
