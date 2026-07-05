globalThis.process ??= {};
globalThis.process.env ??= {};
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function genId() {
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
async function listReviewsByChapter(db, chapterId, limit = 20, offset = 0) {
  const { results } = await db.prepare(
    `SELECT ${REVIEW_SELECT} ${REVIEW_JOINS}
       WHERE r."chapter_id" = ? AND r."status" = 'published'
       ORDER BY r."createdAt" DESC
       LIMIT ? OFFSET ?`
  ).bind(chapterId, limit, offset).all();
  return results;
}
async function listLatestReviews(db, limit = 20, offset = 0) {
  const { results } = await db.prepare(
    `SELECT ${REVIEW_SELECT} ${REVIEW_JOINS}
       WHERE r."status" = 'published'
       ORDER BY r."createdAt" DESC
       LIMIT ? OFFSET ?`
  ).bind(limit, offset).all();
  return results;
}
async function getReviewStats(db, chapterId) {
  const row = await db.prepare(
    `SELECT COUNT(*) as "total", COALESCE(AVG("rating"), 0) as "avg"
       FROM "review"
       WHERE "chapter_id" = ? AND "status" = 'published'`
  ).bind(chapterId).first();
  return {
    avgRating: Math.round((row?.avg ?? 0) * 10) / 10,
    totalReviews: row?.total ?? 0
  };
}
async function createReview(db, input) {
  const ts = now();
  const id = genId();
  await db.prepare(
    `INSERT INTO "review"
         ("id","user_id","chapter_id","rating","title","content","author_name","status","createdAt","updatedAt")
       VALUES (?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    id,
    input.user_id ?? null,
    input.chapter_id,
    input.rating,
    input.title ?? null,
    input.content,
    input.author_name ?? null,
    "published",
    ts,
    ts
  ).run();
  const row = await db.prepare(
    `SELECT ${REVIEW_SELECT} ${REVIEW_JOINS}
       WHERE r."id" = ?`
  ).bind(id).first();
  return row;
}
async function deleteReview(db, reviewId, userId) {
  let query = 'DELETE FROM "review" WHERE "id" = ?';
  const params = [reviewId];
  if (userId) {
    query += ' AND "user_id" = ?';
    params.push(userId);
  }
  const result = await db.prepare(query).bind(...params).run();
  return (result.meta.changes ?? 0) > 0;
}
export {
  listReviewsByChapter as a,
  createReview as c,
  deleteReview as d,
  getReviewStats as g,
  listLatestReviews as l
};
