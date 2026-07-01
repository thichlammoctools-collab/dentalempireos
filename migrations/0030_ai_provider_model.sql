-- Multi-provider AI: ai_provider + ai_model tables
-- Allows per-app model selection between Anthropic and OpenAI.

CREATE TABLE IF NOT EXISTS "ai_provider" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "base_url" TEXT NOT NULL,
  "api_key" TEXT NOT NULL DEFAULT '',
  "is_active" INTEGER NOT NULL DEFAULT 0,
  "is_default" INTEGER NOT NULL DEFAULT 0,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS "ai_model" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "provider_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "model_id" TEXT NOT NULL,
  "max_tokens" INTEGER DEFAULT 8192,
  "is_active" INTEGER NOT NULL DEFAULT 1,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY ("provider_id") REFERENCES "ai_provider"("id"),
  UNIQUE("provider_id", "model_id")
);

-- Seed default providers
INSERT OR IGNORE INTO "ai_provider" ("name", "slug", "base_url", "is_active", "is_default")
VALUES
  ('Anthropic (Claude)', 'anthropic', 'https://api.anthropic.com', 0, 1),
  ('OpenAI (GPT)', 'openai', 'https://api.openai.com/v1', 1, 0);

-- Seed default models per provider
INSERT OR IGNORE INTO "ai_model" ("provider_id", "name", "model_id", "max_tokens")
SELECT 1, 'Claude Opus 4', 'claude-opus-4-8', 8192 WHERE EXISTS (SELECT 1 FROM "ai_provider" WHERE "slug"='anthropic');

INSERT OR IGNORE INTO "ai_model" ("provider_id", "name", "model_id", "max_tokens")
SELECT 1, 'Claude Sonnet 4', 'claude-sonnet-4-6', 8192 WHERE EXISTS (SELECT 1 FROM "ai_provider" WHERE "slug"='anthropic');

INSERT OR IGNORE INTO "ai_model" ("provider_id", "name", "model_id", "max_tokens")
SELECT 2, 'GPT-4o', 'gpt-4o', 16384 WHERE EXISTS (SELECT 1 FROM "ai_provider" WHERE "slug"='openai');

INSERT OR IGNORE INTO "ai_model" ("provider_id", "name", "model_id", "max_tokens")
SELECT 2, 'GPT-4.5', 'gpt-4.5', 16384 WHERE EXISTS (SELECT 1 FROM "ai_provider" WHERE "slug"='openai');
