-- Separate the public Chat Assistant model from the AI Wizard model.
ALTER TABLE "ai_settings" ADD COLUMN "chat_provider_id" INTEGER;
ALTER TABLE "ai_settings" ADD COLUMN "chat_model_id" INTEGER;
