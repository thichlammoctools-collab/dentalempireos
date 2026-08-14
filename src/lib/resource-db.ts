// Data access layer for downloadable resources stored in D1.

import type { ResourceAccessMode, ResourceStatus } from './resource-types';

export interface ResourceAssetRow {
  id: string;
  resource_id: string;
  storage_key: string;
  original_filename: string;
  download_filename: string;
  mime_type: string;
  file_ext: string;
  byte_size: number | null;
  sha256: string | null;
  locale: string;
  asset_role: 'download' | 'preview';
  version: number;
  is_current: number;
  created_by_user_id: string | null;
  created_at: string;
  retired_at: string | null;
}

export interface ResourceRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  file_ext: string;
  file_url: string;
  category: string;
  tier: string;
  tag: string;
  sort_order: number;
  status: ResourceStatus;
  access_mode: ResourceAccessMode;
  published_at: string | null;
  created_by_user_id: string | null;
  updated_by_user_id: string | null;
  primary_asset_id: string | null;
  created_at: string;
  updated_at: string;
  assets?: ResourceAssetRow[];
}

export interface ResourceAssetInput {
  id: string;
  storage_key: string;
  original_filename: string;
  download_filename?: string;
  mime_type: string;
  file_ext: string;
  byte_size?: number | null;
  sha256?: string | null;
  locale?: string;
  asset_role?: 'download' | 'preview';
  version?: number;
}

export interface ResourceInput {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  file_ext?: string;
  file_url?: string;
  category?: string;
  tier?: string;
  tag?: string;
  sort_order?: number;
  status?: ResourceStatus;
  access_mode?: ResourceAccessMode;
  published_at?: string | null;
  created_by_user_id?: string | null;
  updated_by_user_id?: string | null;
}

function now(): string {
  return new Date().toISOString();
}

export interface ListResourcesOptions {
  search?: string;
  category?: string;
  publicOnly?: boolean;
  includeAssets?: boolean;
}

function listWhere(opts: ListResourcesOptions): { where: string; binds: string[] } {
  const conditions: string[] = [];
  const binds: string[] = [];
  if (opts.publicOnly) conditions.push('"status" = \'published\'');
  if (opts.search) {
    conditions.push('(\"title\" LIKE ? OR \"description\" LIKE ?)');
    binds.push(`%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.category && opts.category !== 'all') {
    conditions.push('"category" = ?');
    binds.push(opts.category);
  }
  return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', binds };
}

export async function getResourceAssets(db: D1Database, resourceId: string, includeRetired = false): Promise<ResourceAssetRow[]> {
  const current = includeRetired ? '' : 'AND "is_current" = 1 AND "retired_at" IS NULL';
  const { results } = await db
    .prepare(`SELECT * FROM "resource_asset" WHERE "resource_id" = ? ${current} ORDER BY "asset_role", "file_ext", "version" DESC`)
    .bind(resourceId)
    .all<ResourceAssetRow>();
  return results;
}

async function attachAssets(db: D1Database, resources: ResourceRow[]): Promise<ResourceRow[]> {
  if (resources.length === 0) return resources;
  const clauses = resources.map(() => '?').join(',');
  const { results } = await db
    .prepare(`SELECT * FROM "resource_asset" WHERE "resource_id" IN (${clauses}) AND "is_current" = 1 AND "retired_at" IS NULL ORDER BY "asset_role", "file_ext", "version" DESC`)
    .bind(...resources.map((resource) => resource.id))
    .all<ResourceAssetRow>();
  const assetsByResource = new Map<string, ResourceAssetRow[]>();
  for (const asset of results) assetsByResource.set(asset.resource_id, [...(assetsByResource.get(asset.resource_id) ?? []), asset]);
  return resources.map((resource) => ({ ...resource, assets: assetsByResource.get(resource.id) ?? [] }));
}

export async function listResources(db: D1Database, opts: ListResourcesOptions = {}): Promise<ResourceRow[]> {
  const { where, binds } = listWhere(opts);
  const { results } = await db
    .prepare(`SELECT * FROM "resource" ${where} ORDER BY "sort_order", "id" DESC`)
    .bind(...binds)
    .all<ResourceRow>();
  return opts.includeAssets ? attachAssets(db, results) : results;
}

export async function countResources(db: D1Database, opts: ListResourcesOptions = {}): Promise<number> {
  const { where, binds } = listWhere(opts);
  const result = await db.prepare(`SELECT COUNT(*) as count FROM "resource" ${where}`).bind(...binds).first<{ count: number }>();
  return result?.count ?? 0;
}

export async function getResource(db: D1Database, id: string, includeAssets = false): Promise<ResourceRow | null> {
  const resource = await db.prepare('SELECT * FROM "resource" WHERE "id" = ?').bind(id).first<ResourceRow>();
  if (!resource || !includeAssets) return resource;
  resource.assets = await getResourceAssets(db, id);
  return resource;
}

export async function getResourceAssetByStorageKey(db: D1Database, storageKey: string): Promise<(ResourceAssetRow & Pick<ResourceRow, 'id' | 'status' | 'access_mode' | 'tier'>) | null> {
  return db.prepare(
    `SELECT a.*, r."id", r."status", r."access_mode", r."tier"
     FROM "resource_asset" a JOIN "resource" r ON r."id" = a."resource_id"
     WHERE a."storage_key" = ? AND a."is_current" = 1 AND a."retired_at" IS NULL LIMIT 1`,
  ).bind(storageKey).first();
}

export async function upsertResource(db: D1Database, input: ResourceInput): Promise<void> {
  const ts = now();
  const accessMode = input.access_mode ?? (input.tier === 'premium' ? 'credits' : 'free');
  const tier = input.tier ?? (accessMode === 'credits' ? 'premium' : 'free');
  await db.prepare(
    `INSERT INTO "resource" ("id","title","description","icon","file_ext","file_url","category","tier","tag","sort_order","status","access_mode","published_at","created_by_user_id","updated_by_user_id","created_at","updated_at")
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT("id") DO UPDATE SET
       "title"=excluded."title", "description"=excluded."description", "icon"=excluded."icon", "file_ext"=excluded."file_ext", "file_url"=excluded."file_url", "category"=excluded."category", "tier"=excluded."tier", "tag"=excluded."tag", "sort_order"=excluded."sort_order", "status"=excluded."status", "access_mode"=excluded."access_mode", "published_at"=excluded."published_at", "updated_by_user_id"=excluded."updated_by_user_id", "updated_at"=excluded."updated_at"`,
  ).bind(input.id, input.title, input.description ?? '', input.icon ?? 'description', input.file_ext ?? 'pdf', input.file_url ?? '', input.category ?? 'sops', tier, input.tag ?? '', input.sort_order ?? 0, input.status ?? 'draft', accessMode, input.published_at ?? null, input.created_by_user_id ?? null, input.updated_by_user_id ?? null, ts, ts).run();
}

export async function replaceResourceAsset(db: D1Database, resourceId: string, asset: ResourceAssetInput, userId?: string): Promise<void> {
  const existing = await db.prepare('SELECT MAX("version") AS version FROM "resource_asset" WHERE "resource_id" = ? AND "file_ext" = ? AND "asset_role" = ?').bind(resourceId, asset.file_ext, asset.asset_role ?? 'download').first<{ version: number | null }>();
  const version = asset.version ?? (existing?.version ?? 0) + 1;
  const ts = now();
  await db.batch([
    db.prepare('UPDATE "resource_asset" SET "is_current" = 0, "retired_at" = ? WHERE "resource_id" = ? AND "file_ext" = ? AND "asset_role" = ? AND "is_current" = 1').bind(ts, resourceId, asset.file_ext, asset.asset_role ?? 'download'),
    db.prepare(`INSERT INTO "resource_asset" ("id","resource_id","storage_key","original_filename","download_filename","mime_type","file_ext","byte_size","sha256","locale","asset_role","version","is_current","created_by_user_id","created_at") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(asset.id, resourceId, asset.storage_key, asset.original_filename, asset.download_filename ?? asset.original_filename, asset.mime_type, asset.file_ext, asset.byte_size ?? null, asset.sha256 ?? null, asset.locale ?? 'vi', asset.asset_role ?? 'download', version, 1, userId ?? null, ts),
    db.prepare('UPDATE "resource" SET "primary_asset_id" = COALESCE("primary_asset_id", ?), "updated_at" = ? WHERE "id" = ?').bind(asset.id, ts, resourceId),
  ]);
}

export async function hasRequiredDownloadAssets(db: D1Database, resourceId: string): Promise<boolean> {
  const result = await db.prepare(`SELECT COUNT(DISTINCT "file_ext") AS count FROM "resource_asset" WHERE "resource_id" = ? AND "asset_role" = 'download' AND "is_current" = 1 AND "retired_at" IS NULL AND "file_ext" IN ('pdf', 'xlsx')`).bind(resourceId).first<{ count: number }>();
  return result?.count === 2;
}

export async function archiveResource(db: D1Database, id: string, userId?: string): Promise<void> {
  await db.prepare('UPDATE "resource" SET "status" = \'archived\', "updated_by_user_id" = ?, "updated_at" = ? WHERE "id" = ?').bind(userId ?? null, now(), id).run();
}
