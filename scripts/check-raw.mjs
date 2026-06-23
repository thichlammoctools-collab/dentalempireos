import { execSync } from 'child_process';
const ids = ['e719da56-13b1-4b76-b0a0-a578b1692ae0', '2323fe32-63bb-4964-8012-5a4200701f2d', '0d1a7db9-87a8-4789-bb26-edde02ce56b2'];
for (const id of ids) {
  const res = execSync(
    `npx wrangler d1 execute dentalempireos-db --remote --command "SELECT text_md FROM block WHERE id = '${id}'" --json`,
    { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
  );
  const r = JSON.parse(res);
  const text = r[0]?.results?.[0]?.text_md || '';
  console.log(`=== ${id} ===`);
  console.log(text);
  console.log();
}
