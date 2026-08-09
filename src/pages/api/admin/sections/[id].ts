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

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || Array.isArray(body)) return badRequest('Invalid JSON body');

  // The access toggle is intentionally a small, independent update. It must
  // not depend on the editor having a fully loaded copy of the section tree.
  if (Object.hasOwn(body, 'is_free')) {
    const isFree = body.is_free;
    if (isFree !== 0 && isFree !== 1) {
      return badRequest('is_free must be 0 or 1');
    }

    try {
      const section = await env.DB
        .prepare('SELECT "id" FROM "section" WHERE "id" = ?')
        .bind(id)
        .first();
      if (!section) return notFound('Section not found');

      await env.DB
        .prepare('UPDATE "section" SET "is_free" = ? WHERE "id" = ?')
        .bind(isFree, id)
        .run();
      return json({ ok: true, is_free: isFree });
    } catch (err: any) {
      return json({ error: err?.message ?? 'Failed to update section access' }, 500);
    }
  }

  const { chapter_id, parent_id, level, title, slug, order, sibling_ids, keywords, is_free } = body as {
    chapter_id?: string;
    parent_id?: string | null;
    level?: number;
    title?: string;
    slug?: string;
    order?: number;
    sibling_ids?: string[];
    keywords?: string;
    is_free?: number;
  };

  if (!chapter_id) return badRequest('chapter_id is required');

  await upsertSection(env.DB, {
    id,
    chapter_id,
    parent_id: parent_id ?? null,
    level: level ?? 2,
    title: title ?? '',
    slug: slug || slugify(title ?? ''),
    order: order ?? 0,
    keywords: keywords ?? '[]',
    is_free: is_free ?? 0,
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
