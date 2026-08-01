-- Optional OpenAI-compatible Motapis provider. API key remains a Worker secret.
ALTER TABLE "ai_settings" ADD COLUMN "ai_provider" TEXT NOT NULL DEFAULT 'cloudflare';
ALTER TABLE "ai_settings" ADD COLUMN "motapis_enabled" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ai_settings" ADD COLUMN "motapis_model" TEXT;
