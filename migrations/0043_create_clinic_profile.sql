-- Migration: 0043_create_clinic_profile
-- Stores reusable clinic/owner profile per user (1-to-1 with user.id).

CREATE TABLE IF NOT EXISTS "clinic_profile" (
  "id" text NOT NULL PRIMARY KEY,       -- same as user.id (1-to-1)
  "name" text,                          -- owner/display name
  "clinic_name" text,
  "clinic_address" text,
  "phone" text,
  "logo_url" text,                      -- R2 key: logos/{userId}.{ext}
  "updated_at" text NOT NULL DEFAULT (datetime('now'))
);

-- Auto-update updated_at on row update
CREATE TRIGGER IF NOT EXISTS clinic_profile_updated
AFTER UPDATE ON "clinic_profile"
BEGIN
  UPDATE "clinic_profile" SET "updated_at" = datetime('now') WHERE "id" = OLD."id";
END;
