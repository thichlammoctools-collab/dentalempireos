import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound, slugify } from '../../../../lib/api-helpers';
import { upsertSection, deleteSection } from '../../../../lib/book-db';

export const prerender = false;

// GET /api/admin/sections/[id] — fetch single section
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  try {
    const row = await env.DB
      .prepare('SELECT * FROM "section" WHERE "id" = ?')
      .bind(id)
      .first();
    if (!row) return notFound('Section not found');
    return json(row);
  } catch (err: any) {
    return json({ error: err?.message ?? 'DB error' }, 500);
  }
};

// PUT /api/admin/sections/[id] — update section
export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { chapter_id, parent_id, level, title, slug, order, sibling_ids, keywords } = body as {
    chapter_id?: string;
    parent_id?: string | null;
    level?: number;
    title?: string;
    slug?: string;
    order?: number;
    sibling_ids?: string[];
    keywords?: string;
  };

  if (!chapter_id) return badRequest('chapter_id is required');

  try {
    await upsertSection(env.DB, {
      id,
      chapter_id,
      parent_id: parent_id ?? null,
      level: level ?? 2,
      title: title ?? '',
      slug: slug || slugify(title ?? ''),
      order: order ?? 0,
      keywords: keywords ?? '[]',
    });

    // Optional: batch-reorder siblings in the same call (for atomic reparent + reorder)
    if (sibling_ids && sibling_ids.length > 0) {
      await env.DB.batch(
        sibling_ids.map((sid, index) =>
          env.DB.prepare(`UPDATE "section" SET "order" = ? WHERE "id" = ?`).bind(index, sid)
        )
      );
    }

    return json({ ok: true });
  } catch (err: any) {
    return json({ error: err?.message ?? 'Failed to update section' }, 500);
  }
};

// DELETE /api/admin/sections/[id]
export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  try {
    await deleteSection(env.DB, id);
    return json({ ok: true });
  } catch (err: any) {
    return json({ error: err?.message ?? 'Failed to delete section' }, 500);
  }
};
