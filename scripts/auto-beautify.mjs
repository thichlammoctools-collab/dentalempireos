import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';
const CHAPTER = process.argv[2];
if (!CHAPTER) { console.error('Usage: auto-beautify.mjs <chapter-id>'); process.exit(1); }

function runSQL(sql) {
  const res = execSync(
    `npx wrangler d1 execute ${DB} --remote --command "${sql.replace(/"/g, '\\"')}" --json`,
    { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
  );
  return JSON.parse(res)[0]?.results || [];
}

function runSQLFile(sql, _label) {
  const tmpFile = join(tmpdir(), `ab_${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);
  try {
    execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
    return true;
  } catch (e) {
    try {
      execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
      return true;
    } catch (e2) {
      console.log(`  ⚠ Batch failed: ${e2.message.substring(0, 60)}`);
      return false;
    }
  } finally { try { unlinkSync(tmpFile); } catch {} }
}

function beautify(text) {
  if (!text) return null;
  let t = text;
  let changed = false;

  // 1. Clean escaped chars
  const orig = t;
  t = t.replace(/\\\./g, '.');
  t = t.replace(/\\-/g, '-');
  t = t.replace(/\\\(/g, '(');
  t = t.replace(/\\\)/g, ')');
  t = t.replace(/\\"/g, '"');

  // 2. Normalize whitespace
  t = t.replace(/[ \t]+$/gm, '');
  t = t.replace(/\n{3,}/g, '\n\n');

  // 3. Blockquote patterns
  t = t.replace(/^(Lưu ý\s*:?)\s*\n/gim, '> **Lưu ý:**\n\n');
  t = t.replace(/^(Ghi chú\s*:?)\s*\n/gim, '> **Ghi chú:**\n\n');
  t = t.replace(/^(Chú ý\s*:?)\s*\n/gim, '> **Chú ý:**\n\n');
  t = t.replace(/^(Cảnh báo\s*:?)\s*\n/gim, '> **Cảnh báo:**\n\n');

  // 4. Fix doubled headings: "AnchorAnchor là..." → "### Anchor\n\nAnchor là..."
  t = t.replace(/^([A-Z][a-zA-Z]+)\1\s+/m, (_m, word) => `### ${word}\n\n${word} `);

  // 5. Fix merged bold heading: "**Anchor**Anchor là..." → "### Anchor\n\nAnchor là..."
  t = t.replace(/^\*\*([^*]{2,30})\*\*\s*\1\s/m, (_m, word) => `### ${word}\n\n${word} `);

  // 6. Standalone heading blocks (short, <60 chars, starts with **word** or **word**)
  if (t.length < 60) {
    const headingMatch = t.match(/^\*\*([^*]+)\*\*\s*$/);
    if (headingMatch) {
      t = `### ${headingMatch[1]}`;
    }
    // Standalone italic heading
    const italicMatch = t.match(/^\*([^*]+)\*\s*$/);
    if (italicMatch) {
      t = `*${italicMatch[1]}*`;
    }
  }

  // 7. Bullet lists: ensure "- " prefix, fix "*item*" italic pattern
  t = t.replace(/^- \*([^\*]+)\*\s/gm, '- **$1** ');
  t = t.replace(/^(\d+)\.\s*\*([^\*]+)\*\s/gm, '$1. **$2** ');

  // 8. Long paragraph split (but preserve headings, lists, blockquotes)
  if (t.length > 300 && !t.includes('\n###') && !t.includes('\n-') && !t.startsWith('>')) {
    const sentences = t.match(/[^.!?]+[.!?]+\s*/g);
    if (sentences && sentences.length >= 3) {
      const groups = [];
      let cur = [];
      let cc = 0;
      for (const s of sentences) {
        cur.push(s);
        cc += s.length;
        if (cc > 200) { groups.push(cur.join('').trim()); cur = []; cc = 0; }
      }
      if (cur.length) groups.push(cur.join('').trim());
      if (groups.length > 1) {
        t = groups.join('\n\n');
      }
    }
  }

  // 9. Final cleanup
  t = t.replace(/\n{3,}/g, '\n\n');
  t = t.trim();

  if (t !== orig.trim()) { changed = true; return { text: t, changed }; }
  return null;
}

// Fetch all blocks
console.log(`Fetching blocks for ${CHAPTER}...`);
const blocks = runSQL(
  `SELECT b.id, b.[order], b.text_md FROM block b JOIN section s ON b.section_id = s.id WHERE s.chapter_id = '${CHAPTER}' AND b.type = 'text' ORDER BY b.[order]`
);
console.log(`Fetched ${blocks.length} blocks`);

// Process
const updates = [];
for (const blk of blocks) {
  const result = beautify(blk.text_md);
  if (result) {
    updates.push({ id: blk.id, order: blk.order, text: result.text.replace(/'/g, "''") });
  }
}

console.log(`Need to update ${updates.length} blocks (${Math.round(updates.length/blocks.length*100)}%)`);

if (updates.length === 0) {
  console.log('Nothing to update, done!');
  process.exit(0);
}

// Batch update
const BATCH = 12;
let done = 0;
for (let i = 0; i < updates.length; i += BATCH) {
  const batch = updates.slice(i, i + BATCH);
  const sqls = batch.map(u => `UPDATE "block" SET "text_md" = '${u.text}' WHERE "id" = '${u.id}';`);
  const ok = runSQLFile(sqls.join('\n'));
  if (ok) {
    done += batch.length;
    process.stdout.write(`\r  Updating: ${done}/${updates.length}`);
  }
  // Small delay to avoid rate limit
  if (i + BATCH < updates.length) {
    execSync('sleep 1');
  }
}

console.log(`\n✓ Chapter ${CHAPTER} auto-beautified: ${updates.length} blocks updated`);
