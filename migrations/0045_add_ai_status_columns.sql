-- Migration: 0045_add_ai_status_columns
-- Tracks AI generation status for analysis and plan separately.
-- Values: 'pending' | 'running' | 'done' | 'failed'

ALTER TABLE "scanner_response" ADD COLUMN "ai_analysis_status" TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE "scanner_response" ADD COLUMN "ai_plan_status" TEXT NOT NULL DEFAULT 'pending';
