import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../lib/api-helpers';
import { deleteCreditPackage, listCreditPackages, upsertCreditPackage } from '../../../lib/credit-db';

export const prerender = false;

interface CreditPackageInput {
  id?: unknown;
  name?: unknown;
  price?: unknown;
  credit_amount?: unknown;
  bonus_credits?: unknown;
  is_active?: unknown;
  sort_order?: unknown;
}

function parseInteger(value: unknown, _field: string, minimum = 0): number | null {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum) {
    return null;
  }
  return value;
}

export const GET: APIRoute = async () => {
  return json(await listCreditPackages(env.DB));
};

export const POST: APIRoute = async ({ request }) => {
  const input = await request.json().catch(() => null) as CreditPackageInput | null;
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  const price = parseInteger(input?.price, 'price');
  const creditAmount = parseInteger(input?.credit_amount, 'credit_amount');
  const bonusCredits = parseInteger(input?.bonus_credits ?? 0, 'bonus_credits');
  const isActive = input?.is_active === 0 ? 0 : input?.is_active === 1 || input?.is_active === undefined ? 1 : null;
  const sortOrder = parseInteger(input?.sort_order ?? 0, 'sort_order');
  if (!name) return badRequest('name is required');
  if (price === null || creditAmount === null || bonusCredits === null || isActive === null || sortOrder === null) {
    return badRequest('Invalid Credit package data');
  }
  if (creditAmount + bonusCredits < 1) return badRequest('Package must grant at least one Credit');

  const id = typeof input?.id === 'string' && input.id.trim() ? input.id.trim() : crypto.randomUUID();
  await upsertCreditPackage(env.DB, id, {
    name, price, creditAmount, bonusCredits, isActive, sortOrder,
  });

  return json({ id }, 201);
};

export const DELETE: APIRoute = async ({ request }) => {
  const input = await request.json().catch(() => null) as { id?: unknown } | null;
  const id = typeof input?.id === 'string' && input.id.trim() ? input.id.trim() : null;
  if (!id) return badRequest('id is required');

  if (!(await deleteCreditPackage(env.DB, id))) return badRequest('Package not found');
  return json({ success: true });
};
