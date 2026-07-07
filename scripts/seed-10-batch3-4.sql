-- Seed: 10 scanners batch 3+4 (orders 23-32) using subqueries (SQLite/D1 compatible)

-- === 23: marketing-content-check (content) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('marketing-content-check','marketing-content-check','Marketing Content Check','Marketing Content Check',
'Content la chi so cuoi cung nhung cung quan trong nhat trong marketing. Khong co content tot, cac kenh khac deu that huu. Kiem tra chat luong content cua phong kham.',
'Content is the last but most important metric in marketing. Without good content, all other channels fail. Check your clinic content quality.',
'Danh gia chat luong content marketing','Assess marketing content quality','["Ch.BRAND"]','active',1,'mini',23);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('marketing-content-check',0,'PHAN 1: DANH GIA CONTENT','PART 1: CONTENT EVALUATION',
   '5 chieu danh gia: plan, quality, consistency, SEO, va engagement.',
   '5 evaluation dimensions: plan, quality, consistency, SEO, and engagement.',
   'Content Marketing','edit_note'),
  ('marketing-content-check',1,'PHAN 2: TU SOI CHIEU','PART 2: SELF-REFLECTION',
   'Hai cau hoi mo giup ban nhin sau vao content.',
   'Two open questions to look deeply into your content.',
   'Content Marketing','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=0),
   'mc_q1',0,'select',
   'Phong kham co content plan - lich dang bai, chu de ro rang, va target audience duoc dinh nghia - khong?',
   'Does your clinic have a content plan - posting schedule, clear topics, and defined target audience?',
   '{"1":"Khong co content plan, dang bai tuy y","2":"Co dang bai nhung khong co lich cu the","3":"Co lich dang bai nhung chua co target audience ro rang","4":"Co content calendar va target audience duoc dinh nghia","5":"Content strategy day du: calendar + audience + topics + SEO strategy"}',
   '{"1":"No content plan, posting randomly","2":"Have posts but no specific schedule","3":"Have posting schedule but target audience not clearly defined","4":"Content calendar with defined target audience","5":"Comprehensive content strategy: calendar + audience + topics + SEO strategy"}',
   'content'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=0),
   'mc_q2',1,'select',
   'Chat luong content - hinh anh, video, van ban - cua phong kham nhu the nao?',
   'How is the quality of your content - photos, videos, text - at your clinic?',
   '{"1":"Chi co hinh anh don gian, khong co video, noi dung yeu","2":"Co hinh anh tot nhung it video va noi dung chua chinh chu","3":"Co hinh anh va video chat luong trung binh","4":"Content chat luong tot: hinh anh dep, video huu ich, van ban ro rang","5":"Content xuat sac: production quality cao, video storytelling, patient education content"}',
   '{"1":"Only simple photos, no videos, weak content","2":"Good photos but few videos and not polished content","3":"Average quality photos and videos","4":"Good quality content: nice photos, useful videos, clear text","5":"Excellent content: high production quality, storytelling videos, patient education content"}',
   'content'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=0),
   'mc_q3',2,'select',
   'Phong kham co dang content deu dat tren nhieu kenh - website, Facebook, TikTok, YouTube - khong?',
   'Does your clinic distribute content evenly across channels - website, Facebook, TikTok, YouTube?',
   '{"1":"Khong co kenh nao duoc cham soc tot","2":"Chi co Facebook, cac kenh khac bo hoac that nguoi theo doi","3":"Co 1-2 kenh hoat dong nhung khong co strategy","4":"Multi-channel presence voi content adapted cho tung kenh","5":"Omni-channel content strategy: adapted content + optimal posting time + cross-promotion"}',
   '{"1":"No channel is well maintained","2":"Only Facebook, other channels abandoned or unfollowed","3":"Have 1-2 active channels but no strategy","4":"Multi-channel presence with content adapted per channel","5":"Omni-channel content strategy: adapted content + optimal posting time + cross-promotion"}',
   'content'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=0),
   'mc_q4',3,'select',
   'Content cua phong kham co duoc toi uu SEO va tim kiem duoc tren Google khong?',
   'Is your content SEO-optimized and searchable on Google?',
   '{"1":"Khong co content tren website hoac blog","2":"Co blog nhung khong toi uu SEO","3":"Co mot so bai SEO nhung chua co system","4":"SEO content strategy: keyword research + on-page SEO + regular posting","5":"Comprehensive SEO: keyword strategy + technical SEO + local SEO + content hub + backlinks"}',
   '{"1":"No content on website or blog","2":"Have blog but not SEO-optimized","3":"Have some SEO articles but no system","4":"SEO content strategy: keyword research + on-page SEO + regular posting","5":"Comprehensive SEO: keyword strategy + technical SEO + local SEO + content hub + backlinks"}',
   'content'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=0),
   'mc_q5',4,'select',
   'Content co tao engagement - like, comment, share, tin nhan - tu benh nhan khong?',
   'Does your content generate engagement - likes, comments, shares, messages - from patients?',
   '{"1":"It engagement, benh nhan hoi tuong tac it","2":"Co mot so tuong tac nhung khong co chi so theo doi","3":"Engagement trung binh, chua co ham muot tang truong","4":"Engagement tot: comment nhieu, DM requests, shares","5":"High engagement: active community + UGC + patient stories + poll/interaction + conversion tracking"}',
   '{"1":"Low engagement, patients rarely interact","2":"Some interactions but no metrics to track","3":"Average engagement, no growth momentum","4":"Good engagement: lots of comments, DM requests, shares","5":"High engagement: active community + UGC + patient stories + poll/interaction + conversion tracking"}',
   'content');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=1),
   'mc_open1',0,'textarea',
   'Noi dung nao cua phong kham duoc benh nhan yeu thich nhat? Tai sao?',
   'What content from your clinic do patients like most? Why?',
   'Nghi ve nhung bai post, video, hay content ma benh nhan thuong xuyen phan hoi tich cuc.',
   'Think about posts, videos, or content that patients frequently give positive feedback on.'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-content-check' AND order_idx=1),
   'mc_open2',1,'textarea',
   'Ban gap kho khan gi khi tao content? Dieu gi ngan can ban?',
   'What difficulties do you face when creating content? What is holding you back?',
   'Nghi ve cac rao can: thoi gian, ky nang, y tuong, hay nhan luc.',
   'Think about barriers: time, skills, ideas, or manpower.');

-- === 24: loi-nhu-quan-check (business) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('loi-nhu-quan-check','loi-nhu-quan-check','Loi Nhu Quan Check','Business Mindset Check',
'Nhieu bac si gioi nhung phong kham khong phat trien vi thieu mindset kinh doanh. Kiem tra cach ban quan ly phong kham nhu mot doanh nghiep.',
'Many good doctors but clinics that do not grow because of a lack of business mindset. Check how you manage your clinic as a business.',
'Danh gia mindset kinh doanh cua chu phong kham','Assess the business mindset of clinic owners','["Ch.STARTUP"]','active',1,'mini',24);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('loi-nhu-quan-check',0,'PHAN 1: DANH GIA BUSINESS MINDSET','PART 1: BUSINESS MINDSET EVALUATION',
   '5 chieu danh gia: tai chinh, chien luoc, marketing, nhan su, va he thong.',
   '5 evaluation dimensions: finance, strategy, marketing, people, and systems.',
   'Business Mindset','trending_up'),
  ('loi-nhu-quan-check',1,'PHAN 2: TU SOI CHIEU','PART 2: SELF-REFLECTION',
   'Hai cau hoi mo giup ban nhin sau vao mindset kinh doanh.',
   'Two open questions to look deeply into your business mindset.',
   'Business Mindset','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=0),'ln_q1',0,'select',
   'Ban biet chinh xac doanh thu, chi phi, va loi nhuan hang thang cua phong kham khong?',
   'Do you know exactly your monthly revenue, costs, and profit?',
   '{"1":"Khong theo doi tai chinh, khong biet loi la thang nao","2":"Biet tong the nhung khong co so lieu cu the","3":"Theo doi doanh thu nhung chua ro chi phi va loi nhuan","4":"Co bao cao tai chinh hang thang, biet P&L","5":"He thong tai chinh minh bach: doanh thu, chi phi, loi nhuan, va xu huong"}',
   '{"1":"Not tracking finances, do not know profit/loss","2":"Know overall but no specific numbers","3":"Tracking revenue but unclear on costs and profit","4":"Monthly financial reports, know P&L","5":"Transparent financial system: revenue, costs, profit, and trends"}','business'),
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=0),'ln_q2',1,'select',
   'Phong kham co ke hoach phat trien ro rang cho 1-3 nam toi khong?',
   'Does your clinic have a clear development plan for the next 1-3 years?',
   '{"1":"Khong co ke hoach, song ngay nao hay ngay do","2":"Co muc tieu chung nhung khong co ke hoach cu the","3":"Co ke hoach so luoc nhung khong theo doi tien do","4":"Co ke hoach chi tiet voi KPI va milestone","5":"Ke hoach chien luoc ro rang: vision, 1-3 nam, quarterly OKR"}',
   '{"1":"No plan, living day to day","2":"Have general goals but no specific plan","3":"Have outline plan but not tracking progress","4":"Detailed plan with KPIs and milestones","5":"Clear strategic plan: vision, 1-3 years, quarterly OKRs"}','business'),
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=0),'ln_q3',2,'select',
   'Ban danh bao nhieu thoi gian cho viec quan ly kinh doanh (thay vi chi lam viec lam sang)?',
   'How much time do you spend on business management (instead of just clinical work)?',
   '{"1":"Gan nhu 100% thoi gian cho lam sang, khong co thoi gian kinh doanh","2":"It thoi gian cho kinh doanh, chu yeu giai quyet van de tuc thi","3":"Khoang 10-20% thoi gian cho quan ly","4":"20-30% thoi gian cho kinh doanh va phat trien","5":"Co thoi gian co dinh hang tuan cho chien luoc, tai chinh, va phat trien"}',
   '{"1":"Nearly 100% clinical time, no time for business","2":"Little business time, mostly firefighting","3":"About 10-20% time for management","4":"20-30% time for business and development","5":"Fixed weekly time for strategy, finance, and development"}','business'),
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=0),'ln_q4',3,'select',
   'Phong kham co he thong de thu hut va giu chan benh nhan khong?',
   'Does your clinic have systems to attract and retain patients?',
   '{"1":"Khong co he thong, phu thuoc vao khach cu gioi thieu","2":"Co mot so no luc marketing nhung khong co he thong","3":"Co chien luoc thu hut benh nhan nhung chua chat chat","4":"Co he thong: marketing + referral + retention + follow-up","5":"He thong toan dien: acquisition + experience + loyalty + recovery"}',
   '{"1":"No systems, relying on word of mouth","2":"Some marketing efforts but no system","3":"Patient attraction strategy but not rigorous","4":"Systems in place: marketing + referral + retention + follow-up","5":"Comprehensive system: acquisition + experience + loyalty + recovery"}','business'),
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=0),'ln_q5',4,'select',
   'Ban co dau tu vao viec hoc hoi kinh doanh va phat trien ban than voi tu cach chu doanh nghiep khong?',
   'Do you invest in learning business and developing yourself as a business owner?',
   '{"1":"Khong dau tu thoi gian hoac tien bac vao viec hoc kinh doanh","2":"Thinh thoang doc bai viet nhung khong co he thong","3":"Tham gia mot vai khoa hoc hoac cong dong","4":"Dau tu deu deu: sach, khoa hoc, cong dong doanh nhan","5":"Hoc tap lien tuc voi he thong: mentorship, coaching, mastermind group"}',
   '{"1":"Not investing time or money in learning business","2":"Occasionally reading articles but no system","3":"Participating in some courses or communities","4":"Regular investment: books, courses, entrepreneur communities","5":"Continuous learning with system: mentorship, coaching, mastermind group"}','business');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=1),'ln_open1',0,'textarea',
   'Ban tu nhan minh la mot nguoi lam kinh doanh hay mot nguoi lam nghe? Dieu gi khien ban nghĩ nhu vậy?',
   'Do you see yourself as a business person or a practitioner? What makes you think so?',
   'Nghi ve cach ban nhin nhan cong viec cua minh - la mot nghe nghiep hay mot doanh nghiep, hay ca hai?',
   'Think about how you view your work - as a profession or a business, or both?'),
  ((SELECT id FROM survey_section WHERE survey_id='loi-nhu-quan-check' AND order_idx=1),'ln_open2',1,'textarea',
   'Neu phong kham cua ban phai tu tra tien thue, tien luong, va chi phi - khong co luong bac si - thi no co loi khong?',
   'If your clinic had to pay its own rent, salaries, and expenses - no doctor salary - would it be profitable?',
   'Thu tinh toan don gian: tong thu nhap tu benh nhan tru tat ca chi phi van hanh. Ket qua la gi?',
   'Try a simple calculation: total patient income minus all operating costs. What is the result?');

-- === 25: hieu-qua-check (efficiency) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('hieu-qua-check','hieu-qua-check','Hieu Qua Check','Efficiency Check',
'Mot phong kham co 24 gio nhu nhau nhung hieu qua khac nhau. Kiem tra muc do hieu qua van hanh cua phong kham ban.',
'Every clinic has the same 24 hours but different efficiency. Check your clinic operational efficiency level.',
'Danh gia hieu qua van hanh phong kham','Assess your clinic operational efficiency','["Ch.SYSTEM"]','active',1,'mini',25);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('hieu-qua-check',0,'PHAN 1: DANH GIA HIEU QUA','PART 1: EFFICIENCY EVALUATION',
   '5 chieu danh gia: thoi gian, quy trinh, nhan su, cong nghe, va chi phi.',
   '5 evaluation dimensions: time, processes, people, technology, and cost.',
   'Hieu qua - Efficiency','speed'),
  ('hieu-qua-check',1,'PHAN 2: TU SOI CHIEU','PART 2: SELF-REFLECTION',
   'Hai cau hoi mo giup ban nhin sau vao hieu qua van hanh.',
   'Two open questions to look deeply into operational efficiency.',
   'Hieu qua - Efficiency','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=0),'hq_q1',0,'select',
   'Thoi gian trung binh mot benh nhan ngoi cho sau khi den dung gio hen la bao lau?',
   'What is the average wait time for a patient who arrives on time for their appointment?',
   '{"1":"Hon 45 phut thuong xuyen","2":"30-45 phut thuong xuyen","3":"15-30 phut thinh thoang","4":"Duoi 15 phut thuong xuyen","5":"Dung gio hoac duoi 10 phut, co he thong len lich thong minh"}',
   '{"1":"Over 45 minutes regularly","2":"30-45 minutes regularly","3":"15-30 minutes occasionally","4":"Under 15 minutes regularly","5":"On time or under 10 minutes, with smart scheduling system"}','efficiency'),
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=0),'hq_q2',1,'select',
   'Quy trinh tu khi benh nhan goi dat lich den khi ra ve sau dieu tri duoc thiet ke tot khong?',
   'Is the process from patient call to post-treatment departure well designed?',
   '{"1":"Khong co quy trinh chuan, moi nguoi lam mot kieu","2":"Co quy trinh nhung khong duoc viet ra va khong nhat quan","3":"Co quy trinh co ban duoc viet ra nhung chua duoc toi uu","4":"Co SOP ro rang va doi ngu duoc dao tao theo SOP","5":"Quy trinh duoc thiet ke toi uu: SOP + checklist + automation + feedback loop"}',
   '{"1":"No standard process, everyone does it differently","2":"Have a process but not written and inconsistent","3":"Basic process written but not optimized","4":"Clear SOP with trained team following SOP","5":"Optimized processes: SOP + checklist + automation + feedback loop"}','efficiency'),
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=0),'hq_q3',2,'select',
   'Nhan vien cua ban co biet chinh xac tra cham nhiem va quyen han cua minh khong?',
   'Do your staff know exactly their responsibilities and authority?',
   '{"1":"Khong ro rang, moi nguoi tu quyet dinh hoac cho chi dao","2":"Biet cong viec chinh nhung khong ro quyen han","3":"Co mo ta cong viec nhung chua day du","4":"Ro rang ve tra cham nhiem va co quy trinh bao cao","5":"Co RACI matrix, KPIs ca nhan, va quyen han ro rang cho tung vai tro"}',
   '{"1":"Unclear, everyone decides or waits for instructions","2":"Know main tasks but unclear about authority","3":"Job descriptions exist but not comprehensive","4":"Clear responsibilities and reporting process","5":"RACI matrix, individual KPIs, and clear authority for each role"}','efficiency'),
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=0),'hq_q4',3,'select',
   'Phong kham su dung cong nghe de tu dong hoa va giam thoi gian thu cong khong?',
   'Does your clinic use technology to automate and reduce manual time?',
   '{"1":"It dung cong nghe, hau het viec lam thu cong","2":"Dung mot vai cong cu so nhung chua ket noi","3":"Co phan mem quan ly phong kham nhung chua tan dung het tinh nang","4":"Su dung tot phan mem, mot so tu dong hoa co ban","5":"He thong tu dong hoa toan dien: dat lich, nhac nho, thanh toan, bao cao"}',
   '{"1":"Little technology use, mostly manual work","2":"Using a few digital tools but not connected","3":"Have clinic management software but not fully utilized","4":"Good software usage, some basic automation","5":"Comprehensive automation: scheduling, reminders, payments, reporting"}','efficiency'),
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=0),'hq_q5',4,'select',
   'Chi phi van hanh duoc theo doi va toi uu hoa thuong xuyen khong?',
   'Are operating costs tracked and optimized regularly?',
   '{"1":"Khong theo doi chi phi cu the, chi gi tinh gi","2":"Theo doi chi phi lon nhung khong chi tiet","3":"Co theo doi chi phi hang thang nhung chua phan tich sau","4":"Theo doi chi tiet, phan tich chi phi theo tung hang muc","5":"He thong quan ly chi phi: budget, variance analysis, cost optimization"}',
   '{"1":"Not tracking specific costs, spending as it comes","2":"Tracking major costs but not detailed","3":"Monthly cost tracking but not deeply analyzed","4":"Detailed cost tracking, analyzing costs by category","5":"Cost management system: budget, variance analysis, cost optimization"}','efficiency');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=1),'hq_open1',0,'textarea',
   'Dieu gi lam ban mat nhieu thoi gian nhat moi ngay trong phong kham - thu khong lien quan den dieu tri truc tiep?',
   'What takes the most time each day in your clinic - something not directly related to treatment?',
   'Nghi ve nhung cong viec giay hay hanh chinh ma ban phai lam hang ngay. Dieu gi co the duoc tu dong hoa hoac bo di?',
   'Think about the paperwork or admin tasks you do daily. What could be automated or eliminated?'),
  ((SELECT id FROM survey_section WHERE survey_id='hieu-qua-check' AND order_idx=1),'hq_open2',1,'textarea',
   'Neu ban co the tu dong hoa mot quy trinh trong phong kham, ban se chon quy trinh nao? Tai sao?',
   'If you could automate one process in the clinic, which would you choose? Why?',
   'Nghi ve quy trinh lap di lap lai ma ban hoac doi ngu phai lam moi ngay. Dau la cong viec te nhat ma may moc co the thay the?',
   'Think about repetitive processes you or the team do daily. What is the most boring work that machines could replace?');

-- === 26: co-so-vat-chat-check (facility) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('co-so-vat-chat-check','co-so-vat-chat-check','Co So Vat Chat Check','Facility Check',
'Khong gian phong kham anh huong truc tiep den cam nhan cua benh nhan ve chat luong dich vu. Kiem tra co so vat chat cua ban.',
'The clinic space directly affects patient perception of service quality. Check your facility.',
'Danh gia co so vat chat va khong gian phong kham','Assess clinic facility and space','["Ch.SYSTEM"]','active',1,'mini',26);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('co-so-vat-chat-check',0,'PHAN 1: DANH GIA CO SO VAT CHAT','PART 1: FACILITY EVALUATION',
   '5 chieu danh gia: khong gian, thiet bi, ve sinh, tien nghi, va an toan.',
   '5 evaluation dimensions: space, equipment, hygiene, amenities, and safety.',
   'Co So Vat Chat','domain'),
  ('co-so-vat-chat-check',1,'PHAN 2: TU SOI CHIEU','PART 2: SELF-REFLECTION',
   'Hai cau hoi mo giup ban nhin sau vao co so vat chat.',
   'Two open questions to look deeply into your facility.',
   'Co So Vat Chat','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=0),'cs_q1',0,'select',
   'Khong gian phong kham - sach se, thong moc, va thoai mai cho benh nhan khong?',
   'Is the clinic space - clean, comfortable, and welcoming for patients?',
   '{"1":"Khong gian chat hep, khong thong, benh nhan ngoi cho trong dieu kien khong thoai mai","2":"Co khong gian nhung chua duoc toi uu ve bo tri va cam giac","3":"Khong gian co ban sach se nhung chua tao an tuong dac biet","4":"Khong gian duoc thiet ke tot, sach se, va tao cam giac chuyen nghiep","5":"Khong gian xuat sac: thiet ke chu dao, sach se, tien nghi, va tao trai nghiem tich cuc"}',
   '{"1":"Cramped, not airy, patients uncomfortable waiting","2":"Has space but not optimized for layout and feel","3":"Basic clean space but no special impression","4":"Well-designed space, clean, creates professional feel","5":"Excellent space: thoughtful design, clean, amenities, positive experience"}','facility'),
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=0),'cs_q2',1,'select',
   'Thiet bi va ghe nha khoa duoc bao tri va cap nhat tot khong?',
   'Are equipment and dental chairs well maintained and updated?',
   '{"1":"Thiet bi cu, hong, hoac thieu thuong xuyen","2":"Co thiet bi co ban nhung chua duoc bao tri tot","3":"Thiet bi duoc bao tri nhung chua cap nhat cong nghe moi","4":"Thiet bi tot, duoc bao tri dinh ky va cap nhat khi can","5":"Thiet bi hien dai, duoc bao tri chu dao, va luon san sang cho moi ca dieu tri"}',
   '{"1":"Old equipment, frequently broken or missing","2":"Have basic equipment but not well maintained","3":"Equipment maintained but not updated with new technology","4":"Good equipment, regularly maintained and updated as needed","5":"Modern equipment, meticulously maintained, always ready for every case"}','facility'),
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=0),'cs_q3',2,'select',
   'Tieu chuan ve sinh va khu khuan cua phong kham nhu the nao?',
   'What are your clinic hygiene and sterilization standards?',
   '{"1":"Tieu chuan ve sinh co ban, co the con thieu sot","2":"Co quy trinh ve sinh nhung chua he thong va khong nhat quan","3":"Quy trinh ve sinh co ban duoc tuan thu","4":"Quy trinh ve sinh nghiem ngat, duoc dao tao va theo doi","5":"Tieu chuan vo trung cao nhat: quy trinh chuan quoc te, audit dinh ky, minh bach voi benh nhan"}',
   '{"1":"Basic hygiene standards, possibly with gaps","2":"Have hygiene process but not systematic and consistent","3":"Basic hygiene process being followed","4":"Strict hygiene process, trained and monitored","5":"Highest sterilization standards: international protocols, regular audits, transparent to patients"}','facility'),
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=0),'cs_q4',3,'select',
   'Phong kham co du tien nghi cho benh nhan cho doi - nuoc uong, wifi, sac dien thoai - khong?',
   'Does your clinic have enough amenities for waiting patients - water, wifi, phone charging, etc.?',
   '{"1":"Khong co tien nghi cho benh nhan cho","2":"Co ghe ngoi co ban, khong co tien nghi khac","3":"Co mot vai tien nghi co ban nhung khong duoc duy tri tot","4":"Du tien nghi co ban: wifi, nuoc uong, va sac dien thoai","5":"Trai nghiem cho doi tot: wifi, nuoc uong, sac, tap chi, va co thong tin giao duc benh nhan"}',
   '{"1":"No amenities for waiting patients","2":"Basic seating only, no other amenities","3":"Some basic amenities but not well maintained","4":"Enough basic amenities: wifi, water, phone charging","5":"Great waiting experience: wifi, water, charging, magazines, and patient education materials"}','facility'),
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=0),'cs_q5',4,'select',
   'Phong kham co vi tri thuan tien, de tim, va co cho do xe khong?',
   'Is your clinic conveniently located, easy to find, and with parking?',
   '{"1":"Vi tri kho tim, khong co cho do xe","2":"Vi tri kho tim nhung co cho do xe","3":"Vi tri kha thuan tien hoac co cho do xe","4":"Vi tri thuan tien, co cho do xe, va co bien chi danh ro rang","5":"Vi tri ly tuong: de tim, do xe thuan tien, co bien chi danh ro rang, va ban do online"}',
   '{"1":"Hard to find location, no parking","2":"Hard to find but has parking","3":"Fairly convenient location or has parking","4":"Convenient location, parking available, clear signage","5":"Ideal location: easy to find, convenient parking, clear signage, and online map"}','facility');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=1),'cs_open1',0,'textarea',
   'Benh nhan thuong phan nan hoac khen ngoi dieu gi ve khong gian phong kham cua ban?',
   'What do patients usually complain about or praise regarding your clinic space?',
   'Nghi ve phan hoi gan nhat tu benh nhan ve khong gian, thiet bi, hoac tien nghi. Dieu gi ho hay nhac den?',
   'Think about the most recent patient feedback about space, equipment, or amenities. What do they often mention?'),
  ((SELECT id FROM survey_section WHERE survey_id='co-so-vat-chat-check' AND order_idx=1),'cs_open2',1,'textarea',
   'Neu ban co the thay doi mot dieu ve co so vat chat phong kham ngay lap tuc (khong ton chi phi), ban se chon gi?',
   'If you could change one thing about your clinic facility immediately (at no cost), what would you choose?',
   'Nghi ve nhung thay doi mien phi co the lam ngay - nhu don dep, sap xep lai, thay doi cach bo tri, hay them thong tin cho benh nhan.',
   'Think about free changes you could make immediately - like cleaning, reorganizing, changing layout, or adding patient information.');

-- === 27: phan-biet-thuong-hieu-check (brand) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('phan-biet-thuong-hieu-check','phan-biet-thuong-hieu-check','Phan Biet Thuong Hieu Check','Brand Differentiation Check',
'Trong thi truong nha khoa canh tranh gay gat, dieu khiến benh nhan chon ban thay vi phong kham ben canh la gi? Kiem tra brand differentiation.',
'In a fiercely competitive dental market, what makes patients choose you over the clinic next door? Check your brand differentiation.',
'Danh gia brand positioning va differentiation','Assess brand positioning and differentiation','["Ch.BRAND"]','active',1,'mini',27);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('phan-biet-thuong-hieu-check',0,'PHAN 1: DANH GIA BRAND DIFFERENTIATION','PART 1: BRAND DIFFERENTIATION EVALUATION',
   '5 chieu danh gia: positioning, identity, message, experience, va reputation.',
   '5 evaluation dimensions: positioning, identity, message, experience, and reputation.',
   'Brand Differentiation','diamond'),
  ('phan-biet-thuong-hieu-check',1,'PHAN 2: TU SOI CHIEU','PART 2: SELF-REFLECTION',
   'Hai cau hoi mo giup ban nhin sau vao brand positioning.',
   'Two open questions to look deeply into brand positioning.',
   'Brand Differentiation','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0),'pb_q1',0,'select',
   'Ban co the noi trong 30 giay dieu khiến phong kham khac biet voi cac phong kham khac trong khu vuc khong?',
   'Can you explain in 30 seconds what makes your clinic different from others in the area?',
   '{"1":"Khong ro dieu gi khac biet, gia la yeu to chinh","2":"Co mot vai dieu khac biet nhung chua ro rang va khong nhat quan","3":"Co positioning ro rang nhung chua duoc truyen tai tot","4":"Co positioning ro rang va nhat quan, doi ngu co the dien dat","5":"Brand positioning manh me: tagline, USP ro rang, va duoc truyen tai trong moi touchpoint"}',
   '{"1":"Unclear what is different, price is the main factor","2":"Have some differences but not clear and consistent","3":"Have clear positioning but not well communicated","4":"Clear and consistent positioning, team can articulate it","5":"Strong brand positioning: clear tagline, USP, and communicated across every touchpoint"}','brand'),
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0),'pb_q2',1,'select',
   'Phong kham co brand identity ro rang - logo, mau sac, typography, giong dien - nhat quan tren moi noi khong?',
   'Does your clinic have a clear brand identity - logo, colors, typography, tone - consistent everywhere?',
   '{"1":"Khong co brand identity ro rang, moi noi mot kieu","2":"Co logo nhung khong co brand guide hoac khong nhat quan","3":"Co brand identity co ban nhung chua duoc ap dung nhat quan","4":"Co brand guide va duoc ap dung nhat quan o hau het cac diem cham","5":"Brand identity toan dien: logo + mau + typography + giong dien + template, nhat quan moi noi"}',
   '{"1":"No clear brand identity, different styles everywhere","2":"Have logo but no brand guide or not consistent","3":"Have basic brand identity but not consistently applied","4":"Brand guide and consistently applied at most touchpoints","5":"Comprehensive brand identity: logo + colors + typography + tone + templates, consistent everywhere"}','brand'),
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0),'pb_q3',2,'select',
   'Khi benh nhan nhac den phong kham cua ban, ho thuong dung tu gi de mo ta?',
   'When patients talk about your clinic, what words do they usually use to describe it?',
   '{"1":"Khong biet, khong co phan hoi cu the ve brand","2":"Chi biet gia re hoac gan nha","3":"Biet mot vai dac diem nhung khong co narrative ro rang","4":"Co mot so tu khoa ma benh nhan thuong nhac den","5":"Brand perception manh me: benh nhan co the mo ta phong kham bang 3-5 tu cu the va tich cuc"}',
   '{"1":"Do not know, no specific feedback about brand","2":"Only know cheap or close to home","3":"Know some features but no clear narrative","4":"Have some keywords patients frequently mention","5":"Strong brand perception: patients can describe the clinic with 3-5 specific positive words"}','brand'),
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0),'pb_q4',3,'select',
   'Phong kham co Unique Selling Proposition (USP) - mot loi the canh tranh ro rang ma doi thu kho sao chep - khong?',
   'Does your clinic have a Unique Selling Proposition (USP) - a clear competitive advantage that competitors cannot easily copy?',
   '{"1":"Khong co USP, canh tranh hoan toan bang gia","2":"Co mot vai loi the nhung doi thu co the de dang sao chep","3":"Co USP tiềm nang nhung chua duoc khai thac va truyen thong","4":"Co USP ro rang va duoc truyen thong den benh nhan","5":"USP manh me va ben vung: dich vu dac biet, cong nghe doc quyen, hoac thuong hieu ca nhan manh"}',
   '{"1":"No USP, competing entirely on price","2":"Have some advantages but competitors can easily copy","3":"Have potential USP but not yet exploited and communicated","4":"Have clear USP and communicated to patients","5":"Strong and sustainable USP: special service, proprietary technology, or strong personal brand"}','brand'),
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0),'pb_q5',4,'select',
   'Phong kham co storytelling - cau chuyen ve tai sao ban lam nghe va tai sao benh nhan nen chon ban - khong?',
   'Does your clinic have storytelling - a story about why you do dentistry and why patients should choose you?',
   '{"1":"Khong co storytelling, chi quang ba dich vu","2":"Co mot cau chuyen nhung chua duoc viet ro va nhat quan","3":"Co storytelling co ban duoc chia se bang mieng","4":"Co storytelling ro rang duoc truyen tai qua nhieu kenh","5":"Storytelling manh me: origin story + patient transformation stories + consistent narrative across all channels"}',
   '{"1":"No storytelling, only promoting services","2":"Have a story but not written clearly and consistently","3":"Have basic storytelling shared verbally","4":"Clear storytelling communicated through many channels","5":"Strong storytelling: origin story + patient transformation stories + consistent narrative across all channels"}','brand');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=1),'pb_open1',0,'textarea',
   'Khi ban noi day la phong kham cua toi - dieu gi khiến no dang tu hao va khac biet?',
   'When you say this is my clinic - what makes it worth being proud of and different?',
   'Nghi ve dieu dac biet nhat o phong kham - co the la ky nang dac biet, dich vu khach hang, cong nghe, con nguoi, hay triet ly.',
   'Think about the most special thing about your clinic - it could be special skills, customer service, technology, people, or philosophy.'),
  ((SELECT id FROM survey_section WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=1),'pb_open2',1,'textarea',
   'Neu mot phong kham moi mo ngay canh ban voi gia re hon 30%, ban se lam gi de giu benh nhan?',
   'If a new clinic opened right next to you with 30% lower prices, what would you do to retain patients?',
   'Nghi ve nhung thu KHONG the sao chep bang tien - niem tin, moi quan he, thuong hieu, hay trai nghiem ma ban da xay dung.',
   'Think about things that CANNOT be copied with money - trust, relationships, brand, or experience that you have built.');

-- === 28: tu-van-ban-hang-check (sales) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('tu-van-ban-hang-check','tu-van-ban-hang-check','Tu Van Ban Hang Check','Sales & Consultation Check',
'Nhieu phong kham mat benh nhan vi nhan vien khong biet cach tu van va chot deal hieu qua. Kiem tra ky nang ban hang cua doi ngu.',
'Many clinics lose patients because staff do not know how to consult and close deals effectively. Check your team sales skills.',
'Danh gia ky nang tu van va chot deal','Assess consultation and closing skills','["Ch.CSKH"]','active',1,'mini',28);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('tu-van-ban-hang-check',0,'PHAN 1: DANH GIA KY NANG TU VAN','PART 1: CONSULTATION SKILLS EVALUATION',
   '5 chieu danh gia: lang nghe, hieu nhu cau, giai phap, chot deal, va theo doi.',
   '5 evaluation dimensions: listening, understanding needs, solution, closing, and follow-up.',
   'Tu Van Ban Hang','handshake'),
  ('tu-van-ban-hang-check',1,'PHAN 2: TU SOI CHIEU','PART 2: SELF-REFLECTION',
   'Hai cau hoi mo giup ban nhin sau vao ky nang ban hang.',
   'Two open questions to look deeply into sales skills.',
   'Tu Van Ban Hang','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0),'tv_q1',0,'select',
   'Nhan vien co thuong xuyen lang nghe de hieu nhu cau that cua benh nhan truoc khi de xuat dieu tri khong?',
   'Do staff regularly listen to understand the real needs of patients before proposing treatment?',
   '{"1":"Thuong nhay vao de xuat dieu tri truoc khi hieu nhu cau","2":"Doi khi lang nghe nhung thuong quen hoi ve nhu cau that","3":"Lang nghe tuong doi nhung chua co quy trinh cu the","4":"Co ky thuat lang nghe chu dong, hoi cau hoi mo de hieu nhu cau","5":"Quy trinh lang nghe chuan: cau hoi mo + paraphrasing + empathy + needs identification"}',
   '{"1":"Usually jumping to propose treatment before understanding needs","2":"Sometimes listen but often forget to ask about real needs","3":"Relatively listening but no specific process","4":"Active listening techniques, asking open questions to understand needs","5":"Standard listening process: open questions + paraphrasing + empathy + needs identification"}','sales'),
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0),'tv_q2',1,'select',
   'Nhan vien co biet cach trinh bay gia va cac phuong an dieu tri mot cach ro rang, khong gay ap luc khong?',
   'Do staff know how to present prices and treatment options clearly without pressure?',
   '{"1":"Thuong noi gia mot cach dot ngot, gay ap luc cho benh nhan","2":"Trinh bay gia nhung khong co cau truc hoac khong ro rang","3":"Co trinh bay gia co ban nhung chua du chuyen nghiep","4":"Co kich ban trinh bay gia ro rang, minh bach, va khong gay ap luc","5":"Quy trinh trinh bay gia chuyen nghiep: value framing + transparent pricing + multiple options + no pressure"}',
   '{"1":"Usually announce price abruptly, causing patient pressure","2":"Present price but no structure or unclear","3":"Basic price presentation but not professional enough","4":"Clear pricing presentation script, transparent, no pressure","5":"Professional pricing process: value framing + transparent pricing + multiple options + no pressure"}','sales'),
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0),'tv_q3',2,'select',
   'Nhan vien co ky nang xu ly objection - khi benh nhan noi gia cao, can suy nghi, hoac di dau khac them - khong?',
   'Do staff have objection handling skills - when patients say too expensive, need to think, or will check elsewhere?',
   '{"1":"Khong biet xu ly objection, thuong de benh nhan ra ve khi gap phan doi","2":"Co gan thuyet phuc bang cach giam gia ngay","3":"Biet mot vai cach xu ly nhung chua co he thong","4":"Co ky thuat xu ly objection co ban duoc dao tao","5":"Quy trinh xu ly objection chuan: acknowledge + explore + address + confirm understanding"}',
   '{"1":"Do not know how to handle objections, usually let patients leave when faced with resistance","2":"Try to convince by reducing price immediately","3":"Know some ways but no system","4":"Basic objection handling techniques trained","5":"Standard objection handling process: acknowledge + explore + address + confirm understanding"}','sales'),
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0),'tv_q4',3,'select',
   'Nhan vien co follow-up - lien he lai benh nhan sau khi ho ra ve ma chua quyet dinh - khong?',
   'Do staff follow up - contact patients after they leave without deciding?',
   '{"1":"Khong bao gio follow-up, benh nhan ra ve la thoi","2":"Thinh thoang follow-up mot cach khong co he thong","3":"Co follow-up nhung khong co quy trinh cu the va timing","4":"Co he thong follow-up: kich ban goi lai + timing chuan + CRM tracking","5":"Follow-up chien luoc: multi-channel (call + message + email) + timing toi uu + personalization + tracking"}',
   '{"1":"Never follow up, patients leave and that is it","2":"Occasionally follow up without a system","3":"Follow up but no specific process and timing","4":"Follow-up system: call script + standard timing + CRM tracking","5":"Strategic follow-up: multi-channel (call + message + email) + optimal timing + personalization + tracking"}','sales'),
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0),'tv_q5',4,'select',
   'Nhan vien duoc dao tao ve ky nang ban hang va tu van nha khoa khong?',
   'Are staff trained in dental sales and consultation skills?',
   '{"1":"Khong co dao tao ban hang, ai tu lam theo cach cua minh","2":"Dao tao so luoc ve san pham/dich vu nhung khong co ky nang ban hang","3":"Co mot vai buoi dao tao nhung khong thuong xuyen va khong co thuc hanh","4":"Dao tao ban hang thuong xuyen voi role-play va feedback","5":"Chuong trinh dao tao chuyen nghiep: onboarding + ongoing training + role-play + coaching + KPI tracking"}',
   '{"1":"No sales training, everyone does it their own way","2":"Brief product/service training but no sales skills","3":"Some training sessions but not regular and no practice","4":"Regular sales training with role-play and feedback","5":"Professional training program: onboarding + ongoing training + role-play + coaching + KPI tracking"}','sales');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=1),'tv_open1',0,'textarea',
   'Ke ve mot tinh huong khi nhan vien mat benh nhan vi khong chot duoc deal. Dieu gi da xay ra?',
   'Describe a situation when a staff member lost a patient because they could not close the deal. What happened?',
   'Nghi ve mot ca cu the. Benh nhan co ve quan tam nhung cuoi cung khong lam. Dieu gi co the da lam khac di?',
   'Think about a specific case. The patient seemed interested but ultimately did not proceed. What could have been done differently?'),
  ((SELECT id FROM survey_section WHERE survey_id='tu-van-ban-hang-check' AND order_idx=1),'tv_open2',1,'textarea',
   'Ban nghi nhan vien cua ban so dieu gi nhat khi tu van ban hang? Dieu gi ngan can ho chot deal tu tin?',
   'What do you think your staff fears the most when consulting and selling? What prevents them from closing deals confidently?',
   'Nghi ve nhung rao can tam ly: so benh nhan khong thich, so bi coi la ban hang, hay thieu kien thuc ve san pham?',
   'Think about psychological barriers: fear of patient disapproval, fear of being seen as selling, or lack of product knowledge.');

-- === 29: marketing-online-check (digital) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('marketing-online-check','marketing-online-check','Marketing Online Check','Online Marketing Check',
'Benh nhan tim ban tren Google, Facebook, TikTok nhu the nao? Kiem tra digital presence cua phong kham.',
'How do patients find you on Google, Facebook, TikTok? Check your clinic digital presence.',
'Danh gia digital presence va online marketing','Assess digital presence and online marketing','["Ch.BRAND"]','active',1,'mini',29);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('marketing-online-check',0,'PHAN 1: DANH GIA DIGITAL PRESENCE','PART 1: DIGITAL PRESENCE EVALUATION',
   '5 chieu danh gia: website, Google, social media, content, va reputation.',
   '5 evaluation dimensions: website, Google, social media, content, and reputation.',
   'Marketing Online','language'),
  ('marketing-online-check',1,'PHAN 2: TU SOI CHIEU','PART 2: SELF-REFLECTION',
   'Hai cau hoi mo giup ban nhin sau vao digital presence.',
   'Two open questions to look deeply into your digital presence.',
   'Marketing Online','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=0),'mo_q1',0,'select',
   'Phong kham co website rieng chuyen nghiep khong? Website do toi uu cho di dong va co thong tin day du khong?',
   'Does your clinic have a professional website? Is it mobile-optimized and has complete information?',
   '{"1":"Khong co website hoac website rat so sai","2":"Co website nhung thieu thong tin, khong duoc cap nhat","3":"Co website co ban voi thong tin chinh","4":"Website tot: thong tin day du, mobile-friendly, fast loading","5":"Website xuat sac: SEO tot, booking online, patient education content, testimonials"}',
   '{"1":"No website or very basic website","2":"Has website but missing information, not updated","3":"Basic website with main information","4":"Good website: complete info, mobile-friendly, fast loading","5":"Excellent website: good SEO, online booking, patient education content, testimonials"}','digital'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=0),'mo_q2',1,'select',
   'Phong kham co Google Business Profile va duoc quan ly tot khong?',
   'Does your clinic have a Google Business Profile and is it well managed?',
   '{"1":"Khong co Google Business Profile","2":"Co nhung thong tin khong day du va khong duoc cap nhat","3":"Co Google Business Profile voi thong tin co ban duoc cap nhat","4":"Google Business Profile tot: thong tin day du, hinh anh, review duoc tra loi","5":"Google Business Profile xuat sac: posts thuong xuyen, reviews cao, Q&A active, photos updated"}',
   '{"1":"No Google Business Profile","2":"Has one but information incomplete and not updated","3":"Google Business Profile with basic updated information","4":"Good Google Business Profile: complete info, photos, reviews responded to","5":"Excellent Google Business Profile: regular posts, high reviews, active Q&A, photos updated"}','digital'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=0),'mo_q3',2,'select',
   'Phong kham co active tren mang xa hoi khong? Noi dung co duoc dang deu dat va chat luong khong?',
   'Is your clinic active on social media? Is content posted regularly and of good quality?',
   '{"1":"Khong co mang xa hoi hoac co nhung bo hoang","2":"Co social media nhung dang khong deu va noi dung yeu","3":"Dang noi dung tuong doi deu nhung chua co chien luoc ro rang","4":"Active tren 1-2 nen tang voi noi dung co chien luoc","5":"Multi-platform presence voi content strategy: educational + engagement + community building"}',
   '{"1":"No social media or abandoned accounts","2":"Has social media but posting inconsistent and weak content","3":"Relatively regular posting but no clear strategy","4":"Active on 1-2 platforms with strategic content","5":"Multi-platform presence with content strategy: educational + engagement + community building"}','digital'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=0),'mo_q4',3,'select',
   'Phong kham co online reputation tot - reviews, testimonials - khong?',
   'Does your clinic have good online reputation - reviews, testimonials?',
   '{"1":"Khong co reviews hoac toan review tieu cuc","2":"It reviews va chua chu dong thu thap testimonials","3":"Co reviews tich cuc nhung chua chu dong xay dung","4":"Chu dong thu thap reviews va co chien luoc xay dung reputation","5":"Reputation system: chu dong thu thap, phan hoi tat ca reviews, showcase testimonials"}',
   '{"1":"No reviews or all negative reviews","2":"Few reviews and not proactively collecting testimonials","3":"Have positive reviews but not proactively building","4":"Proactively collecting reviews and building reputation strategy","5":"Reputation system: proactive collection, respond to all reviews, showcase testimonials"}','digital'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=0),'mo_q5',4,'select',
   'Phong kham co chien luoc digital marketing ro rang - biet doi tuong muc tieu, kenh uu tien, va content plan - khong?',
   'Does your clinic have a clear digital marketing strategy - target audience, priority channels, and content plan?',
   '{"1":"Khong co chien luoc digital marketing, cu dang gi thi dang","2":"Co mot vai no luc digital nhung khong co chien luoc","3":"Co hieu biet co ban nhung chua co ke hoach cu the","4":"Co chien luoc digital marketing co ban voi target audience va kenh uu tien","5":"Chien luoc digital toan dien: audience segmentation, content calendar, channel strategy, analytics"}',
   '{"1":"No digital marketing strategy, posting whatever","2":"Some digital efforts but no strategy","3":"Basic understanding but no specific plan","4":"Basic digital marketing strategy with target audience and priority channels","5":"Comprehensive digital strategy: audience segmentation, content calendar, channel strategy, analytics"}','digital');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=1),'mo_open1',0,'textarea',
   'Khi mot benh nhan moi tim phong kham nha khoa tren Google, dieu gi khiến ho chon ban thay vi doi thu? Dieu do co hien thi online khong?',
   'When a new patient searches for a dental clinic on Google, what makes them choose you over a competitor? Is that reflected online?',
   'Nghi ve why us cua phong kham. Neu ban la benh nhan tim kiem online, ban se thay dieu do o dau tren internet?',
   'Think about the why us of your clinic. If you were a patient searching online, where would you see that on the internet?'),
  ((SELECT id FROM survey_section WHERE survey_id='marketing-online-check' AND order_idx=1),'mo_open2',1,'textarea',
   'Ban da thu nhung kenh digital marketing nao? Kenh nao hieu qua nhat va kenh nao chua hoat dong tot?',
   'What digital marketing channels have you tried? Which works best and which has not performed well?',
   'Liet ke: Facebook, Google Ads, TikTok, Website, Zalo OA, SEO... Dau la kenh mang lai benh nhan that su?',
   'List: Facebook, Google Ads, TikTok, Website, Zalo OA, SEO... Which channel brings real patients?');

-- === 30: thu-vi-tri-check (position) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('thu-vi-tri-check','thu-vi-tri-check','Thu Vi Tri Check','Competitive Position Check',
'Phong kham cua ban dang o dau so voi doi thu? Kiem tra vi the canh tranh va chien luoc phat trien.',
'Where does your clinic stand compared to competitors? Check competitive positioning and development strategy.',
'Phan tich SWOT va vi the canh tranh','SWOT analysis and competitive positioning','["Ch.STARTUP"]','active',1,'mini',30);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('thu-vi-tri-check',0,'PHAN 1: DANH GIA VI THE CANH TRANH','PART 1: COMPETITIVE POSITIONING EVALUATION',
   '5 chieu danh gia: phan tich doi thu, loi the, chien luoc, khac biet, va tam nhin.',
   '5 evaluation dimensions: competitor analysis, strengths, strategy, differentiation, and vision.',
   'Vi the canh tranh','compare_arrows'),
  ('thu-vi-tri-check',1,'PHAN 2: TU SOI CHIEU','PART 2: SELF-REFLECTION',
   'Hai cau hoi mo giup ban nhin sau vao vi the canh tranh.',
   'Two open questions to look deeply into your competitive positioning.',
   'Vi the canh tranh','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=0),'tvtri_q1',0,'select',
   'Ban co biet ro 3-5 doi thu chinh trong khu vuc va diem manh/yeu cua ho khong?',
   'Do you clearly know the 3-5 main competitors in your area and their strengths/weaknesses?',
   '{"1":"Khong quan tam hoac khong biet doi thu la ai","2":"Biet ten mot vai doi thu nhung khong phan tich sau","3":"Biet doi thu chinh nhung khong co thong tin chi tiet","4":"Co phan tich doi thu co ban: gia, dich vu, vi tri","5":"Phan tich doi thu toan dien: SWOT, gia, chat luong, marketing, USP, patient reviews"}',
   '{"1":"Not interested or do not know who competitors are","2":"Know names of some competitors but not deeply analyzed","3":"Know main competitors but no detailed information","4":"Basic competitor analysis: pricing, services, location","5":"Comprehensive competitor analysis: SWOT, pricing, quality, marketing, USP, patient reviews"}','position'),
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=0),'tvtri_q2',1,'select',
   'Ban co biet chinh xac diem manh doc nhat cua phong kham ma doi thu kho sao chep khong?',
   'Do you know the exact unique strengths of your clinic that competitors cannot easily copy?',
   '{"1":"Khong ro diem manh doc nhat, nghi minh giong doi thu","2":"Co mot vai y nhung chua duoc xac dinh ro rang","3":"Biet diem manh nhung chua khai thac tot","4":"Co 1-2 diem manh ro rang duoc truyen thong","5":"Core competencies ro rang: nhung gi chi minh lam duoc, kho sao chep, duoc khach hang cong nhan"}',
   '{"1":"Unclear about unique strengths, think you are similar to competitors","2":"Have some ideas but not clearly identified","3":"Know strengths but not well exploited","4":"Have 1-2 clear strengths communicated","5":"Clear core competencies: what only you can do, hard to copy, recognized by customers"}','position'),
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=0),'tvtri_q3',2,'select',
   'Phong kham co chien luoc phat trien ngan han va dai han ro rang khong?',
   'Does your clinic have clear short-term and long-term development strategies?',
   '{"1":"Khong co chien luoc, lam viec theo cam tinh","2":"Co muc tieu chung nhung khong co chien luoc cu the","3":"Co ke hoach ngan han nhung thieu tam nhin dai han","4":"Co chien luoc ro rang cho 1-2 nam voi action plan","5":"Chien luoc toan dien: 3-5 nam vision + annual plan + quarterly OKRs + contingency"}',
   '{"1":"No strategy, working by intuition","2":"Have general goals but no specific strategy","3":"Have short-term plan but lack long-term vision","4":"Clear 1-2 year strategy with action plan","5":"Comprehensive strategy: 3-5 year vision + annual plan + quarterly OKRs + contingency"}','position'),
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=0),'tvtri_q4',3,'select',
   'Phong kham co khac biet hoa duoc trong mat benh nhan - ho chon ban vi ly do gi thay vi doi thu?',
   'Is your clinic differentiated in patients eyes - why do they choose you instead of competitors?',
   '{"1":"Khong co su khac biet ro rang, benh nhan chon vi gia hoac gan nha","2":"Co mot vai khac biet nhung chua manh va chua duoc nhan thuc","3":"Co USP tiềm nang nhung chua duoc truyen thong hieu qua","4":"Co USP ro rang va duoc truyen thong tot den benh nhan","5":"Brand differentiation manh: USP doc nhat, duoc truyen thong xuyen suot, patient loyalty cao"}',
   '{"1":"No clear differentiation, patients choose based on price or proximity","2":"Have some differences but not strong and not perceived","3":"Have potential USP but not effectively communicated","4":"Have clear USP and well communicated to patients","5":"Strong brand differentiation: unique USP, consistently communicated, high patient loyalty"}','position'),
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=0),'tvtri_q5',4,'select',
   'Ban co tam nhin ro rang ve phong kham trong 3-5 nam toi khong - phat trien quy mo, chuyen mon hoa, hay toi uu hoa?',
   'Do you have a clear vision for your clinic in the next 3-5 years - scale up, specialize, or optimize?',
   '{"1":"Khong co tam nhin, song ngay nao hay ngay do","2":"Co uoc mo chung nhung chua co ke hoach cu the","3":"Co dinh huong nhung chua xac dinh ro con duong","4":"Co tam nhin ro rang voi cac milestone cu the","5":"Tam nhin chien luoc ro rang: growth path + specialization + investment plan + exit strategy"}',
   '{"1":"No vision, living day to day","2":"Have general dreams but no specific plan","3":"Have direction but not clearly defined path","4":"Clear vision with specific milestones","5":"Clear strategic vision: growth path + specialization + investment plan + exit strategy"}','position');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=1),'tvtri_open1',0,'textarea',
   'Neu mot phong kham moi voi day du tien va doi ngu gioi mo ngay canh ban, dieu gi khiến benh nhan hien tai VAN o lai voi ban?',
   'If a new clinic with full funding and a great team opened right next to you, what would make current patients STILL stay with you?',
   'Nghi ve nhung thu KHONG the mua bang tien - moi quan he, niem tin, thoi gian, hay kinh nghiem ma ban da xay dung voi benh nhan.',
   'Think about things that CANNOT be bought with money - relationships, trust, time, or experience you have built with patients.'),
  ((SELECT id FROM survey_section WHERE survey_id='thu-vi-tri-check' AND order_idx=1),'tvtri_open2',1,'textarea',
   'Ban thay minh dang o giai doan nao cua vong doi phong kham - khoi dau, tang truong, on dinh, hay suy thoai? Dieu gi cho thay dieu do?',
   'What stage of the clinic lifecycle do you think you are in - beginning, growth, stability, or decline? What indicates this?',
   'Cac dau hieu: doanh thu tang/giam, benh nhan moi, benh nhan cu quay lai, doi ngu on dinh, ap luc canh tranh...',
   'Signs: revenue growing/declining, new patients, returning patients, team stability, competitive pressure...');

-- === 31: thich-ung-dung-check (adapt) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('thich-ung-dung-check','thich-ung-dung-check','Thich Ung Check','Adaptability Check',
'Thi truong nha khoa thay doi nhanh chong. Ban thich ung duoc voi xu huong moi va cong nghe moi khong? Kiem tra kha nang thich ung.',
'The dental market changes quickly. Can you adapt to new trends and technology? Check your adaptability.',
'Danh gia kha nang thich ung va chuyen doi so','Assess adaptability and digital transformation','["Ch.STARTUP"]','active',1,'mini',31);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('thich-ung-dung-check',0,'PHAN 1: DANH GIA KHA NANG THICH UNG','PART 1: ADAPTABILITY EVALUATION',
   '5 chieu danh gia: cong nghe, xu huong, mo hinh, doi ngu, va tam ly.',
   '5 evaluation dimensions: technology, trends, models, team, and mindset.',
   'Thich Ung','autorenew'),
  ('thich-ung-dung-check',1,'PHAN 2: TU SOI CHIEU','PART 2: SELF-REFLECTION',
   'Hai cau hoi mo giup ban nhin sau vao kha nang thich ung.',
   'Two open questions to look deeply into your adaptability.',
   'Thich Ung','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=0),'tu_q1',0,'select',
   'Phong kham co cap nhat va ap dung cong nghe moi khi can khong?',
   'Does your clinic update and apply new technology when needed?',
   '{"1":"Khong theo doi cong nghe moi, dung cong nghe cu","2":"Biet cong nghe moi nhung ngai thay doi","3":"Thinh thoang cap nhat khi bat buoc","4":"Chu dong theo doi va ap dung cong nghe moi co chon loc","5":"Chien luoc cong nghe: research + evaluate + adopt + train + measure ROI"}',
   '{"1":"Not following new technology, using old technology","2":"Know new technology but reluctant to change","3":"Occasionally update when forced","4":"Proactively following and selectively adopting new technology","5":"Technology strategy: research + evaluate + adopt + train + measure ROI"}','adapt'),
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=0),'tu_q2',1,'select',
   'Ban co theo doi va phan ung voi xu huong thi truong nha khoa khong - gia ca, dich vu moi, ky vong benh nhan thay doi?',
   'Do you follow and react to dental market trends - pricing, new services, changing patient expectations?',
   '{"1":"Khong theo doi xu huong, giu nguyen mo hinh cu","2":"Biet co thay doi nhung phan ung cham","3":"Thinh thoang dieu chinh khi thay ro van de","4":"Chu dong theo doi va dieu chinh theo xu huong","5":"Strategic awareness: trend monitoring + market intelligence + proactive adaptation"}',
   '{"1":"Not following trends, keeping old model","2":"Know changes but slow to react","3":"Occasionally adjust when problems become clear","4":"Proactively following and adjusting to trends","5":"Strategic awareness: trend monitoring + market intelligence + proactive adaptation"}','adapt'),
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=0),'tu_q3',2,'select',
   'Ban co san sang thay doi mo hinh kinh doanh hoac dich vu khi thi truong yeu cau khong?',
   'Are you willing to change your business model or services when the market requires it?',
   '{"1":"Khong muon thay doi, giu nguyen nhu cu","2":"Chi thay doi khi bi ep buoc","3":"San sang thay doi nhung can thoi gian dai","4":"Thay doi linh hoat khi can, co ke hoach chuyen doi","5":"Agile transformation: fast decision-making + experiment + pivot + scale"}',
   '{"1":"Do not want to change, keeping the same","2":"Only change when forced","3":"Willing to change but needs long time","4":"Flexibly changing when needed, with transition plan","5":"Agile transformation: fast decision-making + experiment + pivot + scale"}','adapt'),
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=0),'tu_q4',3,'select',
   'Doi ngu cua ban co kha nang hoc hoi va thich ung voi quy trinh moi khong?',
   'Does your team have the ability to learn and adapt to new processes?',
   '{"1":"Doi ngu khang cu thay doi, khong muon hoc cai moi","2":"Mot so nguoi chiu thich ung, phan lon khang cu","3":"Doi ngu co ban thich ung nhung can thoi gian va huong dan","4":"Doi ngu thich ung tot, co van hoa hoc tap","5":"Learning culture: training + mentorship + psychological safety + continuous improvement"}',
   '{"1":"Team resists change, does not want to learn new things","2":"Some people willing to adapt, majority resists","3":"Team basically adapts but needs time and guidance","4":"Team adapts well, has learning culture","5":"Learning culture: training + mentorship + psychological safety + continuous improvement"}','adapt'),
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=0),'tu_q5',4,'select',
   'Ban co tim kiem va hoc hoi tu nhung nguon moi - khoa hoc, cong dong, mentors - de phat trien phong kham khong?',
   'Do you seek and learn from new sources - courses, communities, mentors - to develop your clinic?',
   '{"1":"Khong tim kiem nguon hoc moi, tu lam theo kinh nghiem","2":"Thinh thoang doc bai viet nhung khong co he thong","3":"Tham gia mot vai khoa hoc hoac cong dong","4":"Chu dong hoc hoi: khoa hoc + community + mentorship + benchmarking","5":"Learning system: regular education + peer network + expert mentorship + industry conferences"}',
   '{"1":"Not seeking new learning sources, working by experience","2":"Occasionally read articles but no system","3":"Participating in some courses or communities","4":"Proactively learning: courses + community + mentorship + benchmarking","5":"Learning system: regular education + peer network + expert mentorship + industry conferences"}','adapt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=1),'tu_open1',0,'textarea',
   'Ke ve mot lan phong kham phai thay doi lon - vi covid, vi doi thu, vi cong nghe. Ban da phan ung nhu the nao?',
   'Tell about a time when your clinic had to make a big change - due to covid, competitors, or technology. How did you react?',
   'Nghi ve mot thay doi lon ma phong kham phai trai qua. Ban da thich ung nhanh hay cham? Dieu gi giup hoac can tro ban?',
   'Think about a major change your clinic had to go through. Did you adapt quickly or slowly? What helped or hindered you?'),
  ((SELECT id FROM survey_section WHERE survey_id='thich-ung-dung-check' AND order_idx=1),'tu_open2',1,'textarea',
   'Cong nghe hoac xu huong nao trong nha khoa ma ban thay ha hang hon nhung chua ap dung? Dieu gi ngan can ban?',
   'What dental technology or trend do you find promising but have not applied? What is preventing you?',
   'Vi du: AI diagnosis, teledentistry, digital marketing, membership plans, new treatment techniques... Dieu gi khiến ban chua nhay vao?',
   'Examples: AI diagnosis, teledentistry, digital marketing, membership plans, new treatment techniques... What makes you hesitant to jump in?');

-- === 32: thuong-hieu-ca-nhan-check (personal) ===

INSERT INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, order_index)
VALUES ('thuong-hieu-ca-nhan-check','thuong-hieu-ca-nhan-check','Thuong Hieu Ca Nhan Check','Personal Branding Check',
'Trong thoi dai mang xa hoi, thuong hieu ca nhan cua chu phong kham la tai san quy gia. Kiem tra personal branding cua ban.',
'In the social media age, the personal brand of the clinic owner is a valuable asset. Check your personal branding.',
'Danh gia personal branding va authority cua chu phong kham','Assess personal branding and authority of clinic owners','["Ch.BRAND"]','active',1,'mini',32);

INSERT INTO survey_section (survey_id, order_idx, title_vi, title_en, subtitle_vi, subtitle_en, ref, icon)
VALUES
  ('thuong-hieu-ca-nhan-check',0,'PHAN 1: DANH GIA THUONG HIEU CA NHAN','PART 1: PERSONAL BRANDING EVALUATION',
   '5 chieu danh gia: online presence, content, authority, network, va consistency.',
   '5 evaluation dimensions: online presence, content, authority, network, and consistency.',
   'Thuong Hieu Ca Nhan','person'),
  ('thuong-hieu-ca-nhan-check',1,'PHAN 2: TU SOI CHIEU','PART 2: SELF-REFLECTION',
   'Hai cau hoi mo giup ban nhin sau vao thuong hieu ca nhan.',
   'Two open questions to look deeply into your personal branding.',
   'Thuong Hieu Ca Nhan','psychology_alt');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0),'thcn_q1',0,'select',
   'Ban co online presence ca nhan manh - profile, hinh anh chuyen nghiep, va thong diep ro rang - khong?',
   'Do you have a strong personal online presence - profile, professional photos, and clear messaging?',
   '{"1":"Khong co online presence ca nhan, hoan toan an danh","2":"Co mot vai tai khoan nhung khong duoc cham chot","3":"Co online presence co ban voi thong tin chinh","4":"Online presence tot: profile day du, hinh anh chuyen nghiep, thong diep nhat quan","5":"Personal brand presence manh: consistent across platforms, professional photography, clear positioning statement"}',
   '{"1":"No personal online presence, completely anonymous","2":"Have some accounts but not well maintained","3":"Basic online presence with main information","4":"Good online presence: complete profile, professional photos, consistent messaging","5":"Strong personal brand presence: consistent across platforms, professional photography, clear positioning statement"}','personal'),
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0),'thcn_q2',1,'select',
   'Ban co chia se noi dung chuyen mon - kien thuc nha khoa, case studies, insights - de xay dung authority khong?',
   'Do you share professional content - dental knowledge, case studies, insights - to build authority?',
   '{"1":"Khong chia se noi dung, khong muon cong khai","2":"Thinh thoang chia se nhung khong co he thong","3":"Chia se noi dung deu dat nhung chua co chien luoc ro rang","4":"Content strategy hieu qua: educational content + case studies + personal insights","5":"Authority content engine: consistent educational content + thought leadership + patient education + industry recognition"}',
   '{"1":"Do not share content, do not want to be public","2":"Occasionally share but no system","3":"Regular content sharing but no clear strategy","4":"Effective content strategy: educational content + case studies + personal insights","5":"Authority content engine: consistent educational content + thought leadership + patient education + industry recognition"}','personal'),
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0),'thcn_q3',2,'select',
   'Ban duoc cong nhan la chuyen gia trong linh vuc nha khoa - boi benh nhan, dong nghiep, hay cong dong - khong?',
   'Are you recognized as an expert in dentistry - by patients, peers, or the community?',
   '{"1":"Khong co recognition, chi la bac si binh thuong","2":"Duoc mot so benh nhan biet toi nhung khong phai expert","3":"Co danh tieu dia phuong trong cong dong","4":"Duoc cong nhan la chuyen gia trong mot linh vuc chuyen mon cu the","5":"Thought leader: speaking engagements + publications + media coverage + professional awards"}',
   '{"1":"No recognition, just a regular doctor","2":"Known by some patients but not seen as an expert","3":"Have local reputation in the community","4":"Recognized as an expert in a specific professional area","5":"Thought leader: speaking engagements + publications + media coverage + professional awards"}','personal'),
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0),'thcn_q4',3,'select',
   'Ban co mang luoi quan he manh - ket noi voi cac chuyen gia khac, tham gia cong dong nha khoa, xay dung referral network - khong?',
   'Do you have a strong network - connections with other professionals, dental community involvement, referral network building?',
   '{"1":"Khong quan tam den networking, chi tap trung cong viec","2":"Co mot vai moi quan he nhung khong chu dong xay dung","3":"Tham gia mot vai cong dong nhung chua tich cuc","4":"Chu dong xay dung network: cong dong + referral partners + professional associations","5":"Strategic networking: mastermind groups + cross-referrals + industry events + mentorship network"}',
   '{"1":"Not interested in networking, only focused on work","2":"Have a few relationships but not proactively building","3":"Participating in some communities but not actively","4":"Proactively building network: communities + referral partners + professional associations","5":"Strategic networking: mastermind groups + cross-referrals + industry events + mentorship network"}','personal'),
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0),'thcn_q5',4,'select',
   'Thong diep va hinh anh ca nhan cua ban co nhat quan tren moi nen tang va trong moi tuong tac khong?',
   'Is your personal messaging and image consistent across all platforms and in every interaction?',
   '{"1":"Khong quan tam den consistency, cu tu nhien","2":"Tuong doi nhat quan nhung khong co y dinh","3":"Co co gang nhat quan nhung chua co he thong","4":"Nhat quan tot: messaging + visual identity + tone of voice","5":"Hoan toan nhat quan: personal brand guidelines + consistent storytelling + authentic presence"}',
   '{"1":"Not concerned about consistency, just being natural","2":"Relatively consistent but not intentional","3":"Trying to be consistent but no system","4":"Good consistency: messaging + visual identity + tone of voice","5":"Fully consistent: personal brand guidelines + consistent storytelling + authentic presence"}','personal');

INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=1),'thcn_open1',0,'textarea',
   'Khi ai do nhac den ten ban trong cong dong nha khoa, ho thuong noi gi ve ban? Dieu do co dung voi cach ban muon duoc nhin nhan khong?',
   'When someone mentions your name in the dental community, what do they usually say about you? Does that match how you want to be perceived?',
   'Nghi ve word of mouth ve ban trong cong dong. Benh nhan, dong nghiep, va doi tac noi gi ve ban khi ban khong o do?',
   'Think about word of mouth about you in the community. What do patients, peers, and partners say about you when you are not there?'),
  ((SELECT id FROM survey_section WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=1),'thcn_open2',1,'textarea',
   'Ban da dau tu bao nhieu thoi gian va no luc vao viec xay dung thuong hieu ca nhan? Ban thay ket qua nhu the nao?',
   'How much time and effort have you invested in building personal branding? How do you see the results?',
   'Nghi ve ROI cua personal branding - co mang lai benh nhan moi, referral, hay co hoi kinh doanh khong? Dieu gi da hieu qua va chua hieu qua?',
   'Think about the ROI of personal branding - does it bring new patients, referrals, or business opportunities? What has worked and what has not?');
