globalThis.process ??= {};
globalThis.process.env ??= {};
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
async function getChapter(db, id) {
  return db.prepare('SELECT * FROM "chapter" WHERE "id" = ?').bind(id).first();
}
async function listChapters(db) {
  const { results } = await db.prepare('SELECT * FROM "chapter" ORDER BY "tier", "order"').all();
  return results;
}
async function listPublishedChapters(db) {
  const { results } = await db.prepare(`SELECT * FROM "chapter" WHERE "status" = 'published' ORDER BY "tier", "order"`).all();
  return results;
}
async function upsertChapter(db, input) {
  const ts = now();
  await db.prepare(
    `INSERT INTO "chapter" ("id","tier","chapter_no","title","description","order","status","createdAt","updatedAt")
       VALUES (?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "tier"=excluded."tier",
         "chapter_no"=excluded."chapter_no",
         "title"=excluded."title",
         "description"=excluded."description",
         "order"=excluded."order",
         "status"=excluded."status",
         "updatedAt"=excluded."updatedAt"`
  ).bind(
    input.id,
    input.tier,
    input.chapter_no,
    input.title,
    input.description ?? null,
    input.order,
    input.status ?? "draft",
    ts,
    ts
  ).run();
}
async function deleteChapter(db, id) {
  await db.prepare('DELETE FROM "chapter" WHERE "id" = ?').bind(id).run();
}
async function upsertSection(db, input) {
  const keywordsJson = input.keywords ?? "[]";
  await db.prepare(
    `INSERT INTO "section" ("id","chapter_id","parent_id","level","title","slug","order","keywords")
       VALUES (?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "parent_id"=excluded."parent_id",
         "level"=excluded."level",
         "title"=excluded."title",
         "slug"=excluded."slug",
         "order"=excluded."order",
         "keywords"=excluded."keywords"`
  ).bind(
    input.id,
    input.chapter_id,
    input.parent_id ?? null,
    input.level,
    input.title,
    input.slug,
    input.order,
    keywordsJson
  ).run();
}
async function deleteSection(db, id) {
  await db.prepare('DELETE FROM "section" WHERE "id" = ?').bind(id).run();
}
async function upsertBlock(db, input) {
  await db.prepare(
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
         "caption"=excluded."caption"`
  ).bind(
    input.id,
    input.section_id,
    input.order,
    input.type,
    input.text_md ?? null,
    input.r2_key ?? null,
    input.filename ?? null,
    input.mime ?? null,
    input.alt ?? null,
    input.caption ?? null
  ).run();
}
async function getBlock(db, id) {
  return db.prepare('SELECT * FROM "block" WHERE "id" = ?').bind(id).first();
}
async function deleteBlock(db, id) {
  await db.prepare('DELETE FROM "block" WHERE "id" = ?').bind(id).run();
}
async function getSupportSettings(db) {
  return db.prepare('SELECT * FROM "support_settings" WHERE "id" = 1').first();
}
async function upsertSupportSettings(db, input) {
  const ts = (/* @__PURE__ */ new Date()).toISOString();
  const fields = ['"updatedAt" = ?'];
  const values = [ts];
  if ("enabled" in input && input.enabled !== void 0) {
    fields.push('"enabled" = ?');
    values.push(input.enabled);
  }
  if ("title" in input && input.title !== void 0) {
    fields.push('"title" = ?');
    values.push(input.title);
  }
  if ("message" in input && input.message !== void 0) {
    fields.push('"message" = ?');
    values.push(input.message);
  }
  if ("qr_url" in input && input.qr_url !== void 0) {
    fields.push('"qr_url" = ?');
    values.push(input.qr_url);
  }
  if ("payment_methods" in input && input.payment_methods !== void 0) {
    fields.push('"payment_methods" = ?');
    values.push(input.payment_methods);
  }
  await db.prepare(`UPDATE "support_settings" SET ${fields.join(", ")} WHERE "id" = 1`).bind(...values).run();
}
const _sectionCache = /* @__PURE__ */ new Map();
const _SECTION_TTL_MS = 3e4;
async function listAllSections(db) {
  const key = "__all_sections__";
  const cached = _sectionCache.get(key);
  if (cached && Date.now() - cached.ts < _SECTION_TTL_MS) {
    return cached.data;
  }
  const { results } = await db.prepare(
    `SELECT s."title", s."slug", s."level", s."keywords", c."id" as chapter_id
       FROM "section" s
       JOIN "chapter" c ON c."id" = s."chapter_id"
       WHERE c."status" = 'published'
       ORDER BY c."tier", c."order", s."order"`
  ).all();
  const data = [];
  for (const r of results) {
    const target = `/book/${r.chapter_id}#${r.slug}`;
    data.push({ pattern: r.title, target, label: r.title });
    if (r.keywords) {
      try {
        let parsed;
        const trimmed = r.keywords.trim();
        if (trimmed.startsWith("[")) {
          parsed = JSON.parse(trimmed);
        } else {
          parsed = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
        }
        for (const kw of parsed) {
          if (kw && kw.toLowerCase() !== r.title.toLowerCase()) {
            data.push({ pattern: kw, target, label: kw });
          }
        }
      } catch {
        const parts = r.keywords.split(",").map((s) => s.trim()).filter(Boolean);
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
async function getChapterTree(db, id) {
  const chapter = await getChapter(db, id);
  if (!chapter) return null;
  const [{ results: sections }, { results: blocks }] = await Promise.all([
    db.prepare('SELECT * FROM "section" WHERE "chapter_id" = ? ORDER BY "order"').bind(id).all(),
    db.prepare(
      `SELECT b.* FROM "block" b
         JOIN "section" s ON s."id" = b."section_id"
         WHERE s."chapter_id" = ?
         ORDER BY b."order"`
    ).bind(id).all()
  ]);
  const blocksBySection = /* @__PURE__ */ new Map();
  for (const b of blocks) {
    const arr = blocksBySection.get(b.section_id) ?? [];
    arr.push(b);
    blocksBySection.set(b.section_id, arr);
  }
  const nodes = /* @__PURE__ */ new Map();
  for (const s of sections) {
    nodes.set(s.id, { ...s, blocks: blocksBySection.get(s.id) ?? [], children: [] });
  }
  const roots = [];
  for (const s of sections) {
    const node = nodes.get(s.id);
    if (s.parent_id && nodes.has(s.parent_id)) {
      nodes.get(s.parent_id).children.push(node);
    } else {
      roots.push(node);
    }
  }
  return { chapter, sections: roots };
}
async function getTierStats(db, tier) {
  const chapterRow = await db.prepare('SELECT COUNT(*) as cnt FROM "chapter" WHERE "tier" = ? AND "status" = ?').bind(tier, "published").first();
  const sectionRow = await db.prepare(
    `SELECT COUNT(*) as cnt
       FROM "section" s
       JOIN "chapter" c ON c."id" = s."chapter_id"
       WHERE c."tier" = ? AND c."status" = 'published'`
  ).bind(tier).first();
  return {
    chapterCount: chapterRow?.cnt ?? 0,
    sectionCount: sectionRow?.cnt ?? 0
  };
}
async function getChaptersByRefs(db, refs) {
  if (!refs || refs.length === 0) return [];
  const chapterNos = refs.map((r) => {
    const m = r.match(/^Ch\.\s*(\d+)$/i);
    return m ? parseInt(m[1], 10) : null;
  }).filter((n) => n !== null);
  if (chapterNos.length === 0) return [];
  const placeholders = chapterNos.map(() => "?").join(",");
  const { results } = await db.prepare(
    `SELECT * FROM "chapter"
       WHERE "chapter_no" IN (${placeholders}) AND "status" = 'published'
       ORDER BY "tier", "order"`
  ).bind(...chapterNos).all();
  return results ?? [];
}
async function getChapterExcerpt(db, chapterId, maxChars = 280) {
  const { results } = await db.prepare(
    `SELECT b."text_md" FROM "block" b
       JOIN "section" s ON s."id" = b."section_id"
       WHERE s."chapter_id" = ? AND b."type" = 'text' AND b."text_md" IS NOT NULL
       ORDER BY s."order", b."order"
       LIMIT 1`
  ).bind(chapterId).all();
  const text = results?.[0]?.text_md;
  if (!text) return null;
  const plain = text.replace(/[*_#`[\]()]/g, "").replace(/!\[.*?\]\(.*?\)/g, "").replace(/\[([^\]]+)\]\(.*?\)/g, "$1").replace(/\n+/g, " ").trim();
  return plain.length > maxChars ? plain.slice(0, maxChars - 3) + "..." : plain;
}
export {
  getBlock as a,
  deleteChapter as b,
  getChapterTree as c,
  deleteBlock as d,
  upsertChapter as e,
  deleteSection as f,
  getSupportSettings as g,
  upsertSection as h,
  upsertSupportSettings as i,
  getChapter as j,
  listPublishedChapters as k,
  listChapters as l,
  getTierStats as m,
  getChaptersByRefs as n,
  getChapterExcerpt as o,
  listAllSections as p,
  upsertBlock as u
};
