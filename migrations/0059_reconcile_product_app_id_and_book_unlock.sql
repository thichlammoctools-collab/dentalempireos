-- Production reconciliation for migration 0058.
-- Restore the application link column that is used by survey products.
ALTER TABLE "product" ADD COLUMN "app_id" text;

CREATE INDEX IF NOT EXISTS "idx_product_app_id" ON "product" ("app_id");

-- One active product unlocks all premium sections in the book.
CREATE UNIQUE INDEX IF NOT EXISTS "idx_active_book_unlock"
  ON "product" ("type")
  WHERE "type" = 'book_unlock' AND "is_active" = 1;
