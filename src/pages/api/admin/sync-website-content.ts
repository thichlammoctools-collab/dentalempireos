// Admin: sync book + blog + resource content into website_content table.
// POST /api/admin/sync-website-content
// Auth: admin only

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createAuth } from '../../../lib/auth';

export const prerender = false;

const MAX_CHUNK_CHARS = 2000;

function chunkText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let current = '';

  for (const para of paragraphs) {
    if ((current + '\n\n' + para).length <= maxChars) {
      current += (current ? '\n\n' : '') + para;
    } else {
      if (current) chunks.push(current.trim());
      current = para;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

async function upsertChunk(
  db: D1Database,
  sourceType: string,
  sourceId: string,
  sourceSlug: string | null,
  title: string,
  headingPath: string | null,
  chunkContent: string,
  url: string,
  chunkOrder: number,
): Promise<string> {
  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT OR REPLACE INTO "website_content"
        ("id","content_type","source_id","source_slug","title","heading_path","content","url","chunk_order","vector_synced","updatedAt")
       VALUES (?,?,?,?,?,?,?,?,?,0,datetime('now'))`,
    )
    .bind(id, sourceType, sourceId, sourceSlug, title, headingPath, chunkContent, url, chunkOrder)
    .run();
  return id;
}

export const POST: APIRoute = async (ctx) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  const adminEmail = (ctx.locals as any)?.user?.email ?? '';
  if (!adminEmail.includes('dentalempire')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403, headers: { 'Content-Type': 'application/json' },
    });
  }

  const db = env.DB;
  const results: { type: string; count: number; errors: string[] }[] = [];

  // ── 1. Sync book chapters ───────────────────────────────────────────────────
  try {
    const { results: chapters } = await db
      .prepare('SELECT id, slug, title, tier, chapter_no FROM "chapter" WHERE published = 1 ORDER BY tier, chapter_no')
      .all<{ id: string; slug: string; title: string; tier: number; chapter_no: number }>();

    let count = 0;
    for (const ch of chapters ?? []) {
      try {
        const { results: sections } = await db
          .prepare('SELECT slug, title, level, content_md FROM "section" WHERE chapter_id = ? ORDER BY "order"')
          .bind(ch.id)
          .all<{ slug: string; title: string; level: number; content_md: string }>();

        for (const sec of sections ?? []) {
          const headingPath = sec.level > 1 ? `${ch.title} > ${sec.title}` : null;
          const url = `/book/${ch.slug}#${sec.slug}`;
          const chunks = chunkText(sec.content_md ?? '', MAX_CHUNK_CHARS);

          for (let i = 0; i < chunks.length; i++) {
            await upsertChunk(db, 'book', ch.id, ch.slug, ch.title, headingPath, chunks[i], url, i);
            count++;
          }
        }
      } catch (e) {
        console.warn(`[sync-website] chapter ${ch.id} error:`, e);
      }
    }
    results.push({ type: 'book', count, errors: [] });
  } catch (e) {
    results.push({ type: 'book', count: 0, errors: [String(e)] });
  }

  // ── 2. Sync blog posts ─────────────────────────────────────────────────────
  try {
    const { results: posts } = await db
      .prepare('SELECT id, slug, title, content_md, category FROM "blog_post" WHERE published = 1')
      .all<{ id: string; slug: string; title: string; content_md: string; category: string | null }>();

    let count = 0;
    for (const post of posts ?? []) {
      try {
        const url = `/blog/${post.slug}`;
        const content = post.content_md ?? '';
        const chunks = chunkText(content, MAX_CHUNK_CHARS);

        for (let i = 0; i < chunks.length; i++) {
          await upsertChunk(db, 'blog', post.id, post.slug, post.title, null, chunks[i], url, i);
          count++;
        }
      } catch (e) {
        console.warn(`[sync-website] blog ${post.id} error:`, e);
      }
    }
    results.push({ type: 'blog', count, errors: [] });
  } catch (e) {
    results.push({ type: 'blog', count: 0, errors: [String(e)] });
  }

  // ── 3. Sync resources ──────────────────────────────────────────────────────
  try {
    const { results: resources } = await db
      .prepare('SELECT id, slug, title, description FROM "resource" WHERE published = 1')
      .all<{ id: string; slug: string; title: string; description: string | null }>();

    let count = 0;
    for (const res of resources ?? []) {
      try {
        const url = `/resources#${res.slug}`;
        const content = res.description ?? '';
        if (content.trim()) {
          await upsertChunk(db, 'resource', res.id, res.slug, res.title, null, content, url, 0);
          count++;
        }
      } catch (e) {
        console.warn(`[sync-website] resource ${res.id} error:`, e);
      }
    }
    results.push({ type: 'resource', count, errors: [] });
  } catch (e) {
    results.push({ type: 'resource', count: 0, errors: [String(e)] });
  }

  return new Response(JSON.stringify({ ok: true, results }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
