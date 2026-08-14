-- Phase 2 final hardening: a Scanner credit run may only enter the retryable
-- failed state with an immutable, internally consistent original price capture.
-- Legacy rows remain readable but cannot be promoted into paid recovery without
-- a capture; application code returns fail-closed before raw report/history work.

CREATE TRIGGER IF NOT EXISTS "scanner_credit_run_require_price_capture_on_insert"
BEFORE INSERT ON "scanner_credit_run"
FOR EACH ROW
WHEN NEW."credit_amount" IS NULL
  OR NEW."credit_amount" <= 0
  OR CASE
       WHEN NEW."price_snapshot_json" IS NULL OR json_valid(NEW."price_snapshot_json") = 0 THEN 1
       WHEN json_type(NEW."price_snapshot_json", '$.credits') IS NOT 'integer' THEN 1
       WHEN json_extract(NEW."price_snapshot_json", '$.credits') != NEW."credit_amount" THEN 1
       ELSE 0
     END = 1
BEGIN
  SELECT RAISE(ABORT, 'scanner_credit_run requires a valid immutable price capture');
END;

CREATE TRIGGER IF NOT EXISTS "scanner_credit_run_price_capture_immutable"
BEFORE UPDATE OF "credit_amount", "price_snapshot_json" ON "scanner_credit_run"
FOR EACH ROW
WHEN (OLD."credit_amount" IS NOT NULL OR OLD."price_snapshot_json" IS NOT NULL)
 AND (NEW."credit_amount" IS NOT OLD."credit_amount"
      OR NEW."price_snapshot_json" IS NOT OLD."price_snapshot_json")
BEGIN
  SELECT RAISE(ABORT, 'scanner_credit_run price capture is immutable');
END;

CREATE TRIGGER IF NOT EXISTS "scanner_credit_run_require_price_capture_on_failure"
BEFORE UPDATE OF "status" ON "scanner_credit_run"
FOR EACH ROW
WHEN NEW."status" = 'failed'
 AND (
   NEW."credit_amount" IS NULL
   OR NEW."credit_amount" <= 0
   OR CASE
        WHEN NEW."price_snapshot_json" IS NULL OR json_valid(NEW."price_snapshot_json") = 0 THEN 1
        WHEN json_type(NEW."price_snapshot_json", '$.credits') IS NOT 'integer' THEN 1
        WHEN json_extract(NEW."price_snapshot_json", '$.credits') != NEW."credit_amount" THEN 1
        ELSE 0
      END = 1
 )
BEGIN
  SELECT RAISE(ABORT, 'failed scanner_credit_run requires a valid immutable price capture');
END;
