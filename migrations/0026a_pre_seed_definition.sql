-- Pre-seed: ensure survey_definition row exists before data migration 0026.
-- Idempotent: INSERT OR IGNORE skips if already exists.
-- Run this BEFORE migration 0026 if no seed has been done yet.

INSERT OR IGNORE INTO "survey_definition"
  ("id","slug","title_vi","title_en","status","is_free","survey_type","order_index","created_at","updated_at")
VALUES (
  'ho-so-goc-re',
  'ho-so-goc-re',
  'Hồ Sơ Gốc Rễ',
  'Roots Profile',
  'active',
  0,
  'full',
  0,
  datetime('now'),
  datetime('now')
);