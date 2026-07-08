-- Seed: 10 scanners batch 3+4 (orders 23-32) using subqueries (SQLite/D1 compatible)

-- === 23: marketing-content-check (content) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('marketing-content-check','marketing-content-check','Marketing Content Check','Marketing Content Check',
'Content là chỉ số cuối cùng nhưng cũng quan trọng nhất trong marketing. Không có content tốt, các kênh khác đều thất bại. Kiểm tra chất lượng content của phòng khám.',
'Content is the last but most important metric in marketing. Without good content, all other channels fail. Check your clinic content quality.',
'Đánh giá chất lượng content marketing','Assess marketing content quality','["Ch.BRAND"]','active',1,'mini',23);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('marketing-content-check',0,'PHẦN 1: ĐÁNH GIÁ CONTENT','PART 1: CONTENT EVALUATION',
   '5 chiều đánh giá: plan, quality, consistency, SEO, và engagement.',
   '5 evaluation dimensions: plan, quality, consistency, SEO, and engagement.',
   'Content Marketing','edit_note'),
  ('marketing-content-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào content.',
   'Two open questions to look deeply into your content.',
   'Content Marketing','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=0),
   'mc_q1',0,'select',
   'Phòng khám có content plan — lịch đăng bài, chủ đề rõ ràng, và target audience được định nghĩa — không?',
   'Does your clinic have a content plan - posting schedule, clear topics, and defined target audience?',
   '{"1":"Không có content plan, đăng bài tùy ý","2":"Có đăng bài nhưng không có lịch cụ thể","3":"Có lịch đăng bài nhưng chưa có target audience rõ ràng","4":"Có content calendar và target audience được định nghĩa","5":"Content strategy đầy đủ: calendar + audience + topics + SEO strategy"}',
   '{"1":"No content plan, posting randomly","2":"Have posts but no specific schedule","3":"Have posting schedule but target audience not clearly defined","4":"Content calendar with defined target audience","5":"Comprehensive content strategy: calendar + audience + topics + SEO strategy"}',
   'content'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=0),
   'mc_q2',1,'select',
   'Chất lượng content — hình ảnh, video, văn bản — của phòng khám như thế nào?',
   'How is the quality of your content - photos, videos, text - at your clinic?',
   '{"1":"Chỉ có hình ảnh đơn giản, không có video, nội dung yếu","2":"Có hình ảnh tốt nhưng ít video và nội dung chưa chỉnh chu","3":"Có hình ảnh và video chất lượng trung bình","4":"Content chất lượng tốt: hình ảnh đẹp, video hữu ích, văn bản rõ ràng","5":"Content xuất sắc: production quality cao, video storytelling, patient education content"}',
   '{"1":"Only simple photos, no videos, weak content","2":"Good photos but few videos and not polished content","3":"Average quality photos and videos","4":"Good quality content: nice photos, useful videos, clear text","5":"Excellent content: high production quality, storytelling videos, patient education content"}',
   'content'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=0),
   'mc_q3',2,'select',
   'Phòng khám có đăng content đều đặn trên nhiều kênh — website, Facebook, TikTok, YouTube — không?',
   'Does your clinic distribute content evenly across channels - website, Facebook, TikTok, YouTube?',
   '{"1":"Không có kênh nào được chăm sóc tốt","2":"Chỉ có Facebook, các kênh khác bỏ hoặc thật người theo dõi","3":"Có 1-2 kênh hoạt động nhưng không có strategy","4":"Multi-channel presence với content adapted cho từng kênh","5":"Omni-channel content strategy: adapted content + optimal posting time + cross-promotion"}',
   '{"1":"No channel is well maintained","2":"Only Facebook, other channels abandoned or unfollowed","3":"Have 1-2 active channels but no strategy","4":"Multi-channel presence with content adapted per channel","5":"Omni-channel content strategy: adapted content + optimal posting time + cross-promotion"}',
   'content'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=0),
   'mc_q4',3,'select',
   'Content của phòng khám có được tối ưu SEO và tìm kiếm được trên Google không?',
   'Is your content SEO-optimized and searchable on Google?',
   '{"1":"Không có content trên website hoặc blog","2":"Có blog nhưng không tối ưu SEO","3":"Có một số bài SEO nhưng chưa có system","4":"SEO content strategy: keyword research + on-page SEO + regular posting","5":"Comprehensive SEO: keyword strategy + technical SEO + local SEO + content hub + backlinks"}',
   '{"1":"No content on website or blog","2":"Have blog but not SEO-optimized","3":"Have some SEO articles but no system","4":"SEO content strategy: keyword research + on-page SEO + regular posting","5":"Comprehensive SEO: keyword strategy + technical SEO + local SEO + content hub + backlinks"}',
   'content'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=0),
   'mc_q5',4,'select',
   'Content có tạo engagement — like, comment, share, tin nhắn — từ bệnh nhân không?',
   'Does your content generate engagement - likes, comments, shares, messages - from patients?',
   '{"1":"Ít engagement, bệnh nhân hời tương tác ít","2":"Có một số tương tác nhưng không có chỉ số theo dõi","3":"Engagement trung bình, chưa có hàm mượt tăng trưởng","4":"Engagement tốt: comment nhiều, DM requests, shares","5":"High engagement: active community + UGC + patient stories + poll/interaction + conversion tracking"}',
   '{"1":"Low engagement, patients rarely interact","2":"Some interactions but no metrics to track","3":"Average engagement, no growth momentum","4":"Good engagement: lots of comments, DM requests, shares","5":"High engagement: active community + UGC + patient stories + poll/interaction + conversion tracking"}',
   'content');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=1),
   'mc_open1',0,'textarea',
   'Nội dung nào của phòng khám được bệnh nhân yêu thích nhất? Tại sao?',
   'What content from your clinic do patients like most? Why?',
   'Nghĩ về những bài post, video, hay content mà bệnh nhân thường xuyên phản hồi tích cực.',
   'Think about posts, videos, or content that patients frequently give positive feedback on.'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=1),
   'mc_open2',1,'textarea',
   'Bạn gặp khó khăn gì khi tạo content? Điều gì ngăn cản bạn?',
   'What difficulties do you face when creating content? What is holding you back?',
   'Nghĩ về các rào cản: thời gian, kỹ năng, ý tưởng, hay nhân lực.',
   'Think about barriers: time, skills, ideas, or manpower.');

-- === 24: loi-nhu-quan-check (business) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('loi-nhu-quan-check','loi-nhu-quan-check','Loi Nhu Quan Check','Business Mindset Check',
'Nhiều bác sĩ giỏi nhưng phòng khám không phát triển vì thiếu mindset kinh doanh. Kiểm tra cách bạn quản lý phòng khám như một doanh nghiệp.',
'Many good doctors but clinics that do not grow because of a lack of business mindset. Check how you manage your clinic as a business.',
'Đánh giá mindset kinh doanh của chủ phòng khám','Assess the business mindset of clinic owners','["Ch.STARTUP"]','active',1,'mini',24);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('loi-nhu-quan-check',0,'PHẦN 1: ĐÁNH GIÁ BUSINESS MINDSET','PART 1: BUSINESS MINDSET EVALUATION',
   '5 chiều đánh giá: tài chính, chiến lược, marketing, nhân sự, và hệ thống.',
   '5 evaluation dimensions: finance, strategy, marketing, people, and systems.',
   'Business Mindset','trending_up'),
  ('loi-nhu-quan-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào mindset kinh doanh.',
   'Two open questions to look deeply into your business mindset.',
   'Business Mindset','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=0),'ln_q1',0,'select',
   'Bạn biết chính xác doanh thu, chi phí, và lợi nhuận hàng tháng của phòng khám không?',
   'Do you know exactly your monthly revenue, costs, and profit?',
   '{"1":"Không theo dõi tài chính, không biết lỗi là tháng nào","2":"Biết tổng thể nhưng không có số liệu cụ thể","3":"Theo dõi doanh thu nhưng chưa rõ chi phí và lợi nhuận","4":"Có báo cáo tài chính hàng tháng, biết P&L","5":"Hệ thống tài chính minh bạch: doanh thu, chi phí, lợi nhuận, và xu hướng"}',
   '{"1":"Not tracking finances, do not know profit/loss","2":"Know overall but no specific numbers","3":"Tracking revenue but unclear on costs and profit","4":"Monthly financial reports, know P&L","5":"Transparent financial system: revenue, costs, profit, and trends"}','business'),
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=0),'ln_q2',1,'select',
   'Phòng khám có kế hoạch phát triển rõ ràng cho 1-3 năm tới không?',
   'Does your clinic have a clear development plan for the next 1-3 years?',
   '{"1":"Không có kế hoạch, sống ngày nào hay ngày đó","2":"Có mục tiêu chung nhưng không có kế hoạch cụ thể","3":"Có kế hoạch sơ lược nhưng không theo dõi tiến độ","4":"Có kế hoạch chi tiết với KPI và milestone","5":"Kế hoạch chiến lược rõ ràng: vision, 1-3 năm, quarterly OKR"}',
   '{"1":"No plan, living day to day","2":"Have general goals but no specific plan","3":"Have outline plan but not tracking progress","4":"Detailed plan with KPIs and milestones","5":"Clear strategic plan: vision, 1-3 years, quarterly OKRs"}','business'),
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=0),'ln_q3',2,'select',
   'Bạn dành bao nhiêu thời gian cho việc quản lý kinh doanh (thay vì chỉ làm việc lâm sàng)?',
   'How much time do you spend on business management (instead of just clinical work)?',
   '{"1":"Gần như 100% thời gian cho lâm sàng, không có thời gian kinh doanh","2":"Ít thời gian cho kinh doanh, chủ yếu giải quyết vấn đề tức thì","3":"Khoảng 10-20% thời gian cho quản lý","4":"20-30% thời gian cho kinh doanh và phát triển","5":"Có thời gian cố định hàng tuần cho chiến lược, tài chính, và phát triển"}',
   '{"1":"Nearly 100% clinical time, no time for business","2":"Little business time, mostly firefighting","3":"About 10-20% time for management","4":"20-30% time for business and development","5":"Fixed weekly time for strategy, finance, and development"}','business'),
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=0),'ln_q4',3,'select',
   'Phòng khám có hệ thống để thu hút và giữ chân bệnh nhân không?',
   'Does your clinic have systems to attract and retain patients?',
   '{"1":"Không có hệ thống, phụ thuộc vào khách cũ giới thiệu","2":"Có một số nỗ lực marketing nhưng không có hệ thống","3":"Có chiến lược thu hút bệnh nhân nhưng chưa chặt chẽ","4":"Có hệ thống: marketing + referral + retention + follow-up","5":"Hệ thống toàn diện: acquisition + experience + loyalty + recovery"}',
   '{"1":"No systems, relying on word of mouth","2":"Some marketing efforts but no system","3":"Patient attraction strategy but not rigorous","4":"Systems in place: marketing + referral + retention + follow-up","5":"Comprehensive system: acquisition + experience + loyalty + recovery"}','business'),
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=0),'ln_q5',4,'select',
   'Bạn có đầu tư vào việc học hỏi kinh doanh và phát triển bản thân với tư cách chủ doanh nghiệp không?',
   'Do you invest in learning business and developing yourself as a business owner?',
   '{"1":"Không đầu tư thời gian hoặc tiền bạc vào việc học kinh doanh","2":"Thỉnh thoảng đọc bài viết nhưng không có hệ thống","3":"Tham gia một vài khóa học hoặc cộng đồng","4":"Đầu tư đều đặn: sách, khóa học, cộng đồng doanh nhân","5":"Học tập liên tục với hệ thống: mentorship, coaching, mastermind group"}',
   '{"1":"Not investing time or money in learning business","2":"Occasionally reading articles but no system","3":"Participating in some courses or communities","4":"Regular investment: books, courses, entrepreneur communities","5":"Continuous learning with system: mentorship, coaching, mastermind group"}','business');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=1),'ln_open1',0,'textarea',
   'Bạn tự nhận mình là một người làm kinh doanh hay một người làm nghề? Điều gì khiến bạn nghĩ như vậy?',
   'Do you see yourself as a business person or a practitioner? What makes you think so?',
   'Nghĩ về cách bạn nhìn nhận công việc của mình — là một nghề nghiệp hay một doanh nghiệp, hay cả hai?',
   'Think about how you view your work - as a profession or a business, or both?'),
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=1),'ln_open2',1,'textarea',
   'Nếu phòng khám của bạn phải tự trả tiền thuê, tiền lương, và chi phí — không có lương bác sĩ — thì nó có lời không?',
   'If your clinic had to pay its own rent, salaries, and expenses - no doctor salary - would it be profitable?',
   'Thử tính toán đơn giản: tổng thu nhập từ bệnh nhân trừ tất cả chi phí vận hành. Kết quả là gì?',
   'Try a simple calculation: total patient income minus all operating costs. What is the result?');

-- === 25: hieu-qua-check (efficiency) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('hieu-qua-check','hieu-qua-check','Hieu Qua Check','Efficiency Check',
'Một phòng khám có 24 giờ như nhau nhưng hiệu quả khác nhau. Kiểm tra mức độ hiệu quả vận hành của phòng khám bạn.',
'Every clinic has the same 24 hours but different efficiency. Check your clinic operational efficiency level.',
'Đánh giá hiệu quả vận hành phòng khám','Assess your clinic operational efficiency','["Ch.SYSTEM"]','active',1,'mini',25);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('hieu-qua-check',0,'PHẦN 1: ĐÁNH GIÁ HIỆU QUẢ','PART 1: EFFICIENCY EVALUATION',
   '5 chiều đánh giá: thời gian, quy trình, nhân sự, công nghệ, và chi phí.',
   '5 evaluation dimensions: time, processes, people, technology, and cost.',
   'Hieu qua - Efficiency','speed'),
  ('hieu-qua-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào hiệu quả vận hành.',
   'Two open questions to look deeply into operational efficiency.',
   'Hieu qua - Efficiency','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=0),'hq_q1',0,'select',
   'Thời gian trung bình một bệnh nhân ngồi chờ sau khi đến đúng giờ hẹn là bao lâu?',
   'What is the average wait time for a patient who arrives on time for their appointment?',
   '{"1":"Hơn 45 phút thường xuyên","2":"30-45 phút thường xuyên","3":"15-30 phút thỉnh thoảng","4":"Dưới 15 phút thường xuyên","5":"Đúng giờ hoặc dưới 10 phút, có hệ thống lên lịch thông minh"}',
   '{"1":"Over 45 minutes regularly","2":"30-45 minutes regularly","3":"15-30 minutes occasionally","4":"Under 15 minutes regularly","5":"On time or under 10 minutes, with smart scheduling system"}','efficiency'),
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=0),'hq_q2',1,'select',
   'Quy trình từ khi bệnh nhân gọi đặt lịch đến khi ra về sau điều trị được thiết kế tốt không?',
   'Is the process from patient call to post-treatment departure well designed?',
   '{"1":"Không có quy trình chuẩn, mỗi người làm một kiểu","2":"Có quy trình nhưng không được viết ra và không nhất quán","3":"Có quy trình cơ bản được viết ra nhưng chưa được tối ưu","4":"Có SOP rõ ràng và đội ngũ được đào tạo theo SOP","5":"Quy trình được thiết kế tối ưu: SOP + checklist + automation + feedback loop"}',
   '{"1":"No standard process, everyone does it differently","2":"Have a process but not written and inconsistent","3":"Basic process written but not optimized","4":"Clear SOP with trained team following SOP","5":"Optimized processes: SOP + checklist + automation + feedback loop"}','efficiency'),
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=0),'hq_q3',2,'select',
   'Nhân viên của bạn có biết chính xác trách nhiệm và quyền hạn của mình không?',
   'Do your staff know exactly their responsibilities and authority?',
   '{"1":"Không rõ ràng, mỗi người tự quyết định hoặc chờ chỉ đạo","2":"Biết công việc chính nhưng không rõ quyền hạn","3":"Có mô tả công việc nhưng chưa đầy đủ","4":"Rõ ràng về trách nhiệm và có quy trình báo cáo","5":"Có RACI matrix, KPIs cá nhân, và quyền hạn rõ ràng cho từng vai trò"}',
   '{"1":"Unclear, everyone decides or waits for instructions","2":"Know main tasks but unclear about authority","3":"Job descriptions exist but not comprehensive","4":"Clear responsibilities and reporting process","5":"RACI matrix, individual KPIs, and clear authority for each role"}','efficiency'),
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=0),'hq_q4',3,'select',
   'Phòng khám sử dụng công nghệ để tự động hóa và giảm thời gian thủ công không?',
   'Does your clinic use technology to automate and reduce manual time?',
   '{"1":"Ít dùng công nghệ, hầu hết việc làm thủ công","2":"Dùng một vài công cụ số nhưng chưa kết nối","3":"Có phần mềm quản lý phòng khám nhưng chưa tận dụng hết tính năng","4":"Sử dụng tốt phần mềm, một số tự động hóa cơ bản","5":"Hệ thống tự động hóa toàn diện: đặt lịch, nhắc nhở, thanh toán, báo cáo"}',
   '{"1":"Little technology use, mostly manual work","2":"Using a few digital tools but not connected","3":"Have clinic management software but not fully utilized","4":"Good software usage, some basic automation","5":"Comprehensive automation: scheduling, reminders, payments, reporting"}','efficiency'),
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=0),'hq_q5',4,'select',
   'Chi phí vận hành được theo dõi và tối ưu hóa thường xuyên không?',
   'Are operating costs tracked and optimized regularly?',
   '{"1":"Không theo dõi chi phí cụ thể, chi tiêu tùy hứng","2":"Theo dõi chi phí lớn nhưng không chi tiết","3":"Có theo dõi chi phí hàng tháng nhưng chưa phân tích sâu","4":"Theo dõi chi tiết, phân tích chi phí theo từng hạng mục","5":"Hệ thống quản lý chi phí: budget, variance analysis, cost optimization"}',
   '{"1":"Not tracking specific costs, spending as it comes","2":"Tracking major costs but not detailed","3":"Monthly cost tracking but not deeply analyzed","4":"Detailed cost tracking, analyzing costs by category","5":"Cost management system: budget, variance analysis, cost optimization"}','efficiency');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=1),'hq_open1',0,'textarea',
   'Điều gì làm bạn mất nhiều thời gian nhất mỗi ngày trong phòng khám — thứ không liên quan đến điều trị trực tiếp?',
   'What takes the most time each day in your clinic - something not directly related to treatment?',
   'Nghĩ về những công việc giấy hay hành chính mà bạn phải làm hàng ngày. Điều gì có thể được tự động hóa hoặc bỏ đi?',
   'Think about the paperwork or admin tasks you do daily. What could be automated or eliminated?'),
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=1),'hq_open2',1,'textarea',
   'Nếu bạn có thể tự động hóa một quy trình trong phòng khám, bạn sẽ chọn quy trình nào? Tại sao?',
   'If you could automate one process in the clinic, which would you choose? Why?',
   'Nghĩ về quy trình lặp đi lặp lại mà bạn hoặc đội ngũ phải làm mỗi ngày. Đâu là công việc tẻ nhạt nhất mà máy móc có thể thay thế?',
   'Think about repetitive processes you or the team do daily. What is the most boring work that machines could replace?');

-- === 26: co-so-vat-chat-check (facility) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('co-so-vat-chat-check','co-so-vat-chat-check','Co So Vat Chat Check','Facility Check',
'Không gian phòng khám ảnh hưởng trực tiếp đến cảm nhận của bệnh nhân về chất lượng dịch vụ. Kiểm tra cơ sở vật chất của bạn.',
'The clinic space directly affects patient perception of service quality. Check your facility.',
'Đánh giá cơ sở vật chất và không gian phòng khám','Assess clinic facility and space','["Ch.SYSTEM"]','active',1,'mini',26);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('co-so-vat-chat-check',0,'PHẦN 1: ĐÁNH GIÁ CƠ SỞ VẬT CHẤT','PART 1: FACILITY EVALUATION',
   '5 chiều đánh giá: không gian, thiết bị, vệ sinh, tiện nghi, và an toàn.',
   '5 evaluation dimensions: space, equipment, hygiene, amenities, and safety.',
   'Co So Vat Chat','domain'),
  ('co-so-vat-chat-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào cơ sở vật chất.',
   'Two open questions to look deeply into your facility.',
   'Co So Vat Chat','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=0),'cs_q1',0,'select',
   'Không gian phòng khám — sạch sẽ, thông mát, và thoải mái cho bệnh nhân không?',
   'Is the clinic space - clean, comfortable, and welcoming for patients?',
   '{"1":"Không gian chật hẹp, không thông, bệnh nhân ngồi chờ trong điều kiện không thoải mái","2":"Có không gian nhưng chưa được tối ưu về bố trí và cảm giác","3":"Không gian cơ bản sạch sẽ nhưng chưa tạo ấn tượng đặc biệt","4":"Không gian được thiết kế tốt, sạch sẽ, và tạo cảm giác chuyên nghiệp","5":"Không gian xuất sắc: thiết kế chủ đạo, sạch sẽ, tiện nghi, và tạo trải nghiệm tích cực"}',
   '{"1":"Cramped, not airy, patients uncomfortable waiting","2":"Has space but not optimized for layout and feel","3":"Basic clean space but no special impression","4":"Well-designed space, clean, creates professional feel","5":"Excellent space: thoughtful design, clean, amenities, positive experience"}','facility'),
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=0),'cs_q2',1,'select',
   'Thiết bị và ghế nha khoa được bảo trì và cập nhật tốt không?',
   'Are equipment and dental chairs well maintained and updated?',
   '{"1":"Thiết bị cũ, hỏng, hoặc thiếu thường xuyên","2":"Có thiết bị cơ bản nhưng chưa được bảo trì tốt","3":"Thiết bị được bảo trì nhưng chưa cập nhật công nghệ mới","4":"Thiết bị tốt, được bảo trì định kỳ và cập nhật khi cần","5":"Thiết bị hiện đại, được bảo trì chu đáo, và luôn sẵn sàng cho mọi ca điều trị"}',
   '{"1":"Old equipment, frequently broken or missing","2":"Have basic equipment but not well maintained","3":"Equipment maintained but not updated with new technology","4":"Good equipment, regularly maintained and updated as needed","5":"Modern equipment, meticulously maintained, always ready for every case"}','facility'),
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=0),'cs_q3',2,'select',
   'Tiêu chuẩn vệ sinh và khử khuẩn của phòng khám như thế nào?',
   'What are your clinic hygiene and sterilization standards?',
   '{"1":"Tiêu chuẩn vệ sinh cơ bản, có thể còn thiếu sót","2":"Có quy trình vệ sinh nhưng chưa hệ thống và không nhất quán","3":"Quy trình vệ sinh cơ bản được tuân thủ","4":"Quy trình vệ sinh nghiêm ngặt, được đào tạo và theo dõi","5":"Tiêu chuẩn vô trùng cao nhất: quy trình chuẩn quốc tế, audit định kỳ, minh bạch với bệnh nhân"}',
   '{"1":"Basic hygiene standards, possibly with gaps","2":"Have hygiene process but not systematic and consistent","3":"Basic hygiene process being followed","4":"Strict hygiene process, trained and monitored","5":"Highest sterilization standards: international protocols, regular audits, transparent to patients"}','facility'),
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=0),'cs_q4',3,'select',
   'Phòng khám có đủ tiện nghi cho bệnh nhân chờ đợi — nước uống, wifi, sạc điện thoại — không?',
   'Does your clinic have enough amenities for waiting patients - water, wifi, phone charging, etc.?',
   '{"1":"Không có tiện nghi cho bệnh nhân chờ","2":"Có ghế ngồi cơ bản, không có tiện nghi khác","3":"Có một vài tiện nghi cơ bản nhưng không được duy trì tốt","4":"Đủ tiện nghi cơ bản: wifi, nước uống, và sạc điện thoại","5":"Trải nghiệm chờ đợi tốt: wifi, nước uống, sạc, tạp chí, và có thông tin giáo dục bệnh nhân"}',
   '{"1":"No amenities for waiting patients","2":"Basic seating only, no other amenities","3":"Some basic amenities but not well maintained","4":"Enough basic amenities: wifi, water, phone charging","5":"Great waiting experience: wifi, water, charging, magazines, and patient education materials"}','facility'),
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=0),'cs_q5',4,'select',
   'Phòng khám có vị trí thuận tiện, dễ tìm, và có chỗ đỗ xe không?',
   'Is your clinic conveniently located, easy to find, and with parking?',
   '{"1":"Vị trí khó tìm, không có chỗ đỗ xe","2":"Vị trí khó tìm nhưng có chỗ đỗ xe","3":"Vị trí khá thuận tiện hoặc có chỗ đỗ xe","4":"Vị trí thuận tiện, có chỗ đỗ xe, và có biển chỉ dẫn rõ ràng","5":"Vị trí lý tưởng: dễ tìm, đỗ xe thuận tiện, có biển chỉ dẫn rõ ràng, và bản đồ online"}',
   '{"1":"Hard to find location, no parking","2":"Hard to find but has parking","3":"Fairly convenient location or has parking","4":"Convenient location, parking available, clear signage","5":"Ideal location: easy to find, convenient parking, clear signage, and online map"}','facility');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=1),'cs_open1',0,'textarea',
   'Bệnh nhân thường phàn nàn hoặc khen ngợi điều gì về không gian phòng khám của bạn?',
   'What do patients usually complain about or praise regarding your clinic space?',
   'Nghĩ về phản hồi gần nhất từ bệnh nhân về không gian, thiết bị, hoặc tiện nghi. Điều gì họ hay nhắc đến?',
   'Think about the most recent patient feedback about space, equipment, or amenities. What do they often mention?'),
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=1),'cs_open2',1,'textarea',
   'Nếu bạn có thể thay đổi một điều về cơ sở vật chất phòng khám ngay lập tức (không tốn chi phí), bạn sẽ chọn gì?',
   'If you could change one thing about your clinic facility immediately (at no cost), what would you choose?',
   'Nghĩ về những thay đổi miễn phí có thể làm ngay — như dọn dẹp, sắp xếp lại, thay đổi cách bố trí, hay thêm thông tin cho bệnh nhân.',
   'Think about free changes you could make immediately - like cleaning, reorganizing, changing layout, or adding patient information.');

-- === 27: phan-biet-thuong-hieu-check (brand) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('phan-biet-thuong-hieu-check','phan-biet-thuong-hieu-check','Phan Biet Thuong Hieu Check','Brand Differentiation Check',
'Trong thị trường nha khoa cạnh tranh gay gắt, điều khiến bệnh nhân chọn bạn thay vì phòng khám bên cạnh là gì? Kiểm tra brand differentiation.',
'In a fiercely competitive dental market, what makes patients choose you over the clinic next door? Check your brand differentiation.',
'Đánh giá brand positioning và differentiation','Assess brand positioning and differentiation','["Ch.BRAND"]','active',1,'mini',27);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('phan-biet-thuong-hieu-check',0,'PHẦN 1: ĐÁNH GIÁ BRAND DIFFERENTIATION','PART 1: BRAND DIFFERENTIATION EVALUATION',
   '5 chiều đánh giá: positioning, identity, message, experience, và reputation.',
   '5 evaluation dimensions: positioning, identity, message, experience, and reputation.',
   'Brand Differentiation','diamond'),
  ('phan-biet-thuong-hieu-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào brand positioning.',
   'Two open questions to look deeply into brand positioning.',
   'Brand Differentiation','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0),'pb_q1',0,'select',
   'Bạn có thể nói trong 30 giây điều khiến phòng khám khác biệt với các phòng khám khác trong khu vực không?',
   'Can you explain in 30 seconds what makes your clinic different from others in the area?',
   '{"1":"Không rõ điều gì khác biệt, giá là yếu tố chính","2":"Có một vài điều khác biệt nhưng chưa rõ ràng và không nhất quán","3":"Có positioning rõ ràng nhưng chưa được truyền tải tốt","4":"Có positioning rõ ràng và nhất quán, đội ngũ có thể diễn đạt","5":"Brand positioning mạnh mẽ: tagline, USP rõ ràng, và được truyền tải trong mọi touchpoint"}',
   '{"1":"Unclear what is different, price is the main factor","2":"Have some differences but not clear and consistent","3":"Have clear positioning but not well communicated","4":"Clear and consistent positioning, team can articulate it","5":"Strong brand positioning: clear tagline, USP, and communicated across every touchpoint"}','brand'),
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0),'pb_q2',1,'select',
   'Phòng khám có brand identity rõ ràng — logo, màu sắc, typography, giọng điệu — nhất quán trên mọi nơi không?',
   'Does your clinic have a clear brand identity - logo, colors, typography, tone - consistent everywhere?',
   '{"1":"Không có brand identity rõ ràng, mỗi nơi một kiểu","2":"Có logo nhưng không có brand guide hoặc không nhất quán","3":"Có brand identity cơ bản nhưng chưa được áp dụng nhất quán","4":"Có brand guide và được áp dụng nhất quán ở hầu hết các điểm chạm","5":"Brand identity toàn diện: logo + màu + typography + giọng điệu + template, nhất quán mọi nơi"}',
   '{"1":"No clear brand identity, different styles everywhere","2":"Have logo but no brand guide or not consistent","3":"Have basic brand identity but not consistently applied","4":"Brand guide and consistently applied at most touchpoints","5":"Comprehensive brand identity: logo + colors + typography + tone + templates, consistent everywhere"}','brand'),
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0),'pb_q3',2,'select',
   'Khi bệnh nhân nhắc đến phòng khám của bạn, họ thường dùng từ gì để mô tả?',
   'When patients talk about your clinic, what words do they usually use to describe it?',
   '{"1":"Không biết, không có phản hồi cụ thể về brand","2":"Chỉ biết giá rẻ hoặc gần nhà","3":"Biết một vài đặc điểm nhưng không có narrative rõ ràng","4":"Có một số từ khóa mà bệnh nhân thường nhắc đến","5":"Brand perception mạnh mẽ: bệnh nhân có thể mô tả phòng khám bằng 3-5 từ cụ thể và tích cực"}',
   '{"1":"Do not know, no specific feedback about brand","2":"Only know cheap or close to home","3":"Know some features but no clear narrative","4":"Have some keywords patients frequently mention","5":"Strong brand perception: patients can describe the clinic with 3-5 specific positive words"}','brand'),
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0),'pb_q4',3,'select',
   'Phòng khám có Unique Selling Proposition (USP) — một lợi thế cạnh tranh rõ ràng mà đối thủ khó sao chép — không?',
   'Does your clinic have a Unique Selling Proposition (USP) - a clear competitive advantage that competitors cannot easily copy?',
   '{"1":"Không có USP, cạnh tranh hoàn toàn bằng giá","2":"Có một vài lợi thế nhưng đối thủ có thể dễ dàng sao chép","3":"Có USP tiềm năng nhưng chưa được khai thác và truyền thông","4":"Có USP rõ ràng và được truyền thông đến bệnh nhân","5":"USP mạnh mẽ và bền vững: dịch vụ đặc biệt, công nghệ độc quyền, hoặc thương hiệu cá nhân mạnh"}',
   '{"1":"No USP, competing entirely on price","2":"Have some advantages but competitors can easily copy","3":"Have potential USP but not yet exploited and communicated","4":"Have clear USP and communicated to patients","5":"Strong and sustainable USP: special service, proprietary technology, or strong personal brand"}','brand'),
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0),'pb_q5',4,'select',
   'Phòng khám có storytelling — câu chuyện về tại sao bạn làm nghề và tại sao bệnh nhân nên chọn bạn — không?',
   'Does your clinic have storytelling - a story about why you do dentistry and why patients should choose you?',
   '{"1":"Không có storytelling, chỉ quảng bá dịch vụ","2":"Có một câu chuyện nhưng chưa được viết rõ và nhất quán","3":"Có storytelling cơ bản được chia sẻ bằng miệng","4":"Có storytelling rõ ràng được truyền tải qua nhiều kênh","5":"Storytelling mạnh mẽ: origin story + patient transformation stories + consistent narrative across all channels"}',
   '{"1":"No storytelling, only promoting services","2":"Have a story but not written clearly and consistently","3":"Have basic storytelling shared verbally","4":"Clear storytelling communicated through many channels","5":"Strong storytelling: origin story + patient transformation stories + consistent narrative across all channels"}','brand');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=1),'pb_open1',0,'textarea',
   'Khi bạn nói "đây là phòng khám của tôi" — điều gì khiến nó đáng tự hào và khác biệt?',
   'When you say this is my clinic - what makes it worth being proud of and different?',
   'Nghĩ về điều đặc biệt nhất ở phòng khám — có thể là kỹ năng đặc biệt, dịch vụ khách hàng, công nghệ, con người, hay triết lý.',
   'Think about the most special thing about your clinic - it could be special skills, customer service, technology, people, or philosophy.'),
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=1),'pb_open2',1,'textarea',
   'Nếu một phòng khám mới mở ngay cạnh bạn với giá rẻ hơn 30%, bạn sẽ làm gì để giữ bệnh nhân?',
   'If a new clinic opened right next to you with 30% lower prices, what would you do to retain patients?',
   'Nghĩ về những thứ KHÔNG thể sao chép bằng tiền — niềm tin, mối quan hệ, thương hiệu, hay trải nghiệm mà bạn đã xây dựng.',
   'Think about things that CANNOT be copied with money - trust, relationships, brand, or experience that you have built.');

-- === 28: tu-van-ban-hang-check (sales) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('tu-van-ban-hang-check','tu-van-ban-hang-check','Tu Van Ban Hang Check','Sales & Consultation Check',
'Nhiều phòng khám mất bệnh nhân vì nhân viên không biết cách tư vấn và chốt deal hiệu quả. Kiểm tra kỹ năng bán hàng của đội ngũ.',
'Many clinics lose patients because staff do not know how to consult and close deals effectively. Check your team sales skills.',
'Đánh giá kỹ năng tư vấn và chốt deal','Assess consultation and closing skills','["Ch.CSKH"]','active',1,'mini',28);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('tu-van-ban-hang-check',0,'PHẦN 1: ĐÁNH GIÁ KỸ NĂNG TƯ VẤN','PART 1: CONSULTATION SKILLS EVALUATION',
   '5 chiều đánh giá: lắng nghe, hiểu nhu cầu, giải pháp, chốt deal, và theo dõi.',
   '5 evaluation dimensions: listening, understanding needs, solution, closing, and follow-up.',
   'Tu Van Ban Hang','handshake'),
  ('tu-van-ban-hang-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào kỹ năng bán hàng.',
   'Two open questions to look deeply into sales skills.',
   'Tu Van Ban Hang','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0),'tv_q1',0,'select',
   'Nhân viên có thường xuyên lắng nghe để hiểu nhu cầu thực sự của bệnh nhân trước khi đề xuất điều trị không?',
   'Do staff regularly listen to understand the real needs of patients before proposing treatment?',
   '{"1":"Thường nhảy vào đề xuất điều trị trước khi hiểu nhu cầu","2":"Đôi khi lắng nghe nhưng thường quên hỏi về nhu cầu thực","3":"Lắng nghe tương đối nhưng chưa có quy trình cụ thể","4":"Có kỹ thuật lắng nghe chủ động, hỏi câu hỏi mở để hiểu nhu cầu","5":"Quy trình lắng nghe chuẩn: câu hỏi mở + paraphrasing + empathy + needs identification"}',
   '{"1":"Usually jumping to propose treatment before understanding needs","2":"Sometimes listen but often forget to ask about real needs","3":"Relatively listening but no specific process","4":"Active listening techniques, asking open questions to understand needs","5":"Standard listening process: open questions + paraphrasing + empathy + needs identification"}','sales'),
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0),'tv_q2',1,'select',
   'Nhân viên có biết cách trình bày giá và các phương án điều trị một cách rõ ràng, không gây áp lực không?',
   'Do staff know how to present prices and treatment options clearly without pressure?',
   '{"1":"Thường nói giá một cách đột ngột, gây áp lực cho bệnh nhân","2":"Trình bày giá nhưng không có cấu trúc hoặc không rõ ràng","3":"Có trình bày giá cơ bản nhưng chưa đủ chuyên nghiệp","4":"Có kịch bản trình bày giá rõ ràng, minh bạch, và không gây áp lực","5":"Quy trình trình bày giá chuyên nghiệp: value framing + transparent pricing + multiple options + no pressure"}',
   '{"1":"Usually announce price abruptly, causing patient pressure","2":"Present price but no structure or unclear","3":"Basic price presentation but not professional enough","4":"Clear pricing presentation script, transparent, no pressure","5":"Professional pricing process: value framing + transparent pricing + multiple options + no pressure"}','sales'),
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0),'tv_q3',2,'select',
   'Nhân viên có kỹ năng xử lý objection — khi bệnh nhân nói "giá cao", "cần suy nghĩ", hoặc "đi đâu khám thêm" — không?',
   'Do staff have objection handling skills - when patients say too expensive, need to think, or will check elsewhere?',
   '{"1":"Không biết xử lý objection, thường để bệnh nhân ra về khi gặp phản đối","2":"Có gắn thuyết phục bằng cách giảm giá ngay","3":"Biết một vài cách xử lý nhưng chưa có hệ thống","4":"Có kỹ thuật xử lý objection cơ bản được đào tạo","5":"Quy trình xử lý objection chuẩn: acknowledge + explore + address + confirm understanding"}',
   '{"1":"Do not know how to handle objections, usually let patients leave when faced with resistance","2":"Try to convince by reducing price immediately","3":"Know some ways but no system","4":"Basic objection handling techniques trained","5":"Standard objection handling process: acknowledge + explore + address + confirm understanding"}','sales'),
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0),'tv_q4',3,'select',
   'Nhân viên có follow-up — liên hệ lại bệnh nhân sau khi họ ra về mà chưa quyết định — không?',
   'Do staff follow up - contact patients after they leave without deciding?',
   '{"1":"Không bao giờ follow-up, bệnh nhân ra về là thôi","2":"Thỉnh thoảng follow-up một cách không có hệ thống","3":"Có follow-up nhưng không có quy trình cụ thể và timing","4":"Có hệ thống follow-up: kịch bản gọi lại + timing chuẩn + CRM tracking","5":"Follow-up chiến lược: multi-channel (call + message + email) + timing tối ưu + personalization + tracking"}',
   '{"1":"Never follow up, patients leave and that is it","2":"Occasionally follow up without a system","3":"Follow up but no specific process and timing","4":"Follow-up system: call script + standard timing + CRM tracking","5":"Strategic follow-up: multi-channel (call + message + email) + optimal timing + personalization + tracking"}','sales'),
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0),'tv_q5',4,'select',
   'Nhân viên được đào tạo về kỹ năng bán hàng và tư vấn nha khoa không?',
   'Are staff trained in dental sales and consultation skills?',
   '{"1":"Không có đào tạo bán hàng, ai tự làm theo cách của mình","2":"Đào tạo sơ lược về sản phẩm/dịch vụ nhưng không có kỹ năng bán hàng","3":"Có một vài buổi đào tạo nhưng không thường xuyên và không có thực hành","4":"Đào tạo bán hàng thường xuyên với role-play và feedback","5":"Chương trình đào tạo chuyên nghiệp: onboarding + ongoing training + role-play + coaching + KPI tracking"}',
   '{"1":"No sales training, everyone does it their own way","2":"Brief product/service training but no sales skills","3":"Some training sessions but not regular and no practice","4":"Regular sales training with role-play and feedback","5":"Professional training program: onboarding + ongoing training + role-play + coaching + KPI tracking"}','sales');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=1),'tv_open1',0,'textarea',
   'Kể về một tình huống khi nhân viên mất bệnh nhân vì không chốt được deal. Điều gì đã xảy ra?',
   'Describe a situation when a staff member lost a patient because they could not close the deal. What happened?',
   'Nghĩ về một ca cụ thể. Bệnh nhân có vẻ quan tâm nhưng cuối cùng không làm. Điều gì có thể đã làm khác đi?',
   'Think about a specific case. The patient seemed interested but ultimately did not proceed. What could have been done differently?'),
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=1),'tv_open2',1,'textarea',
   'Bạn nghĩ nhân viên của bạn sợ điều gì nhất khi tư vấn bán hàng? Điều gì ngăn cản họ chốt deal tự tin?',
   'What do you think your staff fears the most when consulting and selling? What prevents them from closing deals confidently?',
   'Nghĩ về những rào cản tâm lý: sợ bệnh nhân không thích, sợ bị coi là "bán hàng", hay thiếu kiến thức về sản phẩm.',
   'Think about psychological barriers: fear of patient disapproval, fear of being seen as selling, or lack of product knowledge.');

-- === 29: marketing-online-check (digital) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('marketing-online-check','marketing-online-check','Marketing Online Check','Online Marketing Check',
'Bệnh nhân tìm bạn trên Google, Facebook, TikTok như thế nào? Kiểm tra digital presence của phòng khám.',
'How do patients find you on Google, Facebook, TikTok? Check your clinic digital presence.',
'Đánh giá digital presence và online marketing','Assess digital presence and online marketing','["Ch.BRAND"]','active',1,'mini',29);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('marketing-online-check',0,'PHẦN 1: ĐÁNH GIÁ DIGITAL PRESENCE','PART 1: DIGITAL PRESENCE EVALUATION',
   '5 chiều đánh giá: website, Google, social media, content, và reputation.',
   '5 evaluation dimensions: website, Google, social media, content, and reputation.',
   'Marketing Online','language'),
  ('marketing-online-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào digital presence.',
   'Two open questions to look deeply into your digital presence.',
   'Marketing Online','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=0),'mo_q1',0,'select',
   'Phòng khám có website riêng chuyên nghiệp không? Website đó tối ưu cho di động và có thông tin đầy đủ không?',
   'Does your clinic have a professional website? Is it mobile-optimized and has complete information?',
   '{"1":"Không có website hoặc website rất sơ sài","2":"Có website nhưng thiếu thông tin, không được cập nhật","3":"Có website cơ bản với thông tin chính","4":"Website tốt: thông tin đầy đủ, mobile-friendly, fast loading","5":"Website xuất sắc: SEO tốt, booking online, patient education content, testimonials"}',
   '{"1":"No website or very basic website","2":"Has website but missing information, not updated","3":"Basic website with main information","4":"Good website: complete info, mobile-friendly, fast loading","5":"Excellent website: good SEO, online booking, patient education content, testimonials"}','digital'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=0),'mo_q2',1,'select',
   'Phòng khám có Google Business Profile và được quản lý tốt không?',
   'Does your clinic have a Google Business Profile and is it well managed?',
   '{"1":"Không có Google Business Profile","2":"Có nhưng thông tin không đầy đủ và không được cập nhật","3":"Có Google Business Profile với thông tin cơ bản được cập nhật","4":"Google Business Profile tốt: thông tin đầy đủ, hình ảnh, review được trả lời","5":"Google Business Profile xuất sắc: posts thường xuyên, reviews cao, Q&A active, photos updated"}',
   '{"1":"No Google Business Profile","2":"Has one but information incomplete and not updated","3":"Google Business Profile with basic updated information","4":"Good Google Business Profile: complete info, photos, reviews responded to","5":"Excellent Google Business Profile: regular posts, high reviews, active Q&A, photos updated"}','digital'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=0),'mo_q3',2,'select',
   'Phòng khám có active trên mạng xã hội không? Nội dung có được đăng đều đặn và chất lượng không?',
   'Is your clinic active on social media? Is content posted regularly and of good quality?',
   '{"1":"Không có mạng xã hội hoặc có nhưng bỏ hoang","2":"Có social media nhưng đăng không đều và nội dung yếu","3":"Đăng nội dung tương đối đều nhưng chưa có chiến lược rõ ràng","4":"Active trên 1-2 nền tảng với nội dung có chiến lược","5":"Multi-platform presence với content strategy: educational + engagement + community building"}',
   '{"1":"No social media or abandoned accounts","2":"Has social media but posting inconsistent and weak content","3":"Relatively regular posting but no clear strategy","4":"Active on 1-2 platforms with strategic content","5":"Multi-platform presence with content strategy: educational + engagement + community building"}','digital'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=0),'mo_q4',3,'select',
   'Phòng khám có online reputation tốt — reviews, testimonials — không?',
   'Does your clinic have good online reputation - reviews, testimonials?',
   '{"1":"Không có reviews hoặc toàn review tiêu cực","2":"Ít reviews và chưa chủ động thu thập testimonials","3":"Có reviews tích cực nhưng chưa chủ động xây dựng","4":"Chủ động thu thập reviews và có chiến lược xây dựng reputation","5":"Reputation system: chủ động thu thập, phản hồi tất cả reviews, showcase testimonials"}',
   '{"1":"No reviews or all negative reviews","2":"Few reviews and not proactively collecting testimonials","3":"Have positive reviews but not proactively building","4":"Proactively collecting reviews and building reputation strategy","5":"Reputation system: proactive collection, respond to all reviews, showcase testimonials"}','digital'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=0),'mo_q5',4,'select',
   'Phòng khám có chiến lược digital marketing rõ ràng — biết đối tượng mục tiêu, kênh ưu tiên, và content plan — không?',
   'Does your clinic have a clear digital marketing strategy - target audience, priority channels, and content plan?',
   '{"1":"Không có chiến lược digital marketing, cứ đăng gì thì đăng","2":"Có một vài nỗ lực digital nhưng không có chiến lược","3":"Có hiểu biết cơ bản nhưng chưa có kế hoạch cụ thể","4":"Có chiến lược digital marketing cơ bản với target audience và kênh ưu tiên","5":"Chiến lược digital toàn diện: audience segmentation, content calendar, channel strategy, analytics"}',
   '{"1":"No digital marketing strategy, posting whatever","2":"Some digital efforts but no strategy","3":"Basic understanding but no specific plan","4":"Basic digital marketing strategy with target audience and priority channels","5":"Comprehensive digital strategy: audience segmentation, content calendar, channel strategy, analytics"}','digital');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=1),'mo_open1',0,'textarea',
   'Khi một bệnh nhân mới tìm phòng khám nha khoa trên Google, điều gì khiến họ chọn bạn thay vì đối thủ? Điều đó có hiển thị online không?',
   'When a new patient searches for a dental clinic on Google, what makes them choose you over a competitor? Is that reflected online?',
   'Nghĩ về "why us" của phòng khám. Nếu bạn là bệnh nhân tìm kiếm online, bạn sẽ thấy điều đó ở đâu trên internet?',
   'Think about the why us of your clinic. If you were a patient searching online, where would you see that on the internet?'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=1),'mo_open2',1,'textarea',
   'Bạn đã thử những kênh digital marketing nào? Kênh nào hiệu quả nhất và kênh nào chưa hoạt động tốt?',
   'What digital marketing channels have you tried? Which works best and which has not performed well?',
   'Liệt kê: Facebook, Google Ads, TikTok, Website, Zalo OA, SEO... Đâu là kênh mang lại bệnh nhân thực sự?',
   'List: Facebook, Google Ads, TikTok, Website, Zalo OA, SEO... Which channel brings real patients?');

-- === 30: thu-vi-tri-check (position) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('thu-vi-tri-check','thu-vi-tri-check','Thu Vi Tri Check','Competitive Position Check',
'Phòng khám của bạn đang ở đâu so với đối thủ? Kiểm tra vị thế cạnh tranh và chiến lược phát triển.',
'Where does your clinic stand compared to competitors? Check competitive positioning and development strategy.',
'Phân tích SWOT và vị thế cạnh tranh','SWOT analysis and competitive positioning','["Ch.STARTUP"]','active',1,'mini',30);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('thu-vi-tri-check',0,'PHẦN 1: ĐÁNH GIÁ VỊ THẾ CẠNH TRANH','PART 1: COMPETITIVE POSITIONING EVALUATION',
   '5 chiều đánh giá: phân tích đối thủ, lợi thế, chiến lược, khác biệt, và tầm nhìn.',
   '5 evaluation dimensions: competitor analysis, strengths, strategy, differentiation, and vision.',
   'Vi the canh tranh','compare_arrows'),
  ('thu-vi-tri-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào vị thế cạnh tranh.',
   'Two open questions to look deeply into your competitive positioning.',
   'Vi the canh tranh','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=0),'tvtri_q1',0,'select',
   'Bạn có biết rõ 3-5 đối thủ chính trong khu vực và điểm mạnh/yếu của họ không?',
   'Do you clearly know the 3-5 main competitors in your area and their strengths/weaknesses?',
   '{"1":"Không quan tâm hoặc không biết đối thủ là ai","2":"Biết tên một vài đối thủ nhưng không phân tích sâu","3":"Biết đối thủ chính nhưng không có thông tin chi tiết","4":"Có phân tích đối thủ cơ bản: giá, dịch vụ, vị trí","5":"Phân tích đối thủ toàn diện: SWOT, giá, chất lượng, marketing, USP, patient reviews"}',
   '{"1":"Not interested or do not know who competitors are","2":"Know names of some competitors but not deeply analyzed","3":"Know main competitors but no detailed information","4":"Basic competitor analysis: pricing, services, location","5":"Comprehensive competitor analysis: SWOT, pricing, quality, marketing, USP, patient reviews"}','position'),
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=0),'tvtri_q2',1,'select',
   'Bạn có biết chính xác điểm mạnh độc nhất của phòng khám mà đối thủ khó sao chép không?',
   'Do you know the exact unique strengths of your clinic that competitors cannot easily copy?',
   '{"1":"Không rõ điểm mạnh độc nhất, nghĩ mình giống đối thủ","2":"Có một vài ý nhưng chưa được xác định rõ ràng","3":"Biết điểm mạnh nhưng chưa khai thác tốt","4":"Có 1-2 điểm mạnh rõ ràng được truyền thông","5":"Core competencies rõ ràng: những gì chỉ mình làm được, khó sao chép, được khách hàng công nhận"}',
   '{"1":"Unclear about unique strengths, think you are similar to competitors","2":"Have some ideas but not clearly identified","3":"Know strengths but not well exploited","4":"Have 1-2 clear strengths communicated","5":"Clear core competencies: what only you can do, hard to copy, recognized by customers"}','position'),
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=0),'tvtri_q3',2,'select',
   'Phòng khám có chiến lược phát triển ngắn hạn và dài hạn rõ ràng không?',
   'Does your clinic have clear short-term and long-term development strategies?',
   '{"1":"Không có chiến lược, làm việc theo cảm tính","2":"Có mục tiêu chung nhưng không có chiến lược cụ thể","3":"Có kế hoạch ngắn hạn nhưng thiếu tầm nhìn dài hạn","4":"Có chiến lược rõ ràng cho 1-2 năm với action plan","5":"Chiến lược toàn diện: 3-5 năm vision + annual plan + quarterly OKRs + contingency"}',
   '{"1":"No strategy, working by intuition","2":"Have general goals but no specific strategy","3":"Have short-term plan but lack long-term vision","4":"Clear 1-2 year strategy with action plan","5":"Comprehensive strategy: 3-5 year vision + annual plan + quarterly OKRs + contingency"}','position'),
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=0),'tvtri_q4',3,'select',
   'Phòng khám có khác biệt hóa được trong mắt bệnh nhân — họ chọn bạn vì lý do gì thay vì đối thủ?',
   'Is your clinic differentiated in patients eyes - why do they choose you instead of competitors?',
   '{"1":"Không có sự khác biệt rõ ràng, bệnh nhân chọn vì giá hoặc gần nhà","2":"Có một vài khác biệt nhưng chưa mạnh và chưa được nhận thức","3":"Có USP tiềm năng nhưng chưa được truyền thông hiệu quả","4":"Có USP rõ ràng và được truyền thông tốt đến bệnh nhân","5":"Brand differentiation mạnh: USP độc nhất, được truyền thông xuyên suốt, patient loyalty cao"}',
   '{"1":"No clear differentiation, patients choose based on price or proximity","2":"Have some differences but not strong and not perceived","3":"Have potential USP but not effectively communicated","4":"Have clear USP and well communicated to patients","5":"Strong brand differentiation: unique USP, consistently communicated, high patient loyalty"}','position'),
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=0),'tvtri_q5',4,'select',
   'Bạn có tầm nhìn rõ ràng về phòng khám trong 3-5 năm tới không — phát triển quy mô, chuyên môn hóa, hay tối ưu hóa?',
   'Do you have a clear vision for your clinic in the next 3-5 years - scale up, specialize, or optimize?',
   '{"1":"Không có tầm nhìn, sống ngày nào hay ngày đó","2":"Có ước mơ chung nhưng chưa có kế hoạch cụ thể","3":"Có định hướng nhưng chưa xác định rõ con đường","4":"Có tầm nhìn rõ ràng với các milestone cụ thể","5":"Tầm nhìn chiến lược rõ ràng: growth path + specialization + investment plan + exit strategy"}',
   '{"1":"No vision, living day to day","2":"Have general dreams but no specific plan","3":"Have direction but not clearly defined path","4":"Clear vision with specific milestones","5":"Clear strategic vision: growth path + specialization + investment plan + exit strategy"}','position');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=1),'tvtri_open1',0,'textarea',
   'Nếu một phòng khám mới với đầy đủ tiền và đội ngũ giỏi mở ngay cạnh bạn, điều gì khiến bệnh nhân hiện tại VẪN ở lại với bạn?',
   'If a new clinic with full funding and a great team opened right next to you, what would make current patients STILL stay with you?',
   'Nghĩ về những thứ KHÔNG thể mua bằng tiền — mối quan hệ, niềm tin, thời gian, hay kinh nghiệm mà bạn đã xây dựng với bệnh nhân.',
   'Think about things that CANNOT be bought with money - relationships, trust, time, or experience you have built with patients.'),
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=1),'tvtri_open2',1,'textarea',
   'Bạn thấy mình đang ở giai đoạn nào của vòng đời phòng khám — khởi đầu, tăng trưởng, ổn định, hay suy thoái? Điều gì cho thấy điều đó?',
   'What stage of the clinic lifecycle do you think you are in - beginning, growth, stability, or decline? What indicates this?',
   'Các dấu hiệu: doanh thu tăng/giảm, bệnh nhân mới, bệnh nhân cũ quay lại, đội ngũ ổn định, áp lực cạnh tranh...',
   'Signs: revenue growing/declining, new patients, returning patients, team stability, competitive pressure...');

-- === 31: thich-ung-dung-check (adapt) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('thich-ung-dung-check','thich-ung-dung-check','Thich Ung Check','Adaptability Check',
'Thị trường nha khoa thay đổi nhanh chóng. Bạn thích ứng được với xu hướng mới và công nghệ mới không? Kiểm tra khả năng thích ứng.',
'The dental market changes quickly. Can you adapt to new trends and technology? Check your adaptability.',
'Đánh giá khả năng thích ứng và chuyển đổi số','Assess adaptability and digital transformation','["Ch.STARTUP"]','active',1,'mini',31);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('thich-ung-dung-check',0,'PHẦN 1: ĐÁNH GIÁ KHẢ NĂNG THÍCH ỨNG','PART 1: ADAPTABILITY EVALUATION',
   '5 chiều đánh giá: công nghệ, xu hướng, mô hình, đội ngũ, và tâm lý.',
   '5 evaluation dimensions: technology, trends, models, team, and mindset.',
   'Thich Ung','autorenew'),
  ('thich-ung-dung-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào khả năng thích ứng.',
   'Two open questions to look deeply into your adaptability.',
   'Thich Ung','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=0),'tu_q1',0,'select',
   'Phòng khám có cập nhật và áp dụng công nghệ mới khi cần không?',
   'Does your clinic update and apply new technology when needed?',
   '{"1":"Không theo dõi công nghệ mới, dùng công nghệ cũ","2":"Biết công nghệ mới nhưng ngại thay đổi","3":"Thỉnh thoảng cập nhật khi bắt buộc","4":"Chủ động theo dõi và áp dụng công nghệ mới có chọn lọc","5":"Chiến lược công nghệ: research + evaluate + adopt + train + measure ROI"}',
   '{"1":"Not following new technology, using old technology","2":"Know new technology but reluctant to change","3":"Occasionally update when forced","4":"Proactively following and selectively adopting new technology","5":"Technology strategy: research + evaluate + adopt + train + measure ROI"}','adapt'),
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=0),'tu_q2',1,'select',
   'Bạn có theo dõi và phản ứng với xu hướng thị trường nha khoa không — giá cả, dịch vụ mới, kỳ vọng bệnh nhân thay đổi?',
   'Do you follow and react to dental market trends - pricing, new services, changing patient expectations?',
   '{"1":"Không theo dõi xu hướng, giữ nguyên mô hình cũ","2":"Biết có thay đổi nhưng phản ứng chậm","3":"Thỉnh thoảng điều chỉnh khi thấy rõ vấn đề","4":"Chủ động theo dõi và điều chỉnh theo xu hướng","5":"Strategic awareness: trend monitoring + market intelligence + proactive adaptation"}',
   '{"1":"Not following trends, keeping old model","2":"Know changes but slow to react","3":"Occasionally adjust when problems become clear","4":"Proactively following and adjusting to trends","5":"Strategic awareness: trend monitoring + market intelligence + proactive adaptation"}','adapt'),
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=0),'tu_q3',2,'select',
   'Bạn có sẵn sàng thay đổi mô hình kinh doanh hoặc dịch vụ khi thị trường yêu cầu không?',
   'Are you willing to change your business model or services when the market requires it?',
   '{"1":"Không muốn thay đổi, giữ nguyên như cũ","2":"Chỉ thay đổi khi bị ép buộc","3":"Sẵn sàng thay đổi nhưng cần thời gian dài","4":"Thay đổi linh hoạt khi cần, có kế hoạch chuyển đổi","5":"Agile transformation: fast decision-making + experiment + pivot + scale"}',
   '{"1":"Do not want to change, keeping the same","2":"Only change when forced","3":"Willing to change but needs long time","4":"Flexibly changing when needed, with transition plan","5":"Agile transformation: fast decision-making + experiment + pivot + scale"}','adapt'),
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=0),'tu_q4',3,'select',
   'Đội ngũ của bạn có khả năng học hỏi và thích ứng với quy trình mới không?',
   'Does your team have the ability to learn and adapt to new processes?',
   '{"1":"Đội ngũ kháng cự thay đổi, không muốn học cái mới","2":"Một số người chịu thích ứng, phần lớn kháng cự","3":"Đội ngũ cơ bản thích ứng nhưng cần thời gian và hướng dẫn","4":"Đội ngũ thích ứng tốt, có văn hóa học tập","5":"Learning culture: training + mentorship + psychological safety + continuous improvement"}',
   '{"1":"Team resists change, does not want to learn new things","2":"Some people willing to adapt, majority resists","3":"Team basically adapts but needs time and guidance","4":"Team adapts well, has learning culture","5":"Learning culture: training + mentorship + psychological safety + continuous improvement"}','adapt'),
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=0),'tu_q5',4,'select',
   'Bạn có tìm kiếm và học hỏi từ những nguồn mới — khóa học, cộng đồng, mentors — để phát triển phòng khám không?',
   'Do you seek and learn from new sources - courses, communities, mentors - to develop your clinic?',
   '{"1":"Không tìm kiếm nguồn học mới, tự làm theo kinh nghiệm","2":"Thỉnh thoảng đọc bài viết nhưng không có hệ thống","3":"Tham gia một vài khóa học hoặc cộng đồng","4":"Chủ động học hỏi: khóa học + community + mentorship + benchmarking","5":"Learning system: regular education + peer network + expert mentorship + industry conferences"}',
   '{"1":"Not seeking new learning sources, working by experience","2":"Occasionally read articles but no system","3":"Participating in some courses or communities","4":"Proactively learning: courses + community + mentorship + benchmarking","5":"Learning system: regular education + peer network + expert mentorship + industry conferences"}','adapt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=1),'tu_open1',0,'textarea',
   'Kể về một lần phòng khám phải thay đổi lớn — vì covid, vì đối thủ, vì công nghệ. Bạn đã phản ứng như thế nào?',
   'Tell about a time when your clinic had to make a big change - due to covid, competitors, or technology. How did you react?',
   'Nghĩ về một thay đổi lớn mà phòng khám phải trải qua. Bạn đã thích ứng nhanh hay chậm? Điều gì giúp hoặc cản trở bạn?',
   'Think about a major change your clinic had to go through. Did you adapt quickly or slowly? What helped or hindered you?'),
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=1),'tu_open2',1,'textarea',
   'Công nghệ hoặc xu hướng nào trong nha khoa mà bạn thấy hứa hẹn nhưng chưa áp dụng? Điều gì ngăn cản bạn?',
   'What dental technology or trend do you find promising but have not applied? What is preventing you?',
   'Ví dụ: AI diagnosis, teledentistry, digital marketing, membership plans, new treatment techniques... Điều gì khiến bạn chưa nhảy vào?',
   'Examples: AI diagnosis, teledentistry, digital marketing, membership plans, new treatment techniques... What makes you hesitant to jump in?');

-- === 32: thuong-hieu-ca-nhan-check (personal) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('thuong-hieu-ca-nhan-check','thuong-hieu-ca-nhan-check','Thuong Hieu Ca Nhan Check','Personal Branding Check',
'Trong thời đại mạng xã hội, thương hiệu cá nhân của chủ phòng khám là tài sản quý giá. Kiểm tra personal branding của bạn.',
'In the social media age, the personal brand of the clinic owner is a valuable asset. Check your personal branding.',
'Đánh giá personal branding và authority của chủ phòng khám','Assess personal branding and authority of clinic owners','["Ch.BRAND"]','active',1,'mini',32);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('thuong-hieu-ca-nhan-check',0,'PHẦN 1: ĐÁNH GIÁ THƯƠNG HIỆU CÁ NHÂN','PART 1: PERSONAL BRANDING EVALUATION',
   '5 chiều đánh giá: online presence, content, authority, network, và consistency.',
   '5 evaluation dimensions: online presence, content, authority, network, and consistency.',
   'Thuong Hieu Ca Nhan','person'),
  ('thuong-hieu-ca-nhan-check',1,'PHẦN 2: TỰ SOI CHIẾU','PART 2: SELF-REFLECTION',
   'Hai câu hỏi mở giúp bạn nhìn sâu vào thương hiệu cá nhân.',
   'Two open questions to look deeply into your personal branding.',
   'Thuong Hieu Ca Nhan','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0),'thcn_q1',0,'select',
   'Bạn có online presence cá nhân mạnh — profile, hình ảnh chuyên nghiệp, và thông điệp rõ ràng — không?',
   'Do you have a strong personal online presence - profile, professional photos, and clear messaging?',
   '{"1":"Không có online presence cá nhân, hoàn toàn ẩn danh","2":"Có một vài tài khoản nhưng không được chăm chút","3":"Có online presence cơ bản với thông tin chính","4":"Online presence tốt: profile đầy đủ, hình ảnh chuyên nghiệp, thông điệp nhất quán","5":"Personal brand presence mạnh: consistent across platforms, professional photography, clear positioning statement"}',
   '{"1":"No personal online presence, completely anonymous","2":"Have some accounts but not well maintained","3":"Basic online presence with main information","4":"Good online presence: complete profile, professional photos, consistent messaging","5":"Strong personal brand presence: consistent across platforms, professional photography, clear positioning statement"}','personal'),
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0),'thcn_q2',1,'select',
   'Bạn có chia sẻ nội dung chuyên môn — kiến thức nha khoa, case studies, insights — để xây dựng authority không?',
   'Do you share professional content - dental knowledge, case studies, insights - to build authority?',
   '{"1":"Không chia sẻ nội dung, không muốn công khai","2":"Thỉnh thoảng chia sẻ nhưng không có hệ thống","3":"Chia sẻ nội dung đều đặn nhưng chưa có chiến lược rõ ràng","4":"Content strategy hiệu quả: educational content + case studies + personal insights","5":"Authority content engine: consistent educational content + thought leadership + patient education + industry recognition"}',
   '{"1":"Do not share content, do not want to be public","2":"Occasionally share but no system","3":"Regular content sharing but no clear strategy","4":"Effective content strategy: educational content + case studies + personal insights","5":"Authority content engine: consistent educational content + thought leadership + patient education + industry recognition"}','personal'),
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0),'thcn_q3',2,'select',
   'Bạn được công nhận là chuyên gia trong lĩnh vực nha khoa — bởi bệnh nhân, đồng nghiệp, hay cộng đồng — không?',
   'Are you recognized as an expert in dentistry - by patients, peers, or the community?',
   '{"1":"Không có recognition, chỉ là bác sĩ bình thường","2":"Được một số bệnh nhân biết đến nhưng không phải expert","3":"Có danh tiếng địa phương trong cộng đồng","4":"Được công nhận là chuyên gia trong một lĩnh vực chuyên môn cụ thể","5":"Thought leader: speaking engagements + publications + media coverage + professional awards"}',
   '{"1":"No recognition, just a regular doctor","2":"Known by some patients but not seen as an expert","3":"Have local reputation in the community","4":"Recognized as an expert in a specific professional area","5":"Thought leader: speaking engagements + publications + media coverage + professional awards"}','personal'),
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0),'thcn_q4',3,'select',
   'Bạn có mạng lưới quan hệ mạnh — kết nối với các chuyên gia khác, tham gia cộng đồng nha khoa, xây dựng referral network — không?',
   'Do you have a strong network - connections with other professionals, dental community involvement, referral network building?',
   '{"1":"Không quan tâm đến networking, chỉ tập trung công việc","2":"Có một vài mối quan hệ nhưng không chủ động xây dựng","3":"Tham gia một vài cộng đồng nhưng chưa tích cực","4":"Chủ động xây dựng network: cộng đồng + referral partners + professional associations","5":"Strategic networking: mastermind groups + cross-referrals + industry events + mentorship network"}',
   '{"1":"Not interested in networking, only focused on work","2":"Have a few relationships but not proactively building","3":"Participating in some communities but not actively","4":"Proactively building network: communities + referral partners + professional associations","5":"Strategic networking: mastermind groups + cross-referrals + industry events + mentorship network"}','personal'),
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0),'thcn_q5',4,'select',
   'Thông điệp và hình ảnh cá nhân của bạn có nhất quán trên mọi nền tảng và trong mọi tương tác không?',
   'Is your personal messaging and image consistent across all platforms and in every interaction?',
   '{"1":"Không quan tâm đến consistency, cứ tự nhiên","2":"Tương đối nhất quán nhưng không có ý định","3":"Có cố gắng nhất quán nhưng chưa có hệ thống","4":"Nhất quán tốt: messaging + visual identity + tone of voice","5":"Hoàn toàn nhất quán: personal brand guidelines + consistent storytelling + authentic presence"}',
   '{"1":"Not concerned about consistency, just being natural","2":"Relatively consistent but not intentional","3":"Trying to be consistent but no system","4":"Good consistency: messaging + visual identity + tone of voice","5":"Fully consistent: personal brand guidelines + consistent storytelling + authentic presence"}','personal');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=1),'thcn_open1',0,'textarea',
   'Khi ai đó nhắc đến tên bạn trong cộng đồng nha khoa, họ thường nói gì về bạn? Điều đó có đúng với cách bạn muốn được nhìn nhận không?',
   'When someone mentions your name in the dental community, what do they usually say about you? Does that match how you want to be perceived?',
   'Nghĩ về word of mouth về bạn trong cộng đồng. Bệnh nhân, đồng nghiệp, và đối tác nói gì về bạn khi bạn không ở đó?',
   'Think about word of mouth about you in the community. What do patients, peers, and partners say about you when you are not there?'),
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=1),'thcn_open2',1,'textarea',
   'Bạn đã đầu tư bao nhiêu thời gian và nỗ lực vào việc xây dựng thương hiệu cá nhân? Bạn thấy kết quả như thế nào?',
   'How much time and effort have you invested in building personal branding? How do you see the results?',
   'Nghĩ về ROI của personal branding — có mang lại bệnh nhân mới, referral, hay cơ hội kinh doanh không? Điều gì đã hiệu quả và chưa hiệu quả?',
   'Think about the ROI of personal branding - does it bring new patients, referrals, or business opportunities? What has worked and what has not?');
