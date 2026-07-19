import type { APIRoute } from 'astro';
import { json, badRequest } from '../../../lib/api-helpers';

export const prerender = false;

// Legacy endpoint retained only to guide existing admin clients to Gateway.
export const GET: APIRoute = async () => {
  return json({ providers: [], models: [], deprecated: true });
};

// POST — create/update provider
export const POST: APIRoute = async () => {
  return badRequest('AI Providers đã được thay bằng Cloudflare AI Gateway. Cấu hình tại /admin/ai-settings.');
};
