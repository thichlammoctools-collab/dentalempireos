import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { createAuth } from '../../../lib/auth';
import { getCreditBalance, listCreditLedger } from '../../../lib/credit-db';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'unauthorized' }, 401);

  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get('limit') ?? 50);
  const requestedOffset = Number(url.searchParams.get('offset') ?? 0);
  const limit = Number.isSafeInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;
  const offset = Number.isSafeInteger(requestedOffset) ? Math.max(requestedOffset, 0) : 0;
  const [balance, entries] = await Promise.all([
    getCreditBalance(env.DB, session.user.id),
    listCreditLedger(env.DB, session.user.id, { limit, offset }),
  ]);
  return json({ balance, entries, limit, offset });
};
