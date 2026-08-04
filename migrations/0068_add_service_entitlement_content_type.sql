-- Migration 0068: Allow service content in product entitlements.

PRAGMA foreign_keys = OFF;

CREATE TABLE "product_entitlement_v2" (
  "product_id" text NOT NULL REFERENCES "product" ("id") ON DELETE CASCADE,
  "content_type" text NOT NULL CHECK("content_type" IN (
    'book','ai_app','scanner','course','blog','resource','service'
  )),
  "content_id" text NOT NULL,
  "created_at" text NOT NULL DEFAULT (datetime('now')),
  "updated_at" text NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY ("product_id", "content_type", "content_id")
);

INSERT INTO "product_entitlement_v2"
  ("product_id","content_type","content_id","created_at","updated_at")
SELECT "product_id","content_type","content_id","created_at","updated_at"
FROM "product_entitlement";

DROP TABLE "product_entitlement";
ALTER TABLE "product_entitlement_v2" RENAME TO "product_entitlement";

CREATE INDEX IF NOT EXISTS "idx_product_entitlement_content"
  ON "product_entitlement" ("content_type", "content_id");

PRAGMA foreign_keys = ON;
