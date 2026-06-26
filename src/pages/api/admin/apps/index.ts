import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, slugify } from '../../../../lib/api-helpers';
import { listApps, upsertApp, type AppInput } from '../../../../lib/app-db';

export const prerender = false;

// GET /api/admin/apps — list all apps
export const GET: APIRoute = async () => {
  const apps = await listApps(env.DB);
  return json(apps);
};

// POST /api/admin/apps — create a new app
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const {
    name,
    slug,
    type,
    description,
    status,
    is_free,
    config_json,
  } = body as Partial<AppInput>;

  if (!name) return badRequest('name is required');
  if (!type) return badRequest('type is required');
  if (!['survey', 'ebook_ai', 'course_ai', 'tool', 'generator'].includes(type)) {
    return badRequest('type must be one of survey/ebook_ai/course_ai/tool/generator');
  }

  const finalSlug = slug?.trim() || slugify(name);
  const id = 'app-' + finalSlug + '-' + Date.now().toString(36);

  await upsertApp(env.DB, {
    id,
    slug: finalSlug,
    name,
    description: description ?? null,
    type: type as AppInput['type'],
    status: status ?? 'draft',
    is_free: is_free ? 1 : 0,
    config_json: config_json ?? null,
  });

  return json({ id }, 201);
};
