import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { CLINIC_RESOURCE_MANIFEST } from '../src/data/resources/clinic-resource-manifest.ts';

const execFileAsync = promisify(execFile);
const dryRun = process.argv.includes('--dry-run');
const remote = process.argv.includes('--remote');
const outputDir = resolve('artifacts/clinic-resources');
const tempDir = resolve('tmp/clinic-resource-import');
const requiredExtensions = new Set(['pdf', 'xlsx']);
const mimeByExtension = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

if (!dryRun && !remote) {
  throw new Error('Use --dry-run to validate, or --remote to upload drafts to production R2 and D1.');
}

function sql(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function assetId(resourceId, version, extension) {
  return `${resourceId}-v${version}-${extension}`;
}

async function checksum(path) {
  const content = await readFile(path);
  return { byteSize: content.byteLength, sha256: createHash('sha256').update(content).digest('hex') };
}

async function runWrangler(args) {
  return execFileAsync(process.execPath, [resolve('node_modules/wrangler/bin/wrangler.js'), ...args], {
    cwd: process.cwd(),
    windowsHide: true,
    maxBuffer: 10 * 1024 * 1024,
  });
}

const resources = [];
const actions = [];
for (const resource of CLINIC_RESOURCE_MANIFEST) {
  const files = [resource.pdf.filename, resource.workbook.filename];
  const extensions = new Set();
  const assets = [];
  for (const filename of files) {
    const path = resolve(outputDir, filename);
    await access(path);
    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension || !requiredExtensions.has(extension)) throw new Error(`Unsupported required asset: ${filename}`);
    extensions.add(extension);
    const metadata = await checksum(path);
    const storageKey = `resources/${resource.id}/v${resource.version}/${filename}`;
    const asset = { id: assetId(resource.id, resource.version, extension), filename, path, extension, storageKey, mimeType: mimeByExtension[extension], ...metadata };
    assets.push(asset);
    actions.push({ resourceId: resource.id, status: resource.status, accessMode: resource.accessMode, ...asset });
  }
  if (extensions.size !== requiredExtensions.size) throw new Error(`${resource.id} must include one PDF and one XLSX`);
  resources.push({ ...resource, assets });
}

if (dryRun) {
  console.log(JSON.stringify({ dryRun: true, resources: resources.map(({ id, status, accessMode, assets }) => ({ id, status, accessMode, assets: assets.map(({ id: asset, storageKey, byteSize, sha256 }) => ({ id: asset, storageKey, byteSize, sha256 })) })) }, null, 2));
  process.exit(0);
}

for (const asset of actions) {
  await runWrangler(['r2', 'object', 'put', `dentalempireos/${asset.storageKey}`, '--remote', '--file', asset.path, '--content-type', asset.mimeType, '--content-disposition', `attachment; filename="${asset.filename.replace(/["\\]/g, '_')}"`]);
}

await mkdir(tempDir, { recursive: true });
const sqlStatements = [];
for (const resource of resources) {
  const tier = resource.accessMode === 'credits' ? 'premium' : 'free';
  const primaryAsset = resource.assets.find((asset) => asset.extension === 'pdf');
  sqlStatements.push(
    `INSERT INTO "resource" ("id","title","description","icon","file_ext","file_url","category","tier","tag","sort_order","status","access_mode","published_at","primary_asset_id","created_at","updated_at") VALUES (${sql(resource.id)},${sql(resource.title)},${sql(resource.description)},${sql(resource.icon)},'pdf','',${sql(resource.category)},${sql(tier)},${sql(resource.tag)},${resource.sortOrder},'draft',${sql(resource.accessMode)},NULL,${sql(primaryAsset.id)},datetime('now'),datetime('now')) ON CONFLICT("id") DO UPDATE SET "title"=excluded."title", "description"=excluded."description", "icon"=excluded."icon", "category"=excluded."category", "tier"=excluded."tier", "tag"=excluded."tag", "sort_order"=excluded."sort_order", "access_mode"=excluded."access_mode", "primary_asset_id"=excluded."primary_asset_id", "updated_at"=datetime('now');`,
  );
  for (const asset of resource.assets) {
    sqlStatements.push(
      `INSERT INTO "resource_asset" ("id","resource_id","storage_key","original_filename","download_filename","mime_type","file_ext","byte_size","sha256","locale","asset_role","version","is_current","created_at") VALUES (${sql(asset.id)},${sql(resource.id)},${sql(asset.storageKey)},${sql(asset.filename)},${sql(asset.filename)},${sql(asset.mimeType)},${sql(asset.extension)},${asset.byteSize},${sql(asset.sha256)},'vi','download',${resource.version},1,datetime('now')) ON CONFLICT("id") DO UPDATE SET "storage_key"=excluded."storage_key", "original_filename"=excluded."original_filename", "download_filename"=excluded."download_filename", "mime_type"=excluded."mime_type", "file_ext"=excluded."file_ext", "byte_size"=excluded."byte_size", "sha256"=excluded."sha256", "is_current"=1, "retired_at"=NULL;`,
    );
  }
}
const sqlPath = resolve(tempDir, 'seed-clinic-resources.sql');
await writeFile(sqlPath, `${sqlStatements.join('\n')}\n`, 'utf8');
try {
  await runWrangler(['d1', 'execute', 'DB', '--remote', '--file', sqlPath, '--yes']);
} finally {
  await rm(sqlPath, { force: true });
}

console.log(JSON.stringify({ imported: resources.map(({ id, status, accessMode, assets }) => ({ id, status, accessMode, assets: assets.map(({ id: asset, storageKey }) => ({ id: asset, storageKey })) })) }, null, 2));
