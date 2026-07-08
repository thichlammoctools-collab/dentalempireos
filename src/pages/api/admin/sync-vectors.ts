// API: Sync content chunks to Vectorize index.
// POST /api/admin/sync-vectors
// Body: { chunk_ids?: string[] } — optional filter
// Auth: Admin only

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { createAuth } from '../../../lib/auth';
import { getEmbedding } from '../../../lib/embedding';

export const prerender = false;

interface ContentChunk {
  id: string;
  text: string;
}

export const POST: APIRoute = async (ctx) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const user = await env.DB
    .prepare('SELECT role FROM "user" WHERE id = ?')
    .bind(session.user.id)
    .first<{ role: string }>();
  if (user?.role !== 'admin') {
    return json({ error: 'Admin only' }, 403);
  }

  let body: { chunk_ids?: string[] };
  try {
    body = (await ctx.request.json()) as typeof body;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  // Fetch chunks to sync
  let chunks: ContentChunk[];
  if (body.chunk_ids?.length) {
    const placeholders = body.chunk_ids.map(() => '?').join(',');
    const { results } = await env.DB
      .prepare(`SELECT id, text FROM "content_chunk" WHERE id IN (${placeholders})`)
      .bind(...body.chunk_ids)
      .all<ContentChunk>();
    chunks = results ?? [];
  } else {
    const { results } = await env.DB
      .prepare('SELECT id, text FROM "content_chunk" WHERE vector_synced = 0 LIMIT 200')
      .all<ContentChunk>();
    chunks = results ?? [];
  }

  const errors: string[] = [];
  let synced = 0;

  for (const chunk of chunks) {
    try {
      const embedding = await getEmbedding(env.DB, chunk.text);
      const vecId = `chunk_${chunk.id}`;

      await env.VECTORIZE.insertOrUpdate([
        { id: vecId, values: embedding, metadata: { chunk_id: chunk.id } },
      ]);

      await env.DB
        .prepare('UPDATE "content_chunk" SET vector_id = ?, vector_synced = 1 WHERE id = ?')
        .bind(vecId, chunk.id)
        .run();

      synced++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Chunk ${chunk.id}: ${msg}`);
      console.error(`[sync-vectors] Failed to sync ${chunk.id}:`, err);
    }
  }

  return json({ synced, total: chunks.length, errors: errors.slice(0, 20) });
};
