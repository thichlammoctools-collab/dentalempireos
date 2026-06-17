import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../lib/api-helpers';

export const prerender = false;

/**
 * POST /api/admin/publish
 *
 * Clear the entire Cloudflare zone cache so that any recent content
 * changes (saved in D1) are immediately visible to end users.
 *
 * Note: Since the site runs as Workers + Assets (SSR), content stored
 * in D1 is already live on request. This endpoint exists to force-clear
 * any cached responses at Cloudflare's edge.
 *
 * Required env vars (set via `wrangler secret put` or CF dashboard):
 *   CF_API_TOKEN  – API token with "Zone > Cache Purge" permission
 *   CF_ZONE_ID    – Zone ID of dentalempireos.com
 */
export const POST: APIRoute = async () => {
  const e = env as any;
  const CF_API_TOKEN = e.CF_API_TOKEN;
  const CF_ZONE_ID = e.CF_ZONE_ID;

  if (!CF_API_TOKEN || !CF_ZONE_ID) {
    return badRequest(
      'Missing env vars: CF_API_TOKEN and CF_ZONE_ID must be configured.',
    );
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purge_everything: true }),
      },
    );

    const data = (await res.json()) as any;

    if (data.success) {
      return json({
        ok: true,
        message: 'Đã xóa toàn bộ cache. Người dùng sẽ thấy nội dung mới nhất.',
      });
    }

    const msg =
      data.errors?.map((e: any) => e.message).join(', ') ?? 'Unknown error';
    return json({ ok: false, error: `Cloudflare API: ${msg}` }, 502);
  } catch (err: any) {
    return json(
      { ok: false, error: `Không thể kết nối Cloudflare: ${err.message}` },
      500,
    );
  }
};
