-- Keep the retrieval embedding model separate from the public chat model.
ALTER TABLE "ai_settings" ADD COLUMN "embedding_provider_id" INTEGER;
ALTER TABLE "ai_settings" ADD COLUMN "embedding_model_id" INTEGER;
