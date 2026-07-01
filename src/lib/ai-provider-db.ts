// Data access layer for AI providers and models.

export interface AiProviderRow {
  id: number;
  name: string;
  slug: string;
  base_url: string;
  api_key: string;
  is_active: number;
  is_default: number;
}

export interface AiModelRow {
  id: number;
  provider_id: number;
  name: string;
  model_id: string;
  max_tokens: number | null;
  is_active: number;
}

export async function listProviders(db: D1Database): Promise<AiProviderRow[]> {
  const { results } = await db
    .prepare('SELECT * FROM "ai_provider" ORDER BY "is_default" DESC, "id" ASC')
    .all<AiProviderRow>();
  return results;
}

export async function getProviderById(db: D1Database, id: number): Promise<AiProviderRow | null> {
  return db
    .prepare('SELECT * FROM "ai_provider" WHERE "id" = ?')
    .bind(id)
    .first<AiProviderRow>();
}

export async function upsertProvider(
  db: D1Database,
  input: Partial<AiProviderRow> & { name: string; slug: string },
): Promise<AiProviderRow> {
  const existing = await db
    .prepare('SELECT * FROM "ai_provider" WHERE "slug" = ?')
    .bind(input.slug)
    .first<AiProviderRow>();

  const now = new Date().toISOString();
  const fields = ['name', 'base_url', 'api_key', 'is_active'];
  const sets = fields.map(f => `"${f}" = ?`).join(', ');
  const values = fields.map(f => (input as Record<string, unknown>)[f] ?? '');

  if (existing) {
    await db
      .prepare(`UPDATE "ai_provider" SET ${sets}, "updated_at" = ? WHERE "id" = ?`)
      .bind(...values, now, existing.id)
      .run();
    return { ...existing, ...Object.fromEntries(fields.map((f, i) => [f, values[i]])) };
  } else {
    await db
      .prepare(`INSERT INTO "ai_provider" ("name","slug","base_url","api_key","is_active","is_default","created_at","updated_at") VALUES (?,?,?,?,?,0,?,?)`)
      .bind(input.name, input.slug, input.base_url || '', input.api_key || '', input.is_active || 0, now, now)
      .run();
    const row = await db
      .prepare('SELECT * FROM "ai_provider" WHERE "slug" = ?')
      .bind(input.slug)
      .first<AiProviderRow>();
    return row!;
  }
}

export async function toggleProviderActive(db: D1Database, id: number, active: boolean): Promise<void> {
  await db
    .prepare('UPDATE "ai_provider" SET "is_active" = ?, "updated_at" = ? WHERE "id" = ?')
    .bind(active ? 1 : 0, new Date().toISOString(), id)
    .run();
}

export async function deleteProvider(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM "ai_model" WHERE "provider_id" = ?').bind(id).run();
  await db.prepare('DELETE FROM "ai_provider" WHERE "id" = ?').bind(id).run();
}

export async function listModels(db: D1Database, providerId?: number): Promise<AiModelRow[]> {
  const sql = providerId
    ? 'SELECT * FROM "ai_model" WHERE "provider_id" = ? ORDER BY "id"'
    : 'SELECT * FROM "ai_model" ORDER BY "provider_id", "id"';
  const q = providerId
    ? db.prepare(sql).bind(providerId)
    : db.prepare(sql);
  const { results } = await q.all<AiModelRow>();
  return results;
}

export async function upsertModel(
  db: D1Database,
  input: { provider_id: number; name: string; model_id: string; max_tokens?: number },
): Promise<AiModelRow> {
  const existing = await db
    .prepare('SELECT * FROM "ai_model" WHERE "provider_id" = ? AND "model_id" = ?')
    .bind(input.provider_id, input.model_id)
    .first<AiModelRow>();

  if (existing) {
    await db
      .prepare('UPDATE "ai_model" SET "name" = ?, "max_tokens" = ? WHERE "id" = ?')
      .bind(input.name, input.max_tokens ?? null, existing.id)
      .run();
    return { ...existing, name: input.name, max_tokens: input.max_tokens ?? null };
  } else {
    await db
      .prepare('INSERT INTO "ai_model" ("provider_id","name","model_id","max_tokens") VALUES (?,?,?,?)')
      .bind(input.provider_id, input.name, input.model_id, input.max_tokens ?? null)
      .run();
    const row = await db
      .prepare('SELECT * FROM "ai_model" WHERE "provider_id" = ? AND "model_id" = ?')
      .bind(input.provider_id, input.model_id)
      .first<AiModelRow>();
    return row!;
  }
}

export async function deleteModel(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM "ai_model" WHERE "id" = ?').bind(id).run();
}

/** Get active models with their provider info, grouped by provider. */
export async function getActiveModelsWithProvider(
  db: D1Database,
): Promise<Map<number, { provider: AiProviderRow; models: AiModelRow[] }>> {
  const { results } = await db
    .prepare(`
      SELECT m.*, p.name as provider_name, p.slug as provider_slug,
             p.base_url, p.api_key, p.is_active as provider_active
      FROM "ai_model" m
      JOIN "ai_provider" p ON m.provider_id = p.id
      WHERE m.is_active = 1 AND p.is_active = 1
      ORDER BY p.is_default DESC, p.id, m.id
    `)
    .all<AiModelRow & { provider_name: string; provider_slug: string; base_url: string; api_key: string; provider_active: number }>();

  const map = new Map<number, { provider: AiProviderRow; models: AiModelRow[] }>();
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
          is_default: 0,
        },
        models: [],
      });
    }
    map.get(row.provider_id)!.models.push(row);
  }
  return map;
}
