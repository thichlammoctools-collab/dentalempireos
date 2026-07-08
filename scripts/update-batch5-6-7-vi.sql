-- UPDATE: Vietnamese text + ai_config + scoring_rules for batch 5+6+7 scanners

-- === kpi-check ===
UPDATE survey_definition SET
  translations_vi = '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"KPI Check","intro_desc":"5 câu hỏi giúp bạn đánh giá mức độ KPI-ization của phòng khám.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  translations_en = '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"KPI Check","intro_desc":"5 questions to assess your clinic''s KPI-ization.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  scoring_rules = '{"dimensions":[{"id":"kpi","name_vi":"KPI & Quản lý dữ liệu","name_en":"KPI & Data Management","question_ids":["kpi_q1","kpi_q2","kpi_q3","kpi_q4","kpi_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  ai_config = '{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia KPI nha khoa. Dựa trên kết quả KPI Check (điểm {{SCORE_KPI}}/100 kèm 2 câu open-ended), phân tích KPI management và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyến khích.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS, dental KPI expert. Based on the KPI Check score ({{SCORE_KPI}}/100 with 2 open-ended answers), analyze KPI management and suggest 3 improvements. English, practical tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_KPI}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày xây dựng KPI cho phòng khám.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_KPI}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to build clinic KPIs.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}'
WHERE id = 'kpi-check';

UPDATE survey_section SET
  title_vi = 'PHẦN 1: ĐÁNH GIÁ KPI',
  subtitle_vi = '5 chiều đánh giá: mục tiêu, theo dõi, phân tích, cải tiến, và văn hóa data.'
WHERE survey_id = 'kpi-check' AND order_idx = 0;

UPDATE survey_section SET
  title_vi = 'PHẦN 2: TỰ SOI CHIẾU',
  subtitle_vi = 'Hai câu hỏi mở giúp bạn nhìn sâu vào văn hóa KPI.'
WHERE survey_id = 'kpi-check' AND order_idx = 1;

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ về 3-5 KPIs chính: doanh thu, bệnh nhân mới, case mix, chi phí, NPS... Cái nào bạn biết chính xác và cái nào bạn "mù tịt"?',
  placeholder_en = 'Think about 3-5 main KPIs: revenue, new patients, case mix, costs, NPS... Which do you know precisely and which are you "blind" to?'
WHERE question_id = 'kpi_open1';

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ về "north star metric" — cái KPI mà nếu nó tốt thì mọi thứ khác sẽ theo. Ví dụ: số bệnh nhân mới, NPS, doanh thu per patient...',
  placeholder_en = 'Think about the "north star metric" — the KPI that if it is good, everything else follows. Example: new patients, NPS, revenue per patient...'
WHERE question_id = 'kpi_open2';

-- === os-maturity-check ===
UPDATE survey_definition SET
  translations_vi = '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"OS Maturity Check","intro_desc":"5 câu hỏi giúp bạn đánh giá mức độ trưởng thành hệ thống phòng khám.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  translations_en = '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"OS Maturity Check","intro_desc":"5 questions to assess your clinic''s system maturity.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  scoring_rules = '{"dimensions":[{"id":"maturity","name_vi":"Mức độ trưởng thành","name_en":"Maturity Level","question_ids":["osm_q1","osm_q2","osm_q3","osm_q4","osm_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  ai_config = '{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia hệ thống phòng khám. Dựa trên kết quả OS Maturity Check (điểm {{SCORE_MATURITY}}/100 kèm 2 câu open-ended), phân tích mức độ trưởng thành hệ thống và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyến khích.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS, clinic systems expert. Based on the OS Maturity Check score ({{SCORE_MATURITY}}/100 with 2 open-ended answers), analyze system maturity and suggest 3 improvements. English, practical tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_MATURITY}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày nâng cấp mức độ trưởng thành hệ thống.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_MATURITY}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to increase system maturity.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}'
WHERE id = 'os-maturity-check';

UPDATE survey_section SET
  title_vi = 'PHẦN 1: ĐÁNH GIÁ MỨC ĐỘ TRƯỞNG THÀNH',
  subtitle_vi = '5 chiều đánh giá: tài liệu, vận hành, con người, dữ liệu, và cải tiến.'
WHERE survey_id = 'os-maturity-check' AND order_idx = 0;

UPDATE survey_section SET
  title_vi = 'PHẦN 2: TỰ SOI CHIẾU',
  subtitle_vi = 'Hai câu hỏi mở giúp bạn nhìn sâu vào mức độ trưởng thành.'
WHERE survey_id = 'os-maturity-check' AND order_idx = 1;

UPDATE survey_question SET
  placeholder_vi = 'Ví dụ: "chỉ có mình tôi biết làm", "không có SOP", "đội ngũ không đủ năng lực"... Đâu là "cái cổ chai" thực sự?',
  placeholder_en = 'e.g. "only I know how to do it", "no SOPs", "team not capable enough"... What is the real "bottleneck"?'
WHERE question_id = 'osm_open1';

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ về: con người, quy trình, công cụ, dữ liệu, văn hóa... Cái nào giải quyết xong thì mọi thứ khác sẽ "bay" lên?',
  placeholder_en = 'Think: people, process, tools, data, culture... Which one, once solved, would make everything else "take off"?'
WHERE question_id = 'osm_open2';

-- === dao-tao-check ===
UPDATE survey_definition SET
  translations_vi = '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"Đào Tạo Check","intro_desc":"5 câu hỏi giúp bạn đánh giá hệ thống đào tạo phòng khám.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  translations_en = '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Training Check","intro_desc":"5 questions to assess your clinic''s training system.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  scoring_rules = '{"dimensions":[{"id":"training","name_vi":"Hệ thống đào tạo","name_en":"Training System","question_ids":["dt_q1","dt_q2","dt_q3","dt_q4","dt_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  ai_config = '{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia đào tạo nha khoa. Dựa trên kết quả Đào Tạo Check (điểm {{SCORE_TRAINING}}/100 kèm 2 câu open-ended), phân tích hệ thống đào tạo và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyến khích.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS, dental training expert. Based on the Training Check score ({{SCORE_TRAINING}}/100 with 2 open-ended answers), analyze training system and suggest 3 improvements. English, practical tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_TRAINING}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày xây dựng hệ thống đào tạo.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_TRAINING}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to build a training system.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}'
WHERE id = 'dao-tao-check';

UPDATE survey_section SET
  title_vi = 'PHẦN 1: ĐÁNH GIÁ ĐÀO TẠO',
  subtitle_vi = '5 chiều đánh giá: onboarding, kỹ năng, mentorship, đào tạo chuyên môn, và phát triển.'
WHERE survey_id = 'dao-tao-check' AND order_idx = 0;

UPDATE survey_section SET
  title_vi = 'PHẦN 2: TỰ SOI CHIẾU',
  subtitle_vi = 'Hai câu hỏi mở giúp bạn nhìn sâu vào văn hóa đào tạo.'
WHERE survey_id = 'dao-tao-check' AND order_idx = 1;

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ về: kỹ năng chuyên môn, kỹ năng mềm, kỹ năng quản lý... Đâu là khoảng trống ảnh hưởng nhiều nhất đến kết quả phòng khám?',
  placeholder_en = 'Think: clinical skills, soft skills, management skills... Which gap most impacts clinic results?'
WHERE question_id = 'dt_open1';

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ về: onboarding program, kỹ năng chuyên môn, kỹ năng mềm, leadership... Cái nào sẽ tạo ra compound effect — ảnh hưởng tốt lan tỏa sang nhiều areas?',
  placeholder_en = 'Think: onboarding program, clinical skills, soft skills, leadership... Which would create a compound effect — benefits that ripple into many areas?'
WHERE question_id = 'dt_open2';

-- === patient-experience-check ===
UPDATE survey_definition SET
  translations_vi = '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"Patient Experience Check","intro_desc":"5 câu hỏi giúp bạn đánh giá toàn diện trải nghiệm bệnh nhân.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  translations_en = '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Patient Experience Check","intro_desc":"5 questions to comprehensively assess patient experience.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  scoring_rules = '{"dimensions":[{"id":"experience","name_vi":"Trải nghiệm bệnh nhân","name_en":"Patient Experience","question_ids":["pex_q1","pex_q2","pex_q3","pex_q4","pex_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  ai_config = '{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia trải nghiệm bệnh nhân nha khoa. Dựa trên kết quả Patient Experience Check (điểm {{SCORE_EXPERIENCE}}/100 kèm 2 câu open-ended), phân tích trải nghiệm bệnh nhân và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyến khích.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS, dental patient experience expert. Based on the Patient Experience Check score ({{SCORE_EXPERIENCE}}/100 with 2 open-ended answers), analyze patient experience and suggest 3 improvements. English, practical tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_EXPERIENCE}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày cải thiện trải nghiệm bệnh nhân.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_EXPERIENCE}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to improve patient experience.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}'
WHERE id = 'patient-experience-check';

UPDATE survey_section SET
  title_vi = 'PHẦN 1: ĐÁNH GIÁ TRẢI NGHIỆM',
  subtitle_vi = '5 chiều đánh giá: tiếp cận, chờ đợi, phòng khám, dịch vụ, và sau điều trị.'
WHERE survey_id = 'patient-experience-check' AND order_idx = 0;

UPDATE survey_section SET
  title_vi = 'PHẦN 2: TỰ SOI CHIẾU',
  subtitle_vi = 'Hai câu hỏi mở giúp bạn nhìn sâu vào trải nghiệm bệnh nhân.'
WHERE survey_id = 'patient-experience-check' AND order_idx = 1;

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ về phản hồi gần nhất — qua reviews, lời nói, Zalo... Bệnh nhân nhớ điều gì nhất về phòng khám của bạn?',
  placeholder_en = 'Think about recent feedback — via reviews, word of mouth, Zalo... What do patients remember most about your clinic?'
WHERE question_id = 'pex_open1';

UPDATE survey_question SET
  placeholder_vi = 'Thử đặt mình vào vị trí bệnh nhân lần đầu. Điều gì sẽ làm bạn nói "wow" và điều gì sẽ làm bạn nói "hic"?',
  placeholder_en = 'Try to put yourself in a first-time patient''s shoes. What would make you say "wow" and what would make you say "ugh"?'
WHERE question_id = 'pex_open2';

-- === crm-check ===
UPDATE survey_definition SET
  translations_vi = '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"CRM Check","intro_desc":"5 câu hỏi giúp bạn đánh giá hệ thống quản lý quan hệ bệnh nhân.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  translations_en = '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"CRM Check","intro_desc":"5 questions to assess patient relationship management.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  scoring_rules = '{"dimensions":[{"id":"crm","name_vi":"CRM & Quan hệ bệnh nhân","name_en":"CRM & Patient Relations","question_ids":["crm_q1","crm_q2","crm_q3","crm_q4","crm_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  ai_config = '{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia CRM nha khoa. Dựa trên kết quả CRM Check (điểm {{SCORE_CRM}}/100 kèm 2 câu open-ended), phân tích CRM và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyến khích.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS, dental CRM expert. Based on the CRM Check score ({{SCORE_CRM}}/100 with 2 open-ended answers), analyze CRM and suggest 3 improvements. English, practical tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_CRM}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày xây dựng CRM cho phòng khám.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_CRM}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to build clinic CRM.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}'
WHERE id = 'crm-check';

UPDATE survey_section SET
  title_vi = 'PHẦN 1: ĐÁNH GIÁ CRM',
  subtitle_vi = '5 chiều đánh giá: data, segmentation, communication, automation, và analytics.'
WHERE survey_id = 'crm-check' AND order_idx = 0;

UPDATE survey_section SET
  title_vi = 'PHẦN 2: TỰ SOI CHIẾU',
  subtitle_vi = 'Hai câu hỏi mở giúp bạn nhìn sâu vào CRM.'
WHERE survey_id = 'crm-check' AND order_idx = 1;

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ về funnel: bao nhiêu% từ "first visit" sang "returning patient". Đối với những người không quay lại, lý do chính là gì — giá, khoảng cách, trải nghiệm, hay không có follow-up?',
  placeholder_en = 'Think about the funnel: what % from "first visit" to "returning patient". For those who don''t return, what are the main reasons — price, distance, experience, or no follow-up?'
WHERE question_id = 'crm_open1';

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ về: patient lifetime value, retention rate, recall conversion rate, NPS, reactivation rate... Cái nào bao quát nhất sức khỏe CRM của phòng khám?',
  placeholder_en = 'Think: patient lifetime value, retention rate, recall conversion, NPS, reactivation rate... Which one most captures CRM health?'
WHERE question_id = 'crm_open2';

-- === roadmap-check ===
UPDATE survey_definition SET
  translations_vi = '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"Roadmap Check","intro_desc":"5 câu hỏi giúp bạn đánh giá tầm nhìn và lộ trình phát triển phòng khám.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  translations_en = '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Roadmap Check","intro_desc":"5 questions to assess your clinic''s vision and development roadmap.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  scoring_rules = '{"dimensions":[{"id":"roadmap","name_vi":"Tầm nhìn & Lộ trình","name_en":"Vision & Roadmap","question_ids":["rm_q1","rm_q2","rm_q3","rm_q4","rm_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  ai_config = '{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia chiến lược phòng khám nha khoa. Dựa trên kết quả Roadmap Check (điểm {{SCORE_ROADMAP}}/100 kèm 2 câu open-ended), phân tích tầm nhìn và lộ trình và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyến khích.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS, dental clinic strategy expert. Based on the Roadmap Check score ({{SCORE_ROADMAP}}/100 with 2 open-ended answers), analyze vision and roadmap and suggest 3 improvements. English, practical tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_ROADMAP}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày xây dựng tầm nhìn và lộ trình.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_ROADMAP}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to build vision and roadmap.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}'
WHERE id = 'roadmap-check';

UPDATE survey_section SET
  title_vi = 'PHẦN 1: ĐÁNH GIÁ TẦM NHÌN & LỘ TRÌNH',
  subtitle_vi = '5 chiều đánh giá: tầm nhìn, mục tiêu, kế hoạch, alignment, và đo lường.'
WHERE survey_id = 'roadmap-check' AND order_idx = 0;

UPDATE survey_section SET
  title_vi = 'PHẦN 2: TỰ SOI CHIẾU',
  subtitle_vi = 'Hai câu hỏi mở giúp bạn nhìn sâu vào tầm nhìn và lộ trình.'
WHERE survey_id = 'roadmap-check' AND order_idx = 1;

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ về: bao nhiêu nhân sự, quy mô, chuyên môn, doanh thu, lấy gì làm điểm tựa. Đừng ngại mơ lớn — mơ lớn rồi scale down còn hơn không có target.',
  placeholder_en = 'Think: how many staff, size, specialization, revenue, what is your anchor. Don''t be afraid to dream big — dream big then scale down is better than no target.'
WHERE question_id = 'rm_open1';

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ thật honest: thiếu vốn? thiếu nhân sự? thiếu kiến thức? sợ rủi ro? không có hệ thống? hay đơn giản là không có thời gian để nghĩ về nó?',
  placeholder_en = 'Be honest: lack of capital? staff? knowledge? fear of risk? no systems? or simply no time to think about it?'
WHERE question_id = 'rm_open2';

-- === total-os-diagnostic ===
UPDATE survey_definition SET
  translations_vi = '{"submitButton":"Xem kết quả","submitting":"Đang xử lý...","required":"bắt buộc","start":"Bắt đầu →","back":"← Quay lại","next":"Tiếp tục →","prev":"← Quay lại","intro_title":"Total OS Diagnostic","intro_desc":"Chẩn đoán toàn diện 5 chiều: Hệ thống, Nhân sự, Quy trình, Tài chính, Marketing. Đánh giá điểm mạnh, điểm yếu và ưu tiên cải thiện.","restore_draft":"Bạn có bản nháp chưa hoàn thành.","clear_draft":"Xoá & bắt đầu lại","submit_title":"Sẵn sàng xem kết quả?","submit_desc":"Hệ thống sẽ tính điểm và hiển thị ngay.","step_label":"Phần","submit_label":"Gửi"}',
  translations_en = '{"submitButton":"See Result","submitting":"Processing...","required":"required","start":"Start →","back":"← Back","next":"Next →","prev":"← Back","intro_title":"Total OS Diagnostic","intro_desc":"Comprehensive 5-dimension diagnostic: Systems, People, Processes, Finance, Marketing. Identify strengths, weaknesses, and improvement priorities.","restore_draft":"You have an unfinished draft.","clear_draft":"Clear & start over","submit_title":"Ready to see results?","submit_desc":"We will calculate and display your score immediately.","step_label":"Part","submit_label":"Submit"}',
  scoring_rules = '{"dimensions":[{"id":"systems","name_vi":"Hệ thống hóa","name_en":"Systems","question_ids":["tos_sys_q1","tos_sys_q2"],"formula":"avg"},{"id":"people","name_vi":"Nhân sự","name_en":"People","question_ids":["tos_ppl_q1","tos_ppl_q2"],"formula":"avg"},{"id":"processes","name_vi":"Quy trình","name_en":"Processes","question_ids":["tos_pro_q1","tos_pro_q2"],"formula":"avg"},{"id":"finance","name_vi":"Tài chính","name_en":"Finance","question_ids":["tos_fin_q1","tos_fin_q2"],"formula":"avg"},{"id":"marketing","name_vi":"Marketing","name_en":"Marketing","question_ids":["tos_mkt_q1","tos_mkt_q2"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
  ai_config = '{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn OS phòng khám nha khoa. Dựa trên Total OS Diagnostic (5 chiều: Hệ thống {{SCORE_SYSTEMS}}/100, Nhân sự {{SCORE_PEOPLE}}/100, Quy trình {{SCORE_PROCESSES}}/100, Tài chính {{SCORE_FINANCE}}/100, Marketing {{SCORE_MARKETING}}/100, Total {{SCORE_TOTAL}}/100), phân tích toàn diện OS và đưa ra 3 ưu tiên cải thiện. Tiếng Việt, giọng thực tế.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS, dental clinic OS expert. Based on Total OS Diagnostic (5 dimensions: Systems {{SCORE_SYSTEMS}}/100, People {{SCORE_PEOPLE}}/100, Processes {{SCORE_PROCESSES}}/100, Finance {{SCORE_FINANCE}}/100, Marketing {{SCORE_MARKETING}}/100, Total {{SCORE_TOTAL}}/100), analyze the complete OS and suggest 3 priority improvements. English, practical tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Hệ thống: {{SCORE_SYSTEMS}}/100\n- Nhân sự: {{SCORE_PEOPLE}}/100\n- Quy trình: {{SCORE_PROCESSES}}/100\n- Tài chính: {{SCORE_FINANCE}}/100\n- Marketing: {{SCORE_MARKETING}}/100\n- Total: {{SCORE_TOTAL}}/100\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày cải thiện OS toàn diện.\nXác định chiều yếu nhất → ưu tiên cải thiện.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Systems: {{SCORE_SYSTEMS}}/100\n- People: {{SCORE_PEOPLE}}/100\n- Processes: {{SCORE_PROCESSES}}/100\n- Finance: {{SCORE_FINANCE}}/100\n- Marketing: {{SCORE_MARKETING}}/100\n- Total: {{SCORE_TOTAL}}/100\n\n# TASK\nCreate a 30-day plan to improve overall OS.\nIdentify weakest dimension → prioritize improvement.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}'
WHERE id = 'total-os-diagnostic';

UPDATE survey_section SET
  title_vi = 'PHẦN 1: ĐÁNH GIÁ 5 CHIỀU OS',
  subtitle_vi = '10 câu hỏi đánh giá 5 chiều cốt lõi của hệ thống phòng khám.'
WHERE survey_id = 'total-os-diagnostic' AND order_idx = 0;

UPDATE survey_section SET
  title_vi = 'PHẦN 2: TỰ SOI CHIẾU TOÀN DIỆN',
  subtitle_vi = 'Hai câu hỏi mở giúp bạn nhìn toàn cảnh OS phòng khám.'
WHERE survey_id = 'total-os-diagnostic' AND order_idx = 1;

UPDATE survey_question SET
  placeholder_vi = 'Nghĩ về: cải thiện chiều nào sẽ giúp các chiều khác cũng tự động tốt hơn? Ví dụ: cải thiện hệ thống → nhân sự làm việc hiệu quả hơn → quy trình mượt hơn → tài chính cải thiện → marketing tốt hơn.',
  placeholder_en = 'Think: which dimension, when improved, would automatically make other dimensions better? Example: improve systems → people work more effectively → smoother processes → better finances → better marketing.'
WHERE question_id = 'tos_open1';

UPDATE survey_question SET
  placeholder_vi = 'Thử đặt câu hỏi: nếu giải quyết được cái này, điều gì sẽ thay đổi? Nếu bạn hỏi 5 người trong phòng khám, họ sẽ nói gì là "vấn đề số 1"?',
  placeholder_en = 'Ask: if this is solved, what changes? If you asked 5 people in the clinic, what would they say is the #1 problem?'
WHERE question_id = 'tos_open2';
