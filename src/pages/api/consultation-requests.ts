import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../lib/api-helpers';
import {
  checkConsultationRateLimit,
  consultationInterestValues,
  createConsultationRequest,
  type ConsultationInterest,
} from '../../lib/consultation-request-db';
import { hashIp, validateEmail } from '../../lib/newsletter';
import { readAttributionFromPayload, recordSiteEvent, sanitizeAnonymousId } from '../../lib/site-analytics';
import { sendConsultationTelegramNotification } from '../../lib/telegram';

export const prerender = false;

const MAX_BODY_BYTES = 12_000;
const PHONE_FORMAT_RE = /^[0-9+\s().-]+$/;
const NORMALIZED_PHONE_RE = /^\+?[0-9]{9,15}$/;

function cleanText(value: unknown, label: string, min: number, max: number, required = true): string | null {
  if (typeof value !== 'string') {
    if (!required && (value === undefined || value === null)) return null;
    throw new Error(`${label} không hợp lệ.`);
  }
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned && !required) return null;
  if (cleaned.length < min) throw new Error(`${label} cần ít nhất ${min} ký tự.`);
  if (cleaned.length > max) throw new Error(`${label} tối đa ${max} ký tự.`);
  return cleaned;
}

// POST /api/consultation-requests — public lead capture; intentionally unauthenticated.
export const POST: APIRoute = async ({ request, locals }) => {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ error: 'Dữ liệu gửi lên quá lớn.' }, 413);
  }
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return badRequest('Content-Type phải là application/json.');
  }

  const rawBody = await request.text().catch(() => '');
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return json({ error: 'Dữ liệu gửi lên quá lớn.' }, 413);
  }
  const body = (() => {
    try {
      return JSON.parse(rawBody) as unknown;
    } catch {
      return null;
    }
  })();
  if (!body || typeof body !== 'object' || Array.isArray(body)) return badRequest('JSON không hợp lệ.');

  try {
    const payload = body as Record<string, unknown>;
    const allowedFields = new Set([
      'name',
      'phone',
      'email',
      'clinic_name',
      'team_size',
      'service_interest',
      'message',
      'website',
      'anonymous_id',
      'source',
      'referrer_host',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ]);
    if (Object.keys(payload).some((key) => !allowedFields.has(key))) {
      throw new Error('Dữ liệu gửi lên không hợp lệ.');
    }
    // Honeypot field. Reply successfully to avoid helping automated submissions adapt.
    if (typeof payload.website === 'string' && payload.website.trim()) {
      return json({ ok: true });
    }

    const name = cleanText(payload.name, 'Họ và tên', 2, 100);
    const phone = cleanText(payload.phone, 'Số điện thoại', 8, 24);
    const normalizedPhone = phone?.replace(/[\s().-]/g, '') ?? '';
    if (!phone || !PHONE_FORMAT_RE.test(phone) || !NORMALIZED_PHONE_RE.test(normalizedPhone)) {
      throw new Error('Số điện thoại không hợp lệ.');
    }

    const email = cleanText(payload.email, 'Email', 0, 254, false);
    if (email) {
      const emailError = validateEmail(email);
      if (emailError) throw new Error(emailError);
    }

    const clinicName = cleanText(payload.clinic_name, 'Tên phòng khám', 0, 160, false);
    const teamSize = cleanText(payload.team_size, 'Quy mô nhân sự', 0, 80, false);
    const message = cleanText(payload.message, 'Nội dung cần tư vấn', 10, 2_000);
    const serviceInterest = payload.service_interest;
    if (typeof serviceInterest !== 'string' || !consultationInterestValues.includes(serviceInterest as ConsultationInterest)) {
      throw new Error('Nhu cầu tư vấn không hợp lệ.');
    }

    const rawIp = request.headers.get('CF-Connecting-IP') ?? request.headers.get('x-forwarded-for')?.split(',')[0] ?? null;
    const ipHash = await hashIp(rawIp);
    if (ipHash) {
      const rateLimit = await checkConsultationRateLimit(env.DB, ipHash);
      if (!rateLimit.allowed) {
        return json({ error: 'Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau ít phút.' }, 429);
      }
    }

    const attribution = readAttributionFromPayload(payload);
    const anonymousId = sanitizeAnonymousId(payload.anonymous_id);
    const consultationRequest = await createConsultationRequest(env.DB, {
      name: name!,
      phone: normalizedPhone,
      email: email?.toLowerCase() ?? null,
      clinicName,
      teamSize,
      serviceInterest: serviceInterest as ConsultationInterest,
      message: message!,
      ipHash,
      anonymousId,
      attribution,
    });
    if (anonymousId) {
      await recordSiteEvent(env.DB, {
        anonymousId,
        eventName: 'consultation_submitted',
        pagePath: '/dich-vu',
        props: { service_interest: serviceInterest as ConsultationInterest, lead_type: 'consultation' },
      });
    }

    const notification = sendConsultationTelegramNotification(
      consultationRequest,
      env.TELEGRAM_BOT_TOKEN,
      env.TELEGRAM_CHAT_ID,
    ).catch((error: unknown) => {
      console.error('[consultation] Failed to send Telegram notification:', error);
    });
    const waitUntil = locals.cfContext?.waitUntil?.bind(locals.cfContext);
    if (waitUntil) {
      waitUntil(notification);
    } else {
      await notification;
    }

    return json({ ok: true, id: consultationRequest.id }, 201);
  } catch (error) {
    if (error instanceof Error) return badRequest(error.message);
    return badRequest('Dữ liệu không hợp lệ.');
  }
};
