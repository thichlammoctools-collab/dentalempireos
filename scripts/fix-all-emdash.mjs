import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';

function runSQL(sql) {
  const res = execSync(
    `npx wrangler d1 execute ${DB} --remote --command "${sql.replace(/"/g, '\\"')}" --json`,
    { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
  );
  return JSON.parse(res)[0]?.results || [];
}

function runSQLFile(sql) {
  const tmpFile = join(tmpdir(), `aem_${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);
  try {
    execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
    return true;
  } catch (e) {
    try {
      execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
      return true;
    } catch { return false; }
  } finally { try { unlinkSync(tmpFile); } catch {} }
}

// 1. Fix ALL section titles with em-dash
const sections = runSQL(`SELECT id, title FROM section WHERE title LIKE '%—%' OR title LIKE '%–%'`);
console.log(`Sections with dash: ${sections.length}`);
for (const s of sections) {
  const newTitle = s.title.replace(/\s+—\s+/g, ': ').replace(/\s+–\s+/g, ': ');
  if (newTitle === s.title) continue;
  const sql = `UPDATE "section" SET "title" = '${newTitle.replace(/'/g, "''")}' WHERE "id" = '${s.id}';`;
  const tmpFile = join(tmpdir(), `aem_${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);
  try {
    execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
    console.log(`  ✓ Section: ${s.title.substring(0, 50)}...`);
  } finally { try { unlinkSync(tmpFile); } catch {} }
}

// 2. Fix chapter titles with em-dash
const chapters = runSQL(`SELECT id, title FROM chapter WHERE title LIKE '%—%' OR title LIKE '%–%'`);
console.log(`Chapters with dash: ${chapters.length}`);
for (const c of chapters) {
  const newTitle = c.title.replace(/\s+—\s+/g, ': ').replace(/\s+–\s+/g, ': ');
  if (newTitle === c.title) continue;
  const sql = `UPDATE "chapter" SET "title" = '${newTitle.replace(/'/g, "''")}' WHERE "id" = '${c.id}';`;
  const tmpFile = join(tmpdir(), `aem_${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);
  try {
    execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
    console.log(`  ✓ Chapter: ${c.title.substring(0, 50)}...`);
  } finally { try { unlinkSync(tmpFile); } catch {} }
}

// 3. Fix block text: replace em-dash with colon only in specific patterns
// "Letter — WORD" pattern (A — ALIGN, D — DEEPEN, etc.)
const blocks = runSQL(`SELECT id, text_md FROM block WHERE type = 'text' AND (text_md LIKE '%—%' OR text_md LIKE '%–%')`);
console.log(`Blocks with dash: ${blocks.length}`);
let blockCount = 0;
const updates = [];
for (const b of blocks) {
  let t = b.text_md;
  const orig = t;
  // 1. "Word — Word" at start of bullet: "A — ALIGN" → "A: ALIGN"
  t = t.replace(/\b([A-Z])\s+—\s+/g, '$1: ');
  // 2. "FULLCAPS — text" → "FULLCAPS: text"
  t = t.replace(/([A-Z]{3,})\s+—\s+/g, '$1: ');
  // 3. General: "text — text" → "text: text" (replace ALL em-dashes)
  t = t.replace(/\s+—\s+/g, ': ');
  // 4. Also fix en-dash (–)
  t = t.replace(/\s+–\s+/g, ': ');
  if (t !== orig) {
    updates.push({ id: b.id, text: t.replace(/'/g, "''") });
  }
}

console.log(`Blocks to update: ${updates.length}`);
const BATCH = 12;
for (let i = 0; i < updates.length; i += BATCH) {
  const batch = updates.slice(i, i + BATCH);
  const sqls = batch.map(u => `UPDATE "block" SET "text_md" = '${u.text}' WHERE "id" = '${u.id}';`);
  runSQLFile(sqls.join('\n'));
  blockCount += batch.length;
  if (i + BATCH < updates.length) execSync('sleep 1');
}

console.log(`\n✓ Done: ${sections.length + chapters.length} titles + ${updates.length} blocks fixed`);
