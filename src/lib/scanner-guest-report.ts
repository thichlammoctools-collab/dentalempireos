import { validateEmail } from './newsletter';
import type { Attribution } from './site-analytics';

const REPORT_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

export interface GuestReportRow {
  response_id: number;
  email: string;
  expires_at: string;
}

function normalizeRequiredText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned && cleaned.length <= max ? cleaned : null;
}

export function validateGuestLead(value: Record<string, unknown>): { email: string; ownerName: string | null; clinicName: string } | null {
  const email = normalizeRequiredText(value.email, 254)?.toLowerCase() ?? null;
  const ownerName = typeof value.owner_name === 'string' && value.owner_name.trim()
    ? normalizeRequiredText(value.owner_name, 120)
    : null;
  const hasInvalidOwnerName = value.owner_name != null && ownerName === null && value.owner_name !== '';
  const clinicName = normalizeRequiredText(value.clinic_name, 160);
  return email && !validateEmail(email) && clinicName && !hasInvalidOwnerName
    ? { email, ownerName, clinicName }
    : null;
}

export async function hashOpaqueToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createGuestReport(db: D1Database, input: {
  responseId: number;
  email: string;
  ownerName: string | null;
  clinicName: string;
  anonymousId: string | null;
  attribution: Attribution;
}): Promise<{ token: string; expiresAt: string }> {
  const token = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '');
  const expiresAt = new Date(Date.now() + REPORT_TTL_MS).toISOString();
  await db.prepare(
    `INSERT INTO "scanner_guest_report"
     ("id", "response_id", "token_hash", "email", "owner_name", "clinic_name", "anonymous_id", "referrer_host", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "expires_at", "created_at")
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    crypto.randomUUID(), input.responseId, await hashOpaqueToken(token), input.email, input.ownerName ?? '', input.clinicName,
    input.anonymousId, input.attribution.referrerHost, input.attribution.utmSource, input.attribution.utmMedium,
    input.attribution.utmCampaign, input.attribution.utmTerm, input.attribution.utmContent, expiresAt, new Date().toISOString(),
  ).run();
  return { token, expiresAt };
}

export async function getGuestReportByToken(db: D1Database, token: string): Promise<GuestReportRow | null> {
  if (!/^[a-f0-9]{64}$/i.test(token)) return null;
  const report = await db.prepare(
    `SELECT "response_id", "email", "expires_at" FROM "scanner_guest_report"
     WHERE "token_hash" = ? AND "expires_at" > ?`,
  ).bind(await hashOpaqueToken(token), new Date().toISOString()).first<GuestReportRow>();
  if (report) {
    await db.prepare('UPDATE "scanner_guest_report" SET "last_accessed_at" = ? WHERE "response_id" = ?')
      .bind(new Date().toISOString(), report.response_id).run();
  }
  return report ?? null;
}

export async function checkGuestRequestRateLimit(db: D1Database, ipHash: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const current = await db.prepare(
    'SELECT COUNT(*) AS count FROM "scanner_guest_request" WHERE "ip_hash" = ? AND "created_at" > ?',
  ).bind(ipHash, cutoff).first<{ count: number }>();
  if ((current?.count ?? 0) >= RATE_LIMIT_MAX) return false;
  await db.prepare('INSERT INTO "scanner_guest_request" ("id", "ip_hash", "created_at") VALUES (?, ?, ?)')
    .bind(crypto.randomUUID(), ipHash, new Date().toISOString()).run();
  return true;
}
