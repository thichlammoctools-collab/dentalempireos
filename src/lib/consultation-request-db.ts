export const consultationInterestValues = ['guided', 'implementation', 'general'] as const;
export const consultationStatusValues = ['new', 'contacted', 'qualified', 'closed'] as const;

export type ConsultationInterest = (typeof consultationInterestValues)[number];
export type ConsultationStatus = (typeof consultationStatusValues)[number];

export interface ConsultationRequest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  clinic_name: string | null;
  team_size: string | null;
  service_interest: ConsultationInterest;
  message: string;
  status: ConsultationStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateConsultationRequestInput {
  name: string;
  phone: string;
  email: string | null;
  clinicName: string | null;
  teamSize: string | null;
  serviceInterest: ConsultationInterest;
  message: string;
  ipHash: string | null;
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

export async function createConsultationRequest(
  db: D1Database,
  input: CreateConsultationRequestInput,
): Promise<ConsultationRequest> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.prepare(
    `INSERT INTO "consultation_request"
      ("id", "name", "phone", "email", "clinic_name", "team_size", "service_interest", "message", "status", "ip_hash", "created_at", "updated_at")
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)`,
  ).bind(
    id,
    input.name,
    input.phone,
    input.email,
    input.clinicName,
    input.teamSize,
    input.serviceInterest,
    input.message,
    input.ipHash,
    now,
    now,
  ).run();

  return {
    id,
    name: input.name,
    phone: input.phone,
    email: input.email,
    clinic_name: input.clinicName,
    team_size: input.teamSize,
    service_interest: input.serviceInterest,
    message: input.message,
    status: 'new',
    created_at: now,
    updated_at: now,
  };
}

export async function checkConsultationRateLimit(
  db: D1Database,
  ipHash: string,
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const cutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count = 0 } = await db.prepare(
    `SELECT COUNT(*) AS "count" FROM "consultation_request"
     WHERE "ip_hash" = ? AND "created_at" > ?`,
  ).bind(ipHash, cutoff).first<{ count: number }>() ?? {};

  if (count < RATE_LIMIT_MAX) return { allowed: true };

  const oldest = await db.prepare(
    `SELECT "created_at" FROM "consultation_request"
     WHERE "ip_hash" = ? AND "created_at" > ?
     ORDER BY "created_at" ASC LIMIT 1`,
  ).bind(ipHash, cutoff).first<{ created_at: string }>();

  const retryAfterMs = oldest
    ? Math.max(0, new Date(oldest.created_at).getTime() + RATE_LIMIT_WINDOW_MS - Date.now())
    : RATE_LIMIT_WINDOW_MS;
  return { allowed: false, retryAfterMs };
}

export async function listConsultationRequests(
  db: D1Database,
  status?: ConsultationStatus,
): Promise<ConsultationRequest[]> {
  let sql = 'SELECT "id", "name", "phone", "email", "clinic_name", "team_size", "service_interest", "message", "status", "created_at", "updated_at" FROM "consultation_request"';
  const bindings: string[] = [];
  if (status) {
    sql += ' WHERE "status" = ?';
    bindings.push(status);
  }
  sql += ' ORDER BY "created_at" DESC';
  const { results } = await db.prepare(sql).bind(...bindings).all<ConsultationRequest>();
  return results ?? [];
}

export async function getConsultationRequest(
  db: D1Database,
  id: string,
): Promise<ConsultationRequest | null> {
  return db.prepare(
    'SELECT "id", "name", "phone", "email", "clinic_name", "team_size", "service_interest", "message", "status", "created_at", "updated_at" FROM "consultation_request" WHERE "id" = ?',
  ).bind(id).first<ConsultationRequest>();
}

export async function updateConsultationRequestStatus(
  db: D1Database,
  id: string,
  status: ConsultationStatus,
): Promise<void> {
  await db.prepare(
    'UPDATE "consultation_request" SET "status" = ?, "updated_at" = ? WHERE "id" = ?',
  ).bind(status, new Date().toISOString(), id).run();
}
