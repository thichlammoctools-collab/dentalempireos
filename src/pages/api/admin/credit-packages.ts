import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../lib/api-helpers';

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

function parseInteger(value: unknown, field: string, minimum = 0): number | null {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum) {
    return null;
  }
  return value;
}

export const GET: APIRoute = async () => {
  const { results } = await env.DB.prepare(
    'SELECT * FROM "credit_package" ORDER BY "sort_order" ASC, "created_at" ASC',
  ).all();
  return json(results);
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
  const timestamp = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO "credit_package"
     ("id","name","price","credit_amount","bonus_credits","is_active","sort_order","created_at","updated_at")
     VALUES (?,?,?,?,?,?,?,?,?)
     ON CONFLICT("id") DO UPDATE SET
       "name" = excluded."name", "price" = excluded."price", "credit_amount" = excluded."credit_amount",
       "bonus_credits" = excluded."bonus_credits", "is_active" = excluded."is_active",
       "sort_order" = excluded."sort_order", "updated_at" = excluded."updated_at"`,
  ).bind(id, name, price, creditAmount, bonusCredits, isActive, sortOrder, timestamp, timestamp).run();

  return json({ id }, 201);
};

export const DELETE: APIRoute = async ({ request }) => {
  const input = await request.json().catch(() => null) as { id?: unknown } | null;
  const id = typeof input?.id === 'string' && input.id.trim() ? input.id.trim() : null;
  if (!id) return badRequest('id is required');

  const existing = await env.DB.prepare('SELECT "id" FROM "credit_package" WHERE "id" = ?').bind(id).first();
  if (!existing) return badRequest('Package not found');

  await env.DB.prepare('DELETE FROM "credit_package" WHERE "id" = ?').bind(id).run();
  return json({ success: true });
};
