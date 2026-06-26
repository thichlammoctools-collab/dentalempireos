import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { upsertBlock } from '../../../../lib/book-db';
import type { BlockType } from '../../../../lib/book-db';

export const prerender = false;

// POST /api/admin/blocks — create a new block in a section
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { section_id, type, order } = body as {
    section_id?: string;
    type?: BlockType;
    order?: number;
  };

  if (!section_id || !type) {
    return badRequest('Missing section_id or type');
  }
  if (type !== 'text' && type !== 'image' && type !== 'file') {
    return badRequest('Invalid block type');
  }

  const id = crypto.randomUUID();
  await upsertBlock(env.DB, {
    id,
    section_id,
    type,
    order: order ?? Date.now(),
  });

  return json({ id }, 201);
};
