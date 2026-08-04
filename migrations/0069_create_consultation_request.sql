-- Migration 0069: Store public consultation leads separately from commerce data.

-- Keep constraint checks deferred for this migration.
PRAGMA defer_foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "consultation_request" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "clinic_name" TEXT,
  "team_size" TEXT,
  "service_interest" TEXT NOT NULL CHECK("service_interest" IN ('guided', 'implementation', 'general')),
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'new' CHECK("status" IN ('new', 'contacted', 'qualified', 'closed')),
  "ip_hash" TEXT,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_consultation_request_status_created"
  ON "consultation_request" ("status", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_consultation_request_ip_created"
  ON "consultation_request" ("ip_hash", "created_at" DESC);
PRAGMA defer_foreign_keys = OFF;
