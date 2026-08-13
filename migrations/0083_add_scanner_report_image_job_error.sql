-- Retain provider failures so image generation problems can be diagnosed and retried.
ALTER TABLE "scanner_report_image_job" ADD COLUMN "error_message" TEXT;
