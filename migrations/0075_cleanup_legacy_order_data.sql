-- Migration 0075: Xóa toàn bộ dữ liệu đơn hàng / access / lịch sử scanner cũ
-- Các access grant tạo trước mô hình credit có credits = 0 (default) nên bị
-- chặn bởi check mới; chưa có khách hàng thật nên xóa sạch để bắt đầu lại.

DELETE FROM "scanner_history";
DELETE FROM "upgrade";
UPDATE "order" SET "upgrade_from_access_id" = NULL;
DELETE FROM "access";
DELETE FROM "payos_webhook_log";
DELETE FROM "order";
DELETE FROM "scanner_response";
