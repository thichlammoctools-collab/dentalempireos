import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json, notFound } from '../../../../lib/api-helpers';
import {
  consultationStatusValues,
  getConsultationRequest,
  updateConsultationRequestStatus,
  type ConsultationStatus,
} from '../../../../lib/consultation-request-db';

export const prerender = false;

// PATCH /api/admin/consultation-requests/[id] — update a lead's workflow status.
export const PATCH: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return notFound();
  const consultationRequest = await getConsultationRequest(env.DB, id);
  if (!consultationRequest) return notFound('Không tìm thấy yêu cầu tư vấn.');

  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return badRequest('Content-Type phải là application/json.');
  }
  const body = await request.json().catch(() => null) as { status?: unknown } | null;
  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length !== 1 || typeof body.status !== 'string') {
    return badRequest('status là bắt buộc.');
  }
  if (!consultationStatusValues.includes(body.status as ConsultationStatus)) {
    return badRequest(`status phải là một trong: ${consultationStatusValues.join(', ')}`);
  }

  const status = body.status as ConsultationStatus;
  if (status !== consultationRequest.status) {
    await updateConsultationRequestStatus(env.DB, id, status);
  }
  return json({ ok: true, status });
};
