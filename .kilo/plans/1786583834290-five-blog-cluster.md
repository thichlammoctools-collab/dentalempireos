# Kế hoạch Blog: 5 bài vệ tinh sau bài trụ cột Tầng 1

## Mục tiêu

Mở rộng cụm nội dung quanh bài trụ cột `10-he-thong-nen-tang-phong-kham-moi`, tạo năm bài Blog có ý định tìm kiếm rõ ràng và dẫn người đọc từ một vấn đề vận hành cụ thể đến Scanner phù hợp.

Năm bài cần bổ sung chiều sâu ứng dụng nhưng không giả định rằng các Chương 3–10 của Book đã xuất bản. Nội dung nên được viết như hướng dẫn quản trị và checklist thực hành, không phải SOP lâm sàng, tư vấn pháp lý, kế toán hoặc điều trị y khoa.

## Bối cảnh đã kiểm tra

- Bài trụ cột đã published:
  - Slug: `10-he-thong-nen-tang-phong-kham-moi`
  - Category: `cat-van-hanh`
  - Scanner: `startup-check`
- Blog production hiện có thêm:
  - `bd-business-development-trong-nha-khoa-lam-gi`
  - `asynchronous-working-la-gi`
- Nội dung Book Tầng 1 đầy đủ hiện có ở Chương 1 và Chương 2.
- Chương 3–10 vẫn là draft metadata; không liên kết đến URL giả định của các chương này.
- Scanner production có các ID dùng được cho cụm bài: `quy-trinh-check`, `dao-tao-check`, `tiep-don-check`, `tai-chinh-check`, `kho-vat-tu-check`, `nhan-su-check`, `he-thong-check`, `os-maturity-check`.
- Khi tạo post production, association Scanner phải dùng đúng ID hiện có trong `survey_definition`.

## Kiến trúc cụm nội dung

```text
Bài trụ cột: 10 hệ thống nền tảng
├── 1. 5 SOP ưu tiên cho phòng khám mới
├── 2. Tuyển dụng và onboarding 14 ngày
├── 3. Từ tin nhắn đến lịch hẹn: hệ thống tiếp đón
├── 4. Bảng dòng tiền hàng tuần cho chủ phòng khám
└── 5. Quản lý vật tư: mức tồn tối thiểu và lịch kiểm kê
```

Mỗi bài vệ tinh cần liên kết ngược về bài trụ cột bằng anchor tự nhiên, đồng thời có CTA Scanner riêng. Không biến bài vệ tinh thành bản sao của bài trụ cột.

## Danh sách 5 bài đề xuất

### Bài 1 — 5 SOP phòng khám mới nên viết trước khi tuyển thêm người

| Trường | Giá trị đề xuất |
| --- | --- |
| Title | `5 SOP Phòng Khám Mới Nên Viết Trước Khi Tuyển Thêm Người` |
| Slug | `5-sop-phong-kham-moi-nen-viet-truoc-khi-tuyen-them-nguoi` |
| Meta description | `Chọn 5 SOP nền tảng cho phòng khám mới: tiếp nhận, lịch hẹn, chuẩn bị ca, thanh toán và xử lý phản hồi.` |
| Category | `cat-van-hanh` |
| Scanner | `quy-trinh-check` |
| Tags | `quy-trinh`, `sop`, `phong-kham-moi`, `van-hanh` |
| Read time | 8–10 phút |
| Status | Tạo `draft`, duyệt nội dung rồi mới `published` |

**Ý định tìm kiếm:** chủ phòng khám cần biết bắt đầu viết quy trình từ đâu.

**Cấu trúc:**

1. Vì sao viết nhiều SOP cùng lúc thường thất bại.
2. Một SOP tối thiểu cần có: mục tiêu, trigger, owner, các bước, đầu ra, điểm bàn giao, cách xem lại.
3. Năm SOP ưu tiên:
   - tiếp nhận liên hệ;
   - xác nhận và thay đổi lịch hẹn;
   - chuẩn bị ca;
   - thanh toán và bàn giao thông tin;
   - xử lý phản hồi/sự cố.
4. Mẫu khung một trang cho mỗi SOP.
5. Cách chạy thử trong một tuần và sửa phiên bản đầu.
6. Các lỗi thường gặp: SOP quá dài, không có owner, không định nghĩa đầu ra, chỉ viết mà không quan sát.
7. CTA đến `quy-trinh-check`.

**Nguồn nội dung:** Chương 1 và bài trụ cột. Không đưa hướng dẫn chuyên môn điều trị vào SOP mẫu.

**Internal links:** bài trụ cột; Chương 1 `/book/01-trien-khai-he-thong`.

**CTA copy dự kiến:** `Kiểm tra mức độ chuẩn hóa quy trình của phòng khám`.

### Bài 2 — Onboarding 14 ngày cho nhân sự mới tại phòng khám nha khoa

| Trường | Giá trị đề xuất |
| --- | --- |
| Title | `Onboarding 14 Ngày Cho Nhân Sự Mới Tại Phòng Khám Nha Khoa` |
| Slug | `onboarding-14-ngay-nhan-su-moi-phong-kham-nha-khoa` |
| Meta description | `Khung onboarding 14 ngày cho phòng khám nha khoa: từ giới thiệu văn hóa, học quy trình đến thực hành có giám sát.` |
| Category | `cat-nhan-su` |
| Scanner | `dao-tao-check` |
| Tags | `nhan-su`, `dao-tao`, `onboarding`, `phong-kham-moi` |
| Read time | 8–10 phút |
| Status | Tạo `draft`, duyệt nội dung rồi mới `published` |

**Ý định tìm kiếm:** chủ/quản lý cần một khung đào tạo người mới có thể dùng ngay.

**Cấu trúc:**

1. Onboarding không phải là gửi nội quy trong ngày đầu.
2. Trước ngày nhận việc: role card, người kèm, checklist, quyền truy cập và tiêu chí đạt.
3. Khung 14 ngày tham khảo:
   - ngày 1–3: bối cảnh, văn hóa, vai trò, quy tắc nội bộ;
   - ngày 4–7: học luồng công việc và các SOP liên quan;
   - ngày 8–10: thực hành có giám sát;
   - ngày 11–14: làm việc độc lập có hỗ trợ và review.
4. Checklist đánh giá cuối ngày 3, 7, 10, 14.
5. Phân biệt “chưa biết”, “chưa làm được” và “không phù hợp”.
6. Vì sao một người có thể kiêm nhiều vai trò nhưng trách nhiệm không được mơ hồ.
7. CTA đến `dao-tao-check`.

**Nguồn nội dung:** Chương 2, đặc biệt cấu trúc nhóm Điều trị/Hành chính/Marketing và khung 14 ngày. Thời lượng phải ghi rõ là khung tham khảo, không áp dụng tuyệt đối cho mọi vị trí.

**Internal links:** bài trụ cột; Chương 2 `/book/02-quan-tri-nhan-su`.

**CTA copy dự kiến:** `Đánh giá hệ thống đào tạo phòng khám`.

### Bài 3 — Từ tin nhắn đến lịch hẹn: thiết kế hệ thống tiếp đón nhất quán

| Trường | Giá trị đề xuất |
| --- | --- |
| Title | `Từ Tin Nhắn Đến Lịch Hẹn: Thiết Kế Hệ Thống Tiếp Đón Nhất Quán` |
| Slug | `tu-tin-nhan-den-lich-hen-he-thong-tiep-don-phong-kham` |
| Meta description | `Thiết kế luồng tiếp đón phòng khám từ liên hệ đầu tiên, xác nhận lịch, đón khách đến follow-up mà không phụ thuộc vào trí nhớ.` |
| Category | `cat-van-hanh` |
| Scanner | `tiep-don-check` |
| Tags | `tiep-don`, `lich-hen`, `trai-nghiem-benh-nhan`, `quy-trinh` |
| Read time | 9–11 phút |
| Status | Tạo `draft`, duyệt nội dung rồi mới `published` |

**Ý định tìm kiếm:** xử lý điểm đứt phổ biến giữa marketing, lễ tân, tư vấn và chăm sóc bệnh nhân.

**Cấu trúc:**

1. Vì sao trải nghiệm bắt đầu trước khi bệnh nhân bước vào phòng khám.
2. Bản đồ luồng: nhận liên hệ → ghi nhận nhu cầu → phản hồi → đề xuất lịch → xác nhận → nhắc lịch → đón tiếp → follow-up.
3. Chuẩn tối thiểu cho từng điểm chạm.
4. Các trường thông tin cần ghi nhận chung; tránh để dữ liệu trong chat cá nhân.
5. Quy tắc khi bệnh nhân đổi lịch, không phản hồi hoặc cần chuyển tiếp.
6. Ranh giới giữa giao tiếp vận hành và tư vấn y khoa.
7. Cách review luồng mỗi tuần bằng 3 câu hỏi.
8. CTA đến `tiep-don-check`.

**Nguồn nội dung:** nguyên tắc khách hàng là trung tâm trong Chương 1 và khung tiếp đón trong bài trụ cột. Không đưa cam kết chuyển đổi, doanh thu hoặc tỷ lệ hiệu quả không có nguồn.

**Internal links:** bài trụ cột; Bài 1 về SOP nếu đã xuất bản.

**CTA copy dự kiến:** `Kiểm tra quy trình tiếp đón khách hàng`.

### Bài 4 — Bảng dòng tiền hàng tuần cho chủ phòng khám

| Trường | Giá trị đề xuất |
| --- | --- |
| Title | `Bảng Dòng Tiền Hàng Tuần Cho Chủ Phòng Khám: Theo Dõi Gì Trước?` |
| Slug | `bang-dong-tien-hang-tuan-cho-chu-phong-kham` |
| Meta description | `Khung theo dõi dòng tiền hàng tuần cho phòng khám: tách tiền cá nhân, thu-chi, khoản phải trả và lịch ra quyết định.` |
| Category | `cat-tai-chinh` |
| Scanner | `tai-chinh-check` |
| Tags | `tai-chinh`, `dong-tien`, `quan-tri`, `phong-kham-moi` |
| Read time | 8–10 phút |
| Status | Tạo `draft`, duyệt nội dung rồi mới `published` |

**Ý định tìm kiếm:** chủ phòng khám cần cách nhìn tài chính đơn giản, đều đặn, không bắt đầu bằng báo cáo phức tạp.

**Cấu trúc:**

1. Doanh thu nhìn tốt không đồng nghĩa dòng tiền đang an toàn.
2. Tách tài khoản và dòng tiền cá nhân/doanh nghiệp.
3. Bốn nhóm cần có trong bảng tuần:
   - tiền đã thu;
   - khoản phải trả và chi phí đến hạn;
   - chi phí cố định sắp tới;
   - khoản chi cần phê duyệt.
4. Nhịp họp 30 phút: số liệu, chênh lệch, quyết định, owner.
5. Các câu hỏi cảnh báo sớm không dùng ngưỡng ngành:
   - khoản nào chưa được ghi nhận;
   - khoản nào đến hạn trước khi tiền về;
   - khoản chi nào không có owner;
   - quyết định nào đang chờ chủ.
6. Những điều không nên làm: dùng số liệu cảm tính, trộn tiền cá nhân, tự đặt ngưỡng lợi nhuận không có cơ sở.
7. Ghi chú cần làm việc với kế toán/chuyên gia cho nghĩa vụ cụ thể.
8. CTA đến `tai-chinh-check`.

**Nguồn nội dung:** phần tài chính và dòng tiền trong bài trụ cột; không sao chép các ngưỡng lợi nhuận hoặc số liệu ngành trong seed Blog cũ.

**Internal links:** bài trụ cột; Bài 1 nếu đã xuất bản để nối owner/quy trình phê duyệt.

**CTA copy dự kiến:** `Đánh giá sức khỏe tài chính của phòng khám`.

### Bài 5 — Quản lý vật tư phòng khám: từ mức tồn tối thiểu đến lịch kiểm kê

| Trường | Giá trị đề xuất |
| --- | --- |
| Title | `Quản Lý Vật Tư Phòng Khám: Mức Tồn Tối Thiểu Và Lịch Kiểm Kê` |
| Slug | `quan-ly-vat-tu-phong-kham-muc-ton-toi-thieu-lich-kiem-ke` |
| Meta description | `Khung quản lý vật tư phòng khám: danh mục thiết yếu, mức tồn tối thiểu, người đặt hàng, lịch kiểm kê và nhật ký thiết bị.` |
| Category | `cat-van-hanh` |
| Scanner | `kho-vat-tu-check` |
| Tags | `vat-tu`, `thiet-bi`, `van-hanh`, `checklist` |
| Read time | 8–10 phút |
| Status | Tạo `draft`, duyệt nội dung rồi mới `published` |

**Ý định tìm kiếm:** phòng khám mới cần tránh thiếu vật tư nhưng chưa cần một hệ thống kho phức tạp.

**Cấu trúc:**

1. Vật tư là một điểm bàn giao, không chỉ là việc mua hàng.
2. Phân loại danh mục: thiết yếu, cần theo dõi, có thể đặt theo nhu cầu.
3. Trường tối thiểu của một bảng vật tư: tên, đơn vị, mức tồn tối thiểu, số hiện có, owner, ngày kiểm tra, trạng thái.
4. Cách chọn mức tồn tối thiểu theo bối cảnh phòng khám, không đưa một con số chung cho mọi nơi.
5. Lịch kiểm kê: kiểm tra nhanh, kiểm kê định kỳ, rà thiết bị.
6. Nhật ký thiết bị và quy trình báo thiếu/hỏng.
7. Câu hỏi tự kiểm: ca nào bị ảnh hưởng nếu một món hết hôm nay?
8. CTA đến `kho-vat-tu-check`.

**Nguồn nội dung:** phần vật tư và thiết bị trong bài trụ cột. Không đưa hướng dẫn bảo quản chuyên môn hoặc quy định pháp lý nếu chưa có nguồn chuyên gia.

**Internal links:** bài trụ cột; Bài 1 về SOP nếu đã xuất bản.

**CTA copy dự kiến:** `Đánh giá hệ thống kho vật tư phòng khám`.

## Quy tắc biên tập chung cho cả 5 bài

- Mỗi bài chỉ có một H1 và heading hierarchy rõ ràng.
- Mở đầu bằng một vấn đề cụ thể, không mở bằng claim tăng doanh thu hoặc số liệu ngành.
- Các ví dụ phải ghi rõ là **tình huống minh họa**, không phải case study thực tế.
- Không dùng số liệu hiệu quả, ngưỡng lợi nhuận, tỷ lệ chuyển đổi hoặc tuyên bố y khoa nếu không có nguồn được duyệt.
- Phần điều trị/an toàn chỉ ở mức quản trị; không thay thế SOP lâm sàng, kiểm soát nhiễm khuẩn, quy định cấp phép hoặc hướng dẫn điều trị.
- Mỗi bài có:
  - một CTA Scanner chính;
  - `data-track-cta`;
  - `data-track-placement`;
  - microcopy đúng retention hiện tại: guest lưu kết quả 3 ngày nếu CTA nhắc đến lưu trữ.
- Gắn `scanner_id` chỉ sau khi xác nhận ID tồn tại trong `survey_definition` ở môi trường đích.
- `access_tier: free`, `is_recommended: true`, `is_featured: false`, `is_pinned: false` mặc định.
- Tạo `draft` trước, kiểm tra nội dung và SEO rồi mới publish.
- Cover nên dùng bộ minh họa SVG cùng phong cách với bài trụ cột, không dùng ảnh stock chung chung.
- Không liên kết đến các chương Tầng 1 đang draft.

## Thứ tự triển khai

### Đợt 1 — Nền vận hành

1. Bài 1: 5 SOP ưu tiên.
2. Bài 3: hệ thống tiếp đón.

Lý do: hai bài này dùng lại nhiều khái niệm từ Chương 1 và tạo nền cho các bài còn lại.

### Đợt 2 — Con người và nguồn lực

3. Bài 2: onboarding 14 ngày.
4. Bài 5: quản lý vật tư.

Lý do: mở rộng từ quy trình sang người thực hiện và nguồn lực cần để quy trình chạy ổn định.

### Đợt 3 — Tài chính và nhịp điều hành

5. Bài 4: dòng tiền hàng tuần.

Lý do: bài tài chính nên xuất bản sau khi các bài về owner, quy trình và nhịp review đã có liên kết nội bộ.

## Quy trình tạo và xuất bản

1. Viết nội dung Markdown theo brief từng bài.
2. Tạo cover SVG nếu chưa có asset phù hợp.
3. Tạo post trong D1 với:
   - status `draft`;
   - category và tags đúng ID;
   - scanner ID đúng `survey_definition`;
   - access tier `free`;
   - `is_recommended = 1`.
4. Đọc lại bằng route Blog và kiểm tra HTML/JSON-LD.
5. Kiểm tra internal links, CTA tracking, copy retention và heading hierarchy.
6. Duyệt nội dung/phạm vi y khoa-pháp lý.
7. Chuyển `draft` sang `published`, đặt `published_at`.
8. Xác minh `/blog`, route bài viết, related posts và mobile layout.

## Tiêu chí hoàn thành

- Năm bài có record D1, cover, tags và scanner association hợp lệ.
- Tất cả bài hiển thị đúng trên `/blog/{slug}` sau khi publish.
- Không có link tới chương Book draft.
- Không có claim không nguồn hoặc copy retention sai.
- CTA được tracking bằng `data-track-cta` và `data-track-placement`.
- Cụm bài có link qua lại hợp lý với bài trụ cột và các bài đã xuất bản trước đó.
