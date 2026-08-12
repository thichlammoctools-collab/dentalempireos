-- Migration 0075: First-party funnel analytics and non-PII attribution.

CREATE TABLE IF NOT EXISTS "site_event" (
  "id" TEXT PRIMARY KEY,
  "anonymous_id" TEXT NOT NULL,
  "event_name" TEXT NOT NULL CHECK("event_name" IN ('page_view', 'cta_click', 'lead_submitted', 'consultation_submitted')),
  "page_path" TEXT NOT NULL,
  "props_json" TEXT NOT NULL DEFAULT '{}',
  "created_at" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_site_event_name_created"
  ON "site_event" ("event_name", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_site_event_anonymous_created"
  ON "site_event" ("anonymous_id", "created_at" DESC);

ALTER TABLE "consultation_request" ADD COLUMN "anonymous_id" TEXT;
ALTER TABLE "consultation_request" ADD COLUMN "source" TEXT;
ALTER TABLE "consultation_request" ADD COLUMN "referrer_host" TEXT;
ALTER TABLE "consultation_request" ADD COLUMN "utm_source" TEXT;
ALTER TABLE "consultation_request" ADD COLUMN "utm_medium" TEXT;
ALTER TABLE "consultation_request" ADD COLUMN "utm_campaign" TEXT;
ALTER TABLE "consultation_request" ADD COLUMN "utm_term" TEXT;
ALTER TABLE "consultation_request" ADD COLUMN "utm_content" TEXT;

ALTER TABLE "newsletter_subscriber" ADD COLUMN "anonymous_id" TEXT;
ALTER TABLE "newsletter_subscriber" ADD COLUMN "referrer_host" TEXT;
ALTER TABLE "newsletter_subscriber" ADD COLUMN "utm_source" TEXT;
ALTER TABLE "newsletter_subscriber" ADD COLUMN "utm_medium" TEXT;
ALTER TABLE "newsletter_subscriber" ADD COLUMN "utm_campaign" TEXT;
ALTER TABLE "newsletter_subscriber" ADD COLUMN "utm_term" TEXT;
ALTER TABLE "newsletter_subscriber" ADD COLUMN "utm_content" TEXT;

CREATE INDEX IF NOT EXISTS "idx_consultation_request_utm_source"
  ON "consultation_request" ("utm_source");
CREATE INDEX IF NOT EXISTS "idx_newsletter_subscriber_utm_source"
  ON "newsletter_subscriber" ("utm_source");
