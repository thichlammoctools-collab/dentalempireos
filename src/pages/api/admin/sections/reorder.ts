import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';

export const prerender = false;

// PUT /api/admin/sections/reorder
// Body: { ids: string[] }  — ids in desired order (for siblings under same parent)
export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { ids } = body as { ids?: string[] };

  if (!Array.isArray(ids) || ids.length === 0) {
    return badRequest('ids[] is required');
  }

  const ts = new Date().toISOString();
  try {
    await env.DB.batch(
      ids.map((id, index) =>
        env.DB
          .prepare(`UPDATE "section" SET "order" = ? WHERE "id" = ?`)
          .bind(index, id),
      ),
    );
    return json({ ok: true });
  } catch (err) {
    console.error('reorder sections error:', err);
    return badRequest('Failed to reorder sections');
  }
};
