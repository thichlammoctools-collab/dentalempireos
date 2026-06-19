import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';

export const prerender = false;

// PUT /api/admin/blocks/reorder
// Body: { ids: string[] }  — ids in desired order
export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { ids } = body as { ids?: string[] };

  if (!Array.isArray(ids) || ids.length === 0) {
    return badRequest('ids[] is required');
  }

  try {
    await env.DB.batch(
      ids.map((id, index) =>
        env.DB
          .prepare(`UPDATE "block" SET "order" = ? WHERE "id" = ?`)
          .bind(index, id),
      ),
    );
    return json({ ok: true });
  } catch (err) {
    console.error('reorder blocks error:', err);
    return badRequest('Failed to reorder blocks');
  }
};
