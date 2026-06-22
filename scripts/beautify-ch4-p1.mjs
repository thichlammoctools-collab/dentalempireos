import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';
const blocks = [];
function b(id, text) { blocks.push({ id, text: text.replace(/'/g, "''") }); }

// Intro
b('dc8f6a23-143e-4eda-ae85-af84cb0c676a', `Mỗi doanh nghiệp sẽ có bối cảnh, quy mô, năng lực và vấn đề khác nhau, nên điều quan trọng không phải là sao chép mẫu có sẵn, mà là đi qua đúng 7 tầng để tạo ra bộ khung phù hợp với chính mình.`);
b('9c4c839c-8982-48b1-833b-3c96d49d6c21', `Tinh thần xuyên suốt là: làm rõ tới đâu, đi được tới đó.`);
b('b9d37c03-cab5-4e70-9da5-56e32b19572c', `Muốn thực hành **R.O.A.D.M.A.P** đúng, cần giữ 3 nguyên tắc:`);
b('ca8ec85c-ca87-4592-934e-f6c92f598768', `- Thứ nhất, không bắt đầu bằng giải pháp, mà bắt đầu bằng căn nguyên và bản sắc.
- Thứ hai, mỗi tầng phải tạo ra một đầu ra cụ thể để tầng sau có cái mà bám vào.
- Thứ ba, **R.O.A.D.M.A.P** phải là một vòng lặp sống, không phải một bản kế hoạch treo tường.`);

// 7 tầng overview
b('6866487d-da99-478f-b815-2ddf487aa677', `- Bắt đầu bằng việc xác định tổ chức là ai và vì sao nó tồn tại.
- Ở tầng này, hãy làm rõ sứ mệnh, bản sắc, giá trị gốc và **Operating Code** nền.
- Nếu **ROOTS** chưa xong thì chưa nên bàn tới tăng trưởng, vì chưa có gốc thì mọi mở rộng đều dễ lệch.`);
b('112c3121-55ca-4fa6-8d10-e7fa7eb52359', `- Sau khi có gốc, cần chốt ánh sáng chung để toàn hệ thống cùng hướng.
- Tầng này dùng để xác định chuẩn mực đạo đức, lằn ranh đỏ, và hệ giá trị dẫn đường cho quyết định.
- Khi **ONE LIGHT** rõ, tổ chức sẽ bớt mâu thuẫn nội bộ vì mọi người có chung tiêu chuẩn để quay về.`);
b('a1851ac8-becc-4d0e-9d89-2c3fb47c33db', `- Tầng này dùng để nhìn thật tình trạng hiện tại.
- Tổ chức cần audit nội bộ, quan sát thị trường, vẽ bản đồ khoảng cách và nhận diện tín hiệu sớm.
- Nếu không **AWAKEN**, roadmap sẽ được viết trên ảo giác chứ không phải trên thực tế.`);
b('f664b039-99f6-485e-9cba-b495c4b3d55a', `- Khi đã biết vấn đề là gì, phải chuẩn hóa nó thành quy trình.
- Tầng này biến nhận thức thành SOP, checklist, vai trò, trách nhiệm và tiêu chuẩn thực thi.
- Đây là nơi roadmap bắt đầu có hình hài vận hành thật.`);
b('e5ca4fe1-b962-4042-a7e6-e6287e7fe551', `- Sau chuẩn hóa là làm cho hệ thống chín hơn.
- **MATURE** dùng để chỉnh nhịp, tăng độ ăn khớp, giảm ma sát, và tạo đà cho tổ chức vận hành bền hơn.
- Tầng này rất quan trọng vì một hệ thống có thể chạy nhanh nhưng chưa chắc đã chín.`);
b('40f1794f-fc7d-4f90-af4a-e7f5959f6f4f', `- Tầng này dùng để nối chiến lược với nguồn lực và vận hành.
- Mục tiêu, vai trò, **KPI**, nguồn lực và tiến độ phải được đồng bộ lại để tránh lệch pha.
- Nếu không **ALIGN**, tổ chức sẽ có kế hoạch rất hay nhưng thực địa lại chạy theo một logic khác.`);
b('9998e303-a376-4414-8b2a-03cdae69df2c', `- Cuối cùng là tạo vòng sinh sôi, tái đầu tư và làm mới.
- Tầng này biến kết quả thành nhiên liệu cho chu kỳ tiếp theo, thay vì để thành quả bị tiêu hao.
- **PROSPER** là đích của một roadmap sống: tăng trưởng nhưng vẫn có khả năng tự **RENEW**.`);

// Bộ câu hỏi
b('1012affc-7730-4498-b8e2-43ca27e07c6c', `Mỗi tầng nên có 3 nhóm câu hỏi: **chẩn đoán, thiết kế, triển khai**.`);
b('b1ad4bd4-2e46-4ef0-b814-9ef49ea7c86d', `*Ví dụ ở **ROOTS**, câu hỏi chẩn đoán là "chúng ta là ai"; câu hỏi thiết kế là "bản sắc nào cần chốt"; câu hỏi triển khai là "ai chịu trách nhiệm đóng gói thành tuyên ngôn".*`);
b('c5c15d33-8781-44fb-8e85-9c6de3214ae9', `Cách hỏi này giúp roadmap không bị trôi sang triết lý chung chung mà luôn gắn với hành động cụ thể.`);

// Bộ công cụ
b('60739091-42f9-464f-9cef-304da39b6f18', `Để viết được **R.O.A.D.M.A.P** cho từng doanh nghiệp, nên chuẩn bị 6 công cụ cố định:`);
b('9e916bf0-fefd-4c13-9ff9-f711ff4a5ab3', `- Workshop form để khai mở **ROOTS** và **ONE LIGHT**.
- Audit form để làm rõ **AWAKEN**.
- SOP template để chuẩn hóa **DEEPEN**.
- Review sheet để theo dõi **MATURE**.
- **KPI**/resource map để làm **ALIGN**.
- Growth loop canvas để thiết kế **PROSPER**.`);

// Đầu ra cuối cùng
b('19fe339a-9bef-49ec-9920-54454cbe8b21', `Sau khi đi đủ 7 tầng, doanh nghiệp phải có một **R.O.A.D.M.A.P** hoàn chỉnh gồm 7 phần. Mỗi phần phải trả lời được: tổ chức là ai, vận hành theo nguyên tắc nào, đang ở đâu, cần chuẩn hóa gì, cần chín hơn ở đâu, cần đồng bộ ra sao và cần tăng trưởng bằng cơ chế nào.

Khi đó roadmap không còn là kế hoạch, mà là **bản đồ vận hành và tiến hóa** của doanh nghiệp.`);

// Cách dùng trong thực tế
b('e030549b-0d87-4e5a-a408-333c331e6af6', `Một buổi triển khai **R.O.A.D.M.A.P** nên đi theo trình tự: chốt nền, soi thực trạng, chọn ưu tiên, chuẩn hóa, đồng bộ, và thiết kế vòng tăng trưởng.`);
b('520579bf-46fa-4c71-bc1d-268ed0f77bbe', `Với doanh nghiệp nhỏ, có thể làm gọn trong 1–2 buổi workshop; với doanh nghiệp lớn, nên tách thành nhiều vòng để đào sâu từng tầng.`);
b('b139e43c-5a0e-4f3b-b993-e2b86d2b9be9', `Quan trọng nhất là sau mỗi buổi phải có đầu ra viết được, đo được và giao việc được.`);

// === ONE LIGHT (section 22-26) ===
b('28b09add-ef31-4867-9ef3-9efcb0dfd142', `**ONE LIGHT** là tầng **định hướng và chuẩn mực**, nơi tổ chức thống nhất một lòng, giữ phẩm giá và không thỏa hiệp với những giá trị đạo đức cốt lõi. Tầng này giúp tổ chức có một "ngọn đèn soi đường" để mọi quyết định không bị lệch khỏi bản sắc ban đầu.`);
b('be19680a-0cf9-4c16-8f19-af5e27337d4e', `**ONE LIGHT** làm nhiệm vụ chuyển bản sắc của **ROOTS** thành hệ chuẩn sống được trong thực tế. Nếu **ROOTS** trả lời "chúng ta là ai", thì **ONE LIGHT** trả lời "chúng ta sẽ sống và làm việc theo chuẩn nào".

Tầng này giữ cho tổ chức không chỉ đúng về lý tưởng, mà còn đúng về cách hành xử, cách ra quyết định và cách đối diện với cám dỗ tăng trưởng. Nó cũng là lớp giúp đội ngũ đồng tâm, cùng một trục giá trị, thay vì mỗi người hiểu văn hóa theo một kiểu khác nhau.`);
b('ebb9b9f6-2c2e-4604-a0ed-c44925b5a595', `**ONE** là phần thống nhất chung của mọi tổ chức: một lòng, cao quý, đạo đức; còn **LIGHT** là bộ ánh sáng riêng mà mỗi tổ chức cần tự xác định để soi đường cho bản sắc, sứ mệnh và cách vận hành của mình.`);

// Tiêu chuẩn LIGHT
b('5db9c202-bdaf-4dbb-a4cc-1bd6c987b033', `Bộ **LIGHT** của một tổ chức phải là **bộ ánh sáng riêng**, được xác định theo ngành nghề của chính tổ chức đó. Nó không phải là bản sao của nơi khác, mà là hệ giá trị soi đường phù hợp nhất với con đường phát triển của tổ chức này.`);
b('4bf737dd-8afb-4ca6-a29a-c697bde29213', `**Một bộ LIGHT đạt chuẩn cần có 4 tiêu chí:**`);
b('c68f614b-284c-4d1b-a372-d712e1819065', `- **Rõ ràng** — Mỗi giá trị phải được gọi tên cụ thể, không mập mờ, không đa nghĩa.
- **Khả thi** — Giá trị đó phải có thể chuyển thành hành vi thực tế, không chỉ tồn tại trên khẩu hiệu.
- **Nhất quán** — Bộ LIGHT phải đi cùng một trục với ONE, không được mâu thuẫn với phẩm giá và đạo đức chung.
- **Đặc trưng** — Bộ LIGHT phải phản ánh được linh hồn riêng của tổ chức, để khi nhìn vào là nhận ra ngay bản sắc của nó.`);
b('6d404cc6-9bf8-4ef5-8423-3b9f2a8f5bca', `**LIGHT không phải là điều tốt đẹp nói chung**, mà là **bộ giá trị soi đường riêng được lựa chọn có chủ đích** để dẫn tổ chức đi đúng hướng.`);
b('2becc962-7fb3-4415-9229-c6df75087a9f', `**Gợi ý LIGHT:**`);

// Hành động
b('d36198c1-576a-4506-91d3-c3a5e8a6f0b4', `- Xác lập bộ giá trị chuẩn của tổ chức, gồm các nguyên tắc cốt lõi không thể thỏa hiệp.
- Chuyển các giá trị đó thành hành vi cụ thể nên làm và không được làm.
- Đào tạo nội bộ để nhân sự mới và nhân sự cũ đều hiểu cùng một chuẩn.
- Rà soát các chính sách, SOP và thông điệp truyền thông để bảo đảm chúng không lệch khỏi chuẩn đạo đức và khí chất tổ chức.
- Thiết lập một "điểm neo" cho mọi quyết định khó, để khi có xung đột lợi ích, tổ chức biết ưu tiên điều gì.`);

// Câu hỏi cốt lõi
b('8f119c07-92f7-44dc-9aa7-48c90fdcf72e', `- Điều gì là lõi thống nhất không thể thay đổi trong tổ chức này?
- Bộ **LIGHT** nào phản ánh đúng bản sắc và sứ mệnh riêng của tổ chức?
- Khi có xung đột lợi ích, tổ chức sẽ ưu tiên phẩm giá hay lợi ích ngắn hạn?
- Những ranh giới đạo đức nào tuyệt đối không được vượt qua?
- Làm sao để toàn đội ngũ cùng sống theo một chuẩn chung?`);

// Kết quả
b('df8c4947-f098-4117-91cd-0aaf70c26a56', `- Một hệ giá trị **ONE** rõ ràng, gồm **Oneness**, **Nobility** và **Ethics** và 1 bộ **LIGHT** cho riêng mình.
- Bộ chuẩn hành vi cụ thể để toàn đội ngũ cùng áp dụng.
- Sự đồng bộ trong nhận thức, quyết định và hành xử của tổ chức.
- Một nền đạo đức vận hành đủ vững để không bị bẻ cong bởi áp lực thị trường.
- Một ngọn đèn soi đường giúp tổ chức lớn lên mà không đánh mất phẩm giá và bản sắc.`);

// === AWAKEN (section 27-38) ===
b('2e69109a-6df7-49f9-a2f8-0610919d1f33', `**AWAKEN** là tầng giúp tổ chức **nhìn ra thực trạng thật** trước khi quyết định sửa gì đó. Nó dùng để phát hiện vấn đề sớm, hiểu thị trường, nhận diện lệch chuẩn và tránh việc chữa triệu chứng trong khi nguyên nhân gốc vẫn còn đó.`);
b('47f44c5b-d603-43de-ae0e-4cc449cd473c', `Trong thực hành, **AWAKEN** là bước "dừng lại để soi": soi nội bộ, soi bên ngoài, soi khoảng cách, soi nguyên nhân, rồi ghi lại các tín hiệu nhỏ trước khi chúng thành khủng hoảng.`);

// Cách làm
b('dc508255-a5fb-4ad8-8083-ecf6352abcef', `- Mỗi tuần chọn 1 mảng để audit.
- Mỗi vấn đề phải có 3 dòng: **hiện tượng**, **nguyên nhân gốc**, **tín hiệu sớm**.
- Mỗi cuộc họp nên có 1 mục riêng: "Tuần này hệ thống đang báo hiệu điều gì?"
- Không xử lý ngay bằng giải pháp; luôn hỏi "vì sao nó xảy ra".`);

// Câu hỏi cốt lõi
b('fd6df84a-f1ef-43da-af72-49eaf72f5110', `Khi xác định **AWAKEN**, hãy dùng 6 câu hỏi này:`);
b('eae9a223-f561-43fc-a69d-8430dfa4e8c0', `- Tổ chức đang ở đâu?
- Đang lệch chỗ nào?
- Điều gì đang tác động lên mình?
- Vấn đề thật nằm ở đâu?
- Cơ chế nào đang tạo ra vấn đề?
- Tín hiệu nhỏ nào đang báo trước rủi ro lớn hơn?`);
b('0e5f83f0-22b4-4753-a3ee-2c7d7ee9d0ef', `Nếu trả lời được 6 câu này, tổ chức đã bước từ phản ứng cảm tính sang phản ứng có ý thức.`);

// Kết quả
b('70683d94-e2f6-4f13-a14d-e4c9035ad3a1', `Khi **AWAKEN** làm đúng, bạn sẽ có 4 kết quả rõ ràng:`);
b('9c811721-89a4-4a5d-9175-cf96b9aee253', `- **Nhìn thật** — Thấy đúng thực trạng thay vì nhìn bằng cảm giác.
- **Hiểu gốc** — Biết nguyên nhân thật thay vì đổ lỗi cho bề mặt.
- **Phát hiện sớm** — Nhận ra vấn đề trước khi nó lớn lên thành sự cố.
- **Tự sửa nhanh** — Có thể điều chỉnh hệ thống trước khi thị trường buộc phải sửa.`);

// Mẫu áp dụng
b('bfc7b412-5f86-4dfa-a97d-45329837bd43', `Bạn có thể dùng mẫu này cho mỗi vấn đề:`);
b('756ebda3-8157-4c5f-b9c2-3aa7a423d402', `- **Hiện tượng:** ví dụ lịch hẹn trễ dần.
- **Nguyên nhân gốc:** ví dụ quy trình xác nhận chưa rõ, nhân sự không có trách nhiệm chốt lịch.
- **Tín hiệu sớm:** ví dụ khách nhắc lại 2–3 lần cùng một lỗi, thời gian chờ tăng nhẹ mỗi tuần.`);
b('1862fc32-bca7-459f-ab79-4e7a543cc636', `Mẫu này giúp **AWAKEN** không còn là khái niệm triết lý, mà trở thành công cụ xử lý thực tế mỗi ngày.`);

console.log(`Phase 1: ${blocks.length} blocks to update`);

const BATCH = 10;
for (let i = 0; i < blocks.length; i += BATCH) {
  const batch = blocks.slice(i, i + BATCH);
  const sqls = batch.map(u => `UPDATE "block" SET "text_md" = '${u.text}' WHERE "id" = '${u.id}';`);
  const multi = sqls.join('\n');
  const tmpFile = join(tmpdir(), `c4p1_${Date.now()}.sql`);
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
console.log(`\n✓ Chapter 4 Phase 1 DONE: ${blocks.length} blocks`);
