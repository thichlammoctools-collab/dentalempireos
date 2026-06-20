import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { getChapterTree, upsertChapter, deleteChapter } from '../../../../lib/book-db';

export const prerender = false;

// GET /api/admin/chapters/[id] — get full chapter tree (for editor)
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');
  const tree = await getChapterTree(env.DB, id);
  if (!tree) return notFound('Chapter not found');
  return json(tree);
};

// PUT /api/admin/chapters/[id] — update chapter metadata
export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const existing = await getChapterTree(env.DB, id);
  if (!existing) return notFound('Chapter not found');

  const { tier, chapter_no, title, description, order, status } = body as {
    tier?: number;
    chapter_no?: number;
    title?: string;
    description?: string;
    order?: number;
    status?: string;
  };

  // Resolve final values (fall back to existing)
  const newTier = tier ?? existing.chapter.tier;
  const newChapterNo = chapter_no ?? existing.chapter.chapter_no;
  const newOrder = order ?? existing.chapter.order;

  await upsertChapter(env.DB, {
    id,
    tier: newTier,
    chapter_no: newChapterNo,
    title: title ?? existing.chapter.title,
    description: description ?? existing.chapter.description,
    order: newOrder,
    status: (['draft', 'published'].includes(status!) ? (status as 'draft' | 'published') : existing.chapter.status),
  });

  // If chapter_no changed, re-sort all chapters in the same tier
  // so that order stays consistent with chapter_no
  if (chapter_no !== undefined && chapter_no !== existing.chapter.chapter_no) {
    const allInTier = await env.DB
      .prepare('SELECT "id", "chapter_no" FROM "chapter" WHERE "tier" = ? ORDER BY "chapter_no", "createdAt"')
      .bind(newTier)
      .all<{ id: string; chapter_no: number }>();

    if (allInTier.results.length > 0) {
      const ts = Date.now();
      await env.DB.batch(
        allInTier.results.map((ch, idx) =>
          env.DB
            .prepare('UPDATE "chapter" SET "order" = ?, "updatedAt" = ? WHERE "id" = ?')
            .bind(idx, ts, ch.id),
        ),
      );
    }
  }

  return json({ ok: true });
};

// DELETE /api/admin/chapters/[id]
export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');
  await deleteChapter(env.DB, id);
  return json({ ok: true });
};
