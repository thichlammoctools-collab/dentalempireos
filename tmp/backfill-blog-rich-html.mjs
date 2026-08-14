import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { marked } from 'marked';

const ids = [
  'post-tier-1-foundation-systems',
  'post-sop-foundation',
  'post-onboarding-14-ngay',
  'post-he-thong-tiep-don',
  'post-dong-tien-hang-tuan',
  'post-quan-ly-vat-tu',
];
const query = `SELECT id, content_md FROM blog_post WHERE id IN (${ids.map((id) => `'${id}'`).join(',')}) ORDER BY id;`;
const output = execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['wrangler', 'd1', 'execute', 'DB', '--remote', '--command', query, '--json'], { encoding: 'utf8' });
const parsed = JSON.parse(output);
const rows = parsed[0]?.results ?? [];
const escape = (value) => value.replaceAll("'", "''");
const sql = rows.map((row) => (
  `UPDATE "blog_block" SET "content" = '${escape(marked.parse(row.content_md))}', "updated_at" = '2026-08-14T01:38:00.000Z' WHERE "id" = 'rich-${row.id}';`
)).join('\n');
await writeFile('tmp/backfill-blog-rich-html.sql', sql, 'utf8');
