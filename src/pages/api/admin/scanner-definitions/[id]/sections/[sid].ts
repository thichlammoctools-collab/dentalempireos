// Admin API: Single Section — get, update, delete
// GET /api/admin/scanner-definitions/[id]/sections/[sid]
// PATCH /api/admin/scanner-definitions/[id]/sections/[sid]
// DELETE /api/admin/scanner-definitions/[id]/sections/[sid]

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../../../lib/api-helpers';
import {
  getSectionById,
  updateSection,
  deleteSection,
  type SurveySectionInput,
} from '../../../../../../lib/survey-config-db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const sid = parseInt(params.sid ?? '', 10);
  if (!sid) return badRequest('sid is required');

  const row = await getSectionById(env.DB, sid);
  if (!row) return notFound('Section not found');
  return json(row);
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const sid = parseInt(params.sid ?? '', 10);
  if (!sid) return badRequest('sid is required');

  const body = (await request.json().catch(() => null)) as Partial<SurveySectionInput> | null;
  if (!body) return badRequest('Invalid JSON body');

  const updated = await updateSection(env.DB, sid, body);
  if (!updated) return notFound('Section not found');

  return json({ id: sid, updated: true });
};

export const DELETE: APIRoute = async ({ params }) => {
  const sid = parseInt(params.sid ?? '', 10);
  if (!sid) return badRequest('sid is required');

  await deleteSection(env.DB, sid);
  return json({ deleted: true });
};