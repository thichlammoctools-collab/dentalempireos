-- AI usage log for request counting (no token/cost tracking per user decision).

CREATE TABLE IF NOT EXISTS "ai_usage_log" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "provider_id" TEXT NOT NULL,
  "model_id" TEXT NOT NULL,
  "user_id" TEXT REFERENCES "user"("id"),
  "session_id" TEXT,
  "feature" TEXT NOT NULL,  -- scanner_analysis | scanner_plan | mentor_chat | app_chat | app_run | wizard
  "success" INTEGER NOT NULL DEFAULT 1,
  "error_message" TEXT,
  "latency_ms" INTEGER,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS "idx_usage_provider" ON "ai_usage_log"("provider_id");
CREATE INDEX IF NOT EXISTS "idx_usage_user" ON "ai_usage_log"("user_id");
CREATE INDEX IF NOT EXISTS "idx_usage_created" ON "ai_usage_log"("created_at" DESC);

ALTER TABLE "ai_provider" ADD COLUMN "rate_limit_per_hour" INTEGER DEFAULT 1000;
ALTER TABLE "ai_provider" ADD COLUMN "budget_usd" REAL;
ALTER TABLE "ai_provider" ADD COLUMN "budget_alert_sent_at" TEXT;
