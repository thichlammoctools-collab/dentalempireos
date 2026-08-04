// Authenticated API: Get a scanner response for its owner or an admin.
// GET /api/scanner/[id]

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../lib/api-helpers';
import { getScannerResponse, maskEmail } from '../../../lib/scanner-response-db';
import { isResponseOwnedByUser } from '../../../lib/scanner-history-db';
import { createAuth } from '../../../lib/auth';
import { getUserByEmail } from '../../../lib/user-db';
import { canAccessScanner } from '../../../lib/entitlement-check';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const id = parseInt(params.id ?? '', 10);
  if (!id) return badRequest('id is required');

  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'Vui lòng đăng nhập' }, 401);

  const response = await getScannerResponse(env.DB, id);
  if (!response) return notFound('Response not found');

  const owned = await isResponseOwnedByUser(env.DB, session.user.id, id);
  const ownsByEmail = response.email
    ? (await getUserByEmail(env.DB, response.email))?.id === session.user.id
    : false;
  if (!owned && !ownsByEmail) return json({ error: 'Không có quyền với kết quả này' }, 403);

  if (!await canAccessScanner(env.DB, session.user.id, response.survey_id)) {
     return json({ error: 'Scanner này yêu cầu nâng cấp dịch vụ.', upgradeUrl: '/dich-vu', upgrade_url: '/dich-vu' }, 402);
  }

  const result = {
    ...response,
    email: response.email ? maskEmail(response.email) : null,
  };

  return json(result);
};
