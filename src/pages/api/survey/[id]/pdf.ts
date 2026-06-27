import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getSurveyResponse } from '../../../../lib/survey-db';
import { generateSurveyPdf } from '../../../../lib/pdf-generator';

const SURVEY_APP_ID = 'survey-rootsgoc-1-app';
const SURVEY_PRODUCT_FALLBACK = 'survey-rootsgoc-1';

export const prerender = false;

// GET /api/survey/:id/pdf — download PDF report
// Requires unlock access via ai_application registry
export const GET: APIRoute = async ({ params }) => {
  const id = parseInt(params.id ?? '', 10);
  if (!id || Number.isNaN(id)) {
    return new Response('Invalid ID', { status: 400 });
  }

  const row = await getSurveyResponse(env.DB, id);
  if (!row) {
    return new Response('Survey not found', { status: 404 });
  }

  // Dynamic product resolution from ai_application registry
  let linkedProduct: { id: string } | null = null;
  try {
    linkedProduct = await env.DB
      .prepare('SELECT "id" FROM "product" WHERE "app_id" = ? AND "is_active" = 1 ORDER BY "price" DESC LIMIT 1')
      .bind(SURVEY_APP_ID)
      .first<{ id: string }>();
  } catch {
    // Table may not have app_id column yet — use fallback
  }
  const productId = linkedProduct?.id ?? SURVEY_PRODUCT_FALLBACK;

  // Check access: find user by survey email, then check access table
  let hasAccess = false;
  if (row.email) {
    const user = await env.DB
      .prepare('SELECT "id" FROM "user" WHERE "email" = ?')
      .bind(row.email)
      .first<{ id: string }>();

    if (user) {
      const access = await env.DB
        .prepare(
          `SELECT 1 FROM "access"
           WHERE "user_id" = ? AND "product_id" = ? AND "is_active" = 1
             AND ("expires_at" IS NULL OR "expires_at" > datetime('now'))
           LIMIT 1`,
        )
        .bind(user.id, productId)
        .first();
      hasAccess = !!access;
    }
  }

  if (!hasAccess) {
    return new Response(
      JSON.stringify({ error: 'unlock_required', product_id: productId }),
      {
        status: 402, // Payment Required
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const pdfBytes = await generateSurveyPdf(row);
    const fileName = `GocRe_${(row.clinic_name ?? 'survey').replace(/[^a-zA-Z0-9]/g, '-')}_${id}.pdf`;
    return new Response(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return new Response('PDF generation failed', { status: 500 });
  }
};
