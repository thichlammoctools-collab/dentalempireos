globalThis.process ??= {};
globalThis.process.env ??= {};
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
async function listResources(db, opts = {}) {
  const conditions = [];
  const binds = [];
  if (opts.search) {
    conditions.push('("title" LIKE ? OR "description" LIKE ?)');
    binds.push(`%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.category && opts.category !== "all") {
    conditions.push('"category" = ?');
    binds.push(opts.category);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { results } = await db.prepare(`SELECT * FROM "resource" ${where} ORDER BY "sort_order", "id" DESC`).bind(...binds).all();
  return results;
}
async function countResources(db, opts = {}) {
  const conditions = [];
  const binds = [];
  if (opts.search) {
    conditions.push('("title" LIKE ? OR "description" LIKE ?)');
    binds.push(`%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.category && opts.category !== "all") {
    conditions.push('"category" = ?');
    binds.push(opts.category);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await db.prepare(`SELECT COUNT(*) as count FROM "resource" ${where}`).bind(...binds).first();
  return result?.count ?? 0;
}
async function getResource(db, id) {
  return db.prepare('SELECT * FROM "resource" WHERE "id" = ?').bind(id).first();
}
async function upsertResource(db, input) {
  const ts = now();
  await db.prepare(
    `INSERT INTO "resource" ("id","title","description","icon","file_ext","file_url","category","tier","tag","sort_order","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "title"=excluded."title",
         "description"=excluded."description",
         "icon"=excluded."icon",
         "file_ext"=excluded."file_ext",
         "file_url"=excluded."file_url",
         "category"=excluded."category",
         "tier"=excluded."tier",
         "tag"=excluded."tag",
         "sort_order"=excluded."sort_order",
         "updated_at"=excluded."updated_at"`
  ).bind(
    input.id,
    input.title,
    input.description ?? "",
    input.icon ?? "description",
    input.file_ext ?? "pdf",
    input.file_url ?? "",
    input.category ?? "bieu_mau",
    input.tier ?? "free",
    input.tag ?? "",
    input.sort_order ?? 0,
    ts,
    ts
  ).run();
}
async function deleteResource(db, id) {
  await db.prepare('DELETE FROM "resource" WHERE "id" = ?').bind(id).run();
}
export {
  countResources as c,
  deleteResource as d,
  getResource as g,
  listResources as l,
  upsertResource as u
};
