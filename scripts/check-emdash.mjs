import { execSync } from 'child_process';
const DB = 'dentalempireos-db';

// Check for em-dash (—) in blocks
const r1 = execSync(
  `npx wrangler d1 execute ${DB} --remote --command "SELECT id, [order], SUBSTR(text_md, 1, 200) as preview FROM block WHERE text_md LIKE '%—%' AND type = 'text' LIMIT 10" --json`,
  { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
);
console.log('=== Blocks with em-dash ===');
(JSON.parse(r1)[0]?.results || []).forEach(b => console.log(`[${b.order}] ${b.id}: ${b.preview}`));

// Check for en-dash (–) in blocks
const r2 = execSync(
  `npx wrangler d1 execute ${DB} --remote --command "SELECT id, [order], SUBSTR(text_md, 1, 200) as preview FROM block WHERE text_md LIKE '%–%' AND type = 'text' LIMIT 10" --json`,
  { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
);
console.log('\n=== Blocks with en-dash ===');
(JSON.parse(r2)[0]?.results || []).forEach(b => console.log(`[${b.order}] ${b.id}: ${b.preview}`));

// Check section titles
const r3 = execSync(
  `npx wrangler d1 execute ${DB} --remote --command "SELECT id, title FROM section WHERE title LIKE '%—%' LIMIT 10" --json`,
  { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
);
console.log('\n=== Section titles with em-dash ===');
(JSON.parse(r3)[0]?.results || []).forEach(s => console.log(`${s.id}: ${s.title}`));

// Check for double dash (--)
const r4 = execSync(
  `npx wrangler d1 execute ${DB} --remote --command "SELECT id, [order], SUBSTR(text_md, 1, 200) as preview FROM block WHERE text_md LIKE '%--%' AND type = 'text' LIMIT 5" --json`,
  { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
);
console.log('\n=== Blocks with double dash ===');
(JSON.parse(r4)[0]?.results || []).forEach(b => console.log(`[${b.order}] ${b.id}: ${b.preview}`));
