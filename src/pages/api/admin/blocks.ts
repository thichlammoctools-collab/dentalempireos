import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { upsertBlock } from '../../../lib/book-db';

export const prerender = false;

// POST /api/admin/blocks — create or update a block
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { id, section_id, order, type, text_md, r2_key, filename, mime, alt, caption } = body as {
    id?: string;
    section_id?: string;
    order?: number;
    type?: string;
    text_md?: string;
    r2_key?: string;
    filename?: string;
    mime?: string;
    alt?: string;
    caption?: string;
  };

  if (!section_id || !type) {
    return badRequest('section_id and type are required');
  }

  if (!['text', 'image', 'file'].includes(type)) {
    return badRequest('type must be text, image, or file');
  }

  const blockId = id || crypto.randomUUID();
  await upsertBlock(env.DB, {
    id: blockId,
    section_id,
    order: order ?? 0,
    type: type as 'text' | 'image' | 'file',
    text_md: text_md ?? null,
    r2_key: r2_key ?? null,
    filename: filename ?? null,
    mime: mime ?? null,
    alt: alt ?? null,
    caption: caption ?? null,
  });

  return json({ id: blockId }, 201);
};
