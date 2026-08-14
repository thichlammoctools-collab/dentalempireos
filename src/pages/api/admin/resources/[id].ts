import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { archiveResource, getResource, hasRequiredDownloadAssets, replaceResourceAsset, upsertResource, type ResourceAssetInput } from '../../../../lib/resource-db';
import { isResourceAccessMode, isResourceAssetExtension, isResourceCategory, isResourceStatus, RESOURCE_ASSET_MIME_TYPES } from '../../../../lib/resource-types';

export const prerender = false;

function parseAssets(value: unknown): ResourceAssetInput[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;
  const assets: ResourceAssetInput[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') return null;
    const candidate = item as Record<string, unknown>;
    const id = typeof candidate.id === 'string' ? candidate.id.trim() : '';
    const storageKey = typeof candidate.storage_key === 'string' ? candidate.storage_key.trim() : '';
    const filename = typeof candidate.original_filename === 'string' ? candidate.original_filename.trim() : '';
    const ext = typeof candidate.file_ext === 'string' ? candidate.file_ext.toLowerCase() : '';
    if (!id || !storageKey || !filename || !isResourceAssetExtension(ext)) return null;
    const mime = typeof candidate.mime_type === 'string' ? candidate.mime_type : RESOURCE_ASSET_MIME_TYPES[ext];
    if (mime !== RESOURCE_ASSET_MIME_TYPES[ext]) return null;
    assets.push({ id, storage_key: storageKey, original_filename: filename, download_filename: typeof candidate.download_filename === 'string' ? candidate.download_filename.trim() || filename : filename, mime_type: mime, file_ext: ext, byte_size: typeof candidate.byte_size === 'number' && Number.isSafeInteger(candidate.byte_size) && candidate.byte_size >= 0 ? candidate.byte_size : null, sha256: typeof candidate.sha256 === 'string' ? candidate.sha256.trim() || null : null, locale: typeof candidate.locale === 'string' ? candidate.locale.slice(0, 20) : 'vi', asset_role: candidate.asset_role === 'preview' ? 'preview' : 'download' });
  }
  return assets;
}

export const GET: APIRoute = async ({ params }) => {
  if (!params.id) return badRequest('Missing id');
  const row = await getResource(env.DB, params.id, true);
  return row ? json(row) : notFound();
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');
  const existing = await getResource(env.DB, id, true);
  if (!existing) return notFound();
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');
  const title = typeof body.title === 'string' ? body.title.trim() : existing.title;
  if (!title || title.length > 180) return badRequest('title không hợp lệ');
  const category = body.category ?? existing.category;
  const accessMode = body.access_mode ?? existing.access_mode;
  const status = body.status ?? existing.status;
  if (!isResourceCategory(category) || !isResourceAccessMode(accessMode) || !isResourceStatus(status)) return badRequest('category, access_mode hoặc status không hợp lệ');
  const assets = parseAssets(body.assets);
  if (assets === null) return badRequest('assets không hợp lệ');
  for (const asset of assets) await replaceResourceAsset(env.DB, id, asset, locals.user?.id);
  if (status === 'published' && !(await hasRequiredDownloadAssets(env.DB, id))) return badRequest('Chỉ có thể publish khi resource có PDF và XLSX download hiện hành');
  await upsertResource(env.DB, { id, title, description: typeof body.description === 'string' ? body.description.slice(0, 2000).trim() : existing.description, icon: typeof body.icon === 'string' ? body.icon.slice(0, 80).trim() : existing.icon, category, access_mode: accessMode, tier: accessMode === 'credits' ? 'premium' : 'free', status, tag: typeof body.tag === 'string' ? body.tag.slice(0, 80).trim() : existing.tag, sort_order: typeof body.sort_order === 'number' && Number.isSafeInteger(body.sort_order) ? body.sort_order : existing.sort_order, file_ext: existing.file_ext, file_url: existing.file_url, published_at: status === 'published' ? existing.published_at ?? new Date().toISOString() : null, created_by_user_id: existing.created_by_user_id, updated_by_user_id: locals.user?.id ?? null });
  return json({ id, updated: true });
};

// Archive instead of hard deleting so grants and version history remain coherent.
export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!params.id) return badRequest('Missing id');
  if (!(await getResource(env.DB, params.id))) return notFound();
  await archiveResource(env.DB, params.id, locals.user?.id);
  return json({ archived: true });
};
