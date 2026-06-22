import { execSync } from 'child_process';

const DB = 'dentalempireos-db';
const CHAPTER = process.argv[2];

const result = execSync(
  `npx wrangler d1 execute ${DB} --remote --command "SELECT b.id, b.[order], b.text_md FROM block b JOIN section s ON b.section_id = s.id WHERE s.chapter_id = '${CHAPTER}' AND b.type = 'text' ORDER BY b.[order]" --json`,
  { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
);
const data = JSON.parse(result);
const blocks = data[0]?.results || [];
console.log(`Total: ${blocks.length} blocks\n`);
for (const b of blocks) {
  console.log(`=== BLOCK ${b.order} ===`);
  console.log(`ID: ${b.id}`);
  console.log(b.text_md || '(empty)');
  console.log();
}
