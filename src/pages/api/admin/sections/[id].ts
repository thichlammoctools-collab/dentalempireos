import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, slugify } from '../../../../lib/api-helpers';
import { upsertSection, deleteSection } from '../../../../lib/book-db';

export const prerender = false;

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
};

// DELETE /api/admin/sections/[id]
export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');
  await deleteSection(env.DB, id);
  return json({ ok: true });
};
