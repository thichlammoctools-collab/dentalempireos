// Data access layer for blog posts stored in D1.

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content_md: string;
  cover_url: string;
  cover_alt: string;
  category_id: string | null;
  author_name: string;
  status: 'draft' | 'published';
  is_featured: number;
  is_pinned: number;
  is_recommended: number;
  read_time_minutes: number;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  post_count: number;
  parent_id: string | null;
  created_at: string;
}

// Category enriched with its children (for tree rendering) and aggregated count
export interface BlogCategoryNode extends BlogCategory {
  children: BlogCategoryNode[];
  total_post_count: number; // own posts + all descendants' posts
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  post_count: number;
  created_at: string;
}

export interface BlogPostWithMeta extends BlogPost {
  category?: BlogCategory;
  tags: BlogTag[];
  is_read?: boolean;
}

export interface BlogPostInput {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content_md?: string;
  cover_url?: string;
  cover_alt?: string;
  category_id?: string | null;
  author_name?: string;
  status?: 'draft' | 'published';
  is_featured?: boolean;
  is_pinned?: boolean;
  is_recommended?: boolean;
  published_at?: string | null;
}

export interface BlogCategoryInput {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  parent_id?: string | null;
}

export interface BlogTagInput {
  id: string;
  name: string;
  slug: string;
}

function now(): string {
  return new Date().toISOString();
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── Category ────────────────────────────────────────────────

export async function getCategory(db: D1Database, id: string): Promise<BlogCategory | null> {
  return db.prepare('SELECT * FROM "blog_category" WHERE "id" = ?').bind(id).first<BlogCategory>();
}

export async function getCategoryBySlug(db: D1Database, slug: string): Promise<BlogCategory | null> {
  return db.prepare('SELECT * FROM "blog_category" WHERE "slug" = ?').bind(slug).first<BlogCategory>();
}

// Alias for convenience
export { listCategories as getCategories };

export async function listCategories(db: D1Database): Promise<BlogCategory[]> {
  const { results } = await db
    .prepare('SELECT * FROM "blog_category" ORDER BY "parent_id" IS NOT NULL, "parent_id", "sort_order", "name"')
    .all<BlogCategory>();
  return results;
}

// Build a 2-level tree (parent → children) from the flat category list.
// total_post_count aggregates a parent's own posts with all its children's posts.
export function buildCategoryTree(flat: BlogCategory[]): BlogCategoryNode[] {
  const roots = flat.filter((c) => !c.parent_id);
  return roots.map((root) => {
    const children = flat
      .filter((c) => c.parent_id === root.id)
      .map((c) => ({ ...c, children: [], total_post_count: c.post_count }));
    const total_post_count = root.post_count + children.reduce((sum, c) => sum + c.post_count, 0);
    return { ...root, children, total_post_count };
  });
}

// Flatten a category tree back into an indented flat list for <select> dropdowns.
// Each entry gets an indent level (0 = root, 1 = child).
export function flattenCategoryTree(
  tree: BlogCategoryNode[],
): Array<BlogCategory & { indent: number }> {
  const out: Array<BlogCategory & { indent: number }> = [];
  for (const node of tree) {
    out.push({ ...node, indent: 0 });
    for (const child of node.children) {
      out.push({ ...child, indent: 1 });
    }
  }
  return out;
}

export async function upsertCategory(db: D1Database, input: BlogCategoryInput): Promise<void> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "blog_category" ("id","name","slug","description","icon","color","sort_order","parent_id","post_count","created_at")
       VALUES (?,?,?,?,?,?,?,NULLIF(?, ''),0,?)
       ON CONFLICT("id") DO UPDATE SET
         "name"=excluded."name",
         "slug"=excluded."slug",
         "description"=excluded."description",
         "icon"=excluded."icon",
         "color"=excluded."color",
         "sort_order"=excluded."sort_order",
         "parent_id"=excluded."parent_id"`,
    )
    .bind(
      input.id,
      input.name,
      input.slug,
      input.description ?? '',
      input.icon ?? 'folder',
      input.color ?? '#0d9488',
      input.sort_order ?? 0,
      input.parent_id ?? null,
      ts,
    )
    .run();
  await recalcCategoryCounts(db);
}

export async function deleteCategory(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM "blog_category" WHERE "id" = ?').bind(id).run();
  await recalcCategoryCounts(db);
}

// Reorder sibling categories under the same parent by writing sort_order = array index.
// parentId null means top-level (root) categories.
export async function reorderCategories(
  db: D1Database,
  parentId: string | null,
  ids: string[],
): Promise<void> {
  if (ids.length === 0) return;
  await db.batch(
    ids.map((id, index) =>
      db
        .prepare(
          `UPDATE "blog_category" SET "sort_order" = ?, "parent_id" = ? WHERE "id" = ?`,
        )
        .bind(index, parentId, id),
    ),
  );
}

// Move a category to a new parent (or to root if parentId is null).
export async function moveCategory(
  db: D1Database,
  id: string,
  parentId: string | null,
): Promise<void> {
  await db
    .prepare(`UPDATE "blog_category" SET "parent_id" = ? WHERE "id" = ?`)
    .bind(parentId, id)
    .run();
  await recalcCategoryCounts(db);
}

// ── Tag ──────────────────────────────────────────────────────

export async function getTag(db: D1Database, id: string): Promise<BlogTag | null> {
  return db.prepare('SELECT * FROM "blog_tag" WHERE "id" = ?').bind(id).first<BlogTag>();
}

export async function getTagBySlug(db: D1Database, slug: string): Promise<BlogTag | null> {
  return db.prepare('SELECT * FROM "blog_tag" WHERE "slug" = ?').bind(slug).first<BlogTag>();
}

// Alias for convenience
export { listTags as getTags };

export async function listTags(db: D1Database): Promise<BlogTag[]> {
  const { results } = await db
    .prepare('SELECT * FROM "blog_tag" ORDER BY "post_count" DESC, "name"')
    .all<BlogTag>();
  return results;
}

export async function upsertTag(db: D1Database, input: BlogTagInput): Promise<void> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "blog_tag" ("id","name","slug","post_count","created_at")
       VALUES (?,?,?,0,?)
       ON CONFLICT("id") DO UPDATE SET
         "name"=excluded."name",
         "slug"=excluded."slug"`,
    )
    .bind(input.id, input.name, input.slug, ts)
    .run();
  await recalcTagCounts(db);
}

export async function deleteTag(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM "blog_tag" WHERE "id" = ?').bind(id).run();
  await recalcTagCounts(db);
}

// ── Post ─────────────────────────────────────────────────────

export async function getPost(db: D1Database, slug: string): Promise<BlogPostWithMeta | null> {
  const post = await db
    .prepare('SELECT * FROM "blog_post" WHERE "slug" = ? AND "status" = \'published\'')
    .bind(slug)
    .first<BlogPost>();

  if (!post) return null;

  const [category, tags, readLog] = await Promise.all([
    post.category_id
      ? getCategory(db, post.category_id)
      : Promise.resolve(null),
    getPostTags(db, post.id),
    Promise.resolve([] as BlogTag[]),
  ]);

  return { ...post, category: category ?? undefined, tags };
}

export async function getPostById(db: D1Database, id: string): Promise<BlogPostWithMeta | null> {
  const post = await db.prepare('SELECT * FROM "blog_post" WHERE "id" = ?').bind(id).first<BlogPost>();
  if (!post) return null;

  const [category, tags] = await Promise.all([
    post.category_id ? getCategory(db, post.category_id) : Promise.resolve(null),
    getPostTags(db, post.id),
  ]);

  return { ...post, category: category ?? undefined, tags };
}

export async function listPosts(
  db: D1Database,
  opts: {
    limit?: number;
    offset?: number;
    categoryId?: string;
    tagId?: string;
    search?: string;
    sort?: 'recent' | 'popular' | 'featured';
  } = {},
): Promise<{ posts: BlogPostWithMeta[]; total: number }> {
  const { limit = 12, offset = 0, categoryId, tagId, search, sort = 'recent' } = opts;

  const conditions: string[] = ['"status" = \'published\''];
  const binds: unknown[] = [];

  if (categoryId) {
    conditions.push('"category_id" = ?');
    binds.push(categoryId);
  }
  if (search) {
    conditions.push('("title" LIKE ? OR "description" LIKE ?)');
    binds.push(`%${search}%`, `%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Total
  const { count: total } = await db
    .prepare(`SELECT COUNT(*) as count FROM "blog_post" ${where}`)
    .bind(...binds)
    .first<{ count: number }>();

  // Order
  let order: string;
  if (sort === 'popular') order = '"view_count" DESC, "published_at" DESC';
  else if (sort === 'featured') order = '"is_featured" DESC, "published_at" DESC';
  else order = '"is_pinned" DESC, "published_at" DESC';

  // If filtering by tag, join
  let query: string;
  if (tagId) {
    query = `
      SELECT p.* FROM "blog_post" p
      JOIN "blog_post_tag" pt ON pt."post_id" = p."id"
      ${where}
      AND pt."tag_id" = ?
      ORDER BY ${order}
      LIMIT ? OFFSET ?
    `;
    binds.push(tagId, limit, offset);
  } else {
    query = `
      SELECT p.* FROM "blog_post" p
      ${where}
      ORDER BY ${order}
      LIMIT ? OFFSET ?
    `;
    binds.push(limit, offset);
  }

  const { results: rows } = await db.prepare(query).bind(...binds).all<BlogPost>();

  const posts = await enrichPosts(db, rows);
  return { posts, total };
}

export async function getFeaturedPosts(
  db: D1Database,
  limit = 4,
): Promise<BlogPostWithMeta[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM "blog_post"
       WHERE "status" = 'published' AND "is_featured" = 1
       ORDER BY "is_pinned" DESC, "published_at" DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all<BlogPost>();

  return enrichPosts(db, results);
}

export async function getPopularPosts(
  db: D1Database,
  limit = 5,
): Promise<BlogPostWithMeta[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM "blog_post"
       WHERE "status" = 'published'
       ORDER BY "view_count" DESC, "published_at" DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all<BlogPost>();

  return enrichPosts(db, results);
}

export async function getPinnedPosts(
  db: D1Database,
  limit = 3,
): Promise<BlogPostWithMeta[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM "blog_post"
       WHERE "status" = 'published' AND "is_pinned" = 1
       ORDER BY "published_at" DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all<BlogPost>();

  return enrichPosts(db, results);
}

export async function getRelatedPosts(
  db: D1Database,
  postId: string,
  categoryId: string | null,
  limit = 4,
): Promise<BlogPostWithMeta[]> {
  let rows: BlogPost[];

  if (categoryId) {
    ({ results: rows } = await db
      .prepare(
        `SELECT * FROM "blog_post"
         WHERE "status" = 'published' AND "id" != ? AND "category_id" = ?
         ORDER BY "published_at" DESC LIMIT ?`,
      )
      .bind(postId, categoryId, limit)
      .all<BlogPost>());
  }

  if (!rows || rows.length < limit) {
    const remaining = categoryId ? limit - rows.length : limit;
    const exclude = categoryId ? [postId, ...rows.map((r) => r.id)] : [postId];
    const placeholders = exclude.map(() => '?').join(',');
    const { results: more } = await db
      .prepare(
        `SELECT * FROM "blog_post"
         WHERE "status" = 'published' AND "id" NOT IN (${placeholders})
         ORDER BY "published_at" DESC LIMIT ?`,
      )
      .bind(...exclude, remaining)
      .all<BlogPost>();

    rows = rows ? [...rows, ...more] : more;
  }

  return enrichPosts(db, rows ?? []);
}

export async function upsertPost(db: D1Database, input: BlogPostInput): Promise<void> {
  const ts = now();
  const readTime = input.content_md
    ? Math.max(1, Math.ceil(wordCount(input.content_md) / 200))
    : 3;

  const publishedAt =
    input.status === 'published' && !input.published_at
      ? ts
      : input.published_at ?? null;

  // NOTE: placeholder count MUST match the number of bind args below.
  // INSERT VALUES = 17, ON CONFLICT read_time = 1 → 18 total.
  // published_at on conflict preserves the existing row value, so no bind needed.
  await db
    .prepare(
      `INSERT INTO "blog_post" (
         "id","title","slug","description","content_md","cover_url","cover_alt",
         "category_id","author_name","status","is_featured","is_pinned","is_recommended",
         "read_time_minutes","published_at","created_at","updated_at"
       )
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "title"=excluded."title",
         "slug"=excluded."slug",
         "description"=excluded."description",
         "content_md"=excluded."content_md",
         "cover_url"=excluded."cover_url",
         "cover_alt"=excluded."cover_alt",
         "category_id"=excluded."category_id",
         "author_name"=excluded."author_name",
         "status"=excluded."status",
         "is_featured"=excluded."is_featured",
         "is_pinned"=excluded."is_pinned",
         "is_recommended"=excluded."is_recommended",
         "read_time_minutes"=?,
         "published_at"=COALESCE("blog_post"."published_at", excluded."published_at"),
         "updated_at"=excluded."updated_at"`,
    )
    .bind(
      input.id,
      input.title,
      input.slug,
      input.description ?? '',
      input.content_md ?? '',
      input.cover_url ?? '',
      input.cover_alt ?? '',
      input.category_id ?? null,
      input.author_name ?? 'Dental Empire',
      input.status ?? 'draft',
      input.is_featured ? 1 : 0,
      input.is_pinned ? 1 : 0,
      input.is_recommended ? 1 : 0,
      readTime,
      publishedAt,
      ts,
      ts,
      readTime,
    )
    .run();

  await recalcCategoryCounts(db);
}

export async function deletePost(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM "blog_post" WHERE "id" = ?').bind(id).run();
  await recalcCategoryCounts(db);
  await recalcTagCounts(db);
}

export async function incrementViewCount(db: D1Database, id: string): Promise<void> {
  await db
    .prepare('UPDATE "blog_post" SET "view_count" = "view_count" + 1 WHERE "id" = ?')
    .bind(id)
    .run();
}

// ── Tags on post ─────────────────────────────────────────────

async function getPostTags(db: D1Database, postId: string): Promise<BlogTag[]> {
  const { results } = await db
    .prepare(
      `SELECT t.* FROM "blog_tag" t
       JOIN "blog_post_tag" pt ON pt."tag_id" = t."id"
       WHERE pt."post_id" = ?
       ORDER BY t."name"`,
    )
    .bind(postId)
    .all<BlogTag>();
  return results;
}

export async function setPostTags(
  db: D1Database,
  postId: string,
  tagIds: string[],
): Promise<void> {
  await db.prepare('DELETE FROM "blog_post_tag" WHERE "post_id" = ?').bind(postId).run();
  for (const tagId of tagIds) {
    await db
      .prepare(
        'INSERT OR IGNORE INTO "blog_post_tag" ("post_id","tag_id") VALUES (?,?)',
      )
      .bind(postId, tagId)
      .run();
  }
  await recalcTagCounts(db);
}

// ── Block ───────────────────────────────────────────────────

export interface BlogBlock {
  id: string;
  post_id: string;
  type: 'text' | 'image' | 'form' | 'rich';
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogBlockInput {
  id: string;
  post_id: string;
  type: 'text' | 'image' | 'form' | 'rich';
  content: string;
  sort_order?: number;
}

export async function getBlocksByPostId(db: D1Database, postId: string): Promise<BlogBlock[]> {
  const { results } = await db
    .prepare('SELECT * FROM "blog_block" WHERE "post_id" = ? ORDER BY "sort_order"')
    .bind(postId)
    .all<BlogBlock>();
  return results;
}

export async function upsertBlock(db: D1Database, input: BlogBlockInput): Promise<void> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "blog_block" ("id","post_id","type","content","sort_order","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "type"=excluded."type",
         "content"=excluded."content",
         "sort_order"=excluded."sort_order",
         "updated_at"=excluded."updated_at"`,
    )
    .bind(
      input.id,
      input.post_id,
      input.type,
      input.content,
      input.sort_order ?? 0,
      ts,
      ts,
    )
    .run();
}

export async function deleteBlock(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM "blog_block" WHERE "id" = ?').bind(id).run();
}

export async function reorderBlocks(db: D1Database, postId: string, orderedIds: string[]): Promise<void> {
  const ts = now();
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .prepare('UPDATE "blog_block" SET "sort_order" = ?, "updated_at" = ? WHERE "id" = ? AND "post_id" = ?')
      .bind(i, ts, orderedIds[i], postId)
      .run();
  }
}

export async function upsertBlocks(
  db: D1Database,
  postId: string,
  blocks: Omit<BlogBlockInput, 'post_id'>[],
): Promise<void> {
  await db.prepare('DELETE FROM "blog_block" WHERE "post_id" = ?').bind(postId).run();
  const ts = now();
  for (const block of blocks) {
    await db
      .prepare(
        `INSERT INTO "blog_block" ("id","post_id","type","content","sort_order","created_at","updated_at")
         VALUES (?,?,?,?,?,?,?)`,
      )
      .bind(block.id, postId, block.type, block.content, block.sort_order ?? 0, ts, ts)
      .run();
  }
}

// ── Read log ────────────────────────────────────────────────

export async function markAsRead(
  db: D1Database,
  postId: string,
  visitorId: string,
): Promise<void> {
  const id = `${postId}:${visitorId}`;
  await db
    .prepare(
      `INSERT OR IGNORE INTO "blog_read_log" ("id","post_id","visitor_id","read_at")
       VALUES (?,?,?,?)`,
    )
    .bind(id, postId, visitorId, now())
    .run();
}

export async function getReadPosts(
  db: D1Database,
  visitorId: string,
): Promise<string[]> {
  const { results } = await db
    .prepare('SELECT "post_id" FROM "blog_read_log" WHERE "visitor_id" = ?')
    .bind(visitorId)
    .all<{ post_id: string }>();
  return results.map((r) => r.post_id);
}

// ── Helpers ─────────────────────────────────────────────────

async function enrichPosts(
  db: D1Database,
  posts: BlogPost[],
): Promise<BlogPostWithMeta[]> {
  if (!posts.length) return [];

  const cats = await listCategories(db);
  const catMap = new Map(cats.map((c) => [c.id, c]));

  const allTagRows: Array<{ post_id: string; tag: BlogTag }> = [];
  for (const p of posts) {
    const tags = await getPostTags(db, p.id);
    tags.forEach((t) => allTagRows.push({ post_id: p.id, tag: t }));
  }
  const tagMap = new Map<string, BlogTag[]>();
  for (const { post_id, tag } of allTagRows) {
    const arr = tagMap.get(post_id) ?? [];
    arr.push(tag);
    tagMap.set(post_id, arr);
  }

  return posts.map((p) => ({
    ...p,
    category: p.category_id ? catMap.get(p.category_id) : undefined,
    tags: tagMap.get(p.id) ?? [],
  }));
}

async function recalcCategoryCounts(db: D1Database): Promise<void> {
  // First: count direct published posts on each category.
  await db
    .prepare(
      `UPDATE "blog_category"
       SET "post_count" = (
         SELECT COUNT(*) FROM "blog_post"
         WHERE "category_id" = "blog_category"."id" AND "status" = 'published'
       )`,
    )
    .run();
}

async function recalcTagCounts(db: D1Database): Promise<void> {
  await db
    .prepare(
      `UPDATE "blog_tag"
       SET "post_count" = (
         SELECT COUNT(*) FROM "blog_post_tag"
         WHERE "tag_id" = "blog_tag"."id"
       )`,
    )
    .run();
}
