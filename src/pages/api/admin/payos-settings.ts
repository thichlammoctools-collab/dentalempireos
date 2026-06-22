import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { getPayosSettings, upsertPayosSettings, getPayosEnv } from '../../../lib/payos-db';
import { registerWebhook } from '../../../lib/payos';

export const prerender = false;

// GET /api/admin/payos-settings — read PayOS config
export const GET: APIRoute = async () => {
  const settings = await getPayosSettings(env.DB);
  if (!settings) {
    return json({ error: 'Cài đặt PayOS chưa được khởi tạo' }, 404);
  }
  // Mask sensitive fields for display
  return json({
    ...settings,
    api_key_masked: settings.api_key
      ? settings.api_key.slice(0, 6) + '••••••' + settings.api_key.slice(-4)
      : '',
    checksum_key_masked: settings.checksum_key
      ? settings.checksum_key.slice(0, 6) + '••••••' + settings.checksum_key.slice(-4)
      : '',
  });
};

// PUT /api/admin/payos-settings — update PayOS config
export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { client_id, api_key, checksum_key, webhook_url, sandbox_mode, is_active } = body as {
    client_id?: string;
    api_key?: string;
    checksum_key?: string;
    webhook_url?: string;
    sandbox_mode?: number;
    is_active?: number;
  };

  await upsertPayosSettings(env.DB, {
    client_id,
    api_key,
    checksum_key,
    webhook_url,
    sandbox_mode,
    is_active,
  });

  return json({ ok: true });
};

// POST /api/admin/payos-settings — register webhook with PayOS
export const POST: APIRoute = async () => {
  const settings = await getPayosSettings(env.DB);
  if (!settings?.client_id) {
    return json({ error: 'Chưa cấu hình PayOS credentials' }, 400);
  }
  const creds = getPayosEnv(env.DB, settings, env);

  try {
    const result = await registerWebhook(creds);
    return json({ ok: true, webhookUrl: result.webhookUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi đăng ký webhook';
    return json({ error: message }, 500);
  }
};
