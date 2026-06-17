-- Support author widget settings (title, message, QR code, payment methods)
-- Single-row table: admin can customise the collapsible "Ủng Hộ Tác Giả" widget shown at the end of each chapter.

CREATE TABLE IF NOT EXISTS "support_settings" (
  "id"         integer PRIMARY KEY CHECK ("id" = 1),  -- always 1 row
  "enabled"    integer NOT NULL DEFAULT 1,             -- 0 = hide widget entirely
  "title"      text NOT NULL DEFAULT 'Ủng Hộ Tác Giả',
  "message"    text NOT NULL DEFAULT 'Nếu cuốn sách đã mang lại giá trị cho bạn, hãy ủng hộ để tác giả có thể tiếp tục viết và chia sẻ kiến thức.',
  "qr_url"     text NOT NULL DEFAULT '/images/qr/donation-qr.svg',
  "payment_methods" text NOT NULL DEFAULT 'Vietcombank, Techcombank, Momo, ZaloPay',
  "updatedAt"  text NOT NULL
);

-- Seed the single default row
INSERT OR IGNORE INTO "support_settings" ("id", "enabled", "title", "message", "qr_url", "payment_methods", "updatedAt")
VALUES (1, 1, 'Ủng Hộ Tác Giả',
        'Nếu cuốn sách đã mang lại giá trị cho bạn, hãy ủng hộ để tác giả có thể tiếp tục viết và chia sẻ kiến thức.',
        '/images/qr/donation-qr.svg',
        'Vietcombank, Techcombank, Momo, ZaloPay',
        '2026-01-01T00:00:00.000Z');
