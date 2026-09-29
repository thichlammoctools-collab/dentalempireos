import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../lib/api-helpers';
import {
  deleteCreditPricingRule,
  insertCreditPricingRule,
  listCreditPricingRules,
  updateCreditPricingRule,
} from '../../../lib/credit-db';

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
  return json(await listCreditPricingRules(env.DB));
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
  if (!['scanner', 'course', 'resource', 'blog'].includes(featureType)) {
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
    if (creditAmount === null) return badRequest('Giá Credits là bắt buộc cho tính năng này');
  }
  if (creditAmount === null && tokensPerCredit === null && minutesPerCredit === null) {
    return badRequest('At least one pricing value is required');
  }

  const existingId = typeof input?.id === 'string' && input.id.trim() ? input.id.trim() : null;
  const values = {
    featureType, targetId, model,
    creditAmount, tokensPerCredit, minutesPerCredit, maxTokens,
    isActive,
  };
  if (existingId) {
    const updated = await updateCreditPricingRule(env.DB, existingId, values);
    if (!updated) return badRequest('Rule not found');
    return json({ id: existingId, updated: true });
  }

  const created = await insertCreditPricingRule(env.DB, values);
  return json({ id: created.id, rule_version: created.ruleVersion }, 201);
};

export const DELETE: APIRoute = async ({ request }) => {
  const input = await request.json().catch(() => null) as { id?: unknown } | null;
  const id = typeof input?.id === 'string' && input.id.trim() ? input.id.trim() : null;
  if (!id) return badRequest('id is required');

  if (!(await deleteCreditPricingRule(env.DB, id))) return badRequest('Rule not found');
  return json({ success: true });
};

