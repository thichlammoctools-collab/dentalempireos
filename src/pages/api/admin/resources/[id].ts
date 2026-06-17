import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { getResource, upsertResource, deleteResource } from '../../../../lib/resource-db';

export const prerender = false;

// GET /api/admin/resources/[id] — get a single resource
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const row = await getResource(env.DB, id);
  if (!row) return notFound();
  return json(row);
};

// PUT /api/admin/resources/[id] — update a resource
export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getResource(env.DB, id);
  if (!existing) return notFound();

  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { title, description, icon, file_ext, file_url, category, tier, tag, sort_order } = body as {
    title?: string;
    description?: string;
    icon?: string;
    file_ext?: string;
    file_url?: string;
    category?: string;
    tier?: string;
    tag?: string;
    sort_order?: number;
  };

  await upsertResource(env.DB, {
    id,
    title: title ?? existing.title,
    description: description ?? existing.description,
    icon: icon ?? existing.icon,
    file_ext: file_ext ?? existing.file_ext,
    file_url: file_url ?? existing.file_url,
    category: category ?? existing.category,
    tier: tier ?? existing.tier,
    tag: tag ?? existing.tag,
    sort_order: sort_order ?? existing.sort_order,
  });

  return json({ id, updated: true });
};

// DELETE /api/admin/resources/[id] — delete a resource
export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getResource(env.DB, id);
  if (!existing) return notFound();

  await deleteResource(env.DB, id);
  return json({ deleted: true });
};
