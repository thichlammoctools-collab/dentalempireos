import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { getBlock, upsertBlock, deleteBlock } from '../../../../lib/book-db';

export const prerender = false;

// GET /api/admin/blocks/[id] — get single block
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');
  const block = await getBlock(env.DB, id);
  if (!block) return json({ error: 'Not found' }, 404);
  return json(block);
};

// PUT /api/admin/blocks/[id] — update block
export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const existing = await getBlock(env.DB, id);
  if (!existing) return json({ error: 'Block not found' }, 404);

  const { section_id, order, type, text_md, r2_key, filename, mime, alt, caption } = body;

  await upsertBlock(env.DB, {
    id,
    section_id: section_id ?? existing.section_id,
    order: order ?? existing.order,
    type: type ?? existing.type,
    text_md: text_md ?? existing.text_md,
    r2_key: r2_key ?? existing.r2_key,
    filename: filename ?? existing.filename,
    mime: mime ?? existing.mime,
    alt: alt ?? existing.alt,
    caption: caption ?? existing.caption,
  });

  return json({ ok: true });
};

// DELETE /api/admin/blocks/[id]
export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');
  await deleteBlock(env.DB, id);
  return json({ ok: true });
};
