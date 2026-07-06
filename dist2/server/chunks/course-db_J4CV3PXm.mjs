globalThis.process ??= {};
globalThis.process.env ??= {};
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function nanoid() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}
async function getCourse(db, id) {
  const result = await db.prepare('SELECT * FROM "course" WHERE "id" = ?').bind(id).first();
  return result ?? null;
}
async function listCourses(db, opts = {}) {
  const { publishedOnly = false } = opts;
  const whereClause = publishedOnly ? 'WHERE c."is_published" = 1' : "";
  return db.prepare(`
      SELECT c.*, COUNT(cv.id) AS video_count
      FROM "course" c
      LEFT JOIN "course_video" cv ON cv."course_id" = c."id" AND cv."is_published" = 1
      ${whereClause}
      GROUP BY c."id"
      ORDER BY c."sort_order" ASC, c."created_at" ASC
    `).all().then((r) => r.results);
}
async function upsertCourse(db, input) {
  const id = input.id ?? nanoid();
  const timestamp = now();
  await db.prepare(`
      INSERT INTO "course" ("id", "title", "description", "thumbnail_url", "sort_order", "is_published", "created_at", "updated_at")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT("id") DO UPDATE SET
        "title" = excluded."title",
        "description" = excluded."description",
        "thumbnail_url" = excluded."thumbnail_url",
        "sort_order" = excluded."sort_order",
        "is_published" = excluded."is_published",
        "updated_at" = excluded."updated_at"
    `).bind(
    id,
    input.title,
    input.description ?? null,
    input.thumbnail_url ?? null,
    input.sort_order ?? 0,
    input.is_published ?? 0,
    input.id ? (await getCourse(db, id))?.created_at ?? timestamp : timestamp,
    timestamp
  ).run();
  return await getCourse(db, id);
}
async function deleteCourse(db, id) {
  await db.prepare('DELETE FROM "course" WHERE "id" = ?').bind(id).run();
}
async function getCourseVideo(db, id) {
  const result = await db.prepare('SELECT * FROM "course_video" WHERE "id" = ?').bind(id).first();
  return result ?? null;
}
async function getCourseVideos(db, courseId, opts = {}) {
  const { publishedOnly = false } = opts;
  const whereClause = publishedOnly ? 'AND "is_published" = 1' : "";
  return db.prepare(`
      SELECT * FROM "course_video"
      WHERE "course_id" = ?
      ${whereClause}
      ORDER BY "sort_order" ASC, "created_at" ASC
    `).bind(courseId).all().then((r) => r.results);
}
async function upsertCourseVideo(db, input) {
  const id = input.id ?? nanoid();
  const timestamp = now();
  await db.prepare(`
      INSERT INTO "course_video" ("id", "course_id", "youtube_id", "title", "description", "sort_order", "duration_seconds", "is_published", "created_at", "updated_at")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT("id") DO UPDATE SET
        "youtube_id" = excluded."youtube_id",
        "title" = excluded."title",
        "description" = excluded."description",
        "sort_order" = excluded."sort_order",
        "duration_seconds" = excluded."duration_seconds",
        "is_published" = excluded."is_published",
        "updated_at" = excluded."updated_at"
    `).bind(
    id,
    input.course_id,
    input.youtube_id,
    input.title,
    input.description ?? null,
    input.sort_order ?? 0,
    input.duration_seconds ?? null,
    input.is_published ?? 0,
    input.id ? (await getCourseVideo(db, id))?.created_at ?? timestamp : timestamp,
    timestamp
  ).run();
  return await getCourseVideo(db, id);
}
async function deleteCourseVideo(db, id) {
  await db.prepare('DELETE FROM "course_video" WHERE "id" = ?').bind(id).run();
}
export {
  getCourseVideos as a,
  deleteCourse as b,
  upsertCourse as c,
  deleteCourseVideo as d,
  getCourse as g,
  listCourses as l,
  upsertCourseVideo as u
};
