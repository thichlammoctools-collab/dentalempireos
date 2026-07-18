// RAG search for website-wide content (book + blog + resource).
// Hybrid: vector (Vectorize) + keyword search, falls back to keyword-only.

export interface WebsiteChunk {
  id: string;
  content_type: 'book' | 'blog' | 'resource';
  source_id: string;
  source_slug: string | null;
  title: string;
  heading_path: string | null;
  text: string;
  url: string;
  score: number;
}

const STOPWORDS = new Set([
  'và','của','cho','là','có','được','trong','với','để','tại','này','từ',
  'một','các','những','cho','đã','không','cũng','nhưng','hoặc','vì','nên',
  'khi','đó','sau','trên','dưới','vào','ra','bởi','đến','về','theo','cho',
]);

function stripMarkdown(text: string): string {
  return text
    .replace(/[#*_`~\[\]()>/|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function scoreChunk(text: string, title: string, headingPath: string | null, keywords: string[], query: string): number {
  const stripped = stripMarkdown(text.toLowerCase());
  let score = 0;
  for (const kw of keywords) {
    let pos = 0;
    while ((pos = stripped.indexOf(kw, pos)) !== -1) {
      score++;
      pos += kw.length;
    }
  }
  if (stripped.includes(query)) score += 5;
  if (title.toLowerCase().includes(query)) score += 8;
  if (headingPath?.toLowerCase().includes(query)) score += 3;

  const wordCount = text.split(/\s+/).length;
  if (wordCount < 10) score *= 0.5;
  if (wordCount > 600) score *= 0.7;
  return score;
}

async function keywordSearch(
  db: D1Database,
  query: string,
  limit: number,
  opts: { contentType?: string; sourceId?: string } = {},
): Promise<WebsiteChunk[]> {
  const keywords = extractKeywords(query);
  if (keywords.length === 0) return [];

  const params: unknown[] = [];
  const conditions: string[] = ['1=1'];
  if (opts.contentType) {
    conditions.push('"content_type" = ?');
    params.push(opts.contentType);
  }
  if (opts.sourceId) {
    conditions.push('"source_id" = ?');
    params.push(opts.sourceId);
  }

  const { results } = await db
    .prepare(
      `SELECT "id","content_type","source_id","source_slug","title","heading_path","content","url"
       FROM "website_content"
       WHERE ${conditions.join(' AND ')}
       ORDER BY "updatedAt" DESC
       LIMIT 300`,
    )
    .bind(...params)
    .all<{
      id: string; content_type: 'book' | 'blog' | 'resource';
      source_id: string; source_slug: string | null; title: string;
      heading_path: string | null; content: string; url: string;
    }>();

  if (!results?.length) return [];

  return results
    .map(row => ({
      ...row,
      text: row.content,
      score: scoreChunk(row.content, row.title, row.heading_path, keywords, query.toLowerCase()),
    }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function vectorSearch(
  db: D1Database,
  env: Env,
  query: string,
  limit: number,
  opts: { contentType?: string; sourceId?: string } = {},
): Promise<WebsiteChunk[]> {
  try {
    const { getEmbedding } = await import('./embedding');
    const embedding = await getEmbedding(db, query);

    const vecResults = await env.VECTORIZE.query(embedding, { topK: limit * 4 });
    if (!vecResults.matches?.length) return [];

    const ids = vecResults.matches.map(m => {
      const meta = m.metadata as Record<string, string> | undefined;
      return meta?.chunk_id ?? m.id;
    });

    if (!ids.length) return [];

    const placeholders = ids.map(() => '?').join(',');
    const conditions = ['"id" IN (' + placeholders + ')'];
    const bindParams: unknown[] = [...ids];

    if (opts.contentType) {
      conditions.push('"content_type" = ?');
      bindParams.push(opts.contentType);
    }
    if (opts.sourceId) {
      conditions.push('"source_id" = ?');
      bindParams.push(opts.sourceId);
    }

    const { results } = await db
      .prepare(
        `SELECT "id","content_type","source_id","source_slug","title","heading_path","content","url"
         FROM "website_content" WHERE ${conditions.join(' AND ')}`,
      )
      .bind(...bindParams)
      .all<{
        id: string; content_type: 'book' | 'blog' | 'resource';
        source_id: string; source_slug: string | null; title: string;
        heading_path: string | null; content: string; url: string;
      }>();

    const matchesById = new Map(ids.map((id, index) => [id, index]));
    return (results ?? [])
      .map(row => ({ ...row, text: row.content, score: -(matchesById.get(row.id) ?? ids.length) }))
      .sort((a, b) => b.score - a.score);
  } catch (err) {
    console.warn('[rag-website] Vector search failed, falling back to keyword:', err);
    return [];
  }
}

function hybridMerge(vector: WebsiteChunk[], keyword: WebsiteChunk[], limit: number): WebsiteChunk[] {
  const seen = new Set<string>();
  const result: WebsiteChunk[] = [];

  for (const c of vector) {
    if (!seen.has(c.id)) { result.push(c); seen.add(c.id); }
  }
  for (const c of keyword) {
    if (!seen.has(c.id) && result.length < limit) { result.push(c); seen.add(c.id); }
  }

  return result.slice(0, limit);
}

export async function searchWebsite(
  db: D1Database,
  query: string,
  limit = 4,
  opts: { contentType?: string; sourceId?: string } = {},
  env?: Env,
): Promise<WebsiteChunk[]> {
  if (env?.VECTORIZE) {
    const [vectorResults, keywordResults] = await Promise.all([
      vectorSearch(db, env, query, limit, opts),
      keywordSearch(db, query, limit * 2, opts),
    ]);
    return hybridMerge(vectorResults, keywordResults, limit);
  }
  return keywordSearch(db, query, limit, opts);
}

/**
 * Preserve the surrounding idea when vector search finds a chunk in a long
 * book section. Chunks are ordered within a section during indexing.
 */
export async function expandWebsiteContext(
  db: D1Database,
  chunks: WebsiteChunk[],
  maxChunks = 10,
): Promise<WebsiteChunk[]> {
  if (chunks.length >= maxChunks) return chunks;

  const result = [...chunks];
  const seen = new Set(chunks.map((chunk) => chunk.id));
  const bookSeeds = chunks.filter((chunk) => chunk.content_type === 'book' && chunk.heading_path);

  for (const seed of bookSeeds) {
    if (result.length >= maxChunks) break;
    const { results } = await db
      .prepare(
        `SELECT "id","content_type","source_id","source_slug","title","heading_path","content","url"
         FROM "website_content"
         WHERE "content_type" = 'book' AND "source_id" = ? AND "heading_path" = ?
           AND "chunk_order" BETWEEN (
             SELECT "chunk_order" - 1 FROM "website_content" WHERE "id" = ?
           ) AND (
             SELECT "chunk_order" + 1 FROM "website_content" WHERE "id" = ?
           )
         ORDER BY "chunk_order"`,
      )
      .bind(seed.source_id, seed.heading_path, seed.id, seed.id)
      .all<{
        id: string; content_type: 'book'; source_id: string; source_slug: string | null;
        title: string; heading_path: string | null; content: string; url: string;
      }>();

    for (const row of results ?? []) {
      if (seen.has(row.id) || result.length >= maxChunks) continue;
      result.push({ ...row, text: row.content, score: seed.score - 0.01 });
      seen.add(row.id);
    }
  }
  return result;
}

export interface FormattedChunk {
  id: string;
  content_type: 'book' | 'blog' | 'resource';
  source_slug: string | null;
  title: string;
  heading_path: string | null;
  text: string;
  url: string;
}

export function buildWebsiteContext(chunks: WebsiteChunk[]): string {
  if (!chunks.length) return '';
  return chunks
    .map(c => {
      const heading = c.heading_path ?? '';
      const typeLabel = c.content_type === 'book' ? 'Sách' : c.content_type === 'blog' ? 'Blog' : 'Tài nguyên';
      return `[${typeLabel}] ${c.title}${heading ? ' > ' + heading : ''}\n${stripMarkdown(c.text)}`.trim();
    })
    .join('\n\n---\n\n');
}

export function chunksToFormatted(chunks: WebsiteChunk[]): FormattedChunk[] {
  return chunks.map(c => ({
    id: c.id,
    content_type: c.content_type,
    source_slug: c.source_slug,
    title: c.title,
    heading_path: c.heading_path,
    text: c.text,
    url: c.url,
  }));
}
