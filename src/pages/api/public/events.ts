import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../lib/api-helpers';
import {
  TRACKABLE_EVENTS,
  recordSiteEvent,
  sanitizeAnonymousId,
  sanitizeEventProps,
  sanitizePagePath,
  type TrackableEvent,
} from '../../../lib/site-analytics';

export const prerender = false;

const MAX_BODY_BYTES = 2_000;

export const POST: APIRoute = async ({ request }) => {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ error: 'Dữ liệu gửi lên quá lớn.' }, 413);
  }
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return badRequest('Content-Type phải là application/json.');
  }

  const raw = await request.text().catch(() => '');
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return json({ error: 'Dữ liệu gửi lên quá lớn.' }, 413);
  }
  const body = (() => {
    try { return JSON.parse(raw) as unknown; } catch { return null; }
  })();
  if (!body || typeof body !== 'object' || Array.isArray(body)) return badRequest('JSON không hợp lệ.');

  const payload = body as Record<string, unknown>;
  if (Object.keys(payload).some((key) => !['anonymous_id', 'event_name', 'page_path', 'props'].includes(key))) {
    return badRequest('Dữ liệu gửi lên không hợp lệ.');
  }
  const anonymousId = sanitizeAnonymousId(payload.anonymous_id);
  const pagePath = sanitizePagePath(payload.page_path);
  const props = sanitizeEventProps(payload.props);
  if (!anonymousId || !pagePath || props === null || typeof payload.event_name !== 'string' || !TRACKABLE_EVENTS.includes(payload.event_name as TrackableEvent)) {
    return badRequest('Sự kiện không hợp lệ.');
  }

  await recordSiteEvent(env.DB, {
    anonymousId,
    pagePath,
    props,
    eventName: payload.event_name as TrackableEvent,
  });
  return json({ ok: true }, 201);
};
