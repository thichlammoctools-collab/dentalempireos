-- Questions for 5 free scanners
-- Section IDs: startup(135,136) cf(137,138) rf(139,140) dl(141,142) kvt(143,144)

-- ===================== STARTUP-CHECK questions =====================
-- Section 0 (id=135): 5 select questions
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
(135,'st_q1',0,'select',
'Phòng khám đã đủ giấy phép hoạt động, PCCC, và các thủ tục pháp lý cần thiết chưa?',
'Does your clinic have all necessary operating licenses, fire safety, and legal permits?',
'{"1":"Còn thiếu nhiều giấy tờ quan trọng","2":"Có giấy phép cơ bản nhưng chưa đầy đủ","3":"Đủ giấy phép chính, đang hoàn thiện phụ","4":"Đầy đủ tất cả giấy phép + định kỳ gia hạn","5":"Hoàn hảo — mọi thứ gọn gàng, có lịch gia hạn tự động"}',
'{"1":"Missing many important documents","2":"Basic license only, not fully compliant","3":"Main permits ok, secondary pending","4":"All permits complete + periodic renewal","5":"Perfect — everything organized with auto-renewal"}',
'startup'),
(135,'st_q2',1,'select',
'Vị trí và cơ sở vật chất của phòng khám đã phù hợp với đối tượng khách hàng mục tiêu chưa?',
'Is your clinic location and facilities suitable for your target patients?',
'{"1":"Chưa ổn định, đang tìm chỗ","2":"Có chỗ nhưng chưa phù hợp với đối tượng","3":"Vị trí tạm được, đang cải thiện dần","4":"Vị trí tốt, dễ tìm, phù hợp với khách hàng","5":"Vị trí lý tưởng + không gian chuyên nghiệp"}',
'{"1":"Not stable, still searching","2":"Have space but not suitable","3":"Temporary location, gradually improving","4":"Good location, easy to find, suitable for patients","5":"Ideal location + professional space"}',
'startup'),
(135,'st_q3',2,'select',
'Thiết bị và công nghệ của phòng khám đã đáp ứng được các dịch vụ cơ bản chưa?',
'Does your clinic equipment and technology meet basic service needs?',
'{"1":"Thiếu nhiều thiết bị cần thiết","2":"Có thiết bị cơ bản nhưng thiếu nhiều dịch vụ chính","3":"Đủ cho dịch vụ cơ bản, đang tích lũy thêm","4":"Có đủ thiết bị cho các dịch vụ chính + vài thiết bị nâng cao","5":"Trang bị đầy đủ + công nghệ hiện đại cho hầu hết dịch vụ"}',
'{"1":"Missing essential equipment","2":"Basic equipment only, missing many services","3":"Enough for basic services, accumulating more","4":"Full equipment for main services + some advanced tools","5":"Fully equipped + modern technology"}',
'startup'),
(135,'st_q4',3,'select',
'Quy trình khám chữa và vận hành cơ bản đã được thiết lập chưa?',
'Have basic examination and operational procedures been established?',
'{"1":"Chưa có quy trình, hoạt động tùy hứng","2":"Có vài quy trình nhưng chưa chuẩn hóa","3":"Quy trình cơ bản có, đang dần chuẩn hóa","4":"Quy trình chuẩn cho hầu hết các hoạt động chính","5":"Hệ thống SOP đầy đủ, nhân viên được đào tạo bài bản"}',
'{"1":"No procedures, running ad-hoc","2":"Some procedures but not standardized","3":"Basic procedures, gradually standardizing","4":"Standard procedures for most main operations","5":"Complete SOP system, staff fully trained"}',
'startup'),
(135,'st_q5',4,'select',
'Đội ngũ nhân viên đã ổn định và được đào tạo để phục vụ bệnh nhân chưa?',
'Is your team stable and trained to serve patients?',
'{"1":"Đội ngũ chưa tuyển đủ, thiếu nhân sự trầm trọng","2":"Tuyển được nhưng chưa ổn định, hay nghỉ","3":"Đội ngũ cơ bản đủ, cần thêm thời gian gắn kết","4":"Đội ngũ ổn định, được đào tạo cơ bản","5":"Đội ngũ gắn bó, được đào tạo bài bản, có văn hóa làm việc"}',
'{"1":"Team not complete, severe staff shortage","2":"Recruited but unstable, high turnover","3":"Basic team complete, needs time to bond","4":"Stable team with basic training","5":"Committed team, fully trained, strong work culture"}',
'startup');

-- Section 1 (id=136): 2 textarea questions
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
(136,'st_open1',0,'textarea',
'Thách thức lớn nhất của bạn trong giai đoạn đầu là gì? Kể một tình huống cụ thể gần đây.',
'What is your biggest challenge in the early stage? Describe a recent specific situation.',
'Mô tả ngắn gọn một tình huống cụ thể.',
'Briefly describe a specific situation.'),
(136,'st_open2',1,'textarea',
'Nếu bạn có thể thay đổi một điều về phòng khám ngay bây giờ, bạn sẽ chọn điều gì? Tại sao?',
'If you could change one thing about your clinic right now, what would it be? Why?',
'Nghĩ về điều có tác động lớn nhất đến sự phát triển trong 6 tháng tới.',
'Think about what would have the biggest impact on growth in the next 6 months.');

-- ===================== CONTENT-FUNNEL-CHECK questions =====================
-- Section 0 (id=137): 5 select questions
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
(137,'cf_q1',0,'select',
'Website phòng khám của bạn đã được tối ưu để thu hút và chuyển đổi bệnh nhân chưa?',
'Has your clinic website been optimized to attract and convert patients?',
'{"1":"Chưa có website hoặc rất sơ khai","2":"Có website nhưng chưa tối ưu, ít người xem","3":"Website cơ bản đã có, đang tối thiểu hóa dần","4":"Website tốt, có nội dung chất lượng, tỷ lệ chuyển đổi khá","5":"Website xuất sắc — tối ưu SEO, tốc độ nhanh, chuyển đổi tốt"}',
'{"1":"No website or very basic","2":"Have website but not optimized, low traffic","3":"Basic website exists, gradually improving","4":"Good website with quality content, decent conversion","5":"Excellent website — SEO optimized, fast, high conversion"}',
'content'),
(137,'cf_q2',1,'select',
'Chiến lược SEO và tìm kiếm organics của phòng khám đang hoạt động tốt như thế nào?',
'How well is your clinic SEO and organic search strategy working?',
'{"1":"Không có chiến lược SEO nào","2":"Có đề cập đến SEO nhưng chưa có kế hoạch cụ thể","3":"Đang thực hiện một vài hoạt động SEO cơ bản","4":"Có chiến lược SEO rõ ràng, thứ hạng từ khóa tốt ở local","5":"SEO mạnh — top ranking cho các từ khóa chính, lưu lượng organics cao"}',
'{"1":"No SEO strategy at all","2":"Mentioned SEO but no concrete plan","3":"Doing some basic SEO activities","4":"Clear SEO strategy, good local keyword ranking","5":"Strong SEO — top ranking for key terms, high organic traffic"}',
'content'),
(137,'cf_q3',2,'select',
'Hoạt động content marketing (blog, video, bài viết) của phòng khám như thế nào?',
'How is your clinic content marketing (blog, video, articles) performing?',
'{"1":"Không có content marketing","2":"Đăng bài thỉnh thoảng nhưng không có chiến lược","3":"Đăng đều đặn nhưng nội dung chưa chuyên sâu","4":"Content chất lượng tốt, có lịch đăng, thu hút được tương tác","5":"Content system hoàn chỉnh — đa dạng định dạng, đều đặn, có engagement"}',
'{"1":"No content marketing","2":"Posting occasionally with no strategy","3":"Posting regularly but content not in-depth","4":"Good quality content, consistent schedule, some engagement","5":"Complete content system — diverse formats, consistent, high engagement"}',
'content'),
(137,'cf_q4',3,'select',
'Kênh social media của phòng khám đã được xây dựng và quản lý tốt chưa?',
'How well are your clinic social media channels built and managed?',
'{"1":"Không có kênh social hoặc bỏ bê","2":"Có vài kênh nhưng đăng không đều, không theo chiến lược","3":"Quản lý social được nhưng chủ yếu đăng thông tin thuần túy","4":"Social media active, có tương tác, xây dựng thương hiệu","5":"Social media xuất sắc — nội dung đa dạng, tương tác cao, xây dựng cộng đồng"}',
'{"1":"No social or neglected","2":"Some channels but inconsistent, no strategy","3":"Managing social but mostly posting basic info","4":"Active social media with engagement, building brand","5":"Excellent social — diverse content, high engagement, community building"}',
'content'),
(137,'cf_q5',4,'select',
'Phòng khám có hệ thống đo lường và theo dõi hiệu quả marketing không?',
'Does your clinic have a system to measure and track marketing effectiveness?',
'{"1":"Không đo lường gì cả","2":"Có theo dõi một vài số liệu nhưng không có hệ thống","3":"Theo dõi được một số KPI cơ bản","4":"Có dashboard theo dõi hiệu quả các kênh marketing","5":"Hệ thống đo lường toàn diện — mọi kênh đều được tracking và phân tích"}',
'{"1":"No measurement at all","2":"Tracking some metrics but no system","3":"Following some basic KPIs","4":"Dashboard tracking marketing channel effectiveness","5":"Comprehensive measurement — all channels tracked and analyzed"}',
'content');

-- Section 1 (id=138): 2 textarea
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
(138,'cf_open1',0,'textarea',
'Kênh nào mang lại nhiều bệnh nhân nhất cho phòng khám hiện tại? Tại sao?',
'Which channel brings the most patients to your clinic right now? Why?',
'Mô tả kênh đó và lý do bạn nghĩ nó hiệu quả.',
'Describe that channel and why you think it works.'),
(138,'cf_open2',1,'textarea',
'Nếu phải tập trung vào một kênh marketing duy nhất trong 3 tháng tới, bạn sẽ chọn gì?',
'If you had to focus on only one marketing channel for the next 3 months, which would it be?',
'Chọn một và giải thích lý do chọn kênh đó.',
'Choose one and explain why that channel.');

-- ===================== REFERRAL-CHECK questions =====================
-- Section 0 (id=139): 5 select questions
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
(139,'rf_q1',0,'select',
'Phòng khám có chương trình khuyến khích giới thiệu (referral) chính thức chưa?',
'Does your clinic have an official referral incentive program?',
'{"1":"Không có chương trình referral nào","2":"Có ý tưởng nhưng chưa triển khai thành chương trình","3":"Có chương trình nhưng chưa rõ ràng, nhân viên ít nhắc đến","4":"Có chương trình rõ ràng, nhân viên được đào tạo giới thiệu","5":"Chương trình referral chuyên nghiệp — ưu đãi hấp dẫn, theo dõi tự động"}',
'{"1":"No referral program at all","2":"Have ideas but not formalized","3":"Have program but unclear, staff rarely mentions it","4":"Clear program, staff trained to refer","5":"Professional referral program — attractive incentives, automatic tracking"}',
'referral'),
(139,'rf_q2',1,'select',
'Bệnh nhân cũ có được kích hoạt để giới thiệu người thân không?',
'Are existing patients activated to refer family and friends?',
'{"1":"Không có hoạt động nào kích hoạt bệnh nhân cũ","2":"Thỉnh thoảng nhắc nhở nhưng không có chiến lược cụ thể","3":"Có gửi nhắc nhở định kỳ nhưng tỷ lệ phản hồi thấp","4":"Có chiến lược rõ ràng với tỷ lệ phản hồi khá","5":"Hệ thống re-activation hiệu quả — bệnh nhân chủ động giới thiệu"}',
'{"1":"No patient activation activities","2":"Occasional reminders but no specific strategy","3":"Periodic reminders but low response rate","4":"Clear strategy with decent response rate","5":"Effective re-activation system — patients proactively refer"}',
'referral'),
(139,'rf_q3',2,'select',
'Quy trình tiếp nhận bệnh nhân được giới thiệu đã được chuẩn hóa chưa?',
'Has the process for receiving referred patients been standardized?',
'{"1":"Không có quy trình riêng cho bệnh nhân referral","2":"Tiếp nhận tùy hứng, không có tracking riêng","3":"Có hỏi nguồn giới thiệu nhưng chưa theo dõi hệ thống","4":"Có tracking nguồn giới thiệu trong CRM hoặc hồ sơ","5":"Quy trình chuẩn — tracking đầy đủ, báo cáo referral theo tháng"}',
'{"1":"No special process for referred patients","2":"Ad-hoc reception, no separate tracking","3":"Ask referral source but not systematically tracked","4":"Tracking referral source in CRM or records","5":"Standard process — full tracking, monthly referral reports"}',
'referral'),
(139,'rf_q4',3,'select',
'Phòng khám có đo lường tỷ lệ bệnh nhân đến từ referral không?',
'Does your clinic measure the percentage of patients from referrals?',
'{"1":"Không đo lường gì về referral","2":"Biết có referral nhưng không có số liệu cụ thể","3":"Ước lượng tỷ lệ referral nhưng không chính xác","4":"Theo dõi được tỷ lệ referral qua hồ sơ bệnh nhân","5":"Đo lường chính xác — biết tỷ lệ % referral và xu hướng theo tháng"}',
'{"1":"No referral measurement","2":"Know referrals happen but no specific data","3":"Estimate referral rate but not accurate","4":"Tracking referral rate through patient records","5":"Accurate measurement — know exact referral % and monthly trends"}',
'referral'),
(139,'rf_q5',4,'select',
'Nhân viên phòng khám có được đào tạo để chủ động nhắc đến dịch vụ cho bệnh nhân không?',
'Are clinic staff trained to proactively mention services to patients?',
'{"1":"Không có đào tạo, nhân viên không chủ động","2":"Một vài nhân viên tự phát chủ động","3":"Có nhắc nhở nhưng chưa có quy trình chuẩn","4":"Đào tạo cơ bản, hầu hết nhân viên biết khi nào nhắc","5":"Đào tạo bài bản — quy trình chuẩn, nhân viên tự tin, tự nhiên"}',
'{"1":"No training, staff not proactive","2":"A few staff naturally proactive","3":"Reminders but no standard process","4":"Basic training, most staff know when to mention","5":"Comprehensive training — standard process, staff confident and natural"}',
'referral');

-- Section 1 (id=140): 2 textarea
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
(140,'rf_open1',0,'textarea',
'Bạn đã làm gì để khuyến khích bệnh nhân cũ giới thiệu người thân đến phòng khám?',
'What have you done to encourage existing patients to refer family and friends to your clinic?',
'Mô tả ngắn gọn các hoạt động referral hiện tại.',
'Briefly describe your current referral activities.'),
(140,'rf_open2',1,'textarea',
'Bạn nghĩ tại sao bệnh nhân cũ (hoặc không) giới thiệu phòng khám cho người khác?',
'Why do you think existing patients do (or don''t) refer your clinic to others?',
'Nghĩ về trải nghiệm của bệnh nhân từ khi đặt hẹn đến khi điều trị xong.',
'Think about the patient experience from booking to treatment completion.');

-- ===================== DO-LUONG-CHECK questions =====================
-- Section 0 (id=141): 5 select questions
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
(141,'dl_q1',0,'select',
'Phòng khám có xác định và theo dõi các KPI tài chính cơ bản không?',
'Does your clinic define and track basic financial KPIs?',
'{"1":"Không theo dõi KPI tài chính nào","2":"Theo dõi doanh thu tháng nhưng không phân tích sâu","3":"Theo dõi doanh thu, chi phí, lợi nhuận cơ bản","4":"Có dashboard tài chính, theo dõi đều đặn","5":"Hệ thống tài chính toàn diện — phân tích chi tiết, so sánh với kế hoạch, dự báo"}',
'{"1":"Not tracking any financial KPIs","2":"Tracking monthly revenue only, no deep analysis","3":"Tracking revenue, expenses, basic profit","4":"Financial dashboard, regular monitoring","5":"Comprehensive financial system — detailed analysis, plan comparison, forecasting"}',
'metrics'),
(141,'dl_q2',1,'select',
'Phòng khám có theo dõi các chỉ số vận hành hàng ngày không?',
'Does your clinic track daily operational metrics?',
'{"1":"Không theo dõi chỉ số vận hành","2":"Theo dõi một vài số liệu rờm rạ nhưng không hệ thống","3":"Ghi chép số bệnh nhân, ca khám hàng ngày","4":"Có bảng theo dõi vận hành hàng ngày đầy đủ","5":"Hệ thống vận hành số hóa — theo dõi real-time, báo cáo tự động"}',
'{"1":"No operational metrics tracking","2":"Tracking some scattered data but not systematic","3":"Recording daily patient count and appointments","4":"Complete daily operational tracking board","5":"Digitized operations — real-time tracking, automatic reporting"}',
'metrics'),
(141,'dl_q3',2,'select',
'Phòng khám có đo lường hiệu quả marketing và nguồn khách không?',
'Does your clinic measure marketing effectiveness and patient sources?',
'{"1":"Không đo lường hiệu quả marketing","2":"Biết nguồn khách chung chung nhưng không có số liệu","3":"Theo dõi được nguồn khách chính qua hỏi bệnh nhân","4":"Có hệ thống tracking nguồn khách và chi phí acquisition","5":"Marketing analytics toàn diện — biết CAC, LTV, ROI từng kênh"}',
'{"1":"No marketing effectiveness measurement","2":"Know general patient sources but no data","3":"Tracking main patient sources through patient questions","4":"System for tracking patient sources and acquisition cost","5":"Comprehensive marketing analytics — know CAC, LTV, ROI per channel"}',
'metrics'),
(141,'dl_q4',3,'select',
'Dữ liệu bệnh nhân được thu thập và sử dụng để cải thiện dịch vụ như thế nào?',
'How are patient data collected and used to improve services?',
'{"1":"Không thu thập dữ liệu bệnh nhân có hệ thống","2":"Có lưu hồ sơ bệnh nhân nhưng không phân tích","3":"Thu thập phản hồi thỉnh thoảng nhưng không có quy trình chuẩn","4":"Có khảo sát/phản hồi định kỳ và phân tích","5":"Hệ thống phản hồi chuyên nghiệp — NPS, phân tích xu hướng, cải thiện liên tục"}',
'{"1":"No systematic patient data collection","2":"Keeping patient records but not analyzing","3":"Occasional feedback but no standard process","4":"Regular feedback surveys and analysis","5":"Professional feedback system — NPS, trend analysis, continuous improvement"}',
'metrics'),
(141,'dl_q5',4,'select',
'Phòng khám có sử dụng báo cáo dữ liệu để ra quyết định kinh doanh không?',
'Does your clinic use data reports to make business decisions?',
'{"1":"Quyết định kinh doanh dựa hoàn toàn trên cảm tính","2":"Quyết định chủ yếu theo cảm tính, thỉnh thoảng dựa vào số liệu","3":"Sử dụng số liệu cho một số quyết định quan trọng","4":"Thường xuyên dựa vào dữ liệu để ra quyết định","5":"Văn hóa data-driven — mọi quyết định quan trọng đều dựa trên dữ liệu"}',
'{"1":"Business decisions entirely based on intuition","2":"Decisions mostly intuitive, occasionally data-backed","3":"Using data for some important decisions","4":"Regularly using data for decision-making","5":"Data-driven culture — every major decision backed by data"}',
'metrics');

-- Section 1 (id=142): 2 textarea
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
(142,'dl_open1',0,'textarea',
'Hiện tại bạn theo dõi những chỉ số nào? Đã có công cụ gì để đo lường?',
'What metrics are you currently tracking? What tools do you use for measurement?',
'Liệt kê các chỉ số và công cụ bạn đang sử dụng.',
'List the metrics and tools you are currently using.'),
(142,'dl_open2',1,'textarea',
'Điều gì ngăn cản bạn đo lường hiệu quả hơn? Thiếu thời gian, công cụ, hay nhận thức?',
'What prevents you from measuring more effectively? Lack of time, tools, or awareness?',
'Nghĩ về rào cản lớn nhất với văn hóa đo lường.',
'Think about the biggest barrier to a measurement culture.');

-- ===================== KHO-VAT-TU-CHECK questions =====================
-- Section 0 (id=143): 5 select questions
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, scale_labels_vi, scale_labels_en, dimension)
VALUES
(143,'kvt_q1',0,'select',
'Hệ thống theo dõi tồn kho vật tư tiêu hao của phòng khám như thế nào?',
'How does your clinic track consumable inventory levels?',
'{"1":"Không theo dõi tồn kho, hay thiếu hụt đột xuất","2":"Theo dõi bằng sổ sách hoặc Excel rời rạc","3":"Có danh sách tồn kho nhưng cập nhật không thường xuyên","4":"Có hệ thống theo dõi tồn kho khá đầy đủ","5":"Hệ thống quản lý tồn kho chuyên nghiệp — real-time, alert tự động"}',
'{"1":"No inventory tracking, frequent stockouts","2":"Tracking on paper or scattered spreadsheets","3":"Have inventory list but not updated regularly","4":"Fairly complete inventory tracking system","5":"Professional inventory management — real-time, automatic alerts"}',
'inventory'),
(143,'kvt_q2',1,'select',
'Quy trình đặt hàng và nhập kho vật tư đã được chuẩn hóa chưa?',
'Has the process for ordering and receiving supplies been standardized?',
'{"1":"Đặt hàng tùy hứng, không có quy trình","2":"Có quy trình nhưng không nhất quán","3":"Quy trình cơ bản có, một người phụ trách","4":"Quy trình rõ ràng, có người phụ trách, theo dõi được","5":"Quy trình chuẩn hóa — có SOP, approval workflow, tracking đầy đủ"}',
'{"1":"Ad-hoc ordering, no process","2":"Have process but inconsistent","3":"Basic process exists, one person responsible","4":"Clear process, responsible person, trackable","5":"Standardized process — SOP, approval workflow, complete tracking"}',
'inventory'),
(143,'kvt_q3',2,'select',
'Phòng khám có kiểm soát chi phí vật tư và so sánh giá giữa các nhà cung cấp không?',
'Does your clinic control supply costs and compare prices between vendors?',
'{"1":"Không so sánh giá, mua từ một nguồn quen","2":"Thỉnh thoảng hỏi giá nhưng không có hệ thống","3":"So sánh giá cho một số vật tư quan trọng","4":"Có danh sách nhà cung cấp và so sánh giá định kỳ","5":"Hệ thống procurement tốt — so sánh giá tất cả vật tư, đàm phán tốt"}',
'{"1":"No price comparison, buying from familiar vendor","2":"Occasionally asking prices but no system","3":"Comparing prices for some important supplies","4":"Vendor list and periodic price comparison","5":"Good procurement system — all supplies priced, good negotiation"}',
'inventory'),
(143,'kvt_q4',3,'select',
'Hệ thống lưu trữ và bảo quản vật tư trong phòng khám như thế nào?',
'How is supply storage and preservation organized in your clinic?',
'{"1":"Vật tư lưu trữ lộn xộn, không có hệ thống","2":"Có nơi lưu trữ nhưng không có tổ chức rõ ràng","3":"Lưu trữ cơ bản có tổ chức, biết đồ nào ở đâu","4":"Kho lưu trữ có tổ chức tốt, có nhãn, dễ tìm","5":"Hệ thống lưu trữ xuất sắc — phân loại, nhãn rõ, bảo quản đúng chuẩn"}',
'{"1":"Supplies stored chaotically, no system","2":"Have storage but no clear organization","3":"Basic organized storage, know where things are","4":"Well-organized storage with labels, easy to find","5":"Excellent storage system — classified, labeled, proper preservation"}',
'inventory'),
(143,'kvt_q5',4,'select',
'Phòng khám có đo lường chi phí vật tư trên mỗi ca điều trị không?',
'Does your clinic measure supply cost per treatment procedure?',
'{"1":"Không đo lường chi phí vật tư theo ca","2":"Biết chi phí chung nhưng không phân tích theo ca","3":"Ước lượng chi phí vật tư cho một số dịch vụ chính","4":"Tính được chi phí vật tư cho hầu hết dịch vụ","5":"Đo lường chính xác — biết chi phí vật tư từng dịch vụ, tối ưu hóa được"}',
'{"1":"No supply cost measurement per procedure","2":"Know general costs but no per-procedure analysis","3":"Estimating supply costs for some main services","4":"Can calculate supply costs for most services","5":"Accurate measurement — know exact supply cost per service, can optimize"}',
'inventory');

-- Section 1 (id=144): 2 textarea
INSERT INTO survey_question (section_id, question_id, order_idx, type, label_vi, label_en, placeholder_vi, placeholder_en)
VALUES
(144,'kvt_open1',0,'textarea',
'Những vật tư nào phòng khám hay thiếu hụt nhất? Nguyên nhân là gì?',
'Which supplies does your clinic most frequently run out of? What are the causes?',
'Mô tả ngắn gọn các vật tư hay hết và tần suất.',
'Briefly describe which supplies run out and how often.'),
(144,'kvt_open2',1,'textarea',
'Bạn đã thử giải pháp nào để quản lý kho vật tư tốt hơn chưa? Kết quả ra sao?',
'Have you tried any solutions to manage inventory better? What were the results?',
'Kể về những nỗ lực trước đó và bài học rút ra.',
'Tell about previous attempts and lessons learned.');
