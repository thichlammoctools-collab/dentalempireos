-- Per-feature model routing and richer operational telemetry.
ALTER TABLE "ai_settings" ADD COLUMN "motapis_scanner_model" TEXT;
ALTER TABLE "ai_settings" ADD COLUMN "motapis_chat_model" TEXT;
ALTER TABLE "ai_usage_log" ADD COLUMN "input_tokens" INTEGER;
ALTER TABLE "ai_usage_log" ADD COLUMN "output_tokens" INTEGER;
ALTER TABLE "ai_usage_log" ADD COLUMN "fallback_used" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ai_usage_log" ADD COLUMN "retrieval_chunks" INTEGER;
CREATE INDEX IF NOT EXISTS "idx_usage_feature_created" ON "ai_usage_log"("feature", "created_at" DESC);
