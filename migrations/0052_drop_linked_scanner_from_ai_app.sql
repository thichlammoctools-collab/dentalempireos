-- Xóa index linked_scanner
-- (không dùng DROP INDEX IF EXISTS vì SQLite không hỗ trợ)
DROP INDEX IF EXISTS "idx_ai_app_linked_scanner";

-- Cột linked_scanner_id vẫn tồn tại nhưng không còn được dùng.
-- SQLite không thể DROP COLUMN khi có trigger trùng tên trên bảng khác (bug SQLite).
-- Column rỗng (NULL) nên không ảnh hưởng đến dữ liệu.
