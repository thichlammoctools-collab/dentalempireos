// RAG search — hybrid keyword + vector search on book content.
// Falls back to keyword-only if Vectorize is unavailable.

export interface RagChunk {
  id: string;
  chapter_id: string;
  section_id: string | null;
  heading_path: string | null;
  text: string;
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

function scoreChunk(text: string, keywords: string[], query: string): number {
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
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 10) score *= 0.5;
  if (wordCount > 600) score *= 0.7;
  return score;
}

async function keywordSearch(
  db: D1Database,
  query: string,
  limit: number,
  opts: { chapterId?: string },
): Promise<RagChunk[]> {
  const keywords = extractKeywords(query);
  if (keywords.length === 0) return [];

  const params: unknown[] = [];
  const conditions: string[] = ['1=1'];
  if (opts.chapterId) {
    conditions.push('"chapter_id" = ?');
    params.push(opts.chapterId);
  }

  const { results } = await db
    .prepare(
      `SELECT "id", "chapter_id", "section_id", "heading_path", "text"
       FROM "content_chunk"
       WHERE ${conditions.join(' AND ')}
       ORDER BY "updatedAt" DESC
       LIMIT 200`,
    )
    .bind(...params)
    .all<{ id: string; chapter_id: string; section_id: string | null; heading_path: string | null; text: string }>();

  if (!results?.length) return [];

  return results
    .map(row => ({ ...row, score: scoreChunk(row.text, keywords, query.toLowerCase()) }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function vectorSearch(
  db: D1Database,
  env: Env,
  query: string,
  limit: number,
  opts: { chapterId?: string },
): Promise<RagChunk[]> {
  try {
    // Dynamic import to avoid hard dependency if Vectorize not bound
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
    const conditions = opts.chapterId
      ? ` AND "chapter_id" = '${opts.chapterId.replace(/'/g, "''")}'`
      : '';

    const { results } = await db
      .prepare(`SELECT "id", "chapter_id", "section_id", "heading_path", "text" FROM "content_chunk" WHERE "id" IN (${placeholders})${conditions}`)
      .bind(...ids)
      .all<{ id: string; chapter_id: string; section_id: string | null; heading_path: string | null; text: string }>();

    return (results ?? []).map(row => ({ ...row, score: 0 }));
  } catch (err) {
    console.warn('[rag-search] Vector search failed, falling back to keyword:', err);
    return [];
  }
}

function hybridMerge(vector: RagChunk[], keyword: RagChunk[], limit: number): RagChunk[] {
  const seen = new Set<string>();
  const result: RagChunk[] = [];

  // Priority 1: vector results
  for (const c of vector) {
    if (!seen.has(c.id)) { result.push(c); seen.add(c.id); }
  }
  // Priority 2: keyword results that aren't already included
  for (const c of keyword) {
    if (!seen.has(c.id) && result.length < limit) { result.push(c); seen.add(c.id); }
  }

  return result.slice(0, limit);
}

/**
 * Hybrid search: vector + keyword, falls back to keyword if Vectorize unavailable.
 */
export async function searchChunks(
  db: D1Database,
  query: string,
  limit = 4,
  opts: { chapterId?: string } = {},
  env?: Env,
): Promise<RagChunk[]> {
  if (env?.VECTORIZE) {
    const [vectorResults, keywordResults] = await Promise.all([
      vectorSearch(db, env, query, limit, opts),
      keywordSearch(db, query, limit * 2, opts),
    ]);
    return hybridMerge(vectorResults, keywordResults, limit);
  }
  return keywordSearch(db, query, limit, opts);
}

export function buildRagContext(chunks: RagChunk[]): string {
  if (!chunks.length) return '';
  return chunks
    .map(c => {
      const heading = c.heading_path ?? '';
      return `[${heading}]\n${stripMarkdown(c.text)}`.trim();
    })
    .join('\n\n---\n\n');
}
