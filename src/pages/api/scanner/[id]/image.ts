import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json, notFound } from '../../../../lib/api-helpers';
import { getScannerResponse } from '../../../../lib/scanner-response-db';
import { isResponseOwnedByUser } from '../../../../lib/scanner-history-db';
import { getUserByEmail } from '../../../../lib/user-db';
import { createAuth } from '../../../../lib/auth';
import { canAccessScanner } from '../../../../lib/entitlement-check';
import { getSurveyDefinitionFull } from '../../../../lib/survey-config-db';
import { generateQueuedScannerReportImage } from '../../../../lib/scanner-report-image';
import { AiError } from '../../../../lib/ai-client';

export const prerender = false;
type ImageType = 'analysis' | 'plan';
type AuthorizedImageRequest =
  | { error: Response }
  | { id: number; type: ImageType; response: NonNullable<Awaited<ReturnType<typeof getScannerResponse>>> };

async function getAuthorizedImageRequest(params: Record<string, string | undefined>, request: Request): Promise<AuthorizedImageRequest> {
  const id = parseInt(params.id ?? '', 10);
  if (!id) return { error: badRequest('id is required') };

  const type = new URL(request.url).searchParams.get('type');
  if (type !== 'analysis' && type !== 'plan') return { error: badRequest('type must be "analysis" or "plan"') };

  const session = await createAuth(env).api.getSession({ headers: request.headers });
  if (!session?.user) return { error: json({ error: 'Vui lòng đăng nhập' }, 401) };

  const response = await getScannerResponse(env.DB, id);
  if (!response) return { error: notFound('Response not found') };
  const owned = await isResponseOwnedByUser(env.DB, session.user.id, id);
  const ownsByEmail = response.email
    ? (await getUserByEmail(env.DB, response.email))?.id === session.user.id
    : false;
  if (!owned && !ownsByEmail) return { error: json({ error: 'Không có quyền với kết quả này' }, 403) };
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

// The user explicitly starts image generation after reading a completed report.
export const POST: APIRoute = async ({ params, request }) => {
  const authorized = await getAuthorizedImageRequest(params, request);
  if ('error' in authorized) return authorized.error;
  const { type, response } = authorized;
  const reportText = type === 'analysis' ? response.ai_analysis : response.ai_plan;
  if (!reportText?.trim()) {
    return json({ error: 'Hoàn tất báo cáo chữ trước khi tạo minh họa.' }, 409);
  }

  const definition = await getSurveyDefinitionFull(env.DB, response.survey_id);
  if (!definition) return notFound('Survey definition not found');
  try {
    const key = await generateQueuedScannerReportImage(env, response, definition.definition.title_vi, type);
    if (key) return json({ created: true, key }, 201);
    return json({ error: 'Minh họa đang được tạo trong một yêu cầu khác. Vui lòng thử lại sau ít phút.' }, 409);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không thể tạo minh họa.';
    const status = error instanceof AiError && error.statusCode >= 400 && error.statusCode < 600
      ? error.statusCode
      : 502;
    return json({ error: message }, status);
  }
};
