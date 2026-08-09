-- Security hardening: retain a privacy-preserving IP hash for anonymous review rate limits.
ALTER TABLE "review" ADD COLUMN "ip_hash" TEXT;
CREATE INDEX IF NOT EXISTS "idx_review_ip_created" ON "review"("ip_hash", "createdAt");
