import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../../lib/api-helpers';
import {
  consultationStatusValues,
  listConsultationRequests,
  type ConsultationStatus,
} from '../../../../lib/consultation-request-db';

export const prerender = false;

// GET /api/admin/consultation-requests — admin-only via middleware.
export const GET: APIRoute = async ({ url }) => {
  const status = url.searchParams.get('status');
  if (status && status !== 'active' && !consultationStatusValues.includes(status as ConsultationStatus)) {
    return badRequest('Trạng thái không hợp lệ.');
  }
  return json(await listConsultationRequests(env.DB, status as ConsultationStatus | 'active' | undefined));
};
