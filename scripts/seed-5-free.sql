-- Seed 5 free scanners into D1 via direct SQL
-- Run: npx wrangler d1 execute dentalempireos-db --config wrangler.jsonc --remote --file scripts/seed-5-free.sql

-- Clean up existing data for these 5 scanners
DELETE FROM survey_question WHERE section_id IN (
  SELECT id FROM survey_section WHERE survey_id IN (
    'startup-check','content-funnel-check','referral-check','do-luong-check','kho-vat-tu-check'
  )
);
DELETE FROM survey_section WHERE survey_id IN (
  'startup-check','content-funnel-check','referral-check','do-luong-check','kho-vat-tu-check'
);
DELETE FROM survey_definition WHERE id IN (
  'startup-check','content-funnel-check','referral-check','do-luong-check','kho-vat-tu-check'
);

-- ===================== STARTUP-CHECK =====================
INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, updated_at)
VALUES ('startup-check','startup-check','Startup Check','Startup Check',
'Mới mở phòng khám hoặc dưới 3 năm? Đánh giá ngay 5 khía cạnh quan trọng nhất để khởi đầu vững chắc.',
'New clinic or under 3 years old? Assess the 5 most critical areas for a solid start.',
'Chẩn đoán nhanh cho phòng khám mới thành lập','Quick diagnosis for newly established clinics',
'["Ch.MỚI"]','active',1,'mini',
'{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
'{"dimensions":[{"id":"startup","name_vi":"Mức độ khởi đầu","name_en":"Startup Readiness","question_ids":["st_q1","st_q2","st_q3","st_q4","st_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
'{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Startup Check (điểm startup/100 kèm 2 câu open-ended), phân tích mức độ sẵn sàng và đưa ra 3 hành động ưu tiên trong 90 ngày đầu.","prompt_en":"You are Dr. Vinh — dental clinic consultant. Based on Startup Check score (startup/100 with 2 open-ended answers), analyze readiness and suggest 3 priority actions for first 90 days.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU\n- Điểm số: startup/100\n- Câu trả lời: OPEN_RESPONSES\n\n# NHIỆM VỤ\nTạo kế hoạch 90 ngày. Mỗi tuần 2-3 hành động cụ thể.\n\n# CẤU TRÚC\n## Giai đoạn 1 (Ngày 1-30)\n...\n## Giai đoạn 2 (Ngày 31-60)\n...\n## Giai đoạn 3 (Ngày 61-90)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT\n- Score: startup/100\n- Open answers: OPEN_RESPONSES\n\n# TASK\nCreate a 90-day plan. Each week 2-3 specific actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n## Phase 2 (Days 31-60)\n...\n## Phase 3 (Days 61-90)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}',
'{}','{}',11,datetime('now'));

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('startup-check',0,'PHẦN 1: ĐÁNH GIÁ KHỞI ĐẦU','PART 1: STARTUP EVALUATION',
'5 chiều đánh giá: legal, vị trí, thiết bị, quy trình, và đội ngũ.',
'5 evaluation dimensions: legal, location, equipment, processes, and team.',
'Phòng khám mới — Startup','rocket_launch');

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('startup-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
'Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế khởi nghiệp.',
'Two open questions to face your startup reality honestly.',
'Phòng khám mới — Startup','psychology_alt');

-- ===================== CONTENT-FUNNEL-CHECK =====================
INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, updated_at)
VALUES ('content-funnel-check','content-funnel-check','Content & Funnel Check','Content & Funnel Check',
'Kiểm tra chiến lược content marketing và funnel thu hút bệnh nhân mới của bạn đang hoạt động tốt như thế nào.',
'Check how well your content marketing strategy and patient acquisition funnel are working.',
'Đánh giá content marketing và funnel thu hút bệnh nhân','Assess content marketing and patient acquisition funnel',
'["Ch.CLOUDS"]','active',1,'mini',
'{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
'{"dimensions":[{"id":"content","name_vi":"Content & Funnel","name_en":"Content & Funnel","question_ids":["cf_q1","cf_q2","cf_q3","cf_q4","cf_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
'{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Content & Funnel Check (điểm content/100 kèm 2 câu open-ended), phân tích chiến lược content marketing và đưa ra 3 cải thiện ưu tiên.","prompt_en":"You are Dr. Vinh — dental clinic consultant. Based on Content & Funnel Check score (content/100 with 2 open-ended answers), analyze your content strategy and suggest 3 priority improvements.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU\n- Điểm số: content/100\n- Câu trả lời: OPEN_RESPONSES\n\n# NHIỆM VỤ\nTạo kế hoạch 90 ngày cải thiện content marketing. Mỗi tuần 2-3 hành động cụ thể.\n\n# CẤU TRÚC\n## Giai đoạn 1 (Ngày 1-30)\n...\n## Giai đoạn 2 (Ngày 31-60)\n...\n## Giai đoạn 3 (Ngày 61-90)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT\n- Score: content/100\n- Open answers: OPEN_RESPONSES\n\n# TASK\nCreate a 90-day content marketing improvement plan. Each week 2-3 specific actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n## Phase 2 (Days 31-60)\n...\n## Phase 3 (Days 61-90)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}',
'{}','{}',12,datetime('now'));

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('content-funnel-check',0,'PHẦN 1: ĐÁNH GIÁ CONTENT & FUNNEL','PART 1: CONTENT & FUNNEL EVALUATION',
'5 chiều đánh giá: website, SEO, social, chuyển đổi, và đo lường.',
'5 evaluation dimensions: website, SEO, social, conversion, and measurement.',
'Content & Funnel — Clouds','campaign');

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('content-funnel-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
'Hai câu hỏi mở giúp bạn nhìn thẳng vào chiến lược content.',
'Two open questions to face your content strategy honestly.',
'Content & Funnel — Clouds','psychology_alt');

-- ===================== REFERRAL-CHECK =====================
INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, updated_at)
VALUES ('referral-check','referral-check','Referral Check','Referral Check',
'Hệ thống giới thiệu (referral) là nguồn bệnh nhân chất lượng cao và chi phí thấp nhất. Đánh giá xem phòng khám của bạn đang khai thác tốt chưa.',
'Referral system is the highest quality and lowest cost patient source. Assess how well your clinic is leveraging it.',
'Đánh giá hệ thống giới thiệu bệnh nhân','Assess patient referral system',
'["Ch.REFERRAL"]','active',1,'mini',
'{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
'{"dimensions":[{"id":"referral","name_vi":"Referral System","name_en":"Referral System","question_ids":["rf_q1","rf_q2","rf_q3","rf_q4","rf_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
'{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Referral Check (điểm referral/100 kèm 2 câu open-ended), phân tích hệ thống giới thiệu và đưa ra 3 cải thiện ưu tiên.","prompt_en":"You are Dr. Vinh — dental clinic consultant. Based on Referral Check score (referral/100 with 2 open-ended answers), analyze your referral system and suggest 3 priority improvements.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU\n- Điểm số: referral/100\n- Câu trả lời: OPEN_RESPONSES\n\n# NHIỆM VỤ\nTạo kế hoạch 90 ngày cải thiện hệ thống referral. Mỗi tuần 2-3 hành động cụ thể.\n\n# CẤU TRÚC\n## Giai đoạn 1 (Ngày 1-30)\n...\n## Giai đoạn 2 (Ngày 31-60)\n...\n## Giai đoạn 3 (Ngày 61-90)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT\n- Score: referral/100\n- Open answers: OPEN_RESPONSES\n\n# TASK\nCreate a 90-day referral system improvement plan. Each week 2-3 specific actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n## Phase 2 (Days 31-60)\n...\n## Phase 3 (Days 61-90)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}',
'{}','{}',13,datetime('now'));

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('referral-check',0,'PHẦN 1: ĐÁNH GIÁ HỆ THỐNG REFERRAL','PART 1: REFERRAL SYSTEM EVALUATION',
'5 chiều đánh giá: chương trình, ưu đãi, quy trình, theo dõi, và đo lường.',
'5 evaluation dimensions: program, incentives, process, tracking, and measurement.',
'Referral — Referral','handshake');

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('referral-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
'Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế referral.',
'Two open questions to face your referral reality honestly.',
'Referral — Referral','psychology_alt');

-- ===================== DO-LUONG-CHECK =====================
INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, updated_at)
VALUES ('do-luong-check','do-luong-check','Đo Lường Check','Metrics & Measurement Check',
'Không đo lường thì không thể cải thiện. Đánh giá văn hóa data-driven của phòng khám bạn.',
'You cannot improve what you do not measure. Assess your clinic''s data-driven culture.',
'Đánh giá văn hóa đo lường và data-driven','Assess metrics and data-driven culture',
'["Ch.METRICS"]','active',1,'mini',
'{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
'{"dimensions":[{"id":"metrics","name_vi":"Đo lường","name_en":"Metrics","question_ids":["dl_q1","dl_q2","dl_q3","dl_q4","dl_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
'{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Đo Lường Check (điểm metrics/100 kèm 2 câu open-ended), phân tích văn hóa data-driven và đưa ra 3 cải thiện ưu tiên.","prompt_en":"You are Dr. Vinh — dental clinic consultant. Based on Metrics & Measurement Check score (metrics/100 with 2 open-ended answers), analyze your data-driven culture and suggest 3 priority improvements.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU\n- Điểm số: metrics/100\n- Câu trả lời: OPEN_RESPONSES\n\n# NHIỆM VỤ\nTạo kế hoạch 90 ngày xây dựng văn hóa đo lường. Mỗi tuần 2-3 hành động cụ thể.\n\n# CẤU TRÚC\n## Giai đoạn 1 (Ngày 1-30)\n...\n## Giai đoạn 2 (Ngày 31-60)\n...\n## Giai đoạn 3 (Ngày 61-90)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT\n- Score: metrics/100\n- Open answers: OPEN_RESPONSES\n\n# TASK\nCreate a 90-day metrics culture building plan. Each week 2-3 specific actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n## Phase 2 (Days 31-60)\n...\n## Phase 3 (Days 61-90)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}',
'{}','{}',14,datetime('now'));

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('do-luong-check',0,'PHẦN 1: ĐÁNH GIÁ ĐO LƯỜNG','PART 1: METRICS EVALUATION',
'5 chiều đánh giá: KPI, dashboard, báo cáo, phân tích, và hành động.',
'5 evaluation dimensions: KPIs, dashboards, reports, analysis, and action.',
'Đo lường — Metrics','speed');

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('do-luong-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
'Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế đo lường.',
'Two open questions to face your measurement reality honestly.',
'Đo lường — Metrics','psychology_alt');

-- ===================== KHO-VAT-TU-CHECK =====================
INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, updated_at)
VALUES ('kho-vat-tu-check','kho-vat-tu-check','Kho Vật Tư Check','Inventory & Supplies Check',
'Quản lý vật tư hiệu quả giúp tiết kiệm chi phí và tránh thiếu hụt. Đánh giá hệ thống kho vật tư của phòng khám.',
'Efficient supply management saves costs and prevents stockouts. Assess your clinic inventory system.',
'Đánh giá hệ thống kho vật tư và vật tư tiêu hao','Assess inventory and consumables management',
'["Ch.SUPPLY"]','active',1,'mini',
'{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
'{"dimensions":[{"id":"inventory","name_vi":"Kho vật tư","name_en":"Inventory","question_ids":["kvt_q1","kvt_q2","kvt_q3","kvt_q4","kvt_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
'{"prompt_vi":"Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Kho Vật Tư Check (điểm inventory/100 kèm 2 câu open-ended), phân tích hệ thống kho vật tư và đưa ra 3 cải thiện ưu tiên.","prompt_en":"You are Dr. Vinh — dental clinic consultant. Based on Inventory & Supplies Check score (inventory/100 with 2 open-ended answers), analyze your inventory system and suggest 3 priority improvements.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU\n- Điểm số: inventory/100\n- Câu trả lời: OPEN_RESPONSES\n\n# NHIỆM VỤ\nTạo kế hoạch 90 ngày cải thiện quản lý kho vật tư. Mỗi tuần 2-3 hành động cụ thể.\n\n# CẤU TRÚC\n## Giai đoạn 1 (Ngày 1-30)\n...\n## Giai đoạn 2 (Ngày 31-60)\n...\n## Giai đoạn 3 (Ngày 61-90)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT\n- Score: inventory/100\n- Open answers: OPEN_RESPONSES\n\n# TASK\nCreate a 90-day inventory management improvement plan. Each week 2-3 specific actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n## Phase 2 (Days 31-60)\n...\n## Phase 3 (Days 61-90)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}',
'{}','{}',15,datetime('now'));

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('kho-vat-tu-check',0,'PHẦN 1: ĐÁNH GIÁ KHO VẬT TƯ','PART 1: INVENTORY EVALUATION',
'5 chiều đánh giá: theo dõi tồn kho, đặt hàng, lưu trữ, kiểm soát chất lượng, và chi phí.',
'5 evaluation dimensions: stock tracking, ordering, storage, quality control, and cost.',
'Kho Vật Tư — Supply','inventory_2');

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('kho-vat-tu-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
'Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế kho vật tư.',
'Two open questions to face your inventory reality honestly.',
'Kho Vật Tư — Supply','psychology_alt');
