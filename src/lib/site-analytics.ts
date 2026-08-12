export const TRACKABLE_EVENTS = ['page_view', 'cta_click', 'lead_submitted', 'consultation_submitted'] as const;
export type TrackableEvent = (typeof TRACKABLE_EVENTS)[number];

export interface Attribution {
  source: string | null;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
}

const MAX_ANONYMOUS_ID_LENGTH = 80;
const MAX_PATH_LENGTH = 500;
const MAX_PROP_KEYS = 8;
const MAX_PROP_KEY_LENGTH = 40;
const MAX_PROP_VALUE_LENGTH = 120;
const MAX_ATTRIBUTION_VALUE_LENGTH = 120;
const ALLOWED_PROP_KEYS = new Set(['cta_id', 'placement', 'resource_id', 'service_interest', 'lead_type']);
const ATTRIBUTION_KEYS = ['source', 'referrer_host', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

function boundedString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned && cleaned.length <= max ? cleaned : null;
}

export function sanitizeAnonymousId(value: unknown): string | null {
  const id = boundedString(value, MAX_ANONYMOUS_ID_LENGTH);
  return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : null;
}

export function sanitizePagePath(value: unknown): string | null {
  const path = boundedString(value, MAX_PATH_LENGTH);
  return path && path.startsWith('/') && !path.includes('://') ? path : null;
}

export function sanitizeEventProps(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const entries = Object.entries(value);
  if (entries.length > MAX_PROP_KEYS) return null;
  const props: Record<string, string> = {};
  for (const [key, raw] of entries) {
    if (!ALLOWED_PROP_KEYS.has(key) || key.length > MAX_PROP_KEY_LENGTH) return null;
    const cleaned = boundedString(raw, MAX_PROP_VALUE_LENGTH);
    if (!cleaned) return null;
    props[key] = cleaned;
  }
  return props;
}

export function sanitizeAttribution(value: unknown): Attribution {
  const payload = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const get = (key: string) => boundedString(payload[key], MAX_ATTRIBUTION_VALUE_LENGTH);
  return {
    source: get('source'),
    referrerHost: get('referrer_host'),
    utmSource: get('utm_source'),
    utmMedium: get('utm_medium'),
    utmCampaign: get('utm_campaign'),
    utmTerm: get('utm_term'),
    utmContent: get('utm_content'),
  };
}

export function readAttributionFromPayload(value: unknown): Attribution {
  const payload = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  const attribution: Record<string, unknown> = {};
  for (const key of ATTRIBUTION_KEYS) attribution[key] = payload[key];
  return sanitizeAttribution(attribution);
}

export async function recordSiteEvent(
  db: D1Database,
  input: { anonymousId: string; eventName: TrackableEvent; pagePath: string; props: Record<string, string> },
): Promise<void> {
  await db.prepare(
    `INSERT INTO "site_event" ("id", "anonymous_id", "event_name", "page_path", "props_json", "created_at")
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(
    crypto.randomUUID(),
    input.anonymousId,
    input.eventName,
    input.pagePath,
    JSON.stringify(input.props),
    new Date().toISOString(),
  ).run();
}
