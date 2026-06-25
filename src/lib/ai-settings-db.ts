// Data access layer for AI Settings stored in D1.
// Single-row settings table, managed via admin panel.

export interface AiSettingsRow {
  id: number;
  base_url: string;
  api_key: string;
  model: string;
  max_tokens: number;
  is_active: number; // 0 = off, 1 = on
  updated_at: string;
}

const AI_SETTINGS_DEFAULTS: AiSettingsRow = {
  id: 1,
  base_url: 'https://api.anthropic.com',
  api_key: '',
  model: 'claude-sonnet-4-6',
  max_tokens: 4096,
  is_active: 0,
  updated_at: '',
};

export async function getAiSettings(db: D1Database): Promise<AiSettingsRow> {
  try {
    const row = await db
      .prepare('SELECT * FROM "ai_settings" WHERE "id" = 1')
      .first<AiSettingsRow>();
    return row ?? AI_SETTINGS_DEFAULTS;
  } catch {
    // Table may not exist yet (migration pending) — return defaults
    return AI_SETTINGS_DEFAULTS;
  }
}

export async function updateAiSettings(
  db: D1Database,
  data: { base_url?: string; api_key?: string; model?: string; max_tokens?: number; is_active?: number },
): Promise<void> {
  const now = new Date().toISOString();
  const current = await getAiSettings(db);
  try {
    await db
      .prepare(
        `UPDATE "ai_settings"
         SET "base_url" = ?, "api_key" = ?, "model" = ?, "max_tokens" = ?, "is_active" = ?, "updated_at" = ?
         WHERE "id" = 1`,
      )
      .bind(
        data.base_url ?? current.base_url,
        data.api_key ?? current.api_key,
        data.model ?? current.model,
        data.max_tokens ?? current.max_tokens,
        data.is_active ?? current.is_active,
        now,
      )
      .run();
  } catch {
    // Table may not exist yet — silently ignore (admin must apply migration)
  }
}

/** Check if AI analysis is enabled and configured */
export async function isAiEnabled(db: D1Database): Promise<boolean> {
  const settings = await getAiSettings(db);
  return settings.is_active === 1 && settings.api_key.length > 0;
}
