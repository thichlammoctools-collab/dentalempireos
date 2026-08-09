// Data access layer for AI Settings stored in D1.
// Single-row settings table, managed via admin panel.

export interface AiSettingsRow {
  id: number;
  base_url: string;
  api_key: string;
  model: string;
  max_tokens: number;
  is_active: number; // 0 = off, 1 = on
  chat_provider_id: number | null;
  chat_model_id: number | null;
  embedding_provider_id: number | null;
  embedding_model_id: number | null;
  gateway_enabled: number;
  gateway_account_id: string | null;
  gateway_id: string;
  gateway_default_model: string | null;
  gateway_chat_model: string | null;
  gateway_embedding_model: string | null;
  ai_provider: 'cloudflare' | 'motapis';
  motapis_enabled: number;
  motapis_model: string | null;
  motapis_scanner_model: string | null;
  motapis_chat_model: string | null;
  updated_at: string;
}

const AI_SETTINGS_DEFAULTS: AiSettingsRow = {
  id: 1,
  base_url: 'https://api.anthropic.com',
  api_key: '',
  model: 'anthropic/claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  is_active: 0,
  chat_provider_id: null,
  chat_model_id: null,
  embedding_provider_id: null,
  embedding_model_id: null,
  gateway_enabled: 0,
  gateway_account_id: null,
  gateway_id: 'default',
  gateway_default_model: null,
  gateway_chat_model: null,
  gateway_embedding_model: null,
  ai_provider: 'cloudflare',
  motapis_enabled: 0,
  motapis_model: null,
  motapis_scanner_model: null,
  motapis_chat_model: null,
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
  data: {
    base_url?: string;
    api_key?: string;
    model?: string;
    max_tokens?: number;
    is_active?: number;
    chat_provider_id?: number | null;
    chat_model_id?: number | null;
    embedding_provider_id?: number | null;
    embedding_model_id?: number | null;
    gateway_enabled?: number;
    gateway_account_id?: string | null;
    gateway_id?: string;
    gateway_default_model?: string | null;
    gateway_chat_model?: string | null;
    gateway_embedding_model?: string | null;
    ai_provider?: 'cloudflare' | 'motapis';
    motapis_enabled?: number;
    motapis_model?: string | null;
    motapis_scanner_model?: string | null;
    motapis_chat_model?: string | null;
  },
): Promise<void> {
  const now = new Date().toISOString();
  const current = await getAiSettings(db);
  try {
    await db
      .prepare(
        `UPDATE "ai_settings"
         SET "base_url" = ?, "api_key" = ?, "model" = ?, "max_tokens" = ?, "is_active" = ?,
               "chat_provider_id" = ?, "chat_model_id" = ?, "embedding_provider_id" = ?, "embedding_model_id" = ?,
               "gateway_enabled" = ?, "gateway_account_id" = ?, "gateway_id" = ?, "gateway_default_model" = ?,
                "gateway_chat_model" = ?, "gateway_embedding_model" = ?, "updated_at" = ?,
                "ai_provider" = ?, "motapis_enabled" = ?, "motapis_model" = ?,
                "motapis_scanner_model" = ?, "motapis_chat_model" = ?
         WHERE "id" = 1`,
      )
      .bind(
        data.base_url ?? current.base_url,
        data.api_key ?? current.api_key,
        data.model ?? current.model,
        data.max_tokens ?? current.max_tokens,
        data.is_active ?? current.is_active,
        data.chat_provider_id ?? current.chat_provider_id,
        data.chat_model_id ?? current.chat_model_id,
        data.embedding_provider_id ?? current.embedding_provider_id,
        data.embedding_model_id ?? current.embedding_model_id,
        data.gateway_enabled ?? current.gateway_enabled,
        data.gateway_account_id ?? current.gateway_account_id,
        data.gateway_id ?? current.gateway_id,
        data.gateway_default_model ?? current.gateway_default_model,
        data.gateway_chat_model ?? current.gateway_chat_model,
        data.gateway_embedding_model ?? current.gateway_embedding_model,
        now,
        data.ai_provider ?? current.ai_provider,
        data.motapis_enabled ?? current.motapis_enabled,
        data.motapis_model ?? current.motapis_model,
        data.motapis_scanner_model ?? current.motapis_scanner_model,
        data.motapis_chat_model ?? current.motapis_chat_model,
      )
      .run();
  } catch (error) {
    throw new Error(`Không thể lưu cấu hình AI Gateway: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** Check if AI analysis is enabled and configured */
export async function isAiEnabled(db: D1Database): Promise<boolean> {
  const settings = await getAiSettings(db);
  return settings.ai_provider === 'motapis'
    ? settings.motapis_enabled === 1 && Boolean(settings.motapis_model)
    : settings.gateway_enabled === 1 && Boolean(settings.gateway_account_id && settings.gateway_default_model);
}
