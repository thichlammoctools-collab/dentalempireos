import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';
const CHAPTER = process.argv[2];

// Fetch all text blocks
const result = execSync(
  `npx wrangler d1 execute ${DB} --remote --command "SELECT b.id, b.[order], s.title as section_title, LENGTH(b.text_md) as len, SUBSTR(b.text_md, 1, 80) as preview FROM block b JOIN section s ON b.section_id = s.id WHERE s.chapter_id = '${CHAPTER}' AND b.type = 'text' ORDER BY b.[order]" --json`,
  { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
);
const data = JSON.parse(result);
const blocks = data[0]?.results || [];

console.log(`Analyzing ${blocks.length} blocks for heading issues...\n`);

// Detect heading+content merge issues
const issues = [];
for (const blk of blocks) {
  const text = blk.text_md || '';
  if (text.length < 10) continue;

  // Check if text starts with a word repeated twice (e.g., "AnchorAnchor")
  const match = text.match(/^([A-Z][a-z]+)\1/);
  if (match) {
    issues.push({
      id: blk.id,
      order: blk.order,
      type: 'doubled_heading',
      preview: text.substring(0, 80),
      heading: match[1]
    });
    continue;
  }

  // Check if starts with **Heading**Content (no line break)
  const boldMatch = text.match(/^\*\*([^*]+)\*\*(.+)/);
  if (boldMatch && boldMatch[1].length < 30 && boldMatch[2].trim().length > 20) {
    const heading = boldMatch[1].trim();
    // Check if heading word appears at start of content too
    if (boldMatch[2].trim().startsWith(heading)) {
      issues.push({
        id: blk.id,
        order: blk.order,
        type: 'bold_heading_merged',
        preview: text.substring(0, 80),
        heading: heading
      });
    }
  }
}

if (issues.length === 0) {
  console.log('No heading merge issues found!');
  process.exit(0);
}

console.log(`Found ${issues.length} issues:\n`);
for (const issue of issues) {
  console.log(`  Block [${issue.order}] ${issue.id}`);
  console.log(`    Type: ${issue.type}, Heading: "${issue.heading}"`);
  console.log(`    Preview: ${issue.preview}`);
  console.log();
}

console.log('To fix, run with --fix flag');
if (process.argv.includes('--fix')) {
  console.log('\nFixing...');
  for (const issue of issues) {
    // Fetch full text
    const res = execSync(
      `npx wrangler d1 execute ${DB} --remote --command "SELECT text_md FROM block WHERE id = '${issue.id}'" --json`,
      { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
    );
    const r = JSON.parse(res);
    const fullText = r[0]?.results?.[0]?.text_md || '';

    let fixed;
    if (issue.type === 'doubled_heading') {
      // "AnchorAnchor là..." → "### Anchor\n\nAnchor là..."
      const h = issue.heading;
      const rest = fullText.substring(h.length * 2).trim();
      fixed = `### ${h}\n\n${h} ${rest}`;
    } else if (issue.type === 'bold_heading_merged') {
      // "**Anchor**Anchor là..." → "### Anchor\n\nAnchor là..."
      const h = issue.heading;
      const rest = fullText.replace(/^\*\*[^*]+\*\*/, '').trim();
      fixed = `### ${h}\n\n${rest}`;
    }

    if (fixed) {
      const esc = fixed.replace(/'/g, "''");
      const sql = `UPDATE "block" SET "text_md" = '${esc}' WHERE "id" = '${issue.id}';`;
      const tmpFile = join(tmpdir(), `fix_${Date.now()}_${issue.order}.sql`);
      writeFileSync(tmpFile, sql);
      try {
        execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
        console.log(`  ✓ Fixed block [${issue.order}]`);
      } finally { try { unlinkSync(tmpFile); } catch {} }
    }
  }
  console.log('\nDone!');
}
