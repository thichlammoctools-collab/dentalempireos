import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';

const DASH_BASE = `${env.BETTER_AUTH_URL}/api/auth/dash`;

async function dashFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${DASH_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': env.BETTER_AUTH_API_KEY ?? '',
      ...(options?.headers ?? {}),
    },
  });
  return res;
}

// POST /api/admin/auth/actions — user actions (ban, unban, revoke, delete)
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, userId } = body as { action: string; userId: string };

    if (!action || !userId) return badRequest('action and userId required');

    let path: string;
    let method = 'POST';

    switch (action) {
      case 'ban':
        path = `/ban-user/${encodeURIComponent(userId)}`;
        break;
      case 'unban':
        path = `/unban-user/${encodeURIComponent(userId)}`;
        break;
      case 'revoke-sessions':
        path = '/sessions/revoke-all';
        method = 'POST';
        break;
      case 'revoke-session':
        path = '/sessions/revoke';
        break;
      case 'send-verification':
        path = '/send-verification-email';
        break;
      case 'send-reset':
        path = '/send-reset-password-email';
        break;
      case 'delete':
        path = `/delete-user/${encodeURIComponent(userId)}`;
        break;
      case 'delete-many':
        path = '/delete-many-users';
        break;
      case 'ban-many':
        path = '/ban-many-users';
        break;
      default:
        return badRequest(`Unknown action: ${action}`);
    }

    const body2 = ['revoke-sessions', 'send-verification', 'send-reset', 'ban-many', 'delete-many'].includes(action)
      ? { userId }
      : undefined;

    const res = await dashFetch(path, {
      method,
      body: body2 ? JSON.stringify(body2) : undefined,
    });
    const data = await res.json();
    if (!res.ok) return badRequest(data.message ?? `Action ${action} failed`);
    return json(data);
  } catch (err) {
    console.error('[auth/actions POST]', err);
    return badRequest('Action failed');
  }
};
