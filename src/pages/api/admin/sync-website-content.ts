// Admin: rebuild the RAG source records for published website content.
// POST /api/admin/sync-website-content

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const MAX_CHUNK_CHARS = 1800;
const CHUNK_OVERLAP_CHARS = 220;
const CONTENT_TYPES = ['book', 'blog', 'resource'] as const;
type ContentType = typeof CONTENT_TYPES[number];

interface SourceChunk {
  id: string;
  contentType: ContentType;
  sourceId: string;
  sourceSlug: string | null;
  title: string;
  headingPath: string | null;
  content: string;
  url: string;
  order: number;
}

function chunkText(text: string): string[] {
  const paragraphs = text.split(/\n\s*\n+/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    if (paragraph.length > MAX_CHUNK_CHARS) {
      if (current) {
        chunks.push(current);
        current = '';
      }
      for (let start = 0; start < paragraph.length; start += MAX_CHUNK_CHARS - CHUNK_OVERLAP_CHARS) {
        chunks.push(paragraph.slice(start, start + MAX_CHUNK_CHARS).trim());
      }
      continue;
    }

    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length <= MAX_CHUNK_CHARS) {
      current = candidate;
      continue;
    }

    if (current) chunks.push(current);
    current = paragraph;
  }

  if (current) chunks.push(current);
  return chunks;
}

function makeChunkId(type: ContentType, sourceId: string, part: string, order: number): string {
  return `website:${type}:${sourceId}:${part}:${order}`;
}

function toContentTypes(value: unknown): ContentType[] {
  if (!Array.isArray(value)) return [...CONTENT_TYPES];
  const types = value.filter((item): item is ContentType => typeof item === 'string' && CONTENT_TYPES.includes(item as ContentType));
  return types.length ? [...new Set(types)] : [...CONTENT_TYPES];
}

async function clearExistingChunks(db: D1Database, types: ContentType[]): Promise<void> {
  const placeholders = types.map(() => '?').join(',');
  const { results } = await db
    .prepare(`SELECT COALESCE("vector_id", "id") AS vector_id FROM "website_content" WHERE "content_type" IN (${placeholders})`)
    .bind(...types)
    .all<{ vector_id: string }>();

  const vectorIds = (results ?? []).map((row) => row.vector_id).filter(Boolean);
  if (env.VECTORIZE && vectorIds.length) {
    for (let start = 0; start < vectorIds.length; start += 500) {
      await env.VECTORIZE.deleteByIds(vectorIds.slice(start, start + 500));
    }
  }

  await db.prepare(`DELETE FROM "website_content" WHERE "content_type" IN (${placeholders})`).bind(...types).run();
}

async function saveChunks(db: D1Database, chunks: SourceChunk[]): Promise<void> {
  for (const chunk of chunks) {
    await db
      .prepare(
        `INSERT INTO "website_content"
          ("id","content_type","source_id","source_slug","title","heading_path","content","url","chunk_order","vector_synced","vector_id","updatedAt")
         VALUES (?,?,?,?,?,?,?,?,?,0,NULL,datetime('now'))`,
      )
      .bind(
        chunk.id,
        chunk.contentType,
        chunk.sourceId,
        chunk.sourceSlug,
        chunk.title,
        chunk.headingPath,
        chunk.content,
        chunk.url,
        chunk.order,
      )
      .run();
  }
}

async function buildBookChunks(db: D1Database): Promise<SourceChunk[]> {
  const { results: chapters } = await db
    .prepare('SELECT "id", "id" AS "slug", "title", "description" FROM "chapter" WHERE "status" = ? ORDER BY "tier", "chapter_no"')
    .bind('published')
    .all<{ id: string; slug: string; title: string; description: string | null }>();

  const chunks: SourceChunk[] = [];
  for (const chapter of chapters ?? []) {
    if (chapter.description?.trim()) {
      chunks.push({
        id: makeChunkId('book', chapter.id, 'overview', 0),
        contentType: 'book',
        sourceId: chapter.id,
        sourceSlug: chapter.slug,
        title: chapter.title,
        headingPath: null,
        content: chapter.description.trim(),
        url: `/book/${chapter.slug}`,
        order: 0,
      });
    }

    const { results: rows } = await db
      .prepare(
        `SELECT s."id" AS section_id, s."slug" AS section_slug, s."title" AS section_title,
                b."type" AS block_type, b."text_md", b."alt", b."caption"
         FROM "section" s
         LEFT JOIN "block" b ON b."section_id" = s."id"
         WHERE s."chapter_id" = ?
         ORDER BY s."order", b."order"`,
      )
      .bind(chapter.id)
      .all<{
        section_id: string;
        section_slug: string;
        section_title: string;
        block_type: string | null;
        text_md: string | null;
        alt: string | null;
        caption: string | null;
      }>();

    const sections = new Map<string, { slug: string; title: string; parts: string[] }>();
    for (const row of rows ?? []) {
      if (!sections.has(row.section_id)) {
        sections.set(row.section_id, { slug: row.section_slug, title: row.section_title, parts: [] });
      }
      const section = sections.get(row.section_id)!;
      const text = row.block_type === 'text'
        ? row.text_md
        : [row.alt, row.caption].filter(Boolean).join('\n');
      if (text?.trim()) section.parts.push(text.trim());
    }

    for (const [sectionId, section] of sections) {
      const sectionChunks = chunkText(section.parts.join('\n\n'));
      for (let index = 0; index < sectionChunks.length; index++) {
        chunks.push({
          id: makeChunkId('book', chapter.id, sectionId, index),
          contentType: 'book',
          sourceId: chapter.id,
          sourceSlug: chapter.slug,
          title: chapter.title,
          headingPath: section.title,
          content: sectionChunks[index],
          url: `/book/${chapter.slug}#${section.slug}`,
          order: index,
        });
      }
    }
  }
  return chunks;
}

async function buildBlogChunks(db: D1Database): Promise<SourceChunk[]> {
  const { results } = await db
    .prepare('SELECT "id", "slug", "title", "content_md" FROM "blog_post" WHERE "status" = ?')
    .bind('published')
    .all<{ id: string; slug: string; title: string; content_md: string }>();

  return (results ?? []).flatMap((post) => chunkText(post.content_md ?? '').map((content, order) => ({
    id: makeChunkId('blog', post.id, 'article', order),
    contentType: 'blog' as const,
    sourceId: post.id,
    sourceSlug: post.slug,
    title: post.title,
    headingPath: null,
    content,
    url: `/blog/${post.slug}`,
    order,
  })));
}

async function buildResourceChunks(db: D1Database): Promise<SourceChunk[]> {
  const { results } = await db
    .prepare('SELECT "id", "title", "description" FROM "resource"')
    .all<{ id: string; title: string; description: string | null }>();

  return (results ?? []).flatMap((resource) => resource.description?.trim() ? [{
    id: makeChunkId('resource', resource.id, 'overview', 0),
    contentType: 'resource' as const,
    sourceId: resource.id,
    sourceSlug: resource.id,
    title: resource.title,
    headingPath: null,
    content: resource.description.trim(),
    url: `/resources#${resource.id}`,
    order: 0,
  }] : []);
}

export const POST: APIRoute = async (ctx) => {
  if (!ctx.locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let body: { content_types?: unknown } = {};
  try {
    body = await ctx.request.json() as typeof body;
  } catch {
    // An empty request means rebuild every website content type.
  }

  const types = toContentTypes(body.content_types);
  try {
    await clearExistingChunks(env.DB, types);
    const chunks: SourceChunk[] = [];
    if (types.includes('book')) chunks.push(...await buildBookChunks(env.DB));
    if (types.includes('blog')) chunks.push(...await buildBlogChunks(env.DB));
    if (types.includes('resource')) chunks.push(...await buildResourceChunks(env.DB));
    await saveChunks(env.DB, chunks);

    const counts = Object.fromEntries(types.map((type) => [type, chunks.filter((chunk) => chunk.contentType === type).length]));
    return new Response(JSON.stringify({ ok: true, chunks: chunks.length, counts }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('[sync-website-content] Rebuild failed:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Không thể xây dựng kho tri thức.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
