import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../lib/api-helpers';
import { getPostById } from '../../../lib/blog-db';
import { getCourse } from '../../../lib/course-db';
import { getActiveCreditPricingRule, getCreditBalance, InsufficientCreditsError, redeemContentWithCredits } from '../../../lib/credit-db';
import { getResource } from '../../../lib/resource-db';

export const prerender = false;

type ContentType = 'book' | 'blog' | 'course' | 'resource';

function asInteger(value: unknown): number | null {
  return typeof value === 'number' && Number.isSafeInteger(value) ? value : null;
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Vui lòng đăng nhập để mở khóa nội dung.' }, 401);
  const body = await request.json().catch(() => null) as {
    content_type?: unknown;
    content_id?: unknown;
    days?: unknown;
    idempotency_key?: unknown;
  } | null;
  const contentType = body?.content_type;
  const contentId = typeof body?.content_id === 'string' ? body.content_id.trim() : '';
  if (contentType !== 'book' && contentType !== 'blog' && contentType !== 'course' && contentType !== 'resource') {
    return badRequest('content_type không hợp lệ');
  }
  if (!contentId) return badRequest('content_id là bắt buộc');

  let canonicalContentId = contentId;
  let credits = 0;
  let durationDays: number | undefined;
  let pricingRule: Awaited<ReturnType<typeof getActiveCreditPricingRule>> = null;

  if (contentType === 'book') {
    const chapter = await env.DB.prepare('SELECT "is_premium" FROM "chapter" WHERE "id" = ?').bind(contentId).first<{ is_premium: number }>();
    if (!chapter || chapter.is_premium !== 1) return json({ error: 'Chương Premium không tồn tại.' }, 404);
    durationDays = asInteger(body?.days);
    if (!durationDays || durationDays < 1 || durationDays > 365) return badRequest('Số ngày phải từ 1 đến 365');
    canonicalContentId = '*';
    credits = durationDays;
  } else if (contentType === 'blog') {
    const post = await getPostById(env.DB, contentId);
    if (!post || post.access_tier !== 'premium') return json({ error: 'Bài viết Premium không tồn tại.' }, 404);
    durationDays = asInteger(body?.days);
    if (!durationDays || durationDays < 1 || durationDays > 365) return badRequest('Số ngày phải từ 1 đến 365');
    canonicalContentId = '*';
    credits = durationDays;
  } else if (contentType === 'course') {
    const course = await getCourse(env.DB, contentId);
    if (!course || course.is_published !== 1 || course.access_tier !== 'premium') return json({ error: 'Khóa học Premium không tồn tại.' }, 404);
    durationDays = asInteger(body?.days);
    if (!durationDays || durationDays < 1 || durationDays > 365) return badRequest('Số ngày phải từ 1 đến 365');
    credits = durationDays;
  } else {
    const resource = await getResource(env.DB, contentId);
    if (!resource || resource.tier !== 'premium') return json({ error: 'Tài liệu Premium không tồn tại.' }, 404);
    pricingRule = await getActiveCreditPricingRule(env.DB, 'resource', contentId);
    credits = pricingRule?.credit_amount ?? 0;
  }

  if (!Number.isSafeInteger(credits) || credits <= 0) {
    return json({ error: 'Nội dung này chưa được cấu hình giá Credits.' }, 409);
  }
  const idempotencyKey = typeof body?.idempotency_key === 'string' && body.idempotency_key.trim()
    ? body.idempotency_key.trim()
    : crypto.randomUUID();

  try {
    const redemption = await redeemContentWithCredits(env.DB, {
      userId: locals.user.id,
      contentType: contentType as ContentType,
      contentId: canonicalContentId,
      credits,
      durationDays,
      idempotencyKey,
      priceSnapshot: pricingRule
        ? { ruleId: pricingRule.id, ruleVersion: pricingRule.rule_version, credits }
        : { policy: 'one_credit_per_day', credits, durationDays },
    });
    return json({
      ok: true,
      alreadyGranted: redemption.alreadyGranted,
      contentType,
      contentId: canonicalContentId,
      creditsCharged: redemption.consumption?.credits ?? 0,
      expiresAt: redemption.expiresAt,
      balance: await getCreditBalance(env.DB, locals.user.id),
    });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return json({ error: 'Bạn không đủ Credits để mở khóa nội dung này.', code: 'insufficient_credits' }, 402);
    }
    console.error('[credits/redeem] failed:', error);
    return json({ error: 'Không thể hoàn tất mở khóa bằng Credits.' }, 500);
  }
};
