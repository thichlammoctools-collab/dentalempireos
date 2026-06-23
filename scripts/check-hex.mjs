import { execSync } from 'child_process';
const DB = 'dentalempireos-db';

// Search for all dash-like chars
const r = execSync(
  `npx wrangler d1 execute ${DB} --remote --command "SELECT id, [order], text_md FROM block WHERE type = 'text' AND text_md LIKE '%A %ALIGN%' LIMIT 5" --json`,
  { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
);
const blocks = JSON.parse(r)[0]?.results || [];
for (const b of blocks) {
  console.log(`\n=== [${b.order}] ${b.id} ===`);
  // Find the dash char and show its hex
  const idx = b.text_md.indexOf('A ');
  if (idx >= 0) {
    const chunk = b.text_md.substring(idx, idx + 20);
    console.log('Text:', JSON.stringify(chunk));
    for (let i = 0; i < chunk.length; i++) {
      const c = chunk.charCodeAt(i);
      if (c > 127) console.log(`  char[${i}] = U+${c.toString(16).toUpperCase()} "${chunk[i]}"`);
    }
  }
}
