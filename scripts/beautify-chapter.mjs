#!/usr/bin/env node
/**
 * One-off script to beautify markdown blocks for a chapter.
 *
 * Usage: node scripts/beautify-chapter.mjs [chapter-id]
 * Default: 01-trien-khai-he-thong
 */

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CHAPTER_ID = process.argv[2] || '01-trien-khai-he-thong';
const DB_NAME = 'dentalempireos-db';

// ── Bold terms (domain-specific) ─────────────────────
const BOLD_TERMS = [
  'Patient Experience', 'Referral', 'Testimonial', 'CRM',
  'Dental Empire OS',
  'R\\.O\\.A\\.D\\.M\\.A\\.P', 'S\\.T\\.A\\.R\\.S',
  'TO BE SKY', 'SKY',
  'ROOTS', 'ONE LIGHT', 'AWAKEN', 'DEEPEN', 'MATURE', 'ALIGN', 'PROSPER',
  'Skills', 'Traits', 'Actions', 'Results', 'Synergy',
  'Sincerity', 'Kindness', 'Yielding', 'KPI',
  'Handbook', 'Onboarding', 'Mentoring', 'CSKH',
];

// ── Beautify function ────────────────────────────────
function beautifyMarkdown(text) {
  let t = text;

  // 1. Clean escaped characters
  t = t.replace(/\\([.\-()])/g, '$1');
  t = t.replace(/\\"/g, '"');
  t = t.replace(/\\\n/g, '\n');
  t = t.replace(/\\{2,}\s*$/gm, '');

  // 2. Normalize whitespace
  t = t.replace(/[ \t]+$/gm, '');
  t = t.replace(/\n{3,}/g, '\n\n');

  // 3. Blockquote for "Lưu note"
  t = t.replace(/^(Lưu ý\s*:\s*)\n/gm, '> **Lưu ý:**\n\n');

  // 4. Bold domain-specific terms (skip if already bold)
  for (const term of BOLD_TERMS) {
    const plain = term.replace(/\\\./g, '.').replace(/\\-/g, '-');
    const regex = new RegExp(`(?<!\\*\\*)${term}(?!\\*\\*)`, 'g');
    t = t.replace(regex, `**${plain}**`);
  }

  // 5. Numbered lists normalization
  t = t.replace(/(?:^|\n)((?:\d+\.\s+[^\n]+(?:\n(?!\n)[^\n]+)*)+)/gm, (_match, list) => {
    let idx = 0;
    return '\n' + list.split('\n').map(l => {
      const trimmed = l.trim();
      if (/^\d+\.\s/.test(trimmed)) {
        idx++;
        return `${idx}. ${trimmed.replace(/^\d+\.\s*/, '')}`;
      }
      return trimmed;
    }).join('\n') + '\n';
  });

  // 6. Final cleanup
  t = t.replace(/\n{3,}/g, '\n\n');
  t = t.trim();
  return t;
}

// ── Wrangler helpers ──────────────────────────────────
function runSQLCommand(sql) {
  // --command for SELECT queries (returns results as JSON)
  // Escape double quotes for shell
  const escaped = sql.replace(/"/g, '\\"');
  const result = execSync(
    `npx wrangler d1 execute ${DB_NAME} --remote --command "${escaped}" --json`,
    { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
  );
  return JSON.parse(result);
}

function runSQLFile(sql) {
  // --file for UPDATE/INSERT (no results returned, just success)
  const tmpFile = join(tmpdir(), `beautify_${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);
  try {
    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --file ${tmpFile}`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

// ── Main ──────────────────────────────────────────────
async function main() {
  console.log(`\n✨ Beautifying chapter: ${CHAPTER_ID}\n`);

  // Fetch all text blocks using --command (returns JSON results)
  const selectSql = `SELECT b.id, b.text_md FROM block b JOIN section s ON b.section_id = s.id WHERE s.chapter_id = '${CHAPTER_ID}' AND b.type = 'text' ORDER BY b.[order]`;
  let blocks = [];
  try {
    const result = runSQLCommand(selectSql);
    blocks = result[0]?.results || [];
  } catch (err) {
    console.error('Query failed:', err.message);
    process.exit(1);
  }

  console.log(`Found ${blocks.length} text blocks\n`);

  let changed = 0;
  for (const block of blocks) {
    if (!block.text_md) continue;
    const beautified = beautifyMarkdown(block.text_md);
    if (beautified === block.text_md) {
      console.log(`  Block ${block.id.substring(0, 8)}... — unchanged`);
      continue;
    }
    const preview = beautified.substring(0, 80).replace(/\n/g, '↵');
    console.log(`  Block ${block.id.substring(0, 8)}... — ${block.text_md.length} → ${beautified.length} chars`);
    console.log(`    "${preview}..."`);

    // Update block — escape single quotes for SQL
    const escaped = beautified.replace(/'/g, "''");
    const updateSql = `UPDATE "block" SET "text_md" = '${escaped}' WHERE "id" = '${block.id}'`;
    try {
      runSQLFile(updateSql);
      changed++;
    } catch (err) {
      console.error(`  ❌ Block ${block.id.substring(0, 8)}: update failed — ${err.message}`);
    }
  }

  console.log(`\n✅ Done! ${changed}/${blocks.length} blocks beautified.\n`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
