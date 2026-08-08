-- Add About page columns to existing homepage_settings table
-- Run: npx wrangler d1 execute dentalempireos-auth --remote --file=migrations/0006_add_about_columns.sql
-- For local: npx wrangler d1 execute dentalempireos-auth --local --file=migrations/0006_add_about_columns.sql

-- About: Hero
-- Skip if already applied (check via: sqlite>.schema homepage_settings)
INSERT OR IGNORE INTO "homepage_settings" ("id") SELECT '' WHERE 0;

ALTER TABLE "homepage_settings" ADD COLUMN "about_hero_badge" text NOT NULL DEFAULT 'System On · Next-Gen Clinical Sovereignty';
ALTER TABLE "homepage_settings" ADD COLUMN "about_hero_line1" text NOT NULL DEFAULT 'Về Chúng Tôi —';
ALTER TABLE "homepage_settings" ADD COLUMN "about_hero_line2" text NOT NULL DEFAULT 'Sứ Mệnh Chuyên Nghiệp Hóa Ngành Nha';
ALTER TABLE "homepage_settings" ADD COLUMN "about_hero_gradient" text NOT NULL DEFAULT 'Sứ Mệnh Chuyên Nghiệp Hóa Ngành Nha';
ALTER TABLE "homepage_settings" ADD COLUMN "about_hero_description" text NOT NULL DEFAULT 'Dental Empire OS không chỉ là một phần mềm quản lý. Chúng tôi là một hệ tư duy mới, tái định nghĩa cách các phòng khám vận hành thông qua sự kết hợp giữa y đức truyền thống và công nghệ tự động hóa tương lai.';
ALTER TABLE "homepage_settings" ADD COLUMN "about_hero_cta_primary" text NOT NULL DEFAULT 'Tham gia Cộng đồng';
ALTER TABLE "homepage_settings" ADD COLUMN "about_hero_cta_secondary" text NOT NULL DEFAULT 'Tìm hiểu Hệ thống';

-- About: Brand Story
ALTER TABLE "homepage_settings" ADD COLUMN "about_story_image_url" text NOT NULL DEFAULT '/images/book/cover.jpg';
ALTER TABLE "homepage_settings" ADD COLUMN "about_story_heading" text NOT NULL DEFAULT 'Hành Trình Chuyển Đổi Số';
ALTER TABLE "homepage_settings" ADD COLUMN "about_story_para1" text NOT NULL DEFAULT 'Khởi nguồn từ trăn trở về việc tối ưu hóa hiệu suất lâm sàng, Dental Empire OS ra đời để giải quyết những nút thắt của các phòng khám truyền thống: sự phụ thuộc vào con người, quy trình rời rạc và thiếu hụt dữ liệu thực tế.';
ALTER TABLE "homepage_settings" ADD COLUMN "about_story_para2" text NOT NULL DEFAULT 'Chúng tôi tin rằng mỗi bác sĩ xứng đáng có một "Hệ điều hành" để giải phóng họ khỏi những tác vụ quản trị thủ công, giúp họ tập trung hoàn toàn vào chuyên môn và sự hài lòng của bệnh nhân.';
ALTER TABLE "homepage_settings" ADD COLUMN "about_story_stat1_value" text NOT NULL DEFAULT '15+';
ALTER TABLE "homepage_settings" ADD COLUMN "about_story_stat1_label" text NOT NULL DEFAULT 'Năm Kinh Nghiệm';
ALTER TABLE "homepage_settings" ADD COLUMN "about_story_stat2_value" text NOT NULL DEFAULT '500+';
ALTER TABLE "homepage_settings" ADD COLUMN "about_story_stat2_label" text NOT NULL DEFAULT 'Phòng Khám Đối Tác';

-- About: Founder
ALTER TABLE "homepage_settings" ADD COLUMN "about_founder_image_url" text NOT NULL DEFAULT '/images/founder.jpg';
ALTER TABLE "homepage_settings" ADD COLUMN "about_founder_name" text NOT NULL DEFAULT 'Dr. Nguyễn Phước Vinh';
ALTER TABLE "homepage_settings" ADD COLUMN "about_founder_title" text NOT NULL DEFAULT 'Founder & CEO';
ALTER TABLE "homepage_settings" ADD COLUMN "about_founder_quote" text NOT NULL DEFAULT '"Hơn 15 năm đứng ghế và quản trị, tôi nhận ra rằng sự thành công của một nha khoa không nằm ở quy mô mặt bằng, mà ở hiệu suất của ''Hệ điều hành'' đằng sau nó. Dental Empire OS là tâm huyết của tôi để mang lại sự tự do thực sự cho các đồng nghiệp."';
ALTER TABLE "homepage_settings" ADD COLUMN "about_founder_role1_label" text NOT NULL DEFAULT 'Chuyên gia Quản trị';
ALTER TABLE "homepage_settings" ADD COLUMN "about_founder_role1_desc" text NOT NULL DEFAULT 'Chiến lược vận hành nha khoa';
ALTER TABLE "homepage_settings" ADD COLUMN "about_founder_role2_label" text NOT NULL DEFAULT 'Tác giả';
ALTER TABLE "homepage_settings" ADD COLUMN "about_founder_role2_desc" text NOT NULL DEFAULT 'Kiến trúc hệ thống Dental Empire';

-- About: Core Values
ALTER TABLE "homepage_settings" ADD COLUMN "about_values_heading" text NOT NULL DEFAULT 'Giá Trị Cốt Lõi';
ALTER TABLE "homepage_settings" ADD COLUMN "about_values_card1_title" text NOT NULL DEFAULT 'Clinical Excellence';
ALTER TABLE "homepage_settings" ADD COLUMN "about_values_card1_desc" text NOT NULL DEFAULT 'Chúng tôi không bao giờ đánh đổi chất lượng chuyên môn để lấy lợi nhuận. Mọi tính năng trong OS đều phục vụ kết quả điều trị tốt nhất.';
ALTER TABLE "homepage_settings" ADD COLUMN "about_values_card2_title" text NOT NULL DEFAULT 'Digital Sovereignty';
ALTER TABLE "homepage_settings" ADD COLUMN "about_values_card2_desc" text NOT NULL DEFAULT 'Chủ quyền số hóa, bảo mật tuyệt đối dữ liệu bệnh nhân và quyền sở hữu hệ thống của phòng khám.';
ALTER TABLE "homepage_settings" ADD COLUMN "about_values_card3_title" text NOT NULL DEFAULT 'Community Growth';
ALTER TABLE "homepage_settings" ADD COLUMN "about_values_card3_desc" text NOT NULL DEFAULT 'Phát triển cùng cộng đồng bác sĩ quản trị chuyên nghiệp.';
ALTER TABLE "homepage_settings" ADD COLUMN "about_values_card4_title" text NOT NULL DEFAULT 'Next-Gen Authority';
ALTER TABLE "homepage_settings" ADD COLUMN "about_values_card4_desc" text NOT NULL DEFAULT 'Xây dựng vị thế dẫn đầu thông qua công nghệ và sự chuẩn mực trong quản trị.';

-- About: Final CTA
ALTER TABLE "homepage_settings" ADD COLUMN "about_cta_line1" text NOT NULL DEFAULT 'Sẵn Sàng Để Làm Chủ';
ALTER TABLE "homepage_settings" ADD COLUMN "about_cta_line2" text NOT NULL DEFAULT 'Đế Chế Của Riêng Bạn?';
ALTER TABLE "homepage_settings" ADD COLUMN "about_cta_primary" text NOT NULL DEFAULT 'Bắt Đầu Ngay';
ALTER TABLE "homepage_settings" ADD COLUMN "about_cta_secondary" text NOT NULL DEFAULT 'Liên hệ Chuyên gia';
ALTER TABLE "homepage_settings" ADD COLUMN "about_cta_primary_link" text NOT NULL DEFAULT '/book';
ALTER TABLE "homepage_settings" ADD COLUMN "about_cta_secondary_link" text NOT NULL DEFAULT '#';