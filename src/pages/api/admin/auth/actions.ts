import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { createAuth } from '../../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const auth = createAuth(env);
    const body = await request.json();
    const { action, userId, banReason } = body as {
      action: string;
      userId: string;
      banReason?: string;
    };

    if (!action || !userId) return badRequest('action and userId required');

    switch (action) {
      case 'ban':
        await auth.api.banUser({ userId, banReason });
        return json({ success: true });

      case 'unban':
        await auth.api.unbanUser({ userId });
        return json({ success: true });

      case 'revoke-sessions':
        await auth.api.revokeUserSessions({ userId });
        return json({ success: true });

      case 'send-verification':
        await auth.api.sendVerificationEmail({ email: body.email });
        return json({ success: true });

      case 'delete':
        await auth.api.removeUser({ userId });
        return json({ success: true });

      default:
        return badRequest(`Unknown action: ${action}`);
    }
  } catch (err) {
    console.error('[auth/actions POST]', err);
    return badRequest('Action failed');
  }
};
