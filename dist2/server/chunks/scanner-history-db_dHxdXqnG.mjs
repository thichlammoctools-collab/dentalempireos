globalThis.process ??= {};
globalThis.process.env ??= {};
async function addToHistory(db, input) {
  const result = await db.prepare(
    `INSERT INTO "scanner_history" ("user_id","survey_id","response_id","score_total","score_label")
       VALUES (?,?,?,?,?)
       RETURNING "id"`
  ).bind(
    input.user_id,
    input.survey_id,
    input.response_id,
    input.score_total ?? null,
    input.score_label ?? null
  ).first();
  return result?.id ?? 0;
}
async function getUserHistory(db, userId, limit = 50) {
  const { results } = await db.prepare(
    `SELECT h.*, d.title_vi as scanner_title_vi, d.title_en as scanner_title_en, d.slug as scanner_slug
       FROM "scanner_history" h
       JOIN "survey_definition" d ON d.id = h.survey_id
       WHERE h.user_id = ?
       ORDER BY h.created_at DESC
       LIMIT ?`
  ).bind(userId, limit).all();
  return results ?? [];
}
async function isResponseOwnedByUser(db, userId, responseId) {
  const row = await db.prepare('SELECT 1 FROM "scanner_history" WHERE "user_id" = ? AND "response_id" = ?').bind(userId, responseId).first();
  return !!row;
}
export {
  addToHistory as a,
  getUserHistory as g,
  isResponseOwnedByUser as i
};
