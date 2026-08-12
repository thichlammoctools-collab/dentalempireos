-- Add columns to store AI-generated image R2 keys for scanner results.
ALTER TABLE "scanner_response" ADD COLUMN "image_analysis_key" TEXT;
ALTER TABLE "scanner_response" ADD COLUMN "image_plan_key" TEXT;
