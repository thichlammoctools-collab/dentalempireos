-- Phase 3: opaque guest access for the Total OS Diagnostic only.
CREATE TABLE IF NOT EXISTS "scanner_guest_report" (
  "id" TEXT PRIMARY KEY,
  "response_id" INTEGER NOT NULL UNIQUE REFERENCES "scanner_response"("id"),
  "token_hash" TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL,
  "owner_name" TEXT NOT NULL,
  "clinic_name" TEXT NOT NULL,
  "anonymous_id" TEXT,
  "referrer_host" TEXT,
  "utm_source" TEXT,
  "utm_medium" TEXT,
  "utm_campaign" TEXT,
  "utm_term" TEXT,
  "utm_content" TEXT,
  "expires_at" TEXT NOT NULL,
  "created_at" TEXT NOT NULL,
  "last_accessed_at" TEXT
);

CREATE INDEX IF NOT EXISTS "idx_scanner_guest_report_expiry"
  ON "scanner_guest_report"("expires_at");
CREATE INDEX IF NOT EXISTS "idx_scanner_guest_report_email"
  ON "scanner_guest_report"("email");

-- Hash-only request accounting; protects no-login report creation from abuse.
CREATE TABLE IF NOT EXISTS "scanner_guest_request" (
  "id" TEXT PRIMARY KEY,
  "ip_hash" TEXT NOT NULL,
  "created_at" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_scanner_guest_request_ip_created"
  ON "scanner_guest_request"("ip_hash", "created_at");
