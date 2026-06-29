// Public API: Download PDF report for a scanner response.
// GET /api/scanner/[id]/pdf

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { getScannerResponse } from '../../../../lib/scanner-response-db';
import { generateScannerPdf } from '../../../../lib/scanner-pdf';

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  const id = parseInt(params.id ?? '', 10);
  if (!id) return badRequest('id is required');

  const response = await getScannerResponse(env.DB, id);
  if (!response) return notFound('Response not found');

  // Access check: if scanner is paid, user must have access
  const definition = await env.DB
    .prepare('SELECT id, slug, is_free FROM "survey_definition" WHERE id = ?')
    .bind(response.survey_id)
    .first<{ id: string; slug: string; is_free: number }>();

  if (definition && definition.is_free === 0 && response.email) {
    // Look up user + active access for any product of this scanner
    const user = await env.DB
      .prepare('SELECT id FROM "user" WHERE email = ? LIMIT 1')
      .bind(response.email)
      .first<{ id: string }>();

    if (user) {
      const access = await env.DB
        .prepare(
          `SELECT a.id
           FROM "access" a
           INNER JOIN "product" p ON a.product_id = p.id
           INNER JOIN "ai_application" app ON p.app_id = app.id
           WHERE a.user_id = ? AND a.is_active = 1
             AND (a.expires_at IS NULL OR a.expires_at > datetime('now'))
             AND (app.slug = ? OR app.id = ?)
           LIMIT 1`,
        )
        .bind(user.id, definition.slug, `survey-${definition.id}`)
        .first<{ id: string }>();

      if (!access) {
        return new Response('Payment required', { status: 402 });
      }
    } else {
      return new Response('Payment required', { status: 402 });
    }
  }

  // Generate PDF
  try {
    const pdfBytes = await generateScannerPdf(env.DB, response);
    const filename = `scanner-${definition?.slug ?? id}-${id}.pdf`;
    return new Response(pdfBytes as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBytes.length),
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : 'PDF generation failed' },
      500,
    );
  }
};