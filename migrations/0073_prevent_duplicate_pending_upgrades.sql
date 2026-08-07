-- An access balance can fund only one in-flight upgrade. This protects against
-- concurrent requests that pass the application-level pending-order check.
CREATE UNIQUE INDEX IF NOT EXISTS "idx_order_pending_upgrade_source"
ON "order" ("user_id", "upgrade_from_access_id")
WHERE "order_kind" = 'upgrade' AND "status" = 'pending';
