import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

// This diagnostic route must never expose database metadata or stack traces in production.
export const GET: APIRoute = async () => {
  void env;
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
};
