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
        // Update the Better Auth admin fields directly. This avoids the plugin's
        // request-context validation rejecting an otherwise authorized admin action.
        const banResult = await env.DB
          .prepare('UPDATE "user" SET "banned" = 1, "banReason" = ? WHERE "id" = ?')
          .bind(banReason?.trim() || null, userId)
          .run();
        if (!banResult.meta.changes) return json({ error: 'Không tìm thấy người dùng' }, 404);
        await env.DB.prepare('DELETE FROM "session" WHERE "userId" = ?').bind(userId).run();
        return json({ success: true });

      case 'unban':
        const unbanResult = await env.DB
          .prepare('UPDATE "user" SET "banned" = 0, "banReason" = NULL, "banExpires" = NULL WHERE "id" = ?')
          .bind(userId)
          .run();
        if (!unbanResult.meta.changes) return json({ error: 'Không tìm thấy người dùng' }, 404);
        return json({ success: true });

      case 'revoke-sessions':
        await auth.api.revokeUserSessions({ userId, headers: request.headers });
        return json({ success: true });

      case 'send-verification':
        // Resolve the recipient server-side so the action only targets the selected user.
        const user = await auth.api.getUser({ id: userId, headers: request.headers });
        await auth.api.sendVerificationEmail({ email: user.email });
        return json({ success: true });

      case 'delete':
        await auth.api.removeUser({ userId, headers: request.headers });
        return json({ success: true });

      default:
        return badRequest(`Unknown action: ${action}`);
    }
  } catch (err) {
    console.error('[auth/actions POST]', err);
    return badRequest('Action failed');
  }
};
