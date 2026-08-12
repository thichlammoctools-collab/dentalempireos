import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json, notFound } from '../../../../lib/api-helpers';
import { getScannerResponse } from '../../../../lib/scanner-response-db';
import { isResponseOwnedByUser } from '../../../../lib/scanner-history-db';
import { getUserByEmail } from '../../../../lib/user-db';
import { createAuth } from '../../../../lib/auth';
import { canAccessScanner } from '../../../../lib/entitlement-check';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const id = parseInt(params.id ?? '', 10);
  if (!id) return badRequest('id is required');

  const type = new URL(request.url).searchParams.get('type');
  if (type !== 'analysis' && type !== 'plan') return badRequest('type must be "analysis" or "plan"');

  const session = await createAuth(env).api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'Vui lòng đăng nhập' }, 401);

  const response = await getScannerResponse(env.DB, id);
  if (!response) return notFound('Response not found');
  const owned = await isResponseOwnedByUser(env.DB, session.user.id, id);
  const ownsByEmail = response.email
    ? (await getUserByEmail(env.DB, response.email))?.id === session.user.id
    : false;
  if (!owned && !ownsByEmail) return json({ error: 'Không có quyền với kết quả này' }, 403);
  if (!await canAccessScanner(env.DB, session.user.id, response.survey_id)) {
    return json({ error: 'Scanner này yêu cầu nâng cấp dịch vụ.' }, 402);
  }

  const key = type === 'analysis' ? response.image_analysis_key : response.image_plan_key;
  if (!key) return notFound('Report image not found');
  const image = await env.MEDIA.get(key);
  if (!image) return notFound('Report image not found');

  return new Response(image.body, {
    headers: {
      'Content-Type': image.httpMetadata?.contentType ?? 'image/png',
      'Content-Disposition': 'inline',
      'Cache-Control': 'private, max-age=3600',
    },
  });
};
