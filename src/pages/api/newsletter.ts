import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../lib/api-helpers';
import { subscribe, validateEmail, hashIp, checkRateLimit, unsubscribe } from '../../lib/newsletter';
import { readAttributionFromPayload, recordSiteEvent, sanitizeAnonymousId } from '../../lib/site-analytics';
import { sendWelcomeEmail } from '../../lib/resend';

export const prerender = false;

// POST /api/newsletter — subscribe + send welcome email
export const POST: APIRoute = async ({ request, locals }) => {
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json() as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return badRequest('Invalid JSON');
  }
  const allowedFields = new Set(['email', 'source', 'post_slug', 'post_title', 'anonymous_id', 'referrer_host', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']);
  if (Object.keys(body).some((key) => !allowedFields.has(key))) return badRequest('Dữ liệu gửi lên không hợp lệ.');
  if (typeof body.email !== 'string') return badRequest('Email là bắt buộc.');

  const emailError = validateEmail(body.email);
  if (emailError) return badRequest(emailError);

  const ip = request.headers.get('CF-Connecting-IP')
    ?? request.headers.get('x-forwarded-for')
    ?? null;
  const ipHash = await hashIp(ip);

  if (ipHash) {
    const { allowed } = await checkRateLimit(env.DB, ipHash);
    if (!allowed) {
      return json(
        { error: 'Quá nhiều lần đăng ký. Vui lòng thử lại sau.' },
        429,
      );
    }
  }

  const source = typeof body.source === 'string' && body.source.length <= 120 ? body.source : 'blog';
  const postSlug = typeof body.post_slug === 'string' && body.post_slug.length <= 160 ? body.post_slug : undefined;
  const postTitle = typeof body.post_title === 'string' && body.post_title.length <= 200 ? body.post_title : undefined;
  const anonymousId = sanitizeAnonymousId(body.anonymous_id);
  const attribution = readAttributionFromPayload(body);
  const result = await subscribe(env.DB, {
    email: body.email,
    source,
    postSlug,
    ip: ipHash ?? undefined,
    anonymousId,
    attribution,
  });
  if (result.success && anonymousId) {
    await recordSiteEvent(env.DB, {
      anonymousId,
      eventName: 'lead_submitted',
      pagePath: '/newsletter',
      props: { lead_type: 'newsletter', placement: source },
    });
  }

  if (!result.success) {
    return json({ error: result.error ?? 'Lỗi đăng ký.' }, 500);
  }

  if (!result.alreadySubscribed) {
    // Fire welcome email async — don't block the response
    const waitUntil = locals.cfContext?.waitUntil?.bind(locals.cfContext);
    waitUntil?.(
      sendWelcomeEmail({
        email: body.email,
        source,
        postSlug,
        postTitle,
      }).catch((err: unknown) => {
        console.error('[newsletter] Failed to send welcome email:', err);
      }),
    );
  }

  return json({
    success: true,
    message: result.alreadySubscribed
      ? 'Email đã được đăng ký trước đó.'
      : 'Đăng ký thành công! Vui lòng kiểm tra email.',
  });
};

// GET /api/newsletter?action=unsubscribe&email=... — unsubscribe link
export const GET: APIRoute = async ({ url }) => {
  const action = url.searchParams.get('action');
  const email = url.searchParams.get('email');

  if (action === 'unsubscribe' && email) {
    const ok = await unsubscribe(env.DB, email);
    const html = ok
      ? `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Đã hủy đăng ký</title><style>body{font-family:system-ui,sans-serif;background:#0a0a14;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box}div{background:#1e1e2e;border:1px solid rgba(34,211,238,0.2);border-radius:16px;padding:40px;text-align:center;max-width:480px}h1{color:#22d3ee;font-size:24px;margin:0 0 12px}p{color:#94a3b8;font-size:14px;line-height:1.6;margin:0}</style></head><body><div><h1>Đã hủy đăng ký</h1><p>Bạn sẽ không nhận email nào từ Dental Empire OS nữa. Cảm ơn bạn đã đồng hành cùng chúng tôi!</p></div></body></html>`
      : `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Không tìm thấy</title><style>body{font-family:system-ui,sans-serif;background:#0a0a14;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box}div{background:#1e1e2e;border:1px solid rgba(34,211,238,0.2);border-radius:16px;padding:40px;text-align:center;max-width:480px}h1{color:#22d3ee;font-size:24px;margin:0 0 12px}p{color:#94a3b8;font-size:14px;line-height:1.6;margin:0}</style></head><body><div><h1>Không tìm thấy</h1><p>Email không có trong danh sách đăng ký của chúng tôi.</p></div></body></html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return badRequest('Invalid action');
};
