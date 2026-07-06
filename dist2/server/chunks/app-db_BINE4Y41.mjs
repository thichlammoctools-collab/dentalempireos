globalThis.process ??= {};
globalThis.process.env ??= {};
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function parseAppConfig(raw) {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
async function listApps(db) {
  const { results } = await db.prepare('SELECT * FROM "ai_application" ORDER BY "created_at" DESC').all();
  return results;
}
async function listActiveApps(db) {
  const { results } = await db.prepare(
    'SELECT * FROM "ai_application" WHERE "status" = ? ORDER BY "created_at" DESC'
  ).bind("active").all();
  return results;
}
async function getApp(db, id) {
  return db.prepare('SELECT * FROM "ai_application" WHERE "id" = ?').bind(id).first();
}
async function getAppBySlug(db, slug) {
  return db.prepare('SELECT * FROM "ai_application" WHERE "slug" = ?').bind(slug).first();
}
async function upsertApp(db, input) {
  const ts = now();
  await db.prepare(
    `INSERT INTO "ai_application"
         ("id","slug","name","description","type","status","is_free","config_json","linked_scanner_id","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "slug"=excluded."slug",
         "name"=excluded."name",
         "description"=excluded."description",
         "type"=excluded."type",
         "status"=excluded."status",
         "is_free"=excluded."is_free",
         "config_json"=excluded."config_json",
         "linked_scanner_id"=excluded."linked_scanner_id",
         "updated_at"=excluded."updated_at"`
  ).bind(
    input.id,
    input.slug,
    input.name,
    input.description ?? null,
    input.type,
    input.status ?? "draft",
    input.is_free ?? 0,
    input.config_json ?? null,
    input.linked_scanner_id ?? null,
    ts,
    ts
  ).run();
  return getApp(db, input.id);
}
async function deleteApp(db, id) {
  await db.prepare('DELETE FROM "ai_application" WHERE "id" = ?').bind(id).run();
}
export {
  listApps as a,
  getAppBySlug as b,
  deleteApp as d,
  getApp as g,
  listActiveApps as l,
  parseAppConfig as p,
  upsertApp as u
};
