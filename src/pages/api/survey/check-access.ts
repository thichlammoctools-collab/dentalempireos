import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';

export const prerender = false;

// GET /api/survey/check-access?id={surveyId}&product_id={productId}
// Public endpoint — no auth required. Identifies by email from survey response.
export const GET: APIRoute = async ({ url }) => {
  const surveyId = parseInt(url.searchParams.get('id') ?? '');
  const productId = url.searchParams.get('product_id');

  if (!surveyId || !productId) {
    return json({ hasAccess: false, reason: 'missing_params' }, 400);
  }

  // 1. Get the survey response to find user email
  const survey = await env.DB
    .prepare('SELECT "email" FROM "survey_responses" WHERE "id" = ?')
    .bind(surveyId)
    .first<{ email: string | null }>();

  if (!survey?.email) {
    return json({ hasAccess: false, reason: 'no_email' });
  }

  // 2. Find user by email
  const user = await env.DB
    .prepare('SELECT "id" FROM "user" WHERE "email" = ?')
    .bind(survey.email)
    .first<{ id: string }>();

  if (!user) {
    return json({ hasAccess: false, reason: 'no_user' });
  }

  // 3. Check access for this product
  const access = await env.DB
    .prepare(
      `SELECT 1 FROM "access"
       WHERE "user_id" = ? AND "product_id" = ? AND "is_active" = 1
         AND ("expires_at" IS NULL OR "expires_at" > datetime('now'))
       LIMIT 1`,
    )
    .bind(user.id, productId)
    .first();

  return json({ hasAccess: !!access });
};
