// RAG search — LIKE-based keyword matching on book content.
// Returns relevant content chunks for AI prompt injection.
// Fallback: can be upgraded to Vectorize later.

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

export async function searchChunks(
  db: D1Database,
  query: string,
  limit = 4,
  opts: { chapterId?: string } = {},
): Promise<RagChunk[]> {
  const keywords = extractKeywords(query);
  if (keywords.length === 0) return [];

  const params: unknown[] = [];
  const conditions: string[] = ['1=1'];
  if (opts.chapterId) {
    conditions.push('"chapter_id" = ?');
    params.push(opts.chapterId);
  }

  // Fetch recent chunks (D1 doesn't have FTS5, so just get recent ones)
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

  const scored = results
    .map(row => ({ ...row, score: scoreChunk(row.text, keywords, query.toLowerCase()) }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
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
