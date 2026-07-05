globalThis.process ??= {};
globalThis.process.env ??= {};
async function getClinicProfile(db, userId) {
  return db.prepare('SELECT * FROM "clinic_profile" WHERE "id" = ?').bind(userId).first() ?? null;
}
async function upsertClinicProfile(db, input) {
  await db.prepare(
    `INSERT INTO "clinic_profile" ("id","name","clinic_name","clinic_address","phone","logo_url")
       VALUES (?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "name" = excluded."name",
         "clinic_name" = excluded."clinic_name",
         "clinic_address" = excluded."clinic_address",
         "phone" = excluded."phone",
         "logo_url" = excluded."logo_url",
         "updated_at" = datetime('now')`
  ).bind(
    input.id,
    input.name ?? null,
    input.clinic_name ?? null,
    input.clinic_address ?? null,
    input.phone ?? null,
    input.logo_url ?? null
  ).run();
}
export {
  getClinicProfile as g,
  upsertClinicProfile as u
};
