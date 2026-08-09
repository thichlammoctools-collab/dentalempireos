import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { createAuth } from '../../../../lib/auth';

export const prerender = false;

// GET /api/admin/auth/users — list users
export const GET: APIRoute = async ({ url, request }) => {
  try {
    const auth = createAuth(env);
    const limit = Number(url.searchParams.get('limit') ?? 50);
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const search = url.searchParams.get('search') ?? undefined;

    const result = await auth.api.listUsers({
      headers: request.headers,
      query: {
        limit,
        offset,
        sortBy: 'createdAt',
        sortDirection: 'desc',
        ...(search ? { searchValue: search, searchField: 'email' as const } : {}),
      },
    });
    return json(result);
  } catch (err) {
    console.error('[auth/users GET]', err);
    return badRequest('Failed to fetch users');
  }
};
