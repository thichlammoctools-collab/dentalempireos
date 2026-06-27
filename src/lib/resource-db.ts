// Data access layer for downloadable resources stored in D1.
// Resources are standalone assets (PDFs, Excel sheets, videos, etc.)
// managed via admin CRUD and displayed on the public /resources page.

export interface ResourceRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  file_ext: string;
  file_url: string;
  category: string;
  tier: string;
  tag: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ResourceInput {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  file_ext?: string;
  file_url?: string;
  category?: string;
  tier?: string;
  tag?: string;
  sort_order?: number;
}

function now(): string {
  return new Date().toISOString();
}

export interface ListResourcesOptions {
  search?: string;
  category?: string;
}

// ── List ─────────────────────────────────────────────────────

export async function listResources(db: D1Database, opts: ListResourcesOptions = {}): Promise<ResourceRow[]> {
  const conditions: string[] = [];
  const binds: (string | number)[] = [];

  if (opts.search) {
    conditions.push('("title" LIKE ? OR "description" LIKE ?)');
    binds.push(`%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.category && opts.category !== 'all') {
    conditions.push('"category" = ?');
    binds.push(opts.category);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { results } = await db
    .prepare(`SELECT * FROM "resource" ${where} ORDER BY "sort_order", "id" DESC`)
    .bind(...binds)
    .all<ResourceRow>();
  return results;
}

export async function countResources(db: D1Database, opts: ListResourcesOptions = {}): Promise<number> {
  const conditions: string[] = [];
  const binds: (string | number)[] = [];

  if (opts.search) {
    conditions.push('("title" LIKE ? OR "description" LIKE ?)');
    binds.push(`%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.category && opts.category !== 'all') {
    conditions.push('"category" = ?');
    binds.push(opts.category);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await db
    .prepare(`SELECT COUNT(*) as count FROM "resource" ${where}`)
    .bind(...binds)
    .first<{ count: number }>();
  return result?.count ?? 0;
}

// ── Get ──────────────────────────────────────────────────────

export async function getResource(db: D1Database, id: string): Promise<ResourceRow | null> {
  return db.prepare('SELECT * FROM "resource" WHERE "id" = ?').bind(id).first<ResourceRow>();
}

// ── Upsert ───────────────────────────────────────────────────

export async function upsertResource(db: D1Database, input: ResourceInput): Promise<void> {
  const ts = now();
  await db
    .prepare(
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
         "updated_at"=excluded."updated_at"`,
    )
    .bind(
      input.id,
      input.title,
      input.description ?? '',
      input.icon ?? 'description',
      input.file_ext ?? 'pdf',
      input.file_url ?? '',
      input.category ?? 'bieu_mau',
      input.tier ?? 'free',
      input.tag ?? '',
      input.sort_order ?? 0,
      ts,
      ts,
    )
    .run();
}

// ── Delete ───────────────────────────────────────────────────

export async function deleteResource(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM "resource" WHERE "id" = ?').bind(id).run();
}
