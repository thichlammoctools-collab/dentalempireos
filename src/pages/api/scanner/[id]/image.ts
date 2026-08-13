import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json, notFound } from '../../../../lib/api-helpers';
import { getScannerResponse } from '../../../../lib/scanner-response-db';
import { isResponseOwnedByUser } from '../../../../lib/scanner-history-db';
import { getUserByEmail } from '../../../../lib/user-db';
import { createAuth } from '../../../../lib/auth';
import { canAccessScanner } from '../../../../lib/entitlement-check';
import {
  getActiveCreditPricingRule,
  failScannerReportImageCreditRun,
  InsufficientCreditsError,
  startScannerReportImageCreditRun,
  type ScannerReportImageCreditRun,
} from '../../../../lib/credit-db';

export const prerender = false;
type ImageType = 'analysis' | 'plan';
type AuthorizedImageRequest =
  | { error: Response }
  | { id: number; type: ImageType; userId: string; response: NonNullable<Awaited<ReturnType<typeof getScannerResponse>>> };

function parseIdempotencyKey(request: Request): string | null {
  const key = request.headers.get('Idempotency-Key')?.trim() ?? '';
  return /^[A-Za-z0-9_-]{16,128}$/.test(key) ? key : null;
}

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

  return { id, type, userId: session.user.id, response };
}

async function getRun(
  responseId: number,
  imageType: ImageType,
  userId: string,
): Promise<ScannerReportImageCreditRun | null> {
  return env.DB.prepare(
    `SELECT * FROM "scanner_report_image_credit_run"
     WHERE "response_id" = ? AND "image_type" = ? AND "user_id" = ?
     ORDER BY "created_at" DESC LIMIT 1`,
  ).bind(responseId, imageType, userId).first<ScannerReportImageCreditRun>();
}

function statusPayload(
  imageKey: string | null,
  run: ScannerReportImageCreditRun | null,
) {
  if (imageKey) return { status: 'done', imageUrl: 'ready', credits: run?.credits ?? null };
  if (run?.status === 'failed') return {
    status: 'failed',
    error: run.failure_reason ?? 'Không thể tạo minh họa. Credits đã được hoàn lại.',
    credits: run.credits,
  };
  if (run?.status === 'reserved') return { status: 'running', credits: run.credits };
  return { status: 'idle', credits: null };
}

export const GET: APIRoute = async ({ params, request }) => {
  const authorized = await getAuthorizedImageRequest(params, request);
  if ('error' in authorized) return authorized.error;
  const { type, response } = authorized;
  const key = type === 'analysis' ? response.image_analysis_key : response.image_plan_key;

  if (new URL(request.url).searchParams.get('status') === '1') {
    const [run, pricingRule] = await Promise.all([
      getRun(authorized.id, type, authorized.userId),
      getActiveCreditPricingRule(env.DB, 'scanner_report_image', type),
    ]);
    return json({
      ...statusPayload(key, run),
      configuredCredits: pricingRule?.credit_amount ?? null,
    });
  }

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

// Member-only endpoint. Price, reservation, and idempotency are evaluated on the server.
export const POST: APIRoute = async ({ params, request }) => {
  const authorized = await getAuthorizedImageRequest(params, request);
  if ('error' in authorized) return authorized.error;
  const { type, response, userId } = authorized;
  const reportText = type === 'analysis' ? response.ai_analysis : response.ai_plan;
  if (!reportText?.trim()) return json({ error: 'Hoàn tất báo cáo chữ trước khi tạo minh họa.' }, 409);

  const imageKey = type === 'analysis' ? response.image_analysis_key : response.image_plan_key;
  if (imageKey) return json({ status: 'done', imageUrl: 'ready' });

  const idempotencyKey = parseIdempotencyKey(request);
  if (!idempotencyKey) return badRequest('Idempotency-Key không hợp lệ');

  const pricingRule = await getActiveCreditPricingRule(env.DB, 'scanner_report_image', type);
  if (!pricingRule?.credit_amount) {
    return json({ error: 'Admin chưa cấu hình giá Credits cho loại minh họa này.' }, 409);
  }

  try {
    const { run, created } = await startScannerReportImageCreditRun(env.DB, {
      userId,
      responseId: authorized.id,
      imageType: type,
      idempotencyKey,
      credits: pricingRule.credit_amount,
      pricingRule,
    });
    if (created) {
      try {
        await env.SCANNER_REPORT_IMAGE_QUEUE.send({
          responseId: authorized.id,
          imageType: type,
          runId: run.id,
          userId,
        });
      } catch (queueError) {
        const reason = queueError instanceof Error ? queueError.message : String(queueError);
        await failScannerReportImageCreditRun(env.DB, {
          runId: run.id,
          responseId: authorized.id,
          imageType: type,
          userId,
          reason: `queue_enqueue_failed:${reason}`,
        });
        return json({ error: 'Không thể xếp hàng tạo minh họa. Credits đã được hoàn lại.' }, 503);
      }
    }
    return json({
      status: run.status === 'completed' ? 'done' : run.status === 'failed' ? 'failed' : 'queued',
      runId: run.id,
      credits: run.credits,
      created,
    }, created ? 202 : 200);
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return json({ error: 'Credits khả dụng không đủ để tạo minh họa.' }, 402);
    }
    const message = error instanceof Error ? error.message : 'Không thể bắt đầu tạo minh họa.';
    return json({ error: message }, 409);
  }
};
