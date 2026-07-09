// Admin: sync unsynced website_content rows to Vectorize.
// POST /api/admin/sync-website-content-vectors
// Auth: admin only

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createAuth } from '../../../lib/auth';
import { getEmbedding } from '../../../lib/embedding';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const adminEmail = (ctx.locals as any)?.user?.email ?? '';
  if (!adminEmail.includes('dentalempire')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }

  if (!env.VECTORIZE) {
    return new Response(JSON.stringify({ error: 'Vectorize not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  const db = env.DB;
  const { results } = await db
    .prepare('SELECT id, title, heading_path, content, url, content_type FROM "website_content" WHERE vector_synced = 0 LIMIT 200')
    .all<{ id: string; title: string; heading_path: string | null; content: string; url: string; content_type: string }>();

  if (!results?.length) {
    return new Response(JSON.stringify({ ok: true, synced: 0, message: 'No unsynced content' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const toUpsert: { id: string; values: number[]; metadata: Record<string, string> }[] = [];
  const errors: string[] = [];

  for (const row of results) {
    try {
      const text = row.heading_path ? `${row.title} > ${row.heading_path}\n${row.content}` : `${row.title}\n${row.content}`;
      const embedding = await getEmbedding(db, text);
      toUpsert.push({
        id: row.id,
        values: embedding,
        metadata: {
          chunk_id: row.id,
          content_type: row.content_type,
          url: row.url,
          title: row.title.slice(0, 200),
        },
      });
    } catch (e) {
      errors.push(`Embedding error for ${row.id}: ${e}`);
    }
  }

  if (toUpsert.length > 0) {
    await env.VECTORIZE.upsert(toUpsert);
  }

  const ids = toUpsert.map(r => r.id);
  if (ids.length > 0) {
    const placeholders = ids.map(() => '?').join(',');
    await db.prepare(`UPDATE "website_content" SET vector_synced = 1, vector_id = id WHERE id IN (${placeholders})`).bind(...ids).run();
  }

  return new Response(JSON.stringify({
    ok: true,
    synced: ids.length,
    errors: errors.length > 0 ? errors : undefined,
  }), { headers: { 'Content-Type': 'application/json' } });
};
