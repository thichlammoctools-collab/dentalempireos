// Data access layer for book content stored in D1.
// Hierarchy: chapter -> section (self-referencing parent/child) -> block.

export interface ChapterRow {
  id: string;
  tier: number;
  chapter_no: number;
  title: string;
  description: string | null;
  order: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface SectionRow {
  id: string;
  chapter_id: string;
  parent_id: string | null;
  level: number;
  title: string;
  slug: string;
  order: number;
  keywords: string; // JSON array of keyword strings, e.g. '["CRM","quản trị"]'
}

export type BlockType = 'text' | 'image' | 'file';

export interface BlockRow {
  id: string;
  section_id: string;
  order: number;
  type: BlockType;
  text_md: string | null;
  r2_key: string | null;
  filename: string | null;
  mime: string | null;
  alt: string | null;
  caption: string | null;
}

// Nested shapes used by the reader and editor.
export interface SectionNode extends SectionRow {
  blocks: BlockRow[];
  children: SectionNode[];
}

export interface ChapterTree {
  chapter: ChapterRow;
  sections: SectionNode[];
}

function now(): string {
  return new Date().toISOString();
}

// ── Chapters ────────────────────────────────────────────────

export async function getChapter(db: D1Database, id: string): Promise<ChapterRow | null> {
  return db.prepare('SELECT * FROM "chapter" WHERE "id" = ?').bind(id).first<ChapterRow>();
}

export async function listChapters(db: D1Database): Promise<ChapterRow[]> {
  const { results } = await db
    .prepare('SELECT * FROM "chapter" ORDER BY "tier", "order"')
    .all<ChapterRow>();
  return results;
}

export async function listPublishedChapters(db: D1Database): Promise<ChapterRow[]> {
  const { results } = await db
    .prepare('SELECT * FROM "chapter" WHERE "status" = \'published\' ORDER BY "tier", "order"')
    .all<ChapterRow>();
  return results;
}

export interface ChapterInput {
  id: string;
  tier: number;
  chapter_no: number;
  title: string;
  description?: string | null;
  order: number;
  status?: 'draft' | 'published';
}

export async function upsertChapter(db: D1Database, input: ChapterInput): Promise<void> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "chapter" ("id","tier","chapter_no","title","description","order","status","createdAt","updatedAt")
       VALUES (?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "tier"=excluded."tier",
         "chapter_no"=excluded."chapter_no",
         "title"=excluded."title",
         "description"=excluded."description",
         "order"=excluded."order",
         "status"=excluded."status",
         "updatedAt"=excluded."updatedAt"`,
    )
    .bind(
      input.id,
      input.tier,
      input.chapter_no,
      input.title,
      input.description ?? null,
      input.order,
      input.status ?? 'draft',
      ts,
      ts,
    )
    .run();
}

export async function deleteChapter(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM "chapter" WHERE "id" = ?').bind(id).run();
}

// ── Sections ────────────────────────────────────────────────

export interface SectionInput {
  id: string;
  chapter_id: string;
  parent_id?: string | null;
  level: number;
  title: string;
  slug: string;
  order: number;
  keywords?: string; // JSON array of keyword strings
}

export async function upsertSection(db: D1Database, input: SectionInput): Promise<void> {
  const keywordsJson = input.keywords ?? '[]';
  await db
    .prepare(
      `INSERT INTO "section" ("id","chapter_id","parent_id","level","title","slug","order","keywords")
       VALUES (?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "parent_id"=excluded."parent_id",
         "level"=excluded."level",
         "title"=excluded."title",
         "slug"=excluded."slug",
         "order"=excluded."order",
         "keywords"=excluded."keywords"`,
    )
    .bind(
      input.id,
      input.chapter_id,
      input.parent_id ?? null,
      input.level,
      input.title,
      input.slug,
      input.order,
      keywordsJson,
    )
    .run();
}

export async function deleteSection(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM "section" WHERE "id" = ?').bind(id).run();
}

// ── Blocks ──────────────────────────────────────────────────

export interface BlockInput {
  id: string;
  section_id: string;
  order: number;
  type: BlockType;
  text_md?: string | null;
  r2_key?: string | null;
  filename?: string | null;
  mime?: string | null;
  alt?: string | null;
  caption?: string | null;
}

export async function upsertBlock(db: D1Database, input: BlockInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption")
       VALUES (?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "section_id"=excluded."section_id",
         "order"=excluded."order",
         "type"=excluded."type",
         "text_md"=excluded."text_md",
         "r2_key"=excluded."r2_key",
         "filename"=excluded."filename",
         "mime"=excluded."mime",
         "alt"=excluded."alt",
         "caption"=excluded."caption"`,
    )
    .bind(
      input.id,
      input.section_id,
      input.order,
      input.type,
      input.text_md ?? null,
      input.r2_key ?? null,
      input.filename ?? null,
      input.mime ?? null,
      input.alt ?? null,
      input.caption ?? null,
    )
    .run();
}

export async function getBlock(db: D1Database, id: string): Promise<BlockRow | null> {
  return db.prepare('SELECT * FROM "block" WHERE "id" = ?').bind(id).first<BlockRow>();
}

export async function deleteBlock(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM "block" WHERE "id" = ?').bind(id).run();
}

// ── Support settings ────────────────────────────────────────

export interface SupportSettings {
  id: number;
  enabled: number;
  title: string;
  message: string;
  qr_url: string;
  payment_methods: string;
  updatedAt: string;
}

export async function getSupportSettings(db: D1Database): Promise<SupportSettings | null> {
  return db.prepare('SELECT * FROM "support_settings" WHERE "id" = 1').first<SupportSettings>();
}

export async function upsertSupportSettings(
  db: D1Database,
  input: Partial<Omit<SupportSettings, 'id' | 'updatedAt'>>,
): Promise<void> {
  const ts = new Date().toISOString();
  const fields: string[] = ['"updatedAt" = ?'];
  const values: unknown[] = [ts];

  if ('enabled' in input && input.enabled !== undefined) {
    fields.push('"enabled" = ?');
    values.push(input.enabled);
  }
  if ('title' in input && input.title !== undefined) {
    fields.push('"title" = ?');
    values.push(input.title);
  }
  if ('message' in input && input.message !== undefined) {
    fields.push('"message" = ?');
    values.push(input.message);
  }
  if ('qr_url' in input && input.qr_url !== undefined) {
    fields.push('"qr_url" = ?');
    values.push(input.qr_url);
  }
  if ('payment_methods' in input && input.payment_methods !== undefined) {
    fields.push('"payment_methods" = ?');
    values.push(input.payment_methods);
  }

  await db
    .prepare(`UPDATE "support_settings" SET ${fields.join(', ')} WHERE "id" = 1`)
    .bind(...values)
    .run();
}

// ── Auto-keywords from headings ─────────────────────────────

export interface AutoKeyword {
  pattern: string;  // section title
  target: string;   // /book/{chapter_id}#{slug}
  label: string;
}

// In-memory cache: invalidated per request (Workers KV could be used for cross-instance persistence)
const _sectionCache = new Map<string, { data: AutoKeyword[]; ts: number }>();
const _SECTION_TTL_MS = 30_000; // 30 seconds — stale-while-revalidate

/**
 * Fetches all sections from published chapters.
 * Each section title becomes an auto-keyword linking to its chapter + anchor.
<<<<<<< Updated upstream
 * Custom keywords (comma-separated in DB) are also expanded into separate entries.
 * Result is cached in-memory for 30s to avoid repeated scans across chapter navigations.
 */
export async function listAllSections(db: D1Database): Promise<AutoKeyword[]> {
  const key = '__all_sections__';
  const cached = _sectionCache.get(key);
  if (cached && Date.now() - cached.ts < _SECTION_TTL_MS) {
    return cached.data;
  }

  const { results } = await db
    .prepare(
      `SELECT s."title", s."slug", s."level", s."keywords", c."id" as chapter_id
       FROM "section" s
       JOIN "chapter" c ON c."id" = s."chapter_id"
       WHERE c."status" = 'published'
       ORDER BY c."tier", c."order", s."order"`,
    )
    .all<{ title: string; slug: string; level: number; keywords: string; chapter_id: string }>();

  const data: AutoKeyword[] = [];

  for (const r of results) {
    const target = `/book/${r.chapter_id}#${r.slug}`;

    // Always add the section title as an auto-keyword
    data.push({ pattern: r.title, target, label: r.title });

    // Parse custom keywords (comma-separated string)
    if (r.keywords) {
      try {
        // Support both JSON array format and plain comma-separated format
        let parsed: string[];
        const trimmed = r.keywords.trim();
        if (trimmed.startsWith('[')) {
          parsed = JSON.parse(trimmed);
        } else {
          parsed = trimmed.split(',').map(s => s.trim()).filter(Boolean);
        }
        for (const kw of parsed) {
          if (kw && kw.toLowerCase() !== r.title.toLowerCase()) {
            data.push({ pattern: kw, target, label: kw });
          }
        }
      } catch {
        // If JSON parse fails, try comma-separated fallback
        const parts = r.keywords.split(',').map(s => s.trim()).filter(Boolean);
        for (const kw of parts) {
          if (kw && kw.toLowerCase() !== r.title.toLowerCase()) {
            data.push({ pattern: kw, target, label: kw });
          }
        }
      }
    }
  }

  _sectionCache.set(key, { data, ts: Date.now() });
  return data;
}

// ── Tree assembly ───────────────────────────────────────────

// Builds the full chapter -> sections -> blocks tree in 3 queries,
// then nests sections by parent_id. Used by both reader and editor.
export async function getChapterTree(db: D1Database, id: string): Promise<ChapterTree | null> {
  const chapter = await getChapter(db, id);
  if (!chapter) return null;

  const [{ results: sections }, { results: blocks }] = await Promise.all([
    db
      .prepare('SELECT * FROM "section" WHERE "chapter_id" = ? ORDER BY "order"')
      .bind(id)
      .all<SectionRow>(),
    db
      .prepare(
        `SELECT b.* FROM "block" b
         JOIN "section" s ON s."id" = b."section_id"
         WHERE s."chapter_id" = ?
         ORDER BY b."order"`,
      )
      .bind(id)
      .all<BlockRow>(),
  ]);

  const blocksBySection = new Map<string, BlockRow[]>();
  for (const b of blocks) {
    const arr = blocksBySection.get(b.section_id) ?? [];
    arr.push(b);
    blocksBySection.set(b.section_id, arr);
  }

  const nodes = new Map<string, SectionNode>();
  for (const s of sections) {
    nodes.set(s.id, { ...s, blocks: blocksBySection.get(s.id) ?? [], children: [] });
  }

  const roots: SectionNode[] = [];
  for (const s of sections) {
    const node = nodes.get(s.id)!;
    if (s.parent_id && nodes.has(s.parent_id)) {
      nodes.get(s.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return { chapter, sections: roots };
}

// ── Tier Stats (for homepage) ─────────────────────────────

export interface TierStats {
  chapterCount: number;
  sectionCount: number;
}

export async function getTierStats(db: D1Database, tier: number): Promise<TierStats> {
  const chapterRow = await db
    .prepare('SELECT COUNT(*) as cnt FROM "chapter" WHERE "tier" = ? AND "status" = ?')
    .bind(tier, 'published')
    .first<{ cnt: number }>();

  const sectionRow = await db
    .prepare(
      `SELECT COUNT(*) as cnt
       FROM "section" s
       JOIN "chapter" c ON c."id" = s."chapter_id"
       WHERE c."tier" = ? AND c."status" = 'published'`,
    )
    .bind(tier)
    .first<{ cnt: number }>();

  return {
    chapterCount: chapterRow?.cnt ?? 0,
    sectionCount: sectionRow?.cnt ?? 0,
  };
}
