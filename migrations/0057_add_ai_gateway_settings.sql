-- Central Cloudflare AI Gateway configuration. Credentials remain Worker secrets.
ALTER TABLE "ai_settings" ADD COLUMN "gateway_enabled" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ai_settings" ADD COLUMN "gateway_account_id" TEXT;
ALTER TABLE "ai_settings" ADD COLUMN "gateway_id" TEXT NOT NULL DEFAULT 'default';
ALTER TABLE "ai_settings" ADD COLUMN "gateway_default_model" TEXT;
ALTER TABLE "ai_settings" ADD COLUMN "gateway_chat_model" TEXT;
ALTER TABLE "ai_settings" ADD COLUMN "gateway_embedding_model" TEXT;
