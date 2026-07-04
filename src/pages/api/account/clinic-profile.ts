import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { createAuth } from '../../../lib/auth';
import { getClinicProfile, upsertClinicProfile } from '../../../lib/clinic-profile-db';

export const prerender = false;

// GET /api/account/clinic-profile — get current user's clinic profile
export const GET: APIRoute = async ({ request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return json({ error: 'unauthorized' }, 401);
  }

  const profile = await getClinicProfile(env.DB, session.user.id);
  return json(profile ?? {
    id: session.user.id,
    name: session.user.name,
    clinic_name: null,
    clinic_address: null,
    phone: null,
    logo_url: null,
    updated_at: null,
  });
};

// PUT /api/account/clinic-profile — upsert clinic profile
export const PUT: APIRoute = async ({ request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return json({ error: 'unauthorized' }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return badRequest('Invalid JSON');
  }

  await upsertClinicProfile(env.DB, {
    id: session.user.id,
    name: typeof body.name === 'string' ? body.name.trim() || null : null,
    clinic_name: typeof body.clinic_name === 'string' ? body.clinic_name.trim() || null : null,
    clinic_address: typeof body.clinic_address === 'string' ? body.clinic_address.trim() || null : null,
    phone: typeof body.phone === 'string' ? body.phone.trim() || null : null,
  });

  const updated = await getClinicProfile(env.DB, session.user.id);
  return json(updated);
};
