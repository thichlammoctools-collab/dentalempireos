import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';
const blocks = [];
function b(id, text) { blocks.push({ id, text: text.replace(/'/g, "''") }); }

// === DEEPEN ===
b('29c67094-f443-43e6-94dd-68965bd3f886', `Nếu **AWAKEN** giúp tổ chức nhìn ra sự thật, thì **DEEPEN** giúp tổ chức **đi vào chiều sâu của sự thật đó**. Đây là tầng mà những điều đúng không còn dừng ở mức nhận thức, mà bắt đầu được bóc tách, chuẩn hóa, đóng gói và đưa vào kỷ luật vận hành hằng ngày.`);
b('5d557cdb-e939-4ccb-93d4-133f9edbc38e', `**DEEPEN** là bước chuyển từ "biết" sang "làm được một cách lặp lại". Một tổ chức có thể nhìn ra vấn đề rất nhanh, nhưng nếu không có **DEEPEN**, cái nhìn ấy sẽ chỉ dừng ở ý tưởng; còn khi **DEEPEN** vận hành đúng, ý tưởng trở thành quy trình, quy trình trở thành thói quen, và thói quen trở thành chuẩn mực của hệ thống.`);
b('116a42f5-a224-4d6b-8546-6d1238e2478a', `- Tổ chức đang cần đào sâu cái gì?
- Điều đó đang yếu ở đâu: năng lực, cấu trúc hay kỷ luật thực thi?
- Làm thế nào để biến cái đúng thành một quy trình có thể lặp lại?
- Điều gì cần được chuẩn hóa để không phụ thuộc vào cá nhân giỏi?
- Chuẩn nào cần được bảo vệ bằng kiểm soát và trách nhiệm rõ ràng?
- Khi nào một chuẩn được xem là đã trở thành nếp sống của tổ chức?`);
b('3c624c81-d870-4e46-b3db-32628a24bb93', `Khi **DEEPEN** được làm đúng, tổ chức sẽ có 4 kết quả rõ ràng.`);
b('a0370692-9702-4073-a236-93cedab0e6fb', `- **Năng lực được nâng chất** — Tổ chức không chỉ biết làm đúng mà còn làm đúng tốt hơn, sâu hơn và ổn định hơn.
- **Quy trình được chuẩn hóa** — Những điều quan trọng được đóng gói thành SOP và không còn phụ thuộc quá nhiều vào cảm tính hoặc trí nhớ cá nhân.
- **Kỷ luật được hình thành** — Chuẩn mực không còn nằm trên giấy mà đi vào thực thi bằng cơ chế rõ ràng.
- **Nếp vận hành được tạo ra** — Điều đúng trở thành cách làm mặc định của hệ thống, giúp tổ chức bền hơn và ít trượt chuẩn hơn.`);

// === MATURE ===
b('c0a46564-d099-4f9b-bda2-c29356933c53', `Nếu những tầng trước giúp tổ chức nhận diện đúng, chuẩn hóa đúng và đào sâu đúng, thì **MATURE** là tầng giúp toàn hệ thống **bước vào trạng thái chín hơn**. Đây không chỉ là giai đoạn tổ chức lớn lên về quy mô, mà là giai đoạn nó trưởng thành hơn về nhịp, rõ hơn về chuẩn, mạnh hơn về niềm tin và linh hoạt hơn trong khả năng tự nâng cấp.`);
b('8605d6ec-a838-4a6d-8bc4-248523842ae5', `Trong thực tế, rất nhiều tổ chức có thể tăng nhanh, nhưng không phải tổ chức nào cũng chín. Có những hệ thống đi rất nhanh nhưng vẫn rời rạc, thiếu đà, thiếu sự ăn khớp giữa con người và cơ chế, thiếu niềm tin nội bộ, và thiếu năng lực tự tinh chỉnh khi môi trường thay đổi. **MATURE** tồn tại để xử lý chính khoảng trống đó.`);
b('295911b1-cab7-40e2-a2cc-df2d17c9095e', `- Hệ thống đã có **Momentum** chưa?
- Mọi thứ đã **Attune** với nhau chưa?
- Đội ngũ có **Trust** nhau chưa?
- Các phần đã **Unite** thành một khối chưa?
- Quy trình đã được **Refine** chưa?
- Tổ chức đã sẵn sàng **Elevate** chưa?`);
b('4cfe0b42-c0eb-4961-8091-8f91754da925', `Khi **MATURE** được làm đúng, tổ chức sẽ có 4 kết quả rõ ràng.`);
b('62293df1-f913-46ec-8d12-ddd2292571e1', `- **Có đà phát triển** — Hệ thống không còn phải khởi động lại quá nhiều lần mà bắt đầu tiến lên liên tục hơn.
- **Có nhịp đồng bộ** — Mục tiêu, con người và cơ chế vận hành ăn khớp với nhau tốt hơn.
- **Có niềm tin nội bộ** — Đội ngũ tin vào nhau, tin vào quy trình và tin vào khả năng chung của hệ thống.
- **Có khả năng nâng tầng** — Tổ chức không chỉ giữ mức tốt hiện tại mà còn có thể đi lên một chuẩn cao hơn.`);

// === ALIGN ===
b('ed29473a-4003-401c-9a83-345d638d306a', `**ALIGN** là tầng giữ cho tổ chức không bị lệch khỏi đường ray khi bắt đầu tăng trưởng nhanh. Nếu các tầng trước giúp hệ thống hiểu đúng, chuẩn hóa đúng và trưởng thành hơn, thì **ALIGN** bảo đảm mọi phần của tổ chức vẫn đi cùng một hướng, cùng một nhịp và cùng một mục tiêu.`);
b('3766b0dd-5f16-4bfc-8d59-3293da29eb8a', `- Mục tiêu chung của tổ chức là gì và đã được neo đủ rõ chưa?
- Các nguồn lực, con người và quy trình đã thực sự nối với nhau chưa?
- Khoảng lệch giữa kế hoạch và thực tế đang nằm ở đâu, và lệch bao nhiêu?
- Làm sao để toàn hệ thống đi cùng một hướng, một nhịp và một chuẩn?`);
b('6c0da665-4d46-4e88-83ce-b8c83dd927fa', `- Tổ chức có một mục tiêu chung đủ rõ để không bị trôi hướng.
- Các bộ phận được kết nối và phối hợp như một hệ thống thống nhất.
- Khoảng cách giữa chiến lược và thực thi được thu hẹp dần.
- Tổ chức vận hành khớp hơn, ít lệch pha hơn và ổn định hơn khi tăng trưởng.`);

// === PROSPER ===
b('4649b29f-3c10-429b-93ec-78f56178374e', `Nếu những tầng trước giúp tổ chức nhìn đúng, giữ đúng, chuẩn hóa đúng và trưởng thành hơn, thì **PROSPER** giúp hệ thống biến toàn bộ nền tảng đó thành đà tăng trưởng bền vững. Đây là tầng mà giá trị không chỉ được tạo ra một lần, mà tiếp tục sinh sôi, tái đầu tư và mở rộng thành nhiều vòng tăng trưởng mới.`);
b('d1b3df42-476b-4e1c-b72e-c6f018ef5104', `**PROSPER** là bước chuyển từ "có kết quả" sang "có hiệu ứng bánh đà". Một tổ chức có thể tăng trưởng mà không Prosper, nhưng khi **PROSPER** vận hành đúng, mỗi thành quả tốt sẽ trở thành nhiên liệu cho chu kỳ tiếp theo, và hệ thống bắt đầu lớn lên theo cách tự nuôi chính mình.`);
b('96f25dd8-e35a-46e6-86b7-917b148378fb', `- Hệ thống đang tạo ra giá trị gì có thể sinh sôi tiếp?
- Thành quả hiện tại có đang được tái đầu tư đúng chỗ không?
- Điều gì cần được tối ưu trước khi mở rộng?
- Khi nào tổ chức đủ nền để scale mà không bị bật gốc?
- Giá trị nào có thể lan truyền thành niềm tin và referral?
- Hệ sinh thái đang được làm giàu theo hướng nào?
- Làm sao để mỗi vòng tăng trưởng sau mạnh hơn vòng trước?`);
b('b41d8b87-e09a-4744-ae3a-ec118c726b5e', `Khi **PROSPER** được làm đúng, tổ chức sẽ có 4 kết quả rõ ràng.`);
b('b3945bdc-2862-4d90-841d-25f538fffc54', `- **Giá trị được sinh sôi** — Những gì tổ chức tạo ra không dừng ở kết quả đơn lẻ mà tiếp tục lan rộng và tạo tác động mới.
- **Thành quả được tái đầu tư** — Kết quả tốt trở thành nhiên liệu cho vòng tăng trưởng tiếp theo thay vì bị tiêu hao hết trong hiện tại.
- **Hệ thống được mở rộng có kiểm soát** — Tổ chức lớn lên mà không mất nền, không phình to vô tổ chức và không đánh đổi sự bền vững.
- **Bánh đà tăng trưởng được hình thành** — Mỗi vòng phát triển tốt sẽ làm vòng sau mạnh hơn, giúp tổ chức thịnh vượng có đà và tự nuôi chính mình.`);

// === Workshop ROOTS ===
b('8623abe4-c1d1-4728-af6d-1d9759dc7491', `Giúp tổ chức trả lời rõ câu hỏi: **Chúng ta là ai, vì sao tồn tại, và đâu là gốc rễ thật sự của mình?**`);
b('e18a571c-42b0-4237-85a1-9b9131b26807', `- Phòng khám này sinh ra để giải quyết nỗi đau nào của thị trường?
- Nếu không tồn tại phòng khám này, điều gì sẽ bị thiếu hụt?
- Điều gì là lý do sâu xa nhất khiến tổ chức này phải được khai sinh?
- Chúng ta muốn được nhớ đến như thế nào trong tâm trí khách hàng?
- Giá trị nào không bao giờ được phép đánh đổi dù tăng trưởng có hấp dẫn đến đâu?`);
b('d51aa61d-e6c2-4b60-b4d5-908f366d3d2c', `- Đâu là bản sắc không thể sao chép của tổ chức này?
- Nỗi đau cốt lõi của khách hàng mà tổ chức chọn đứng về phía họ là gì?
- Nếu phải chọn giữa doanh thu nhanh và lý do tồn tại dài hạn, chúng ta chọn gì?
- Điều gì là "rễ cọc", còn điều gì chỉ là "rễ phụ" có thể thay đổi theo thời gian?
- Một người mới bước vào tổ chức này cần hiểu điều gì đầu tiên về gốc rễ của nó?`);
b('7d38f7d4-8e09-435b-9e5b-0601a9cb81d2', `- Mission statement của phòng khám.
- Một câu mô tả bản sắc gốc rễ thật ngắn gọn.
- 3-5 giá trị nền không thể thỏa hiệp.
- Một tuyên bố rõ ràng về nỗi đau thị trường mà tổ chức chọn giải quyết.`);

// Workshop ONE LIGHT
b('40e92077-9994-42b1-823d-502f47431578', `Giúp tổ chức xác định **một lõi bất biến** và **ánh sáng soi đường** để toàn bộ đội ngũ cùng đứng thẳng, cùng giữ chuẩn và cùng đi về một hướng.`);
b('530232e6-3ea1-49eb-892c-35e745b88c84', `- Phần "một lòng" của tổ chức này là gì?
- Điều gì phải thống nhất trong cách nghĩ, cách làm và cách ra quyết định của toàn đội ngũ?
- Những nguyên tắc đạo đức nào là lằn ranh đỏ không được vượt qua?
- Tổ chức muốn lớn lên bằng khí chất gì: cao quý, chính trực hay tiện lợi?
- Điều gì là ánh sáng dẫn đường giúp đội ngũ không đi lạc khi gặp áp lực?`);
b('992729f8-f151-4903-b913-f0ba4fa2051d', `- Chúng ta muốn nhân sự bên trong hệ thống phản ứng với nhau như thế nào khi có xung đột?
- Nếu phải chọn một bộ giá trị soi đường cho mọi quyết định, đó sẽ là gì?
- Điều gì làm cho tổ chức này khác với một nơi chỉ vận hành bằng lợi nhuận?
- Có những hành vi nào cần được ghi rõ là "nên làm" và "không được làm"?
- Làm thế nào để đạo đức không dừng ở khẩu hiệu mà đi vào thực thi?`);
b('8d9f0d97-17da-4d73-a4df-bd4bcb7a4b80', `- One core principle của tổ chức.
- Bộ giá trị soi đường: One Light.
- Danh sách "nên làm / không được làm" cho toàn hệ thống.
- Một tuyên ngôn ngắn về chuẩn mực đạo đức và khí chất vận hành.`);

// Workshop structure
b('ee7272e0-dd57-4bbb-8589-fbfcf8a3495e', `**Phần 1: Khai rễ**`);
b('f20802a8-b297-4fe8-9352-97978846449b', `Cho đội ngũ viết ra 3 câu:`);
b('0d838c89-39a2-4934-b5b6-85a466694145', `- Chúng ta tồn tại để làm gì?
- Chúng ta không chấp nhận đánh đổi điều gì?
- Khách hàng thật sự đang đau ở đâu?`);
b('44ab5a77-e2d6-410c-a1b2-b722c8091fc9', `**Phần 2: Chọn lõi**`);
b('1fce55c8-562c-44f7-993f-39b247683c7b', `Từ các câu trả lời, gom lại thành:`);
b('815e6a2c-ac18-4eba-ab27-c6d566f7dd04', `- 1 câu mission.
- 1 câu core identity.
- 3-5 giá trị gốc.`);
b('8843d11b-84de-48ef-aa3b-eaee104975fd', `**Phần 3: Neo ánh sáng**`);
b('cf3a9a2d-63c5-475d-8e8d-c554baf024ae', `Sau đó chốt:`);
b('d4862eb3-676c-4b2a-98ff-d00d9ffc61d0', `- 1 lõi bất biến của tổ chức.
- 3-5 nguyên tắc soi đường.
- 5-10 hành vi nên làm và không được làm.`);
b('702e4617-d08b-49e3-b632-fc86862b914b', `**Phần 4: Khóa lại**`);
b('e7534bfd-e39c-460d-9574-7c452d9f1d59', `Kết thúc bằng một câu ngắn có thể đọc to trong team meeting để nhắc toàn đội quay về **ROOTS** và **ONE LIGHT**.`);

// Audit sections
b('ed3df821-7658-4487-b003-a327d3a381a7', `**Audit nội bộ** — Mục tiêu: kiểm tra hệ thống đang vận hành thật sự như thế nào.`);
b('96c31d7d-837a-4fee-9176-39632153ee34', `Câu hỏi:`);
b('710165be-2341-42b6-93ee-ee5b03163de7', `- Thương hiệu hiện tại đang được định vị ra sao trong thực tế?
- Quy trình nào đang tồn tại trên giấy nhưng không sống trong vận hành?
- Điểm nào trong vận hành đang lệch so với tiêu chuẩn mong muốn?
- Nhân sự đang hiểu vai trò của mình đến đâu?
- Dữ liệu nào đang thiếu, sai hoặc không nhất quán?`);
b('a3b15ecc-88b9-4a07-b14d-b99b32c92fc2', `**Audit thị trường** — Mục tiêu: quan sát môi trường bên ngoài để hiểu tổ chức đang đứng ở đâu.`);
b('afa559af-358c-4cfb-9de6-3e6d24ca2d15', `Câu hỏi:`);
b('a92144cb-2c90-496d-a154-eafab27d8953', `- Khách hàng đang thay đổi nhu cầu, kỳ vọng hay hành vi ở điểm nào?
- Đối thủ đang làm tốt hơn mình ở đâu?
- Xu hướng nào của thị trường đang tạo áp lực lên mô hình hiện tại?
- Tổ chức đang bị thị trường kéo đi hay đang chủ động dẫn đường?
- Có tín hiệu nào cho thấy định vị hiện tại đã lỗi thời hoặc cần điều chỉnh?`);
b('8fb464ef-6556-4e1d-9f90-9f867e24cabc', `**Audit khoảng cách** — Mục tiêu: vẽ rõ khoảng cách giữa thực trạng và mục tiêu.`);
b('4f4a3867-745a-4c8c-bd5f-e27d6eaa7bb9', `Câu hỏi:`);
b('5363ff66-c0f8-4734-9cbd-263d5b8bfa4b', `- Hiện tại và mục tiêu đang lệch nhau ở đâu?
- Khoảng cách lớn nhất nằm ở con người, quy trình, dữ liệu hay nhận thức?
- Mắt xích nào đang làm chậm toàn hệ thống?
- Điều gì đang tạo ra độ trễ lặp đi lặp lại?
- Có khoảng cách nào đang bị xem nhẹ nhưng thực ra rất nguy hiểm?`);
b('236e4295-9e7e-49fd-932f-7b65584946ad', `**Audit nguyên nhân gốc** — Mục tiêu: không dừng ở triệu chứng mà đi xuống tầng căn nguyên.`);
b('31819bc8-aad0-45d5-87b3-f4b8941e36bc', `Câu hỏi:`);
b('93d24286-2c9a-4de2-8a07-1d72d9ff9890', `- Vấn đề đang xuất phát từ đâu: tư duy, cơ chế, con người hay cấu trúc?
- Nếu gỡ triệu chứng ra, vấn đề gốc còn ở đó không?
- Hệ thống đang lặp lại lỗi vì thiếu kỹ năng hay vì thiếu thiết kế?
- Có niềm tin sai nào đang âm thầm điều khiển hành vi không?
- Điều gì phải được sửa ở tầng gốc thì mới hết vòng lặp sai?`);
b('11a95fe6-cff7-4610-8053-04c7f99fb176', `**Audit tín hiệu sớm** — Mục tiêu: nhận diện các dấu hiệu nhỏ trước khi chúng thành khủng hoảng lớn.`);
b('fb99493d-45d9-4f68-bdad-3e00bc3b809d', `Câu hỏi:`);
b('a64fc3bb-fb95-4a51-ac66-3e6c447b6bdf', `- Có tín hiệu nào đang lặp lại theo mẫu không?
- Điều gì đang thay đổi rất nhẹ nhưng liên tục?
- Có phản hồi nào từ khách hàng, nhân sự hoặc dữ liệu đang bị bỏ qua không?
- Sự cố nhỏ nào đang xuất hiện nhiều hơn bình thường?
- Tín hiệu nào nếu phát hiện sớm sẽ giúp tổ chức tránh trả giá lớn hơn?`);

// Cách dùng Audit
b('6a6d789b-0a00-4671-aed4-0768e849cc55', `- Bước 1: Cho đội ngũ viết ra sự thật đang thấy, không tranh luận đúng sai ngay.
- Bước 2: Tách dữ liệu thành 4 lớp: nội bộ, thị trường, khoảng cách, nguyên nhân gốc.
- Bước 3: Chốt 3 tín hiệu sớm nguy hiểm nhất cần theo dõi tiếp.
- Bước 4: Biến kết quả audit thành đầu vào cho **DEEPEN**.`);

// Câu chốt AWAKEN
b('f5e08838-cdf1-4689-843f-1403259762c3', `Audit không phải để phán xét tổ chức, mà để tổ chức có đủ tỉnh táo nhìn rõ mình, nhìn rõ thị trường, và nhìn rõ điều đang âm thầm kéo mình lệch hướng. Khi audit làm đúng, **AWAKEN** trở thành năng lực nhìn thật trước khi buộc phải sửa thật.`);

// === SOP Template DEEPEN ===
b('92f1ed8f-dd6b-4cc7-97ad-278cf72a24aa', `SOP ở tầng **DEEPEN** không chỉ để "ghi lại cách làm", mà để biến một năng lực đúng thành một chuẩn có thể lặp lại, chuyển giao và kiểm soát được.`);
b('535f3e09-4654-4eaf-b271-a95b3263fde6', `- Tên SOP:
- Mã SOP:
- Bộ phận áp dụng:
- Người sở hữu SOP:
- Người phê duyệt:
- Ngày hiệu lực:
- Phiên bản:`);
b('138d4a3c-d31b-47e4-931f-b0b9616f3046', `- SOP này nhằm chuẩn hóa điều gì?
- Năng lực, quy trình hoặc hành vi nào cần được đào sâu?
- Kết quả cuối cùng mong muốn là gì?`);
b('f58e14ad-f3ce-46ce-9c34-69604bd74033', `- SOP này áp dụng cho ai?
- Áp dụng trong tình huống nào?
- Không áp dụng cho những trường hợp nào?`);
b('ccf9e1da-3cee-4173-ab69-5ec2296f1eef', `- Các thuật ngữ cần làm rõ:
- Các tiêu chuẩn cần hiểu thống nhất:
- Các trường hợp đặc biệt cần định nghĩa trước:`);
b('83554ffa-20da-4fa5-8e20-27de91ed5d38', `- **Nguyên tắc** cốt lõi của quy trình này là gì?
- Điều gì không được phép đánh đổi?
- Chuẩn nào phải được giữ xuyên suốt?`);
b('31323677-07df-4118-b747-ffec4c6d6826', `- Bước 1:
- Bước 2:
- Bước 3:
- Bước 4:
- Bước 5:`);
b('6e8bfa0f-94d4-493d-b72c-47ed75259516', `Với mỗi bước, cần có:`);
b('8d16469c-1645-4dd3-a1de-e30efca5d2ca', `- Mục tiêu của bước:
- Người thực hiện:
- Đầu vào:
- Cách làm:
- Đầu ra:
- Tiêu chí đạt:
- Lỗi thường gặp:
- Cách xử lý khi có sai lệch:`);
b('d302112a-21b0-407f-9aa3-ed112d781357', `- Checklist trước khi thực hiện:
- Checklist trong khi thực hiện:
- Checklist sau khi hoàn tất:`);
b('648bfa55-d46e-4e8a-ae9f-1f0f494a3c6f', `- Mức đạt chuẩn là gì?
- Điều gì được xem là đúng?
- Điều gì được xem là chưa đạt?
- Có chỉ số nào dùng để đo không?`);
b('204af5e2-2409-4b0f-8748-9e2ff181048e', `- Ai chịu trách nhiệm chính?
- Ai kiểm tra?
- Ai phê duyệt?
- Ai được phép xử lý ngoại lệ?`);
b('2b93ffa0-c6fb-4d32-8318-0d3f620c9bbc', `- SOP được kiểm soát bằng cách nào?
- Có audit định kỳ không?
- Có **KPI**, checklist hoặc dashboard nào không?
- Sai lệch sẽ đư��c ghi nhận và xử lý ra sao?`);
b('cbe95f3a-2737-4278-80e3-e6361251e20c', `- Trường hợp nào được phép linh hoạt?
- Ai có quyền duyệt ngoại lệ?
- Ngoại lệ được ghi nhận ở đâu?
- Sau ngoại lệ cần làm gì để đưa về chuẩn?`);
b('d645856e-bcff-48f5-a40c-f4df6b6e3cb3', `- Biểu mẫu đi kèm:
- Checklist:
- Hướng dẫn hỗ trợ:
- SOP liên quan:
- File dữ liệu tham chiếu:`);
b('7170e8ad-41a1-4590-8187-cd73b8154a0c', `- Phiên bản:
- Ngày cập nhật:
- Nội dung thay đổi:
- Người cập nhật:`);
b('99dfe616-7683-4097-97a2-c1d6dd0881d3', `- Bước 1: Chọn đúng một năng lực hoặc quy trình cần đào sâu.
- Bước 2: Viết rõ mục đích, phạm vi và chuẩn đầu ra trước khi viết bước làm.
- Bước 3: Bóc tách từng bước thành hành động, tiêu chí, lỗi thường gặp và cách sửa.
- Bước 4: Gắn checklist, trách nhiệm và cơ chế kiểm soát để SOP không nằm trên giấy.
- Bước 5: Audit lại định kỳ để chuẩn dần trở thành nếp vận hành.`);
b('2fde8e27-677f-4b68-95bd-2226f89a6551', `**DEEPEN** không dừng ở việc hiểu điều đúng, mà phải làm cho điều đúng đó trở thành một cấu trúc có thể lặp lại, kiểm soát và truyền thừa.`);

console.log(`Phase 2: ${blocks.length} blocks to update`);

const BATCH = 10;
for (let i = 0; i < blocks.length; i += BATCH) {
  const batch = blocks.slice(i, i + BATCH);
  const sqls = batch.map(u => `UPDATE "block" SET "text_md" = '${u.text}' WHERE "id" = '${u.id}';`);
  const multi = sqls.join('\n');
  const tmpFile = join(tmpdir(), `c4p2_${Date.now()}.sql`);
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
console.log(`\n✓ Chapter 4 Phase 2 DONE: ${blocks.length} blocks`);
