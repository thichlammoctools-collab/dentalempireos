import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { CLINIC_RESOURCE_MANIFEST } from '../src/data/resources/clinic-resource-manifest.ts';

const dryRun = process.argv.includes('--dry-run');
const outputDir = resolve('artifacts/clinic-resources');
const requiredExtensions = new Set(['pdf', 'xlsx']);

async function checksum(path) {
  const content = await readFile(path);
  return { byteSize: content.byteLength, sha256: createHash('sha256').update(content).digest('hex') };
}

const actions = [];
for (const resource of CLINIC_RESOURCE_MANIFEST) {
  const files = [resource.pdf.filename, resource.workbook.filename];
  const extensions = new Set();
  for (const filename of files) {
    const path = resolve(outputDir, filename);
    await access(path);
    const extension = filename.split('.').pop();
    if (!extension || !requiredExtensions.has(extension)) throw new Error(`Unsupported required asset: ${filename}`);
    extensions.add(extension);
    const metadata = await checksum(path);
    actions.push({
      resourceId: resource.id,
      status: resource.status,
      accessMode: resource.accessMode,
      asset: filename,
      storageKey: `resources/${resource.id}/v${resource.version}/${filename}`,
      ...metadata,
    });
  }
  if (extensions.size !== requiredExtensions.size) throw new Error(`${resource.id} must include one PDF and one XLSX`);
}

console.log(JSON.stringify({ dryRun, resources: CLINIC_RESOURCE_MANIFEST.map(({ id, status, accessMode }) => ({ id, status, accessMode })), assets: actions }, null, 2));
if (!dryRun) {
  throw new Error('Importer upload requires a configured Cloudflare R2/D1 execution environment. Run with --dry-run to validate generated artifacts before uploading.');
}
