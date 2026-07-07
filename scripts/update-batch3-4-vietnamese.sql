-- Update Vietnamese text for 10 new scanners (orders 23-32) using question_id only
-- survey_question.question_id is globally unique, so WHERE question_id = 'xxx' is sufficient

-- === 23: marketing-content-check ===
UPDATE survey_definition SET title_vi='Marketing Content Check', subtitle_vi='Đánh giá chất lượng content marketing' WHERE id='marketing-content-check';
UPDATE survey_section SET title_vi='PHẦN 1: ĐÁNH GIÁ CONTENT', subtitle_vi='5 chiều đánh giá: plan, quality, consistency, SEO, và engagement.' WHERE survey_id='marketing-content-check' AND order_idx=0;
UPDATE survey_section SET title_vi='PHẦN 2: TỰ SOI CHIẾU', subtitle_vi='Hai câu hỏi mở giúp bạn nhìn sâu vào content.' WHERE survey_id='marketing-content-check' AND order_idx=1;
UPDATE survey_question SET label_vi='Phòng khám có content plan — lịch đăng bài, chủ đề rõ ràng, và target audience được định nghĩa — không?' WHERE question_id='mc_q1';
UPDATE survey_question SET label_vi='Chất lượng content — hình ảnh, video, văn bản — của phòng khám như thế nào?' WHERE question_id='mc_q2';
UPDATE survey_question SET label_vi='Phòng khám có đăng content đều đặt trên nhiều kênh — website, Facebook, TikTok, YouTube — không?' WHERE question_id='mc_q3';
UPDATE survey_question SET label_vi='Content của phòng khám có được tối ưu SEO và tìm kiếm được trên Google không?' WHERE question_id='mc_q4';
UPDATE survey_question SET label_vi='Content có tạo engagement — like, comment, share, tin nhắn — từ bệnh nhân không?' WHERE question_id='mc_q5';
UPDATE survey_question SET label_vi='Nội dung nào của phòng khám được bệnh nhân yêu thích nhất? Tại sao?', placeholder_vi='Nghĩ về những bài post, video, hay content mà bệnh nhân thường xuyên phản hồi tích cực.' WHERE question_id='mc_open1';
UPDATE survey_question SET label_vi='Bạn gặp khó khăn gì khi tạo content? Điều gì ngăn cản bạn?', placeholder_vi='Nghĩ về các rào cản: thời gian, kỹ năng, ý tưởng, hay nhân lực.' WHERE question_id='mc_open2';

-- === 24: loi-nhu-quan-check ===
UPDATE survey_definition SET title_vi='Lời Như Quản Check', subtitle_vi='Đánh giá mindset kinh doanh của chủ phòng khám' WHERE id='loi-nhu-quan-check';
UPDATE survey_section SET title_vi='PHẦN 1: ĐÁNH GIÁ BUSINESS MINDSET', subtitle_vi='5 chiều đánh giá: tài chính, chiến lược, marketing, nhân sự, và hệ thống.' WHERE survey_id='loi-nhu-quan-check' AND order_idx=0;
UPDATE survey_section SET title_vi='PHẦN 2: TỰ SOI CHIẾU', subtitle_vi='Hai câu hỏi mở giúp bạn nhìn sâu vào mindset kinh doanh.' WHERE survey_id='loi-nhu-quan-check' AND order_idx=1;
UPDATE survey_question SET label_vi='Bạn biết chính xác doanh thu, chi phí, và lợi nhuận hàng tháng của phòng khám không?' WHERE question_id='ln_q1';
UPDATE survey_question SET label_vi='Phòng khám có kế hoạch phát triển rõ ràng cho 1-3 năm tới không?' WHERE question_id='ln_q2';
UPDATE survey_question SET label_vi='Bạn dành bao nhiêu thời gian cho việc quản lý kinh doanh (thay vì chỉ làm việc lâm sàng)?' WHERE question_id='ln_q3';
UPDATE survey_question SET label_vi='Phòng khám có hệ thống để thu hút và giữ chân bệnh nhân không?' WHERE question_id='ln_q4';
UPDATE survey_question SET label_vi='Bạn có đầu tư vào việc học hỏi kinh doanh và phát triển bản thân với tư cách chủ doanh nghiệp không?' WHERE question_id='ln_q5';
UPDATE survey_question SET label_vi='Bạn tự nhận mình là một người làm kinh doanh hay một người làm nghề? Điều gì khiến bạn nghĩ như vậy?', placeholder_vi='Nghĩ về cách bạn nhìn nhận công việc của mình — là một nghề nghiệp hay một doanh nghiệp, hay cả hai?' WHERE question_id='ln_open1';
UPDATE survey_question SET label_vi='Nếu phòng khám của bạn phải tự trả tiền thuê, tiền lương, và chi phí — không có lương bác sĩ — thì nó có lời không?', placeholder_vi='Thử tính toán đơn giản: tổng thu nhập từ bệnh nhân trừ tất cả chi phí vận hành. Kết quả là gì?' WHERE question_id='ln_open2';

-- === 25: hieu-qua-check ===
UPDATE survey_definition SET title_vi='Hiệu Qua Check', subtitle_vi='Đánh giá hiệu quả vận hành phòng khám' WHERE id='hieu-qua-check';
UPDATE survey_section SET title_vi='PHẦN 1: ĐÁNH GIÁ HIỆU QUẢ', subtitle_vi='5 chiều đánh giá: thời gian, quy trình, nhân sự, công nghệ, và chi phí.' WHERE survey_id='hieu-qua-check' AND order_idx=0;
UPDATE survey_section SET title_vi='PHẦN 2: TỰ SOI CHIẾU', subtitle_vi='Hai câu hỏi mở giúp bạn nhìn sâu vào hiệu quả vận hành.' WHERE survey_id='hieu-qua-check' AND order_idx=1;
UPDATE survey_question SET label_vi='Thời gian trung bình một bệnh nhân ngồi chờ sau khi đến đúng giờ hẹn là bao lâu?' WHERE question_id='hq_q1';
UPDATE survey_question SET label_vi='Quy trình từ khi bệnh nhân gọi đặt lịch đến khi ra về sau điều trị được thiết kế tốt không?' WHERE question_id='hq_q2';
UPDATE survey_question SET label_vi='Nhân viên của bạn có biết chính xác trách nhiệm và quyền hạn của mình không?' WHERE question_id='hq_q3';
UPDATE survey_question SET label_vi='Phòng khám sử dụng công nghệ để tự động hóa và giảm thời gian thủ công không?' WHERE question_id='hq_q4';
UPDATE survey_question SET label_vi='Chi phí vận hành được theo dõi và tối ưu hóa thường xuyên không?' WHERE question_id='hq_q5';
UPDATE survey_question SET label_vi='Điều gì làm bạn mất nhiều thời gian nhất mỗi ngày trong phòng khám — thứ không liên quan đến điều trị trực tiếp?', placeholder_vi='Nghĩ về những công việc "giấy" hay "hành chính" mà bạn phải làm hàng ngày. Điều gì có thể được tự động hóa hoặc bỏ đi?' WHERE question_id='hq_open1';
UPDATE survey_question SET label_vi='Nếu bạn có thể tự động hóa một quy trình trong phòng khám, bạn sẽ chọn quy trình nào? Tại sao?', placeholder_vi='Nghĩ về quy trình lặp đi lặp lại mà bạn hoặc đội ngũ phải làm mỗi ngày. Đâu là "công việc tẻ nhạt nhất" mà máy móc có thể thay thế?' WHERE question_id='hq_open2';

-- === 26: co-so-vat-chat-check ===
UPDATE survey_definition SET title_vi='Cơ Sở Vật Chất Check', subtitle_vi='Đánh giá cơ sở vật chất và không gian phòng khám' WHERE id='co-so-vat-chat-check';
UPDATE survey_section SET title_vi='PHẦN 1: ĐÁNH GIÁ CƠ SỞ VẬT CHẤT', subtitle_vi='5 chiều đánh giá: không gian, thiết bị, vệ sinh, tiện nghi, và an toàn.' WHERE survey_id='co-so-vat-chat-check' AND order_idx=0;
UPDATE survey_section SET title_vi='PHẦN 2: TỰ SOI CHIẾU', subtitle_vi='Hai câu hỏi mở giúp bạn nhìn sâu vào cơ sở vật chất.' WHERE survey_id='co-so-vat-chat-check' AND order_idx=1;
UPDATE survey_question SET label_vi='Không gian phòng khám — sạch sẽ, thoáng mát, và thoải mái cho bệnh nhân không?' WHERE question_id='cs_q1';
UPDATE survey_question SET label_vi='Thiết bị và ghế nha khoa được bảo trì và cập nhật tốt không?' WHERE question_id='cs_q2';
UPDATE survey_question SET label_vi='Tiêu chuẩn vệ sinh và khử khuẩn của phòng khám như thế nào?' WHERE question_id='cs_q3';
UPDATE survey_question SET label_vi='Phòng khám có đủ tiện nghi cho bệnh nhân chờ đợi — nước uống, wifi, sạc điện thoại, v.v. — không?' WHERE question_id='cs_q4';
UPDATE survey_question SET label_vi='Phòng khám có vị trí thuận tiện, dễ tìm, và có chỗ đỗ xe không?' WHERE question_id='cs_q5';
UPDATE survey_question SET label_vi='Bệnh nhân thường phàn nàn hoặc khen ngợi điều gì về không gian phòng khám của bạn?', placeholder_vi='Nghĩ về phản hồi gần nhất từ bệnh nhân về không gian, thiết bị, hoặc tiện nghi. Điều gì họ hay nhắc đến?' WHERE question_id='cs_open1';
UPDATE survey_question SET label_vi='Nếu bạn có thể thay đổi một điều về cơ sở vật chất phòng khám ngay lập tức (không tốn chi phí), bạn sẽ chọn gì?', placeholder_vi='Nghĩ về những thay đổi "miễn phí" có thể làm ngay — như dọn dẹp, sắp xếp lại, thay đổi cách bố trí, hay thêm thông tin cho bệnh nhân.' WHERE question_id='cs_open2';

-- === 27: phan-biet-thuong-hieu-check ===
UPDATE survey_definition SET title_vi='Phân Biệt Thương Hiệu Check', subtitle_vi='Đánh giá brand positioning và differentiation' WHERE id='phan-biet-thuong-hieu-check';
UPDATE survey_section SET title_vi='PHẦN 1: ĐÁNH GIÁ BRAND DIFFERENTIATION', subtitle_vi='5 chiều đánh giá: positioning, identity, message, experience, và reputation.' WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=0;
UPDATE survey_section SET title_vi='PHẦN 2: TỰ SOI CHIẾU', subtitle_vi='Hai câu hỏi mở giúp bạn nhìn sâu vào brand positioning.' WHERE survey_id='phan-biet-thuong-hieu-check' AND order_idx=1;
UPDATE survey_question SET label_vi='Bạn có thể nói trong 30 giây điều khiến phòng khám khác biệt với các phòng khám khác trong khu vực không?' WHERE question_id='pb_q1';
UPDATE survey_question SET label_vi='Phòng khám có brand identity rõ ràng — logo, màu sắc, typography, giọng điệu — nhất quán trên mọi nơi không?' WHERE question_id='pb_q2';
UPDATE survey_question SET label_vi='Khi bệnh nhân nhắc đến phòng khám của bạn, họ thường dùng từ gì để mô tả?' WHERE question_id='pb_q3';
UPDATE survey_question SET label_vi='Phòng khám có Unique Selling Proposition (USP) — một lợi thế cạnh tranh rõ ràng mà đối thủ khó sao chép — không?' WHERE question_id='pb_q4';
UPDATE survey_question SET label_vi='Phòng khám có storytelling — câu chuyện về tại sao bạn làm nghề và tại sao bệnh nhân nên chọn bạn — không?' WHERE question_id='pb_q5';
UPDATE survey_question SET label_vi='Khi bạn nói "đây là phòng khám của tôi" — điều gì khiến nó đáng tự hào và khác biệt?', placeholder_vi='Nghĩ về điều đặc biệt nhất ở phòng khám — có thể là kỹ năng đặc biệt, dịch vụ khách hàng, công nghệ, con người, hay triết lý.' WHERE question_id='pb_open1';
UPDATE survey_question SET label_vi='Nếu một phòng khám mới mở ngay cạnh bạn với giá rẻ hơn 30%, bạn sẽ làm gì để giữ bệnh nhân?', placeholder_vi='Nghĩ về những thứ KHÔNG thể sao chép bằng tiền — niềm tin, mối quan hệ, thương hiệu, hay trải nghiệm mà bạn đã xây dựng.' WHERE question_id='pb_open2';

-- === 28: tu-van-ban-hang-check ===
UPDATE survey_definition SET title_vi='Tư Vấn Bán Hàng Check', subtitle_vi='Đánh giá kỹ năng tư vấn và chốt deal' WHERE id='tu-van-ban-hang-check';
UPDATE survey_section SET title_vi='PHẦN 1: ĐÁNH GIÁ KỸ NĂNG TƯ VẤN', subtitle_vi='5 chiều đánh giá: lắng nghe, hiểu nhu cầu, giải pháp, chốt deal, và theo dõi.' WHERE survey_id='tu-van-ban-hang-check' AND order_idx=0;
UPDATE survey_section SET title_vi='PHẦN 2: TỰ SOI CHIẾU', subtitle_vi='Hai câu hỏi mở giúp bạn nhìn sâu vào kỹ năng bán hàng.' WHERE survey_id='tu-van-ban-hang-check' AND order_idx=1;
UPDATE survey_question SET label_vi='Nhân viên có thường xuyên lắng nghe để hiểu nhu cầu thực sự của bệnh nhân trước khi đề xuất điều trị không?' WHERE question_id='tv_q1';
UPDATE survey_question SET label_vi='Nhân viên có biết cách trình bày giá và các phương án điều trị một cách rõ ràng, không gây áp lực không?' WHERE question_id='tv_q2';
UPDATE survey_question SET label_vi='Nhân viên có kỹ năng xử lý objection — khi bệnh nhân nói "giá cao", "cần suy nghĩ", hoặc "đi đâu khám thêm" — không?' WHERE question_id='tv_q3';
UPDATE survey_question SET label_vi='Nhân viên có follow-up — liên hệ lại bệnh nhân sau khi họ ra về mà chưa quyết định — không?' WHERE question_id='tv_q4';
UPDATE survey_question SET label_vi='Nhân viên được đào tạo về kỹ năng bán hàng và tư vấn nha khoa không?' WHERE question_id='tv_q5';
UPDATE survey_question SET label_vi='Kể về một tình huống khi nhân viên mất bệnh nhân vì không chốt được deal. Điều gì đã xảy ra?', placeholder_vi='Nghĩ về một ca cụ thể. Bệnh nhân có vẻ quan tâm nhưng cuối cùng không làm. Điều gì có thể đã làm khác đi?' WHERE question_id='tv_open1';
UPDATE survey_question SET label_vi='Bạn nghĩ nhân viên của bạn sợ điều gì nhất khi tư vấn bán hàng? Điều gì ngăn cản họ chốt deal tự tin?', placeholder_vi='Nghĩ về những rào cản tâm lý: sợ bệnh nhân không thích, sợ bị coi là "bán hàng", hay thiếu kiến thức về sản phẩm.' WHERE question_id='tv_open2';

-- === 29: marketing-online-check ===
UPDATE survey_definition SET title_vi='Marketing Online Check', subtitle_vi='Đánh giá digital presence và online marketing' WHERE id='marketing-online-check';
UPDATE survey_section SET title_vi='PHẦN 1: ĐÁNH GIÁ DIGITAL PRESENCE', subtitle_vi='5 chiều đánh giá: website, Google, social media, content, và reputation.' WHERE survey_id='marketing-online-check' AND order_idx=0;
UPDATE survey_section SET title_vi='PHẦN 2: TỰ SOI CHIẾU', subtitle_vi='Hai câu hỏi mở giúp bạn nhìn sâu vào digital presence.' WHERE survey_id='marketing-online-check' AND order_idx=1;
UPDATE survey_question SET label_vi='Phòng khám có website riêng chuyên nghiệp không? Website đó tối ưu cho di động và có thông tin đầy đủ không?' WHERE question_id='mo_q1';
UPDATE survey_question SET label_vi='Phòng khám có Google Business Profile và được quản lý tốt không?' WHERE question_id='mo_q2';
UPDATE survey_question SET label_vi='Phòng khám có active trên mạng xã hội không? Nội dung có được đăng đều đặn và chất lượng không?' WHERE question_id='mo_q3';
UPDATE survey_question SET label_vi='Phòng khám có online reputation tốt — reviews, testimonials — không?' WHERE question_id='mo_q4';
UPDATE survey_question SET label_vi='Phòng khám có chiến lược digital marketing rõ ràng — biết đối tượng mục tiêu, kênh ưu tiên, và content plan — không?' WHERE question_id='mo_q5';
UPDATE survey_question SET label_vi='Khi một bệnh nhân mới tìm phòng khám nha khoa trên Google, điều gì khiến họ chọn bạn thay vì đối thủ? Điều đó có hiển thị online không?', placeholder_vi='Nghĩ về "why us" của phòng khám. Nếu bạn là bệnh nhân tìm kiếm online, bạn sẽ thấy điều đó ở đâu trên internet?' WHERE question_id='mo_open1';
UPDATE survey_question SET label_vi='Bạn đã thử những kênh digital marketing nào? Kênh nào hiệu quả nhất và kênh nào chưa hoạt động tốt?', placeholder_vi='Liệt kê: Facebook, Google Ads, TikTok, Website, Zalo OA, SEO... Đâu là kênh mang lại bệnh nhân thực sự?' WHERE question_id='mo_open2';

-- === 30: thu-vi-tri-check ===
UPDATE survey_definition SET title_vi='Thu Vi Trí Check', subtitle_vi='Phân tích SWOT và vị thế cạnh tranh' WHERE id='thu-vi-tri-check';
UPDATE survey_section SET title_vi='PHẦN 1: ĐÁNH GIÁ VỊ THẾ CẠNH TRANH', subtitle_vi='5 chiều đánh giá: phân tích đối thủ, lợi thế, chiến lược, khác biệt, và tầm nhìn.' WHERE survey_id='thu-vi-tri-check' AND order_idx=0;
UPDATE survey_section SET title_vi='PHẦN 2: TỰ SOI CHIẾU', subtitle_vi='Hai câu hỏi mở giúp bạn nhìn sâu vào vị thế cạnh tranh.' WHERE survey_id='thu-vi-tri-check' AND order_idx=1;
UPDATE survey_question SET label_vi='Bạn có biết rõ 3-5 đối thủ chính trong khu vực và điểm mạnh/yếu của họ không?' WHERE question_id='tvtri_q1';
UPDATE survey_question SET label_vi='Bạn có biết chính xác điểm mạnh độc nhất của phòng khám mà đối thủ khó sao chép không?' WHERE question_id='tvtri_q2';
UPDATE survey_question SET label_vi='Phòng khám có chiến lược phát triển ngắn hạn và dài hạn rõ ràng không?' WHERE question_id='tvtri_q3';
UPDATE survey_question SET label_vi='Phòng khám có khác biệt hóa được trong mắt bệnh nhân — họ chọn bạn vì lý do gì thay vì đối thủ?' WHERE question_id='tvtri_q4';
UPDATE survey_question SET label_vi='Bạn có tầm nhìn rõ ràng về phòng khám trong 3-5 năm tới không — phát triển quy mô, chuyên môn hóa, hay tối ưu hóa?' WHERE question_id='tvtri_q5';
UPDATE survey_question SET label_vi='Nếu một phòng khám mới với đầy đủ tiền và đội ngũ giỏi mở ngay cạnh bạn, điều gì khiến bệnh nhân hiện tại VẪN ở lại với bạn?', placeholder_vi='Nghĩ về những thứ KHÔNG thể mua bằng tiền — mối quan hệ, niềm tin, thời gian, hay kinh nghiệm mà bạn đã xây dựng với bệnh nhân.' WHERE question_id='tvtri_open1';
UPDATE survey_question SET label_vi='Bạn thấy mình đang ở giai đoạn nào của vòng đời phòng khám — khởi đầu, tăng trưởng, ổn định, hay suy thoái? Điều gì cho thấy điều đó?', placeholder_vi='Các dấu hiệu: doanh thu tăng/giảm, bệnh nhân mới, bệnh nhân cũ quay lại, đội ngũ ổn định, áp lực cạnh tranh...' WHERE question_id='tvtri_open2';

-- === 31: thich-ung-dung-check ===
UPDATE survey_definition SET title_vi='Thích Ứng Check', subtitle_vi='Đánh giá khả năng thích ứng và chuyển đổi số' WHERE id='thich-ung-dung-check';
UPDATE survey_section SET title_vi='PHẦN 1: ĐÁNH GIÁ KHẢ NĂNG THÍCH ỨNG', subtitle_vi='5 chiều đánh giá: công nghệ, xu hướng, mô hình, đội ngũ, và tâm lý.' WHERE survey_id='thich-ung-dung-check' AND order_idx=0;
UPDATE survey_section SET title_vi='PHẦN 2: TỰ SOI CHIẾU', subtitle_vi='Hai câu hỏi mở giúp bạn nhìn sâu vào khả năng thích ứng.' WHERE survey_id='thich-ung-dung-check' AND order_idx=1;
UPDATE survey_question SET label_vi='Phòng khám có cập nhật và áp dụng công nghệ mới khi cần không?' WHERE question_id='tu_q1';
UPDATE survey_question SET label_vi='Bạn có theo dõi và phản ứng với xu hướng thị trường nha khoa không — giá cả, dịch vụ mới, kỳ vọng bệnh nhân thay đổi?' WHERE question_id='tu_q2';
UPDATE survey_question SET label_vi='Bạn có sẵn sàng thay đổi mô hình kinh doanh hoặc dịch vụ khi thị trường yêu cầu không?' WHERE question_id='tu_q3';
UPDATE survey_question SET label_vi='Đội ngũ của bạn có khả năng học hỏi và thích ứng với quy trình mới không?' WHERE question_id='tu_q4';
UPDATE survey_question SET label_vi='Bạn có tìm kiếm và học hỏi từ những nguồn mới — khóa học, cộng đồng, mentors — để phát triển phòng khám không?' WHERE question_id='tu_q5';
UPDATE survey_question SET label_vi='Kể về một lần phòng khám phải thay đổi lớn — vì covid, vì đối thủ, vì công nghệ. Bạn đã phản ứng như thế nào?', placeholder_vi='Nghĩ về một thay đổi lớn mà phòng khám phải trải qua. Bạn đã thích ứng nhanh hay chậm? Điều gì giúp hoặc cản trở bạn?' WHERE question_id='tu_open1';
UPDATE survey_question SET label_vi='Công nghệ hoặc xu hướng nào trong nha khoa mà bạn thấy hứa hẹn nhưng chưa áp dụng? Điều gì ngăn cản bạn?', placeholder_vi='Ví dụ: AI diagnosis, teledentistry, digital marketing, membership plans, new treatment techniques... Điều gì khiến bạn chưa nhảy vào?' WHERE question_id='tu_open2';

-- === 32: thuong-hieu-ca-nhan-check ===
UPDATE survey_definition SET title_vi='Thương Hiệu Cá Nhân Check', subtitle_vi='Đánh giá personal branding và authority của chủ phòng khám' WHERE id='thuong-hieu-ca-nhan-check';
UPDATE survey_section SET title_vi='PHẦN 1: ĐÁNH GIÁ THƯƠNG HIỆU CÁ NHÂN', subtitle_vi='5 chiều đánh giá: online presence, content, authority, network, và consistency.' WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=0;
UPDATE survey_section SET title_vi='PHẦN 2: TỰ SOI CHIẾU', subtitle_vi='Hai câu hỏi mở giúp bạn nhìn sâu vào thương hiệu cá nhân.' WHERE survey_id='thuong-hieu-ca-nhan-check' AND order_idx=1;
UPDATE survey_question SET label_vi='Bạn có online presence cá nhân mạnh — profile, hình ảnh chuyên nghiệp, và thông điệp rõ ràng — không?' WHERE question_id='thcn_q1';
UPDATE survey_question SET label_vi='Bạn có chia sẻ nội dung chuyên môn — kiến thức nha khoa, case studies, insights — để xây dựng authority không?' WHERE question_id='thcn_q2';
UPDATE survey_question SET label_vi='Bạn được công nhận là chuyên gia trong lĩnh vực nha khoa — bởi bệnh nhân, đồng nghiệp, hay cộng đồng — không?' WHERE question_id='thcn_q3';
UPDATE survey_question SET label_vi='Bạn có mạng lưới quan hệ mạnh — kết nối với các chuyên gia khác, tham gia cộng đồng nha khoa, xây dựng referral network — không?' WHERE question_id='thcn_q4';
UPDATE survey_question SET label_vi='Thông điệp và hình ảnh cá nhân của bạn có nhất quán trên mọi nền tảng và trong mọi tương tác không?' WHERE question_id='thcn_q5';
UPDATE survey_question SET label_vi='Khi ai đó nhắc đến tên bạn trong cộng đồng nha khoa, họ thường nói gì về bạn? Điều đó có đúng với cách bạn muốn được nhìn nhận không?', placeholder_vi='Nghĩ về "word of mouth" về bạn trong cộng đồng. Bệnh nhân, đồng nghiệp, và đối tác nói gì về bạn khi bạn không ở đó?' WHERE question_id='thcn_open1';
UPDATE survey_question SET label_vi='Bạn đã đầu tư bao nhiêu thời gian và nỗ lực vào việc xây dựng thương hiệu cá nhân? Bạn thấy kết quả như thế nào?', placeholder_vi='Nghĩ về ROI của personal branding — có mang lại bệnh nhân mới, referral, hay cơ hội kinh doanh không? Điều gì đã hiệu quả và chưa hiệu quả?' WHERE question_id='thcn_open2';
