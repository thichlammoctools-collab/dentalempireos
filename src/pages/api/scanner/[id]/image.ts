import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json, notFound } from '../../../../lib/api-helpers';
import { getRetainedScannerResponseForOwner } from '../../../../lib/scanner-history-db';
import { createAuth } from '../../../../lib/auth';
import { canAccessScanner } from '../../../../lib/entitlement-check';

export const prerender = false;
type ImageType = 'analysis' | 'plan';
type AuthorizedImageRequest =
  | { error: Response }
  | { id: number; type: ImageType; response: NonNullable<Awaited<ReturnType<typeof getRetainedScannerResponseForOwner>>> };

async function getAuthorizedImageRequest(params: Record<string, string | undefined>, request: Request): Promise<AuthorizedImageRequest> {
  const id = parseInt(params.id ?? '', 10);
  if (!id) return { error: badRequest('id is required') };

  const type = new URL(request.url).searchParams.get('type');
  if (type !== 'analysis' && type !== 'plan') return { error: badRequest('type must be "analysis" or "plan"') };

  const session = await createAuth(env).api.getSession({ headers: request.headers });
  if (!session?.user) return { error: json({ error: 'Vui lòng đăng nhập' }, 401) };

  const response = await getRetainedScannerResponseForOwner(env.DB, session.user.id, id);
  // Do not distinguish a foreign ID from a missing or expired raw report.
  if (!response) return { error: notFound('Response not found') };
  if (!await canAccessScanner(env.DB, session.user.id, response.survey_id)) {
    return { error: json({ error: 'Scanner này yêu cầu nâng cấp dịch vụ.' }, 402) };
  }

  return { id, type, response };
}

export const GET: APIRoute = async ({ params, request }) => {
  const authorized = await getAuthorizedImageRequest(params, request);
  if ('error' in authorized) return authorized.error;
  const { type, response } = authorized;
  const key = type === 'analysis' ? response.image_analysis_key : response.image_plan_key;
  if (!key) return notFound('Report image not found');
  const image = await env.MEDIA.get(key);
  if (!image) return notFound('Report image not found');

  const download = new URL(request.url).searchParams.get('download') === '1';
  const filename = `scanner-${response.survey_id}-${type}-${authorized.id}.${image.httpMetadata?.contentType === 'image/jpeg' ? 'jpg' : 'png'}`;
  return new Response(image.body, {
    headers: {
      'Content-Type': image.httpMetadata?.contentType ?? 'image/png',
      'Content-Disposition': download ? `attachment; filename="${filename}"` : 'inline',
      'Cache-Control': 'private, max-age=3600',
    },
  });
};
