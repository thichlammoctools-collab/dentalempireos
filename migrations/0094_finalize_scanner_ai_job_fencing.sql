-- Phase 1B finalization: canonical Scanner response ownership and durable Queue dispatch recovery.
-- Keep the earliest history row (created_at, then id) as the deterministic owner for
-- each response before enforcing one owner row per response.
DELETE FROM "scanner_history"
WHERE "id" IN (
  SELECT "id"
  FROM (
    SELECT
      "id",
      ROW_NUMBER() OVER (
        PARTITION BY "response_id"
        ORDER BY "created_at" ASC, "id" ASC
      ) AS "row_number"
    FROM "scanner_history"
  )
  WHERE "row_number" > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS "idx_scanner_history_response_unique"
  ON "scanner_history" ("response_id");

-- A queued job is dispatch-pending until Queue.send has succeeded. This makes a
-- producer outage recoverable by the scheduler without redispatching ordinary
-- queued work that Cloudflare Queues already owns.
ALTER TABLE "scanner_ai_job" ADD COLUMN "dispatch_pending_at" TEXT;
ALTER TABLE "scanner_ai_job" ADD COLUMN "dispatch_last_attempt_at" TEXT;
ALTER TABLE "scanner_ai_job" ADD COLUMN "dispatch_attempt_count" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "idx_scanner_ai_job_dispatch_pending"
  ON "scanner_ai_job" ("status", "dispatch_pending_at", "dispatch_last_attempt_at");
