import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createAuth } from '../../../lib/auth';

export const prerender = false;

const handler: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    console.log(`[Auth] ${request.method} ${url.pathname}`);

    const auth = createAuth(env);
    const response = await auth.handler(request);

    // Log non-2xx responses for debugging
    if (response.status >= 400) {
      const clone = response.clone();
      const body = await clone.text();
      console.error(`[Auth] ${response.status} → ${body}`);
    }

    return response;
  } catch (err) {
    console.error('[Auth] Handler crashed:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET = handler;
export const POST = handler;
