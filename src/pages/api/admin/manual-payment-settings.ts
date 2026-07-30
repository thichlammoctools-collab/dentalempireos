import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../lib/api-helpers';
import { getManualPaymentSettings, upsertManualPaymentSettings } from '../../../lib/payos-db';

export const prerender = false;

export const GET: APIRoute = async () => json(await getManualPaymentSettings(env.DB));

export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');

  const fields = ['bank_bin', 'account_number', 'account_name', 'zalo_url'] as const;
  for (const field of fields) {
    if (field in body && typeof body[field] !== 'string') return badRequest(`${field} không hợp lệ`);
  }
  if ('is_active' in body && body.is_active !== 0 && body.is_active !== 1) return badRequest('is_active không hợp lệ');

  await upsertManualPaymentSettings(env.DB, {
    is_active: body.is_active as number | undefined,
    bank_bin: body.bank_bin as string | undefined,
    account_number: body.account_number as string | undefined,
    account_name: body.account_name as string | undefined,
    zalo_url: body.zalo_url as string | undefined,
  });
  return json({ ok: true });
};
