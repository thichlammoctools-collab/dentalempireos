import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';
const blocks = [];
function b(id, text) { blocks.push({ id, text: text.replace(/'/g, "''") }); }

// === Review Sheet MATURE ===
b('744dbbb5-fa30-4bfa-b18b-286b7ab4f254', `**MATURE** không chỉ là "ổn định hơn", mà là hệ thống đã có đà, có nhịp, có trust và đang tự nâng chuẩn. Review sheet ở tầng này cần giúp tổ chức nhìn ra mức độ chín thật của vận hành, thay vì chỉ nhìn vào kết quả bề mặt.`);
b('42f69f1d-bd84-485f-9016-8faba137c765', `- Kỳ review:
- Bộ phận:
- Người phụ trách:
- Người review:
- Mục tiêu kỳ này:`);

b('de78ae54-6ba9-4900-94f5-3754dd84af10', `**Momentum:** Hệ thống hiện có đang có đà đi lên không? Đà đó đến từ đâu? Có điểm nào làm đà bị chậm, gãy hoặc hụt không? Tổ chức đang tạo momentum thật hay chỉ đang chạy theo quán tính?`);
b('2b86178a-9782-4f48-917c-fc56dd7201ee', `**Attune:** Các bộ phận có đang cùng nhịp không? Nhịp làm việc giữa các vai trò có đang lệch nhau không? Có chỗ nào cần chỉnh cadence, lịch họp, nhịp giao ban hoặc tốc độ phối hợp không? Điều gì đang làm hệ thống thiếu đồng pha?`);
b('0a05183c-266e-4bf7-a12e-ef41de09ccf5', `**Trust:** Mức độ tin cậy giữa người với người ra sao? Đội ngũ có dám nói thật, báo thật và nhận thật không? Có bộ phận nào đang mất trust với nhau hoặc với hệ thống không? Cơ chế nào đang giúp xây trust, và cơ chế nào đang làm trust hao mòn?`);
b('4cfa8a53-63de-4d1b-a207-25812c0b9ef9', `**Unite:** Các bộ phận đã thực sự hợp lực chưa? Có tình trạng làm việc theo silo, đẩy việc hoặc ngắt kết nối không? Nguồn lực có đang được gom về một mục tiêu chung không? Điểm nào cần tăng liên kết giữa chức năng, vai trò và trách nhiệm?`);
b('48523740-eb7d-4388-a855-abf3777e298a', `**Refine:** Quy trình nào cần được làm gọn, làm rõ hoặc làm sắc hơn? Có điểm nào đang gây ma sát, lặp lại hoặc lãng phí năng lượng? Hệ thống có đang quá nặng, quá rối hay quá nhiều lớp trung gian không? Cái gì cần tinh chỉnh ngay để vận hành mượt hơn?`);
b('aaf070b8-dd73-4191-a30e-bea026b45b7d', `**Elevate:** Chuẩn hiện tại đã đủ cao chưa? Tổ chức đang nâng tầng ở năng lực nào: con người, quy trình, dữ liệu hay tư duy? Có chỉ số nào cho thấy hệ thống đang đi lên một nấc mới không? Điều gì cần được nâng chuẩn để tạo nền cho chu kỳ trưởng thành tiếp theo?`);

b('2cc1e184-0aa9-409e-8421-9cc3c6192e62', `- Hệ thống hiện tại đang chín ở đâu, và non ở đâu?
- Điểm nghẽn lớn nhất khiến tổ chức chưa mature hơn là gì?
- Điều gì cần được chỉnh ngay để tăng độ chín của toàn hệ thống?
- Nếu giữ nguyên nhịp hiện tại thêm 3 tháng, hệ thống sẽ mạnh hơn hay mòn đi?`);

b('bac71d34-c8a3-4021-9c85-2e7034272f0c', `- Chọn 6 mảng: Momentum, Attune, Trust, Unite, Refine, Elevate.
- Với mỗi mảng, viết 1-2 câu mô tả thực trạng hiện tại.
- Chỉ ra đâu là điểm mạnh cần giữ, đâu là điểm yếu cần chỉnh.
- Lập danh sách 3 hành động ưu tiên cho kỳ review tiếp theo.
- Giao người phụ trách và thời hạn cụ thể cho mỗi hành động.`);

b('4c4cde0e-7990-42a9-b0ea-c7337cda725b', `Review sheet giúp tổ chức không bị lạc vào kết quả bề mặt mà nhìn thấy rõ vận hành đã "chín" hay còn "non". Khi review đúng, **MATURE** trở thành nhịp sống định kỳ giúp hệ thống liên tục tự nâng chuẩn.`);

// === Resource Map & KPI ALIGN ===
b('5257ff60-fc14-44b0-8578-7c3692857b3f', `**ALIGN** cần một bản đồ nguồn lực rõ ràng để mục tiêu không bị treo trên không trung. Mỗi mục tiêu phải nối được với người thực hiện, nguồn lực cần có, cơ chế kiểm soát và chỉ số đánh giá.`);

b('3ce27128-b0a1-4d0e-9401-26bf937f16b4', `**Bản đồ mục tiêu** — Mục tiêu chung của tổ chức là gì? Được chia thành mấy mục tiêu con? Mỗi mục tiêu con thuộc tầng nào?`);
b('9d69dc19-53e5-47eb-b511-a61f9e5a7577', `**Bản đồ nguồn lực** — Với mỗi mục tiêu, cần những nguồn lực nào: con người, công cụ, dữ liệu, ngân sách? Nguồn lực hiện có đang thiếu gì?`);
b('62331390-0536-4c68-947a-27d942da78a8', `**Bản đồ liên kết** — Mục tiêu này phụ thuộc vào bộ phận nào? Có sự phối hợp nào cần được thiết lập? Có điểm nào đang bị ngắt kết nối giữa các bộ phận không?`);

// KPI sections
b('2f839481-285d-4e6c-ab7e-760b21193752', `**Anchor KPI** — Neo mục tiêu chung`);
b('e0ebdd43-cb43-43b1-93ac-431f8388122f', `- Mục tiêu chính của kỳ này là gì?
- Có bao nhiêu phần trăm đội ngũ biết rõ mục tiêu đó?
- Mục tiêu có được nhắc đến trong mỗi cuộc họp tuần không?
- Ai là người cuối cùng chịu trách nhiệm cho mục tiêu này?`);
b('7a6da7db-161b-4c44-a434-f1948d70bbb8', `**Link KPI** — Nối nguồn lực`);
b('f23db27f-e14d-423a-97d3-d8a6d3a61da7', `- Mỗi mục tiêu đã có đủ nguồn lực chưa: con người, công cụ, dữ liệu?
- Có sự phối hợp nào đang bị ngắt giữa các bộ phận không?
- Nguồn lực nào đang bị dàn trải quá mỏng?`);
b('9499a015-7219-4593-afea-240dd0d79a0b', `**Integrate KPI** — Tích hợp hệ thống`);
b('cd111dd4-6728-42fb-8da5-6deecd397907', `- Quy trình giữa các bộ phận có liền mạch không?
- Có bước nào đang bị lặp lại hoặc bỏ sót không?
- Dữ liệu có được truyền tải đúng người, đúng lúc không?`);
b('f3d39385-f16e-493d-a699-27d755fa8a76', `**Govern KPI** — Quản trị nhịp vận hành`);
b('7c17b713-1259-45b9-a6bd-4fe6c1e699d1', `- Có lịch họp, lịch report định kỳ không?
- Ai quyết định khi có lệch pha?
- Cơ chế escalations đã rõ chưa?`);
b('c6a077a2-49d0-496e-9dcc-0a73be422734', `**Narrow KPI** — Thu hẹp khoảng lệch`);
b('7dfef865-4a27-4cb5-83b8-43acf6d65536', `- Khoảng lệch giữa KPI mục tiêu và thực tế là bao nhiêu?
- Lệch chủ yếu ở khâu nào: lên kế hoạch, phân bổ nguồn lực, hay thực thi?
- Hành động nào cần ưu tiên để thu hẹp khoảng lệch trong 30 ngày tới?`);

// Cách dùng KPI
b('26cb272a-5938-46dc-a92e-ef0d6402a34f', `- Bước 1: Liệt kê 3-5 mục tiêu chính của kỳ review.
- Bước 2: Với mỗi mục tiêu, gắn 1 Anchor KPI (chỉ số neo), 1 Link KPI (chỉ số phối hợp), 1 Narrow KPI (chỉ số thu hẹp lệch).
- Bước 3: Xác định người phụ trách và tần suất cập nhật cho mỗi KPI.
- Bước 4: Thiết lập một bảng theo dõi đơn giản, cập nhật hàng tuần.
- Bước 5: Trong mỗi cuộc họp review, bắt đầu bằng KPI và kết thúc bằng hành động.`);

// Câu chốt ALIGN
b('17a99a82-62cc-46f9-a03d-9b9d6e46a3cd', `**ALIGN** không phải là tạo ra một hệ thống hoàn hảo ngay lập tức, mà là liên tục giảm khoảng lệch giữa mục tiêu và thực tế. Khi mục tiêu đã được neo, nguồn lực đã được nối, bộ máy đã được tích hợp và cơ chế quản trị đã rõ, tổ chức mới có thể chạy khớp hơn, ít lệch pha hơn và ổn định hơn khi tăng trưởng.`);

// === PROSPER ===
b('0f2e3815-e7a4-4906-8a7f-6839533156f3', `**PROSPER** là tầng mà kết quả không dừng ở thành tích đơn lẻ, mà được biến thành nhiên liệu cho chu kỳ tiếp theo. Mỗi thành quả tốt phải sinh ra giá trị mới, tái đầu tư đúng chỗ và mở rộng thành nhiều vòng tăng trưởng.`);

b('3042ac52-9ef6-45b4-acdd-24fbe2a43985', `**Proliferate** — Sinh sôi: Giá trị hiện tại có thể nhân lên bằng cách nào? Có cơ hội nào để kết quả hiện tại tạo ra tác động mới, người dùng mới hoặc niềm tin mới không?`);
b('6a661c48-f102-4975-9aa4-b77a8dccfeb5', `**Reinvest** — Tái đầu tư: Thành quả đang được tái đầu tư đúng chỗ chưa? Có phần nào bị tiêu hao hết mà không quay lại hệ thống không? Cần ưu tiên tái đầu tư vào đâu để vòng tiếp theo mạnh hơn?`);
b('210504e7-7f7c-4097-9093-e64b25e939b5', `**Optimize** — Tối ưu: Điều gì đang gây ma sát và cần được làm gọn? Có quy trình nào đang quá nặng, quá chậm hoặc quá phức tạp không? Ưu tiên tối ưu cái gì để hệ thống chạy mượt hơn?`);
b('350fe3b4-9d86-4e85-a793-0a97cc7daa36', `**Scale** — Mở rộng: Tổ chức đã đủ nền để mở rộng chưa? Cần thêm nguồn lực nào trước khi scale? Rủi ro bật gốc nào cần được xử lý trước?`);
b('96fcec54-b4d9-4eff-8aed-0763c7be93d1', `**Propagate** — Lan truyền: Giá trị nào có thể lan rộng qua referral, cộng đồng hoặc đối tác? Có cơ hội nào để trải nghiệm tốt của khách hàng hiện tại tạo ra khách hàng mới không? Làm thế nào để niềm tin được nhân rộng tự nhiên?`);
b('b7167741-5219-4832-adb3-97f9cc3f0f7a', `**Enrich** — Làm giàu: Hệ sinh thái đang được làm giàu bằng cách nào? Có dữ liệu, kinh nghiệm hoặc nguồn lực nào chưa được tận dụng không? Cần thêm gì để hệ thống có chiều sâu hơn?`);
b('30ce9702-6749-4b6d-b3fb-f3dc73fd7c83', `**Renew** — Làm mới: Có gì đang cũ hóa cần được thay đổi không? Tổ chức có đang mắc kẹt trong mô hình đã thành công quá lâu không? Cần làm mới ở đâu để hệ thống luôn sống động?`);

// Câu hỏi thiết kế
b('2d0f609a-62ae-4536-a0df-7476de011041', `- Giá trị nào tổ chức vừa tạo ra có thể sinh sôi thêm?
- Thành quả hiện tại có đang được tái đầu tư đúng chỗ không?
- Điều gì cần tối ưu trước khi mở rộng?
- Tổ chức đã đủ nền tảng để scale chưa?
- Giá trị nào có thể lan truyền thành niềm tin và referral?
- Hệ sinh thái đang được làm giàu theo hướng nào?
- Làm sao để mỗi vòng tăng trưởng sau mạnh hơn vòng trước?`);

// Chỉ số theo dõi PROSPER
b('82d74534-31d7-4cbc-b59d-403b316ca3bf', `**1. Tỷ lệ referral**`);
b('8e46146c-dfe4-448a-be84-f750db835a24', `- Bao nhiêu phần trăm khách hàng mới đến từ giới thiệu?
- Tỷ lệ này đang tăng hay giảm?
- Điều gì đang ảnh hưởng đến quyết định giới thiệu của khách hàng?`);
b('ed603c49-54bc-4d70-b6d4-fb2afa98f613', `**2. Tỷ lệ tái đầu tư**`);
b('0135173a-674e-45bf-b096-e3ef99fccdcf`, `- Có bao nhiêu phần trăm kết quả được quay lại hệ thống?
- Thành quả có đang bị tiêu hao hết trong hiện tại không?
- Khoản tái đầu tư nào tạo ra hiệu quả cao nhất?`);
b('fe239bd8-5192-4c97-a38d-042b0bf3e944', `**3. Tốc độ tối ưu**`);
b('4c7d06ea-532a-44a6-95c6-8b4af6f14a8a', `- Có bao nhiêu quy trình được cải tiến trong kỳ này?
- Ma sát nào đang được giảm tốt nhất?
- Tổ chức có đang nhanh hơn, gọn hơn và rõ hơn so với kỳ trước không?`);
b('388f5a59-45c1-43af-8176-b4fd7c9c8905', `**4. Tỷ lệ scale thành công**`);
b('6d3723c8-efee-4963-ae3d-13145bdcf66e', `- Tổ chức đã mở rộng thêm được bao nhiêu mà không mất chuẩn?
- Có sự cố nào xảy ra do mở rộng quá nhanh không?
- Nền tảng nào cần được vững hơn trước khi scale tiếp?`);
b('582b5f90-931f-4f1d-a373-efb52f39902a', `**5. Tỷ lệ lan truyền**`);
b('69dad538-febb-44ca-927a-6cbc723a44da', `- Nội dung, review hoặc câu chuyện của tổ chức có đang được chia sẻ tự nhiên không?
- Cộng đồng bệnh nhân có đang tích cực giới thiệu cho người thân không?
- Thương hiệu có đang lan rộng mà không cần ngân sách quảng cáo lớn không?`);
b('9b5a9d11-e04a-49a9-9fd1-4bc9baa4333a', `**6. Chiều sâu hệ sinh thái**`);
b('35def21a-95db-4599-ae0e-82caca33f42c', `- Tổ chức có đang tích lũy dữ liệu, kinh nghiệm và nguồn lực mới không?
- Hệ sinh thái có đang giàu hơn về chiều sâu so với kỳ trước?
- Có đối tác, nguồn lực hoặc dữ liệu nào chưa được tận dụng hết không?`);
b('622cd322-1796-4e7b-a1a0-1b9d2789b297', `**7. Tần suất đổi mới**`);
b('f85421f6-e5af-4e73-8ab4-f38f6f59c6e4', `- Tổ chức có đang thử nghiệm điều mới mỗi quý không?
- Có mô hình nào đang cần được thay đổi hoặc cập nhật không?
- Làm sao để hệ thống không bị mắc kẹt trong một cách làm đã cũ?`);

// Câu chốt PROSPER
b('ce1f975e-61d2-4731-ace2-1f7fd25c6e3c', `**PROSPER** không phải là đích đến cuối cùng, mà là vòng lặp sống giúp tổ chức liên tục tạo ra giá trị mới, tái đầu tư thành quả, mở rộng có kiểm soát và làm mới chính mình. Khi **PROSPER** vận hành đúng, mỗi vòng tăng trưởng sau sẽ mạnh hơn vòng trước — đó chính là hiệu ứng bánh đà.`);

console.log(`Phase 3: ${blocks.length} blocks to update`);

const BATCH = 10;
for (let i = 0; i < blocks.length; i += BATCH) {
  const batch = blocks.slice(i, i + BATCH);
  const sqls = batch.map(u => `UPDATE "block" SET "text_md" = '${u.text}' WHERE "id" = '${u.id}';`);
  const multi = sqls.join('\n');
  const tmpFile = join(tmpdir(), `c4p3_${Date.now()}.sql`);
  writeFileSync(tmpFile, multi);
  try {
    execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
    process.stdout.write(`✓ Batch ${Math.floor(i/BATCH)+1}/${Math.ceil(blocks.length/BATCH)} (${batch.length} blocks)\n`);
  } catch (e) {
    console.log(`  Retrying batch ${Math.floor(i/BATCH)+1}...`);
    execSync(`npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`, { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] });
    console.log(`  ✓ Retry done\n`);
  } finally { try { unlinkSync(tmpFile); } catch {} }
}
console.log(`\n✓ Chapter 4 Phase 3 DONE: ${blocks.length} blocks`);
