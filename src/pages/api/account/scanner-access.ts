import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { hasAccess, getScannerProductMapping, getScannerPriceMapping } from '../../../lib/payos-db';
import { listSurveyDefinitions } from '../../../lib/survey-config-db';

export const prerender = false;

// GET /api/account/scanner-access — list all scanners with user's access status
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ items: [] });

  const [surveys, scannerProductMap, scannerPriceMap] = await Promise.all([
    listSurveyDefinitions(env.DB, { status: 'active' }),
    getScannerProductMapping(env.DB),
    getScannerPriceMapping(env.DB),
  ]);

  const items = await Promise.all(
    surveys.map(async (s) => {
      const productId = scannerProductMap.get(s.id) ?? null;
      const price = scannerPriceMap.get(s.id) ?? null;

      let has_access = false;
      if (productId) {
        try {
          has_access = await hasAccess(env.DB, locals.user!.id, productId);
        } catch { /* fail-safe */ }
      }

      return {
        id: s.id,
        slug: s.slug,
        title: s.title_vi,
        is_free: s.is_free === 1,
        has_access,
        price,
        product_id: productId,
      };
    }),
  );

  return json({ items });
};
