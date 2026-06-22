import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB_NAME = 'dentalempireos-db';
const CHAPTER = process.argv[2];

if (!CHAPTER) {
  console.error('Usage: node batch-beautify.mjs <chapter-id>');
  process.exit(1);
}

function runSQLCommand(sql) {
  const result = execSync(
    `npx wrangler d1 execute ${DB_NAME} --remote --command "${sql}" --json`,
    { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
  );
  return JSON.parse(result);
}

function runSQLFile(sql, label) {
  const tmpFile = join(tmpdir(), `b_${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);
  try {
    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --file "${tmpFile}"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    if (label) process.stdout.write(`[${label}] `);
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

function b(text) {
  if (!text) return text;
  let t = text;

  t = t.replace(/\\\\\\\./g, '.');
  t = t.replace(/\\\\\\-/g, '-');
  t = t.replace(/\\\\\\\(/g, '(');
  t = t.replace(/\\\\\\\)/g, ')');
  t = t.replace(/\\\\\\"/g, '"');
  t = t.replace(/\\\\ /g, ' ');

  t = t.replace(/[ \t]+$/gm, '');
  t = t.replace(/\n{3,}/g, '\n\n');

  t = t.replace(/^(Lưu ý\s*:?)\s*\n/gim, '> **Lưu ý:**\n\n');
  t = t.replace(/^(Tóm tắt\s*:?)\s*\n/gim, '> **Tóm tắt:**\n\n');
  t = t.replace(/^(Chú ý\s*:?)\s*\n/gim, '> **Chú ý:**\n\n');
  t = t.replace(/^(Ghi chú\s*:?)\s*\n/gim, '> **Ghi chú:**\n\n');
  t = t.replace(/^(Cảnh báo\s*:?)\s*\n/gim, '> **Cảnh báo:**\n\n');

  const BOLD_TERMS = [
    'Dental Empire OS', 'R.O.A.D.M.A.P', 'S.T.A.R.S', 'SKY',
    'ROOTS', 'ONE LIGHT', 'AWAKEN', 'DEEPEN', 'MATURE', 'ALIGN', 'PROSPER',
    'Patient Experience', 'Patient Journey', 'Patient Journey Map',
    'Referral', 'Testimonial', 'CRM', 'KPI', 'OKR', 'CEO', 'COO', 'CFO', 'CMO',
    'Operating Code', 'Radicle', 'Outreach', 'Tenacity',
    'Standardized Statement', 'Mantra', 'Core Values', 'Core Value',
    'Bản sắc', 'Quy luật', 'Nguyên lý', 'Nguyên tắc', 'Quan niệm', 'Tâm thái',
    'Khí chất', 'Biên độ cắm rễ',
    'Clinic OS', 'Patient OS', 'Referral OS', 'People OS', 'Finance OS', 'Data OS',
    'Marketing OS', 'Sales OS', 'Strategy OS', 'Empire OS',
    'Growth Engine', 'Revenue Engine', 'Referral Ecosystem',
    'Patient Community', 'Education Product',
    'MROI', 'ARPU', 'LTV', 'CAC', 'NPS', 'CSAT',
    'USP', 'ROI', 'MVP', 'P&L', 'EBITDA', 'MRR', 'ARR',
    'B2B', 'B2C', 'SaaS', 'CRM',
  ];

  for (const term of BOLD_TERMS) {
    const re = new RegExp(`(?<!\\*\\*)\\b(${escapeRegex(term)})\\b(?!\\*\\*)`, 'g');
    t = t.replace(re, `**${term}**`);
  }

  t = t.replace(/(\n- [^\n]+(?:\n(?!\n)[^\n-][^\n]*)*)/g, (m) => {
    const lines = m.trim().split('\n');
    return '\n' + lines.map(l => l.trim()).filter(l => l).join('\n') + '\n';
  });

  t = t.replace(/\n{1}([-*#]) /g, '\n\n$1 ');
  t = t.replace(/ ([-\d.]+) $/g, ' $1 ');

  t = t.replace(/^([^*#>][^\n]{250,})\n/gm, (m, p) => {
    const sentences = p.match(/[^.!?]+[.!?]+\s*/g) || [p];
    if (sentences.length < 3) return m;
    const groups = [];
    let cur = [];
    let cc = 0;
    for (const s of sentences) {
      cur.push(s);
      cc += s.length;
      if (cc > 180) { groups.push(cur.join('').trim()); cur = []; cc = 0; }
    }
    if (cur.length) groups.push(cur.join('').trim());
    return groups.join('\n\n') + '\n';
  });

  t = t.replace(/\n{3,}/g, '\n\n');
  return t.trim();
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

console.log(`Fetching blocks for ${CHAPTER}...`);
const result = runSQLCommand(
  `SELECT b.id, b.[order], b.text_md FROM block b JOIN section s ON b.section_id = s.id WHERE s.chapter_id = '${CHAPTER}' AND b.type = 'text' ORDER BY b.[order]`
);
const blocks = result[0]?.results || [];
console.log(`Fetched ${blocks.length} text blocks`);

const updates = [];
for (const blk of blocks) {
  if (!blk.text_md) continue;
  const beautified = b(blk.text_md);
  if (beautified === blk.text_md) continue;
  const esc = beautified.replace(/'/g, "''");
  updates.push({ id: blk.id, text: esc });
}

console.log(`Need to update ${updates.length} blocks`);

if (updates.length === 0) {
  console.log('Nothing to update, done!');
  process.exit(0);
}

const BATCH = 15;
for (let i = 0; i < updates.length; i += BATCH) {
  const batch = updates.slice(i, i + BATCH);
  const sqls = batch.map(u => `UPDATE "block" SET "text_md" = '${u.text}' WHERE "id" = '${u.id}';`);
  const multi = sqls.join('\n');
  runSQLFile(multi, `${Math.floor(i / BATCH) + 1}/${Math.ceil(updates.length / BATCH)}`);
  console.log(`Updated batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(updates.length / BATCH)} (${batch.length} blocks)`);
}

console.log(`\n✓ Chapter ${CHAPTER} DONE: ${updates.length} blocks beautified`);
