-- AI Settings (single-row, managed via admin panel)
-- Stores Anthropic-compatible API config for survey analysis.

CREATE TABLE IF NOT EXISTS "ai_settings" (
  "id"            integer PRIMARY KEY CHECK ("id" = 1),
  "base_url"      text NOT NULL DEFAULT 'https://api.anthropic.com',
  "api_key"       text NOT NULL DEFAULT '',
  "model"         text NOT NULL DEFAULT 'claude-sonnet-4-6',
  "max_tokens"    integer NOT NULL DEFAULT 4096,
  "is_active"     integer NOT NULL DEFAULT 0,
  "updated_at"    text NOT NULL
);

INSERT OR IGNORE INTO "ai_settings" ("id","base_url","api_key","model","max_tokens","is_active","updated_at")
VALUES (1, 'https://api.anthropic.com', '', 'claude-sonnet-4-6', 4096, 0, '2026-01-01T00:00:00.000Z');
