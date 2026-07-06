globalThis.process ??= {};
globalThis.process.env ??= {};
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
async function createQuestion(db, userId, chapterId, sectionId, title, body) {
  const ts = now();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  await db.prepare(
    `INSERT INTO "question" ("id","user_id","chapter_id","section_id","title","body","status","createdAt","updatedAt")
       VALUES (?,?,?,?,?,?,?,?,?)`
  ).bind(id, userId, chapterId, sectionId ?? null, title, body, "open", ts, ts).run();
  return { id, user_id: userId, chapter_id: chapterId, section_id: sectionId ?? null, title, body, status: "open", createdAt: ts, updatedAt: ts };
}
async function getQuestion(db, id) {
  return db.prepare('SELECT * FROM "question" WHERE "id" = ?').bind(id).first();
}
async function listQuestionsByUser(db, userId) {
  const { results } = await db.prepare(
    `SELECT q.*,
              u."name" AS user_name,
              u."email" AS user_email,
              (SELECT COUNT(*) FROM "question_reply" qr WHERE qr."question_id" = q."id") AS reply_count
       FROM "question" q
       JOIN "user" u ON u."id" = q."user_id"
       WHERE q."user_id" = ?
       ORDER BY q."createdAt" DESC`
  ).bind(userId).all();
  return results;
}
async function listAllQuestions(db, status) {
  let sql = `SELECT q.*,
              u."name" AS user_name,
              u."email" AS user_email,
              (SELECT COUNT(*) FROM "question_reply" qr WHERE qr."question_id" = q."id") AS reply_count
       FROM "question" q
       JOIN "user" u ON u."id" = q."user_id"`;
  const params = [];
  if (status && status !== "all") {
    sql += ` WHERE q."status" = ?`;
    params.push(status);
  }
  sql += ` ORDER BY q."createdAt" DESC`;
  const { results } = await db.prepare(sql).bind(...params).all();
  return results;
}
async function updateQuestionStatus(db, id, status) {
  await db.prepare(`UPDATE "question" SET "status" = ?, "updatedAt" = ? WHERE "id" = ?`).bind(status, now(), id).run();
}
async function replyToQuestion(db, questionId, userId, body, isAdmin) {
  const ts = now();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  await db.prepare(
    `INSERT INTO "question_reply" ("id","question_id","user_id","body","is_admin","createdAt")
       VALUES (?,?,?,?,?,?)`
  ).bind(id, questionId, userId, body, isAdmin ? 1 : 0, ts).run();
  await db.prepare(`UPDATE "question" SET "updatedAt" = ? WHERE "id" = ?`).bind(ts, questionId).run();
  return { id, question_id: questionId, user_id: userId, body, is_admin: isAdmin ? 1 : 0, createdAt: ts };
}
async function getReplies(db, questionId) {
  const { results } = await db.prepare(
    `SELECT r.*,
              u."name" AS user_name,
              u."email" AS user_email,
              u."image" AS user_image
       FROM "question_reply" r
       JOIN "user" u ON u."id" = r."user_id"
       WHERE r."question_id" = ?
       ORDER BY r."createdAt" ASC`
  ).bind(questionId).all();
  return results;
}
async function createNotification(db, userId, type, title, body, link) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  await db.prepare(
    `INSERT INTO "notification" ("id","user_id","type","title","body","link","read","createdAt")
       VALUES (?,?,?,?,?,?,0,?)`
  ).bind(id, userId, type, title, body, link, now()).run();
}
async function listNotifications(db, userId) {
  const { results } = await db.prepare(
    `SELECT * FROM "notification"
       WHERE "user_id" = ?
       ORDER BY "createdAt" DESC
       LIMIT 50`
  ).bind(userId).all();
  return results;
}
async function getUnreadCount(db, userId) {
  const row = await db.prepare(`SELECT COUNT(*) AS count FROM "notification" WHERE "user_id" = ? AND "read" = 0`).bind(userId).first();
  return row?.count ?? 0;
}
async function markNotificationRead(db, id) {
  await db.prepare(`UPDATE "notification" SET "read" = 1 WHERE "id" = ?`).bind(id).run();
}
async function markAllNotificationsRead(db, userId) {
  await db.prepare(`UPDATE "notification" SET "read" = 1 WHERE "user_id" = ? AND "read" = 0`).bind(userId).run();
}
async function getQuestionStats(db) {
  const { results } = await db.prepare(
    `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN "status" = 'open' THEN 1 ELSE 0 END) AS open,
         SUM(CASE WHEN "status" = 'answered' THEN 1 ELSE 0 END) AS answered,
         SUM(CASE WHEN "status" = 'closed' THEN 1 ELSE 0 END) AS closed
       FROM "question"`
  ).all();
  return results[0] ?? { total: 0, open: 0, answered: 0, closed: 0 };
}
export {
  getReplies as a,
  getQuestionStats as b,
  createNotification as c,
  markAllNotificationsRead as d,
  getUnreadCount as e,
  listNotifications as f,
  getQuestion as g,
  listQuestionsByUser as h,
  createQuestion as i,
  listAllQuestions as l,
  markNotificationRead as m,
  replyToQuestion as r,
  updateQuestionStatus as u
};
