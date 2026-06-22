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
  const tmpFile = join(tmpdir(), `ed2_${Date.now()}.sql`);
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

  // 1. "Letter — WORD" pattern (A — ALIGN, D — DEEPEN, P — PROSPER, etc.)
  // Only single uppercase letter before dash
  t = t.replace(/\b([A-Z])\s+—\s+/g, '$1: ');

  // 2. "Content —" at line start in bullet items
  // "- A — ALIGN" → "- A: ALIGN" (already handled above since it's in bullet)

  // 3. Section title patterns: "MODULE 3: X — Y" → "MODULE 3: X"
  // Keep the colon pattern but remove em-dash
  t = t.replace(/:\s*([A-Z][A-Z\s]+)\s+—\s+/g, ': ');

  // 4. Double dash "--" → remove (common AI artifact)
  t = t.replace(/--/g, '');

  // 5. Pattern: "Keyword — explanation" where Keyword is ALL CAPS
  // e.g., "CUSTOMER JOURNEY — hành trình" → "CUSTOMER JOURNEY: hành trình"
  t = t.replace(/([A-Z]{3,})\s+—\s+/g, '$1: ');

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
    if (!blk.text_md || !blk.text_md.includes('—') && !blk.text_md.includes('--')) continue;
    const fixed = fixEmdash(blk.text_md);
    if (fixed) {
      updates.push({ id: blk.id, text: fixed.replace(/'/g, "''") });
    }
  }
  if (updates.length === 0) continue;

  console.log(`  ${ch}: ${updates.length} blocks`);
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

console.log(`\n✓ Done: ${totalUpdated} blocks fixed`);
