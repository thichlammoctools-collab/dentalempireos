import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { reorderCategories } from '../../../../../lib/blog-db';
import { json, badRequest } from '../../../../../lib/api-helpers';

export const prerender = false;

// PUT /api/admin/blog/categories/reorder
// Body: { parent_id: string | null, ids: string[] }
// Reorder sibling categories under the same parent by rewriting sort_order to match index order.
export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { parent_id, ids } = body as { parent_id?: string | null; ids?: string[] };

  if (parent_id === undefined) {
    return badRequest('parent_id is required (use null for root categories)');
  }
  if (!Array.isArray(ids) || ids.length === 0) {
    return badRequest('ids[] is required and must not be empty');
  }

  try {
    await reorderCategories(env.DB, parent_id || null, ids);
    return json({ ok: true });
  } catch (err) {
    console.error('reorder categories error:', err);
    return badRequest('Failed to reorder categories');
  }
};
