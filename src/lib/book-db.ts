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
}

export async function upsertSection(db: D1Database, input: SectionInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO "section" ("id","chapter_id","parent_id","level","title","slug","order")
       VALUES (?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "parent_id"=excluded."parent_id",
         "level"=excluded."level",
         "title"=excluded."title",
         "slug"=excluded."slug",
         "order"=excluded."order"`,
    )
    .bind(
      input.id,
      input.chapter_id,
      input.parent_id ?? null,
      input.level,
      input.title,
      input.slug,
      input.order,
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
