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

    const vecResults = await env.VECTORIZE.query(embedding, { topK: limit * 2 });
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

    return (results ?? []).map(row => ({ ...row, text: row.content, score: 0 }));
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
