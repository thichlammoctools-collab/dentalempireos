// Public API: Get a single scanner response (with email masked for non-admin).
// GET /api/scanner/[id]

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../lib/api-helpers';
import { getScannerResponse, maskEmail, parseScores } from '../../../lib/scanner-response-db';

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  const id = parseInt(params.id ?? '', 10);
  if (!id) return badRequest('id is required');

  const isAdmin = url.searchParams.get('admin') === '1';

  const response = await getScannerResponse(env.DB, id);
  if (!response) return notFound('Response not found');

  // Mask email unless admin param
  const masked = isAdmin ? response : {
    ...response,
    email: response.email ? maskEmail(response.email) : null,
  };

  return json(masked);
};