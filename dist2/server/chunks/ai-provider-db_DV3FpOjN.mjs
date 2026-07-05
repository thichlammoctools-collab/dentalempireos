globalThis.process ??= {};
globalThis.process.env ??= {};
async function listProviders(db) {
  const { results } = await db.prepare('SELECT * FROM "ai_provider" ORDER BY "is_default" DESC, "id" ASC').all();
  return results;
}
async function upsertProvider(db, input) {
  const existing = await db.prepare('SELECT * FROM "ai_provider" WHERE "slug" = ?').bind(input.slug).first();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const fields = ["name", "base_url", "api_key", "is_active"];
  const sets = fields.map((f) => `"${f}" = ?`).join(", ");
  const values = fields.map((f) => input[f] ?? "");
  if (existing) {
    await db.prepare(`UPDATE "ai_provider" SET ${sets}, "updated_at" = ? WHERE "id" = ?`).bind(...values, now, existing.id).run();
    return { ...existing, ...Object.fromEntries(fields.map((f, i) => [f, values[i]])) };
  } else {
    await db.prepare(`INSERT INTO "ai_provider" ("name","slug","base_url","api_key","is_active","is_default","created_at","updated_at") VALUES (?,?,?,?,?,0,?,?)`).bind(input.name, input.slug, input.base_url || "", input.api_key || "", input.is_active || 0, now, now).run();
    const row = await db.prepare('SELECT * FROM "ai_provider" WHERE "slug" = ?').bind(input.slug).first();
    return row;
  }
}
async function toggleProviderActive(db, id, active) {
  await db.prepare('UPDATE "ai_provider" SET "is_active" = ?, "updated_at" = ? WHERE "id" = ?').bind(active ? 1 : 0, (/* @__PURE__ */ new Date()).toISOString(), id).run();
}
async function deleteProvider(db, id) {
  await db.prepare('DELETE FROM "ai_model" WHERE "provider_id" = ?').bind(id).run();
  await db.prepare('DELETE FROM "ai_provider" WHERE "id" = ?').bind(id).run();
}
async function listModels(db, providerId) {
  const sql = 'SELECT * FROM "ai_model" ORDER BY "provider_id", "id"';
  const q = providerId ? db.prepare(sql).bind(providerId) : db.prepare(sql);
  const { results } = await q.all();
  return results;
}
async function upsertModel(db, input) {
  const existing = await db.prepare('SELECT * FROM "ai_model" WHERE "provider_id" = ? AND "model_id" = ?').bind(input.provider_id, input.model_id).first();
  if (existing) {
    await db.prepare('UPDATE "ai_model" SET "name" = ?, "max_tokens" = ? WHERE "id" = ?').bind(input.name, input.max_tokens ?? null, existing.id).run();
    return { ...existing, name: input.name, max_tokens: input.max_tokens ?? null };
  } else {
    await db.prepare('INSERT INTO "ai_model" ("provider_id","name","model_id","max_tokens") VALUES (?,?,?,?)').bind(input.provider_id, input.name, input.model_id, input.max_tokens ?? null).run();
    const row = await db.prepare('SELECT * FROM "ai_model" WHERE "provider_id" = ? AND "model_id" = ?').bind(input.provider_id, input.model_id).first();
    return row;
  }
}
async function deleteModel(db, id) {
  await db.prepare('DELETE FROM "ai_model" WHERE "id" = ?').bind(id).run();
}
async function getActiveModelsWithProvider(db) {
  const { results } = await db.prepare(`
      SELECT m.*, p.name as provider_name, p.slug as provider_slug,
             p.base_url, p.api_key, p.is_active as provider_active
      FROM "ai_model" m
      JOIN "ai_provider" p ON m.provider_id = p.id
      WHERE m.is_active = 1 AND p.is_active = 1
      ORDER BY p.is_default DESC, p.id, m.id
    `).all();
  const map = /* @__PURE__ */ new Map();
  for (const row of results) {
    if (!map.has(row.provider_id)) {
      map.set(row.provider_id, {
        provider: {
          id: row.provider_id,
          name: row.provider_name,
          slug: row.provider_slug,
          base_url: row.base_url,
          api_key: row.api_key,
          is_active: row.provider_active,
          is_default: 0
        },
        models: []
      });
    }
    map.get(row.provider_id).models.push(row);
  }
  return map;
}
export {
  listModels as a,
  upsertModel as b,
  deleteModel as c,
  deleteProvider as d,
  getActiveModelsWithProvider as g,
  listProviders as l,
  toggleProviderActive as t,
  upsertProvider as u
};
