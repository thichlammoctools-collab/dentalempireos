globalThis.process ??= {};
globalThis.process.env ??= {};
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
async function getCategory(db, id) {
  return db.prepare('SELECT * FROM "blog_category" WHERE "id" = ?').bind(id).first();
}
async function getCategoryBySlug(db, slug) {
  return db.prepare('SELECT * FROM "blog_category" WHERE "slug" = ?').bind(slug).first();
}
async function listCategories(db) {
  const { results } = await db.prepare('SELECT * FROM "blog_category" ORDER BY "parent_id" IS NOT NULL, "parent_id", "sort_order", "name"').all();
  return results;
}
function buildCategoryTree(flat) {
  const roots = flat.filter((c) => !c.parent_id);
  return roots.map((root) => {
    const children = flat.filter((c) => c.parent_id === root.id).map((c) => ({ ...c, children: [], total_post_count: c.post_count }));
    const total_post_count = root.post_count + children.reduce((sum, c) => sum + c.post_count, 0);
    return { ...root, children, total_post_count };
  });
}
function flattenCategoryTree(tree) {
  const out = [];
  for (const node of tree) {
    out.push({ ...node, indent: 0 });
    for (const child of node.children) {
      out.push({ ...child, indent: 1 });
    }
  }
  return out;
}
async function upsertCategory(db, input) {
  const ts = now();
  await db.prepare(
    `INSERT INTO "blog_category" ("id","name","slug","description","icon","color","sort_order","parent_id","post_count","created_at")
       VALUES (?,?,?,?,?,?,?,NULLIF(?, ''),0,?)
       ON CONFLICT("id") DO UPDATE SET
         "name"=excluded."name",
         "slug"=excluded."slug",
         "description"=excluded."description",
         "icon"=excluded."icon",
         "color"=excluded."color",
         "sort_order"=excluded."sort_order",
         "parent_id"=excluded."parent_id"`
  ).bind(
    input.id,
    input.name,
    input.slug,
    input.description ?? "",
    input.icon ?? "folder",
    input.color ?? "#0d9488",
    input.sort_order ?? 0,
    input.parent_id ?? null,
    ts
  ).run();
  await recalcCategoryCounts(db);
}
async function deleteCategory(db, id) {
  await db.prepare('DELETE FROM "blog_category" WHERE "id" = ?').bind(id).run();
  await recalcCategoryCounts(db);
}
async function reorderCategories(db, parentId, ids) {
  if (ids.length === 0) return;
  await db.batch(
    ids.map(
      (id, index) => db.prepare(
        `UPDATE "blog_category" SET "sort_order" = ?, "parent_id" = ? WHERE "id" = ?`
      ).bind(index, parentId, id)
    )
  );
}
async function moveCategory(db, id, parentId) {
  await db.prepare(`UPDATE "blog_category" SET "parent_id" = ? WHERE "id" = ?`).bind(parentId, id).run();
  await recalcCategoryCounts(db);
}
async function getTag(db, id) {
  return db.prepare('SELECT * FROM "blog_tag" WHERE "id" = ?').bind(id).first();
}
async function getTagBySlug(db, slug) {
  return db.prepare('SELECT * FROM "blog_tag" WHERE "slug" = ?').bind(slug).first();
}
async function listTags(db) {
  const { results } = await db.prepare('SELECT * FROM "blog_tag" ORDER BY "post_count" DESC, "name"').all();
  return results;
}
async function upsertTag(db, input) {
  const ts = now();
  await db.prepare(
    `INSERT INTO "blog_tag" ("id","name","slug","post_count","created_at")
       VALUES (?,?,?,0,?)
       ON CONFLICT("id") DO UPDATE SET
         "name"=excluded."name",
         "slug"=excluded."slug"`
  ).bind(input.id, input.name, input.slug, ts).run();
  await recalcTagCounts(db);
}
async function deleteTag(db, id) {
  await db.prepare('DELETE FROM "blog_tag" WHERE "id" = ?').bind(id).run();
  await recalcTagCounts(db);
}
async function getPost(db, slug) {
  const post = await db.prepare(`SELECT * FROM "blog_post" WHERE "slug" = ? AND "status" = 'published'`).bind(slug).first();
  if (!post) return null;
  const [category, tags, readLog] = await Promise.all([
    post.category_id ? getCategory(db, post.category_id) : Promise.resolve(null),
    getPostTags(db, post.id),
    Promise.resolve([])
  ]);
  return { ...post, category: category ?? void 0, tags };
}
async function getPostById(db, id) {
  const post = await db.prepare('SELECT * FROM "blog_post" WHERE "id" = ?').bind(id).first();
  if (!post) return null;
  const [category, tags] = await Promise.all([
    post.category_id ? getCategory(db, post.category_id) : Promise.resolve(null),
    getPostTags(db, post.id)
  ]);
  return { ...post, category: category ?? void 0, tags };
}
async function listPosts(db, opts = {}) {
  const { limit = 12, offset = 0, categoryId, tagId, search, sort = "recent" } = opts;
  const conditions = [`"status" = 'published'`];
  const binds = [];
  if (categoryId) {
    conditions.push('"category_id" = ?');
    binds.push(categoryId);
  }
  if (search) {
    conditions.push('("title" LIKE ? OR "description" LIKE ?)');
    binds.push(`%${search}%`, `%${search}%`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const totalResult = await db.prepare(`SELECT COUNT(*) as count FROM "blog_post" ${where}`).bind(...binds).first();
  const total = totalResult?.count ?? 0;
  let order;
  if (sort === "popular") order = '"view_count" DESC, "published_at" DESC';
  else if (sort === "featured") order = '"is_featured" DESC, "published_at" DESC';
  else order = '"is_pinned" DESC, "published_at" DESC';
  let query;
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
  const { results: rows } = await db.prepare(query).bind(...binds).all();
  const posts = await enrichPosts(db, rows);
  return { posts, total };
}
async function getFeaturedPosts(db, limit = 4) {
  const { results } = await db.prepare(
    `SELECT * FROM "blog_post"
       WHERE "status" = 'published' AND "is_featured" = 1
       ORDER BY "is_pinned" DESC, "published_at" DESC
       LIMIT ?`
  ).bind(limit).all();
  return enrichPosts(db, results);
}
async function getPopularPosts(db, limit = 5) {
  const { results } = await db.prepare(
    `SELECT * FROM "blog_post"
       WHERE "status" = 'published'
       ORDER BY "view_count" DESC, "published_at" DESC
       LIMIT ?`
  ).bind(limit).all();
  return enrichPosts(db, results);
}
async function getPinnedPosts(db, limit = 3) {
  const { results } = await db.prepare(
    `SELECT * FROM "blog_post"
       WHERE "status" = 'published' AND "is_pinned" = 1
       ORDER BY "published_at" DESC
       LIMIT ?`
  ).bind(limit).all();
  return enrichPosts(db, results);
}
async function getRelatedPosts(db, postId, categoryId, limit = 4) {
  let rows = [];
  if (categoryId) {
    ({ results: rows } = await db.prepare(
      `SELECT * FROM "blog_post"
         WHERE "status" = 'published' AND "id" != ? AND "category_id" = ?
         ORDER BY "published_at" DESC LIMIT ?`
    ).bind(postId, categoryId, limit).all());
  }
  if (!rows || rows.length < limit) {
    const remaining = categoryId ? limit - rows.length : limit;
    const exclude = categoryId ? [postId, ...rows.map((r) => r.id)] : [postId];
    const placeholders = exclude.map(() => "?").join(",");
    const { results: more } = await db.prepare(
      `SELECT * FROM "blog_post"
         WHERE "status" = 'published' AND "id" NOT IN (${placeholders})
         ORDER BY "published_at" DESC LIMIT ?`
    ).bind(...exclude, remaining).all();
    rows = rows ? [...rows, ...more] : more;
  }
  return enrichPosts(db, rows ?? []);
}
async function upsertPost(db, input) {
  const ts = now();
  const readTime = input.content_md ? Math.max(1, Math.ceil(wordCount(input.content_md) / 200)) : 3;
  const publishedAt = input.status === "published" && !input.published_at ? ts : input.published_at ?? null;
  await db.prepare(
    `INSERT INTO "blog_post" (
         "id","title","slug","description","content_md","cover_url","cover_alt",
         "category_id","author_name","status","is_featured","is_pinned","is_recommended",
         "read_time_minutes","published_at","chapter_id","scanner_id","created_at","updated_at"
       )
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
         "chapter_id"=excluded."chapter_id",
         "scanner_id"=excluded."scanner_id",
         "updated_at"=excluded."updated_at"`
  ).bind(
    input.id,
    input.title,
    input.slug,
    input.description ?? "",
    input.content_md ?? "",
    input.cover_url ?? "",
    input.cover_alt ?? "",
    input.category_id ?? null,
    input.author_name ?? "Dental Empire",
    input.status ?? "draft",
    input.is_featured ? 1 : 0,
    input.is_pinned ? 1 : 0,
    input.is_recommended ? 1 : 0,
    readTime,
    publishedAt,
    input.chapter_id ?? null,
    input.scanner_id ?? null,
    ts,
    ts,
    readTime
  ).run();
  await recalcCategoryCounts(db);
}
async function deletePost(db, id) {
  await db.prepare('DELETE FROM "blog_post" WHERE "id" = ?').bind(id).run();
  await recalcCategoryCounts(db);
  await recalcTagCounts(db);
}
async function incrementViewCount(db, id) {
  await db.prepare('UPDATE "blog_post" SET "view_count" = "view_count" + 1 WHERE "id" = ?').bind(id).run();
}
async function getPostTags(db, postId) {
  const { results } = await db.prepare(
    `SELECT t.* FROM "blog_tag" t
       JOIN "blog_post_tag" pt ON pt."tag_id" = t."id"
       WHERE pt."post_id" = ?
       ORDER BY t."name"`
  ).bind(postId).all();
  return results;
}
async function setPostTags(db, postId, tagIds) {
  await db.prepare('DELETE FROM "blog_post_tag" WHERE "post_id" = ?').bind(postId).run();
  for (const tagId of tagIds) {
    await db.prepare(
      'INSERT OR IGNORE INTO "blog_post_tag" ("post_id","tag_id") VALUES (?,?)'
    ).bind(postId, tagId).run();
  }
  await recalcTagCounts(db);
}
async function getBlocksByPostId(db, postId) {
  const { results } = await db.prepare('SELECT * FROM "blog_block" WHERE "post_id" = ? ORDER BY "sort_order"').bind(postId).all();
  return results;
}
async function upsertBlock(db, input) {
  const ts = now();
  await db.prepare(
    `INSERT INTO "blog_block" ("id","post_id","type","content","sort_order","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "type"=excluded."type",
         "content"=excluded."content",
         "sort_order"=excluded."sort_order",
         "updated_at"=excluded."updated_at"`
  ).bind(
    input.id,
    input.post_id,
    input.type,
    input.content,
    input.sort_order ?? 0,
    ts,
    ts
  ).run();
}
async function deleteBlock(db, id) {
  await db.prepare('DELETE FROM "blog_block" WHERE "id" = ?').bind(id).run();
}
async function reorderBlocks(db, postId, orderedIds) {
  const ts = now();
  for (let i = 0; i < orderedIds.length; i++) {
    await db.prepare('UPDATE "blog_block" SET "sort_order" = ?, "updated_at" = ? WHERE "id" = ? AND "post_id" = ?').bind(i, ts, orderedIds[i], postId).run();
  }
}
async function upsertBlocks(db, postId, blocks) {
  await db.prepare('DELETE FROM "blog_block" WHERE "post_id" = ?').bind(postId).run();
  const ts = now();
  for (const block of blocks) {
    await db.prepare(
      `INSERT INTO "blog_block" ("id","post_id","type","content","sort_order","created_at","updated_at")
         VALUES (?,?,?,?,?,?,?)`
    ).bind(block.id, postId, block.type, block.content, block.sort_order ?? 0, ts, ts).run();
  }
}
async function markAsRead(db, postId, visitorId) {
  const id = `${postId}:${visitorId}`;
  await db.prepare(
    `INSERT OR IGNORE INTO "blog_read_log" ("id","post_id","visitor_id","read_at")
       VALUES (?,?,?,?)`
  ).bind(id, postId, visitorId, now()).run();
}
async function getReadPosts(db, visitorId) {
  const { results } = await db.prepare('SELECT "post_id" FROM "blog_read_log" WHERE "visitor_id" = ?').bind(visitorId).all();
  return results.map((r) => r.post_id);
}
async function enrichPosts(db, posts) {
  if (!posts.length) return [];
  const cats = await listCategories(db);
  const catMap = new Map(cats.map((c) => [c.id, c]));
  const allTagRows = [];
  for (const p of posts) {
    const tags = await getPostTags(db, p.id);
    tags.forEach((t) => allTagRows.push({ post_id: p.id, tag: t }));
  }
  const tagMap = /* @__PURE__ */ new Map();
  for (const { post_id, tag } of allTagRows) {
    const arr = tagMap.get(post_id) ?? [];
    arr.push(tag);
    tagMap.set(post_id, arr);
  }
  return posts.map((p) => ({
    ...p,
    category: p.category_id ? catMap.get(p.category_id) : void 0,
    tags: tagMap.get(p.id) ?? []
  }));
}
async function recalcCategoryCounts(db) {
  await db.prepare(
    `UPDATE "blog_category"
       SET "post_count" = (
         SELECT COUNT(*) FROM "blog_post"
         WHERE "category_id" = "blog_category"."id" AND "status" = 'published'
       )`
  ).run();
}
async function recalcTagCounts(db) {
  await db.prepare(
    `UPDATE "blog_tag"
       SET "post_count" = (
         SELECT COUNT(*) FROM "blog_post_tag"
         WHERE "tag_id" = "blog_tag"."id"
       )`
  ).run();
}
export {
  buildCategoryTree,
  deleteBlock,
  deleteCategory,
  deletePost,
  deleteTag,
  flattenCategoryTree,
  getBlocksByPostId,
  listCategories as getCategories,
  getCategory,
  getCategoryBySlug,
  getFeaturedPosts,
  getPinnedPosts,
  getPopularPosts,
  getPost,
  getPostById,
  getReadPosts,
  getRelatedPosts,
  getTag,
  getTagBySlug,
  listTags as getTags,
  incrementViewCount,
  listCategories,
  listPosts,
  listTags,
  markAsRead,
  moveCategory,
  reorderBlocks,
  reorderCategories,
  setPostTags,
  upsertBlock,
  upsertBlocks,
  upsertCategory,
  upsertPost,
  upsertTag
};
