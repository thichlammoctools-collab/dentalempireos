import { execSync } from 'child_process';
const res = execSync(
  `npx wrangler d1 execute dentalempireos-db --remote --command "SELECT b.id, b.[order], SUBSTR(b.text_md, 1, 120) as preview FROM block b JOIN section s ON b.section_id = s.id WHERE s.chapter_id = '03-roadmap-to-be-sky' AND s.[order] BETWEEN 90 AND 96 AND b.type = 'text' ORDER BY b.[order]" --json`,
  { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
);
const data = JSON.parse(res);
(data[0]?.results || []).forEach(b => console.log(`[${b.order}] ${b.id}: ${b.preview}`));
