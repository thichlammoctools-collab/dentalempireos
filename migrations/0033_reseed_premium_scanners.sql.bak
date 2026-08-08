-- Migration: 0033_reseed_premium_scanners
-- Re-seed 5 premium scanners: marketing, an-toan, cskh, van-hoa, thuong-hieu
-- Deletes existing sections/questions first (CASCADE on FK doesn't delete child rows),
-- then re-inserts with correct data.

-- Delete all orphaned sections and questions for these scanners
DELETE FROM survey_question
WHERE section_id IN (
  SELECT ss.id FROM survey_section ss WHERE ss.survey_id IN (
    'marketing-check', 'an-toan-check', 'cskh-check', 'van-hoa-check', 'thuong-hieu-check'
  )
);

DELETE FROM survey_section
WHERE survey_id IN (
  'marketing-check', 'an-toan-check', 'cskh-check', 'van-hoa-check', 'thuong-hieu-check'
);

-- Re-insert survey_definition rows
INSERT OR REPLACE INTO survey_definition
  (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, created_at, updated_at)
VALUES
  ('marketing-check', 'marketing-check', 'Marketing Check', 'Marketing Check',
   'Không có marketing = không có bệnh nhân mới. 7 câu hỏi giúp bạn đánh giá chiến lược tiếp cận và giữ chân bệnh nhân của phòng khám.',
   'No marketing = no new patients. 7 questions to assess your patient acquisition and retention strategy.',
   'Chẩn đoán nhanh theo Chương 7 — Marketing Phòng Khám',
   'Quick diagnosis based on Chapter 7 — Clinic Marketing',
   '["Ch.7"]', 'active', 0, 'mini',
   '{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
   '{"dimensions":[{"id":"marketing","name_vi":"Chiến lược Marketing","name_en":"Marketing Strategy","question_ids":["mkt_q1","mkt_q2","mkt_q3","mkt_q4","mkt_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
   '{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Marketing Check (điểm {{SCORE_MARKETING}}/100 kèm 2 câu open-ended), phân tích chiến lược marketing và đưa ra 3 hành động cải thiện trong tháng tới. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.","prompt_en":"You are Dr. Vinh — dental clinic management consultant. Based on the Marketing Check score ({{SCORE_MARKETING}}/100 with 2 open-ended answers), analyze marketing strategy and suggest 3 improvement actions. English, candid and warm tone. Quote their open-ended answers.","model_override":null,"max_tokens_override":2048}',
   '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"Marketing Check","intro_desc":"Không có marketing = không có bệnh nhân mới. 7 câu hỏi giúp bạn đánh giá chiến lược tiếp cận và giữ chân bệnh nhân của phòng khám.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
   '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Marketing Check","intro_desc":"No marketing = no new patients. 7 questions to assess your patient acquisition and retention strategy.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
   7, datetime('now'), datetime('now')),

  ('an-toan-check', 'an-toan-check', 'An Toàn Check', 'Safety Check',
   'An toàn là nền tảng không thể thương lượng. 7 câu hỏi giúp bạn đánh giá mức độ tuân thủ quy chuẩn an toàn trong phòng khám.',
   'Safety is non-negotiable. 7 questions to assess your clinic safety compliance level.',
   'Chẩn đoán nhanh theo Chương 6 — An Toàn & Tuân Thủ',
   'Quick diagnosis based on Chapter 6 — Safety & Compliance',
   '["Ch.6"]', 'active', 0, 'mini',
   '{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
   '{"dimensions":[{"id":"safety","name_vi":"An toàn & Tuân thủ","name_en":"Safety & Compliance","question_ids":["at_q1","at_q2","at_q3","at_q4","at_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
   '{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả An Toàn Check (điểm {{SCORE_SAFETY}}/100 kèm 2 câu open-ended), phân tích mức độ tuân thủ an toàn và đưa ra 3 hành động ưu tiên để cải thiện trong tháng tới. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.","prompt_en":"You are Dr. Vinh — dental clinic management consultant. Based on the Safety Check score ({{SCORE_SAFETY}}/100 with 2 open-ended answers), analyze safety compliance and suggest 3 priority actions. English, candid and warm tone. Quote their open-ended answers.","model_override":null,"max_tokens_override":2048}',
   '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"An Toàn Check","intro_desc":"An toàn là nền tảng không thể thương lượng. 7 câu hỏi giúp bạn đánh giá mức độ tuân thủ và an toàn trong phòng khám.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
   '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Safety Check","intro_desc":"Safety is non-negotiable. 7 questions to assess your clinic safety compliance level.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
   6, datetime('now'), datetime('now')),

  ('cskh-check', 'cskh-check', 'CSKH Check', 'Customer Service Check',
   'Dịch vụ khách hàng quyết định bệnh nhân quay lại hay không. 7 câu hỏi giúp bạn đánh giá chất lượng CSKH thực tế.',
   'Customer service determines whether patients return. 7 questions to assess your real CS quality.',
   'Chẩn đoán nhanh theo Chương 8 — Dịch Vụ Khách Hàng',
   'Quick diagnosis based on Chapter 8 — Customer Service',
   '["Ch.8"]', 'active', 0, 'mini',
   '{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
   '{"dimensions":[{"id":"service","name_vi":"Chất lượng CSKH","name_en":"Customer Service Quality","question_ids":["cskh_q1","cskh_q2","cskh_q3","cskh_q4","cskh_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
   '{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả CSKH Check (điểm {{SCORE_SERVICE}}/100 kèm 2 câu open-ended), phân tích chất lượng dịch vụ khách hàng và đưa ra 3 điểm cần cải thiện ngay. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.","prompt_en":"You are Dr. Vinh — dental clinic management consultant. Based on the CSKH Check score ({{SCORE_SERVICE}}/100 with 2 open-ended answers), analyze customer service quality and suggest 3 immediate improvements. English, candid and warm tone. Quote their open-ended answers.","model_override":null,"max_tokens_override":2048}',
   '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"CSKH Check","intro_desc":"Dịch vụ khách hàng quyết định bệnh nhân quay lại hay không. 7 câu hỏi giúp bạn đánh giá chất lượng CSKH thực tế.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
   '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Customer Service Check","intro_desc":"Customer service determines whether patients return. 7 questions to assess your real CS quality.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
   8, datetime('now'), datetime('now')),

  ('van-hoa-check', 'van-hoa-check', 'Văn Hóa Check', 'Culture Check',
   'Văn hóa là DNA của phòng khám. 7 câu hỏi giúp bạn đánh giá sức khỏe văn hóa nội bộ và mức độ gắn kết nhân viên.',
   'Culture is the DNA of your clinic. 7 questions to assess internal culture health and staff engagement.',
   'Chẩn đoán nhanh theo Chương 9 — Văn Hóa Phòng Khám',
   'Quick diagnosis based on Chapter 9 — Clinic Culture',
   '["Ch.9"]', 'active', 0, 'mini',
   '{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
   '{"dimensions":[{"id":"culture","name_vi":"Văn hóa nội bộ","name_en":"Internal Culture","question_ids":["vh_q1","vh_q2","vh_q3","vh_q4","vh_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
   '{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Văn Hóa Check (điểm {{SCORE_CULTURE}}/100 kèm 2 câu open-ended), phân tích sức khỏe văn hóa nội bộ và đưa ra 3 đề xuất cải thiện. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.","prompt_en":"You are Dr. Vinh — dental clinic management consultant. Based on the Culture Check score ({{SCORE_CULTURE}}/100 with 2 open-ended answers), analyze internal culture health and suggest 3 improvements. English, candid and warm tone. Quote their open-ended answers.","model_override":null,"max_tokens_override":2048}',
   '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"Văn Hóa Check","intro_desc":"Văn hóa là DNA của phòng khám. 7 câu hỏi giúp bạn đánh giá sức khỏe văn hóa nội bộ và mức độ gắn kết nhân viên.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
   '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Culture Check","intro_desc":"Culture is the DNA of your clinic. 7 questions to assess internal culture health and staff engagement.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
   9, datetime('now'), datetime('now')),

  ('thuong-hieu-check', 'thuong-hieu-check', 'Thương Hiệu Check', 'Brand Check',
   'Thương hiệu mạnh = bệnh nhân nhớ đến khi cần. 7 câu hỏi giúp bạn đánh giá mức độ nhận diện và uy tín thương hiệu phòng khám.',
   'Strong brand = patients remember you when they need care. 7 questions to assess brand recognition and reputation.',
   'Chẩn đoán nhanh theo Chương 10 — Xây Dựng Thương Hiệu',
   'Quick diagnosis based on Chapter 10 — Brand Building',
   '["Ch.10"]', 'active', 0, 'mini',
   '{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
   '{"dimensions":[{"id":"brand","name_vi":"Thương hiệu & Nhận diện","name_en":"Brand & Recognition","question_ids":["th_q1","th_q2","th_q3","th_q4","th_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
   '{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Thương Hiệu Check (điểm {{SCORE_BRAND}}/100 kèm 2 câu open-ended), phân tích mức độ nhận diện thương hiệu và đưa ra 3 đề xuất xây dựng thương hiệu. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.","prompt_en":"You are Dr. Vinh — dental clinic management consultant. Based on the Brand Check score ({{SCORE_BRAND}}/100 with 2 open-ended answers), analyze brand recognition and suggest 3 brand-building actions. English, candid and warm tone. Quote their open-ended answers.","model_override":null,"max_tokens_override":2048}',
   '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"Thương Hiệu Check","intro_desc":"Thương hiệu mạnh = bệnh nhân nhớ đến khi cần. 7 câu hỏi giúp bạn đánh giá mức độ nhận diện và uy tín thương hiệu phòng khám.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
   '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Brand Check","intro_desc":"Strong brand = patients remember you when they need care. 7 questions to assess brand recognition and reputation.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
   10, datetime('now'), datetime('now'));

-- Insert sections for each scanner (order_idx: 0 = select questions, 1 = open-ended)
INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon, created_at)
VALUES
  -- Marketing Check sections
  ('marketing-check', 0, 'PHẦN 1: ĐÁNH GIÁ MARKETING', 'PART 1: MARKETING EVALUATION',
   '5 chiều đánh giá: kênh tiếp cận, giữ chân, ROI, USP, và hiện diện online.',
   '5 evaluation dimensions: acquisition channels, retention, ROI, USP, and online presence.',
   'Ch.7 — Marketing Phòng Khám', 'campaign', datetime('now')),
  ('marketing-check', 1, 'PHẦN 2: TỰ SOI CHIẾU', 'PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế marketing.',
   'Two open questions to face marketing reality honestly.',
   'Ch.7 — Marketing Phòng Khám', 'psychology_alt', datetime('now')),

  -- An Toàn Check sections
  ('an-toan-check', 0, 'PHẦN 1: ĐÁNH GIÁ AN TOÀN', 'PART 1: SAFETY EVALUATION',
   '5 chiều đánh giá: giấy phép, vô trùng, PCCC, quản lý thuốc, và đào tạo khẩn cấp.',
   '5 evaluation dimensions: licensing, sterilization, fire safety, drug management, and emergency training.',
   'Ch.6 — An Toàn & Tuân Thủ', 'health_and_safety', datetime('now')),
  ('an-toan-check', 1, 'PHẦN 2: TỰ SOI CHIẾU', 'PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn thẳng vào lỗ hổng an toàn.',
   'Two open questions to face safety gaps honestly.',
   'Ch.6 — An Toàn & Tuân Thủ', 'psychology_alt', datetime('now')),

  -- CSKH Check sections
  ('cskh-check', 0, 'PHẦN 1: ĐÁNH GIÁ CSKH', 'PART 1: CS EVALUATION',
   '5 chiều đánh giá: tốc độ phản hồi, đào tạo nhân sự, thu thập feedback, xử lý khiếu nại, và follow-up.',
   '5 evaluation dimensions: response speed, staff training, feedback collection, complaint handling, and follow-up.',
   'Ch.8 — Dịch Vụ Khách Hàng', 'support_agent', datetime('now')),
  ('cskh-check', 1, 'PHẦN 2: TỰ SOI CHIẾU', 'PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn từ góc nhìn bệnh nhân.',
   'Two open questions to see from the patient perspective.',
   'Ch.8 — Dịch Vụ Khách Hàng', 'psychology_alt', datetime('now')),

  -- Văn Hóa Check sections
  ('van-hoa-check', 0, 'PHẦN 1: ĐÁNH GIÁ VĂN HÓA', 'PART 1: CULTURE EVALUATION',
   '5 chiều đánh giá: core values, lắng nghe, retention, đãi ngộ, và communication.',
   '5 evaluation dimensions: core values, listening, retention, compensation, and communication.',
   'Ch.9 — Văn Hóa Phòng Khám', 'diversity_3', datetime('now')),
  ('van-hoa-check', 1, 'PHẦN 2: TỰ SOI CHIẾU', 'PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn thẳng vào văn hóa nội bộ.',
   'Two open questions to face internal culture honestly.',
   'Ch.9 — Văn Hóa Phòng Khám', 'psychology_alt', datetime('now')),

  -- Thương Hiệu Check sections
  ('thuong-hieu-check', 0, 'PHẦN 1: ĐÁNH GIÁ THƯƠNG HIỆU', 'PART 1: BRAND EVALUATION',
   '5 chiều đánh giá: nhận diện, nhất quán, review, hiện diện online, và khác biệt hóa.',
   '5 evaluation dimensions: recognition, consistency, reviews, online presence, and differentiation.',
   'Ch.10 — Xây Dựng Thương Hiệu', 'stars', datetime('now')),
  ('thuong-hieu-check', 1, 'PHẦN 2: TỰ SOI CHIẾU', 'PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn thẳng vào vị thế thương hiệu.',
   'Two open questions to face your brand position honestly.',
   'Ch.10 — Xây Dựng Thương Hiệu', 'psychology_alt', datetime('now'));

-- Get section IDs for inserting questions
-- Sections are inserted in order, so IDs are:
-- marketing: (SELECT id FROM survey_section WHERE survey_id='marketing-check' AND order_idx=0/1)
-- an-toan:   (SELECT id FROM survey_section WHERE survey_id='an-toan-check' AND order_idx=0/1)
-- etc.

-- Insert Marketing Check questions (5 select + 2 textarea = 7)
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension, required, anchor, created_at)
SELECT s.id,
  CASE sq.qid
    WHEN 'mkt_q1' THEN 'mkt_q1'
    WHEN 'mkt_q2' THEN 'mkt_q2'
    WHEN 'mkt_q3' THEN 'mkt_q3'
    WHEN 'mkt_q4' THEN 'mkt_q4'
    WHEN 'mkt_q5' THEN 'mkt_q5'
  END,
  sq.oidx, sq.typ, sq.lbl_vi, sq.lbl_en,
  sq.sl_vi, sq.sl_en, sq.dim, 0, 0, datetime('now')
FROM survey_section s,
  (VALUES
    ('mkt_q1', 0, 'select',
     'Phòng khám tiếp cận bệnh nhân mới qua những kênh nào?',
     'What channels does your clinic use to reach new patients?',
     '{"1":"Chỉ qua giới thiệu miệng / khách quen","2":"Có Facebook/Zalo nhưng không có chiến lược","3":"Chạy quảng cáo Facebook/Google nhưng không đo ROI","4":"Có chiến lược đa kênh + đo hiệu quả","5":"Đa kênh + content marketing + CRM tự động"}',
     '{"1":"Only word of mouth / regulars","2":"Facebook/Zalo but no strategy","3":"Running ads but not measuring ROI","4":"Multi-channel strategy + ROI tracking","5":"Multi-channel + content marketing + auto CRM"}',
     'marketing'),
    ('mkt_q2', 1, 'select',
     'Bạn có hệ thống chăm sóc và giữ chân bệnh nhân cũ không?',
     'Do you have a system to care for and retain existing patients?',
     '{"1":"Không có, bệnh nhân quay lại tự nhiên","2":"Có gọi nhắc lịch nhưng không nhất quán","3":"Có chương trình chăm sóc định kỳ","4":"CRM + chương trình loyalty + theo dõi LTV","5":"Tự động hóa đầy đủ + phân tích LTV + upsell"}',
     '{"1":"No system, patients return naturally","2":"Recall calls but inconsistent","3":"Periodic care program","4":"CRM + loyalty program + LTV tracking","5":"Full automation + LTV analysis + upsell"}',
     'marketing'),
    ('mkt_q3', 2, 'select',
     'Chi phí marketing / doanh thu hàng tháng được theo dõi không?',
     'Is marketing spend as a % of revenue tracked monthly?',
     '{"1":"Không theo dõi, không biết bao nhiêu","2":"Có tính tổng nhưng không chi tiết","3":"Theo dõi cơ bản theo tổng","4":"Chi tiết theo từng kênh + so sánh hiệu quả","5":"Real-time dashboard + tối ưu hóa liên tục"}',
     '{"1":"Don''t track, don'\''t know how much","2":"Total known but no detail","3":"Basic total tracking","4":"Detailed per channel + ROI comparison","5":"Real-time dashboard + continuous optimization"}',
     'marketing'),
    ('mkt_q4', 3, 'select',
     'Phòng khám có "USP" (điểm bán hàng độc nhất) rõ ràng không?',
     'Does your clinic have a clear Unique Selling Proposition (USP)?',
     '{"1":"Không biết USP là gì","2":"Có nhưng chưa rõ ràng","3":"Có USP cơ bản, dùng trong giới thiệu","4":"USP rõ ràng + tích hợp vào mọi touchpoint","5":"Brand identity mạnh + USP + storytelling"}',
     '{"1":"Don''t know what USP is","2":"Some but not clear","3":"Basic USP, used in introductions","4":"Clear USP + integrated into every touchpoint","5":"Strong brand identity + USP + storytelling"}',
     'marketing'),
    ('mkt_q5', 4, 'select',
     'Phòng khám có chiến lược content (blog, video, educational) để xây dựng uy tín chuyên môn không?',
     'Does your clinic have a content strategy (blog, video, educational) to build professional credibility?',
     '{"1":"Không có content","2":"Đăng bài ad-hoc, không có chiến lược","3":"Có đăng đều nhưng không có chiến lược rõ","4":"Content strategy + đều đặn + có KPI","5":"Content machine + SEO + social proof + authority"}',
     '{"1":"No content","2":"Post ad-hoc, no strategy","3":"Post regularly but no clear strategy","4":"Content strategy + consistent + KPIs","5":"Content machine + SEO + social proof + authority"}',
     'marketing')
  ) sq(qid, oidx, typ, lbl_vi, lbl_en, sl_vi, sl_en, dim)
WHERE s.survey_id = 'marketing-check' AND s.order_idx = 0;

-- Marketing Check open-ended questions (section order_idx=1)
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en, required, created_at)
SELECT s.id, q.qid, q.oidx, 'textarea', q.lbl_vi, q.lbl_en, q.ph_vi, q.ph_en, 0, datetime('now')
FROM survey_section s,
  (VALUES
    ('mkt_open1', 0,
     'Kênh marketing nào đang hoạt động tốt nhất và kênh nào đang lãng phí ngân sách? Mô tả một tình huống cụ thể.',
     'Which marketing channel is working best and which is wasting budget? Describe a specific situation.',
     'Liệt kê 1-2 kênh hiệu quả nhất và 1-2 kênh cần cải thiện hoặc loại bỏ.',
     'List 1-2 best performing channels and 1-2 that need improvement or removal.'),
    ('mkt_open2', 1,
     'Nếu bạn có ngân sách marketing 10 triệu/tháng và chỉ tập trung vào 1 kênh, bạn sẽ chọn kênh nào? Tại sao?',
     'If you had a 10M VND/month marketing budget and could only focus on 1 channel, which would you choose? Why?',
     'Nghĩ về kênh nào mang lại bệnh nhân chất lượng nhất, không chỉ nhiều nhất.',
     'Think about which channel brings the highest quality patients, not just the most.')
  ) q(qid, oidx, lbl_vi, lbl_en, ph_vi, ph_en)
WHERE s.survey_id = 'marketing-check' AND s.order_idx = 1;

-- An Toàn Check questions (5 select)
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension, required, anchor, created_at)
SELECT s.id,
  CASE q.qid
    WHEN 'at_q1' THEN 'at_q1'
    WHEN 'at_q2' THEN 'at_q2'
    WHEN 'at_q3' THEN 'at_q3'
    WHEN 'at_q4' THEN 'at_q4'
    WHEN 'at_q5' THEN 'at_q5'
  END,
  q.oidx, 'select', q.lbl_vi, q.lbl_en, q.sl_vi, q.sl_en, 'safety', 0, 0, datetime('now')
FROM survey_section s,
  (VALUES
    ('at_q1', 0,
     'Phòng khám có giấy phép hoạt động còn hiệu lực và đạt tiêu chuẩn PCCC không?',
     'Does your clinic have a valid operating license and fire safety certification?',
     '{"1":"Không rõ / chưa kiểm tra","2":"Có nhưng chưa đầy đủ","3":"Giấy phép có, PCCC cơ bản","4":"Đầy đủ giấy phép + PCCC + kiểm tra định kỳ","5":"Tất cả đạt + tự động nhắc gia hạn"}',
     '{"1":"Don''t know / not checked","2":"Some but incomplete","3":"License yes, basic fire safety","4":"Full license + fire safety + periodic inspection","5":"All compliant + auto-renewal reminders"}'),
    ('at_q2', 1,
     'Quy trình vô trùng & khử khuẩn dụng cụ đạt chuẩn Bộ Y Tế và được ghi nhận không?',
     'Does instrument sterilization meet MOH standards and is it documented?',
     '{"1":"Theo cảm tính, không có checklist","2":"Có quy trình nhưng không ghi nhận","3":"Có SOP + checklist hàng ngày","4":"Đạt chuẩn + tracking từng mẻ","5":"ISO + tracking từng mẻ + audit nội bộ"}',
     '{"1":"Intuition-based, no checklist","2":"Process exists but not documented","3":"SOP + daily checklist","4":"Compliant + batch tracking","5":"ISO + batch tracking + internal audit"}'),
    ('at_q3', 2,
     'Nhân viên được đào tạo về xử lý tình huống khẩn cấp (cháy nổ, cấp cứu) chưa?',
     'Are staff trained on emergency response (fire, medical emergency)?',
     '{"1":"Không có, chưa từng tập","2":"Một số người lớn tuổi có kinh nghiệm","3":"Có hướng dẫn cơ bản","4":"Đào tạo định kỳ + có kế hoạch sơ tán","5":"Tập trung định kỳ + đánh giá + cập nhật"}',
     '{"1":"No training ever","2":"Some senior staff have experience","3":"Basic guidelines exist","4":"Regular training + evacuation plan","5":"Regular drills + evaluation + updates"}'),
    ('at_q4', 3,
     'Thuốc và vật tư y tế được quản lý theo quy định (nhiệt độ, hạn dùng, kê đơn) như thế nào?',
     'How are medicines and medical supplies managed (temperature, expiry, prescriptions)?',
     '{"1":"Không theo dõi, dùng đến đâu hay đến đó","2":"Có nhưng không nhất quán","3":"Kiểm tra nhiệt độ + hạn dùng cơ bản","4":"Hệ thống theo dõi + kê đơn đầy đủ","5":"Tự động nhắc hạn + báo cáo định kỳ"}',
     '{"1":"Not tracked, use until gone","2":"Some tracking but inconsistent","3":"Basic temperature + expiry check","4":"Monitoring system + full prescriptions","5":"Auto expiry alerts + periodic reports"}'),
    ('at_q5', 4,
     'Phòng khám có SOP cho tai biến y khoa (what to do when something goes wrong) chưa?',
     'Does your clinic have a SOP for medical adverse events (what to do when something goes wrong)?',
     '{"1":"Không có SOP, xử lý tùy tình huống","2":"Có hướng dẫn miệng","3":"Có SOP nhưng ít ai nhớ","4":"Có SOP + đào tạo + ghi nhận","5":"SOP + đào tạo + ghi nhận + root-cause analysis + cải tiến"}',
     '{"1":"No SOP, handled case-by-case","2":"Verbal guidance only","3":"SOP exists but few remember it","4":"SOP + training + documentation","5":"SOP + training + documentation + root-cause analysis + improvement"}')
  ) q(qid, oidx, lbl_vi, lbl_en, sl_vi, sl_en)
WHERE s.survey_id = 'an-toan-check' AND s.order_idx = 0;

-- An Toàn Check open-ended
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en, required, created_at)
SELECT s.id, q.qid, q.oidx, 'textarea', q.lbl_vi, q.lbl_en, q.ph_vi, q.ph_en, 0, datetime('now')
FROM survey_section s,
  (VALUES
    ('at_open1', 0,
     'An toàn nào là "lỗ hổng" lớn nhất của phòng khám hiện tại? Mô tả một tình huống cụ thể gần đây liên quan đến an toàn mà bạn nhớ rõ.',
     'What is the biggest safety gap in your clinic right now? Describe a recent specific safety-related situation you clearly remember.',
     'Mô tả ngắn gọn — giấy phép, vô trùng, PCCC, quản lý thuốc, hay đào tạo nhân sự?',
     'Brief — license, sterilization, fire safety, drug management, or staff training?'),
    ('at_open2', 1,
     'Nếu cơ quan chức năng đến kiểm tra bất ngờ vào ngày mai, bạn có tự tin không? Điều gì khiến bạn lo nhất?',
     'If regulators came for an unannounced inspection tomorrow, would you be confident? What worries you most?',
     'Hãy trung thực — đây là câu hỏi để bạn tự đánh giá mức độ sẵn sàng.',
     'Be honest — this is a self-assessment of your readiness level.')
  ) q(qid, oidx, lbl_vi, lbl_en, ph_vi, ph_en)
WHERE s.survey_id = 'an-toan-check' AND s.order_idx = 1;

-- CSKH Check questions (5 select)
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension, required, anchor, created_at)
SELECT s.id, q.qid, q.oidx, 'select', q.lbl_vi, q.lbl_en, q.sl_vi, q.sl_en, 'service', 0, 0, datetime('now')
FROM survey_section s,
  (VALUES
    ('cskh_q1', 0,
     'Thời gian phản hồi trung bình khi bệnh nhân liên hệ (Zalo, điện thoại, email) là bao lâu?',
     'What is the average response time when patients contact you (Zalo, phone, email)?',
     '{"1":"Không phản hồi / trả lời rất chậm (2-3 ngày+)","2":"1-2 ngày","3":"Vài giờ đến 1 ngày","4":"Trong giờ làm việc, dưới 2 giờ","5":"Tự động phản hồi ngay + theo dõi SLA"}',
     '{"1":"No response / very slow (2-3 days+)","2":"1-2 days","3":"A few hours to 1 day","4":"Within working hours, under 2 hours","5":"Instant auto-response + SLA tracking"}'),
    ('cskh_q2', 1,
     'Nhân viên CSKH được đào tạo về kỹ năng giao tiếp và xử lý khiếu nại chưa?',
     'Are CS staff trained on communication skills and complaint handling?',
     '{"1":"Không có đào tạo","2":"Đào tạo cơ bản khi vào làm","3":"Có đào tạo định kỳ 1-2 lần/năm","4":"Training chuyên sâu + role-play + feedback","5":"Continuous training + QA + coaching"}',
     '{"1":"No training","2":"Basic onboarding only","3":"Periodic training 1-2x/year","4":"Deep training + role-play + feedback","5":"Continuous training + QA + coaching"}'),
    ('cskh_q3', 2,
     'Phòng khám có thu thập và phân tích phản hồi bệnh nhân (NPS, survey) không?',
     'Does your clinic collect and analyze patient feedback (NPS, survey)?',
     '{"1":"Không có, không thu thập","2":"Có nghe phản hồi nhưng không hệ thống","3":"Survey định kỳ 1-2 lần/năm","4":"NPS hàng quý + phân tích root cause","5":"Real-time feedback + NPS + action plan"}',
     '{"1":"No collection at all","2":"Informal feedback only","3":"Periodic survey 1-2x/year","4":"Quarterly NPS + root cause analysis","5":"Real-time feedback + NPS + action plan"}'),
    ('cskh_q4', 3,
     'Khi có khiếu nại, quy trình xử lý và bồi thường ra sao?',
     'When a complaint arises, what is the handling process and compensation like?',
     '{"1":"Xử lý tùy tình huống, không có quy trình","2":"Có quy trình nhưng không nhất quán","3":"Có SOP xử lý khiếu nại + bồi thường theo quy định","4":"SOP + compensation + rút kinh nghiệm + cải tiến","5":"Full CRM + proactive resolution + recovery flowchart"}',
     '{"1":"Handled case-by-case, no process","2":"Process exists but inconsistent","3":"SOP + compensation per policy","4":"SOP + compensation + learning + improvement","5":"Full CRM + proactive resolution + recovery flowchart"}'),
    ('cskh_q5', 4,
     'Nhân viên có được train để "thấu cảm" với bệnh nhân không?',
     'Are staff trained to empathize with patients?',
     '{"1":"Không có đào tạo về thấu cảm","2":"Có nhắc nhưng không có đào tạo chính thức","3":"Đào tạo cơ bản về thấu cảm","4":"Training chuyên sâu + role-play + đánh giá","5":"Thấu cảm là văn hóa — mọi người tự nhiên thể hiện"}',
     '{"1":"No empathy training","2":"Reminded but no formal training","3":"Basic empathy training","4":"Deep training + role-play + evaluation","5":"Empathy is the culture — everyone naturally demonstrates it"}')
  ) q(qid, oidx, lbl_vi, lbl_en, sl_vi, sl_en)
WHERE s.survey_id = 'cskh-check' AND s.order_idx = 0;

-- CSKH Check open-ended
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en, required, created_at)
SELECT s.id, q.qid, q.oidx, 'textarea', q.lbl_vi, q.lbl_en, q.ph_vi, q.ph_en, 0, datetime('now')
FROM survey_section s,
  (VALUES
    ('cskh_open1', 0,
     'Điều gì khiến bệnh nhân KHÔNG quay lại phòng khám của bạn? Kể một tình huống cụ thể mà bạn biết hoặc nghe được.',
     'What makes patients NOT return to your clinic? Describe a specific situation you know or heard about.',
     'Mô tả ngắn gọn — thái độ, thời gian chờ, giá cả, hay vấn đề khác?',
     'Brief — attitude, wait time, pricing, or other issues?'),
    ('cskh_open2', 1,
     'Kể một tình huống mà nhân viên của bạn đã xử lý khiếu nại hoặc làm bệnh nhân cực kỳ hài lòng. Điều gì đã làm nên sự khác biệt?',
     'Describe a situation where your staff handled a complaint or made a patient extremely satisfied. What made the difference?',
     'Có thể trích dẫn tin nhắn, review, hoặc lời kể của nhân viên.',
     'You can quote a message, review, or staff story.')
  ) q(qid, oidx, lbl_vi, lbl_en, ph_vi, ph_en)
WHERE s.survey_id = 'cskh-check' AND s.order_idx = 1;

-- Văn Hóa Check questions (5 select)
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension, required, anchor, created_at)
SELECT s.id, q.qid, q.oidx, 'select', q.lbl_vi, q.lbl_en, q.sl_vi, q.sl_en, 'culture', 0, 0, datetime('now')
FROM survey_section s,
  (VALUES
    ('vh_q1', 0,
     'Phòng khám có "giá trị cốt lõi" (core values) rõ ràng và được nhân viên biết không?',
     'Does your clinic have clear core values that staff know and follow?',
     '{"1":"Không có, chưa bao giờ nói về giá trị","2":"Có treo tường nhưng ít ai nhớ","3":"Giá trị cơ bản, nhắc nhở thỉnh thoảng","4":"Giá trị rõ ràng + tích hợp vào đánh giá","5":"Core values-driven culture + recruitment + recognition"}',
     '{"1":"No core values defined","2":"Posted on wall but rarely remembered","3":"Basic values, occasionally referenced","4":"Clear values + integrated in performance reviews","5":"Core values-driven culture + recruitment + recognition"}'),
    ('vh_q2', 1,
     'Nhân viên có được lắng nghe và tham gia vào quyết định không?',
     'Are staff listened to and included in decision-making?',
     '{"1":"Mọi quyết định đều từ chủ / quản lý","2":"Ít khi, chỉ hỏi ý kiến cho form","3":"Thỉnh thoảng hỏi nhưng không theo quy trình","4":"Có quy trình lấy ý kiến + feedback loop","5":"Democratic culture + empowerment + innovation"}',
     '{"1":"All decisions from owner/manager","2":"Rarely, only formal consultations","3":"Sometimes asked but no process","4":"Process for input + feedback loop","5":"Democratic culture + empowerment + innovation"}'),
    ('vh_q3', 2,
     'Tỷ lệ nghỉ việc / thay đổi nhân sự trong 12 tháng qua là bao nhiêu?',
     'What is your staff turnover rate in the past 12 months?',
     '{"1":"Trên 50% — thay đổi liên tục","2":"30-50% — khá cao","3":"15-30% — bình thường với ngành","4":"5-15% — có một số vị trí khó giữ","5":"Dưới 5% — nhân sự ổn định"}',
     '{"1":"Over 50% — constant turnover","2":"30-50% — quite high","3":"15-30% — normal for the industry","4":"5-15% — some hard-to-retain positions","5":"Under 5% — stable team"}'),
    ('vh_q4', 3,
     'Phòng khám có chế độ đãi ngộ và phúc lợi (ngoài lương) rõ ràng không?',
     'Does your clinic have clear compensation and benefits (beyond salary)?',
     '{"1":"Chỉ có lương, không có phúc lợi","2":"Phúc lợi ad-hoc, không có quy định","3":"Có phúc lợi cơ bản (BHXH, BHYT)","4":"Phúc lợi đầy đủ + thưởng KPI + team building","5":"Full package + career path + professional development"}',
     '{"1":"Salary only, no benefits","2":"Ad-hoc benefits, no policy","3":"Basic benefits (social insurance, health insurance)","4":"Full benefits + KPI bonus + team building","5":"Full package + career path + professional development"}'),
    ('vh_q5', 4,
     'An toàn tâm lý (psychological safety) trong phòng khám như thế nào?',
     'What is the psychological safety level in your clinic?',
     '{"1":"Không ai dám nói thẳng, sợ bị phạt","2":"Chỉ một vài người dám, phần lớn im lặng","3":"Cố gắng xây dựng nhưng chưa thành","4":"Phần lớn an toàn, có thể nói thẳng","5":"An toàn tâm lý cao — mọi người nói thẳng vì tin tưởng"}',
     '{"1":"No one dares to speak up, afraid of punishment","2":"Only a few dare, most stay silent","3":"Trying to build but not yet there","4":"Most feel safe, can speak up","5":"High psychological safety — everyone speaks up because of trust"}')
  ) q(qid, oidx, lbl_vi, lbl_en, sl_vi, sl_en)
WHERE s.survey_id = 'van-hoa-check' AND s.order_idx = 0;

-- Văn Hóa Check open-ended
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en, required, created_at)
SELECT s.id, q.qid, q.oidx, 'textarea', q.lbl_vi, q.lbl_en, q.ph_vi, q.ph_en, 0, datetime('now')
FROM survey_section s,
  (VALUES
    ('vh_open1', 0,
     'Văn hóa nào đang "xung đột" hoặc không phù hợp với định hướng phòng khám? Mô tả một tình huống cụ thể mà bạn nhớ rõ.',
     'What cultural aspect is "conflicting" or not aligned with your clinic direction? Describe a specific situation you remember.',
     'Ví dụ: "nói một đằng làm một nẻo", "không ai dám nói thẳng", "thiếu teamwork"...',
     'e.g. "say one thing, do another", "no one speaks up", "lack of teamwork"...'),
    ('vh_open2', 1,
     'Nhân viên có tự hào khi giới thiệu nơi làm việc cho bạn bè/người thân không? Tại sao bạn nghĩ vậy?',
     'Are staff proud to introduce their workplace to friends/family? Why do you think so?',
     'Hãy trung thực — đây là dấu hiệu quan trọng nhất của văn hóa lành mạnh.',
     'Be honest — this is the most important sign of a healthy culture.')
  ) q(qid, oidx, lbl_vi, lbl_en, ph_vi, ph_en)
WHERE s.survey_id = 'van-hoa-check' AND s.order_idx = 1;

-- Thương Hiệu Check questions (5 select)
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension, required, anchor, created_at)
SELECT s.id, q.qid, q.oidx, 'select', q.lbl_vi, q.lbl_en, q.sl_vi, q.sl_en, 'brand', 0, 0, datetime('now')
FROM survey_section s,
  (VALUES
    ('th_q1', 0,
     'Người trong khu vực (bán kính 5km) có biết phòng khám của bạn không?',
     'Do people in your area (5km radius) know your clinic?',
     '{"1":"Không ai biết, chưa ai nhắc","2":"Vài người quen biết","3":"Biết đến nhưng không nhớ rõ dịch vụ","4":"Nhớ tên + dịch vụ chính + vị trí","5":"Top-of-mind trong khu vực + NPS cao"}',
     '{"1":"Nobody knows, no referrals","2":"Some acquaintances know","3":"Heard of but unclear on services","4":"Remembers name + main services + location","5":"Top-of-mind in the area + high NPS"}'),
    ('th_q2', 1,
     'Phòng khám có nhận diện thương hiệu (logo, màu sắc, slogan) nhất quán không?',
     'Does your clinic have consistent brand identity (logo, colors, slogan)?',
     '{"1":"Không có, mỗi nơi một kiểu","2":"Có logo cơ bản, không có guideline","3":"Có nhận diện cơ bản, dùng không nhất quán","4":"Brand guideline đầy đủ + nhất quán trên mọi touchpoint","5":"Professional brand identity + digital + offline consistency"}',
     '{"1":"No identity, everything inconsistent","2":"Basic logo, no guidelines","3":"Basic identity but inconsistently used","4":"Full brand guideline + consistent on all touchpoints","5":"Professional brand identity + digital + offline consistency"}'),
    ('th_q3', 2,
     'Phòng khám có đánh giá / review online (Google, Facebook, Zalo) và quản lý không?',
     'Does your clinic manage online reviews (Google, Facebook, Zalo)?',
     '{"1":"Không có, không theo dõi","2":"Có ít review nhưng không trả lời","3":"Trả lời khi có review mới","4":"Chủ động xin review + trả lời tất cả + phân tích","5":"Full review management + sentiment analysis + proactive"}',
     '{"1":"No reviews, no tracking","2":"Some reviews but no responses","3":"Responds when new reviews appear","4":"Proactively asks for reviews + responds + analyzes","5":"Full review management + sentiment analysis + proactive"}'),
    ('th_q4', 3,
     'Phòng khám có sự hiện diện online (website, Google Business, mạng xã hội) mạnh không?',
     'Does your clinic have a strong online presence (website, Google Business, social media)?',
     '{"1":"Không có website / chỉ có trang Facebook cơ bản","2":"Website cơ bản + Facebook nhưng ít cập nhật","3":"Website + Google Business + Facebook active","4":"Full online presence + regular content + SEO","5":"Integrated digital brand + content strategy + analytics"}',
     '{"1":"No website / only basic Facebook page","2":"Basic website + Facebook but rarely updated","3":"Website + Google Business + active Facebook","4":"Full online presence + regular content + SEO","5":"Integrated digital brand + content strategy + analytics"}'),
    ('th_q5', 4,
     'Phòng khám có chiến lược xây dựng uy tín (educational content, KOL, partnership) để tạo niềm tin dài hạn không?',
     'Does your clinic have a strategy to build credibility (educational content, KOL, partnerships) for long-term trust?',
     '{"1":"Không có chiến lược này","2":"Có đôi chút nhưng không có chiến lược","3":"Có content đều đặn nhưng chưa có chiến lược rõ","4":"Chiến lược rõ + content + partnership","5":"Full authority building: content + community + thought leadership"}',
     '{"1":"No such strategy","2":"Some effort but no strategy","3":"Regular content but no clear strategy","4":"Clear strategy + content + partnerships","5":"Full authority building: content + community + thought leadership"}')
  ) q(qid, oidx, lbl_vi, lbl_en, sl_vi, sl_en)
WHERE s.survey_id = 'thuong-hieu-check' AND s.order_idx = 0;

-- Thương Hiệu Check open-ended
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en, required, created_at)
SELECT s.id, q.qid, q.oidx, 'textarea', q.lbl_vi, q.lbl_en, q.ph_vi, q.ph_en, 0, datetime('now')
FROM survey_section s,
  (VALUES
    ('th_open1', 0,
     'Cạnh tranh trực tiếp với phòng khám nào trong khu vực và điều gì khiến bạn khác biệt? Điều gì khiến bệnh nhân chọn bạn thay vì đối thủ?',
     'Who are your direct competitors in the area and what makes you different? What makes patients choose you over competitors?',
     'Liệt kê 1-2 đối thủ chính và 1-2 điều khiến phòng khám của bạn khác biệt.',
     'List 1-2 main competitors and 1-2 things that make your clinic different.'),
    ('th_open2', 1,
     'Nếu bạn phải mô tả thương hiệu phòng khám bằng 3 từ, bạn sẽ chọn 3 từ nào? Những từ đó có đúng với thực tế không?',
     'If you had to describe your clinic brand in 3 words, which 3 words would you choose? Do those words match reality?',
     'Ví dụ: "Uy tín — Tận tâm — Chuyên nghiệp" — hãy đánh giá thực tế mỗi từ.',
     'e.g.: "Trusted — Caring — Professional" — rate how true each word is in reality.')
  ) q(qid, oidx, lbl_vi, lbl_en, ph_vi, ph_en)
WHERE s.survey_id = 'thuong-hieu-check' AND s.order_idx = 1;
