-- Seed data for blog: categories, tags, and sample posts
-- Run after 0008_create_blog.sql

-- Categories
INSERT OR IGNORE INTO "blog_category" ("id","name","slug","description","icon","color","sort_order","post_count","created_at")
VALUES
  ('cat-quan-tri', 'Quản Trị', 'quan-tri', 'Chiến lược và nguyên tắc quản lý phòng khám nha khoa', 'admin_panel_settings', '#0d9488', 1, 0, '2025-01-01T00:00:00Z'),
  ('cat-van-hanh', 'Vận Hành', 'van-hanh', 'Quy trình, SOPs, và tối ưu hoạt động hàng ngày', 'settings_suggest', '#7c3aed', 2, 0, '2025-01-01T00:00:00Z'),
  ('cat-marketing', 'Marketing', 'marketing', 'Tiếp thị phòng khám, thu hút và giữ chân bệnh nhân', 'campaign', '#db2777', 3, 0, '2025-01-01T00:00:00Z'),
  ('cat-tai-chinh', 'Tài Chính', 'tai-chinh', 'Quản lý doanh thu, chi phí, và lợi nhuận nha khoa', 'payments', '#d97706', 4, 0, '2025-01-01T00:00:00Z'),
  ('cat-nhan-su', 'Nhân Sự', 'nhan-su', 'Tuyển dụng, đào tạo, và phát triển đội ngũ nha khoa', 'groups', '#059669', 5, 0, '2025-01-01T00:00:00Z'),
  ('cat-case-study', 'Case Study', 'case-study', 'Câu chuyện thực tế từ các phòng khám thành công', 'lightbulb', '#dc2626', 6, 0, '2025-01-01T00:00:00Z');

-- Tags
INSERT OR IGNORE INTO "blog_tag" ("id","name","slug","post_count","created_at")
VALUES
  ('tag-quy-trinh', 'Quy Trình', 'quy-trinh', 0, '2025-01-01T00:00:00Z'),
  ('tag-so-quy', 'Sổ Quỹ', 'so-quy', 0, '2025-01-01T00:00:00Z'),
  ('tag-sop', 'SOP', 'sop', 0, '2025-01-01T00:00:00Z'),
  ('tag-marketing', 'Marketing', 'marketing', 0, '2025-01-01T00:00:00Z'),
  ('tag-nhan-su', 'Nhân Sự', 'nhan-su', 0, '2025-01-01T00:00:00Z'),
  ('tag-case-study', 'Case Study', 'case-study', 0, '2025-01-01T00:00:00Z'),
  ('tag-mang-xa-hoi', 'Mạng Xã Hội', 'mang-xa-hoi', 0, '2025-01-01T00:00:00Z'),
  ('tag-seo', 'SEO', 'seo', 0, '2025-01-01T00:00:00Z'),
  ('tag-loi-nhuan', 'Lợi Nhuận', 'loi-nhuan', 0, '2025-01-01T00:00:00Z'),
  ('tag-customer', 'Khách Hàng', 'customer', 0, '2025-01-01T00:00:00Z');

-- Sample Posts
INSERT OR IGNORE INTO "blog_post" (
  "id","title","slug","description","content_md","cover_url","cover_alt",
  "category_id","author_name","status","is_featured","is_pinned","is_recommended",
  "read_time_minutes","view_count","published_at","created_at","updated_at"
)
VALUES
  (
    'post-1',
    '5 Nguyên Tắc Vàng Trong Quản Lý Phòng Khám Nha Khoa Hiện Đại',
    '5-nguyen-tac-vang-quan-ly-phong-kham',
    'Khám phá 5 nguyên tắc cốt lõi giúp các phòng khám nha khoa vận hành trơn tru, tăng doanh thu và giữ chân bệnh nhân lâu dài.',
    '## Tại sao quản lý phòng khám nha khoa lại quan trọng?

Nhiều bác sĩ giỏi về chuyên môn nhưng gặp khó khăn trong việc điều hành. Một phòng khám hoạt động hiệu quả không chỉ dựa vào tay nghề bác sĩ — mà còn ở **hệ thống quản lý** đằng sau nó.

## 5 Nguyên Tắc Cốt Lõi

### 1. Hệ thống hóa mọi quy trình

Mọi công việc từ tiếp nhận bệnh nhân, lên lịch hẹn, đến thanh toán đều cần SOP (Standard Operating Procedure). Khi có SOP, nhân viên mới nhanh chóng làm quen, và chất lượng dịch vụ ổn định dù bạn có mặt hay không.

> *"Một phòng khám tốt không phụ thuộc vào một người giỏi, mà vào hệ thống mà bất kỳ ai cũng có thể vận hành."*

### 2. Đo lường bằng số liệu

Bạn không thể cải thiện thứ bạn không đo lường. Các chỉ số quan trọng cần theo dõi:

- **Doanh thu trung bình mỗi bệnh nhân**
- **Tỷ lệ bệnh nhân quay lại**
- **Thời gian chờ trung bình**
- **Tỷ lệ lấp đầy lịch hẹn**

### 3. Đầu tư vào đội ngũ

Nhân sự là tài sản lớn nhất của phòng khám. Đào tạo liên tục, lắng nghe phản hồi, và tạo môi trường làm việc tích cực sẽ giảm tỷ lệ nghỉ việc — tiết kiệm chi phí tuyển dụng lớn.

### 4. Chú trọng trải nghiệm bệnh nhân

Từ khi bước vào cửa đến khi rời đi, mỗi khoảnh khắc đều ảnh hưởng đến cảm nhận của bệnh nhân. Gọi điện nhắc lịch, giải thích rõ ràng về chi phí, và theo dõi sau điều trị là những việc nhỏ nhưng tạo khác biệt lớn.

### 5. Tái đầu tư có chiến lược

Một phần lợi nhuận cần được tái đầu tư vào trang thiết bị, công nghệ, và đào tạo — không chỉ rút ra tiêu dùng. Điều này tạo vòng lặp tăng trưởng bền vững.

## Kết Luận

Áp dụng 5 nguyên tắc này không cần thay đổi lớn ngay lập tức. Bắt đầu từ một quy trình, đo lường, cải thiện, rồi mở rộng dần.',
    '',
    '5 nguyên tắc quản lý phòng khám nha khoa',
    'cat-quan-tri',
    'Dental Empire',
    'published',
    1, 1, 1,
    6, 342,
    '2025-01-15T08:00:00Z',
    '2025-01-15T08:00:00Z',
    '2025-01-15T08:00:00Z'
  ),
  (
    'post-2',
    'Cách Xây Dựng Quy Trình Khám Bệnh Chuẩn Từ A Đến Z',
    'quy-trinh-kham-benh-chuan',
    'Hướng dẫn chi tiết cách thiết lập quy trình khám bệnh chuẩn, giảm thời gian chờ và tăng sự hài lòng của bệnh nhân.',
    '## Vì sao cần quy trình khám bệnh chuẩn?

Một quy trình rõ ràng giúp:
- Giảm **30-50% thời gian chờ** của bệnh nhân
- Bác sĩ tập trung vào chuyên môn thay vì điều phối
- Giảm sai sót trong chẩn đoán và điều trị
- Nhân viên mới nhanh chóng đạt năng suất cao

## Các Bước Xây Dựng Quy Trình

### Bước 1: Lập bản đồ quy trình hiện tại

Trước khi cải thiện, cần hiểu quy trình đang diễn ra như thế nào. Quan sát, phỏng vấn nhân viên, và ghi lại từng bước từ lúc bệnh nhân liên hệ đến khi kết thúc điều trị.

### Bước 2: Xác định điểm nghẽn (Bottleneck)

Thường là: lên lịch hẹn, chờ bác sĩ, thanh toán, hay nhận hướng dẫn sau điều trị?

### Bước 3: Thiết kế quy trình mới

Mỗi bước cần có: **người thực hiện**, **thời gian tối đa**, **chuẩn đầu ra**, và **điểm kiểm soát chất lượng**.

### Bước 4: Đào tạo và triển khai

Viết SOP bằng ngôn ngữ đơn giản, có hình ảnh minh họa. Đào tạo từng nhóm, rồi triển khai có giám sát.

### Bước 5: Đo lường và cải tiến liên tục

Đặt KPI cho quy trình: thời gian trung bình mỗi ca, tỷ lệ bệnh nhân hài lòng, số lần phải làm lại. Cải thiện 5% mỗi tháng sẽ tạo ra sự khác biệt lớn sau 1 năm.',
    '',
    'Quy trình khám bệnh chuẩn',
    'cat-van-hanh',
    'Dental Empire',
    'published',
    1, 0, 0,
    5, 218,
    '2025-01-20T08:00:00Z',
    '2025-01-20T08:00:00Z',
    '2025-01-20T08:00:00Z'
  ),
  (
    'post-3',
    'Chiến Lược Marketing Phòng Khám Nha Khoa: Từ Cơ Bản Đến Nâng Cao',
    'marketing-phong-kham-nha-khoa',
    'Tổng quan chiến lược marketing toàn diện cho phòng khám nha khoa: online, offline, và các xu hướng mới nhất.',
    '## Marketing Phòng Khám Nha Khoa 2025

Marketing nha khoa không chỉ là chạy quảng cáo. Đó là cách bạn **xây dựng niềm tin**, **tạo giá trị**, và **kết nối** với bệnh nhân đúng lúc họ cần.

## Ba Trụ Cột Của Marketing Nha Khoa

### 1. Marketing Nội Dung (Content Marketing)

Chia sẻ kiến thức là cách tốt nhất để thu hút bệnh nhân có ý định tìm hiểu. Các loại nội dung hiệu quả:

- **Bài viết giáo dục** về sức khỏe răng miệng
- **Video ngắn** quy trình điều trị (giảm lo lắng)
- **Testimonial** từ bệnh nhân thực tế
- **Infographic** so sánh các phương pháp điều trị

### 2. Marketing Trực Tuyến (Digital Marketing)

- **Google Maps / Google Business Profile**: Tối ưu để xuất hiện khi người dùng tìm "nha khoa gần đây"
- **Facebook / Zalo OA**: Duy trì kết nối với bệnh nhân cũ
- **SEO local**: Từ khóa "bọc răng sứ giá bao nhiêu", "niềng răng bao nhiêu tiền"

### 3. Marketing Quan Hệ (Relationship Marketing)

Bệnh nhân cũ là nguồn doanh thu quan trọng nhất. Chương trình nhắc tái khám, gửi tin nhắn chăm sóc sau điều trị, và ưu đãi cho bệnh nhân giới thiệu là những hoạt động có chi phí thấp nhưng hiệu quả cao.',
    '',
    'Marketing phòng khám nha khoa',
    'cat-marketing',
    'Dental Empire',
    'published',
    1, 0, 1,
    7, 456,
    '2025-02-01T08:00:00Z',
    '2025-02-01T08:00:00Z',
    '2025-02-01T08:00:00Z'
  ),
  (
    'post-4',
    'Cách Đọc Báo Cáo Tài Chính Phòng Khám: Hướng Dẫn Cho Bác Sĩ',
    'bao-cao-tai-chinh-phong-kham',
    'Phân tích các chỉ số tài chính quan trọng nhất trong báo cáo phòng khám nha khoa và cách sử dụng chúng để đưa ra quyết định kinh doanh đúng đắn.',
    '## Tại sao bác sĩ cần hiểu tài chính?

Nhiều bác sĩ giỏi chuyên môn nhưng lại e ngại với các con số. Thực tế, **hiểu tài chính không khó** như bạn nghĩ — và nó giúp bạn đưa ra quyết định tốt hơn nhiều.

## Ba Báo Cáo Quan Trọng Nhất

### 1. Báo Cáo Thu Chi (Cash Flow)

Theo dõi tiền vào và tiền ra mỗi tháng. Điều quan trọng cần chú ý:

- Doanh thu có ổn định theo mùa không?
- Khoản chi nào chiếm tỷ trọng lớn nhất?
- Có tháng nào "thâm hụt" không?

### 2. Báo Cáo Lợi Nhuận (P&L)

Cho biết phòng khám thực sự **lãi** hay **lỗ** sau khi trừ mọi chi phí. Công thức đơn giản:

> **Lợi nhuận = Doanh thu - Chi phí trực tiếp - Chi phí gián tiếp**

### 3. Báo Cáo Công Nợ

Theo dõi các khoản bệnh nhân chưa thanh toán và các khoản phải trả cho nhà cung cấp. Công nợ quá hạn cần được xử lý kịp thời.

## Chỉ Số Tài Chính Quan Trọng

| Chỉ số | Công thức | Ngưỡng tốt |
|---|---|---|
| Biên lợi nhuận | Lợi nhuận / Doanh thu | > 20% |
| Hệ số thanh toán | Tài sản / Nợ phải trả | > 1.5 |
| Doanh thu / Bác sĩ | Tổng doanh thu / Số bác sĩ | So sánh theo tháng |

## Mẹo Quản Lý Tài Chính

1. **Tách tiền cá nhân và tiền kinh doanh** ngay từ đầu
2. **Dự phòng 3-6 tháng** chi phí vận hành
3. **Đầu tư có kế hoạch** — không chi tiêu theo cảm xúc
4. **Gặp kế toán định kỳ** — ít nhất mỗi quý',
    '',
    'Báo cáo tài chính phòng khám',
    'cat-tai-chinh',
    'Dental Empire',
    'published',
    0, 1, 0,
    8, 189,
    '2025-02-10T08:00:00Z',
    '2025-02-10T08:00:00Z',
    '2025-02-10T08:00:00Z'
  ),
  (
    'post-5',
    'Tuyển Dụng Và Giữ Chân Nhân Viên Nha Khoa Giỏi',
    'tuyen-dung-nhan-vien-nha-khoa',
    'Chiến lược tuyển dụng nhân viên nha khoa chất lượng cao và xây dựng môi trường làm việc khiến họ muốn ở lại lâu dài.',
    '## Vấn đề tuyển dụng trong ngành nha khoa

Tỷ lệ nghỉ việc trong ngành nha khoa Việt Nam khá cao, đặc biệt với điều dưỡng và nhân viên lễ tân. Chi phí tuyển dụng và đào tạo lại một nhân viên mới ước tính gấp 1.5-2 lần lương tháng của họ.

## Chiến Lược Tuyển Dụng Thông Minh

### Xây dựng thương hiệu tuyển dụng

Trước khi đăng tin tuyển dụng, hãy trả lời: **"Tại sao người giỏi nên đến đây thay vì nơi khác?"**

Những yếu tố thu hút ứng viên giỏi:
- Cơ hội học tập và phát triển kỹ năng
- Môi trường làm việc chuyên nghiệp
- Lộ trình thăng tiến rõ ràng
- Mức lương cạnh tranh + benefits hấp dẫn

### Kênh tuyển dụng hiệu quả

- **LinkedIn**: Cho vị trí bác sĩ, quản lý
- **Facebook Groups ngành nha khoa**: Cho nhân viên lễ tân, điều dưỡng
- **Giới thiệu từ nhân viên hiện tại**: Chương trình referral bonus

## Giữ Chân Nhân Viên

### Tạo văn hóa tích cực

- **Ghi nhận thành tích** công khai và thường xuyên
- **Lắng nghe ý kiến** và hành động khi có thể
- **Tổ chức team building** có ý nghĩa, không phải hình thức

### Đào tạo liên tục

Đầu tư vào kỹ năng chuyên môn và kỹ năng mềm giúp nhân viên thấy được sự phát triển của mình — yếu tố quan trọng hơn cả lương với nhiều người trẻ.

### Công nhận và thăng tiến

Có lộ trình thăng tiến rõ ràng từ nhân viên → trưởng nhóm → quản lý. Nhân viên có đích đến sẽ gắn bó hơn.',
    '',
    'Tuyển dụng nhân viên nha khoa',
    'cat-nhan-su',
    'Dental Empire',
    'published',
    0, 0, 1,
    7, 134,
    '2025-02-20T08:00:00Z',
    '2025-02-20T08:00:00Z',
    '2025-02-20T08:00:00Z'
  ),
  (
    'post-6',
    'Case Study: Phòng Khám Nha Khoa Tăng 40% Doanh Thu Trong 6 Tháng',
    'case-study-phong-kham-tang-40-doanh-thu',
    'Câu chuyện thực tế của phòng khám A: áp dụng Dental Empire OS giúp tăng 40% doanh thu, giảm 60% thời gian báo cáo, và cải thiện đáng kể trải nghiệm bệnh nhân.',
    '## Bối Cảnh

Phòng khám Nha Khoa A tại TP.HCM hoạt động 5 năm với 3 bác sĩ, 8 nhân viên. Doanh thu ổn định nhưng không tăng trưởng, nhân viên mệt mỏi với công việc giấy tờ, và bệnh nhân phản hồi về thời gian chờ lâu.

## Thách Thức

1. **Báo cáo thủ công** — mất 2-3 giờ mỗi tuần để tổng hợp số liệu
2. **Lịch hẹn lộn xộn** — bệnh nhân gọi điện hỏi lịch, nhân viên tra bằng sổ
3. **Không có hệ thống nhắc lịch** — tỷ lệ bệnh nhân không tái khám cao
4. **Doanh thu phụ thuộc** vào bác sĩ chủ — khó mở rộng

## Giải Pháp Áp Dụng

### Giai đoạn 1: Số hóa quy trình (Tháng 1-2)
- Triển khai hệ thống quản lý lịch hẹn
- Thiết lập SOP tiếp nhận và thanh toán
- Đào tạo nhân viên sử dụng công cụ mới

### Giai đoạn 2: Tối ưu trải nghiệm (Tháng 3-4)
- Hệ thống nhắc lịch hẹn tự động qua Zalo
- Cải thiện quy trình từ 7 bước xuống 4 bước
- Triển khai chương trình chăm sóc sau điều trị

### Giai đoạn 3: Tăng trưởng có hệ thống (Tháng 5-6)
- Chương trình khách hàng giới thiệu
- Gói dịch vụ bảo hành định kỳ
- Tối ưu chiến dịch marketing local

## Kết Quả Sau 6 Tháng

| Chỉ số | Trước | Sau | Thay đổi |
|---|---|---|---|
| Doanh thu tháng | 180 triệu | 252 triệu | **+40%** |
| Thời gian làm báo cáo | 3 giờ/tuần | 45 phút/tuần | **-75%** |
| Tỷ lệ tái khám | 35% | 58% | **+66%** |
| Thời gian chờ TB | 25 phút | 8 phút | **-68%** |
| Đánh giá Google | 4.1 sao | 4.7 sao | **+0.6** |

## Bài Học Quan Trọng

1. **Bắt đầu nhỏ, cải thiện liên tục** — đừng đợi hệ thống hoàn hảo
2. **Con người quan trọng hơn công cụ** — đầu tư vào đào tạo nhân viên
3. **Đo lường để cải thiện** — không có số liệu thì không biết đang đi đúng hướng không',
    '',
    'Case study phòng khám tăng doanh thu',
    'cat-case-study',
    'Dental Empire',
    'published',
    0, 0, 1,
    9, 523,
    '2025-03-01T08:00:00Z',
    '2025-03-01T08:00:00Z',
    '2025-03-01T08:00:00Z'
  );

-- Post-Tag associations
INSERT OR IGNORE INTO "blog_post_tag" ("post_id","tag_id") VALUES
  ('post-1', 'tag-quy-trinh'),
  ('post-1', 'tag-sop'),
  ('post-2', 'tag-quy-trinh'),
  ('post-2', 'tag-sop'),
  ('post-3', 'tag-marketing'),
  ('post-3', 'tag-seo'),
  ('post-3', 'tag-mang-xa-hoi'),
  ('post-4', 'tag-so-quy'),
  ('post-4', 'tag-loi-nhuan'),
  ('post-5', 'tag-nhan-su'),
  ('post-6', 'tag-case-study'),
  ('post-6', 'tag-loi-nhuan'),
  ('post-6', 'tag-quy-trinh');

-- Update denormalized post counts
UPDATE "blog_category" SET "post_count" = (
  SELECT COUNT(*) FROM "blog_post"
  WHERE "category_id" = "blog_category"."id" AND "status" = 'published'
);
UPDATE "blog_tag" SET "post_count" = (
  SELECT COUNT(*) FROM "blog_post_tag"
  WHERE "tag_id" = "blog_tag"."id"
);
