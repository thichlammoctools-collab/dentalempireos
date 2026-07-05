globalThis.process ??= {};
globalThis.process.env ??= {};
async function upsertReadingProgress(db, userId, chapterId, pct, bookmarked) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const id = `${userId}__${chapterId}`;
  await db.prepare(
    `INSERT INTO "reading_progress"
        ("id","user_id","chapter_id","pct","max_pct","bookmarked","last_read_at","created_at")
       VALUES (?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "pct" = excluded."pct",
         "max_pct" = MAX("max_pct", excluded."pct"),
         "bookmarked" = CASE WHEN excluded."bookmarked" = 1 THEN 1 ELSE "reading_progress"."bookmarked" END,
         "last_read_at" = excluded."last_read_at"`
  ).bind(id, userId, chapterId, pct, pct, bookmarked ? 1 : 0, now, now).run();
  return db.prepare('SELECT * FROM "reading_progress" WHERE "id" = ?').bind(id).first();
}
async function getUserReadingProgress(db, userId) {
  const { results } = await db.prepare('SELECT * FROM "reading_progress" WHERE "user_id" = ? ORDER BY "last_read_at" DESC').bind(userId).all();
  return results ?? [];
}
async function getChapterReadingProgress(db, userId, chapterId) {
  return db.prepare('SELECT * FROM "reading_progress" WHERE "user_id" = ? AND "chapter_id" = ?').bind(userId, chapterId).first();
}
async function toggleBookmark(db, userId, chapterId) {
  const existing = await getChapterReadingProgress(db, userId, chapterId);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (existing) {
    const newVal = existing.bookmarked ? 0 : 1;
    await db.prepare(
      'UPDATE "reading_progress" SET "bookmarked" = ?, "last_read_at" = ? WHERE "user_id" = ? AND "chapter_id" = ?'
    ).bind(newVal, now, userId, chapterId).run();
    return newVal === 1;
  } else {
    const id = `${userId}__${chapterId}`;
    await db.prepare(
      `INSERT INTO "reading_progress" ("id","user_id","chapter_id","pct","max_pct","bookmarked","last_read_at","created_at")
         VALUES (?,?,?,0,0,1,?,?)`
    ).bind(id, userId, chapterId, now, now).run();
    return true;
  }
}
async function getReadingStats(db, userId) {
  const rows = await getUserReadingProgress(db, userId);
  const completed = rows.filter((r) => r.max_pct >= 90).length;
  const inProgress = rows.filter((r) => r.max_pct > 0 && r.max_pct < 90).length;
  const bookmarked = rows.filter((r) => r.bookmarked === 1).length;
  const lastReadAt = rows[0]?.last_read_at ?? null;
  const { results: totalRow } = await db.prepare(`SELECT COUNT(*) as cnt FROM "chapter" WHERE "status" = 'published'`).all();
  return {
    totalChapters: totalRow?.[0]?.cnt ?? 0,
    completed,
    inProgress,
    bookmarked,
    lastReadAt
  };
}
export {
  getUserReadingProgress as a,
  getReadingStats as g,
  toggleBookmark as t,
  upsertReadingProgress as u
};
