globalThis.process ??= {};
globalThis.process.env ??= {};
async function listUsers(db) {
  const { results } = await db.prepare('SELECT "id", "name", "email", "is_active", "createdAt" FROM "user" ORDER BY "createdAt" DESC').all();
  return results ?? [];
}
async function getUser(db, userId) {
  const row = await db.prepare('SELECT "id", "name", "email", "is_active", "createdAt" FROM "user" WHERE "id" = ?').bind(userId).first();
  return row ?? null;
}
async function getUserByEmail(db, email) {
  const row = await db.prepare('SELECT "id", "name", "email", "is_active", "createdAt" FROM "user" WHERE LOWER("email") = LOWER(?)').bind(email).first();
  return row ?? null;
}
async function toggleUserActive(db, userId) {
  await db.prepare('UPDATE "user" SET "is_active" = CASE WHEN "is_active" = 1 THEN 0 ELSE 1 END, "updatedAt" = ? WHERE "id" = ?').bind((/* @__PURE__ */ new Date()).toISOString(), userId).run();
  return getUser(db, userId);
}
export {
  getUserByEmail as g,
  listUsers as l,
  toggleUserActive as t
};
