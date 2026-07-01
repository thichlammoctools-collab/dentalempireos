// Newsletter subscription helpers.
// Validates email, hashes IP for privacy-preserving rate limiting,
// and persists subscriber to D1.

export interface SubscribeOptions {
  email: string;
  source?: string;
  postSlug?: string;
  ip?: string;
}

// ── Email validation ──────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(email: string): string | null {
  if (!email || typeof email !== 'string') return 'Email là bắt buộc.';
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_RE.test(trimmed)) return 'Email không hợp lệ.';
  if (trimmed.length > 254) return 'Email quá dài.';
  return null; // valid
}

// ── IP hashing (privacy-preserving, no PII stored) ───────────

export async function hashIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(ip.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
}

// ── Rate limiting (5 submissions per IP per 10 minutes) ────────

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

export async function checkRateLimit(db: D1Database, ipHash: string): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const cutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

  const result = await db
    .prepare(
      `SELECT COUNT(*) as count FROM "newsletter_subscriber"
       WHERE "ip_hash" = ? AND "created_at" > ? AND "status" = 'active'`
    )
    .bind(ipHash, cutoff)
    .first<{ count: number }>();

  if (!result || result.count < RATE_LIMIT_MAX) {
    return { allowed: true };
  }

  // Find the oldest submission to calculate retry-after
  const oldest = await db
    .prepare(
      `SELECT "created_at" FROM "newsletter_subscriber"
       WHERE "ip_hash" = ? AND "created_at" > ? AND "status" = 'active'
       ORDER BY "created_at" ASC LIMIT 1`
    )
    .bind(ipHash, cutoff)
    .first<{ created_at: string }>();

  if (oldest) {
    const oldestMs = new Date(oldest.created_at).getTime();
    const retryAfterMs = oldestMs + RATE_LIMIT_WINDOW_MS - Date.now();
    return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs) };
  }

  return { allowed: false, retryAfterMs: RATE_LIMIT_WINDOW_MS };
}

// ── Subscribe ───────────────────────────────────────────────

export async function subscribe(db: D1Database, opts: SubscribeOptions): Promise<{
  success: boolean;
  alreadySubscribed?: boolean;
  error?: string;
}> {
  const email = opts.email.trim().toLowerCase();
  const source = opts.source ?? 'blog';

  // Check if already subscribed (active)
  const existing = await db
    .prepare(
      `SELECT "id", "status" FROM "newsletter_subscriber" WHERE "email" = ?`
    )
    .bind(email)
    .first<{ id: string; status: string }>();

  if (existing) {
    if (existing.status === 'unsubscribed') {
      // Re-subscribe
      await db
        .prepare(
          `UPDATE "newsletter_subscriber"
           SET "status" = 'active', "source" = ?, "post_slug" = COALESCE(?, "post_slug"),
               "ip_hash" = COALESCE(?, "ip_hash"), "unsubscribed_at" = NULL
           WHERE "email" = ?`
        )
        .bind(source, opts.postSlug ?? null, opts.ip ?? null, email)
        .run();
      return { success: true };
    }
    return { success: true, alreadySubscribed: true };
  }

  // Insert new subscriber
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO "newsletter_subscriber"
         ("id","email","source","post_slug","ip_hash","status","created_at")
       VALUES (?, ?, ?, ?, ?, 'active', ?)`
    )
    .bind(id, email, source, opts.postSlug ?? null, opts.ip ?? null, now)
    .run();

  return { success: true };
}

// ── Unsubscribe ──────────────────────────────────────────────

export async function unsubscribe(db: D1Database, email: string): Promise<boolean> {
  const result = await db
    .prepare(
      `UPDATE "newsletter_subscriber"
       SET "status" = 'unsubscribed', "unsubscribed_at" = ?
       WHERE "email" = ? AND "status" = 'active'`
    )
    .bind(new Date().toISOString(), email.trim().toLowerCase())
    .run();
  return result.meta?.changes !== undefined && result.meta.changes > 0;
}
