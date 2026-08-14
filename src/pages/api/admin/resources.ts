import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { listResources, replaceResourceAsset, upsertResource, type ResourceAssetInput } from '../../../lib/resource-db';
import { isResourceAccessMode, isResourceAssetExtension, isResourceCategory, isResourceStatus, RESOURCE_ASSET_MIME_TYPES } from '../../../lib/resource-types';

export const prerender = false;

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim();
  return cleaned && cleaned.length <= maxLength ? cleaned : null;
}

function parseAssets(value: unknown): ResourceAssetInput[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;
  const ids = new Set<string>();
  const assets: ResourceAssetInput[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') return null;
    const candidate = item as Record<string, unknown>;
    const id = cleanText(candidate.id, 120);
    const storageKey = cleanText(candidate.storage_key, 512);
    const originalFilename = cleanText(candidate.original_filename, 255);
    const fileExt = cleanText(candidate.file_ext, 10)?.toLowerCase();
    if (!id || !storageKey || !originalFilename || !fileExt || !isResourceAssetExtension(fileExt) || ids.has(id)) return null;
    const mimeType = cleanText(candidate.mime_type, 160) ?? RESOURCE_ASSET_MIME_TYPES[fileExt];
    if (mimeType !== RESOURCE_ASSET_MIME_TYPES[fileExt]) return null;
    ids.add(id);
    assets.push({ id, storage_key: storageKey, original_filename: originalFilename, download_filename: cleanText(candidate.download_filename, 255) ?? originalFilename, mime_type: mimeType, file_ext: fileExt, byte_size: typeof candidate.byte_size === 'number' && Number.isSafeInteger(candidate.byte_size) && candidate.byte_size >= 0 ? candidate.byte_size : null, sha256: cleanText(candidate.sha256, 128), locale: cleanText(candidate.locale, 20) ?? 'vi', asset_role: candidate.asset_role === 'preview' ? 'preview' : 'download' });
  }
  return assets;
}

// Archived resources are retained for grants and asset history, but hidden from the management grid.
export const GET: APIRoute = async () => json(
  (await listResources(env.DB, { includeAssets: true }))
    .filter((resource) => resource.status !== 'archived'),
);

// POST accepts an explicit stable ID. Title-derived IDs caused accidental overwrites.
export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');
  const id = cleanText(body.id, 120);
  const title = cleanText(body.title, 180);
  const description = typeof body.description === 'string' && body.description.length <= 2000 ? body.description.trim() : '';
  if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !title) return badRequest('id ổn định và title là bắt buộc');
  if (!isResourceCategory(body.category) || !isResourceAccessMode(body.access_mode) || !isResourceStatus(body.status)) return badRequest('category, access_mode hoặc status không hợp lệ');
  const assets = parseAssets(body.assets);
  if (assets === null) return badRequest('assets không hợp lệ');
  const downloadExtensions = new Set(assets.filter((asset) => asset.asset_role === 'download').map((asset) => asset.file_ext));
  if (body.status === 'published' && (!downloadExtensions.has('pdf') || !downloadExtensions.has('xlsx'))) return badRequest('Resource published phải có PDF và XLSX download');
  await upsertResource(env.DB, { id, title, description, icon: cleanText(body.icon, 80) ?? 'description', category: body.category, access_mode: body.access_mode, status: body.status, tier: body.access_mode === 'credits' ? 'premium' : 'free', tag: typeof body.tag === 'string' ? body.tag.slice(0, 80).trim() : '', sort_order: typeof body.sort_order === 'number' && Number.isSafeInteger(body.sort_order) ? body.sort_order : 0, published_at: body.status === 'published' ? new Date().toISOString() : null, created_by_user_id: locals.user?.id ?? null, updated_by_user_id: locals.user?.id ?? null });
  for (const asset of assets) await replaceResourceAsset(env.DB, id, asset, locals.user?.id);
  return json({ id }, 201);
};
