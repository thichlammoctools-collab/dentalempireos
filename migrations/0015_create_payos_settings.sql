-- PayOS gateway configuration (single-row settings table)
-- Stores API credentials and webhook config, managed via admin panel.
-- Credentials are stored as-is; admin must keep them secure.

CREATE TABLE IF NOT EXISTS "payos_settings" (
  "id"            integer PRIMARY KEY CHECK ("id" = 1),
  "client_id"     text NOT NULL DEFAULT '',
  "api_key"       text NOT NULL DEFAULT '',
  "checksum_key"  text NOT NULL DEFAULT '',
  "webhook_url"   text NOT NULL DEFAULT '',
  "sandbox_mode"  integer NOT NULL DEFAULT 1,  -- 1 = sandbox, 0 = production
  "is_active"     integer NOT NULL DEFAULT 0,  -- 1 = PayOS integration enabled
  "updated_at"    text NOT NULL
);

-- Seed the single default row
INSERT OR IGNORE INTO "payos_settings" ("id","client_id","api_key","checksum_key","webhook_url","sandbox_mode","is_active","updated_at")
VALUES (1, '', '', '', '', 1, 0, '2026-01-01T00:00:00.000Z');
