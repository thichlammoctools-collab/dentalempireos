import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';
const CHAPTERS = [
  '01-trien-khai-he-thong','02-quan-tri-nhan-su','03-roadmap-to-be-sky',
  '04-ky-nang-ca-nhan','05-ung-dung-roadmap','06-stars-luong-thuong',
  '07-phu-luc','08-mo-tang-empire-u-plus','chuong-8-buc-tranh-toan-canh-empire-ux',
  '09-doanh-nghiep-pmap','10-personal-brand','11-media-network',
  '12-clinic-system','13-growth-engine','14-trust-assets',
  '15-customer-journey','16-patient-experience','17-referral-ecosystem',
  '18-patient-community','19-education-product','20-dental-os-flywheel',
  '21-ket-tang-2','22-empire-os','23-strategy-os',
  '24-marketing-os','25-sales-os','26-clinic-os',
  '27-patient-os','28-referral-os','29-people-os',
  '30-finance-os','31-data-os','32-ket-tang-3'
];

function runSQL(sql) {
  const res = execSync(
    `npx wrangler d1 execute ${DB} --remote --command "${sql.replace(/"/g, '\\"')}" --json`,
    { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
  );
  return JSON.parse(res)[0]?.results || [];
}

function runSQLFile(sql) {
  const tmpFile = join(tmpdir(), `ed_${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);
  try {
    execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
    return true;
  } catch (e) {
    try {
      execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
      return true;
    } catch (e2) {
      console.log(`  ⚠ Failed: ${e2.message.substring(0, 80)}`);
      return false;
    }
  } finally { try { unlinkSync(tmpFile); } catch {} }
}

function fixEmdash(text) {
  if (!text) return null;
  const orig = text;
  let t = text;

  // Pattern: "Letter — WORD" (A — ALIGN, D — DEEPEN, P — PROSPER)
  // Convert to "Letter: WORD" (A: ALIGN)
  t = t.replace(/([A-Z])\s+—\s+/g, '$1: ');

  // Pattern: "— keyword" at start of bullet item after letter
  // e.g., "- A — ALIGN" → "- A: ALIGN"
  // Already handled above

  // Pattern: sentence — sentence (em dash as punctuation in prose)
  // Convert "word — word" to "word: word" only in specific contexts
  // e.g., "tăng trưởng — không phải" → keep as is (legitimate use)
  // Only fix when em dash is between short phrases that look like AI artifacts
  // Pattern: "(Word) — (" → "(Word): ("
  t = t.replace(/\)\s+—\s+\(/g, '): (');

  // Pattern: "Content: — Content" → "Content: Content"
  t = t.replace(/:\s*—\s+/g, ': ');

  // Pattern: "word — word" where both are short (< 15 chars) → "word: word"
  // This is aggressive, only for clearly AI-ish patterns
  t = t.replace(/(\b[A-Z][a-z]{2,14}\b)\s+—\s+(\b[A-Z][a-z]{2,14}\b)/g, '$1: $2');

  // Clean up double spaces
  t = t.replace(/  +/g, ' ');

  t = t.trim();
  if (t === orig.trim()) return null;
  return t;
}

let totalUpdated = 0;
for (const ch of CHAPTERS) {
  const blocks = runSQL(
    `SELECT b.id, b.text_md FROM block b JOIN section s ON b.section_id = s.id WHERE s.chapter_id = '${ch}' AND b.type = 'text'`
  );
  const updates = [];
  for (const blk of blocks) {
    if (!blk.text_md || !blk.text_md.includes('—')) continue;
    const fixed = fixEmdash(blk.text_md);
    if (fixed) {
      updates.push({ id: blk.id, text: fixed.replace(/'/g, "''") });
    }
  }
  if (updates.length === 0) continue;

  console.log(`  ${ch}: ${updates.length} blocks with em-dash fixes`);
  const BATCH = 12;
  let done = 0;
  for (let i = 0; i < updates.length; i += BATCH) {
    const batch = updates.slice(i, i + BATCH);
    const sqls = batch.map(u => `UPDATE "block" SET "text_md" = '${u.text}' WHERE "id" = '${u.id}';`);
    const ok = runSQLFile(sqls.join('\n'));
    if (ok) done += batch.length;
    if (i + BATCH < updates.length) execSync('sleep 1');
  }
  totalUpdated += updates.length;
}

console.log(`\n✓ Done: ${totalUpdated} blocks em-dash fixed`);
