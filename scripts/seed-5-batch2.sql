-- Seed batch 2: 5 free scanners (linh-hon, chu-the-hoa, case-reflection, nang-luong, so-hoa)
-- order_index: 18, 19, 20, 21, 22

-- Clean up
DELETE FROM survey_question WHERE section_id IN (
  SELECT id FROM survey_section WHERE survey_id IN (
    'linh-hon-check','chu-the-hoa-check','case-reflection-check','nang-luong-check','so-hoa-check'
  )
);
DELETE FROM survey_section WHERE survey_id IN (
  'linh-hon-check','chu-the-hoa-check','case-reflection-check','nang-luong-check','so-hoa-check'
);
DELETE FROM survey_definition WHERE id IN (
  'linh-hon-check','chu-the-hoa-check','case-reflection-check','nang-luong-check','so-hoa-check'
);

-- ===================== LINH-HON-CHECK =====================
INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, updated_at)
VALUES ('linh-hon-check','linh-hon-check','Linh Hồn Check','Soul Check',
'Mới mở phòng khám hoặc dưới 3 năm? Đánh giá ngay 5 khía cạnh quan trọng nhất để khởi đầu vững chắc.',
'New clinic or under 3 years old? Assess the 5 most critical areas for a solid start.',
'Khám phá sứ mệnh và tầm nhìn phòng khám','Explore your clinic mission and vision',
'["Ch.LINHHON"]','active',1,'mini',
'{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
'{"dimensions":[{"id":"soul","name_vi":"Linh hồn phòng khám","name_en":"Clinic Soul","question_ids":["lh_q1","lh_q2","lh_q3","lh_q4","lh_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
'{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Linh Hồn Check (điểm {{SCORE_SOUL}}/100 kèm 2 câu open-ended), phân tích sứ mệnh và tầm nhìn phòng khám và đưa ra 3 gợi ý để củng cố linh hồn. Tiếng Việt, giọng trầm lắng, sâu sắc.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS. Based on the Soul Check score ({{SCORE_SOUL}}/100 with 2 open-ended answers), analyze the clinic mission and vision and suggest 3 ways to strengthen its soul. English, contemplative tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_SOUL}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày củng cố linh hồn phòng khám.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, sâu sắc\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_SOUL}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to strengthen your clinic soul.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and contemplative tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}',
'{}','{}',18,datetime('now'));

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('linh-hon-check',0,'PHẦN 1: ĐÁNH GIÁ LINH HỒN','PART 1: SOUL EVALUATION',
'5 chiều đánh giá: sứ mệnh, tầm nhìn, giá trị, câu chuyện, và lời hứa.',
'5 evaluation dimensions: mission, vision, values, story, and promise.',
'Linh hồn — Soul','auto_awesome');

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('linh-hon-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
'Hai câu hỏi mở giúp bạn nhìn sâu vào linh hồn phòng khám.',
'Two open questions to look deeply into your clinic soul.',
'Linh hồn — Soul','psychology_alt');

-- Questions: section 0
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
((SELECT id FROM survey_section WHERE survey_id='linh-hon-check' AND order_idx=0),'lh_q1',0,'select',
'Phòng khám đã có sứ mệnh rõ ràng chưa — một câu statement ngắn gọn nói lên "TẠI SAO phòng khám tồn tại"?',
'Does your clinic have a clear mission — a concise statement explaining WHY the clinic exists?',
'{"1":"Không có sứ mệnh, hoạt động vì doanh thu","2":"Có ý tưởng sứ mệnh nhưng chưa viết ra rõ ràng","3":"Có sứ mệnh nhưng chưa được chia sẻ với đội ngũ","4":"Có sứ mệnh rõ ràng, đội ngũ biết và nhắc đến","5":"Sứ mệnh sâu sắc, được truyền cảm hứng, định hướng mọi quyết định"}',
'{"1":"No mission, operating for revenue only","2":"Have a mission idea but not clearly written down","3":"Have a mission but not shared with the team","4":"Clear mission, team knows and references it","5":"Deep mission, inspiring, guiding every decision"}',
'soul'),
((SELECT id FROM survey_section WHERE survey_id='linh-hon-check' AND order_idx=0),'lh_q2',1,'select',
'Phòng khám có tầm nhìn rõ ràng về nơi muốn đến trong 3-5 năm tới chưa?',
'Does your clinic have a clear vision of where it wants to go in 3-5 years?',
'{"1":"Không có tầm nhìn, sống ngày nào hay ngày đó","2":"Có suy nghĩ về tương lai nhưng chưa định hình rõ","3":"Có tầm nhìn chung nhưng chưa chia sẻ với đội ngũ","4":"Có tầm nhìn rõ ràng, được bài bản hóa và theo dõi","5":"Tầm nhìn truyền cảm hứng, đội ngũ gắn kết vì tầm nhìn chung"}',
'{"1":"No vision, living day to day","2":"Thinking about the future but not clearly defined","3":"Have a general vision but not shared with the team","4":"Clear vision, formalized and tracked","5":"Inspiring vision, team united by shared purpose"}',
'soul'),
((SELECT id FROM survey_section WHERE survey_id='linh-hon-check' AND order_idx=0),'lh_q3',2,'select',
'Phòng khám có 3-5 giá trị cốt lõi rõ ràng và được thể hiện trong hành vi hàng ngày chưa?',
'Does your clinic have 3-5 clear core values reflected in daily behavior?',
'{"1":"Không có giá trị cốt lõi được định nghĩa","2":"Có một vài giá trị nhưng chưa rõ ràng và nhất quán","3":"Có giá trị được viết ra nhưng chưa được đội ngũ thực sự hiểu","4":"Giá trị rõ ràng, được đào tạo và đo lường","5":"Giá trị sâu sắc, thấm nhuần vào mọi hành vi của đội ngũ"}',
'{"1":"No defined core values","2":"Have some values but not clear and consistent","3":"Values written but not truly understood by the team","4":"Clear values, trained and measured","5":"Deep values, ingrained in every team behavior"}',
'soul'),
((SELECT id FROM survey_section WHERE survey_id='linh-hon-check' AND order_idx=0),'lh_q4',3,'select',
'Phòng khám có câu chuyện (story) riêng — tại sao bạn làm nha khoa, tại sao mở phòng khám này?',
'Does your clinic have its own story — why you do dentistry, why you opened this clinic?',
'{"1":"Không có câu chuyện, chỉ là một phòng khám như bao phòng khám khác","2":"Có câu chuyện trong đầu nhưng chưa viết ra hoặc chia sẻ","3":"Có câu chuyện được chia sẻ nhưng chưa thực sự cảm hứng","4":"Câu chuyện được viết rõ, chia sẻ với bệnh nhân và đội ngũ","5":"Câu chuyện mạnh mẽ, truyền cảm hứng, là nền tảng thương hiệu"}',
'{"1":"No story, just another clinic like any other","2":"Have a story in mind but not written or shared","3":"Story shared but not truly inspiring","4":"Story clearly written, shared with patients and team","5":"Powerful story, inspiring, foundation of the brand"}',
'soul'),
((SELECT id FROM survey_section WHERE survey_id='linh-hon-check' AND order_idx=0),'lh_q5',4,'select',
'Phòng khám có "lời hứa" rõ ràng với bệnh nhân — điều họ có thể kỳ vọng mỗi lần đến?',
'Does your clinic have a clear promise to patients — what they can expect every visit?',
'{"1":"Không có lời hứa cụ thể, mọi thứ tùy thuộc vào từng người","2":"Có một số kỳ vọng chung nhưng chưa được công khai hóa","3":"Có lời hứa được viết ra nhưng đội ngũ không luôn giữ được","4":"Lời hứa rõ ràng, được đào tạo và theo dõi","5":"Lời hứa mạnh mẽ, đội ngũ tự hào và luôn giữ lời"}',
'{"1":"No specific promise, everything depends on the person","2":"Have some general expectations but not publicly stated","3":"Promise written but team does not always keep it","4":"Clear promise, trained and tracked","5":"Strong promise, team proud and always delivers"}',
'soul');

-- Questions: section 1 (textarea)
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
((SELECT id FROM survey_section WHERE survey_id='linh-hon-check' AND order_idx=1),'lh_open1',0,'textarea',
'Tại sao bạn làm nha khoa? Điều gì khiến bạn thức dậy mỗi sáng với công việc này?',
'Why do you do dentistry? What makes you wake up every morning for this work?',
'Nghĩ về động lực sâu nhất của bạn. Điều gì thực sự quan trọng với bạn trong nghề nha khoa?',
'Think about your deepest motivation. What truly matters to you in dentistry?'),
((SELECT id FROM survey_section WHERE survey_id='linh-hon-check' AND order_idx=1),'lh_open2',1,'textarea',
'Nếu phòng khám của bạn tồn tại trong 50 năm tới, bạn muốn người ta nhớ đến nó vì điều gì?',
'If your clinic existed for another 50 years, what do you want people to remember it for?',
'Nghĩ về di sản (legacy) bạn muốn để lại. Điều gì sẽ làm cho phòng khám của bạn đáng nhớ?',
'Think about the legacy you want to leave. What would make your clinic unforgettable?');

-- ===================== CHU-THE-HOA-CHECK =====================
INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, updated_at)
VALUES ('chu-the-hoa-check','chu-the-hoa-check','Chủ Thể Hóa Check','Patient Agency Check',
'Bệnh nhân không phải đối tượng thụ động — họ là đối tác chủ động trong hành trình sức khỏe. Kiểm tra mức độ chủ thể hóa phòng khám.',
'Patients are not passive subjects — they are active partners in their health journey. Check your clinic level of patient agency.',
'Mức độ chủ thể hóa bệnh nhân trong phòng khám','Level of patient agency in your clinic',
'["Ch.PATIENT"]','active',1,'mini',
'{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
'{"dimensions":[{"id":"agency","name_vi":"Chủ thể hóa","name_en":"Patient Agency","question_ids":["ct_q1","ct_q2","ct_q3","ct_q4","ct_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
'{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS. Dựa trên kết quả Chủ Thể Hóa Check (điểm {{SCORE_AGENCY}}/100 kèm 2 câu open-ended), phân tích mức độ biến bệnh nhân thành người tham gia chủ động và đưa ra 3 gợi ý. Tiếng Việt, giọng nhẹ nhàng, trân trọng.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS. Based on the Patient Agency Check score ({{SCORE_AGENCY}}/100 with 2 open-ended answers), analyze the level of patient agency and suggest 3 improvements. English, gentle and respectful tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_AGENCY}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày tăng cường chủ thể hóa bệnh nhân.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, trân trọng\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_AGENCY}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to increase patient agency.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and respectful tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}',
'{}','{}',19,datetime('now'));

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('chu-the-hoa-check',0,'PHẦN 1: ĐÁNH GIÁ CHỦ THỂ HÓA','PART 1: PATIENT AGENCY EVALUATION',
'5 chiều đánh giá: thông tin, lựa chọn, hợp tác, theo dõi, và phản hồi.',
'5 evaluation dimensions: information, choice, cooperation, tracking, and feedback.',
'Chủ thể hóa — Patient Agency','person');

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('chu-the-hoa-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
'Hai câu hỏi mở giúp bạn nhìn sâu vào mối quan hệ với bệnh nhân.',
'Two open questions to look deeply into your relationship with patients.',
'Chủ thể hóa — Patient Agency','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
((SELECT id FROM survey_section WHERE survey_id='chu-the-hoa-check' AND order_idx=0),'ct_q1',0,'select',
'Bệnh nhân được cung cấp thông tin đầy đủ về tình trạng răng miệng và các phương án điều trị theo cách dễ hiểu chưa?',
'Are patients provided with adequate information about their dental condition and treatment options in an easy-to-understand way?',
'{"1":"Ít thông tin, bệnh nhân không hiểu rõ tình trạng","2":"Có giải thích nhưng bệnh nhân vẫn khó hiểu","3":"Giải thích khá đầy đủ, một số bệnh nhân hiểu được","4":"Có tài liệu và giải thích rõ ràng, đa số bệnh nhân hiểu","5":"Hệ thống thông tin chuẩn: giải thích + tài liệu + hỏi đáp"}',
'{"1":"Little information, patients do not understand their condition","2":"Explained but patients still find it confusing","3":"Fairly thorough explanation, some patients understand","4":"Clear documentation and explanation, most patients understand","5":"Standard info system: explanation + materials + Q&A"}',
'agency'),
((SELECT id FROM survey_section WHERE survey_id='chu-the-hoa-check' AND order_idx=0),'ct_q2',1,'select',
'Bệnh nhân được tham gia vào quyết định điều trị — chọn phương án phù hợp với tình trạng và ngân sách của họ?',
'Are patients involved in treatment decisions — choosing options that fit their condition and budget?',
'{"1":"Bác sĩ quyết định đơn phương, bệnh nhân thụ động","2":"Ít khi đưa ra lựa chọn cho bệnh nhân","3":"Có đưa ra lựa chọn nhưng chưa rõ ràng và đầy đủ","4":"Đưa ra 2-3 phương án với ưu nhược điểm rõ ràng","5":"Quy trình shared decision-making chuẩn, bệnh nhân hiểu và tự chọn"}',
'{"1":"Doctor decides unilaterally, patient is passive","2":"Rarely offering choices to patients","3":"Offering choices but not clear and comprehensive enough","4":"Offering 2-3 options with clear pros and cons","5":"Standard shared decision-making process, patient understands and chooses"}',
'agency'),
((SELECT id FROM survey_section WHERE survey_id='chu-the-hoa-check' AND order_idx=0),'ct_q3',2,'select',
'Bệnh nhân được khuyến khích hỏi và bày tỏ lo ngại trước khi điều trị không?',
'Are patients encouraged to ask questions and express concerns before treatment?',
'{"1":"Không khuyến khích, bệnh nhân ngại hỏi","2":"Ngồi chờ bệnh nhân hỏi nhưng không chủ động tạo không khí","3":"Có chủ động mời hỏi một lần nhưng chưa tạo không khí thoải mái","4":"Tạo không khí thoải mái, chủ động hỏi bệnh nhân có thắc mắc gì","5":"Không gian chủ động hỏi — booking reminder, check-in hỏi, bắt đầu treatment hỏi lại"}',
'{"1":"Not encouraged, patients are hesitant to ask","2":"Waiting for patients to ask but not proactively creating space","3":"Inviting questions once but not creating comfortable atmosphere","4":"Creating comfortable atmosphere, proactively asking if patient has concerns","5":"Proactive-asking space — booking reminder, check-in question, pre-treatment re-check"}',
'agency'),
((SELECT id FROM survey_section WHERE survey_id='chu-the-hoa-check' AND order_idx=0),'ct_q4',3,'select',
'Bệnh nhân được theo dõi và nhắc nhở về lịch điều trị, tái khám, và chăm sóc tại nhà không?',
'Are patients tracked and reminded about treatment schedules, follow-ups, and home care?',
'{"1":"Không theo dõi, bệnh nhân tự nhớ lịch","2":"Nhắc lịch khi bệnh nhân hỏi","3":"Nhắc lịch cho một số bệnh nhân quan trọng","4":"Có hệ thống theo dõi và nhắc nhở đều đặn","5":"Hệ thống theo dõi toàn diện: SMS/chat reminder, recall system, home care instructions"}',
'{"1":"No tracking, patients remember appointments themselves","2":"Remind when patients ask","3":"Remind for some important patients only","4":"Regular tracking and reminder system","5":"Comprehensive tracking: SMS/chat reminders, recall system, home care instructions"}',
'agency'),
((SELECT id FROM survey_section WHERE survey_id='chu-the-hoa-check' AND order_idx=0),'ct_q5',4,'select',
'Phòng khám có thu thập và phản hồi từ bệnh nhân về trải nghiệm điều trị không?',
'Does your clinic collect and act on patient feedback about their treatment experience?',
'{"1":"Không thu thập phản hồi","2":"Thu thập nhưng không phân tích hay hành động","3":"Thu thập thỉnh thoảng, có cải thiện một số vấn đề","4":"Có hệ thống thu thập phản hồi và cải thiện thường xuyên","5":"Phản hồi bệnh nhân là driver cốt lõi — NPS, review, action loop"}',
'{"1":"No patient feedback collection","2":"Collecting but not analyzing or acting on it","3":"Occasionally collecting, improving some issues","4":"Regular feedback collection and improvement system","5":"Patient feedback is core driver — NPS, reviews, action loop"}',
'agency');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
((SELECT id FROM survey_section WHERE survey_id='chu-the-hoa-check' AND order_idx=1),'ct_open1',0,'textarea',
'Kể về một tình huống gần đây khi bệnh nhân chủ động hỏi nhiều hoặc đưa ra quyết định khác với đề xuất của bạn. Bạn phản ứng thế nào?',
'Describe a recent situation when a patient proactively asked many questions or made a different decision from your recommendation. How did you respond?',
'Nghĩ về một trải nghiệm gần đây. Bệnh nhân có chủ động tham gia không? Bạn cảm thấy thế nào khi họ đặt câu hỏi hay chọn khác?',
'Think about a recent experience. Was the patient actively engaged? How did you feel when they asked questions or chose differently?'),
((SELECT id FROM survey_section WHERE survey_id='chu-the-hoa-check' AND order_idx=1),'ct_open2',1,'textarea',
'Theo bạn, điều gì làm bệnh nhân cảm thấy "được trao quyền" (empowered) trong phòng khám nha khoa?',
'In your opinion, what makes patients feel "empowered" in a dental clinic?',
'Nghĩ về trải nghiệm của bệnh nhân từ khi đặt lịch đến khi ra về. Điều gì tạo ra cảm giác được trao quyền?',
'Think about the patient experience from booking to leaving. What creates a sense of empowerment?');

-- ===================== CASE-REFLECTION-CHECK =====================
INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, updated_at)
VALUES ('case-reflection-check','case-reflection-check','Case Reflection Check','Case Reflection Check',
'Bác sĩ giỏi không phải vì làm nhiều ca — mà vì biết học từ mỗi ca. Kiểm tra thói quen soi chiếu của bạn.',
'Good doctors are not made by doing many cases — they are made by learning from each one. Check your case reflection habits.',
'Thói quen phân tích và rút kinh nghiệm từ ca điều trị','Habit of analyzing and learning from treatment cases',
'["Ch.REFLECTION"]','active',1,'mini',
'{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
'{"dimensions":[{"id":"reflection","name_vi":"Phản tư ca","name_en":"Case Reflection","question_ids":["cr_q1","cr_q2","cr_q3","cr_q4","cr_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
'{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS. Dựa trên kết quả Case Reflection Check (điểm {{SCORE_REFLECTION}}/100 kèm 2 câu open-ended), phân tích thói quen phản tư và đưa ra 3 gợi ý. Tiếng Việt, giọng đồng nghiệp, thực tế.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS. Based on the Case Reflection Check score ({{SCORE_REFLECTION}}/100 with 2 open-ended answers), analyze the doctor reflection habits and suggest 3 ways. English, collegial and practical tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_REFLECTION}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày xây dựng thói quen phản tư ca.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_REFLECTION}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to build case reflection habits.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}',
'{}','{}',20,datetime('now'));

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('case-reflection-check',0,'PHẦN 1: ĐÁNH GIÁ THÓI QUEN PHẢN TƯ','PART 1: REFLECTION HABITS EVALUATION',
'5 chiều đánh giá: ghi chép, phân tích, thảo luận, cập nhật, và cải thiện.',
'5 evaluation dimensions: documentation, analysis, discussion, updating, and improving.',
'Case Reflection','psychology');

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('case-reflection-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
'Hai câu hỏi mở giúp bạn nhìn sâu vào thói quen học từ ca của mình.',
'Two open questions to look deeply into your case-based learning habits.',
'Case Reflection','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
((SELECT id FROM survey_section WHERE survey_id='case-reflection-check' AND order_idx=0),'cr_q1',0,'select',
'Bạn có thói quen ghi chép và theo dõi diễn tiến của các ca điều trị phức tạp không?',
'Do you have a habit of documenting and tracking complex treatment cases?',
'{"1":"Không ghi chép gì, chỉ nhớ trong đầu","2":"Ghi chép sơ sài, không có hệ thống","3":"Ghi chép cho một số ca nhưng không đều đặn","4":"Có hệ thống ghi chép cho hầu hết ca phức tạp","5":"Hệ thống ghi chép chuẩn, có ảnh, timeline, và lesson learned"}',
'{"1":"No documentation, just remembering in my head","2":"Sporadic notes, no system","3":"Documenting some cases but not regularly","4":"System for documenting most complex cases","5":"Standard documentation with photos, timeline, and lessons learned"}',
'reflection'),
((SELECT id FROM survey_section WHERE survey_id='case-reflection-check' AND order_idx=0),'cr_q2',1,'select',
'Sau mỗi ca điều trị, bạn có dành thời gian phân tích: ca nào tốt, ca nào cần cải thiện không?',
'After each treatment case, do you take time to analyze: what went well, what needs improvement?',
'{"1":"Không bao giờ phân tích, cứ thế làm ca tiếp theo","2":"Thỉnh thoảng nghĩ lại một chút nhưng không có thời gian cố định","3":"Có phân tích nhưng không có quy trình cụ thể","4":"Có thời gian cố định để phân tích sau ca","5":"Quy trình phân tích bài bản: đánh giá → học → cải thiện protocol"}',
'{"1":"Never analyze, just move on to the next case","2":"Sometimes think back briefly but no fixed time","3":"Analyze but no specific process","4":"Fixed time set aside for post-case analysis","5":"Thorough process: evaluate → learn → improve protocol"}',
'reflection'),
((SELECT id FROM survey_section WHERE survey_id='case-reflection-check' AND order_idx=0),'cr_q3',2,'select',
'Bạn có thảo luận ca khó với đồng nghiệp hoặc tìm kiếm ý kiến thứ hai không?',
'Do you discuss difficult cases with colleagues or seek second opinions?',
'{"1":"Không thảo luận, tự giải quyết một mình","2":"Thỉnh thoảng hỏi ý kiến nhưng không chủ động","3":"Thảo luận khi gặp ca thực sự khó","4":"Thường xuyên thảo luận và học hỏi từ đồng nghiệp","5":"Case review meeting định kỳ, có quy trình thảo luận chuẩn"}',
'{"1":"Do not discuss, solve alone","2":"Occasionally ask but not proactive","3":"Discuss when encountering truly difficult cases","4":"Regularly discuss and learn from colleagues","5":"Regular case review meetings with standard discussion process"}',
'reflection'),
((SELECT id FROM survey_section WHERE survey_id='case-reflection-check' AND order_idx=0),'cr_q4',3,'select',
'Bạn có theo dõi và cập nhật kiến thức chuyên môn mới từ các ca đã làm không?',
'Do you track and update clinical knowledge from cases you have done?',
'{"1":"Không theo dõi, làm theo cách đã học từ trường","2":"Thỉnh thoảng đọc thêm nhưng không liên quan đến ca cụ thể","3":"Cập nhật khi có dịp nhưng không có hệ thống","4":"Có hệ thống cập nhật kiến thức dựa trên các ca gặp phải","5":"Học liên tục từ ca — mỗi ca là bài học, có database cá nhân"}',
'{"1":"Not tracking, doing things the way I learned in school","2":"Occasionally read more but not related to specific cases","3":"Update when opportunity arises but no system","4":"Systematic knowledge update based on cases encountered","5":"Continuous learning from cases — each case is a lesson, personal database"}',
'reflection'),
((SELECT id FROM survey_section WHERE survey_id='case-reflection-check' AND order_idx=0),'cr_q5',4,'select',
'Khi một ca gặp biến chứng hoặc không như kế hoạch, bạn xử lý và rút kinh nghiệm như thế nào?',
'When a case has complications or does not go as planned, how do you handle and learn from it?',
'{"1":"Xử lý qua loa, không phân tích nguyên nhân","2":"Xử lý xong rồi thôi, ít khi nghĩ lại","3":"Có suy nghĩ nhưng không ghi chép để rút kinh nghiệm","4":"Có phân tích nguyên nhân và rút kinh nghiệm có hệ thống","5":"Root cause analysis chuẩn + protocol update + shared with team"}',
'{"1":"Handle casually, do not analyze the cause","2":"Handle it and move on, rarely reflect","3":"Think about it but do not document to learn","4":"Systematic root cause analysis and lessons learned","5":"Standard root cause analysis + protocol update + shared with team"}',
'reflection');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
((SELECT id FROM survey_section WHERE survey_id='case-reflection-check' AND order_idx=1),'cr_open1',0,'textarea',
'Kể về một ca điều trị gần đây mà bạn học được nhiều nhất. Điều gì đã xảy ra và bạn rút ra bài học gì?',
'Tell about a recent treatment case where you learned the most. What happened and what lesson did you take away?',
'Mô tả ca đó: ca gì, tình huống, kết quả, và quan trọng nhất — bạn học được gì từ nó.',
'Describe the case: what type, situation, outcome, and most importantly — what you learned from it.'),
((SELECT id FROM survey_section WHERE survey_id='case-reflection-check' AND order_idx=1),'cr_open2',1,'textarea',
'Điều gì ngăn cản bạn dành nhiều thời gian hơn để phản tư và học hỏi từ các ca điều trị?',
'What prevents you from spending more time reflecting and learning from treatment cases?',
'Nghĩ về rào cản lớn nhất: thời gian, thói quen, hay động lực?',
'Think about the biggest barrier: time, habits, or motivation?');

-- ===================== NANG-LUONG-CHECK =====================
INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, updated_at)
VALUES ('nang-luong-check','nang-luong-check','Năng Lượng Check','Energy Check',
'Năng lượng của bạn quyết định chất lượng làm việc, sự hạnh phúc, và thu nhập. Kiểm tra mức năng lượng và cách quản lý nó.',
'Your energy determines work quality, happiness, and income. Check your energy level and how you manage it.',
'Đánh giá năng lượng cá nhân và sức bền','Assess personal energy and resilience',
'["Ch.ENERGY"]','active',1,'mini',
'{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
'{"dimensions":[{"id":"energy","name_vi":"Năng lượng","name_en":"Energy","question_ids":["nl_q1","nl_q2","nl_q3","nl_q4","nl_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
'{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS. Dựa trên kết quả Năng Lượng Check (điểm {{SCORE_ENERGY}}/100 kèm 2 câu open-ended), phân tích mức năng lượng và đưa ra 3 gợi ý. Tiếng Việt, giọng thấu hiểu, động viên.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS. Based on the Energy Check score ({{SCORE_ENERGY}}/100 with 2 open-ended answers), analyze your energy level and suggest 3 ways. English, empathetic and motivating tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_ENERGY}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày quản lý năng lượng.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, động viên\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_ENERGY}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to manage your energy better.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and motivating tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}',
'{}','{}',21,datetime('now'));

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('nang-luong-check',0,'PHẦN 1: ĐÁNH GIÁ NĂNG LƯỢNG','PART 1: ENERGY EVALUATION',
'5 chiều đánh giá: thể chất, cảm xúc, tinh thần, xã hội, và nghề nghiệp.',
'5 evaluation dimensions: physical, emotional, mental, social, and vocational.',
'Năng lượng — Energy','bolt');

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('nang-luong-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
'Hai câu hỏi mở giúp bạn nhìn sâu vào năng lượng của mình.',
'Two open questions to look deeply into your energy.',
'Năng lượng — Energy','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
((SELECT id FROM survey_section WHERE survey_id='nang-luong-check' AND order_idx=0),'nl_q1',0,'select',
'Mức năng lượng thể chất của bạn hàng ngày như thế nào — sức bền, giấc ngủ, dinh dưỡng?',
'How is your daily physical energy — stamina, sleep, nutrition?',
'{"1":"Thường xuyên mệt, ngủ ít và không chất lượng, ăn uống tùy hứng","2":"Thỉnh thoảng mệt, ngủ không đều, ăn uống chưa tốt","3":"Khá ổn nhưng có lúc mệt không rõ lý do","4":"Năng lượng thể chất tốt, ngủ được, ăn uống khá đều","5":"Năng lượng thể chất dồi dào, ngủ ngon, ăn uống có kế hoạch"}',
'{"1":"Frequently tired, poor sleep, eating haphazardly","2":"Sometimes tired, irregular sleep, diet not great","3":"Fairly okay but sometimes tired for no clear reason","4":"Good physical energy, sleeping well, fairly regular diet","5":"Abundant physical energy, great sleep, planned nutrition"}',
'energy'),
((SELECT id FROM survey_section WHERE survey_id='nang-luong-check' AND order_idx=0),'nl_q2',1,'select',
'Bạn có thường xuyên cảm thấy căng thẳng, lo âu, hoặc kiệt sức trong công việc không?',
'Do you frequently feel stressed, anxious, or burned out at work?',
'{"1":"Thường xuyên kiệt sức, cảm giác "cháy" bên trong","2":"Thường xuyên căng thẳng và lo âu","3":"Thỉnh thoảng căng thẳng, đặc biệt khi bận","4":"Căng thẳng ở mức chấp nhận được, có cách xử lý","5":"Kiểm soát căng thẳng tốt, có phương pháp giữ bình tĩnh"}',
'{"1":"Frequently burned out, feeling burnt inside","2":"Frequently stressed and anxious","3":"Sometimes stressed, especially when busy","4":"Acceptable stress level, have coping mechanisms","5":"Good stress control, have methods to stay calm"}',
'energy'),
((SELECT id FROM survey_section WHERE survey_id='nang-luong-check' AND order_idx=0),'nl_q3',2,'select',
'Bạn có thời gian cho bản thân (nghỉ ngơi, sở thích, gia đình) ngoài công việc không?',
'Do you have time for yourself (rest, hobbies, family) outside of work?',
'{"1":"Gần như không có thời gian riêng, làm việc tất cả thời gian","2":"Ít thời gian riêng, hầu như tất cả thời gian cho công việc","3":"Có một chút thời gian riêng nhưng không đều đặn","4":"Có thời gian riêng đều đặn, cân bằng khá tốt","5":"Cân bằng xuất sắc giữa công việc và cuộc sống"}',
'{"1":"Almost no personal time, working all the time","2":"Little personal time, almost all time for work","3":"Some personal time but not regular","4":"Regular personal time, fairly good balance","5":"Excellent work-life balance"}',
'energy'),
((SELECT id FROM survey_section WHERE survey_id='nang-luong-check' AND order_idx=0),'nl_q4',3,'select',
'Bạn có động lực và cảm hứng để tiếp tục phát triển trong nghề không?',
'Do you have motivation and inspiration to continue growing in your profession?',
'{"1":"Không còn động lực, chỉ làm vì áp lực tài chính","2":"Ít động lực, cảm thấy chán nản với công việc","3":"Động lực trung bình, có lúc hăng hái lúc chán","4":"Động lực tốt, có mục tiêu phát triển rõ ràng","5":"Động lực mạnh mẽ, liên tục học hỏi và phát triển"}',
'{"1":"No motivation left, only working for financial pressure","2":"Little motivation, feeling bored with work","3":"Average motivation, sometimes enthusiastic, sometimes bored","4":"Good motivation, have clear development goals","5":"Strong motivation, continuously learning and growing"}',
'energy'),
((SELECT id FROM survey_section WHERE survey_id='nang-luong-check' AND order_idx=0),'nl_q5',4,'select',
'Bạn có cảm giác "sống có mục đích" trong công việc nha khoa không?',
'Do you feel "living with purpose" in your dental work?',
'{"1":"Cảm giác công việc vô nghĩa, chỉ là cách kiếm tiền","2":"Công việc là công việc, không có ý nghĩa đặc biệt","3":"Thỉnh thoảng cảm thấy có ý nghĩa, nhưng không thường xuyên","4":"Thường xuyên cảm thấy công việc có ý nghĩa với bệnh nhân","5":"Cảm giác sống có mục đích mạnh mẽ, công việc là sứ mệnh"}',
'{"1":"Feeling work is meaningless, just a way to make money","2":"Work is just work, no special meaning","3":"Sometimes feel meaningful but not regularly","4":"Frequently feel work has meaning for patients","5":"Strong sense of purpose, work is a mission"}',
'energy');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
((SELECT id FROM survey_section WHERE survey_id='nang-luong-check' AND order_idx=1),'nl_open1',0,'textarea',
'Khi nào bạn cảm thấy năng lượng cao nhất trong ngày? Điều gì làm bạn cảm thấy tràn đầy năng lượng?',
'When do you feel most energetic during the day? What makes you feel full of energy?',
'Nghĩ về những khoảnh khắc bạn cảm thấy tràn đầy năng lượng — có thể là khi gặp bệnh nhân khó, khi hoàn thành một ca khó, hay khi học được điều mới.',
'Think about moments when you feel full of energy — maybe when treating a difficult patient, finishing a hard case, or learning something new.'),
((SELECT id FROM survey_section WHERE survey_id='nang-luong-check' AND order_idx=1),'nl_open2',1,'textarea',
'Điều gì "hút" năng lượng của bạn nhiều nhất trong công việc hàng ngày? (người, tình huống, thói quen)',
'What drains your energy the most in your daily work? (people, situations, habits)',
'Nghĩ về những thứ làm bạn mệt mỏi — có thể là bệnh nhân khó, nhân viên, quy trình, hay chính cách suy nghĩ của bạn.',
'Think about what exhausts you — it could be difficult patients, staff, processes, or your own thought patterns.');

-- ===================== SO-HOA-CHECK =====================
INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, updated_at)
VALUES ('so-hoa-check','so-hoa-check','Số Hóa Check','Digital Check',
'Số hóa không chỉ là phần mềm — đó là cách phòng khám dùng công nghệ để vận hành hiệu quả hơn. Kiểm tra mức độ số hóa của bạn.',
'Digitization is not just software — it is how your clinic uses technology to operate more efficiently. Check your digital level.',
'Đánh giá mức độ số hóa phòng khám','Assess your clinic digital transformation level',
'["Ch.DIGITAL"]','active',1,'mini',
'{"clinic_name":{"label_vi":"Tên phòng khám","label_en":"Clinic name","required":true,"placeholder_vi":"Nha Khoa ABC","type":"text"},"email":{"label_vi":"Email liên hệ","label_en":"Contact email","required":true,"placeholder_vi":"ban@email.com","type":"email"}}',
'{"dimensions":[{"id":"digital","name_vi":"Số hóa","name_en":"Digital","question_ids":["sh_q1","sh_q2","sh_q3","sh_q4","sh_q5"],"formula":"avg"}],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}',
'{"prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS. Dựa trên kết quả Số Hóa Check (điểm {{SCORE_DIGITAL}}/100 kèm 2 câu open-ended), phân tích mức độ số hóa và đưa ra 3 gợi ý ưu tiên. Tiếng Việt, giọng thực tế, khuyến khích.","prompt_en":"You are Dr. Vinh — founder of Dental Empire OS. Based on the Digital Check score ({{SCORE_DIGITAL}}/100 with 2 open-ended answers), analyze your clinic digitization level and suggest 3 priority improvements. English, practical and encouraging tone.","plan_prompt_vi":"Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_DIGITAL}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày số hóa phòng khám.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ","plan_prompt_en":"You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_DIGITAL}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to digitize your clinic.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words","model_override":null,"max_tokens_override":2048}',
'{}','{}',22,datetime('now'));

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('so-hoa-check',0,'PHẦN 1: ĐÁNH GIÁ SỐ HÓA','PART 1: DIGITAL EVALUATION',
'5 chiều đánh giá: phần mềm, dữ liệu, tiếp cận, marketing, và an ninh.',
'5 evaluation dimensions: software, data, communication, marketing, and security.',
'Số hóa — Digital','devices');

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES ('so-hoa-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
'Hai câu hỏi mở giúp bạn nhìn sâu vào mức độ số hóa.',
'Two open questions to look deeply into your digitalization level.',
'Số hóa — Digital','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
((SELECT id FROM survey_section WHERE survey_id='so-hoa-check' AND order_idx=0),'sh_q1',0,'select',
'Phòng khám sử dụng phần mềm quản lý nào — phần mềm nha khoa chuyên dụng, app đặt lịch, hay giải pháp số hóa khác?',
'What management software does your clinic use — dental software, scheduling app, or other digital solutions?',
'{"1":"Không dùng phần mềm, quản lý bằng sổ sách hoặc Excel","2":"Dùng Excel hoặc phần mềm không chuyên cho nha khoa","3":"Có phần mềm nha khoa cơ bản (quản lý bệnh nhân hoặc đặt lịch)","4":"Phần mềm nha khoa đầy đủ: bệnh nhân + lịch + tài chính + inventory","5":"Hệ thống tích hợp toàn diện — phần mềm + app + tự động hóa"}',
'{"1":"No software, managing with paper or Excel","2":"Using Excel or non-dental software","3":"Basic dental software (patient management or scheduling)","4":"Full dental software: patients + scheduling + finance + inventory","5":"Fully integrated system — software + app + automation"}',
'digital'),
((SELECT id FROM survey_section WHERE survey_id='so-hoa-check' AND order_idx=0),'sh_q2',1,'select',
'Dữ liệu bệnh nhân được lưu trữ và quản lý bằng công nghệ như thế nào?',
'How are patient data stored and managed digitally?',
'{"1":"Lưu trữ giấy, không có backup số","2":"Số hóa một phần nhưng không có hệ thống","3":"Có phần mềm lưu trữ nhưng dữ liệu rời rạc","4":"Dữ liệu số tập trung, có backup, dễ truy xuất","5":"Hệ thống dữ liệu toàn diện: CRM, backup tự động, analytics"}',
'{"1":"Paper storage, no digital backup","2":"Partially digitized but no system","3":"Software storage but data scattered","4":"Centralized digital data, backed up, easy to access","5":"Comprehensive data system: CRM, auto-backup, analytics"}',
'digital'),
((SELECT id FROM survey_section WHERE survey_id='so-hoa-check' AND order_idx=0),'sh_q3',2,'select',
'Phòng khám tiếp cận bệnh nhân và giao tiếp qua kênh số nào?',
'What digital channels does your clinic use to reach and communicate with patients?',
'{"1":"Không dùng kênh số để tiếp cận bệnh nhân","2":"Có Zalo/Facebook nhưng không có chiến lược","3":"Dùng Zalo, Facebook, có nội dung nhưng không đều đặn","4":"Có chiến lược nội dung đều đặn, có chatbot hoặc auto-reply","5":"Hệ thống tiếp cận số toàn diện: đa nền tảng + automation + CRM tích hợp"}',
'{"1":"No digital channels to reach patients","2":"Have Zalo/Facebook but no strategy","3":"Using Zalo, Facebook, content but not regular","4":"Regular content strategy, chatbot or auto-reply","5":"Comprehensive digital outreach: multi-platform + automation + integrated CRM"}',
'digital'),
((SELECT id FROM survey_section WHERE survey_id='so-hoa-check' AND order_idx=0),'sh_q4',3,'select',
'Phòng khám có dùng công cụ số để hỗ trợ điều trị — X-quang kỹ thuật số, camera nội soi, hay thiết bị công nghệ khác không?',
'Does your clinic use digital tools to support treatment — digital X-rays, intraoral cameras, or other tech?',
'{"1":"Không dùng công nghệ số trong điều trị","2":"Có X-quang kỹ thuật số nhưng ít dùng","3":"Dùng một vài thiết bị số nhưng chưa tích hợp","4":"Thiết bị số tốt, tích hợp vào quy trình điều trị","5":"Công nghệ tiên tiến: số hóa toàn diện quy trình điều trị + patient education tools"}',
'{"1":"No digital technology used in treatment","2":"Have digital X-rays but rarely use them","3":"Using a few digital devices but not integrated","4":"Good digital devices, integrated into treatment workflow","5":"Advanced technology: fully digitized treatment workflow + patient education tools"}',
'digital'),
((SELECT id FROM survey_section WHERE survey_id='so-hoa-check' AND order_idx=0),'sh_q5',4,'select',
'Phòng khám có biết và áp dụng các biện pháp an ninh số — backup, bảo mật, tuân thủ — không?',
'Is your clinic aware of and applying digital security measures — backup, security, compliance?',
'{"1":"Không có biện pháp an ninh số nào","2":"Biết có rủi ro nhưng chưa làm gì","3":"Backup thủ công thỉnh thoảng, không có kế hoạch","4":"Có backup định kỳ, mật khẩu cơ bản","5":"Hệ thống bảo mật tốt: backup tự động + mã hóa + training nhân viên"}',
'{"1":"No digital security measures at all","2":"Know the risks but have not done anything","3":"Occasional manual backup, no plan","4":"Regular backups, basic passwords","5":"Good security system: auto-backup + encryption + staff training"}',
'digital');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
((SELECT id FROM survey_section WHERE survey_id='so-hoa-check' AND order_idx=1),'sh_open1',0,'textarea',
'Công nghệ nào đã giúp phòng khám của bạn tiết kiệm thời gian hoặc cải thiện hiệu quả nhất? Kể một ví dụ cụ thể.',
'What technology has saved you the most time or improved efficiency the most? Give a specific example.',
'Nghĩ về một công cụ số hoặc phần mềm mà bạn dùng hàng ngày và thấy hữu ích nhất.',
'Think about a digital tool or software you use daily and find most useful.'),
((SELECT id FROM survey_section WHERE survey_id='so-hoa-check' AND order_idx=1),'sh_open2',1,'textarea',
'Điều gì ngăn cản bạn số hóa phòng khám nhiều hơn? (thời gian, chi phí, kiến thức, hay không tin tưởng)',
'What prevents you from digitizing your clinic more? (time, cost, knowledge, or distrust)',
'Nghĩ về rào cản lớn nhất với số hóa — có thể là thời gian học, chi phí đầu tư, hay đơn giản là không biết bắt đầu từ đâu.',
'Think about the biggest barrier to digitization — it could be learning time, investment cost, or simply not knowing where to start.');
