// Data access layer for reader reviews stored in D1.

export interface ReviewRow {
  id: string;
  user_id: string | null;
  chapter_id: string;
  rating: number;
  title: string | null;
  content: string;
  author_name: string | null;
  status: 'published' | 'hidden' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface ReviewDisplay extends ReviewRow {
  user_name: string | null;
  user_image: string | null;
  chapter_title: string | null;
}

export interface ReviewStats {
  avgRating: number;
  totalReviews: number;
}

export interface ReviewInput {
  chapter_id: string;
  rating: number;
  title?: string | null;
  content: string;
  author_name?: string | null;
  user_id?: string | null;
}

function now(): string {
  return new Date().toISOString();
}

function genId(): string {
  return crypto.randomUUID();
}

const REVIEW_SELECT = `
  r."id", r."user_id", r."chapter_id", r."rating", r."title",
  r."content", r."author_name", r."status", r."createdAt", r."updatedAt",
  u."name" as "user_name", u."image" as "user_image",
  c."title" as "chapter_title"
`;

const REVIEW_JOINS = `
  FROM "review" r
  LEFT JOIN "user" u ON u."id" = r."user_id"
  LEFT JOIN "chapter" c ON c."id" = r."chapter_id"
`;

// ── List ──────────────────────────────────────────────────

export async function listReviewsByChapter(
  db: D1Database,
  chapterId: string,
  limit = 20,
  offset = 0,
): Promise<ReviewDisplay[]> {
  const { results } = await db
    .prepare(
      `SELECT ${REVIEW_SELECT} ${REVIEW_JOINS}
       WHERE r."chapter_id" = ? AND r."status" = 'published'
       ORDER BY r."createdAt" DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(chapterId, limit, offset)
    .all<ReviewDisplay>();
  return results;
}

export async function listLatestReviews(
  db: D1Database,
  limit = 20,
  offset = 0,
): Promise<ReviewDisplay[]> {
  const { results } = await db
    .prepare(
      `SELECT ${REVIEW_SELECT} ${REVIEW_JOINS}
       WHERE r."status" = 'published'
       ORDER BY r."createdAt" DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(limit, offset)
    .all<ReviewDisplay>();
  return results;
}

// ── Stats ─────────────────────────────────────────────────

export async function getReviewStats(
  db: D1Database,
  chapterId: string,
): Promise<ReviewStats> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) as "total", COALESCE(AVG("rating"), 0) as "avg"
       FROM "review"
       WHERE "chapter_id" = ? AND "status" = 'published'`,
    )
    .bind(chapterId)
    .first<{ total: number; avg: number }>();

  return {
    avgRating: Math.round((row?.avg ?? 0) * 10) / 10,
    totalReviews: row?.total ?? 0,
  };
}

// ── Create ────────────────────────────────────────────────

export async function createReview(
  db: D1Database,
  input: ReviewInput,
): Promise<ReviewDisplay> {
  const ts = now();
  const id = genId();

  await db
    .prepare(
      `INSERT INTO "review"
         ("id","user_id","chapter_id","rating","title","content","author_name","status","createdAt","updatedAt")
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      id,
      input.user_id ?? null,
      input.chapter_id,
      input.rating,
      input.title ?? null,
      input.content,
      input.author_name ?? null,
      'published',
      ts,
      ts,
    )
    .run();

  // Return the created review with joins
  const row = await db
    .prepare(
      `SELECT ${REVIEW_SELECT} ${REVIEW_JOINS}
       WHERE r."id" = ?`,
    )
    .bind(id)
    .first<ReviewDisplay>();

  return row!;
}

// ── Delete ────────────────────────────────────────────────

export async function deleteReview(
  db: D1Database,
  reviewId: string,
  userId?: string | null,
): Promise<boolean> {
  let query = 'DELETE FROM "review" WHERE "id" = ?';
  const params: unknown[] = [reviewId];

  // If userId provided, only delete own review (self-delete)
  if (userId) {
    query += ' AND "user_id" = ?';
    params.push(userId);
  }

  const result = await db.prepare(query).bind(...params).run();
  return (result.meta.changes ?? 0) > 0;
}
