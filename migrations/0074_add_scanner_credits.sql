-- Migration 0074: Thêm credit-based access cho Scanner & AI Tools
-- Chuyển từ mô hình time-based (hết hạn) + monthly quota sang credit-based.
-- Gói lẻ: 20 credits pooled dùng chung mọi tool; Gói package: 20 credits/tool.
-- Credits không hết hạn và được cộng dồn khi mua lại.

-- Số credits mặc định cho mỗi sản phẩm (quản trị viên chỉnh được trong admin/products).
ALTER TABLE "product" ADD COLUMN "credits" INTEGER NOT NULL DEFAULT 20;

-- Credit tracking trên access grant: credits = tổng credits được cấp, scans_used = số lần đã dùng.
ALTER TABLE "access" ADD COLUMN "credits" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "access" ADD COLUMN "scans_used" INTEGER NOT NULL DEFAULT 0;

-- Giữ expires_at nguyên — backward compatibility.

-- Index cho query credits
CREATE INDEX IF NOT EXISTS "idx_access_user_active"
  ON "access" ("user_id", "is_active");