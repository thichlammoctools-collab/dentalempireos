import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, slugify } from '../../../lib/api-helpers';
import { listChapters, upsertChapter } from '../../../lib/book-db';

export const prerender = false;

// GET /api/admin/chapters — list all chapters
export const GET: APIRoute = async () => {
  const chapters = await listChapters(env.DB);
  return json(chapters);
};

// POST /api/admin/chapters — create a new chapter
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { tier, chapter_no, title, description, order, status } = body as {
    tier?: number;
    chapter_no?: number;
    title?: string;
    description?: string;
    order?: number;
    status?: string;
  };

  if (!tier || !chapter_no || !title) {
    return badRequest('tier, chapter_no, title are required');
  }

  const id = slugify(title);
  await upsertChapter(env.DB, {
    id,
    tier,
    chapter_no,
    title,
    description,
    order: order ?? chapter_no,
    status: (status as 'draft' | 'published') ?? 'draft',
  });

  return json({ id }, 201);
};
