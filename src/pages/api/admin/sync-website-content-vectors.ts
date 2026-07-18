// Admin: embed one batch of website_content records into Vectorize.
// POST /api/admin/sync-website-content-vectors

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getEmbedding } from '../../../lib/embedding';

export const prerender = false;
const DEFAULT_BATCH_SIZE = 25;
const MAX_BATCH_SIZE = 50;

export const POST: APIRoute = async (ctx) => {
  const user = ctx.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  if (!env.VECTORIZE) {
    return new Response(JSON.stringify({ error: 'Vectorize not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  let body: { limit?: unknown } = {};
  try {
    body = await ctx.request.json() as typeof body;
  } catch {
    // The default batch size is safe for providers with modest rate limits.
  }
  const requestedLimit = typeof body.limit === 'number' ? body.limit : DEFAULT_BATCH_SIZE;
  const limit = Math.min(MAX_BATCH_SIZE, Math.max(1, Math.floor(requestedLimit)));

  const { results } = await env.DB
    .prepare('SELECT "id", "title", "heading_path", "content", "url", "content_type" FROM "website_content" WHERE "vector_synced" = 0 ORDER BY "updatedAt" ASC LIMIT ?')
    .bind(limit)
    .all<{ id: string; title: string; heading_path: string | null; content: string; url: string; content_type: string }>();

  const vectors: { id: string; values: number[]; metadata: Record<string, string> }[] = [];
  const errors: string[] = [];
  for (const row of results ?? []) {
    try {
      const document = [row.title, row.heading_path, row.content].filter(Boolean).join('\n');
      vectors.push({
        id: row.id,
        values: await getEmbedding(env.DB, document),
        metadata: { chunk_id: row.id, content_type: row.content_type, url: row.url, title: row.title.slice(0, 200) },
      });
    } catch (error) {
      errors.push(`Không thể tạo embedding cho ${row.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (vectors.length) {
    await env.VECTORIZE.upsert(vectors);
    const ids = vectors.map((vector) => vector.id);
    const placeholders = ids.map(() => '?').join(',');
    await env.DB
      .prepare(`UPDATE "website_content" SET "vector_synced" = 1, "vector_id" = "id" WHERE "id" IN (${placeholders})`)
      .bind(...ids)
      .run();
  }

  const remaining = await env.DB.prepare('SELECT COUNT(*) AS count FROM "website_content" WHERE "vector_synced" = 0').first<{ count: number }>();
  return new Response(JSON.stringify({
    ok: true,
    embedded: vectors.length,
    attempted: results?.length ?? 0,
    remaining: remaining?.count ?? 0,
    errors: errors.slice(0, 10),
  }), { headers: { 'Content-Type': 'application/json' } });
};
