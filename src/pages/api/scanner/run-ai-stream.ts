// Deprecated compatibility endpoint. Scanner AI work is now always dispatched
// through /api/scanner/run-ai so it respects the durable queue's limits.

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async (ctx) => (
  Response.redirect(new URL('/api/scanner/run-ai', ctx.request.url), 307)
);
