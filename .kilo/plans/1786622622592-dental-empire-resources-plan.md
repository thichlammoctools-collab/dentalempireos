# Kế hoạch phát hành 3 bộ tài liệu Dental Empire OS

## Mục tiêu

Tạo và đưa vào hệ thống 3 bộ tài liệu giải quyết các vấn đề vận hành ưu tiên của phòng khám:

1. **Clinic Core SOP Playbook** — miễn phí.
2. **CRM Pipeline, Lead SLA & Booking Conversion Kit** — premium, giá Credits cấu hình sau trong Admin.
3. **Patient Lifecycle & Recall Toolkit** — premium, giá Credits cấu hình sau trong Admin.

Mỗi bộ gồm ít nhất **1 PDF hướng dẫn + 1 XLSX công cụ vận hành**. Nội dung chỉ là framework vận hành, script và trường dữ liệu; không phát hành hướng dẫn điều trị, hướng dẫn hậu phẫu hoặc tuyên bố lâm sàng chung. Các phần cần chuyên môn sẽ dùng placeholder để từng phòng khám/bác sĩ phê duyệt.

## Quyết định đã chốt

- Không seed giá Credits trong migration/script. Admin tự tạo và điều chỉnh pricing rule sau.
- Tài nguyên được tạo ở trạng thái **draft**, chỉ công khai sau khi admin duyệt.
- Draft và asset draft chỉ admin được xem/tải.
- Khi published:
  - SOP miễn phí được tải tự do.
  - CRM và Recall yêu cầu Credit grant.
  - Premium chưa có giá hiển thị trạng thái “Sắp mở khóa”, không cho tải và không làm hỏng trang.
- Mỗi bộ có nhiều asset riêng; không gộp ZIP và không tách PDF/XLSX thành hai sản phẩm độc lập.
- Sinh file tự động từ manifest nội bộ; PDF dùng pipeline Playwright hiện có, XLSX dùng ExcelJS.
- Premium asset không đặt trong `public/files`; lưu R2 qua resource delivery có kiểm soát.

## Hiện trạng cần tận dụng

- Resource catalog: `src/lib/resource-db.ts` và migration `migrations/0003_create_resources.sql`.
- Admin CRUD/upload: `src/pages/admin/resources/index.astro`, `src/pages/api/admin/resources.ts`, `src/pages/api/admin/resources/[id].ts`, `src/pages/api/admin/upload.ts`.
- Public resource page: `src/pages/resources/index.astro`.
- Media authorization: `src/pages/media/[...key].ts` và `src/lib/entitlement-check.ts`.
- Credits unlock: `src/pages/api/credits/redeem.ts`, `src/lib/credit-db.ts`.
- PDF rendering: `scripts/clinical-content-portfolio-deck.mjs`, `scripts/render-clinical-content-portfolio.mjs`.

## Phạm vi nội dung

### 1. Clinic Core SOP Playbook — free

PDF:

- Tư duy chuẩn hóa: SOP, checklist, owner, SLA, bằng chứng hoàn thành.
- SOP tiếp nhận lead và phản hồi đầu tiên.
- SOP xác nhận lịch hẹn và xử lý no-show.
- SOP check-in và bàn giao lễ tân–điều phối–lâm sàng.
- SOP bàn giao sau điều trị sang CSKH.
- SOP recall/review/referral trigger ở cấp vận hành.
- Cơ chế audit tuần và cập nhật phiên bản SOP.

XLSX:

- SOP register: mã, phiên bản, owner, ngày hiệu lực, ngày review.
- Daily/weekly checklist.
- Exception log và corrective action log.
- Completion dashboard.

Không đưa vào: phác đồ, liều lượng, chỉ dẫn điều trị hoặc cam kết kết quả y khoa.

### 2. CRM Pipeline, Lead SLA & Booking Conversion Kit — premium

PDF:

- Pipeline chuẩn: New Lead → Contacted → Qualified → Booked → Confirmed → Completed → Follow-up/Lost.
- Quy tắc owner và mandatory fields.
- SLA phản hồi lead và next action.
- Kịch bản phản hồi đầu tiên, xác nhận lịch, xử lý do dự và no-show.
- Lịch follow-up theo trạng thái lead.
- Lost reason và weekly funnel review.

XLSX:

- Lead pipeline.
- Source/UTM taxonomy.
- SLA aging và overdue view.
- Booking/show-up conversion dashboard.
- Lost reason analysis.

Không đưa vào: tư vấn chẩn đoán hoặc khuyến nghị điều trị cho bệnh nhân.

### 3. Patient Lifecycle & Recall Toolkit — premium

PDF:

- Patient lifecycle: pre-visit, check-in, treatment-day handoff, post-visit operational follow-up, recall, reactivation, review.
- Vai trò và SLA của reception, assistant, doctor, CSKH.
- Script nhắc lịch, xác nhận, hỏi trải nghiệm và service recovery.
- Trường dữ liệu recall: due date, owner, channel, status, outcome, next action.
- Quy trình phản hồi tiêu cực và chuyển tuyến nội bộ.
- KPI: recall rate, no-show rate, reactivation, review/referral trigger.

XLSX:

- Recall due list.
- Reactivation tracker.
- Follow-up outcome log.
- Feedback/service recovery log.
- KPI dashboard.

Các hướng dẫn sau điều trị sẽ là placeholder: `[Nội dung cần phụ trách chuyên môn phê duyệt]`.

## Thiết kế dữ liệu và migration

### Resource catalog

Mở rộng bảng `resource` để có:

- `status`: `draft`, `published`, `archived`.
- `access_mode`: `free`, `credits`.
- `slug` hoặc ID ổn định không phụ thuộc title.
- `published_at`, `created_by_user_id`, `updated_by_user_id`.
- `primary_asset_id` nếu cần tương thích.

Giữ các cột cũ (`tier`, `file_ext`, `file_url`) trong giai đoạn chuyển tiếp để không phá resource hiện hữu.

### Resource assets

Tạo bảng `resource_asset` với:

- `id`, `resource_id`.
- `storage_key`, `original_filename`, `download_filename`.
- `mime_type`, `file_ext`, `byte_size`, `sha256`.
- `locale`, `asset_role`, `version`, `is_current`.
- `created_by_user_id`, `created_at`, `retired_at`.

Mỗi bộ đợt đầu có hai asset role `download`: một PDF và một XLSX.

### Resource relations/manifest metadata

Nếu không cần liên kết chương ngay đợt đầu, lưu chapter/source tags trong manifest và description. Không mở rộng relation table ngoài phạm vi cần thiết cho lần phát hành này.

### Pricing

Không tạo `credit_pricing_rule` seed. Chỉ bảo đảm public/admin UI xử lý đúng ba trạng thái:

- Free published → tải được.
- Premium published + pricing rule → hiển thị mở khóa Credits.
- Premium published không có pricing rule → “Sắp mở khóa”, không tải.

## Manifest và file generation

Tạo manifest TypeScript/JSON nội bộ, ví dụ `src/data/resources/clinic-resource-manifest.ts`, chứa:

- stable resource ID/slug.
- title/description/category/tag/icon/sort order.
- status draft.
- access mode.
- outline PDF.
- workbook sheet definitions, columns, formulas, validation rules.
- output filenames.
- source/chapter references.
- clinical/legal review flags.

Tạo script generation trong `scripts/`:

1. Render HTML/PDF bằng Playwright và font Be Vietnam Pro hiện có.
2. Sinh XLSX bằng ExcelJS với:
   - sheet README/instructions;
   - frozen headers;
   - data validation/dropdowns;
   - protected formula cells;
   - sample data được đánh dấu rõ;
   - version và disclaimer trong workbook.
3. Ghi checksum, size và manifest output.
4. Không upload vào `public/files` nếu asset là premium.

Thêm dependency/script tối thiểu trong `package.json`; không chạy formatter toàn repo.

## Upload, seed và publish flow

Tạo script importer có dry-run:

1. Kiểm tra manifest, file tồn tại, MIME/extension, checksum và resource ID không trùng.
2. Sinh hoặc kiểm tra PDF/XLSX.
3. Upload vào R2 prefix `resources/<resource-id>/<version>/...`.
4. Insert/upsert resource ở `draft`.
5. Insert resource assets với metadata đầy đủ.
6. Không tạo pricing rule.
7. In ra danh sách resource/asset đã seed để admin kiểm duyệt.

Importer phải idempotent và không xóa asset phiên bản cũ tự động.

## Admin UI/API cần cập nhật

- Cho phép lọc và hiển thị `draft/published/archived`.
- Cho phép chuyển trạng thái draft → published và published → archived.
- Hiển thị các asset PDF/XLSX trong cùng một resource.
- Cho phép thay thế asset bằng version mới, không ghi đè lịch sử.
- Chặn publish nếu thiếu asset bắt buộc.
- Premium không yêu cầu giá khi tạo draft; cảnh báo khi publish chưa có pricing rule.
- Server-side validate category, access mode, status, MIME, extension, title/description và ID.
- Không dùng `innerHTML` trực tiếp với dữ liệu resource chưa escape.
- Giữ upload admin-only.

## Public resource page và delivery

- Chỉ query `status='published'` ở trang public.
- Card resource hiển thị access mode, định dạng asset và trạng thái.
- Với bộ nhiều asset, hiển thị từng nút tải PDF/XLSX nhưng cùng một entitlement resource.
- Dùng `/media/<storage-key>` cho toàn bộ resource asset.
- `/media` phải từ chối key không được resource asset tham chiếu; draft chỉ cho admin.
- Không dùng external URL cho premium.
- Đồng bộ category taxonomy giữa admin và public, tránh `checklist`/`checklists` lệch nhau.
- Nếu chưa có pricing rule cho premium, không gọi redeem API và không hiển thị nút mở khóa giả.

## Validation và kiểm thử

### Nội dung

- Mỗi PDF có mục tiêu, đối tượng dùng, hướng dẫn triển khai, checklist, KPI, phiên bản và disclaimer.
- Mỗi XLSX mở được, công thức không lỗi, dropdown hoạt động, vùng nhập liệu rõ, sample data không bị hiểu là dữ liệu thật.
- Không có hướng dẫn lâm sàng chưa được duyệt.

### Phân quyền

- Anonymous: chỉ thấy published free.
- Authenticated: thấy published free; premium thấy card nhưng không tải nếu chưa grant.
- Premium chưa có giá: trạng thái “Sắp mở khóa”, không tải.
- User đã redeem: tải được cả PDF/XLSX.
- Draft/archived: không xuất hiện public; admin có thể xem/tải.
- Unknown/unreferenced R2 key: bị từ chối.

### Data/API

- Importer chạy lần hai không tạo bản ghi/asset trùng.
- Publish thiếu asset bắt buộc bị từ chối.
- Asset replacement tạo version mới và không làm hỏng grant cũ.
- Resource delete/archive không để R2 key mồ côi không kiểm soát.
- Category filter, search, pagination và resource count dùng D1 thống nhất.

### Build

- `npx tsc --noEmit`.
- Test generator/importer dry-run.
- `npm run build` hoặc `npm run astro -- check` trong môi trường Workers khả dụng.
- Kiểm tra `git diff --check`.
- Không sửa/xóa các thay đổi đang có sẵn ngoài phạm vi resource.

## Thứ tự thực hiện

1. Chuẩn hóa schema resource/asset và migration.
2. Viết manifest nội dung và asset contract.
3. Bổ sung generator PDF/XLSX.
4. Viết importer R2 + D1 có dry-run/idempotency.
5. Cập nhật entitlement/media để hỗ trợ draft, nhiều asset và trạng thái thiếu pricing.
6. Cập nhật admin CRUD/upload/version/publish.
7. Cập nhật public resource cards/download buttons/filter taxonomy.
8. Sinh và seed 3 bộ ở draft.
9. Chạy kiểm thử phân quyền, dữ liệu và file.
10. Admin kiểm duyệt nội dung rồi tự publish và cấu hình giá Credits cho CRM/Recall.

## Ngoài phạm vi đợt này

- Bảy bộ tài liệu còn lại.
- DOCX generation.
- Resource detail page SEO riêng.
- Download analytics đầy đủ.
- Bundle pricing hoặc shared entitlement giữa nhiều resource.
- Nội dung hướng dẫn điều trị/hậu phẫu có tính lâm sàng.
