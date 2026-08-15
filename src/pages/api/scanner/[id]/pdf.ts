// Authenticated API: Download the consolidated A4 PDF report for a scanner response.
// GET /api/scanner/[id]/pdf

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { generateScannerPdf, type ScannerPdfType } from '../../../../lib/scanner-pdf';
import {
  claimRetainedScannerPdfLease,
  createScannerPdfArtifactIntent,
  persistScannerPdfKeyForLease,
  releaseScannerResponseOperationLease,
  renewRetainedScannerResponseOperationLease,
  buildScannerPdfArtifactKey,
  isScannerPdfArtifactKeyForLayout,
} from '../../../../lib/scanner-response-operation-fence';
import { getRetainedScannerResponseForOwner } from '../../../../lib/scanner-history-db';
import { createAuth } from '../../../../lib/auth';
import { getClinicProfile } from '../../../../lib/clinic-profile-db';
import { canAccessScanner } from '../../../../lib/entitlement-check';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const id = parseInt(params.id ?? '', 10);
  if (!id) return badRequest('id is required');

  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'Vui lòng đăng nhập' }, 401);

  const response = await getRetainedScannerResponseForOwner(env.DB, session.user.id, id);
  // Keep foreign, missing, and expired reports non-enumerating on raw/PDF APIs.
  if (!response) return notFound('Response not found');

  const requestedType = new URL(request.url).searchParams.get('type');
  const type: ScannerPdfType = requestedType === 'plan' || requestedType === 'analysis' ? requestedType : 'combined';
  if (type === 'plan' && !response.ai_plan?.trim()) return json({ error: 'Kế hoạch 30 ngày chưa sẵn sàng.' }, 409);
  if (type === 'analysis' && !response.ai_analysis?.trim()) return json({ error: 'Bản soi chiếu hệ thống chưa sẵn sàng.' }, 409);
  if (type === 'combined' && (!response.ai_plan?.trim() || !response.ai_analysis?.trim())) {
    return json({ error: 'Hoàn tất kế hoạch và bản soi chiếu AI để xuất báo cáo tổng hợp.' }, 409);
  }

  if (!await canAccessScanner(env.DB, session.user.id, response.survey_id)) {
     return json({ error: 'Scanner này yêu cầu nâng cấp dịch vụ.', upgradeUrl: '/dich-vu', upgrade_url: '/dich-vu' }, 402);
  }

  const cachedKey = type === 'combined' ? response.pdf_combined_key : type === 'plan' ? response.pdf_plan_key : response.pdf_analysis_key;
  const pdfLayoutVersion = type === 'analysis' ? 'v1' : 'v5';
  if (cachedKey && isScannerPdfArtifactKeyForLayout(cachedKey, type, pdfLayoutVersion)) {
    // R2 is not an authorization source. Revalidate immediately before serving
    // a cached artifact so an expiry/purge race cannot disclose the report.
    const current = await getRetainedScannerResponseForOwner(env.DB, session.user.id, id);
    if (!current) return notFound('Response not found');
    const currentKey = type === 'combined' ? current.pdf_combined_key : type === 'plan' ? current.pdf_plan_key : current.pdf_analysis_key;
    if (currentKey === cachedKey) {
      const cached = await env.MEDIA.get(cachedKey);
      if (cached && await getRetainedScannerResponseForOwner(env.DB, session.user.id, id)) {
        return new Response(cached.body, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${cachedKey.split('/').pop()}"`, 'Cache-Control': 'private, max-age=3600' } });
      }
    }
  }

  // Claim before expensive generation. This is the retention/write fence and
  // serializes concurrent requests for the same response artifact.
  const lease = await claimRetainedScannerPdfLease(env.DB, id, session.user.id, type);
  if (!lease) {
    // A concurrent generator may have completed while we claimed. Re-read via
    // the ownership/retention path rather than generating an untracked object.
    const current = await getRetainedScannerResponseForOwner(env.DB, session.user.id, id);
    const currentKey = current && (type === 'combined' ? current.pdf_combined_key : type === 'plan' ? current.pdf_plan_key : current.pdf_analysis_key);
    if (currentKey && isScannerPdfArtifactKeyForLayout(currentKey, type, pdfLayoutVersion)) {
      const cached = await env.MEDIA.get(currentKey);
      if (cached && await getRetainedScannerResponseForOwner(env.DB, session.user.id, id)) {
        return new Response(cached.body, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${currentKey.split('/').pop()}"`, 'Cache-Control': 'private, max-age=3600' } });
      }
    }
    return current ? json({ error: 'PDF generation is already in progress.' }, 409) : notFound('Response not found');
  }

  let uploadedKey: string | null = null;
  let intentKey: string | null = null;
  try {
    // The profile/logo fetch and PDF render can be costly. A failed heartbeat is
    // terminal for this request: do not upload or return bytes after retention wins.
    if (!await renewRetainedScannerResponseOperationLease(env.DB, id, session.user.id, lease)) return notFound('Response not found');
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
    }, type);
    if (!await renewRetainedScannerResponseOperationLease(env.DB, id, session.user.id, lease)) return notFound('Response not found');

    const filename = `scanner-${response.survey_id}-${type}-${id}.pdf`;
    const retentionPrefix = response.retention_tier === 'guest'
      ? 'guest'
      : response.retention_tier === 'credit_paid'
        ? 'paid'
        : 'free';
    // Every write receives a non-reusable lease token segment. A stale writer
    // therefore cannot overwrite a newer artifact or share its cleanup key.
    const key = buildScannerPdfArtifactKey(
      `scanner-artifacts/${retentionPrefix}/${session.user.id}/${id}`,
      type,
      pdfLayoutVersion,
      lease.token,
    );
    // Intent is durable before the non-transactional R2 write. If this isolate
    // dies after put, the purge worker sees and deletes the otherwise-orphan key.
    if (!await createScannerPdfArtifactIntent(env.DB, id, session.user.id, key, lease)) return notFound('Response not found');
    intentKey = key;
    if (!await renewRetainedScannerResponseOperationLease(env.DB, id, session.user.id, lease)) {
      // Leave the intent for reconciliation. It is harmless if no put occurred,
      // but is the only durable handle if the platform completes a stale write.
      return notFound('Response not found');
    }
    await env.MEDIA.put(key, pdfBytes, { httpMetadata: { contentType: 'application/pdf', contentDisposition: `attachment; filename="${filename}"` } });
    uploadedKey = key;
    if (!await renewRetainedScannerResponseOperationLease(env.DB, id, session.user.id, lease)
      || !await persistScannerPdfKeyForLease(env.DB, id, session.user.id, type, key, lease)) {
      // Keep the durable intent even if the compensating delete succeeds: R2
      // cannot rule out an arbitrarily late stale put. Reconciliation promotes
      // the intent to an indefinite tombstone after this lease releases.
      await env.MEDIA.delete(key).catch((deleteError) => {
        console.error('[scanner-pdf] compensating delete failed:', deleteError);
      });
      uploadedKey = null;
      return notFound('Response not found');
    }
    intentKey = null;
    // One final retained check closes the persistence-to-response race.
    if (!await getRetainedScannerResponseForOwner(env.DB, session.user.id, id)) return notFound('Response not found');
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
    if (uploadedKey) {
      await env.MEDIA.delete(uploadedKey).catch((deleteError) => {
        console.error('[scanner-pdf] compensating delete failed:', deleteError);
      });
    } else if (intentKey) {
      // Do not remove the sole durable write handle after a failed/ambiguous put.
      // Reconciliation promotes it to an indefinite tombstone after the lease.
      console.warn('[scanner-pdf] retaining unresolved write intent for reconciliation', { key: intentKey });
    }
    return json(
      { error: err instanceof Error ? err.message : 'PDF generation failed' },
      500,
    );
  } finally {
    await releaseScannerResponseOperationLease(env.DB, id, lease).catch((releaseError) => {
      console.error('[scanner-pdf] failed to release response operation lease:', releaseError);
    });
  }
};
