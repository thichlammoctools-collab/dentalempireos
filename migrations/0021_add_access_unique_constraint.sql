-- Add unique constraint on access table to prevent duplicate access grants.
-- This prevents race conditions when PayOS webhooks fire multiple times
-- or when grantAccess is called concurrently for the same user+product.
-- Then deactivate any existing duplicate rows, keeping only the most recent.

-- First, deactivate duplicate access rows (keep most recent per user_id+product_id)
DELETE FROM "access"
WHERE "id" IN (
  SELECT "id" FROM "access" a1
  WHERE EXISTS (
    SELECT 1 FROM "access" a2
    WHERE a2."user_id" = a1."user_id"
      AND a2."product_id" = a1."product_id"
      AND a2."is_active" = 1
      AND a2."granted_at" > a1."granted_at"
  )
);

-- Add unique partial index: only one active access per user+product at a time
-- We use a unique index with a WHERE clause since SQLite supports it
CREATE UNIQUE INDEX IF NOT EXISTS idx_access_user_product_active
ON "access"("user_id", "product_id")
WHERE "is_active" = 1;
