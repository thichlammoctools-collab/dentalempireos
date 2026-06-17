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

  await upsertChapter(env.DB, {
    id,
    tier: tier ?? existing.chapter.tier,
    chapter_no: chapter_no ?? existing.chapter.chapter_no,
    title: title ?? existing.chapter.title,
    description: description ?? existing.chapter.description,
    order: order ?? existing.chapter.order,
    status: (['draft', 'published'].includes(status!) ? (status as 'draft' | 'published') : existing.chapter.status),
  });

  return json({ ok: true });
};

// DELETE /api/admin/chapters/[id]
export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');
  await deleteChapter(env.DB, id);
  return json({ ok: true });
};
