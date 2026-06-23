import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';

function runSQL(sql) {
  const res = execSync(
    `npx wrangler d1 execute ${DB} --remote --command "${sql.replace(/"/g, '\\"')}" --json`,
    { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
  );
  return JSON.parse(res)[0]?.results || [];
}

// Fix section titles with em-dash
const sections = [
  { id: '3ac2ff07-c577-4eea-9439-f60d650616e7', title: 'MODULE 3: TREATMENT PLANNING OS: Hệ thống lập kế hoạch điều trị và thiết kế giải pháp y khoa minh bạch' },
  { id: 'e190bf97-ea9b-4d8b-9e2f-7164c24a632f', title: 'MODULE 4: CHAIRSIDE OPERATION OS: Hệ thống điều phối ghế nha và tối ưu hóa năng suất lâm sàng' }
];

for (const s of sections) {
  const sql = `UPDATE "section" SET "title" = '${s.title.replace(/'/g, "''")}' WHERE "id" = '${s.id}';`;
  const tmpFile = join(tmpdir(), `sec_${Date.now()}.sql`);
  writeFileSync(tmpFile, sql);
  try {
    execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
    console.log(`✓ Fixed: ${s.title.substring(0, 60)}...`);
  } finally { try { unlinkSync(tmpFile); } catch {} }
}

// Also fix any remaining em-dash in ALL sections
const allSections = runSQL(`SELECT id, title FROM section WHERE title LIKE '%—%'`);
for (const s of allSections) {
  const newTitle = s.title.replace(/\s+—\s+/g, ': ');
  if (newTitle !== s.title) {
    const sql = `UPDATE "section" SET "title" = '${newTitle.replace(/'/g, "''")}' WHERE "id" = '${s.id}';`;
    const tmpFile = join(tmpdir(), `sec_${Date.now()}.sql`);
    writeFileSync(tmpFile, sql);
    try {
      execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
      console.log(`✓ Fixed: ${s.title.substring(0, 60)}...`);
    } finally { try { unlinkSync(tmpFile); } catch {} }
  }
}

console.log('Done!');
