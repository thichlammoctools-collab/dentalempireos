-- Tạo bảng trung gian product_scanner để admin có thể gắn N scanner vào 1 product.
-- Mỗi scanner tại 1 thời điểm chỉ thuộc đúng 1 product.
-- Từ đây: XÓA cột ai_application.linked_scanner_id vì không còn cần nữa.

CREATE TABLE "product_scanner" (
  "product_id"  TEXT NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
  "scanner_id"  TEXT NOT NULL REFERENCES "survey_definition"("id") ON DELETE CASCADE,
  "assigned_at" TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY ("product_id", "scanner_id")
);

CREATE INDEX "idx_product_scanner_scanner" ON "product_scanner"("scanner_id");
CREATE INDEX "idx_product_scanner_product" ON "product_scanner"("product_id");
