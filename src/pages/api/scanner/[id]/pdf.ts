// Authenticated API: Download the consolidated A4 PDF report for a scanner response.
// GET /api/scanner/[id]/pdf

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { getScannerResponse } from '../../../../lib/scanner-response-db';
import { generateScannerPdf } from '../../../../lib/scanner-pdf';
import { isResponseOwnedByUser } from '../../../../lib/scanner-history-db';
import { getUserByEmail } from '../../../../lib/user-db';
import { createAuth } from '../../../../lib/auth';
import { getClinicProfile } from '../../../../lib/clinic-profile-db';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const id = parseInt(params.id ?? '', 10);
  if (!id) return badRequest('id is required');

  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'Vui lòng đăng nhập' }, 401);

  const response = await getScannerResponse(env.DB, id);
  if (!response) return notFound('Response not found');

  const owned = await isResponseOwnedByUser(env.DB, session.user.id, id);
  const ownsByEmail = response.email
    ? (await getUserByEmail(env.DB, response.email))?.id === session.user.id
    : false;
  if (!owned && !ownsByEmail) return json({ error: 'Không có quyền với kết quả này' }, 403);

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
           INNER JOIN "product_scanner" ps ON p.id = ps.product_id
           WHERE a.user_id = ? AND a.is_active = 1
             AND (a.expires_at IS NULL OR a.expires_at > datetime('now'))
             AND ps.scanner_id = ?
           LIMIT 1`,
        )
        .bind(user.id, response.survey_id)
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
    const clinicProfile = await getClinicProfile(env.DB, session.user.id);
    let logo: Uint8Array | undefined;
    let logoType: 'image/png' | 'image/jpeg' | undefined;
    if (clinicProfile?.logo_url) {
      const key = clinicProfile.logo_url.replace('/media/', '');
      const object = await env.MEDIA.get(key);
      const contentType = object?.httpMetadata?.contentType;
      if (object && (contentType === 'image/png' || contentType === 'image/jpeg')) {
        logo = new Uint8Array(await object.arrayBuffer());
        logoType = contentType;
      }
    }
    const pdfBytes = await generateScannerPdf(env.DB, response, {
      logo,
      logoType,
      phone: clinicProfile?.phone,
    });
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
