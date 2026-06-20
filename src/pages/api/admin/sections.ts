import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, slugify } from '../../../lib/api-helpers';
import { upsertSection } from '../../../lib/book-db';

export const prerender = false;

// POST /api/admin/sections — create or update a section
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { id, chapter_id, parent_id, level, title, slug, order, keywords } = body as {
    id?: string;
    chapter_id?: string;
    parent_id?: string | null;
    level?: number;
    title?: string;
    slug?: string;
    order?: number;
    keywords?: string;
  };

  if (!chapter_id || !title) {
    return badRequest('chapter_id and title are required');
  }

  const sectionId = id || crypto.randomUUID();
  await upsertSection(env.DB, {
    id: sectionId,
    chapter_id,
    parent_id: parent_id ?? null,
    level: level ?? 2,
    title,
    slug: slug || slugify(title),
    order: order ?? 0,
    keywords: keywords ?? '[]',
  });

  return json({ id: sectionId }, 201);
};
