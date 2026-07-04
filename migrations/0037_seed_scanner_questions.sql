-- Seed questions for 5 new Mini Scanners.
-- Run AFTER 0036_seed_5_new_mini_scanners.sql
-- This file avoids CTE subqueries that fail on local SQLite.
-- Section IDs are hardcoded as placeholders — the API import (/admin/scanners) is the recommended approach.
-- For D1 remote: these INSERTs will work via the API import button instead.

-- Questions for an-toan-check (section order_idx=0 = Part 1, order_idx=1 = Part 2)
-- NOTE: Section IDs are AUTOINCREMENT. Use API import for reliable seeding.
-- These INSERTs use the section's AUTOINCREMENT id.
-- Safe approach: INSERT OR IGNORE so duplicates are skipped.

-- AN-TOAN-CHECK Part 1 (select questions, section order_idx=0)
INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='an-toan-check' AND "order_idx"=0), 'at_q1', 0, 'select',
'Phòng khám có giấy phép hoạt động còn hiệu lực và đạt tiêu chuẩn PCCC không?',
'Does your clinic have a valid operating license and fire safety certification?',
NULL, NULL,
'{"1":"Không rõ / chưa kiểm tra","2":"Có nhưng chưa đầy đủ","3":"Giấy phép có, PCCC cơ bản","4":"Đầy đủ giấy phép + PCCC + kiểm tra định kỳ","5":"Tất cả đạt + tự động nhắc gia hạn"}',
'{"1":"Don''t know / not checked","2":"Some but incomplete","3":"License yes, basic fire safety","4":"Full license + fire safety + periodic inspection","5":"All compliant + auto-renewal reminders"}',
1, 'safety');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='an-toan-check' AND "order_idx"=0), 'at_q2', 1, 'select',
'Quy trình vô trùng & khử khuẩn dụng cụ đạt chuẩn Bộ Y Tế và được ghi nhận không?',
'Does instrument sterilization meet MOH standards and is it documented?',
NULL, NULL,
'{"1":"Theo cảm tính, không có checklist","2":"Có quy trình nhưng không ghi nhận","3":"Có SOP + checklist hàng ngày","4":"Đạt chuẩn + tracking từng mẻ","5":"ISO + tracking từng mẻ + audit nội bộ"}',
'{"1":"Intuition-based, no checklist","2":"Process exists but not documented","3":"SOP + daily checklist","4":"Compliant + batch tracking","5":"ISO + batch tracking + internal audit"}',
1, 'safety');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='an-toan-check' AND "order_idx"=0), 'at_q3', 2, 'select',
'Nhân viên được đào tạo về xử lý tình huống khẩn cấp (cháy nổ, cấp cứu) chưa?',
'Are staff trained on emergency response (fire, medical emergency)?',
NULL, NULL,
'{"1":"Không có, chưa từng tập","2":"Một số người lớn tuổi có kinh nghiệm","3":"Có hướng dẫn cơ bản","4":"Đào tạo định kỳ + có kế hoạch sơ tán","5":"Tập trung định kỳ + đánh giá + cập nhật"}',
'{"1":"No training ever","2":"Some senior staff have experience","3":"Basic guidelines exist","4":"Regular training + evacuation plan","5":"Regular drills + evaluation + updates"}',
1, 'safety');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='an-toan-check' AND "order_idx"=0), 'at_q4', 3, 'select',
'Thuốc và vật tư y tế được quản lý theo quy định (nhiệt độ, hạn dùng, kê đơn) như thế nào?',
'How are medicines and medical supplies managed (temperature, expiry, prescriptions)?',
NULL, NULL,
'{"1":"Không theo dõi, dùng đến đâu hay đến đó","2":"Có nhưng không nhất quán","3":"Kiểm tra nhiệt độ + hạn dùng cơ bản","4":"Hệ thống theo dõi + kê đơn đầy đủ","5":"Tự động nhắc hạn + báo cáo định kỳ"}',
'{"1":"Not tracked, use until gone","2":"Some tracking but inconsistent","3":"Basic temperature + expiry check","4":"Monitoring system + full prescriptions","5":"Auto expiry alerts + periodic reports"}',
1, 'safety');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='an-toan-check' AND "order_idx"=0), 'at_q5', 4, 'select',
'Phòng khám có SOP cho tai biến y khoa chưa?',
'Does your clinic have a SOP for medical adverse events?',
NULL, NULL,
'{"1":"Không có SOP, xử lý tùy tình huống","2":"Có hướng dẫn miệng","3":"Có SOP nhưng ít ai nhớ","4":"Có SOP + đào tạo + ghi nhận","5":"SOP + đào tạo + ghi nhận + root-cause analysis + cải tiến"}',
'{"1":"No SOP, handled case-by-case","2":"Verbal guidance only","3":"SOP exists but few remember it","4":"SOP + training + documentation","5":"SOP + training + documentation + root-cause analysis + improvement"}',
1, 'safety');

-- AN-TOAN-CHECK Part 2 (textarea)
INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","required")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='an-toan-check' AND "order_idx"=1), 'at_open1', 0, 'textarea',
'An toàn nào là "lỗ hổng" lớn nhất của phòng khám hiện tại? Mô tả một tình huống cụ thể gần đây liên quan đến an toàn mà bạn nhớ rõ.',
'What is the biggest safety gap in your clinic right now? Describe a recent specific safety-related situation you clearly remember.',
'Mô tả ngắn gọn — giấy phép, vô trùng, PCCC, quản lý thuốc, hay đào tạo nhân sự?',
'Brief — license, sterilization, fire safety, drug management, or staff training?',
1);

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","required")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='an-toan-check' AND "order_idx"=1), 'at_open2', 1, 'textarea',
'Nếu cơ quan chức năng đến kiểm tra bất ngờ vào ngày mai, bạn có tự tin không? Điều gì khiến bạn lo nhất?',
'If regulators came for an unannounced inspection tomorrow, would you be confident? What worries you most?',
'Hãy trung thực — đây là câu hỏi để bạn tự đánh giá mức độ sẵn sàng.',
'Be honest — this is a self-assessment of your readiness level.',
1);

-- MARKETING-CHECK Part 1 (select)
INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='marketing-check' AND "order_idx"=0), 'mkt_q1', 0, 'select',
'Phòng khám tiếp cận bệnh nhân mới qua những kênh nào?',
'What channels does your clinic use to reach new patients?',
NULL, NULL,
'{"1":"Chỉ qua giới thiệu miệng / khách quen","2":"Có Facebook/Zalo nhưng không có chiến lược","3":"Chạy quảng cáo Facebook/Google nhưng không đo ROI","4":"Có chiến lược đa kênh + đo hiệu quả","5":"Đa kênh + content marketing + CRM tự động"}',
'{"1":"Only word of mouth / regulars","2":"Facebook/Zalo but no strategy","3":"Running ads but not measuring ROI","4":"Multi-channel strategy + ROI tracking","5":"Multi-channel + content marketing + auto CRM"}',
1, 'marketing');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='marketing-check' AND "order_idx"=0), 'mkt_q2', 1, 'select',
'Bạn có hệ thống chăm sóc và giữ chân bệnh nhân cũ không?',
'Do you have a system to care for and retain existing patients?',
NULL, NULL,
'{"1":"Không có, bệnh nhân quay lại tự nhiên","2":"Có gọi nhắc lịch nhưng không nhất quán","3":"Có chương trình chăm sóc định kỳ","4":"CRM + chương trình loyalty + theo dõi LTV","5":"Tự động hóa đầy đủ + phân tích LTV + upsell"}',
'{"1":"No system, patients return naturally","2":"Recall calls but inconsistent","3":"Periodic care program","4":"CRM + loyalty program + LTV tracking","5":"Full automation + LTV analysis + upsell"}',
1, 'marketing');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='marketing-check' AND "order_idx"=0), 'mkt_q3', 2, 'select',
'Chi phí marketing / doanh thu hàng tháng được theo dõi không?',
'Is marketing spend as a % of revenue tracked monthly?',
NULL, NULL,
'{"1":"Không theo dõi, không biết bao nhiêu","2":"Có tính tổng nhưng không chi tiết","3":"Theo dõi cơ bản theo tổng","4":"Chi tiết theo từng kênh + so sánh hiệu quả","5":"Real-time dashboard + tối ưu hóa liên tục"}',
'{"1":"Don''t track, don''t know how much","2":"Total known but no detail","3":"Basic total tracking","4":"Detailed per channel + ROI comparison","5":"Real-time dashboard + continuous optimization"}',
1, 'marketing');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='marketing-check' AND "order_idx"=0), 'mkt_q4', 3, 'select',
'Phòng khám có "USP" (điểm bán hàng độc nhất) rõ ràng không?',
'Does your clinic have a clear Unique Selling Proposition (USP)?',
NULL, NULL,
'{"1":"Không biết USP là gì","2":"Có nhưng chưa rõ ràng","3":"Có USP cơ bản, dùng trong giới thiệu","4":"USP rõ ràng + tích hợp vào mọi touchpoint","5":"Brand identity mạnh + USP + storytelling"}',
'{"1":"Don''t know what USP is","2":"Some but not clear","3":"Basic USP, used in introductions","4":"Clear USP + integrated into every touchpoint","5":"Strong brand identity + USP + storytelling"}',
1, 'marketing');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='marketing-check' AND "order_idx"=0), 'mkt_q5', 4, 'select',
'Phòng khám có chiến lược content (blog, video, educational) để xây dựng uy tín chuyên môn không?',
'Does your clinic have a content strategy to build professional credibility?',
NULL, NULL,
'{"1":"Không có content","2":"Đăng bài ad-hoc, không có chiến lược","3":"Có đăng đều nhưng không có chiến lược rõ","4":"Content strategy + đều đặn + có KPI","5":"Content machine + SEO + social proof + authority"}',
'{"1":"No content","2":"Post ad-hoc, no strategy","3":"Post regularly but no clear strategy","4":"Content strategy + consistent + KPIs","5":"Content machine + SEO + social proof + authority"}',
1, 'marketing');

-- MARKETING-CHECK Part 2 (textarea)
INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","required")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='marketing-check' AND "order_idx"=1), 'mkt_open1', 0, 'textarea',
'Kênh marketing nào đang hoạt động tốt nhất và kênh nào đang lãng phí ngân sách? Mô tả một tình huống cụ thể.',
'Which marketing channel is working best and which is wasting budget? Describe a specific situation.',
'Liệt kê 1-2 kênh hiệu quả nhất và 1-2 kênh cần cải thiện hoặc loại bỏ.',
'List 1-2 best performing channels and 1-2 that need improvement or removal.',
1);

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","required")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='marketing-check' AND "order_idx"=1), 'mkt_open2', 1, 'textarea',
'Nếu bạn có ngân sách marketing 10 triệu/tháng và chỉ tập trung vào 1 kênh, bạn sẽ chọn kênh nào? Tại sao?',
'If you had a 10M VND/month marketing budget and could only focus on 1 channel, which would you choose? Why?',
'Nghĩ về kênh nào mang lại bệnh nhân chất lượng nhất, không chỉ nhiều nhất.',
'Think about which channel brings the highest quality patients, not just the most.',
1);

-- CSKH-CHECK Part 1 (select)
INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='cskh-check' AND "order_idx"=0), 'cskh_q1', 0, 'select',
'Thời gian phản hồi trung bình khi bệnh nhân liên hệ (Zalo, điện thoại, email) là bao lâu?',
'What is the average response time when patients contact you (Zalo, phone, email)?',
NULL, NULL,
'{"1":"Không phản hồi / trả lời rất chậm (2-3 ngày+)","2":"1-2 ngày","3":"Vài giờ đến 1 ngày","4":"Trong giờ làm việc, dưới 2 giờ","5":"Tự động phản hồi ngay + theo dõi SLA"}',
'{"1":"No response / very slow (2-3 days+)","2":"1-2 days","3":"A few hours to 1 day","4":"Within working hours, under 2 hours","5":"Instant auto-response + SLA tracking"}',
1, 'service');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='cskh-check' AND "order_idx"=0), 'cskh_q2', 1, 'select',
'Nhân viên CSKH được đào tạo về kỹ năng giao tiếp và xử lý khiếu nại chưa?',
'Are CS staff trained on communication skills and complaint handling?',
NULL, NULL,
'{"1":"Không có đào tạo","2":"Đào tạo cơ bản khi vào làm","3":"Có đào tạo định kỳ 1-2 lần/năm","4":"Training chuyên sâu + role-play + feedback","5":"Continuous training + QA + coaching"}',
'{"1":"No training","2":"Basic onboarding only","3":"Periodic training 1-2x/year","4":"Deep training + role-play + feedback","5":"Continuous training + QA + coaching"}',
1, 'service');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='cskh-check' AND "order_idx"=0), 'cskh_q3', 2, 'select',
'Phòng khám có thu thập và phân tích phản hồi bệnh nhân (NPS, survey) không?',
'Does your clinic collect and analyze patient feedback (NPS, survey)?',
NULL, NULL,
'{"1":"Không có, không thu thập","2":"Có nghe phản hồi nhưng không hệ thống","3":"Survey định kỳ 1-2 lần/năm","4":"NPS hàng quý + phân tích root cause","5":"Real-time feedback + NPS + action plan"}',
'{"1":"No collection at all","2":"Informal feedback only","3":"Periodic survey 1-2x/year","4":"Quarterly NPS + root cause analysis","5":"Real-time feedback + NPS + action plan"}',
1, 'service');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='cskh-check' AND "order_idx"=0), 'cskh_q4', 3, 'select',
'Khi có khiếu nại, quy trình xử lý và bồi thường ra sao?',
'When a complaint arises, what is the handling process and compensation like?',
NULL, NULL,
'{"1":"Xử lý tùy tình huống, không có quy trình","2":"Có quy trình nhưng không nhất quán","3":"Có SOP xử lý khiếu nại + bồi thường theo quy định","4":"SOP + compensation + rút kinh nghiệm + cải tiến","5":"Full CRM + proactive resolution + recovery flowchart"}',
'{"1":"Handled case-by-case, no process","2":"Process exists but inconsistent","3":"SOP + compensation per policy","4":"SOP + compensation + learning + improvement","5":"Full CRM + proactive resolution + recovery flowchart"}',
1, 'service');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='cskh-check' AND "order_idx"=0), 'cskh_q5', 4, 'select',
'Nhân viên có được train để "thấu cảm" với bệnh nhân không?',
'Are staff trained to empathize with patients?',
NULL, NULL,
'{"1":"Không có đào tạo về thấu cảm","2":"Có nhắc nhưng không có đào tạo chính thức","3":"Đào tạo cơ bản về thấu cảm","4":"Training chuyên sâu + role-play + đánh giá","5":"Thấu cảm là văn hóa — mọi người tự nhiên thể hiện"}',
'{"1":"No empathy training","2":"Reminded but no formal training","3":"Basic empathy training","4":"Deep training + role-play + evaluation","5":"Empathy is the culture — everyone naturally demonstrates it"}',
1, 'service');

-- CSKH-CHECK Part 2 (textarea)
INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","required")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='cskh-check' AND "order_idx"=1), 'cskh_open1', 0, 'textarea',
'Điều gì khiến bệnh nhân KHÔNG quay lại phòng khám của bạn? Kể một tình huống cụ thể mà bạn biết hoặc nghe được.',
'What makes patients NOT return to your clinic? Describe a specific situation you know or heard about.',
'Mô tả ngắn gọn — thái độ, thời gian chờ, giá cả, hay vấn đề khác?',
'Brief — attitude, wait time, pricing, or other issues?',
1);

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","required")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='cskh-check' AND "order_idx"=1), 'cskh_open2', 1, 'textarea',
'Kể một tình huống mà nhân viên của bạn đã xử lý khiếu nại hoặc làm bệnh nhân cực kỳ hài lòng. Điều gì đã làm nên sự khác biệt?',
'Describe a situation where your staff handled a complaint or made a patient extremely satisfied. What made the difference?',
'Có thể trích dẫn tin nhắn, review, hoặc lời kể của nhân viên.',
'You can quote a message, review, or staff story.',
1);

-- VAN-HOA-CHECK Part 1 (select)
INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='van-hoa-check' AND "order_idx"=0), 'vh_q1', 0, 'select',
'Phòng khám có "giá trị cốt lõi" (core values) rõ ràng và được nhân viên biết không?',
'Does your clinic have clear core values that staff know and follow?',
NULL, NULL,
'{"1":"Không có, chưa bao giờ nói về giá trị","2":"Có treo tường nhưng ít ai nhớ","3":"Giá trị cơ bản, nhắc nhở thỉnh thoảng","4":"Giá trị rõ ràng + tích hợp vào đánh giá","5":"Core values-driven culture + recruitment + recognition"}',
'{"1":"No core values defined","2":"Posted on wall but rarely remembered","3":"Basic values, occasionally referenced","4":"Clear values + integrated in performance reviews","5":"Core values-driven culture + recruitment + recognition"}',
1, 'culture');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='van-hoa-check' AND "order_idx"=0), 'vh_q2', 1, 'select',
'Nhân viên có được lắng nghe và tham gia vào quyết định không?',
'Are staff listened to and included in decision-making?',
NULL, NULL,
'{"1":"Mọi quyết định đều từ chủ / quản lý","2":"Ít khi, chỉ hỏi ý kiến cho form","3":"Thỉnh thoảng hỏi nhưng không theo quy trình","4":"Có quy trình lấy ý kiến + feedback loop","5":"Democratic culture + empowerment + innovation"}',
'{"1":"All decisions from owner/manager","2":"Rarely, only formal consultations","3":"Sometimes asked but no process","4":"Process for input + feedback loop","5":"Democratic culture + empowerment + innovation"}',
1, 'culture');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='van-hoa-check' AND "order_idx"=0), 'vh_q3', 2, 'select',
'Tỷ lệ nghỉ việc / thay đổi nhân sự trong 12 tháng qua là bao nhiêu?',
'What is your staff turnover rate in the past 12 months?',
NULL, NULL,
'{"1":"Trên 50% — thay đổi liên tục","2":"30-50% — khá cao","3":"15-30% — bình thường với ngành","4":"5-15% — có một số vị trí khó giữ","5":"Dưới 5% — nhân sự ổn định"}',
'{"1":"Over 50% — constant turnover","2":"30-50% — quite high","3":"15-30% — normal for the industry","4":"5-15% — some hard-to-retain positions","5":"Under 5% — stable team"}',
1, 'culture');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='van-hoa-check' AND "order_idx"=0), 'vh_q4', 3, 'select',
'Phòng khám có chế độ đãi ngộ và phúc lợi (ngoài lương) rõ ràng không?',
'Does your clinic have clear compensation and benefits (beyond salary)?',
NULL, NULL,
'{"1":"Chỉ có lương, không có phúc lợi","2":"Phúc lợi ad-hoc, không có quy định","3":"Có phúc lợi cơ bản (BHXH, BHYT)","4":"Phúc lợi đầy đủ + thưởng KPI + team building","5":"Full package + career path + professional development"}',
'{"1":"Salary only, no benefits","2":"Ad-hoc benefits, no policy","3":"Basic benefits (social insurance, health insurance)","4":"Full benefits + KPI bonus + team building","5":"Full package + career path + professional development"}',
1, 'culture');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='van-hoa-check' AND "order_idx"=0), 'vh_q5', 4, 'select',
'An toàn tâm lý (psychological safety) trong phòng khám như thế nào?',
'What is the psychological safety level in your clinic?',
NULL, NULL,
'{"1":"Không ai dám nói thẳng, sợ bị phạt","2":"Chỉ một vài người dám, phần lớn im lặng","3":"Cố gắng xây dựng nhưng chưa thành","4":"Phần lớn an toàn, có thể nói thẳng","5":"An toàn tâm lý cao — mọi người nói thẳng vì tin tưởng"}',
'{"1":"No one dares to speak up, afraid of punishment","2":"Only a few dare, most stay silent","3":"Trying to build but not yet there","4":"Most feel safe, can speak up","5":"High psychological safety — everyone speaks up because of trust"}',
1, 'culture');

-- VAN-HOA-CHECK Part 2 (textarea)
INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","required")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='van-hoa-check' AND "order_idx"=1), 'vh_open1', 0, 'textarea',
'Văn hóa nào đang "xung đột" hoặc không phù hợp với định hướng phòng khám? Mô tả một tình huống cụ thể mà bạn nhớ rõ.',
'What cultural aspect is "conflicting" or not aligned with your clinic direction? Describe a specific situation you remember.',
'Ví dụ: "nói một đằng làm một nẻo", "không ai dám nói thẳng", "thiếu teamwork"...',
'e.g. "say one thing, do another", "no one speaks up", "lack of teamwork"...',
1);

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","required")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='van-hoa-check' AND "order_idx"=1), 'vh_open2', 1, 'textarea',
'Nhân viên có tự hào khi giới thiệu nơi làm việc cho bạn bè/người thân không? Tại sao bạn nghĩ vậy?',
'Are staff proud to introduce their workplace to friends/family? Why do you think so?',
'Hãy trung thực — đây là dấu hiệu quan trọng nhất của văn hóa lành mạnh.',
'Be honest — this is the most important sign of a healthy culture.',
1);

-- THUONG-HIEU-CHECK Part 1 (select)
INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='thuong-hieu-check' AND "order_idx"=0), 'th_q1', 0, 'select',
'Người trong khu vực (bán kính 5km) có biết phòng khám của bạn không?',
'Do people in your area (5km radius) know your clinic?',
NULL, NULL,
'{"1":"Không ai biết, chưa ai nhắc","2":"Vài người quen biết","3":"Biết đến nhưng không nhớ rõ dịch vụ","4":"Nhớ tên + dịch vụ chính + vị trí","5":"Top-of-mind trong khu vực + NPS cao"}',
'{"1":"Nobody knows, no referrals","2":"Some acquaintances know","3":"Heard of but unclear on services","4":"Remembers name + main services + location","5":"Top-of-mind in the area + high NPS"}',
1, 'brand');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='thuong-hieu-check' AND "order_idx"=0), 'th_q2', 1, 'select',
'Phòng khám có nhận diện thương hiệu (logo, màu sắc, slogan) nhất quán không?',
'Does your clinic have consistent brand identity (logo, colors, slogan)?',
NULL, NULL,
'{"1":"Không có, mỗi nơi một kiểu","2":"Có logo cơ bản, không có guideline","3":"Có nhận diện cơ bản, dùng không nhất quán","4":"Brand guideline đầy đủ + nhất quán trên mọi touchpoint","5":"Professional brand identity + digital + offline consistency"}',
'{"1":"No identity, everything inconsistent","2":"Basic logo, no guidelines","3":"Basic identity but inconsistently used","4":"Full brand guideline + consistent on all touchpoints","5":"Professional brand identity + digital + offline consistency"}',
1, 'brand');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='thuong-hieu-check' AND "order_idx"=0), 'th_q3', 2, 'select',
'Phòng khám có đánh giá / review online (Google, Facebook, Zalo) và quản lý không?',
'Does your clinic manage online reviews (Google, Facebook, Zalo)?',
NULL, NULL,
'{"1":"Không có, không theo dõi","2":"Có ít review nhưng không trả lời","3":"Trả lời khi có review mới","4":"Chủ động xin review + trả lời tất cả + phân tích","5":"Full review management + sentiment analysis + proactive"}',
'{"1":"No reviews, no tracking","2":"Some reviews but no responses","3":"Responds when new reviews appear","4":"Proactively asks for reviews + responds + analyzes","5":"Full review management + sentiment analysis + proactive"}',
1, 'brand');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='thuong-hieu-check' AND "order_idx"=0), 'th_q4', 3, 'select',
'Phòng khám có sự hiện diện online (website, Google Business, mạng xã hội) mạnh không?',
'Does your clinic have a strong online presence (website, Google Business, social media)?',
NULL, NULL,
'{"1":"Không có website / chỉ có trang Facebook cơ bản","2":"Website cơ bản + Facebook nhưng ít cập nhật","3":"Website + Google Business + Facebook active","4":"Full online presence + regular content + SEO","5":"Integrated digital brand + content strategy + analytics"}',
'{"1":"No website / only basic Facebook page","2":"Basic website + Facebook but rarely updated","3":"Website + Google Business + active Facebook","4":"Full online presence + regular content + SEO","5":"Integrated digital brand + content strategy + analytics"}',
1, 'brand');

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","scale_labels_vi","scale_labels_en","required","dimension")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='thuong-hieu-check' AND "order_idx"=0), 'th_q5', 4, 'select',
'Phòng khám có chiến lược xây dựng uy tín (educational content, KOL, partnership) để tạo niềm tin dài hạn không?',
'Does your clinic have a strategy to build credibility for long-term trust?',
NULL, NULL,
'{"1":"Không có chiến lược này","2":"Có đôi chút nhưng không có chiến lược","3":"Có content đều đặn nhưng chưa có chiến lược rõ","4":"Chiến lược rõ + content + partnership","5":"Full authority building: content + community + thought leadership"}',
'{"1":"No such strategy","2":"Some effort but no strategy","3":"Regular content but no clear strategy","4":"Clear strategy + content + partnerships","5":"Full authority building: content + community + thought leadership"}',
1, 'brand');

-- THUONG-HIEU-CHECK Part 2 (textarea)
INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","required")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='thuong-hieu-check' AND "order_idx"=1), 'th_open1', 0, 'textarea',
'Cạnh tranh trực tiếp với phòng khám nào trong khu vực và điều gì khiến bạn khác biệt? Điều gì khiến bệnh nhân chọn bạn thay vì đối thủ?',
'Who are your direct competitors in the area and what makes you different? What makes patients choose you over competitors?',
'Liệt kê 1-2 đối thủ chính và 1-2 điều khiến phòng khám của bạn khác biệt.',
'List 1-2 main competitors and 1-2 things that make your clinic different.',
1);

INSERT OR IGNORE INTO "survey_question" ("section_id","question_id","order_idx","type","label_vi","label_en","placeholder_vi","placeholder_en","required")
VALUES
((SELECT id FROM "survey_section" WHERE "survey_id"='thuong-hieu-check' AND "order_idx"=1), 'th_open2', 1, 'textarea',
'Nếu bạn phải mô tả thương hiệu phòng khám bằng 3 từ, bạn sẽ chọn 3 từ nào? Những từ đó có đúng với thực tế không?',
'If you had to describe your clinic brand in 3 words, which 3 words would you choose? Do those words match reality?',
'Ví dụ: "Uy tín — Tận tâm — Chuyên nghiệp" — hãy đánh giá thực tế mỗi từ.',
'e.g.: "Trusted — Caring — Professional" — rate how true each word is in reality.',
1);
