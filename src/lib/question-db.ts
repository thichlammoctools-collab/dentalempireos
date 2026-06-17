// Data access layer for questions, replies, and notifications stored in D1.

// ── Row types ──────────────────────────────────────────────

export interface QuestionRow {
  id: string;
  user_id: string;
  chapter_id: string;
  section_id: string | null;
  title: string;
  body: string;
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface QuestionWithUser extends QuestionRow {
  user_name: string;
  user_email: string;
  reply_count: number;
}

export interface ReplyRow {
  id: string;
  question_id: string;
  user_id: string;
  body: string;
  is_admin: number;
  createdAt: string;
}

export interface ReplyWithUser extends ReplyRow {
  user_name: string;
  user_email: string;
  user_image: string | null;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link: string;
  read: number;
  createdAt: string;
}

function now(): string {
  return new Date().toISOString();
}

// ── Questions ──────────────────────────────────────────────

export async function createQuestion(
  db: D1Database,
  userId: string,
  chapterId: string,
  sectionId: string | null,
  title: string,
  body: string,
): Promise<QuestionRow> {
  const ts = now();
  // Generate a simple ID using timestamp + random hex
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  await db
    .prepare(
      `INSERT INTO "question" ("id","user_id","chapter_id","section_id","title","body","status","createdAt","updatedAt")
       VALUES (?,?,?,?,?,?,?,?,?)`,
    )
    .bind(id, userId, chapterId, sectionId ?? null, title, body, 'open', ts, ts)
    .run();

  return { id, user_id: userId, chapter_id: chapterId, section_id: sectionId ?? null, title, body, status: 'open', createdAt: ts, updatedAt: ts };
}

export async function getQuestion(db: D1Database, id: string): Promise<QuestionRow | null> {
  return db.prepare('SELECT * FROM "question" WHERE "id" = ?').bind(id).first<QuestionRow>();
}

export async function listQuestionsByUser(db: D1Database, userId: string): Promise<QuestionWithUser[]> {
  const { results } = await db
    .prepare(
      `SELECT q.*,
              u."name" AS user_name,
              u."email" AS user_email,
              (SELECT COUNT(*) FROM "question_reply" qr WHERE qr."question_id" = q."id") AS reply_count
       FROM "question" q
       JOIN "user" u ON u."id" = q."user_id"
       WHERE q."user_id" = ?
       ORDER BY q."createdAt" DESC`,
    )
    .bind(userId)
    .all<QuestionWithUser>();
  return results;
}

export async function listAllQuestions(
  db: D1Database,
  status?: string,
): Promise<QuestionWithUser[]> {
  let sql = `SELECT q.*,
              u."name" AS user_name,
              u."email" AS user_email,
              (SELECT COUNT(*) FROM "question_reply" qr WHERE qr."question_id" = q."id") AS reply_count
       FROM "question" q
       JOIN "user" u ON u."id" = q."user_id"`;
  const params: unknown[] = [];

  if (status && status !== 'all') {
    sql += ` WHERE q."status" = ?`;
    params.push(status);
  }

  sql += ` ORDER BY q."createdAt" DESC`;

  const { results } = await db.prepare(sql).bind(...params).all<QuestionWithUser>();
  return results;
}

export async function updateQuestionStatus(
  db: D1Database,
  id: string,
  status: 'open' | 'answered' | 'closed',
): Promise<void> {
  await db
    .prepare(`UPDATE "question" SET "status" = ?, "updatedAt" = ? WHERE "id" = ?`)
    .bind(status, now(), id)
    .run();
}

// ── Replies ────────────────────────────────────────────────

export async function replyToQuestion(
  db: D1Database,
  questionId: string,
  userId: string,
  body: string,
  isAdmin: boolean,
): Promise<ReplyRow> {
  const ts = now();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  await db
    .prepare(
      `INSERT INTO "question_reply" ("id","question_id","user_id","body","is_admin","createdAt")
       VALUES (?,?,?,?,?,?)`,
    )
    .bind(id, questionId, userId, body, isAdmin ? 1 : 0, ts)
    .run();

  // Update question updatedAt
  await db
    .prepare(`UPDATE "question" SET "updatedAt" = ? WHERE "id" = ?`)
    .bind(ts, questionId)
    .run();

  return { id, question_id: questionId, user_id: userId, body, is_admin: isAdmin ? 1 : 0, createdAt: ts };
}

export async function getReplies(db: D1Database, questionId: string): Promise<ReplyWithUser[]> {
  const { results } = await db
    .prepare(
      `SELECT r.*,
              u."name" AS user_name,
              u."email" AS user_email,
              u."image" AS user_image
       FROM "question_reply" r
       JOIN "user" u ON u."id" = r."user_id"
       WHERE r."question_id" = ?
       ORDER BY r."createdAt" ASC`,
    )
    .bind(questionId)
    .all<ReplyWithUser>();
  return results;
}

// ── Notifications ──────────────────────────────────────────

export async function createNotification(
  db: D1Database,
  userId: string,
  type: string,
  title: string,
  body: string,
  link: string,
): Promise<void> {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  await db
    .prepare(
      `INSERT INTO "notification" ("id","user_id","type","title","body","link","read","createdAt")
       VALUES (?,?,?,?,?,?,0,?)`,
    )
    .bind(id, userId, type, title, body, link, now())
    .run();
}

export async function listNotifications(db: D1Database, userId: string): Promise<NotificationRow[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM "notification"
       WHERE "user_id" = ?
       ORDER BY "createdAt" DESC
       LIMIT 50`,
    )
    .bind(userId)
    .all<NotificationRow>();
  return results;
}

export async function getUnreadCount(db: D1Database, userId: string): Promise<number> {
  const row = await db
    .prepare(`SELECT COUNT(*) AS count FROM "notification" WHERE "user_id" = ? AND "read" = 0`)
    .bind(userId)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

export async function markNotificationRead(db: D1Database, id: string): Promise<void> {
  await db.prepare(`UPDATE "notification" SET "read" = 1 WHERE "id" = ?`).bind(id).run();
}

export async function markAllNotificationsRead(db: D1Database, userId: string): Promise<void> {
  await db.prepare(`UPDATE "notification" SET "read" = 1 WHERE "user_id" = ? AND "read" = 0`).bind(userId).run();
}

// ── Stats (for admin dashboard) ────────────────────────────

export async function getQuestionStats(db: D1Database): Promise<{
  total: number;
  open: number;
  answered: number;
  closed: number;
}> {
  const { results } = await db
    .prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN "status" = 'open' THEN 1 ELSE 0 END) AS open,
         SUM(CASE WHEN "status" = 'answered' THEN 1 ELSE 0 END) AS answered,
         SUM(CASE WHEN "status" = 'closed' THEN 1 ELSE 0 END) AS closed
       FROM "question"`,
    )
    .all<{ total: number; open: number; answered: number; closed: number }>();
  return results[0] ?? { total: 0, open: 0, answered: 0, closed: 0 };
}
