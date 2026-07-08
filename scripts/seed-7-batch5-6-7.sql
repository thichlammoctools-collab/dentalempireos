-- Seed: 7 scanners batch 5+6+7 (orders 33-39) using subqueries (SQLite/D1 compatible)

-- ================================================================
-- === 33: kpi-check (kpi) =======================================
-- ================================================================

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('kpi-check','kpi-check','KPI Check','KPI Check',
'5 câu hỏi giúp bạn đánh giá mức độ KPI-ization của phòng khám — từ việc đặt mục tiêu, theo dõi, đến cải thiện dựa trên dữ liệu.',
'5 questions to assess your clinic''s KPI-ization — from goal-setting and tracking to data-driven improvement.',
'Đánh giá theo dõi và quản lý KPI phòng khám','Clinic KPI management and tracking assessment','[]','active',1,'mini',33);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('kpi-check',0,'PHẦN 1: ĐÁNH GIÁ KPI','PART 1: KPI EVALUATION',
   '5 chiều đánh giá: mục tiêu, theo dõi, phân tích, cải tiến, và văn hóa data.',
   '5 evaluation dimensions: goals, tracking, analysis, improvement, and data culture.',
   'KPI','speed'),
  ('kpi-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào văn hóa KPI.',
   'Two open questions to face KPI reality honestly.',
   'KPI','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='kpi-check' AND order_idx=0),
   'kpi_q1',0,'select',
   'Phòng khám có đặt mục tiêu KPI rõ ràng (doanh thu, bệnh nhân mới, case mix) cho từng tháng/quý không?',
   'Does your clinic set clear KPI goals (revenue, new patients, case mix) for each month/quarter?',
   '{"1":"Không có mục tiêu rõ ràng","2":"Có mục tiêu chung nhưng không cụ thể","3":"Có mục tiêu cho từng tháng","4":"Mục tiêu rõ ràng, có báo cáo theo dõi","5":"Mục tiêu + dashboard realtime + review định kỳ"}',
   '{"1":"No clear goals","2":"General goals but not specific","3":"Monthly goals set","4":"Clear goals with tracking reports","5":"Goals + realtime dashboard + periodic reviews"}',
   'kpi'),
  ((SELECT id FROM survey_section WHERE survey_id='kpi-check' AND order_idx=0),
   'kpi_q2',1,'select',
   'Bạn theo dõi KPI nào và với tần suất nào?',
   'Which KPIs do you track and how frequently?',
   '{"1":"Không theo dõi thường xuyên","2":"Theo dõi cảm tính, không có số liệu cụ thể","3":"Theo dõi vài KPI quan trọng (doanh thu)","4":"Theo dõi đều đặn nhiều KPI","5":"Dashboard đầy đủ, update hàng ngày/tuần"}',
   '{"1":"No regular tracking","2":"Intuitive tracking, no concrete numbers","3":"Track a few key KPIs (revenue only)","4":"Consistent tracking of multiple KPIs","5":"Full dashboard, updated daily/weekly"}',
   'kpi'),
  ((SELECT id FROM survey_section WHERE survey_id='kpi-check' AND order_idx=0),
   'kpi_q3',2,'select',
   'Khi KPI không đạt, phòng khám có quy trình phân tích nguyên nhân và hành động khắc phục không?',
   'When KPIs miss targets, does your clinic have a process to analyze root causes and take corrective action?',
   '{"1":"Không có quy trình, bỏ qua","2":"Có nhận xét nhưng không có hành động cụ thể","3":"Phân tích nguyên nhân nhưng không có kế hoạch hành động","4":"Có review + kế hoạch hành động rõ ràng","5":"Root cause analysis + action plan + theo dõi + cải tiến liên tục"}',
   '{"1":"No process, ignored","2":"Comments but no specific action","3":"Root cause analysis but no action plan","4":"Review + clear action plan","5":"Root cause analysis + action plan + tracking + continuous improvement"}',
   'kpi'),
  ((SELECT id FROM survey_section WHERE survey_id='kpi-check' AND order_idx=0),
   'kpi_q4',3,'select',
   'Đội ngũ (bác sĩ, lễ tân, nhân viên) có được gắn KPI cá nhân không?',
   'Are individual team members (doctors, receptionists, staff) assigned personal KPIs?',
   '{"1":"Không có KPI cá nhân","2":"Chỉ có KPI cho chủ/phụ trách","3":"Có KPI cá nhân nhưng không theo dõi","4":"KPI cá nhân có theo dõi và review","5":"KPI cá nhân + team OKR + review hàng tháng"}',
   '{"1":"No personal KPIs","2":"Only owner/manager has KPIs","3":"Personal KPIs exist but not tracked","4":"Personal KPIs tracked and reviewed","5":"Personal KPIs + team OKRs + monthly reviews"}',
   'kpi'),
  ((SELECT id FROM survey_section WHERE survey_id='kpi-check' AND order_idx=0),
   'kpi_q5',4,'select',
   'Phòng khám có văn hóa "data-driven" — mọi quyết định dựa trên dữ liệu, không chỉ kinh nghiệm?',
   'Does your clinic have a "data-driven" culture — decisions based on data, not just experience?',
   '{"1":"Quyết định hoàn toàn dựa vào kinh nghiệm và cảm nhận","2":"Chủ yếu kinh nghiệm, ít khi dùng số liệu","3":"Kết hợp kinh nghiệm và một số dữ liệu","4":"Thường xuyên dùng dữ liệu để hỗ trợ quyết định","5":"Mọi quyết định đều có data backup, có dashboard cho mọi cấp"}',
   '{"1":"Decisions purely based on experience and intuition","2":"Mostly experience, rarely using data","3":"Mix of experience and some data","4":"Regularly use data to support decisions","5":"Every decision has data backup, dashboards at every level"}',
   'kpi'),
  ((SELECT id FROM survey_section WHERE survey_id='kpi-check' AND order_idx=1),
   'kpi_open1',0,'textarea',
   'KPI nào mà bạn theo dõi sát sao nhất? KPI nào bạn hoàn toàn không có dữ liệu? Điều gì quyết định sự khác biệt đó?',
   'Which KPI do you track most closely? Which KPI do you have zero data on? What determines that difference?',
   NULL,NULL,NULL),
  ((SELECT id FROM survey_section WHERE survey_id='kpi-check' AND order_idx=1),
   'kpi_open2',1,'textarea',
   'Nếu bạn phải chọn CHỈ 1 KPI duy nhất để theo dõi mỗi ngày, bạn sẽ chọn cái nào? Tại sao?',
   'If you had to choose ONLY 1 KPI to track every single day, which would it be? Why?',
   NULL,NULL,NULL);


-- ================================================================
-- === 34: os-maturity-check (maturity) ===========================
-- ================================================================

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('os-maturity-check','os-maturity-check','OS Maturity Check','OS Maturity Check',
'Đánh giá mức độ trưởng thành của hệ thống quản trị phòng khám — từ "chạy theo công việc" đến "hệ thống tự vận hành".',
'Assess your clinic''s management system maturity — from "chasing work" to "self-running systems".',
'Đánh giá mức độ trưởng thành hệ thống','System maturity assessment','[]','active',1,'mini',34);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('os-maturity-check',0,'PHẦN 1: ĐÁNH GIÁ MỨC ĐỘ TRƯỞNG THÀNH','PART 1: MATURITY EVALUATION',
   '5 chiều đánh giá: tài liệu, vận hành, con người, dữ liệu, và cải tiến.',
   '5 evaluation dimensions: documentation, operations, people, data, and improvement.',
   'OS Maturity','stacked_line_chart'),
  ('os-maturity-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào mức độ trưởng thành.',
   'Two open questions to face maturity honestly.',
   'OS Maturity','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='os-maturity-check' AND order_idx=0),
   'osm_q1',0,'select',
   'Mức độ tài liệu hóa quy trình của phòng khám ở đâu?',
   'How well-documented are your clinic''s processes?',
   '{"1":"Không có tài liệu, mọi thứ trong đầu người làm","2":"Một số quy trình quan trọng được viết ra","3":"Tài liệu cho hầu hết quy trình chính, có SOP","4":"Đầy đủ SOP + review định kỳ + version control","5":"Knowledge base sống, mọi người đóng góp và cập nhật liên tục"}',
   '{"1":"No documentation, everything in people''s heads","2":"Some important processes written down","3":"Documentation for most key processes, SOPs exist","4":"Complete SOPs + periodic review + version control","5":"Living knowledge base, everyone contributes and updates"}',
   'maturity'),
  ((SELECT id FROM survey_section WHERE survey_id='os-maturity-check' AND order_idx=0),
   'osm_q2',1,'select',
   'Phòng khám có thể vận hành ổn định nếu bạn đi vacation 2 tuần không?',
   'Can your clinic run stably if you take a 2-week vacation?',
   '{"1":"Không thể, mọi thứ sẽ hỗn loạn ngay","2":"Được 1-2 ngày, sau đó bắt đầu có vấn đề","3":"Được 1 tuần, sau đó cần liên lạc giải quyết","4":"Được 2 tuần với điện thoại hỗ trợ từ xa","5":"Hoàn toàn tự vận hành, không cần liên lạc"}',
   '{"1":"Impossible, everything gets chaotic immediately","2":"Lasts 1-2 days, then problems start","3":"Lasts 1 week, then needs remote support","4":"Lasts 2 weeks with remote phone support","5":"Fully self-running, no contact needed"}',
   'maturity'),
  ((SELECT id FROM survey_section WHERE survey_id='os-maturity-check' AND order_idx=0),
   'osm_q3',2,'select',
   'Hệ thống phòng khám có "cỗ máy tự động" — nơi mà công việc chảy qua các bước mà không cần ai nhắc nhở?',
   'Does your clinic have "automatic machinery" — where work flows through steps without anyone having to remind anyone?',
   '{"1":"Mọi thứ cần nhắc nhở liên tục, không có gì tự chạy","2":"Một vài thứ tự động nhưng phần lớn cần nhắc","3":"50% công việc vận hành tự động","4":"Hầu hết tự động, có exception handling rõ ràng","5":"Workflow engine: mọi thứ chảy tự động, exception hiếm"}',
   '{"1":"Everything needs constant reminders, nothing runs itself","2":"Some things automatic but mostly need reminders","3":"50% of operations run automatically","4":"Mostly automatic with clear exception handling","5":"Workflow engine: everything flows automatically, exceptions rare"}',
   'maturity'),
  ((SELECT id FROM survey_section WHERE survey_id='os-maturity-check' AND order_idx=0),
   'osm_q4',3,'select',
   'Đội ngũ có năng lực thay thế và mở rộng không?',
   'Does your team have replacement capacity and scalability?',
   '{"1":"Chỉ 1-2 người biết làm mọi thứ, thay thế rất khó","2":"Mỗi người làm 1 việc cố định, cross-training rất ít","3":"Có cross-training cơ bản, thay thế được một số vai","4":"Tài liệu hóa tốt, nhiều người có thể đảm nhận nhiều vai","5":"Hệ thống có thể scale gấp đôi với đội ngũ hiện tại"}',
   '{"1":"Only 1-2 people know everything, hard to replace","2":"Each person does one fixed job, little cross-training","3":"Basic cross-training, some roles can be replaced","4":"Well-documented, many people can cover multiple roles","5":"System can double in scale with current team"}',
   'maturity'),
  ((SELECT id FROM survey_section WHERE survey_id='os-maturity-check' AND order_idx=0),
   'osm_q5',4,'select',
   'Phòng khám có quy trình học hỏi từ sai sót và cải tiến liên tục không?',
   'Does your clinic have a process for learning from mistakes and continuous improvement?',
   '{"1":"Sai sót xảy ra, được sửa, rồi lại lặp lại","2":"Có họp hàng tháng nhưng không có action items cụ thể","3":"Có post-mortem nhưng không always-on","4":"Hệ thống học từ sai sót + action items + theo dõi","5":"Continuous improvement engine: mọi sai sót đều trở thành cải tiến"}',
   '{"1":"Mistakes happen, get fixed, then repeat","2":"Monthly meetings but no specific action items","3":"Post-mortems exist but not always-on","4":"System learns from mistakes + action items + tracking","5":"Continuous improvement engine: every mistake becomes an improvement"}',
   'maturity'),
  ((SELECT id FROM survey_section WHERE survey_id='os-maturity-check' AND order_idx=1),
   'osm_open1',0,'textarea',
   'Mô tả "điểm nghẽn" lớn nhất của phòng khám — cái gì mà nếu không giải quyết, mọi thứ khác đều bị giới hạn?',
   'Describe the biggest bottleneck in your clinic — what, if not solved, limits everything else?',
   NULL,NULL,NULL),
  ((SELECT id FROM survey_section WHERE survey_id='os-maturity-check' AND order_idx=1),
   'osm_open2',1,'textarea',
   'Nếu bạn có thể nâng cấp MỘT khía cạnh duy nhất của hệ thống phòng khám, bạn sẽ chọn gì? Tại sao đó lại có tác động lớn nhất?',
   'If you could upgrade ONE aspect of your clinic system, what would you choose? Why would that have the biggest impact?',
   NULL,NULL,NULL);


-- ================================================================
-- === 35: dao-tao-check (training) ==============================
-- ================================================================

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('dao-tao-check','dao-tao-check','Đào Tạo Check','Training Check',
'5 câu hỏi giúp bạn đánh giá hệ thống đào tạo phòng khám — từ onboarding nhân viên mới đến phát triển kỹ năng liên tục.',
'5 questions to assess your clinic''s training system — from new staff onboarding to continuous skill development.',
'Đánh giá hệ thống đào tạo và phát triển đội ngũ','Team training and development assessment','[]','active',1,'mini',35);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('dao-tao-check',0,'PHẦN 1: ĐÁNH GIÁ ĐÀO TẠO','PART 1: TRAINING EVALUATION',
   '5 chiều đánh giá: onboarding, kỹ năng, mentorship, đào tạo chuyên môn, và phát triển.',
   '5 evaluation dimensions: onboarding, skills, mentorship, professional development, and growth.',
   'Đào Tạo','school'),
  ('dao-tao-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào văn hóa đào tạo.',
   'Two open questions to face training culture honestly.',
   'Đào Tạo','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='dao-tao-check' AND order_idx=0),
   'dt_q1',0,'select',
   'Khi nhân viên mới vào, phòng khám có chương trình onboarding rõ ràng không?',
   'When new staff join, does your clinic have a clear onboarding program?',
   '{"1":"Không có, học bằng cách quan sát hoặc tự mò mẫm","2":"Có người "chỉ điểm" nhưng không có chương trình cụ thể","3":"Onboarding 1-2 tuần với checklist cơ bản","4":"Onboarding có cấu trúc: đào tạo + mentorship + đánh giá 30-60-90 ngày","5":"Full onboarding engine: tài liệu + mentor + KPI onboarding + culture fit assessment"}',
   '{"1":"No program, learn by watching or trial and error","2":"Someone "shows the ropes" but no structured program","3":"1-2 week onboarding with basic checklist","4":"Structured onboarding: training + mentorship + 30-60-90 day review","5":"Full onboarding engine: docs + mentor + onboarding KPIs + culture fit assessment"}',
   'training'),
  ((SELECT id FROM survey_section WHERE survey_id='dao-tao-check' AND order_idx=0),
   'dt_q2',1,'select',
   'Nhân viên hiện tại có được đào tạo nâng cao kỹ năng không? Với tần suất nào?',
   'Are current staff trained to improve skills? How frequently?',
   '{"1":"Không có đào tạo nào sau khi vào làm","2":"Hiếm khi, chỉ khi có vấn đề nghiêm trọng","3":"Vài lần một năm, không có kế hoạch","4":"Đào tạo định kỳ hàng quý với lộ trình rõ ràng","5":"Learning & development system: ngân sách đào tạo + lộ trình phát triển cá nhân + KPI đào tạo"}',
   '{"1":"Zero training after joining","2":"Rarely, only when serious problems arise","3":"A few times a year, no plan","4":"Quarterly training with clear roadmap","5":"L&D system: training budget + personal development roadmap + training KPIs"}',
   'training'),
  ((SELECT id FROM survey_section WHERE survey_id='dao-tao-check' AND order_idx=0),
   'dt_q3',2,'select',
   'Phòng khám có chương trình mentorship — người có kinh nghiệm hướng dẫn người mới — không?',
   'Does your clinic have a mentorship program — experienced people guiding newer staff?',
   '{"1":"Không có mentorship chính thức","2":"Có mentorship không chính thức, phụ thuộc vào cá nhân","3":"Mỗi nhân viên mới có một mentor nhưng không có guideline","4":"Mentorship có cấu trúc: pairing, check-in định kỳ, đánh giá mentor","5":"Full mentorship engine: training cho mentor + structured check-ins + career pathing"}',
   '{"1":"No formal mentorship","2":"Informal mentorship, depends on individuals","3":"Each new hire has a mentor but no guidelines","4":"Structured mentorship: pairing, periodic check-ins, mentor reviews","5":"Full mentorship engine: mentor training + structured check-ins + career pathing"}',
   'training'),
  ((SELECT id FROM survey_section WHERE survey_id='dao-tao-check' AND order_idx=0),
   'dt_q4',3,'select',
   'Nhân viên có được khuyến khích học hỏi và phát triển sự nghiệp không — không chỉ làm công việc hàng ngày?',
   'Are staff encouraged to learn and develop their careers — not just do daily work?',
   '{"1":"Không, chỉ tập trung vào công việc hàng ngày","2":"Ít khi, không có hỗ trợ cụ thể","3":"Thỉnh thoảng có khóa học, nhưng không có lộ trình","4":"Có lộ trình phát triển rõ ràng cho từng vai trò","5":"Career development system: growth paths + learning budget + bi-weekly 1:1 coaching"}',
   '{"1":"No, only focus on daily work","2":"Rarely, no specific support","3":"Occasional courses but no roadmap","4":"Clear development paths for each role","5":"Career development system: growth paths + learning budget + bi-weekly 1:1 coaching"}',
   'training'),
  ((SELECT id FROM survey_section WHERE survey_id='dao-tao-check' AND order_idx=0),
   'dt_q5',4,'select',
   'Đào tạo có được đo lường hiệu quả không — bạn biết đào tạo nào có ROI và đào tạo nào không?',
   'Is training effectiveness measured — do you know which training has ROI and which does not?',
   '{"1":"Không đo lường, không biết đào tạo có hiệu quả không","2":"Cảm nhận chủ quan sau đào tạo","3":"Có đánh giá sau khóa học nhưng không theo dõi dài hạn","4":"Đo lường: pre/post test + behavior change + impact on KPIs","5":"Training analytics: đo lường đầy đủ + ROI calculation + continuous optimization"}',
   '{"1":"Not measured, no idea if training is effective","2":"Subjective feelings after training","3":"Post-course evaluation but no long-term tracking","4":"Measured: pre/post tests + behavior change + KPI impact","5":"Training analytics: full measurement + ROI calculation + continuous optimization"}',
   'training'),
  ((SELECT id FROM survey_section WHERE survey_id='dao-tao-check' AND order_idx=1),
   'dt_open1',0,'textarea',
   'Kỹ năng nào mà đội ngũ phòng khám đang thiếu nhiều nhất? Kỹ năng đó ảnh hưởng đến công việc như thế nào?',
   'What skill is your team most lacking? How does that skill gap impact work?',
   NULL,NULL,NULL),
  ((SELECT id FROM survey_section WHERE survey_id='dao-tao-check' AND order_idx=1),
   'dt_open2',1,'textarea',
   'Nếu bạn phải đầu tư ngân sách đào tạo vào CHỈ 1 chương trình duy nhất trong 6 tháng tới, bạn sẽ chọn gì? Tại sao?',
   'If you had to invest training budget in ONLY 1 program for the next 6 months, what would you choose? Why?',
   NULL,NULL,NULL);


-- ================================================================
-- === 36: patient-experience-check (experience) =================
-- ================================================================

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('patient-experience-check','patient-experience-check','Patient Experience Check','Patient Experience Check',
'5 câu hỏi giúp bạn đánh giá toàn diện trải nghiệm bệnh nhân — từ khi họ tìm kiếm đến khi rời phòng khám và sau đó.',
'5 questions to comprehensively assess patient experience — from search to departure and beyond.',
'Đánh giá toàn diện trải nghiệm bệnh nhân','Comprehensive patient experience assessment','[]','active',1,'mini',36);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('patient-experience-check',0,'PHẦN 1: ĐÁNH GIÁ TRẢI NGHIỆM','PART 1: EXPERIENCE EVALUATION',
   '5 chiều đánh giá: tiếp cận, chờ đợi, phòng khám, dịch vụ, và sau điều trị.',
   '5 evaluation dimensions: access, wait time, clinic, service, and post-treatment.',
   'Patient Experience','favorite'),
  ('patient-experience-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào trải nghiệm bệnh nhân.',
   'Two open questions to face patient experience honestly.',
   'Patient Experience','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='patient-experience-check' AND order_idx=0),
   'pex_q1',0,'select',
   'Bệnh nhân có thể dễ dàng tiếp cận phòng khám không — đặt lịch, tìm thông tin, liên hệ?',
   'Can patients easily access your clinic — book appointments, find info, contact you?',
   '{"1":"Rất khó: chỉ gọi điện, không có online booking, website không rõ ràng","2":"Khó: có website nhưng thông tin không đầy đủ, khó liên hệ","3":"Trung bình: đặt lịch được nhưng không tiện lợi","4":"Dễ: online booking + website rõ + Zalo/chat responsive","5":"Rất dễ: seamless omni-channel — website, app, Zalo, đều connected"}',
   '{"1":"Very difficult: phone only, no online booking, unclear website","2":"Difficult: website exists but info incomplete, hard to contact","3":"Average: can book but not convenient","4":"Easy: online booking + clear website + responsive Zalo/chat","5":"Very easy: seamless omni-channel — website, app, Zalo, all connected"}',
   'experience'),
  ((SELECT id FROM survey_section WHERE survey_id='patient-experience-check' AND order_idx=0),
   'pex_q2',1,'select',
   'Thời gian chờ đợi của bệnh nhân được quản lý như thế nào?',
   'How is patient wait time managed?',
   '{"1":"Không kiểm soát, bệnh nhân chờ rất lâu thường xuyên","2":"Có cố gắng nhưng không có hệ thống, thỉnh thoảng chờ lâu","3":"Thời gian chờ được theo dõi, có cố gắng giảm thiểu","4":"Thời gian chờ được đo lường + báo trước cho bệnh nhân + có buffer","5":"Wait time dashboard: đo lường realtime + SMS/call trước khi đến + < 10 phút average"}',
   '{"1":"No control, patients wait very long regularly","2":"Some effort but no system, occasionally long waits","3":"Wait time tracked, some effort to minimize","4":"Wait time measured + advance notice to patients + buffer time","5":"Wait time dashboard: realtime tracking + pre-visit SMS/call + < 10 min average"}',
   'experience'),
  ((SELECT id FROM survey_section WHERE survey_id='patient-experience-check' AND order_idx=0),
   'pex_q3',2,'select',
   'Không gian phòng khám tạo ra cảm giác như thế nào cho bệnh nhân — từ khi bước vào đến khi ra về?',
   'What feeling does your clinic space create for patients — from entry to exit?',
   '{"1":"Cảm giác lo lắng, không thoải mái, không gian lạnh lẽo","2":"Bình thường, không có gì đặc biệt, hơi nhàm chán","3":"Khá OK, sạch sẽ nhưng thiếu sự ấm áp","4":"Thoải mái, được chăm sóc, có sự chú ý đến chi tiết","5":"5-star experience: mùi hương, âm thanh, ánh sáng, không gian đều được thiết kế để giảm anxiety"}',
   '{"1":"Anxious feeling, uncomfortable, cold space","2":"Normal, nothing special, slightly boring","3":"Pretty OK, clean but lacking warmth","4":"Comfortable, cared for, attention to detail","5":"5-star experience: scent, sound, lighting, space all designed to reduce anxiety"}',
   'experience'),
  ((SELECT id FROM survey_section WHERE survey_id='patient-experience-check' AND order_idx=0),
   'pex_q4',3,'select',
   'Bệnh nhân được thông báo và giải thích trong quá trình điều trị như thế nào?',
   'How are patients informed and explained to during treatment?',
   '{"1":"Ít hoặc không giải thích, bệnh nhân không biết điều gì đang xảy ra","2":"Có giải thích nhưng kỹ thuật, bệnh nhân khó hiểu","3":"Giải thích cơ bản về procedure, không có visual aids","4":"Giải thích rõ ràng + visual aids + cho bệnh nhân hỏi","5":"Full informed consent experience: explain + show + ask + confirm understanding + written summary"}',
   '{"1":"Little or no explanation, patients don''t know what''s happening","2":"Some explanation but technical, hard for patients to understand","3":"Basic procedure explanation, no visual aids","4":"Clear explanation + visual aids + patient Q&A time","5":"Full informed consent experience: explain + show + ask + confirm understanding + written summary"}',
   'experience'),
  ((SELECT id FROM survey_section WHERE survey_id='patient-experience-check' AND order_idx=0),
   'pex_q5',4,'select',
   'Phòng khám có theo dõi và phản hồi sau điều trị không — follow-up và chăm sóc sau?',
   'Does your clinic track and respond post-treatment — follow-up and aftercare?',
   '{"1":"Không có follow-up, bệnh nhân ra về là xong","2":"Có gọi follow-up nhưng không có hệ thống, phụ thuộc cá nhân","3":"Follow-up phone call sau vài ngày cho một số ca","4":"Systematic follow-up: call/SMS/Zalo + feedback collection + NPS tracking","5":"Full patient lifecycle: pre-visit → during → post-visit → nurture → reactivation"}',
   '{"1":"No follow-up, patients leave and that''s it","2":"Some follow-up calls but no system, depends on individuals","3":"Follow-up call after a few days for some cases","4":"Systematic follow-up: call/SMS/Zalo + feedback collection + NPS tracking","5":"Full patient lifecycle: pre-visit → during → post-visit → nurture → reactivation"}',
   'experience'),
  ((SELECT id FROM survey_section WHERE survey_id='patient-experience-check' AND order_idx=1),
   'pex_open1',0,'textarea',
   'Bệnh nhân thường phàn nàn hoặc khen ngợi điều gì nhiều nhất? Điều đó nói gì về trải nghiệm tổng thể?',
   'What do patients most complain about or praise? What does that say about the overall experience?',
   NULL,NULL,NULL),
  ((SELECT id FROM survey_section WHERE survey_id='patient-experience-check' AND order_idx=1),
   'pex_open2',1,'textarea',
   'Nếu bạn là bệnh nhân đến phòng khám của chính mình — điều gì sẽ khiến bạn ngạc nhiên (tích cực) và điều gì sẽ khiến bạn thất vọng?',
   'If you were a patient visiting your own clinic — what would pleasantly surprise you and what would disappoint you?',
   NULL,NULL,NULL);


-- ================================================================
-- === 37: crm-check (crm) ======================================
-- ================================================================

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('crm-check','crm-check','CRM Check','CRM Check',
'5 câu hỏi giúp bạn đánh giá hệ thống quản lý quan hệ bệnh nhân — từ data collection đến nurture và reactivation.',
'5 questions to assess your patient relationship management system — from data collection to nurture and reactivation.',
'Đánh giá hệ thống quản lý quan hệ bệnh nhân','Patient relationship management assessment','[]','active',1,'mini',37);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('crm-check',0,'PHẦN 1: ĐÁNH GIÁ CRM','PART 1: CRM EVALUATION',
   '5 chiều đánh giá: data, segmentation, communication, automation, và analytics.',
   '5 evaluation dimensions: data, segmentation, communication, automation, and analytics.',
   'CRM','contacts'),
  ('crm-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào CRM.',
   'Two open questions to face CRM honestly.',
   'CRM','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='crm-check' AND order_idx=0),
   'crm_q1',0,'select',
   'Phòng khám lưu trữ và sử dụng dữ liệu bệnh nhân như thế nào?',
   'How does your clinic store and use patient data?',
   '{"1":"Giấy hoặc không có hệ thống, dữ liệu rời rạc","2":"Excel hoặc phần mềm cơ bản, không có systematics","3":"Phần mềm quản lý phòng khám, có lưu hồ sơ bệnh nhân","4":"CRM system: lưu profile đầy đủ + lịch sử điều trị + preferences","5":"Full CRM: unified patient profile + treatment history + preferences + communication history + predictive data"}',
   '{"1":"Paper or no system, scattered data","2":"Excel or basic software, not systematic","3":"Clinic management software, patient records stored","4":"CRM system: complete profile + treatment history + preferences","5":"Full CRM: unified patient profile + treatment + preferences + communication + predictive data"}',
   'crm'),
  ((SELECT id FROM survey_section WHERE survey_id='crm-check' AND order_idx=0),
   'crm_q2',1,'select',
   'Phòng khám có phân loại và nhóm bệnh nhân theo nhu cầu, giá trị không?',
   'Does your clinic segment and group patients by needs and value?',
   '{"1":"Không phân loại, mọi bệnh nhân như nhau","2":"Phân loại cơ bản: mới/cũ, theo loại điều trị","3":"Có segmentation theo giá trị (VIP, regular, occasional)","4":"Multi-dimensional segmentation: theo giá trị + loại điều trị + lifecycle stage + preferences","5":"Predictive segmentation: AI-powered patient value prediction + churn risk scoring"}',
   '{"1":"No segmentation, all patients treated the same","2":"Basic segmentation: new/existing, by treatment type","3":"Value-based segmentation (VIP, regular, occasional)","4":"Multi-dimensional: value + treatment type + lifecycle stage + preferences","5":"Predictive segmentation: AI-powered patient value + churn risk scoring"}',
   'crm'),
  ((SELECT id FROM survey_section WHERE survey_id='crm-check' AND order_idx=0),
   'crm_q3',2,'select',
   'Phòng khám giao tiếp với bệnh nhân cũ như thế nào — reminders, newsletters, promotions?',
   'How does your clinic communicate with existing patients — reminders, newsletters, promotions?',
   '{"1":"Không giao tiếp gì sau khi bệnh nhân ra về","2":"Chỉ liên lạc khi có dịp (sinh nhật, khuyến mãi ad-hoc)","3":"Gửi reminders cho lịch hẹn tiếp theo thường xuyên","4":"Nurture campaigns: birthday + recall reminders + health tips + promotions có chiến lược","5":"Full communication engine: personalized messages + multi-channel + triggered by patient behavior + feedback loop"}',
   '{"1":"Zero communication after patient leaves","2":"Only contact on special occasions (birthdays, ad-hoc promotions)","3":"Regular next-appointment reminders","4":"Nurture campaigns: birthday + recall + health tips + strategic promotions","5":"Full communication engine: personalized + multi-channel + behavior-triggered + feedback loop"}',
   'crm'),
  ((SELECT id FROM survey_section WHERE survey_id='crm-check' AND order_idx=0),
   'crm_q4',3,'select',
   'Phòng khám có chương trình "recall" — nhắc bệnh nhân quay lại sau khi điều trị xong không?',
   'Does your clinic have a "recall" program — reminding patients to return after treatment?',
   '{"1":"Không có recall, bệnh nhân tự quay lại khi cần","2":"Nhắc nhở ad-hoc, không có hệ thống","3":"Recall cơ bản cho một số loại điều trị (scale, check-up)","4":"Automated recall: theo treatment type + timeline + multi-channel (SMS, Zalo, email)","5":"Smart recall: treatment-specific timelines + personalized messaging + conversion tracking + reactivation campaigns"}',
   '{"1":"No recall, patients return on their own when needed","2":"Ad-hoc reminders, no system","3":"Basic recall for some treatments (scale, check-up)","4":"Automated recall: by treatment type + timeline + multi-channel","5":"Smart recall: treatment-specific + personalized + conversion tracking + reactivation"}',
   'crm'),
  ((SELECT id FROM survey_section WHERE survey_id='crm-check' AND order_idx=0),
   'crm_q5',4,'select',
   'Phòng khám đo lường và phân tích hiệu quả CRM không — biết cái gì hoạt động và cái gì không?',
   'Does your clinic measure and analyze CRM effectiveness — knowing what works and what doesn''t?',
   '{"1":"Không đo lường, không biết CRM có hiệu quả không","2":"Cảm nhận chủ quan về retention rate","3":"Theo dõi số lượng bệnh nhân quay lại","4":"Đo lường: retention rate + recall conversion + campaign ROI + NPS","5":"Full CRM analytics: funnel metrics + cohort analysis + campaign attribution + predictive modeling"}',
   '{"1":"Not measured, no idea if CRM is effective","2":"Subjective feelings about retention rate","3":"Track number of returning patients","4":"Metrics: retention rate + recall conversion + campaign ROI + NPS","5":"Full CRM analytics: funnel metrics + cohort analysis + campaign attribution + predictive modeling"}',
   'crm'),
  ((SELECT id FROM survey_section WHERE survey_id='crm-check' AND order_idx=1),
   'crm_open1',0,'textarea',
   'Bạn ước lượng bao nhiêu phần trăm bệnh nhân đến 1 lần rồi không bao giờ quay lại? Lý do chính là gì?',
   'What percentage of patients do you estimate come once and never return? What are the main reasons?',
   NULL,NULL,NULL),
  ((SELECT id FROM survey_section WHERE survey_id='crm-check' AND order_idx=1),
   'crm_open2',1,'textarea',
   'Nếu bạn có thể chọn 1 metric CRM duy nhất để theo dõi (thay vì nhiều), bạn sẽ chọn cái nào? Tại sao?',
   'If you could choose only 1 CRM metric to track (instead of many), which would you choose? Why?',
   NULL,NULL,NULL);


-- ================================================================
-- === 38: roadmap-check (roadmap) ===============================
-- ================================================================

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('roadmap-check','roadmap-check','Roadmap Check','Roadmap Check',
'5 câu hỏi giúp bạn đánh giá tầm nhìn và lộ trình phát triển phòng khám — từ short-term goals đến long-term vision.',
'5 questions to assess your clinic''s vision and development roadmap — from short-term goals to long-term vision.',
'Đánh giá tầm nhìn và lộ trình phát triển','Vision and roadmap assessment','[]','active',1,'mini',38);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('roadmap-check',0,'PHẦN 1: ĐÁNH GIÁ TẦM NHÌN & LỘ TRÌNH','PART 1: VISION & ROADMAP EVALUATION',
   '5 chiều đánh giá: tầm nhìn, mục tiêu, kế hoạch, alignment, và đo lường.',
   '5 evaluation dimensions: vision, goals, planning, alignment, and measurement.',
   'Roadmap','map'),
  ('roadmap-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào tầm nhìn và lộ trình.',
   'Two open questions to face vision and roadmap honestly.',
   'Roadmap','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='roadmap-check' AND order_idx=0),
   'rm_q1',0,'select',
   'Bạn có tầm nhìn rõ ràng cho phòng khám trong 3-5 năm tới không — "Phòng khám sẽ ở đâu, làm gì, cho ai"?',
   'Do you have a clear vision for your clinic in 3-5 years — "Where will it be, what will it do, for whom"?',
   '{"1":"Không có tầm nhìn rõ ràng, chỉ sống qua ngày","2":"Có suy nghĩ nhưng không viết ra, mơ hồ","3":"Có tầm nhìn chung nhưng không cụ thể","4":"Tầm nhìn rõ ràng, có mô tả bằng văn bản","5":"Tầm nhìn rõ ràng + chia sẻ với đội ngũ + tích hợp vào mọi quyết định"}',
   '{"1":"No clear vision, just living day to day","2":"Some thoughts but not written down, vague","3":"General vision exists but not specific","4":"Clear vision, described in writing","5":"Clear vision + shared with team + integrated into every decision"}',
   'roadmap'),
  ((SELECT id FROM survey_section WHERE survey_id='roadmap-check' AND order_idx=0),
   'rm_q2',1,'select',
   'Phòng khám có kế hoạch ngắn hạn (3-12 tháng) và dài hạn (1-5 năm) rõ ràng không?',
   'Does your clinic have clear short-term (3-12 months) and long-term (1-5 years) plans?',
   '{"1":"Không có kế hoạch, quyết định ad-hoc","2":"Có suy nghĩ về tương lai nhưng không có kế hoạch cụ thể","3":"Có kế hoạch ngắn hạn, không có dài hạn","4":"Có cả kế hoạch ngắn và dài hạn, được review định kỳ","5":"Kế hoạch sống: ngắn hạn → dài hạn + quarterly review + annual strategic planning"}',
   '{"1":"No plan, ad-hoc decisions","2":"Some thoughts about the future but no concrete plan","3":"Short-term plan exists, no long-term","4":"Both short and long-term plans, reviewed regularly","5":"Living plan: short-term → long-term + quarterly review + annual strategic planning"}',
   'roadmap'),
  ((SELECT id FROM survey_section WHERE survey_id='roadmap-check' AND order_idx=0),
   'rm_q3',2,'select',
   'Kế hoạch phòng khám có được chia sẻ và align với toàn đội ngũ không?',
   'Is the clinic plan shared and aligned with the entire team?',
   '{"1":"Không chia sẻ, chỉ mình tôi biết","2":"Chia sẻ với quản lý/lead nhưng không với nhân viên","3":"Được chia sẻ một phần khi cần thiết","4":"Toàn đội ngũ biết kế hoạch, mỗi người có OKR riêng","5":"Full alignment: vision → strategy → team OKRs → individual goals"}',
   '{"1":"Not shared, only I know","2":"Shared with managers/leads but not staff","3":"Partially shared when necessary","4":"Entire team knows the plan, each person has their own OKRs","5":"Full alignment: vision → strategy → team OKRs → individual goals"}',
   'roadmap'),
  ((SELECT id FROM survey_section WHERE survey_id='roadmap-check' AND order_idx=0),
   'rm_q4',3,'select',
   'Phòng khám có roadmap cụ thể cho việc phát triển — mở rộng quy mô, chuyên môn hóa, hay tối ưu hóa?',
   'Does your clinic have a specific growth roadmap — scale up, specialize, or optimize?',
   '{"1":"Không có định hướng phát triển rõ ràng","2":"Muốn phát triển nhưng không có kế hoạch cụ thể","3":"Có hướng chung (ví dụ: "mở thêm chi nhánh") nhưng không chi tiết","4":"Roadmap cụ thể: WHAT + WHEN + HOW + RESOURCES","5":"Strategic growth plan: 3 scenarios (conservative, moderate, aggressive) + milestone tracking"}',
   '{"1":"No clear development direction","2":"Want to grow but no concrete plan","3":"General direction (e.g. "open another branch") but not detailed","4":"Specific roadmap: WHAT + WHEN + HOW + RESOURCES","5":"Strategic growth plan: 3 scenarios + milestone tracking"}',
   'roadmap'),
  ((SELECT id FROM survey_section WHERE survey_id='roadmap-check' AND order_idx=0),
   'rm_q5',4,'select',
   'Kế hoạch phòng khám được theo dõi và điều chỉnh như thế nào khi có thay đổi?',
   'How is the clinic plan tracked and adjusted when things change?',
   '{"1":"Kế hoạch đặt ra rồi bỏ đó, không bao giờ theo dõi","2":"Thỉnh thoảng check nhưng không có quy trình điều chỉnh","3":"Review hàng quý nhưng không điều chỉnh khi có thay đổi lớn","4":"Có KPI tracking cho kế hoạch + quarterly strategic review","5":"Adaptive planning: quarterly review + pivot when needed + contingency plans + early warning indicators"}',
   '{"1":"Plan made then forgotten, never tracked","2":"Occasionally checked but no adjustment process","3":"Quarterly review but no adjustment for major changes","4":"KPI tracking for plan + quarterly strategic review","5":"Adaptive planning: quarterly review + pivot when needed + contingency plans + early warning indicators"}',
   'roadmap'),
  ((SELECT id FROM survey_section WHERE survey_id='roadmap-check' AND order_idx=1),
   'rm_open1',0,'textarea',
   'Mô tả "phòng khám lý tưởng" của bạn trong 3 năm tới — bạn hình dung nó như thế nào? Đâu là điều quan trọng nhất?',
   'Describe your "ideal clinic" in 3 years — how do you envision it? What is most important?',
   NULL,NULL,NULL),
  ((SELECT id FROM survey_section WHERE survey_id='roadmap-check' AND order_idx=1),
   'rm_open2',1,'textarea',
   'Đâu là "rào cản lớn nhất" ngăn bạn đạt được tầm nhìn đó? Tại sao rào cản đó vẫn tồn tại?',
   'What is the BIGGEST barrier preventing you from achieving that vision? Why does it still exist?',
   NULL,NULL,NULL);


-- ================================================================
-- === 39: total-os-diagnostic (5 dimensions) ===================
-- ================================================================

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('total-os-diagnostic','total-os-diagnostic','Total OS Diagnostic','Total OS Diagnostic',
'Chẩn đoán toàn diện 5 chiều hệ thống: Hệ thống, Nhân sự, Quy trình, Tài chính, Marketing. Kết quả là bức tranh toàn cảnh OS phòng khám của bạn.',
'Comprehensive 5-dimension system diagnostic: Systems, People, Processes, Finance, Marketing. The result is a complete picture of your clinic''s OS.',
'Chẩn đoán toàn diện hệ thống phòng khám','Comprehensive clinic system diagnostic','[]','active',1,'mini',39);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('total-os-diagnostic',0,'PHẦN 1: ĐÁNH GIÁ 5 CHIỀU OS','PART 1: 5-DIMENSION OS EVALUATION',
   '10 câu hỏi đánh giá 5 chiều cốt lõi của hệ thống phòng khám.',
   '10 questions assessing 5 core dimensions of clinic systems.',
   'OS Diagnostic','radar'),
  ('total-os-diagnostic',1,'PHẦN 2: TỰ SOI CHIẾU TOÀN DIỆN','PART 2: COMPREHENSIVE SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn toàn cảnh OS phòng khám.',
   'Two open questions for a complete OS picture.',
   'OS Diagnostic','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=0),
   'tos_sys_q1',0,'select',
   'Phòng khám đã có quy trình vận hành được viết ra (SOP) cho các hoạt động chính chưa?',
   'Has your clinic written SOPs for its main operations?',
   '{"1":"Chưa có gì","2":"Vài quy trình trong đầu","3":"Có viết nhưng ít ai dùng","4":"Mọi người đều biết và dùng","5":"SOP sống, liên tục cập nhật"}',
   '{"1":"Nothing yet","2":"Some in heads","3":"Written but rarely used","4":"Everyone knows and uses","5":"Living SOPs, continuously updated"}',
   'systems'),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=0),
   'tos_sys_q2',1,'select',
   'Khi một nhân sự nghỉ đột ngột, phòng khám có thể tiếp tục vận hành bình thường trong bao lâu?',
   'When a staff member leaves abruptly, how long can the clinic keep operating normally?',
   '{"1":"Ngay lập tức khủng hoảng","2":"1-2 tuần lộn xộn","3":"1 tháng","4":"1-3 tháng","5":"Trên 3 tháng — hệ thống tự vận hành"}',
   '{"1":"Immediate crisis","2":"1-2 weeks chaos","3":"1 month","4":"1-3 months","5":"Over 3 months — system runs itself"}',
   'systems'),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=0),
   'tos_ppl_q1',2,'select',
   'Phòng khám có quy trình tuyển dụng, onboarding, đào tạo, và giữ chân nhân sự không?',
   'Does your clinic have hiring, onboarding, training, and retention processes?',
   '{"1":"Không có quy trình cụ thể","2":"Có nhưng ad-hoc","3":"Có quy trình cơ bản","4":"Quy trình đầy đủ và được theo dõi","5":"Full L&D system + retention strategy"}',
   '{"1":"No specific processes","2":"Some but ad-hoc","3":"Basic processes exist","4":"Complete processes and tracked","5":"Full L&D system + retention strategy"}',
   'people'),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=0),
   'tos_ppl_q2',3,'select',
   'Tỷ lệ nhân sự nghỉ việc trong 12 tháng qua là bao nhiêu?',
   'What is your staff turnover rate in the past 12 months?',
   '{"1":"Trên 50%","2":"30-50%","3":"15-30%","4":"5-15%","5":"Dưới 5%"}',
   '{"1":"Over 50%","2":"30-50%","3":"15-30%","4":"5-15%","5":"Under 5%"}',
   'people'),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=0),
   'tos_pro_q1',4,'select',
   'Quy trình từ khi bệnh nhân gọi đặt lịch đến khi ra về sau điều trị được thiết kế tốt không?',
   'Is the process from patient call to post-treatment departure well designed?',
   '{"1":"Mỗi lần một kiểu","2":"Có SOP nhưng không nhất quán","3":"Có SOP, đa số nhất quán","4":"SOP rõ ràng + đo lường + cải tiến","5":"Seamless patient journey, mọi step optimized"}',
   '{"1":"Different every time","2":"SOP exists but inconsistent","3":"SOP exists, mostly consistent","4":"Clear SOP + measured + improved","5":"Seamless patient journey, every step optimized"}',
   'processes'),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=0),
   'tos_pro_q2',5,'select',
   'Các quy trình quan trọng có được đo lường hiệu quả và cải tiến định kỳ không?',
   'Are key processes measured for effectiveness and improved periodically?',
   '{"1":"Không đo, không cải tiến","2":"Có cảm nhận nhưng không đo","3":"Có đo nhưng không phân tích","4":"Đo lường + họp review định kỳ","5":"Đo + review + cải tiến liên tục (PDCA)"}',
   '{"1":"No measurement, no improvement","2":"Feelings but no measurement","3":"Measured but not analyzed","4":"Measured + periodic review meetings","5":"Measure + review + continuous improvement (PDCA)"}',
   'processes'),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=0),
   'tos_fin_q1',6,'select',
   'Bạn biết chính xác doanh thu, chi phí, và lợi nhuận hàng tháng của phòng khám không?',
   'Do you know the exact monthly revenue, costs, and profit of your clinic?',
   '{"1":"Không biết, không theo dõi","2":"Có con số chung nhưng không chi tiết","3":"Biết tổng doanh thu, không biết chi phí chi tiết","4":"Biết chi tiết: doanh thu, chi phí, lợi nhuận theo dịch vụ","5":"Full financial dashboard + P&L by service line"}',
   '{"1":"Don''t know, no tracking","2":"Rough numbers, not detailed","3":"Know revenue, not detailed costs","4":"Know: revenue, costs, profit by service","5":"Full financial dashboard + P&L by service line"}',
   'finance'),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=0),
   'tos_fin_q2',7,'select',
   'Phòng khám có ngân sách và kế hoạch tài chính cho 12 tháng tới không?',
   'Does your clinic have a budget and financial plan for the next 12 months?',
   '{"1":"Không có ngân sách, sống qua tháng","2":"Có dự kiến lỏng lẻo","3":"Có ngân sách hàng năm cơ bản","4":"Ngân sách chi tiết + quarterly review","5":"Full financial planning: budget + cash flow + scenario planning"}',
   '{"1":"No budget, living month to month","2":"Loose estimates","3":"Basic annual budget","4":"Detailed budget + quarterly review","5":"Full financial planning: budget + cash flow + scenario planning"}',
   'finance'),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=0),
   'tos_mkt_q1',8,'select',
   'Phòng khám có chiến lược marketing rõ ràng — biết đối tượng mục tiêu, kênh ưu tiên, và content plan không?',
   'Does your clinic have a clear marketing strategy — target audience, priority channels, and content plan?',
   '{"1":"Không có chiến lược, làm ad-hoc","2":"Có một số hoạt động nhưng không có chiến lược","3":"Có chiến lược chung nhưng không chi tiết","4":"Có chiến lược + content plan + channel prioritization","5":"Full marketing strategy: ICP + journey + attribution"}',
   '{"1":"No strategy, ad-hoc activities","2":"Some activities but no strategy","3":"General strategy but not detailed","4":"Strategy + content plan + channel prioritization","5":"Full marketing strategy: ICP + journey + attribution"}',
   'marketing'),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=0),
   'tos_mkt_q2',9,'select',
   'Phòng khám có biết chi phí acquisition per bệnh nhân và lifetime value không?',
   'Does your clinic know the cost per patient acquisition and lifetime value?',
   '{"1":"Không biết, không theo dõi","2":"Có ước lượng chung","3":"Biết chi phí acquisition","4":"Biết cả acquisition cost và LTV","5":"Full funnel analytics: CAC, LTV, ROI by channel"}',
   '{"1":"Don''t know, no tracking","2":"Rough estimates","3":"Know acquisition cost","4":"Know both acquisition cost and LTV","5":"Full funnel analytics: CAC, LTV, ROI by channel"}',
   'marketing'),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=1),
   'tos_open1',0,'textarea',
   'Nếu bạn phải chọn 1 chiều DUY NHẤT để cải thiện ngay lập tức — chiều nào sẽ tạo ra compound effect lớn nhất cho toàn bộ OS?',
   'If you had to choose only 1 dimension to improve immediately — which would create the biggest compound effect for the entire OS?',
   NULL,NULL,NULL),
  ((SELECT id FROM survey_section WHERE survey_id='total-os-diagnostic' AND order_idx=1),
   'tos_open2',1,'textarea',
   'Mô tả "điểm nghẽn" hiện tại lớn nhất của phòng khám — cái gì ngăn cản bạn phát triển dù đã cố gắng?',
   'Describe the biggest current bottleneck — what prevents growth despite your efforts?',
   NULL,NULL,NULL);
