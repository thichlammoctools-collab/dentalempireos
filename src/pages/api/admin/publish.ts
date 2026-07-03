import type { APIRoute } from 'astro';
import { json } from '../../../lib/api-helpers';

export const prerender = false;

/**
 * POST /api/admin/publish
 *
 * No-op: The site runs as Workers + D1 (SSR). All data is live immediately
 * from D1 — there is no CDN cache to purge. This endpoint exists as a
 * UI affordance for the "Publish Changes" button.
 */
export const POST: APIRoute = async () => {
  return json({
    ok: true,
    message: 'Nội dung đã được lưu và hiển thị ngay lập tức.',
  });
};
