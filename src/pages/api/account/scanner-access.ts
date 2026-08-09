import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { canAccessScanner } from '../../../lib/entitlement-check';
import { listSurveyDefinitions } from '../../../lib/survey-config-db';
import { getActiveCreditPricingRule } from '../../../lib/credit-db';
import { getScannerUsage } from '../../../lib/scanner-history-db';

export const prerender = false;

// GET /api/account/scanner-access — list all scanners with user's access status
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ items: [] });

  const surveys = await listSurveyDefinitions(env.DB, { status: 'active' });

  const items = await Promise.all(
    surveys.map(async (s) => {
      const [hasAccess, pricing, usage] = await Promise.all([
        canAccessScanner(env.DB, locals.user!.id, s.id).catch(() => false),
        getActiveCreditPricingRule(env.DB, 'scanner', s.id),
        getScannerUsage(env.DB, locals.user!.id, s.id),
      ]);

      return {
        id: s.id,
        slug: s.slug,
        title: s.title_vi,
        has_access: hasAccess,
        free_attempts_remaining: usage.remaining,
        credits_per_attempt: pricing?.credit_amount ?? null,
      };
    }),
  );

  return json({ items });
};
