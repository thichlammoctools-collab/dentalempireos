-- Seed 5 new Mini Scanners into D1:
-- an-toan-check, marketing-check, cskh-check, van-hoa-check, thuong-hieu-check
-- Each scanner: 2 sections, 7 questions (5 select + 2 textarea), status=active, is_free=0
-- NOTE: This migration uses multi-statement approach. Run it as a script, not via wrangler --file.

-- =============================================
-- Step 1: survey_definition rows
-- =============================================

INSERT OR IGNORE INTO "survey_definition" (
  "id","slug","title_vi","title_en","description_vi","description_en",
  "subtitle_vi","subtitle_en","chapter_refs","status","is_free","survey_type",
  "scoring_rules","ai_config","translations_vi","translations_en","order_index",
  "created_at","updated_at"
) VALUES
(
  'an-toan-check',
  'an-toan-check',
  'An Toàn Check',
  'Safety Check',
  'An toàn là nền tảng không thể thương lượng. 7 câu hỏi giúp bạn đánh giá mức độ tuân thủ quy chuẩn an toàn trong phòng khám.',
  'Safety is non-negotiable. 7 questions to assess your clinic safety compliance level.',
  'Chẩn đoán nhanh theo Chương 6 — An Toàn & Tuân Thủ',
  'Quick diagnosis based on Chapter 6 — Safety & Compliance',
  '["Ch.6"]',
  'active',
  0,
  'mini',
  '{"dimensions":[{"id":"safety","name_vi":"An toàn & Tuân thủ","name_en":"Safety & Compliance","question_ids":["at_q1","at_q2","at_q3","at_q4","at_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  '{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả An Toàn Check (điểm {{SCORE_SAFETY}}/100 kèm 2 câu open-ended), phân tích mức độ tuân thủ an toàn và đưa ra 3 hành động ưu tiên để cải thiện trong tháng tới. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.","prompt_en":"You are Dr. Vinh — dental clinic management consultant. Based on the Safety Check score ({{SCORE_SAFETY}}/100 with 2 open-ended answers), analyze safety compliance and suggest 3 priority actions. English, candid and warm tone. Quote their open-ended answers.","model_override":null,"max_tokens_override":2048}',
  '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"An Toàn Check","intro_desc":"An toàn là nền tảng không thể thương lượng. 7 câu hỏi giúp bạn đánh giá mức độ tuân thủ và an toàn trong phòng khám.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Safety Check","intro_desc":"Safety is non-negotiable. 7 questions to assess your clinic safety compliance level.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  6,
  datetime('now'),
  datetime('now')
),
(
  'marketing-check',
  'marketing-check',
  'Marketing Check',
  'Marketing Check',
  'Không có marketing = không có bệnh nhân mới. 7 câu hỏi giúp bạn đánh giá chiến lược tiếp cận và giữ chân bệnh nhân của phòng khám.',
  'No marketing = no new patients. 7 questions to assess your patient acquisition and retention strategy.',
  'Chẩn đoán nhanh theo Chương 7 — Marketing Phòng Khám',
  'Quick diagnosis based on Chapter 7 — Clinic Marketing',
  '["Ch.7"]',
  'active',
  0,
  'mini',
  '{"dimensions":[{"id":"marketing","name_vi":"Chiến lược Marketing","name_en":"Marketing Strategy","question_ids":["mkt_q1","mkt_q2","mkt_q3","mkt_q4","mkt_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  '{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Marketing Check (điểm {{SCORE_MARKETING}}/100 kèm 2 câu open-ended), phân tích chiến lược marketing và đưa ra 3 hành động cải thiện trong tháng tới. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.","prompt_en":"You are Dr. Vinh — dental clinic management consultant. Based on the Marketing Check score ({{SCORE_MARKETING}}/100 with 2 open-ended answers), analyze marketing strategy and suggest 3 improvement actions. English, candid and warm tone. Quote their open-ended answers.","model_override":null,"max_tokens_override":2048}',
  '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"Marketing Check","intro_desc":"Không có marketing = không có bệnh nhân mới. 7 câu hỏi giúp bạn đánh giá chiến lược tiếp cận và giữ chân bệnh nhân của phòng khám.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Marketing Check","intro_desc":"No marketing = no new patients. 7 questions to assess your patient acquisition and retention strategy.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  7,
  datetime('now'),
  datetime('now')
),
(
  'cskh-check',
  'cskh-check',
  'CSKH Check',
  'Customer Service Check',
  'Dịch vụ khách hàng quyết định bệnh nhân quay lại hay không. 7 câu hỏi giúp bạn đánh giá chất lượng CSKH thực tế.',
  'Customer service determines whether patients return. 7 questions to assess your real CS quality.',
  'Chẩn đoán nhanh theo Chương 8 — Dịch Vụ Khách Hàng',
  'Quick diagnosis based on Chapter 8 — Customer Service',
  '["Ch.8"]',
  'active',
  0,
  'mini',
  '{"dimensions":[{"id":"service","name_vi":"Chất lượng CSKH","name_en":"Customer Service Quality","question_ids":["cskh_q1","cskh_q2","cskh_q3","cskh_q4","cskh_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  '{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả CSKH Check (điểm {{SCORE_SERVICE}}/100 kèm 2 câu open-ended), phân tích chất lượng dịch vụ khách hàng và đưa ra 3 điểm cần cải thiện ngay. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.","prompt_en":"You are Dr. Vinh — dental clinic management consultant. Based on the CSKH Check score ({{SCORE_SERVICE}}/100 with 2 open-ended answers), analyze customer service quality and suggest 3 immediate improvements. English, candid and warm tone. Quote their open-ended answers.","model_override":null,"max_tokens_override":2048}',
  '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"CSKH Check","intro_desc":"Dịch vụ khách hàng quyết định bệnh nhân quay lại hay không. 7 câu hỏi giúp bạn đánh giá chất lượng CSKH thực tế.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Customer Service Check","intro_desc":"Customer service determines whether patients return. 7 questions to assess your real CS quality.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  8,
  datetime('now'),
  datetime('now')
),
(
  'van-hoa-check',
  'van-hoa-check',
  'Văn Hóa Check',
  'Culture Check',
  'Văn hóa là DNA của phòng khám. 7 câu hỏi giúp bạn đánh giá sức khỏe văn hóa nội bộ và mức độ gắn kết nhân viên.',
  'Culture is the DNA of your clinic. 7 questions to assess internal culture health and staff engagement.',
  'Chẩn đoán nhanh theo Chương 9 — Văn Hóa Phòng Khám',
  'Quick diagnosis based on Chapter 9 — Clinic Culture',
  '["Ch.9"]',
  'active',
  0,
  'mini',
  '{"dimensions":[{"id":"culture","name_vi":"Văn hóa nội bộ","name_en":"Internal Culture","question_ids":["vh_q1","vh_q2","vh_q3","vh_q4","vh_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  '{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Văn Hóa Check (điểm {{SCORE_CULTURE}}/100 kèm 2 câu open-ended), phân tích sức khỏe văn hóa nội bộ và đưa ra 3 đề xuất cải thiện. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.","prompt_en":"You are Dr. Vinh — dental clinic management consultant. Based on the Culture Check score ({{SCORE_CULTURE}}/100 with 2 open-ended answers), analyze internal culture health and suggest 3 improvements. English, candid and warm tone. Quote their open-ended answers.","model_override":null,"max_tokens_override":2048}',
  '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"Văn Hóa Check","intro_desc":"Văn hóa là DNA của phòng khám. 7 câu hỏi giúp bạn đánh giá sức khỏe văn hóa nội bộ và mức độ gắn kết nhân viên.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Culture Check","intro_desc":"Culture is the DNA of your clinic. 7 questions to assess internal culture health and staff engagement.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  9,
  datetime('now'),
  datetime('now')
),
(
  'thuong-hieu-check',
  'thuong-hieu-check',
  'Thương Hiệu Check',
  'Brand Check',
  'Thương hiệu mạnh = bệnh nhân nhớ đến khi cần. 7 câu hỏi giúp bạn đánh giá mức độ nhận diện và uy tín thương hiệu phòng khám.',
  'Strong brand = patients remember you when they need care. 7 questions to assess brand recognition and reputation.',
  'Chẩn đoán nhanh theo Chương 10 — Xây Dựng Thương Hiệu',
  'Quick diagnosis based on Chapter 10 — Brand Building',
  '["Ch.10"]',
  'active',
  0,
  'mini',
  '{"dimensions":[{"id":"brand","name_vi":"Thương hiệu & Nhận diện","name_en":"Brand & Recognition","question_ids":["th_q1","th_q2","th_q3","th_q4","th_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  '{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Thương Hiệu Check (điểm {{SCORE_BRAND}}/100 kèm 2 câu open-ended), phân tích mức độ nhận diện thương hiệu và đưa ra 3 đề xuất xây dựng thương hiệu. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.","prompt_en":"You are Dr. Vinh — dental clinic management consultant. Based on the Brand Check score ({{SCORE_BRAND}}/100 with 2 open-ended answers), analyze brand recognition and suggest 3 brand-building actions. English, candid and warm tone. Quote their open-ended answers.","model_override":null,"max_tokens_override":2048}',
  '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"Thương Hiệu Check","intro_desc":"Thương hiệu mạnh = bệnh nhân nhớ đến khi cần. 7 câu hỏi giúp bạn đánh giá mức độ nhận diện và uy tín thương hiệu phòng khám.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Brand Check","intro_desc":"Strong brand = patients remember you when they need care. 7 questions to assess brand recognition and reputation.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  10,
  datetime('now'),
  datetime('now')
);

-- =============================================
-- Step 2: survey_section rows
-- =============================================

INSERT OR IGNORE INTO "survey_section" ("survey_id","order_idx","title_vi","title_en","subtitle_vi","subtitle_en","ref","icon") VALUES
-- an-toan-check
('an-toan-check', 0, 'PHẦN 1: ĐÁNH GIÁ AN TOÀN', 'PART 1: SAFETY EVALUATION', '5 chiều đánh giá: giấy phép, vô trùng, PCCC, quản lý thuốc, và đào tạo khẩn cấp.', '5 evaluation dimensions: licensing, sterilization, fire safety, drug management, and emergency training.', 'Ch.6 — An Toàn & Tuân Thủ', 'health_and_safety'),
('an-toan-check', 1, 'PHẦN 2: TỰ SOI CHIẾU', 'PART 2: SELF-REFLECTION', 'Hai câu hỏi mở giúp bạn nhìn thẳng vào lỗ hổng an toàn.', 'Two open questions to face safety gaps honestly.', 'Ch.6 — An Toàn & Tuân Thủ', 'psychology_alt'),
-- marketing-check
('marketing-check', 0, 'PHẦN 1: ĐÁNH GIÁ MARKETING', 'PART 1: MARKETING EVALUATION', '5 chiều đánh giá: kênh tiếp cận, giữ chân, ROI, USP, và hiện diện online.', '5 evaluation dimensions: acquisition channels, retention, ROI, USP, and online presence.', 'Ch.7 — Marketing Phòng Khám', 'campaign'),
('marketing-check', 1, 'PHẦN 2: TỰ SOI CHIẾU', 'PART 2: SELF-REFLECTION', 'Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế marketing.', 'Two open questions to face marketing reality honestly.', 'Ch.7 — Marketing Phòng Khám', 'psychology_alt'),
-- cskh-check
('cskh-check', 0, 'PHẦN 1: ĐÁNH GIÁ CSKH', 'PART 1: CS EVALUATION', '5 chiều đánh giá: tốc độ phản hồi, đào tạo nhân sự, thu thập feedback, xử lý khiếu nại, và follow-up.', '5 evaluation dimensions: response speed, staff training, feedback collection, complaint handling, and follow-up.', 'Ch.8 — Dịch Vụ Khách Hàng', 'support_agent'),
('cskh-check', 1, 'PHẦN 2: TỰ SOI CHIẾU', 'PART 2: SELF-REFLECTION', 'Hai câu hỏi mở giúp bạn nhìn từ góc nhìn bệnh nhân.', 'Two open questions to see from the patient perspective.', 'Ch.8 — Dịch Vụ Khách Hàng', 'psychology_alt'),
-- van-hoa-check
('van-hoa-check', 0, 'PHẦN 1: ĐÁNH GIÁ VĂN HÓA', 'PART 1: CULTURE EVALUATION', '5 chiều đánh giá: core values, lắng nghe, retention, đãi ngộ, và communication.', '5 evaluation dimensions: core values, listening, retention, compensation, and communication.', 'Ch.9 — Văn Hóa Phòng Khám', 'diversity_3'),
('van-hoa-check', 1, 'PHẦN 2: TỰ SOI CHIẾU', 'PART 2: SELF-REFLECTION', 'Hai câu hỏi mở giúp bạn nhìn thẳng vào văn hóa nội bộ.', 'Two open questions to face internal culture honestly.', 'Ch.9 — Văn Hóa Phòng Khám', 'psychology_alt'),
-- thuong-hieu-check
('thuong-hieu-check', 0, 'PHẦN 1: ĐÁNH GIÁ THƯƠNG HIỆU', 'PART 1: BRAND EVALUATION', '5 chiều đánh giá: nhận diện, nhất quán, review, hiện diện online, và khác biệt hóa.', '5 evaluation dimensions: recognition, consistency, reviews, online presence, and differentiation.', 'Ch.10 — Xây Dựng Thương Hiệu', 'stars'),
('thuong-hieu-check', 1, 'PHẦN 2: TỰ SOI CHIẾU', 'PART 2: SELF-REFLECTION', 'Hai câu hỏi mở giúp bạn nhìn thẳng vào vị thế thương hiệu.', 'Two open questions to face your brand position honestly.', 'Ch.10 — Xây Dựng Thương Hiệu', 'psychology_alt');
