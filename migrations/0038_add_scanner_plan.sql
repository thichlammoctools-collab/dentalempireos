-- Migration: 0038_add_scanner_plan
-- Adds ai_plan column for free 30-day action plan content.
-- The plan is AI-generated asynchronously after submission and shown free to all users.

ALTER TABLE "scanner_response" ADD COLUMN "ai_plan" text;
