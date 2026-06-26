// Data access layer for AI Application registry in D1.
// Covers CRUD for ai_application and helper to parse config_json.

// ── Types ────────────────────────────────────────────────────

export type AppType = 'survey' | 'ebook_ai' | 'course_ai' | 'tool' | 'generator';
export type AppStatus = 'draft' | 'active' | 'archived';

export interface App {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  type: AppType;
  status: AppStatus;
  is_free: number;
  config_json: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppInput {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  type: AppType;
  status?: AppStatus;
  is_free?: number;
  config_json?: string | null;
}

// ── Helpers ──────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString();
}

/** Parse config_json safely — returns empty object on null or invalid JSON. */
export function parseAppConfig(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

// ── CRUD ─────────────────────────────────────────────────────

export async function listApps(db: D1Database): Promise<App[]> {
  const { results } = await db
    .prepare('SELECT * FROM "ai_application" ORDER BY "created_at" DESC')
    .all<App>();
  return results;
}

export async function listActiveApps(db: D1Database): Promise<App[]> {
  const { results } = await db
    .prepare(
      'SELECT * FROM "ai_application" WHERE "status" = ? ORDER BY "created_at" DESC',
    )
    .bind('active')
    .all<App>();
  return results;
}

export async function getApp(db: D1Database, id: string): Promise<App | null> {
  return db
    .prepare('SELECT * FROM "ai_application" WHERE "id" = ?')
    .bind(id)
    .first<App>();
}

export async function upsertApp(db: D1Database, input: AppInput): Promise<App> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "ai_application"
         ("id","slug","name","description","type","status","is_free","config_json","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "slug"=excluded."slug",
         "name"=excluded."name",
         "description"=excluded."description",
         "type"=excluded."type",
         "status"=excluded."status",
         "is_free"=excluded."is_free",
         "config_json"=excluded."config_json",
         "updated_at"=excluded."updated_at"`,
    )
    .bind(
      input.id,
      input.slug,
      input.name,
      input.description ?? null,
      input.type,
      input.status ?? 'draft',
      input.is_free ?? 0,
      input.config_json ?? null,
      ts,
      ts,
    )
    .run();
  return getApp(db, input.id) as Promise<App>;
}

export async function deleteApp(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM "ai_application" WHERE "id" = ?').bind(id).run();
}
