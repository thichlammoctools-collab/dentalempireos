-- Draft pillar post: review content and cover before changing status to published.

INSERT OR IGNORE INTO "blog_category" (
  "id", "name", "slug", "description", "icon", "color", "sort_order", "post_count", "created_at"
)
VALUES (
  'cat-van-hanh', 'Vận Hành', 'van-hanh',
  'Quy trình, SOPs, và tối ưu hoạt động hàng ngày',
  'settings_suggest', '#7c3aed', 2, 0, '2026-08-13T00:00:00Z'
);

INSERT OR IGNORE INTO "blog_tag" ("id", "name", "slug", "post_count", "created_at")
VALUES
  ('tag-quy-trinh', 'Quy Trình', 'quy-trinh', 0, '2026-08-13T00:00:00Z'),
  ('tag-sop', 'SOP', 'sop', 0, '2026-08-13T00:00:00Z'),
  ('tag-nhan-su', 'Nhân Sự', 'nhan-su', 0, '2026-08-13T00:00:00Z'),
  ('tag-phong-kham-moi', 'Phòng Khám Mới', 'phong-kham-moi', 0, '2026-08-13T00:00:00Z'),
  ('tag-van-hanh', 'Vận Hành', 'van-hanh', 0, '2026-08-13T00:00:00Z'),
  ('tag-checklist', 'Checklist', 'checklist', 0, '2026-08-13T00:00:00Z');

INSERT OR IGNORE INTO "blog_post" (
  "id", "title", "slug", "description", "content_md", "cover_url", "cover_alt",
  "category_id", "author_name", "status", "is_featured", "is_pinned", "is_recommended",
  "read_time_minutes", "view_count", "published_at", "chapter_id", "scanner_id",
  "created_at", "updated_at", "access_tier"
)
VALUES (
  'post-tier-1-foundation-systems',
  '10 Hệ Thống Nền Tảng Giúp Phòng Khám Mới Vận Hành Không Phụ Thuộc Vào Chủ',
  '10-he-thong-nen-tang-phong-kham-moi',
  'Checklist 10 hệ thống nền tảng cho phòng khám nha khoa mới: từ vai trò, nhân sự, quy trình đến tài chính, vật tư và văn hóa.',
  '## Phòng khám không thiếu nỗ lực, mà thiếu một bộ khung chung

Ở giai đoạn chuẩn bị mở hoặc trong những năm đầu vận hành, chủ phòng khám thường trở thành điểm nhận mọi việc: xem lịch hẹn, gọi ứng viên, duyệt mua vật tư, giải thích lại cách tiếp đón, xử lý phản hồi và chữa các sự cố phát sinh. Mỗi việc riêng lẻ có thể được giải quyết. Vấn đề xuất hiện khi toàn bộ cách làm chỉ nằm trong đầu một người.

Một kịch bản khác cũng phổ biến: phòng khám đã có đủ người để chia việc, nhưng mỗi người hiểu một kiểu. Lễ tân có cách xác nhận lịch riêng, phụ tá có cách chuẩn bị ca riêng, người phụ trách thu chi có bảng theo dõi riêng. Khi có người nghỉ, đổi ca hoặc mới vào, công việc dễ bị đứt ở điểm bàn giao.

Phòng khám mới không cần xây mọi thứ thật lớn ngay từ đầu. Điều cần thiết hơn là một bộ khung tối thiểu: việc nào quan trọng, ai chịu trách nhiệm, phải làm theo những bước nào, đầu ra được chấp nhận là gì và khi nào cả đội cùng xem lại. Bộ khung đó giúp công việc không chỉ tồn tại trong đầu chủ phòng khám.

<p><a href="/scanner/loi-nhu-quan-check" data-track-cta="business_mindset_check" data-track-placement="blog_tier_1_foundation_inline"><strong>Bạn đang băn khoăn mình có đang tư duy như một chủ doanh nghiệp? Làm Tư duy Kinh doanh Check.</strong></a></p>

## Hệ thống là gì trong một phòng khám mới?

Trong bài này, một hệ thống không phải chỉ là phần mềm, biểu mẫu hay một file Google Sheet. Những công cụ đó có thể hữu ích, nhưng chúng chỉ hỗ trợ cách làm đã được thống nhất.

- **Công cụ** là phương tiện để lưu, nhắc hoặc tổng hợp thông tin, như phần mềm lịch hẹn, mẫu phiếu hay bảng tính.
- **Quy trình** là chuỗi bước để hoàn thành một công việc, chẳng hạn tiếp nhận một liên hệ mới hoặc bàn giao ca.
- **Hệ thống** kết nối con người, quy trình, tiêu chuẩn đầu ra và nhịp đo lường để công việc có thể lặp lại, được kiểm tra và cải thiện.

Một hệ thống tối thiểu nên trả lời được năm câu hỏi: mục tiêu là gì, ai chịu trách nhiệm, việc bắt đầu khi nào, đầu ra cần đạt là gì, và khi nào cần xem lại. Khi năm câu hỏi này chưa rõ, đầu tư thêm công cụ thường chỉ làm sự mơ hồ được số hóa.

Nguyên tắc phù hợp với giai đoạn đầu là **chuẩn hóa trước, tối ưu sau**. Hãy bắt đầu từ phiên bản đủ dùng, chạy thử trong thực tế, rồi điều chỉnh. Bạn có thể đọc thêm về nguyên tắc này trong [Chương 1: Triển Khai Hệ Thống Quản Trị](/book/01-trien-khai-he-thong).

## Bản đồ 10 hệ thống nền tảng

Mười hệ thống dưới đây là bản đồ để nhìn toàn cảnh, không phải danh sách bắt buộc phải hoàn thành cùng lúc. Mỗi hệ thống đều có một phiên bản tối thiểu để phòng khám bắt đầu mà không tạo thêm quá tải.

| Hệ thống | Phiên bản tối thiểu để bắt đầu |
| --- | --- |
| Điều hành của chủ | Hai khung giờ điều hành mỗi tuần và một danh sách quyết định |
| Nhân sự, phân vai | Ba nhóm công việc, mô tả trách nhiệm và người thay thế tạm thời |
| Tuyển dụng, onboarding | Tiêu chí tuyển, phỏng vấn, checklist ngày 1-14 và người kèm |
| Quy trình cốt lõi | Năm quy trình ưu tiên với owner, trigger, đầu ra và bàn giao |
| Tiếp đón, tư vấn | Chuẩn phản hồi, xác nhận lịch, tiếp đón, giải thích và follow-up |
| Điều trị, an toàn | Checklist trước-trong-sau ca, phân quyền và ghi nhận sự cố |
| Chăm sóc bệnh nhân | Nhắc lịch, theo dõi sau điều trị, tái khám và phản hồi |
| Vật tư, thiết bị | Danh mục thiết yếu, tồn tối thiểu, lịch kiểm kê và nhật ký thiết bị |
| Tài chính, dòng tiền | Bảng thu chi tuần, lịch xem dòng tiền và phê duyệt khoản chi |
| Văn hóa, hành vi | Giá trị, hành vi quan sát được và quy tắc phản hồi nội bộ |

### 1. Hệ thống điều hành của chủ phòng khám

**Mục tiêu:** tách dần vai trò lâm sàng khỏi vai trò điều hành để chủ không chỉ phản ứng với việc khẩn.

Phiên bản tối thiểu có thể chỉ gồm hai khung giờ điều hành cố định mỗi tuần, một danh sách các quyết định cần chốt và một cuộc họp ngắn để rà việc. Trong khung giờ này, chủ không giải quyết mọi chi tiết thay đội ngũ mà xem các điểm cần quyết định: lịch nhân sự, sự cố chưa đóng, chi phí cần duyệt, vấn đề ảnh hưởng trải nghiệm bệnh nhân.

**Tự kiểm tra:** nếu bạn vắng mặt hai ngày, việc nào lập tức dừng hoặc phải chờ bạn? Câu trả lời cho thấy những phần chưa được giao trách nhiệm hoặc chưa có chuẩn xử lý. Dấu hiệu hệ thống chưa ổn là lịch họp chỉ dùng để kể việc, còn quyết định và người theo dõi sau cuộc họp không được ghi lại.

### 2. Hệ thống nhân sự và phân vai

**Mục tiêu:** mọi người hiểu trách nhiệm của mình, kể cả khi một người đang kiêm nhiều vai trò.

Một cấu trúc đơn giản có thể chia thành ba nhóm công việc: Điều trị; Hành chính; và Marketing/Chăm sóc khách hàng. Đây không nhất thiết là ba phòng ban độc lập. Ở phòng khám nhỏ, cùng một người có thể xử lý nhiều nhóm công việc, nhưng từng trách nhiệm cần có tên người chịu trách nhiệm rõ ràng.

Phiên bản tối thiểu gồm sơ đồ vai trò, mô tả ngắn cho từng vai trò và một người thay thế tạm thời cho những việc quan trọng. Hãy làm rõ ai xác nhận lịch, ai chuẩn bị thông tin trước ca, ai được quyền đặt vật tư và ai nhận phản hồi đầu tiên từ bệnh nhân. [Chương 2: Quản Trị Nhân Sự Cơ Bản](/book/02-quan-tri-nhan-su) trình bày thêm cách nhìn về cấu trúc nhóm công việc này.

**Dấu hiệu chưa ổn:** mọi việc được giao bằng câu “ai rảnh làm giúp”, hoặc cả đội biết có việc nhưng không biết ai là người chốt cuối cùng.

### 3. Hệ thống tuyển dụng và onboarding

**Mục tiêu:** tuyển đúng nhu cầu và giúp người mới trở thành một phần của cách làm chung.

Trước khi đăng tuyển, hãy viết tiêu chí tối thiểu của vị trí: kết quả công việc cần tạo ra, kỹ năng cần có ngay, điều có thể đào tạo sau và hành vi không phù hợp với môi trường làm việc. Kịch bản phỏng vấn nên xoay quanh các tình huống thực tế của vai trò thay vì chỉ kiểm tra câu trả lời chung chung.

Với onboarding, có thể dùng khung hai tuần như một điểm bắt đầu: ngày đầu giới thiệu bối cảnh và quy định; các ngày tiếp theo học quy trình; rồi thực hành có giám sát trước khi làm độc lập với hỗ trợ. Đây là khung tham khảo, không phải thời lượng bắt buộc cho mọi vị trí. Phiên bản tối thiểu cần có checklist ngày 1-14, người kèm cặp và thời điểm rà lại xem người mới đang vướng ở đâu.

**Dấu hiệu chưa ổn:** nhân sự mới chỉ nhận một lời dặn miệng, tự quan sát người cũ rồi bị đánh giá vì làm khác kỳ vọng.

### 4. Hệ thống quy trình vận hành cốt lõi

**Mục tiêu:** công việc lặp lại được thực hiện nhất quán và không mất dấu ở điểm bàn giao.

Đừng bắt đầu bằng việc viết toàn bộ sổ tay vận hành. Hãy chọn năm quy trình ưu tiên: tiếp nhận liên hệ, sắp lịch hẹn, chuẩn bị ca, thanh toán và xử lý phản hồi hoặc sự cố. Với mỗi quy trình, ghi rõ owner, trigger khởi động, các bước chính, đầu ra cần có và điểm bàn giao cho người tiếp theo.

Ví dụ minh họa: khi có một liên hệ mới, trigger là tin nhắn hoặc cuộc gọi được nhận; đầu ra không chỉ là “đã trả lời” mà là thông tin liên hệ đã được ghi nhận, nhu cầu được phân loại và bước tiếp theo được xác nhận. Cách mô tả này giúp đội ngũ thấy rõ công việc kết thúc ở đâu.

**Dấu hiệu chưa ổn:** mọi người nói “quy trình có rồi”, nhưng mỗi ca trực vẫn làm theo trí nhớ hoặc phải hỏi lại từ đầu.

### 5. Hệ thống tiếp đón và tư vấn điều trị

**Mục tiêu:** bệnh nhân nhận được trải nghiệm rõ ràng, nhất quán từ lần liên hệ đầu tiên đến các bước tiếp theo.

Phiên bản tối thiểu gồm chuẩn trả lời liên hệ, quy tắc xác nhận lịch, checklist tiếp đón, cách giải thích kế hoạch và chi phí theo quy định của phòng khám, cùng nguyên tắc follow-up. Các nội dung này tập trung vào trải nghiệm và giao tiếp vận hành; không thay thế tư vấn chuyên môn hoặc khuyến nghị điều trị y khoa.

Hãy quan sát các điểm dễ tạo khoảng trống: bệnh nhân có biết cần chuẩn bị gì trước lịch hẹn không, ai giải thích bước tiếp theo sau buổi tư vấn, và ai theo dõi khi một cuộc hẹn cần dời? Một câu trả lời nhất quán thường đáng tin hơn nhiều câu trả lời nhanh nhưng khác nhau.

**Dấu hiệu chưa ổn:** mỗi người dùng một cách nhắn tin, giá hoặc bước tiếp theo được giải thích khác nhau, và bệnh nhân phải chủ động hỏi lại nhiều lần.

### 6. Hệ thống điều trị và an toàn

**Mục tiêu:** tạo khung quản trị để đội ngũ chuẩn bị, phối hợp và ghi nhận một cách có trách nhiệm.

Phiên bản tối thiểu nên có checklist trước, trong và sau ca; phân quyền rõ ràng; cách ghi nhận sự cố; và cơ chế báo cáo để vấn đề được xử lý thay vì bị bỏ qua. Phần này chỉ mô tả khung quản trị. Mọi SOP lâm sàng, quy định cấp phép, kiểm soát nhiễm khuẩn và hướng dẫn điều trị cần được người phụ trách chuyên môn cùng chuyên gia phù hợp rà soát trước khi áp dụng.

Điểm cốt lõi là tạo điều kiện để đội ngũ nêu vấn đề sớm. Khi ghi nhận sự cố chỉ để tìm người chịu lỗi, thông tin cần thiết thường bị giữ lại. Khi mục tiêu là học từ tình huống và cải thiện hệ thống, việc báo cáo mới trở thành một phần của vận hành.

**Dấu hiệu chưa ổn:** checklist tồn tại nhưng không rõ ai xác nhận, hoặc sự cố chỉ được nhắc đến khi đã ảnh hưởng tới bệnh nhân hoặc lịch làm việc.

### 7. Hệ thống chăm sóc bệnh nhân

**Mục tiêu:** duy trì trải nghiệm nhất quán sau lần tiếp xúc đầu tiên, không chỉ là gửi tin nhắn theo lịch.

Hệ thống tối thiểu gồm nhắc lịch, theo dõi sau điều trị theo hướng dẫn chuyên môn của phòng khám, xử lý phản hồi, lịch tái khám và quy tắc ghi nhận thông tin. Hãy xác định thời điểm nào cần liên hệ, ai thực hiện, thông tin nào cần ghi lại và khi nào cần chuyển tiếp cho người có thẩm quyền.

Ví dụ minh họa: thay vì chỉ đánh dấu “đã gọi”, bảng theo dõi có thể yêu cầu ghi kết quả liên hệ và hành động tiếp theo. Nhờ vậy, một người khác có thể tiếp tục cuộc trao đổi mà bệnh nhân không phải kể lại bối cảnh.

**Dấu hiệu chưa ổn:** lịch nhắc phụ thuộc vào trí nhớ từng người, phản hồi bị nằm trong hộp chat cá nhân hoặc không có người nhận trách nhiệm đến cùng.

### 8. Hệ thống vật tư và thiết bị

**Mục tiêu:** giảm rủi ro gián đoạn công việc vì thiếu vật tư hoặc thiết bị không được theo dõi.

Phiên bản tối thiểu gồm danh mục vật tư thiết yếu, mức tồn tối thiểu do phòng khám tự xác định, người phụ trách đặt hàng, lịch kiểm kê và nhật ký thiết bị. Không cần quản lý tất cả mọi thứ bằng một bảng phức tạp ngay ngày đầu. Trước tiên, hãy nhận diện những món thiếu là có thể ảnh hưởng trực tiếp đến lịch làm việc.

**Tự kiểm tra:** ca nào có thể bị ảnh hưởng nếu một vật tư hết ngay hôm nay? Với mỗi câu trả lời, hãy xác định mức cảnh báo, người đặt hàng và cách kiểm tra. Nhật ký thiết bị cũng cần cho biết ai phát hiện, thời điểm phát hiện và bước xử lý tiếp theo.

**Dấu hiệu chưa ổn:** chỉ kiểm kê khi đã thiếu, hoặc nhiều người cùng đặt hàng nhưng không ai chịu trách nhiệm về mức tồn.

### 9. Hệ thống tài chính và dòng tiền

**Mục tiêu:** chủ có đủ thông tin để ra quyết định chi tiêu và thấy sớm các nghĩa vụ cần chuẩn bị.

Điểm bắt đầu là tách dòng tiền cá nhân và doanh nghiệp, dùng bảng thu chi tuần, thiết lập lịch xem dòng tiền, quy tắc phê duyệt khoản chi và danh sách chi phí cố định cần dự báo. Đây không phải là tư vấn tài chính, kế toán hoặc pháp lý. Phòng khám cần làm việc với người có chuyên môn phù hợp cho các nghĩa vụ cụ thể.

Ở giai đoạn đầu, điều quan trọng không phải là tạo thật nhiều báo cáo. Hãy bảo đảm các khoản thu, chi, khoản phải trả và quyết định chi tiêu đều có nơi ghi nhận chung. Khi số liệu được xem theo một nhịp cố định, quyết định ít bị dẫn dắt bởi cảm giác nhất thời hơn.

**Dấu hiệu chưa ổn:** không phân biệt tiền cá nhân với tiền vận hành, hoặc chỉ xem lại chi phí khi tài khoản đã thiếu tiền.

### 10. Hệ thống văn hóa và chuẩn hành vi

**Mục tiêu:** biến các giá trị mong muốn thành cách ra quyết định hằng ngày.

Phiên bản tối thiểu có thể là ba đến năm giá trị, mỗi giá trị đi kèm hành vi quan sát được, quy tắc phản hồi nội bộ và cách đưa chúng vào tuyển dụng, onboarding, họp nhóm. Chẳng hạn, thay vì chỉ ghi “trách nhiệm”, phòng khám cần định nghĩa hành vi như báo sớm khi có rủi ro, hoàn tất việc đã nhận hoặc bàn giao đủ thông tin trước khi kết thúc ca.

Văn hóa không phải poster treo tường. Văn hóa được thể hiện ở cách trưởng nhóm phản hồi khi có sai sót, cách quyết định khi lịch quá tải và cách mọi người đối xử với thông tin của bệnh nhân lẫn đồng đội.

**Dấu hiệu chưa ổn:** giá trị được nhắc đến trong ngày đầu đi làm nhưng không xuất hiện trong phản hồi, tuyển dụng hoặc các quyết định thực tế.

## Thứ tự xây dựng: đừng làm 10 việc cùng lúc

Bạn không cần hoàn thiện cả mười hệ thống trước ngày đầu mở cửa. Lộ trình bốn chặng dưới đây là thứ tự khuyến nghị để giảm quá tải, không phải quy chuẩn pháp lý hay kế hoạch duy nhất cho mọi phòng khám.

### Chặng 1: Tuần 1-2

Làm rõ vai trò chủ, phân vai công việc và chọn năm quy trình ưu tiên. Mục tiêu của chặng này là biết ai quyết định, ai thực hiện và công việc nào cần được chuẩn hóa trước.

### Chặng 2: Tuần 3-4

Hoàn thiện luồng tiếp đón, lịch hẹn, bàn giao ca và theo dõi thu chi cơ bản. Hãy ưu tiên những điểm bệnh nhân và đội ngũ chạm vào mỗi ngày.

### Chặng 3: Tháng 2

Đưa onboarding, chăm sóc bệnh nhân, vật tư và lịch kiểm tra vào vận hành. Thu thập phản hồi từ người trực tiếp dùng quy trình để điều chỉnh phiên bản đầu.

### Chặng 4: Tháng 3

Thiết lập chỉ số phù hợp với từng hệ thống, nhịp họp điều hành, lịch điều chỉnh SOP và chuẩn hành vi. Lúc này, hệ thống bắt đầu được quản lý bằng quan sát thực tế thay vì chỉ bằng ý định ban đầu.

## Checklist tự đánh giá 10 hệ thống

Với mỗi câu dưới đây, hãy chọn một trạng thái: **Có**, **Chưa có**, hoặc **Có nhưng chưa ổn định**.

1. Chủ phòng khám có lịch điều hành và danh sách quyết định tách khỏi việc xử lý hằng ngày.
2. Mỗi công việc quan trọng có người chịu trách nhiệm rõ ràng, kể cả khi có kiêm nhiệm.
3. Tuyển dụng và 14 ngày đầu của nhân sự mới có tiêu chí, checklist và người kèm.
4. Phòng khám đã chọn và mô tả năm quy trình vận hành ưu tiên.
5. Tiếp đón, xác nhận lịch và follow-up có chuẩn giao tiếp thống nhất.
6. Các bước quản trị trước-trong-sau ca, phân quyền và báo cáo sự cố đã được người phụ trách phù hợp rà soát.
7. Nhắc lịch, tái khám và phản hồi của bệnh nhân được ghi nhận để có người theo dõi đến cùng.
8. Vật tư thiết yếu, mức tồn, lịch kiểm kê và thiết bị có người chịu trách nhiệm.
9. Thu chi doanh nghiệp được tách riêng, cập nhật theo tuần và có lịch xem dòng tiền.
10. Giá trị của phòng khám được chuyển thành hành vi và được dùng khi tuyển dụng, onboarding, họp nhóm.

Cách đọc kết quả:

- **0-3 hệ thống có:** ưu tiên thiết kế nền trước khi tăng chi phí hoặc tuyển thêm.
- **4-7 hệ thống có:** đã có khung, hãy chọn một đến hai điểm đứt ảnh hưởng nhiều nhất để chuẩn hóa.
- **8-10 hệ thống có:** chuyển trọng tâm sang đo lường, họp điều hành và cải tiến nhịp vận hành.

Checklist này chỉ dùng để định hướng ưu tiên. Nó không phải đánh giá chuyên môn, pháp lý hoặc tài chính.

## Biết phòng khám thiếu gì trước khi mở rộng

Bảng Start Up giúp bạn soi mức độ sẵn sàng về pháp lý, cơ sở, thiết bị, quy trình và đội ngũ để chọn đúng ưu tiên đầu tiên.

<p><a href="/scanner/startup-check" data-track-cta="startup_check" data-track-placement="blog_tier_1_foundation_final"><strong>Làm Bảng Start Up miễn phí</strong></a></p>

_Không cần đăng nhập · Nhận liên kết kết quả riêng tư · Dữ liệu guest được lưu trong 3 ngày._

<p><a href="/scanner/loi-nhu-quan-check" data-track-cta="business_mindset_check" data-track-placement="blog_tier_1_foundation_final_secondary">Chưa rõ vai trò chủ phòng khám? Làm Tư duy Kinh doanh Check</a></p>',
  '/images/blog-tier-1-foundation.svg',
  'Sơ đồ 10 hệ thống nền tảng cho phòng khám nha khoa mới',
  'cat-van-hanh',
  'Dental Empire',
  'draft',
  0, 0, 1,
  14, 0, NULL, NULL,
  CASE WHEN EXISTS (SELECT 1 FROM "survey_definition" WHERE "id" = 'startup-check') THEN 'startup-check' ELSE NULL END,
  '2026-08-13T00:00:00Z', '2026-08-13T00:00:00Z', 'free'
);

INSERT OR IGNORE INTO "blog_post_tag" ("post_id", "tag_id")
VALUES
  ('post-tier-1-foundation-systems', 'tag-quy-trinh'),
  ('post-tier-1-foundation-systems', 'tag-sop'),
  ('post-tier-1-foundation-systems', 'tag-nhan-su'),
  ('post-tier-1-foundation-systems', 'tag-phong-kham-moi'),
  ('post-tier-1-foundation-systems', 'tag-van-hanh'),
  ('post-tier-1-foundation-systems', 'tag-checklist');

UPDATE "blog_tag" SET "post_count" = (
  SELECT COUNT(*) FROM "blog_post_tag" WHERE "tag_id" = "blog_tag"."id"
);
