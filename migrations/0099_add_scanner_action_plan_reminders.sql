-- Phase 4: idempotent, in-app-only Scanner action-plan reminders.
--
-- Reminder rows contain opaque identifiers, lifecycle state, and timestamps only.
-- They deliberately do not retain Scanner answers, action titles, descriptions, notes,
-- scores, or other report content. Normalized Phase 1B plans survive raw-response
-- purge, so their reminder ledger survives too. The scheduled cleanup removes both
-- delivery ledger rows and their in-app notifications when a plan is archived or made
-- unavailable.
CREATE TABLE IF NOT EXISTS "scanner_action_plan_reminder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "notification_id" TEXT NOT NULL UNIQUE,
  "schedule_key" TEXT NOT NULL UNIQUE,
  "plan_id" TEXT NOT NULL REFERENCES "scanner_action_plan"("id"),
  "action_id" TEXT REFERENCES "scanner_action_plan_action"("id"),
  "user_id" TEXT NOT NULL REFERENCES "user"("id"),
  "kind" TEXT NOT NULL CHECK ("kind" IN ('plan_not_started', 'action_due', 'action_overdue', 'rescan_due')),
  "state" TEXT NOT NULL DEFAULT 'pending' CHECK ("state" IN ('pending', 'claimed', 'delivered', 'canceled')),
  "claimed_at" TEXT,
  "delivered_at" TEXT,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_scanner_action_plan_reminder_claim"
  ON "scanner_action_plan_reminder"("state", "claimed_at");
CREATE INDEX IF NOT EXISTS "idx_scanner_action_plan_reminder_plan"
  ON "scanner_action_plan_reminder"("plan_id", "state");

-- A reminder can only be created for an eligible, normalized plan. This is a
-- defense-in-depth lifecycle invariant against a retention/archive race between
-- scheduler candidate selection and delivery claim.
CREATE TRIGGER IF NOT EXISTS "scanner_action_plan_reminder_requires_eligible_plan"
BEFORE INSERT ON "scanner_action_plan_reminder"
FOR EACH ROW
WHEN NOT EXISTS (
  SELECT 1
  FROM "scanner_action_plan" plan
  WHERE plan."id" = NEW."plan_id"
    AND plan."user_id" = NEW."user_id"
    AND plan."status" = 'active'
    AND plan."generation_state" = 'ready'
    AND plan."retention_visibility" = 'available'
)
BEGIN
  SELECT RAISE(ABORT, 'scanner action plan reminder requires an eligible plan');
END;

CREATE TRIGGER IF NOT EXISTS "scanner_action_plan_reminder_action_belongs_to_plan"
BEFORE INSERT ON "scanner_action_plan_reminder"
FOR EACH ROW
WHEN NEW."action_id" IS NOT NULL
 AND NOT EXISTS (
  SELECT 1
  FROM "scanner_action_plan_action" action
  WHERE action."id" = NEW."action_id" AND action."plan_id" = NEW."plan_id"
)
BEGIN
  SELECT RAISE(ABORT, 'scanner action plan reminder action does not belong to plan');
END;
