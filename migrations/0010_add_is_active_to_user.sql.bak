-- Migration 0010: Add is_active column to user table
-- This flags whether a user's subscription/membership is activated by admin

ALTER TABLE "user" ADD COLUMN "is_active" integer NOT NULL DEFAULT 0;
