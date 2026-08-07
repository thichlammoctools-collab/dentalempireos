-- Track the Scanner selected when a customer buys a selectable Scanner product.
-- Bundle purchases leave this NULL and continue to use their product entitlements.
ALTER TABLE "order" ADD COLUMN "selected_scanner_id" text;
ALTER TABLE "access" ADD COLUMN "selected_scanner_id" text;

-- A customer can hold one active grant per Scanner selection for the same product.
-- NULL represents a normal bundle/product-level grant.
DROP INDEX IF EXISTS "idx_access_user_product_active";
CREATE UNIQUE INDEX IF NOT EXISTS "idx_access_user_product_scanner_active"
ON "access"("user_id", "product_id", "selected_scanner_id")
WHERE "is_active" = 1 AND "selected_scanner_id" IS NOT NULL;
