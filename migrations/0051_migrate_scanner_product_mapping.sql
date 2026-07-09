-- Migrate existing scanner↔product links to the new product_scanner table.
-- Products with app_id get their scanners from ai_application.linked_scanner_id.

INSERT OR IGNORE INTO "product_scanner" ("product_id", "scanner_id", "assigned_at")
SELECT DISTINCT p.id, app.linked_scanner_id, datetime('now')
FROM "product" p
JOIN "ai_application" app ON p.app_id = app.id
WHERE app.linked_scanner_id IS NOT NULL;

-- Scanner Pack: gắn tất cả Mini Scanner (chỉ nếu product tồn tại)
INSERT OR IGNORE INTO "product_scanner" ("product_id", "scanner_id", "assigned_at")
SELECT 'prod-scanner-pack', sd.id, datetime('now')
FROM "survey_definition" sd
WHERE sd.id IN ('ho-so-goc-re','an-toan-check','marketing-check','cskh-check','van-hoa-check','thuong-hieu-check')
  AND EXISTS (SELECT 1 FROM "product" WHERE id = 'prod-scanner-pack');

-- Mini Scanner Pro: gắn tất cả Mini Scanner (chỉ nếu product tồn tại)
INSERT OR IGNORE INTO "product_scanner" ("product_id", "scanner_id", "assigned_at")
SELECT 'prod-mini-scanner-pro', sd.id, datetime('now')
FROM "survey_definition" sd
WHERE sd.id IN ('an-toan-check','marketing-check','cskh-check','van-hoa-check','thuong-hieu-check')
  AND EXISTS (SELECT 1 FROM "product" WHERE id = 'prod-mini-scanner-pro');
