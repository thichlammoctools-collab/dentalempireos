// GET /api/website-chat/:id — load one authorized conversation for UI hydration.

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createAuth } from '../../../lib/auth';
import { loadSession } from '../../../lib/website-chat-db';

export const prerender = false;

const ANONYMOUS_SESSION_COOKIE = 'de_chat_anon_token';

function getAnonymousSessionToken(request: Request): string | null {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${ANONYMOUS_SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export const GET: APIRoute = async (ctx) => {
  const sessionId = ctx.params.id?.trim();
  if (!sessionId || sessionId.length > 128) {
    return new Response(JSON.stringify({ error: 'session_id is invalid' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const auth = createAuth(env);
  const authSession = await auth.api.getSession({ headers: ctx.request.headers });
  const userId = authSession?.user?.id ?? null;
  const session = await loadSession(env.DB, sessionId, userId, getAnonymousSessionToken(ctx.request));
  if (!session) {
    return new Response(JSON.stringify({ error: 'Không tìm thấy cuộc trò chuyện.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    id: session.id,
    title: session.title,
    messages: session.messages,
    updated_at: session.updated_at,
  }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
