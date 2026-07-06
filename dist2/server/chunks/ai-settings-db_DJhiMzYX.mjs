globalThis.process ??= {};
globalThis.process.env ??= {};
const AI_SETTINGS_DEFAULTS = {
  id: 1,
  base_url: "https://api.anthropic.com",
  api_key: "",
  model: "claude-sonnet-4-6",
  max_tokens: 4096,
  is_active: 0,
  updated_at: ""
};
async function getAiSettings(db) {
  try {
    const row = await db.prepare('SELECT * FROM "ai_settings" WHERE "id" = 1').first();
    return row ?? AI_SETTINGS_DEFAULTS;
  } catch {
    return AI_SETTINGS_DEFAULTS;
  }
}
async function updateAiSettings(db, data) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const current = await getAiSettings(db);
  try {
    await db.prepare(
      `UPDATE "ai_settings"
         SET "base_url" = ?, "api_key" = ?, "model" = ?, "max_tokens" = ?, "is_active" = ?, "updated_at" = ?
         WHERE "id" = 1`
    ).bind(
      data.base_url ?? current.base_url,
      data.api_key ?? current.api_key,
      data.model ?? current.model,
      data.max_tokens ?? current.max_tokens,
      data.is_active ?? current.is_active,
      now
    ).run();
  } catch {
  }
}
async function isAiEnabled(db) {
  const settings = await getAiSettings(db);
  return settings.is_active === 1 && settings.api_key.length > 0;
}
export {
  getAiSettings as g,
  isAiEnabled as i,
  updateAiSettings as u
};
