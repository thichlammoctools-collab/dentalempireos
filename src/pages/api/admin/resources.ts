import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, slugify } from '../../../lib/api-helpers';
import { listResources, upsertResource } from '../../../lib/resource-db';

export const prerender = false;

// GET /api/admin/resources — list all resources
export const GET: APIRoute = async () => {
  const resources = await listResources(env.DB);
  return json(resources);
};

// POST /api/admin/resources — create a new resource
export const POST: APIRoute = async ({ request }) => {
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

  if (!title) return badRequest('title is required');

  const id = slugify(title);
  await upsertResource(env.DB, {
    id,
    title,
    description,
    icon,
    file_ext,
    file_url,
    category,
    tier,
    tag,
    sort_order,
  });

  return json({ id }, 201);
};
