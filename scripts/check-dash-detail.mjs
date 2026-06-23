import { execSync } from 'child_process';
const r = execSync(
  `npx wrangler d1 execute dentalempireos-db --remote --command "SELECT id, SUBSTR(text_md, 1, 250) as preview FROM block WHERE type = 'text' AND text_md LIKE '%—%' LIMIT 15" --json`,
  { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
);
(JSON.parse(r)[0]?.results || []).forEach(b => {
  // Show the context around —
  const idx = b.preview.indexOf('—');
  if (idx >= 0) {
    const before = b.preview.substring(Math.max(0, idx - 30), idx);
    const after = b.preview.substring(idx, idx + 30);
    console.log(`[${b.id.substring(0,8)}] ...${before}|—|${after}...`);
  }
});
