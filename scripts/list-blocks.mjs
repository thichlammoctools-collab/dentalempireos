import { execSync } from 'child_process';

const DB = 'dentalempireos-db';
const CHAPTER = process.argv[2];

const result = execSync(
  `npx wrangler d1 execute ${DB} --remote --command "SELECT b.id, b.[order], s.title as section_title, s.[order] as section_order, LENGTH(b.text_md) as len FROM block b JOIN section s ON b.section_id = s.id WHERE s.chapter_id = '${CHAPTER}' AND b.type = 'text' ORDER BY b.[order]" --json`,
  { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
);
const data = JSON.parse(result);
const blocks = data[0]?.results || [];
console.log(`Total: ${blocks.length} blocks\n`);

let lastSection = '';
for (const b of blocks) {
  if (b.section_title !== lastSection) {
    console.log(`\n## SECTION: ${b.section_title || '(no title)'} (order: ${b.section_order})`);
    lastSection = b.section_title;
  }
  console.log(`  - [${b.order}] ${b.id} (${b.len} chars)`);
}
