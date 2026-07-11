-- Migration 0053: Add lastActiveAt column for activity tracking
-- Required by better-auth dash() plugin activityTracking feature
-- Tracks when each user was last active (updated by better-auth on each request)

ALTER TABLE "user" ADD COLUMN "lastActiveAt" date;
