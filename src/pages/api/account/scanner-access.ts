import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { hasAccess } from '../../../lib/payos-db';
import { listSurveyDefinitions } from '../../../lib/survey-config-db';

export const prerender = false;

// GET /api/account/scanner-access — list all scanners with user's access status
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ items: [] });

  const surveys = await listSurveyDefinitions(env.DB, { status: 'active' });

  const items = await Promise.all(
    surveys.map(async (s) => {
      let productPrice: number | null = null;
      let productId: string | null = null;
      try {
        const app = await env.DB
          .prepare('SELECT "id" FROM "ai_application" WHERE "slug" = ? OR "id" = ?')
          .bind(s.slug, `survey-${s.id}`)
          .first<{ id: string }>();
        if (app) {
          const prod = await env.DB
            .prepare('SELECT "id", "price" FROM "product" WHERE "app_id" = ? AND "is_active" = 1')
            .bind(app.id)
            .first<{ id: string; price: number }>();
          if (prod) {
            productId = prod.id;
            productPrice = prod.price;
          }
        }
      } catch { /* ignore */ }

      const has_access = productId
        ? await hasAccess(env.DB, locals.user!.id, productId)
        : false;

      return {
        id: s.id,
        slug: s.slug,
        title: s.title_vi,
        is_free: s.is_free === 1,
        has_access,
        price: productPrice,
      };
    }),
  );

  return json({ items });
};
