import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';

export const prerender = false;

// PUT /api/admin/chapters/reorder
// Body: { tier: number, ids: string[] }
// Sets the order field of each chapter to its index in the array,
// and recalculates chapter_no (1-based) to match the new order.
export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { tier, ids } = body as { tier?: number; ids?: string[] };

  if (!tier || !Array.isArray(ids) || ids.length === 0) {
    return badRequest('tier and ids[] are required');
  }

  const ts = new Date().toISOString();
  try {
    await env.DB.batch(
      ids.map((id, index) =>
        env.DB
          .prepare(`UPDATE "chapter" SET "order" = ?, "chapter_no" = ?, "updatedAt" = ? WHERE "id" = ? AND "tier" = ?`)
          .bind(index, index + 1, ts, id, tier),
      ),
    );
    return json({ ok: true });
  } catch (err) {
    console.error('reorder chapters error:', err);
    return badRequest('Failed to reorder chapters');
  }
};
