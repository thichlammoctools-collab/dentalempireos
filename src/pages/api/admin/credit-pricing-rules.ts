import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../lib/api-helpers';

export const prerender = false;

interface PricingRuleInput {
  id?: unknown;
  feature_type?: unknown;
  target_id?: unknown;
  model?: unknown;
  credit_amount?: unknown;
  tokens_per_credit?: unknown;
  minutes_per_credit?: unknown;
  max_tokens?: unknown;
  is_active?: unknown;
}

function optionalPositiveInteger(value: unknown): number | null | undefined {
  if (value === undefined || value === null || value === '') return null;
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 ? value : undefined;
}

export const GET: APIRoute = async () => {
  const { results } = await env.DB.prepare(
    'SELECT * FROM "credit_pricing_rule" ORDER BY "feature_type", "target_id", "rule_version" DESC',
  ).all();
  return json(results);
};

export const POST: APIRoute = async ({ request }) => {
  const input = await request.json().catch(() => null) as PricingRuleInput | null;
  const featureType = typeof input?.feature_type === 'string' ? input.feature_type.trim() : '';
  const targetId = typeof input?.target_id === 'string' && input.target_id.trim() ? input.target_id.trim() : '*';
  const model = typeof input?.model === 'string' && input.model.trim() ? input.model.trim() : '*';
  let creditAmount = optionalPositiveInteger(input?.credit_amount);
  let tokensPerCredit = optionalPositiveInteger(input?.tokens_per_credit);
  let minutesPerCredit = optionalPositiveInteger(input?.minutes_per_credit);
  let maxTokens = optionalPositiveInteger(input?.max_tokens);
  const isActive = input?.is_active === 0 ? 0 : input?.is_active === 1 || input?.is_active === undefined ? 1 : null;
  if (!featureType) return badRequest('feature_type is required');
  if (creditAmount === undefined || tokensPerCredit === undefined || minutesPerCredit === undefined || maxTokens === undefined || isActive === null) {
    return badRequest('Pricing values must be positive integers');
  }
  if (!['scanner', 'ai', 'course', 'resource', 'book', 'blog', 'consultation'].includes(featureType)) {
    return badRequest('feature_type không hợp lệ');
  }
  if (featureType === 'ai') {
    if (tokensPerCredit === null) return badRequest('AI cần cấu hình Tokens đổi 1 Credit');
    creditAmount = null;
    minutesPerCredit = null;
  } else if (featureType === 'consultation') {
    creditAmount = null;
    tokensPerCredit = null;
    minutesPerCredit = 1;
    maxTokens = null;
  } else {
    tokensPerCredit = null;
    minutesPerCredit = null;
    maxTokens = null;
    if (['scanner', 'course', 'book', 'blog'].includes(featureType)) creditAmount = 1;
  }
  if (creditAmount === null && tokensPerCredit === null && minutesPerCredit === null) {
    return badRequest('At least one pricing value is required');
  }

  const id = typeof input?.id === 'string' && input.id.trim() ? input.id.trim() : crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const current = await env.DB.prepare(
    `SELECT COALESCE(MAX("rule_version"), 0) AS "version" FROM "credit_pricing_rule"
     WHERE "feature_type" = ? AND "target_id" = ? AND "model" = ?`,
  ).bind(featureType, targetId, model).first<{ version: number }>();
  const version = (current?.version ?? 0) + 1;
  await env.DB.prepare(
    `INSERT INTO "credit_pricing_rule"
     ("id","feature_type","target_id","model","rule_version","credit_amount","tokens_per_credit","minutes_per_credit","max_tokens","is_active","effective_from","effective_until","created_at","updated_at")
     VALUES (?,?,?,?,?,?,?,?,?,?,?,NULL,?,?)`,
  ).bind(id, featureType, targetId, model, version, creditAmount, tokensPerCredit, minutesPerCredit, maxTokens, isActive, timestamp, timestamp, timestamp).run();
  return json({ id, rule_version: version }, 201);
};

export const DELETE: APIRoute = async ({ request }) => {
  const input = await request.json().catch(() => null) as { id?: unknown } | null;
  const id = typeof input?.id === 'string' && input.id.trim() ? input.id.trim() : null;
  if (!id) return badRequest('id is required');

  const existing = await env.DB.prepare('SELECT "id" FROM "credit_pricing_rule" WHERE "id" = ?').bind(id).first();
  if (!existing) return badRequest('Rule not found');

  await env.DB.prepare('DELETE FROM "credit_pricing_rule" WHERE "id" = ?').bind(id).run();
  return json({ success: true });
};
