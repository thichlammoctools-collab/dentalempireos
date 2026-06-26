import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { getApp, upsertApp, deleteApp } from '../../../../lib/app-db';

export const prerender = false;

// GET /api/admin/apps/[id] — get a single app
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const row = await getApp(env.DB, id);
  if (!row) return notFound();
  return json(row);
};

// PATCH /api/admin/apps/[id] — partial update
export const PATCH: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getApp(env.DB, id);
  if (!existing) return notFound();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON');

  await upsertApp(env.DB, {
    id,
    slug: typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : existing.slug,
    name: typeof body.name === 'string' && body.name.trim() ? body.name.trim() : existing.name,
    description: typeof body.description === 'string' ? body.description : existing.description,
    type: existing.type,
    status: typeof body.status === 'string' ? body.status : existing.status,
    is_free: typeof body.is_free === 'number' ? body.is_free : existing.is_free,
    config_json: body.config_json !== undefined ? body.config_json : existing.config_json,
  });

  return json({ success: true });
};

// PUT /api/admin/apps/[id] — full replace
export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getApp(env.DB, id);
  if (!existing) return notFound();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');

  await upsertApp(env.DB, {
    id,
    slug: (body.slug as string) ?? existing.slug,
    name: (body.name as string) ?? existing.name,
    description: (body.description as string | null) ?? existing.description,
    type: ((body.type as string) ?? existing.type) as 'survey' | 'ebook_ai' | 'course_ai' | 'tool' | 'generator',
    status: (body.status as 'draft' | 'active' | 'archived') ?? existing.status,
    is_free: (body.is_free as number) ?? existing.is_free,
    config_json: (body.config_json as string | null) ?? existing.config_json,
  });

  return json({ id, updated: true });
};

// DELETE /api/admin/apps/[id] — delete an app
export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getApp(env.DB, id);
  if (!existing) return notFound();

  await deleteApp(env.DB, id);
  return json({ deleted: true });
};
