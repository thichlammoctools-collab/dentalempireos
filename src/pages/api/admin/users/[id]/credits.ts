import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../../../lib/api-helpers';
import { adjustCredits, getCreditBalance, listCreditLedger, InsufficientCreditsError } from '../../../../../lib/credit-db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const userId = params.id;
  if (!userId) return badRequest('Missing user id');
  const [balance, entries] = await Promise.all([
    getCreditBalance(env.DB, userId),
    listCreditLedger(env.DB, userId, { limit: 100 }),
  ]);
  return json({ balance, entries });
};

export const POST: APIRoute = async ({ params, locals, request }) => {
  const userId = params.id;
  if (!userId) return badRequest('Missing user id');
  if (!locals.user) return json({ error: 'unauthorized' }, 401);

  const body = await request.json().catch(() => null) as {
    amount?: unknown;
    reason?: unknown;
    idempotencyKey?: unknown;
  } | null;
  const amount = typeof body?.amount === 'number' ? body.amount : Number(body?.amount);
  const reason = typeof body?.reason === 'string' ? body.reason.trim() : '';
  const idempotencyKey = typeof body?.idempotencyKey === 'string' && body.idempotencyKey.trim()
    ? body.idempotencyKey.trim()
    : `admin-adjustment:${crypto.randomUUID()}`;
  if (!Number.isSafeInteger(amount) || amount === 0) return badRequest('amount must be a non-zero integer');
  if (!reason) return badRequest('reason is required');

  try {
    const balance = await adjustCredits(env.DB, {
      userId,
      amount,
      actorUserId: locals.user.id,
      reason,
      idempotencyKey,
    });
    return json({ ok: true, balance });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return json({ error: 'Số dư khả dụng không đủ để giảm Credits.' }, 409);
    }
    console.error('[admin/credits] adjustment failed:', error);
    return json({ error: 'Không thể điều chỉnh Credits.' }, 500);
  }
};
