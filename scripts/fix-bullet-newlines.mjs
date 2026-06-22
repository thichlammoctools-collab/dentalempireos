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
  const tmpFile = join(tmpdir(), `fb_${Date.now()}.sql`);
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

function fixBullets(text) {
  if (!text) return null;
  const orig = text;

  // Pattern 1: "- item1.- item2." or "- item1- item2"
  // Split on "- " that are NOT at line start (i.e. missing newline before -)
  // Matches: "something.- something" or "something- something"
  let t = text;

  // Fix: after ".-" add newline before "- "
  t = t.replace(/\.\s*- ([A-Z*])/g, '.\n- $1');

  // Fix: after ").- " add newline
  t = t.replace(/\)\s*- ([A-Z*])/g, ')\n- $1');

  // Fix: after a word followed by "- " when it should be a new bullet
  // Pattern: "content without period at line end" followed by "- " on same line
  // Split any "- " that appears mid-line (not at start of line)
  // But only when preceded by non-newline text
  t = t.replace(/([^\n])- ([A-Z*])/g, (m, pre, letter) => {
    // Only split if we're not already at line start
    if (pre === '\n' || pre === '\r') return m;
    // Don't split inside words or after =
    if (/[=\-]/.test(pre)) return m;
    return `${pre}\n- ${letter}`;
  });

  // Fix numbered lists too: "1. item1. 2. item2." → split
  t = t.replace(/(\S)\.\s+(\d+)\.\s+/g, '$1.\n$2. ');
  t = t.replace(/(\S)\.(\d+)\.\s+/g, '$1.\n$2. ');

  // Fix "**Bold** content- **Bold** content" pattern
  t = t.replace(/(\S)\.\s*-\s*\*\*/g, '$1.\n- **');

  // Normalize triple+ newlines
  t = t.replace(/\n{3,}/g, '\n\n');

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
    if (!blk.text_md) continue;
    // Only process blocks that likely have squished bullets
    if (!blk.text_md.match(/- [^\n]+- /) && !blk.text_md.match(/\.\s*-\s/)) continue;
    const fixed = fixBullets(blk.text_md);
    if (fixed) {
      updates.push({ id: blk.id, text: fixed.replace(/'/g, "''") });
    }
  }
  if (updates.length === 0) continue;

  console.log(`  ${ch}: ${updates.length} blocks with bullet fixes`);
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

console.log(`\n✓ Done: ${totalUpdated} blocks bullet newlines fixed`);
