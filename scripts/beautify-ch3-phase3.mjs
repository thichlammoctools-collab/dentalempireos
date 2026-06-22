import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';
const blocks = [];

function b(id, text) { blocks.push({ id, text: text.replace(/'/g, "''") }); }

// ===== LAYER 2: O - ONE LIGHT =====
b('71d377ae-f2d3-42b4-948b-3514dd62b3f0', `Nếu **ROOTS** là nơi tổ chức xác định gốc rễ, gọi tên bản sắc và lựa chọn lý do tồn tại của mình, thì **ONE LIGHT** là tầng tâm gỗ và ánh sáng của tổ chức. ONE là phần lõi bất biến: Một lòng, Cao quý, Đạo đức. LIGHT là phần giá trị soi đường có thể được cá nhân hóa theo bản sắc riêng. Cây có thể cần những ánh sáng khác nhau, nhưng tâm gỗ bên trong thì phải giống nhau.`);

b('cee8e2ea-f699-4cf0-873c-f86729556a70', `Thân gỗ sẽ định hình cây sẽ lớn lên như thế nào, cành lá ra sao theo nguồn ánh sáng mà con chọn hướng đến. Không phải mọi cái cây đều cần cùng một lượng nắng. Có cây hợp ánh sáng gắt, có cây lớn lên trong vùng sáng dịu, có cây cần nhiều giờ mặt trời, có cây chỉ sống được dưới tán rừng. Nhưng dù hấp thụ ánh sáng theo cách nào, phần tâm gỗ bên trong vẫn phải chắc. Tổ chức cũng vậy. LIGHT có thể khác nhau, nhưng ONE phải giống nhau. Bởi ánh sáng giúp cây lớn lên, còn tâm gỗ mới quyết định cây có đứng vững hay không.`);

b('5ebfb464-5c53-4d50-ba50-2fbd2a79167b', `**Tâm gỗ của tổ chức: phần lõi mà một doanh nghiệp muốn đi đường dài nào cũng nên có.**`);

b('7c4dcbb7-e90b-4625-a953-070d48107a97', `Điểm chung của những cây cổ thụ không nằm ở việc chúng thuộc loài nào, sống ở vùng đất nào hay hấp thụ ánh sáng theo cách nào. Điểm chung của chúng là đều có một thân gỗ lớn, thẳng, bền, tán vươn rộng, rễ cắm sâu và một thời gian sinh trưởng đủ dài để tích lũy nội lực. Một tổ chức cũng vậy. Khi đã chọn trở thành một doanh nghiệp lâu năm, không chỉ **ROOTS** phải đủ sâu và đủ rộng, mà bên trên phần rễ ấy còn phải hình thành một "thân gỗ" đủ chắc để chống đỡ toàn bộ quá trình phát triển.`);

b('cb55bf2a-aefd-44da-ae85-386dbad0ac9c', `Phần thân gỗ đó chính là **ONE**. Nếu **ROOTS** là nơi xác lập gốc rễ và bản sắc, thì ONE là lõi đứng thẳng ở bên trong tổ chức, là phần giúp doanh nghiệp không bị cong vênh trước áp lực, không bị mục ruỗng vì lợi ích ngắn hạn, và không đánh mất phẩm chất khi lớn lên.`);

b('4aa0531e-a240-4899-ba40-3d02b3fb3788', `ONE cũng mang một tầng nghĩa rất đẹp: đó là **số một**, là **một**, là **duy nhất**. Nhưng ở đây, "một" không chỉ là đứng đầu, mà trước hết là **một lòng**, **một trục**, **một chuẩn giá trị không chia cắt**. Tổ chức chỉ có thể lớn bền khi bên trong nó có một lõi đủ thống nhất để mọi người cùng dựa vào.`);

b('49ef4c46-cbf2-4396-b243-0108e82fe988', `Vì thế, ONE được cấu thành bởi ba phẩm chất nền tảng:`);
b('3d98cc20-66b7-4f7a-bab0-1cfd21245d8d', `- **O — Oneness**: Một lòng, hợp nhất, đồng tâm trong tổ chức.
- **N — Nobility**: Cao quý, giữ phẩm chất cao trong cách sống và cách làm việc.
- **E — Ethics**: Đạo đức, lằn ranh đỏ không được vượt qua.`);

b('4fdc716c-fc51-47af-a779-6311dd068ebc', `Nói ngắn gọn, nếu một tổ chức muốn trở thành cây lớn, thì **ROOTS** phải làm nhiệm vụ cắm sâu xuống đất, còn ONE phải làm nhiệm vụ trở thành thân gỗ. Rễ giúp cây sống được; nhưng chính thân gỗ mới giúp cây đứng thẳng, lớn cao và đi qua năm tháng mà không đánh mất hình hài của mình.`);

b('24b4902d-a720-499d-9ce1-babc7fce8ced', `**Ánh sáng riêng của tổ chức**`);

b('4d0cc9e9-08a3-4673-9261-39bd0f80211f', `Nếu ONE là phần tâm gỗ giữ cho cây đứng thẳng trước mưa gió, thì LIGHT là phần ánh sáng lặng lẽ nuôi cây lớn lên mỗi ngày. Không phải mọi cái cây đều cần cùng một lượng nắng, cũng như không phải mọi tổ chức đều phải mang cùng một bộ giá trị soi đường. Nhưng dù hấp thụ ánh sáng theo cách nào, phần lõi bên trong vẫn phải chắc. Bởi ánh sáng quyết định cách cây phát triển, còn tâm gỗ quyết định liệu cây có thể đứng vững suốt nhiều năm hay không.`);

b('ba736af7-dd03-43d7-9c31-449457aef3ff', `Trong tổ chức, LIGHT là phần ánh sáng soi đường cho sự trưởng thành. Nó là bộ giá trị mà doanh nghiệp lựa chọn để nuôi lớn bản sắc của mình qua từng quyết định, từng hành vi và từng giai đoạn phát triển. Nếu ONE là phần lõi giữ cho tổ chức đứng thẳng từ bên trong, thì LIGHT là phần dẫn sáng để tổ chức biết mình nên lớn lên theo hướng nào, với khí chất nào và bằng những phẩm chất nào.`);

b('838fdf0c-5e89-4fb9-a72d-9a6d4a9a14de', `**Gợi ý các bộ LIGHT mà doanh nghiệp có thể chọn:**`);

b('1895b60d-c47b-4350-8cb6-4c6d506159dd', `Mỗi doanh nghiệp là một thực thể duy nhất với văn hóa và sứ mệnh riêng. Do đó, bộ nguyên tắc đạo đức không nên là bản sao cứng nhắc từ xã hội, mà phải được cá nhân hóa dựa trên những giá trị đạo đức nền tảng đã được cộng đồng công nhận. Việc thiết lập các quy tắc tự điều chỉnh này giúp tổ chức bảo vệ tính liêm chính và tạo dựng niềm tin vững chắc với các bên liên quan.`);

b('e737989f-e1f6-4c06-91e2-0c4445572960', `Để đạo đức không dừng lại ở những khẩu hiệu trừu tượng, mỗi nguyên tắc cần được cụ thể hóa bằng danh mục các hành vi **"Nên làm"** và **"Không được làm"**.`);

b('bd40b138-5ecd-427c-a94e-15a391e40e9f', `- **Tính rõ ràng:** Đây là yếu tố then chốt để nhân viên ở mọi cấp bậc có thể nắm bắt và thực thi chính xác.
- **Giảm thiểu rủi ro:** Sự tường minh trong các quy định giúp loại bỏ những "vùng xám" về đạo đức, từ đó ngăn ngừa các hành vi trục lợi hoặc vi phạm vô ý có thể gây tổn hại đến uy tín doanh nghiệp.`);

b('bc99a5db-cfa2-4cd9-8102-7bf97b641620', `Hệ thống đạo đức chỉ thực sự sống động khi nó được thẩm thấu vào tư duy của từng nhân sự thông qua các chương trình đào tạo nội bộ bài bản:`);

b('16fdf85e-cc82-4137-a2e0-b989cc063945', `- **Nhân sự mới:** Cần được trang bị bộ quy tắc ngay từ ngày đầu gia nhập để đảm bảo sự hòa nhập về mặt văn hóa và chuẩn mực hành vi.
- **Nhân sự cũ:** Cần được nhắc lại định kỳ để củng cố nhận thức và duy trì tính liêm chính trong môi trường làm việc lâu dài.
- **Nâng cấp và thích ứng:** Khi môi trường kinh doanh thay đổi, các mô hình kinh doanh mới xuất hiện (ví dụ: sự can thiệp của AI hoặc làm việc từ xa), bộ nguyên tắc cũng cần được cập nhật để phản ánh đúng các thách thức đạo đức mới phát sinh.`);

b('4f3c1f38-a36a-4397-9369-d962a8d2a037', `Một sai lầm phổ biến trong quản trị là thiết lập chính sách trước khi xác lập nguyên tắc. Trong mô hình quản trị bền vững, **Nguyên tắc phải có trước Chính sách**.`);

b('b9f6aee7-567c-49e6-ae20-b5723b0df2fa', `Các giá trị đạo đức đóng vai trò là "bộ lọc" cho chiến lược và quy trình vận hành.`);

b('1c47d3ff-f55f-4e8e-8d64-0faf80683379', `Khi các nguyên tắc đã vững chắc, các chính sách được ban hành sau đó sẽ có tính nhất quán cao, dễ dàng được đội ngũ chấp nhận và thực thi một cách tự nguyện thay vì cưỡng ép.`);

b('f9cf719e-1b73-4e60-a036-bcafd40f96b6', `**Lời kết:** Việc đầu tư xây dựng một Bộ **Nguyên tắc** Đạo đức (ONE LIGHT) không chỉ là tuân thủ pháp luật, mà là việc xây dựng một "di sản văn hóa" giúp tổ chức đứng vững trước mọi biến động của thị trường. Hãy để đạo đức trở thành ngôn ngữ chung của tất cả thành viên trong tổ chức của bạn.`);

b('3d018a81-d558-4aa1-84b7-1f9c38a339d3', `**Một lòng, cao quý, đạo đức; sống theo những giá trị soi đường.**`);

// ===== LAYER 3: A - AWAKEN =====
b('2b31805b-422c-465e-80f5-81a422f849e5', `**AWAKEN** là tầng giúp hệ thống bắt đầu thức giấc trước thực tại. Đây không chỉ là một công cụ phát hiện vấn đề, mà là một giai đoạn phát triển của một hệ thống sống: khi nó không còn chỉ lớn lên theo quán tính, mà bắt đầu có khả năng cảm nhận môi trường, hiểu tín hiệu phản hồi và tự điều chỉnh để thích nghi.`);

b('76f3813f-8cfe-4351-8976-dae502905714', `Ở tầng sinh học, một cái cây không phát triển bền vững nếu tách rời môi trường. Nó phải biết khi nào đất khô, khi nào thiếu sáng, khi nào gió đổi hướng, khi nào thân cần dày lên để chống chọi tốt hơn. Ở tầng con người, **AWAKEN** là quá trình tỉnh thức để hiểu mình, hiểu người và hiểu hoàn cảnh, từ đó sống hài hòa hơn với xã hội. Ở tầng tổ chức, **AWAKEN** là lúc doanh nghiệp bắt đầu nhìn rõ mình là ai, thị trường mình đang ở đâu, và những gì đang tác động lên mình để xây dựng một cơ chế phản ứng phù hợp.`);

b('a8d4f3fd-01ff-4130-9200-7d5c8be4d189', `**AWAKEN** là framework nhận diện sớm trong **R.O.A.D.M.A.P**. Nó giúp tổ chức kiểm tra thực trạng, quan sát thị trường, vẽ bản đồ khoảng cách, hiểu vị trí thật, đào sâu nguyên nhân và nhận ra tín hiệu sớm trước khi ra quyết định chiến lược.`);

b('868d92e0-706a-4153-bb27-177a160b9da0', `Nói ngắn gọn, **AWAKEN** là quá trình **thức giấc của một hệ thống sống**: cây thức giấc khi biết lắng nghe môi trường để thích nghi; con người "thức giấc" khi bắt đầu hiểu mình và hiểu xung quanh để sống hài hòa; tổ chức "thức giấc" khi biết nhìn đúng thực trạng để phản ứng có ý thức thay vì phản ứng theo bản năng.`);

b('d352d819-8252-4a9b-b52a-16b46d6b25b9', `Một tổ chức chỉ có thể cải tiến đúng khi nhìn đúng thực trạng. Nếu không có tầng nhận diện này, doanh nghiệp rất dễ rơi vào phản xạ chữa bề mặt: thấy doanh thu giảm thì ép sale, thấy khách hàng phàn nàn thì sửa lời thoại, thấy nhân sự yếu thì thay người, thấy vận hành chậm thì thêm checklist. Những phản ứng đó đôi khi cần thiết, nhưng nếu không đi qua bước nhìn sâu, hệ thống sẽ chỉ chữa triệu chứng mà bỏ quên căn nguyên.`);

b('a4324998-08ea-42d5-bdca-da75b2a03b4d', `**AWAKEN** tồn tại để ngăn điều đó. Nó giúp tổ chức không xử lý phần ngọn trong khi phần gốc vẫn âm thầm mục ruỗng. Trong môi trường nha khoa, điều này càng quan trọng vì sai lệch vận hành thường không bộc lộ ngay thành khủng hoảng lớn; chúng thường xuất hiện trước như những tín hiệu nhỏ, rời rạc và dễ bị xem nhẹ.`);

b('595a5551-ee02-416b-a80b-61333bd4ecd4', `Một cái cây không thể sống lâu chỉ bằng việc vươn lên. Nó phải học cách tiếp nhận phản hồi từ môi trường và điều chỉnh cách sinh trưởng của mình. Khi đất thay đổi, cây đổi cách bám rễ. Khi ánh sáng thay đổi, cây đổi hướng phát triển. Khi gió mạnh lên, cây làm thân mình vững hơn. Sự sống của cây là một quá trình vừa tiếp nhận vừa thích nghi.`);

b('d8d865ce-a587-4d0a-8351-5f2af1023e68', `Vì thế, **AWAKEN** trước hết là sự thức giấc của một sinh thể sống trước môi trường. Nó không còn lớn một cách mù quáng, mà bắt đầu xây dựng cơ chế phản ứng với thế giới xung quanh.`);

b('196fb6e6-cc08-44e2-87ed-970793b7d886', `Với con người, **AWAKEN** là quá trình dần tỉnh thức. Một người chưa **AWAKEN** thường sống bằng phản ứng nhanh hơn là hiểu sâu. Họ dễ bị cuốn theo cảm xúc, va chạm với người khác, và hành xử nhiều khi không ý thức được mình đang tác động lên môi trường sống chung như thế nào.`);

b('449d519e-c7a0-490d-bc07-6b2ffc0fc829', `Khi **AWAKEN** bắt đầu diễn ra, con người học được cách quan sát chính mình, nhận ra giới hạn của mình, hiểu cảm xúc và động cơ của mình, đồng thời biết nhìn ra thế giới bên ngoài với sự bình tĩnh hơn. Từ đó, họ không chỉ sống để tồn tại, mà sống để hòa hợp. Họ hiểu mình, hiểu người, và nhờ đó sống cùng xã hội một cách trưởng thành hơn.`);

b('c5254c8d-da79-440b-8a58-50b2bcbd9b6c', `Với tổ chức, **AWAKEN** là giai đoạn hệ thống bắt đầu nhìn ra bản thân một cách trung thực. Doanh nghiệp cần biết mình là ai, mình đang ở đâu, thị trường mình là gì, những gì đang tác động lên mình, và đâu là những lực đẩy hoặc lực kéo đang ảnh hưởng đến tương lai của mình.`);

b('bb69c7a8-3354-4b73-bf30-2becb18b5750', `Một tổ chức chưa **AWAKEN** thường vận hành trong trạng thái mù một phần: làm việc rất chăm nhưng không biết điều gì đang thật sự kéo mình lệch khỏi mục tiêu. Khi **AWAKEN** xuất hiện, tổ chức có thể xây dựng cơ chế quan sát, cơ chế kiểm tra, cơ chế phân tích, cơ chế điều chỉnh và cơ chế học từ sai lệch. Đó là lúc hệ thống bắt đầu phản ứng có ý thức, thay vì phản ứng theo bản năng.`);

b('bf9d1593-b233-437c-8f6f-f323528e8824', `- **Audit** là kiểm tra nội bộ toàn hệ thống. Tổ chức nhìn lại thương hiệu, vận hành, nhân sự, dữ liệu, quy trình, chất lượng dịch vụ và trải nghiệm khách hàng để biết thực trạng thật đang là gì.`);

b('bb5f36a2-cfb2-48ff-872b-01e7a5f0996b', `- **Watch** là quan sát thế giới bên ngoài. Tổ chức phải nhìn thị trường, đối thủ, khách hàng và xu hướng để hiểu môi trường xung quanh đang thay đổi thế nào.`);

b('1470b3de-7749-474a-9e8a-46bfbde90986', `- **Map** là vẽ bản đồ hiện trạng. Đây là bước ghép dữ liệu thành bức tranh có cấu trúc: mình đang ở đâu, mục tiêu ở đâu, khoảng cách ở đâu, và điểm nghẽn nằm ở đâu.`);

b('2a88bcac-5671-4f51-b1c9-5d6c08b7c791', `- **Know** là biết rõ tình trạng thật của doanh nghiệp. Không chỉ biết chung chung, mà là biết mình mạnh ở đâu, yếu ở đâu, đang thiếu gì và còn lệch gì so với mục tiêu.`);

b('a1d9029d-4dc6-474a-b66d-addc95435bc7', `- **Examine** là đào sâu đánh giá nguyên nhân gốc. Tổ chức không dừng ở việc thấy vấn đề, mà phải đi tới cơ chế tạo ra vấn đề, rồi đi tiếp xuống những niềm tin và giả định đang chi phối cơ chế đó.`);

b('bdab8fb3-5bd6-4869-b5a8-69f3f7995c25', `- **Notice** là nhận ra tín hiệu sớm, nhỏ nhưng quan trọng thông báo để phản ứng. Một vài ca khiếu nại lặp lại, sự chậm trễ kéo dài, sự im lặng bất thường của đội ngũ hay dữ liệu lệch nhẹ nhưng liên tục đều có thể là dấu hiệu của một vấn đề lớn hơn đang hình thành.`);

b('42c5a5ed-4df8-416f-99f0-912b8419e6bb', `Trong môi trường nha khoa, **AWAKEN** rất quan trọng vì sai lệch vận hành thường không xuất hiện ngay dưới dạng khủng hoảng lớn, mà khởi đầu từ những tín hiệu nhỏ: lịch hẹn trễ dần, phản hồi khách hàng lặp lại, tư vấn lệch chuẩn, dữ liệu không đồng nhất, hoặc cảm giác mọi thứ vẫn chạy nhưng không còn mượt.`);

b('b5d72bef-587f-4023-9676-265455398af5', `Khi **AWAKEN** được triển khai đúng, phòng khám sẽ không còn chỉ phản ứng sau khi sự cố xảy ra. Tổ chức sẽ có năng lực kiểm tra định kỳ, quan sát thị trường, vẽ lại bản đồ khoảng cách, xác nhận vị trí thật, đào sâu nguyên nhân và phát hiện tín hiệu sớm để can thiệp trước khi vấn đề lớn lên.`);

b('1bd185d7-a0a1-4ed6-a009-1f4a20d37715', `Điều này đặc biệt quan trọng với phòng khám đang muốn mở rộng quy mô. Một hệ thống chưa biết rõ mình đang ở đâu thì rất khó đi đúng hướng. **AWAKEN** giúp tổ chức tránh việc mở rộng trên một nền hiểu biết mơ hồ.`);

b('6e6e8b78-4b44-4e08-bbb4-23963a0e070c', `**AWAKEN** là tầng đánh thức năng lực nhìn thật của tổ chức. Nó giúp doanh nghiệp không bị cuốn vào việc chữa triệu chứng, mà quay về tìm đúng căn nguyên. Khi một phòng khám biết kiểm tra nội bộ, quan sát bên ngoài, vẽ bản đồ hiện trạng, hiểu rõ mình đang ở đâu, đào sâu nguyên nhân và nhận ra tín hiệu sớm, lúc đó tổ chức mới thật sự có năng lực tự sửa mình trước khi thị trường buộc phải sửa.`);

b('5f436a4a-1322-4ab6-a310-138b35fee825', `**Kiểm tra → Quan sát → Vẽ bản đồ → Hiểu rõ → Đào sâu → Nhận diện tín hiệu sớm.**`);
b('1a645b98-a975-4131-b1da-f15f2a543936', `**Audit the system, Watch the environment, Map the gap, Know the reality, Examine the root cause, Notice the early signals.**`);
b('63f1ad8d-daa9-4e1d-a471-6809189a435d', `**Audit → Watch → Map → Know → Examine → Notice.**`);

// ===== LAYER 4: D - DEEPEN =====
b('2d72b4a1-334a-46f9-9c3d-4e4d9704cfd9', `Nếu những tầng trước giúp tổ chức nhận diện đúng, giữ đúng và định hướng đúng, thì **DEEPEN** là tầng giúp hệ thống đưa cái đúng đó đi vào chiều sâu của vận hành. Đây là bước mà một năng lực, một quy trình hay một tiêu chuẩn không còn dừng ở mức "biết là nên làm", mà bắt đầu được đào sâu, chuẩn hóa và biến thành nếp sống của toàn hệ thống.`);

b('26c1ac3d-c01d-479f-8836-ecf932a5e81e', `Trong một tổ chức phát triển bền vững, điều quan trọng không chỉ là có ý tưởng tốt hay nguyên tắc đúng. Quan trọng hơn là tổ chức có đủ năng lực để bóc tách nó thành cấu trúc rõ ràng, đóng gói thành quy trình, ép vào thực thi và lặp lại đủ lâu để nó trở thành bình thường mới. Đó chính là vai trò của **DEEPEN**.`);

b('434bcbfc-bb38-4e51-9c8f-a9204747dd44', `**DEEPEN** là framework đào sâu và chuẩn hóa năng lực trong tổ chức. Nó giúp doanh nghiệp xác định đúng thứ cần làm sâu, nâng chất lượng của nó lên, làm rõ từng chi tiết, chuyển hóa thành quy trình chuẩn, bảo đảm thực thi và cuối cùng biến nó thành nếp vận hành của hệ thống.`);

b('26e52669-550d-46f4-9a9c-f2b21705faca', `Nói ngắn gọn, **DEEPEN** là quá trình **đào sâu năng lực, chuẩn hóa SOP và biến chuẩn mực thành nếp vận hành**.`);

b('241649d3-bacb-407c-a9c3-e387fea76f5a', `Một tổ chức có thể biết điều gì là đúng, nhưng vẫn không thực hiện được đúng nếu không có tầng chuyển hóa. Nhiều hệ thống thất bại không phải vì thiếu nguyên tắc, mà vì nguyên tắc không được đi đến mức đủ sâu để trở thành quy trình, trách nhiệm, checklist và kỷ luật vận hành.`);

b('e3fdb9a7-d67d-44fa-8892-1e6bedff8676', `**DEEPEN** tồn tại để lấp đầy khoảng trống đó. Nó giúp tổ chức không chỉ nói về tiêu chuẩn, mà còn biến tiêu chuẩn thành cấu trúc sống được trong thực tế. Đó là bước từ tư duy sang thực thi, từ ý tưởng sang hệ thống, từ cái đúng trong đầu người lãnh đạo sang cái đúng có thể lặp lại trong đời sống tổ chức.`);

b('0334652f-e516-4305-89f1-4b119b35ec1b', `**Define** là bước xác định rõ điều gì cần được đào sâu. Tổ chức phải nói rõ mình đang cần chuẩn hóa năng lực nào, quy trình nào, vấn đề nào hoặc hành vi nào. Nếu không định nghĩa rõ, mọi nỗ lực cải tiến sẽ rất dễ lan man và thiếu trọng tâm.`);
b('128629dd-e623-4448-aa8c-c92d258374f1', `**Define** giúp hệ thống trả lời câu hỏi: ta đang cần làm sâu cái gì, và vì sao nó quan trọng đến mức phải chuẩn hóa.`);

b('64bf7c87-585d-4db5-a3c7-4ccde87becc6', `**Enhance** là nâng chất lượng của năng lực hoặc cách làm lên mức tốt hơn. Không phải cái gì cũng cần tạo mới hoàn toàn; nhiều khi vấn đề là cái đang có chưa đủ mạnh, chưa đủ tốt, chưa đủ ổn định để trở thành nền tảng dài hạn.`);
b('de20b6b0-04a7-41a6-a603-c4194ca54430', `**Enhance** là bước làm cho cái đúng trở nên tốt hơn, sắc hơn và mạnh hơn trước khi đưa nó vào hệ thống hóa.`);

b('72f13f87-21bb-40af-8245-b1c4dda8bd07', `**Elaborate** là làm rõ chi tiết. Ở bước này, tổ chức bóc tách từng bước, từng điều kiện, từng tiêu chuẩn, từng ngoại lệ và từng tình huống có thể xảy ra. Một tiêu chuẩn nếu chưa được làm rõ thì vẫn chỉ là khái niệm.`);
b('fc942cbb-e031-4344-ac3f-3b1f278a2db5', `**Elaborate** giúp biến điều mơ hồ thành điều có thể dạy, có thể theo dõi và có thể kiểm tra.`);

b('cc728090-0359-453b-ac84-198ead321618', `**Process** là đóng gói thành quy trình chuẩn. Đây là lúc điều đã được làm rõ bắt đầu được chuyển thành SOP, quy trình lặp lại, tài liệu hướng dẫn và logic chuyển giao.`);
b('5bb6c2c5-cd6a-459b-901c-0641062ee746', `**Process** là bước cực kỳ quan trọng, vì nếu không có quy trình, tổ chức sẽ phụ thuộc quá nhiều vào cá nhân giỏi. Khi đó hệ thống không bền, vì người giỏi nghỉ đi thì chuẩn mực cũng dễ tan theo.`);

b('daf5145f-81d7-4e71-bc61-a496cbb83b1e', `**Enforce** là bảo đảm thực thi. Một quy trình chỉ thật sự có giá trị khi nó được ép vào thực tế bằng checklist, **KPI**, trách nhiệm, quyền hạn và cơ chế kiểm soát.`);
b('3597d860-c6bf-439b-996a-4e4f6b0bc27e', `**Enforce** không có nghĩa là cứng nhắc vô cảm, mà là tổ chức phải có khả năng bảo vệ chuẩn bằng hành động cụ thể. Nếu không enforce, SOP sẽ chỉ nằm trên giấy.`);

b('692451a3-b329-488d-a3cf-e2647d7be2ac', `**Normalize** là biến chuẩn thành nếp vận hành bình thường của hệ thống. Đây là đích đến của toàn bộ quá trình **DEEPEN**. Khi một chuẩn đã được làm đủ rõ, đủ tốt, đủ lặp lại và đủ được thực thi, nó không còn là "việc đặc biệt nữa", mà trở thành cách làm mặc định của toàn tổ chức.`);
b('a2d9a1bc-d0ed-4dad-8a58-35f360749e1e', `**Normalize** là lúc chuẩn mực không cần phải nhắc quá nhiều vì nó đã đi vào thói quen, phản xạ và văn hóa làm việc.`);

b('bfacf1d0-79b1-4e0b-b06b-12f4c64e3ff6', `**DEEPEN** là tầng giúp hệ thống không chỉ hiểu đúng việc cần đào sâu mà còn chuyển nó thành SOP, trách nhiệm, **KPI** và kỷ luật vận hành. Đây là cầu nối giữa nhận thức và thực tế, giữa tiêu chuẩn và hành vi, giữa thiết kế và lặp lại.`);
b('2417f923-7505-4656-b0e1-1cc2f873522a', `Trong một tổ chức nha khoa, điều này đặc biệt quan trọng vì chất lượng chuyên môn, trải nghiệm bệnh nhân, tính an toàn và độ tin cậy của hệ thống đều không thể dựa vào cảm hứng cá nhân. Chúng phải được đóng gói thành cách làm chung, được duy trì đủ lâu và được kiểm soát đủ chặt để không bị trượt chuẩn.`);

b('4ce184e3-0937-4b1b-bc83-634c01e7c2c2', `**DEEPEN** là cách tổ chức biến năng lực thành chuẩn, biến chuẩn thành quy trình, và biến quy trình thành nếp vận hành. Khi một hệ thống đủ sâu để tự chuẩn hóa chính mình, nó không chỉ làm tốt hơn mà còn bền hơn.`);
b('ef4af7a0-655e-44b1-a989-bbda58a97558', `Đào sâu năng lực, chuẩn hóa SOP, và biến chuẩn mực thành nếp vận hành.`);
b('7d9179d2-674c-49bd-a6c1-e939eba8a57d', `**Xác định → Nâng chất → Làm rõ → Đóng gói quy trình → Thực thi → Chuẩn hóa thành nếp.**`);
b('125ac9d0-6257-4a3f-b098-5d6427260d51', `**Define the need, Enhance the quality, Elaborate the details, Process into SOP, Enforce execution, Normalize into habit.**`);
b('9891086a-0c13-4b0f-b9ee-6c9d02d166f1', `**Define → Enhance → Elaborate → Process → Enforce → Normalize.**`);

// ===== LAYER 5: M - MATURE =====
b('4936826f-3b83-48e5-87eb-99c451d7f5e9', `Nếu những tầng trước giúp tổ chức nhận diện đúng, chuẩn hóa đúng và đào sâu đúng, thì **MATURE** là tầng giúp toàn hệ thống bước vào trạng thái chín hơn. Đây không chỉ là giai đoạn tổ chức lớn lên về quy mô, mà là giai đoạn nó trưởng thành hơn về nhịp, rõ hơn về chuẩn, mạnh hơn về niềm tin và linh hoạt hơn trong khả năng tự nâng cấp.`);

b('ffdd604d-827f-4e1b-9af7-31ad6df8c020', `Trong thực tế, rất nhiều tổ chức có thể tăng nhanh, nhưng không phải tổ chức nào cũng chín. Có những hệ thống đi rất nhanh nhưng vẫn rời rạc, thiếu đà, thiếu sự ăn khớp giữa con người và cơ chế, thiếu niềm tin nội bộ, và thiếu năng lực tự tinh chỉnh khi môi trường thay đổi. **MATURE** tồn tại để xử lý chính khoảng trống đó.`);

b('67cd3413-b05f-4512-be1f-d309c765140c', `**MATURE** là framework mô tả tiến trình làm cho hệ thống có đà phát triển, đồng bộ hơn, đáng tin cậy hơn, gắn kết hơn, tinh gọn hơn và có khả năng nâng cấp liên tục trong thực tế.`);
b('d2e6dc55-031e-46d5-80b5-4ae34c87489a', `Nói ngắn gọn, **MATURE là quá trình tạo đà, chỉnh nhịp, xây niềm tin, hợp lực, tinh chỉnh và nâng tầng** để hệ thống phát triển bền hơn thay vì chỉ chạy nhanh hơn.`);

b('093e92e1-27fe-4b08-b859-41676159393b', `Một tổ chức muốn đi đường dài không thể chỉ dựa vào động lực ban đầu. Động lực có thể giúp khởi động, nhưng không đủ để giữ cho hệ thống bền, đều và có khả năng tự điều chỉnh sau những lần va đập. Khi một doanh nghiệp chưa mature, nó thường biểu hiện bằng nhịp vận hành lệch nhau giữa các bộ phận, niềm tin nội bộ chưa đủ vững, quy trình còn nhiều ma sát và khả năng cải tiến chưa đủ ổn định.`);
b('6234f1ef-9471-4b47-a0d5-3b167b044709', `**MATURE** giúp hệ thống chuyển từ trạng thái "đang chạy" sang trạng thái "đang chín". Đó là khác biệt giữa việc có hoạt động và việc thật sự có tiến hóa.`);

b('79d31be7-c3dd-4358-bcb1-5ee2b07061b2', `**Momentum** là tạo đà phát triển để hệ thống không vận hành theo kiểu rời rạc hay thiếu lực kéo. Một tổ chức không có momentum thường phải bắt đầu lại quá nhiều lần, mất nhiều năng lượng cho việc khởi động mà không đủ độ trôi để tiến xa.`);
b('5e227903-f814-42ff-8ac5-d082fbcac7bb', `**Momentum** là nền của sự liên tục. Khi hệ thống có đà, mọi nỗ lực nhỏ sẽ cộng dồn tốt hơn, và tổ chức không còn phải kéo từng bước bằng ý chí cá nhân.`);

b('ad9b7e1a-a1ce-4786-97eb-a99f5638ac48', `- **Attune** là chỉnh nhịp mục tiêu, con người và cơ chế để toàn hệ cùng tần số. Đây là bước làm cho chiến lược, vai trò và nhịp vận hành không đi lệch nhau.
- Một hệ thống không attune sẽ dễ xảy ra tình trạng mục tiêu một đằng, con người một nẻo, cơ chế một kiểu. **Attune** giúp mọi phần của tổ chức cùng "nghe" được một bản nhạc chung.`);

b('5a0ab3d2-ccbd-4ede-9971-03b060cd1f94', `- **Trust** là xây niềm tin bằng tính nhất quán, tiêu chuẩn rõ và trải nghiệm thật trong vận hành. Niềm tin trong tổ chức không đến từ lời nói hay khẩu hiệu, mà từ việc hệ thống làm đúng đủ lâu để tạo ra cảm giác an tâm thật.
- **Trust** làm cho con người tin vào nhau, tin vào quy trình và tin vào năng lực chung của tổ chức. Không có trust, mọi cơ chế đều phải kiểm soát quá mức và chi phí vận hành sẽ tăng lên rất nhiều.`);

b('2883a6b6-856b-4977-9faf-b550efd2f449', `- **Unite** là gắn kết vai trò, bộ phận và nguồn lực thành một khối phối hợp hiệu quả. Một tổ chức Mature không cho phép các phần của mình hoạt động như những ốc đảo riêng lẻ.
- **Unite** biến sự có mặt của nhiều bộ phận thành một sức mạnh hợp lực. Khi mọi phần cùng đi về một hướng, hệ thống không chỉ mạnh hơn mà còn ít hao tổn hơn.`);

b('b9afdcbb-2ec4-420b-a9f2-aaa70a6e747a', `- **Refine** là tinh chỉnh quy trình, cấu trúc và cách làm để giảm ma sát và tăng độ sắc nét của hệ thống. Không phải cứ có quy trình là đủ; quy trình cần được mài lại cho gọn hơn, rõ hơn và dễ vận hành hơn.
- **Refine** là bước giúp tổ chức bớt nặng nề, bớt rối và bớt lãng phí năng lượng vào những chỗ không cần thiết.`);

b('fdcdde57-0837-49df-80be-868084bb5d6d', `- **Elevate** là nâng cấp chuẩn vận hành, năng lực đội ngũ và chất lượng tăng trưởng lên tầng cao hơn. Đây là đích đến của **MATURE**: không chỉ ổn định hơn, mà còn cao hơn về chuẩn, sâu hơn về năng lực và tốt hơn về chất lượng phát triển.
- **Elevate** là lúc tổ chức không còn chỉ giữ mức tốt hiện tại, mà bắt đầu đi lên một nấc mới.`);

b('c7db034c-13bd-49ff-a284-758d98ab8ea1', `Trong mạch phát triển hiện tại, **MATURE** diễn tả giai đoạn hệ thống không chỉ lớn hơn mà còn chín hơn về nhịp, rõ hơn về chuẩn, mạnh hơn về niềm tin và tốt hơn về khả năng tự nâng cấp. Nó là một tầng rất cần thiết nếu tổ chức muốn chuyển từ tăng trưởng ngắn hạn sang tăng trưởng có độ ổn định cao.`);
b('e86c4ca7-2321-49f5-83f6-0d55369dc258', `Ở đây, "mature" không chỉ là trưởng thành theo tuổi đời. Nó là trưởng thành theo cấu trúc: biết tạo đà, biết chỉnh nhịp, biết xây trust, biết hợp lực, biết tinh chỉnh và biết nâng tầng liên tục.`);

b('9b734bfc-d1a3-4940-8c3c-58bc5d7ceb29', `**MATURE** là tầng cho thấy một hệ thống không chỉ cần lớn lên, mà còn cần **chín** lên. Nếu momentum giúp tổ chức có đà để đi, attune giúp mọi phần cùng chung nhịp, trust giúp hệ thống đáng tin cậy hơn, unite giúp nguồn lực được hợp lực, refine giúp cấu trúc trở nên sắc nét hơn, thì elevate là đích đến tự nhiên của toàn bộ quá trình ấy: một chuẩn cao hơn, một cách vận hành tốt hơn, và một năng lực tăng trưởng bền hơn.`);
b('216d6e8a-a7d9-4749-9b54-5f0eac519c4b', `Nói cách khác, **MATURE** không đơn thuần là làm cho hệ thống chạy nhanh hơn. Nó làm cho hệ thống **đi xa hơn mà không vỡ nhịp**, **lớn hơn mà không rời rạc**, và **cao hơn mà không mất nền**. Đó là sự trưởng thành thật của một tổ chức: biết tạo đà, biết chỉnh nhịp, biết xây niềm tin, biết hợp lực, biết tinh chỉnh và biết liên tục nâng cấp chính mình.`);
b('c8073c59-b18e-489b-8bfd-2b02a35e7277', `Khi một tổ chức đi qua **MATURE**, nó không còn chỉ là một cỗ máy đang hoạt động, mà trở thành một hệ thống sống có khả năng tự đồng bộ, tự nâng chuẩn và tự tiến hóa. Và chính khả năng đó mới là dấu hiệu rõ nhất của một tổ chức đã bước vào giai đoạn trưởng thành bền vững.`);

b('6cac9579-2169-42f1-bcca-61ae4915d2ae', `**Tạo đà → Chỉnh nhịp → Xây trust → Hợp lực → Tinh chỉnh → Nâng tầng.**`);
b('019ffb30-d2e3-4d9b-bdd5-f58321ea7b38', `**Momentum → Attune → Trust → Unite → Refine → Elevate.**`);
b('484ac7c9-5579-432c-8540-c31c20c60e4e', `**Build momentum, attune the system, earn trust, unite the force, refine the process, elevate the standard.**`);

// ===== LAYER 6: A - ALIGN =====
b('5b8cfc71-ad45-4cf4-81fc-5fe04dba0d9f', `Nếu những tầng trước giúp tổ chức nhìn ra, chuẩn hóa và trưởng thành hơn, thì **ALIGN** là tầng giúp toàn bộ hệ thống đi vào trạng thái đồng bộ thật sự. Đây là bước mà mục tiêu, con người, nguồn lực, quy trình và cơ chế phối hợp không còn vận hành theo các nhịp riêng lẻ, mà bắt đầu được neo lại, nối lại, tích hợp lại và tinh chỉnh lại để đi cùng một hướng.`);

b('fc1f75e8-a1a5-425a-8943-e12fbd7e9032', `Trong thực tế, nhiều tổ chức không thất bại vì thiếu nỗ lực. Họ thất bại vì quá nhiều thứ cùng chạy nhưng không chạy cùng nhịp. Bộ phận này hiểu một kiểu, bộ phận khác hiểu một kiểu; kế hoạch có, nhưng nguồn lực không nối đúng; quy trình có, nhưng cơ chế quản trị chưa đủ chặt; mục tiêu có, nhưng khoảng lệch giữa kế hoạch và thực thi vẫn còn rất lớn. **ALIGN** sinh ra để xử lý chính sự lệch pha đó.`);

b('b035553a-b8ff-4f2e-9597-05ad3fa9dfde', `**ALIGN** là framework đồng bộ hóa hệ thống trong **R.O.A.D.M.A.P**. Nó giúp tổ chức neo mục tiêu chung, kết nối con người và nguồn lực, tích hợp quy trình và vai trò, thiết lập cơ chế quản trị, rồi liên tục thu hẹp khoảng lệch giữa mục tiêu và thực tế.`);
b('eeb80439-0ce5-4f0b-be08-165f97c940bb', `Nói ngắn gọn, **ALIGN là tầng giúp tổ chức neo lại mục tiêu, nối đúng nguồn lực, tích hợp bộ máy, quản trị nhịp vận hành và liên tục thu hẹp các độ lệch trong quá trình tăng trưởng.**`);

b('77c1f87e-2ae4-4c7a-8206-8ef80b1522c8', `Một hệ thống chỉ trưởng thành thôi vẫn chưa đủ nếu các phần bên trong nó không đi cùng nhau. Tổ chức có thể rất rõ về định hướng, rất mạnh về nguyên tắc, rất tốt về quy trình, nhưng vẫn vận hành chệch nếu con người, dữ liệu, công cụ và nhịp quản trị chưa được liên kết thành một khối.`);
b('0c713585-6643-4aa7-8056-5c7e1389d593', `**ALIGN** tồn tại để làm cho sự đồng bộ trở thành năng lực có chủ đích, thay vì để hệ thống tự chờ mọi thứ "tự ăn khớp". Nó giúp tổ chức giảm lệch pha giữa người, việc, nguồn lực và cơ chế phối hợp, từ đó tăng độ ổn định và tăng chất lượng thực thi.`);

b('e719da56-13b1-4b76-b0a0-a578b1692ae0', `- **Anchor** là neo mục tiêu chung, giữ cho toàn bộ hệ thống không trôi khỏi định hướng cốt lõi. Khi một tổ chức thiếu **Anchor**, các quyết định dễ bị kéo lệch bởi cảm xúc ngắn hạn, áp lực thị trường hoặc ưu tiên cục bộ của từng bộ phận.
- **Anchor** là điểm tựa để mọi người cùng nhìn về một hướng. Nó không chỉ giữ mục tiêu trong đầu lãnh đạo, mà giữ mục tiêu ở trong nhịp vận hành của cả hệ thống.`);

b('2323fe32-63bb-4964-8012-5a4200701f2d', `- **Link** là kết nối con người, dữ liệu, công cụ và nguồn lực để tránh vận hành rời rạc. Một hệ thống có quá nhiều mảnh ghép nhưng thiếu **Link** sẽ luôn phải tiêu hao năng lượng cho việc ghép nối lại từ đầu.
- **Link** biến sự tồn tại song song thành sự phối hợp có ý nghĩa. Đây là lớp liên kết giúp tổ chức không bị phân mảnh thành những ốc đảo riêng lẻ.`);

b('0d1a7db9-87a8-4789-bb26-edde02ce56b2', `- **Integrate** là tích hợp quy trình, vai trò và nhịp vận hành thành một hệ thống liền mạch. Nếu **Link** là nối các phần lại với nhau, thì **Integrate** là làm cho các phần ấy thật sự hoạt động như một cấu trúc thống nhất.
- **Integrate** giúp hệ thống bớt đứt gãy giữa kế hoạch và thực thi, giữa chức năng và trách nhiệm, giữa công cụ và hành vi.`);

b('e8b08b08-1469-48b4-9300-2820e3118167', `- **Govern** là thiết lập cơ chế quản trị, phân quyền, trách nhiệm và nhịp họp để hệ thống đi đúng hướng. Không có **Govern**, hệ thống rất dễ rơi vào tình trạng ai cũng làm, nhưng không ai thật sự chịu trách nhiệm đến cùng.
- **Govern** là phần giữ cho sự đồng bộ không chỉ đẹp trên sơ đồ, mà còn thật trong đời sống vận hành.`);

b('f1b268cd-1c6e-4d86-b520-e52115afd326', `- **Narrow** là thu hẹp khoảng lệch giữa mục tiêu và thực tế, giữa kế hoạch và thực thi, giữa các bộ phận trong hệ thống. Đây là đích đến của toàn bộ quá trình **ALIGN**: không phải tạo ra một hệ thống hoàn hảo ngay lập tức, mà liên tục giảm khoảng cách cho đến khi hệ thống chạy càng ngày càng khớp.
- **Narrow** biến cải tiến thành một quá trình có hướng. Tổ chức càng mature thì càng phải giỏi trong việc thu hẹp độ lệch này.`);

b('91c17454-0c36-49f7-aa93-0adf5d2acddd', `Trong mạch phát triển hiện tại, **ALIGN** đứng sau giai đoạn làm cho hệ thống trưởng thành hơn, vì chỉ khi hệ đã đủ rõ cấu trúc và ổn định thì việc đồng bộ hóa mới có hiệu lực thực sự.`);
b('bb34c5f9-e72e-44cd-8185-77f12c338ca8', `Ở tầng này, tổ chức không còn chỉ hỏi "chúng ta có làm không?", mà bắt đầu hỏi "chúng ta có làm cùng nhau, làm đúng nhịp và làm giảm lệch hay không?". Đó là dấu hiệu của một hệ thống đã đi qua giai đoạn rời rạc và đang bước vào giai đoạn phối hợp có chủ đích.`);

b('81059076-3af1-4886-b408-eb21cba11ab7', `**ALIGN** là tầng giúp hệ thống thôi vận hành theo nhiều nhịp rời rạc và bắt đầu đi cùng một hướng. Khi mục tiêu đã được neo, nguồn lực đã được nối, bộ máy đã được tích hợp và cơ chế quản trị đã rõ, tổ chức mới có thể liên tục thu hẹp khoảng lệch giữa điều muốn làm và điều đang diễn ra.`);
b('9bd2a4ba-e273-4cfe-9252-0bff0b824159', `Nói cách khác, **ALIGN** biến "đồng bộ" từ một mong muốn thành một năng lực vận hành thật. Đó là cách một tổ chức trưởng thành không chỉ chạy nhanh hơn, mà còn chạy **khớp** hơn.`);

b('680a4218-5cf8-47d1-ad43-7e23795c2adf', `**Neo mục tiêu → Nối nguồn lực → Tích hợp hệ thống → Quản trị nhịp vận hành → Thu hẹp khoảng lệch.**`);
b('170caf31-27e1-434c-9504-6138b9799222', `**Anchor the goal, Link the resources, Integrate the system, Govern the flow, Narrow the gap.**`);
b('e0c40769-f014-49f2-8cf2-8435fae2d12a', `**Anchor → Link → Integrate → Govern → Narrow.**`);

// ===== LAYER 7: P - PROSPER =====
b('bd7dc4e3-38c5-4b57-ac2d-14e84bdd0b79', `Nếu những tầng trước giúp hệ thống nhìn đúng, chuẩn hóa đúng, trưởng thành hơn và đi cùng một hướng, thì **PROSPER** là tầng giúp toàn bộ nỗ lực ấy biến thành **đà tăng trưởng kép**. Đây là giai đoạn hệ thống không chỉ tăng trưởng một lần, mà tự tạo ra nhiều vòng tăng trưởng mới bằng cách sinh sôi giá trị, tái đầu tư thành quả và làm cho mỗi chu kỳ sau mạnh hơn chu kỳ trước.`);

b('c5d48964-21a1-462c-81e8-a8d561040374', `Trong thực tế, một tổ chức có thể tăng trưởng mà không Prosper. Tăng trưởng đơn thuần chỉ nói rằng hệ thống có lớn lên; còn Prosper nói rằng hệ thống lớn lên theo cách có khả năng tạo thêm lực kéo cho chính mình. Đó là khác biệt giữa việc "đi lên một lần" và việc tạo ra một bánh đà tăng trưởng có thể tự quay.`);

b('b5204fda-ecc6-4c55-91d0-91d8ee048ea0', `**PROSPER** là framework mô tả quá trình sinh sôi, thịnh vượng và tạo hiệu ứng bánh đà tăng trưởng kép cho hệ thống.`);
b('060838b3-9fcd-4775-b28a-4b5bbc3fa87d', `Nói ngắn gọn, **PROSPER là quá trình sinh sôi, tái đầu tư, tối ưu, mở rộng, lan truyền, làm giàu và đổi mới để tạo ra hiệu ứng bánh đà tăng trưởng kép.**`);

b('4cd0cd7a-fc9e-494a-88b0-03277babe58d', `Một hệ thống muốn đi đường dài không thể chỉ chăm chăm tạo ra kết quả ngắn hạn. Nếu không có cơ chế tái đầu tư và tái sinh, mọi thành quả tốt cuối cùng cũng sẽ bị tiêu hao dần theo thời gian. **PROSPER** tồn tại để biến kết quả thành nhiên liệu cho vòng tăng trưởng kế tiếp, thay vì để thành quả bị tiêu thụ hết trong hiện tại.`);
b('fa6e2d94-2b99-454e-93bb-44c02fb5e8f6', `Điều này rất quan trọng với tổ chức nha khoa, vì tăng trưởng bền không chỉ đến từ thu hút khách mới, mà còn đến từ khả năng tạo niềm tin, kích hoạt giới thiệu, làm giàu hệ sinh thái và làm mới liên tục cách tổ chức tạo ra giá trị.`);

b('8731bd03-d9c6-49cf-be9f-f34b7105dd6d', `- **Proliferate** là sinh sôi và lan rộng giá trị theo cấp số nhân để tạo thêm lực cho mỗi vòng tăng trưởng. Tổ chức không chỉ tạo ra kết quả, mà còn làm cho kết quả đó sinh ra thêm tác động mới, người dùng mới, niềm tin mới và cơ hội mới.`);

b('e2aa340a-daaf-4c33-8273-29c75ca712a2', `- **Reinvest** là tái đầu tư kết quả tốt trở lại vào con người, quy trình, nội dung và hạ tầng. Nếu không tái đầu tư, tăng trưởng sẽ chỉ là đỉnh ngắn hạn. **Reinvest** giúp thành quả được chuyển hóa thành nền tảng mới cho chu kỳ tiếp theo.`);

b('ab9ae517-4cf9-46a3-91d9-19537a0da791', `- **Optimize** là tối ưu liên tục để giảm ma sát và tăng hiệu suất của toàn hệ thống. Đây là bước làm cho tổ chức ngày càng nhẹ hơn ở những chỗ nặng, nhanh hơn ở những chỗ chậm, và rõ hơn ở những chỗ còn mù.`);

b('8969c2b9-b8a1-4545-81ae-e4efd5e88ca2', `- **Scale** là mở rộng có kiểm soát khi hệ đã đủ chắc, đủ rõ và đủ bền. **Scale** không phải mở rộng bằng mọi giá; nó là mở rộng đúng lúc, đúng nền và đúng năng lực.`);

b('6fd0473f-f0a8-4e52-8021-9d7bfeb50087', `- **Propagate** là lan truyền giá trị qua referral, cộng đồng và các lớp tài sản niềm tin. Đây là lúc giá trị không còn nằm riêng trong phòng khám, mà bắt đầu đi xa hơn qua sự giới thiệu, chia sẻ và cộng hưởng của những người đã tin.`);

b('64d696b5-93f8-4209-9b59-b9f2d08d409e', `- **Enrich** là làm giàu hệ sinh thái bằng dữ liệu, kinh nghiệm và nguồn lực mới. Khi hệ thống giàu hơn, nó không chỉ có thêm tài sản, mà còn có thêm chiều sâu để tiếp tục phát triển.`);

b('d65e6333-a6d2-40d2-acd5-18e2339552c6', `- **Renew** là làm mới vòng tăng trưởng để hệ luôn sống động và không bị cũ hóa. **Renew** giúp tổ chức không bị mắc kẹt trong một mô hình đã thành công quá lâu đến mức trở nên già nua.`);

b('32c4f52c-9cba-4dd2-a75d-72f45f8c14b8', `Trong mạch phát triển hiện tại, **PROSPER** là tầng giúp hệ thống không chỉ tăng trưởng một lần mà tự tạo ra nhiều vòng tăng trưởng mới, nhờ đó giá trị, niềm tin, referral và năng lực nội bộ cùng nhân lên theo thời gian.`);
b('b35b6311-fef6-47b2-b3c8-340c398b250d', `Ở đây, tăng trưởng không còn là một đường thẳng đi lên rồi dừng lại. Nó trở thành một chu trình sống động, nơi mỗi vòng tăng trưởng tốt sẽ tạo nền cho vòng tiếp theo mạnh hơn.`);

b('50f7aaee-b16d-4865-a3ba-d5de2a79cfaf', `**PROSPER** là tầng giúp hệ thống tăng trưởng theo kiểu tự sinh sôi, tự tái đầu tư và tự làm mới chính mình. Khi một tổ chức biết biến kết quả thành nhiên liệu cho chu kỳ tiếp theo, nó không chỉ lớn lên một lần mà có thể tạo ra nhiều vòng tăng trưởng mới theo thời gian.`);
b('64a75e1f-edf2-4104-8901-ef978638b05e', `Nói cách khác, **PROSPER** không chỉ làm cho hệ thống **tăng trưởng**, mà làm cho hệ thống **thịnh vượng có đà**. Đó là sự tăng trưởng biết sinh ra tăng trưởng, biết nuôi lại chính mình và biết mở rộng bằng niềm tin, dữ liệu và giá trị thật.`);

b('1a29fd85-dc08-4ae2-83ce-61dd0de7ec2a', `**Sinh sôi → Tái đầu tư → Tối ưu → Mở rộng → Lan truyền → Làm giàu → Đổi mới.**`);
b('86b88d51-d6c9-436f-bbe9-87c3b92a8b97', `**Proliferate → Reinvest → Optimize → Scale → Propagate → Enrich → Renew.**`);

console.log(`Phase 3: ${blocks.length} blocks to update`);

const BATCH = 10;
for (let i = 0; i < blocks.length; i += BATCH) {
  const batch = blocks.slice(i, i + BATCH);
  const sqls = batch.map(u => `UPDATE "block" SET "text_md" = '${u.text}' WHERE "id" = '${u.id}';`);
  const multi = sqls.join('\n');
  const tmpFile = join(tmpdir(), `c3p3_${Date.now()}.sql`);
  writeFileSync(tmpFile, multi);
  try {
    execSync(
      `npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`,
      { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
    );
    process.stdout.write(`✓ Batch ${Math.floor(i/BATCH)+1}/${Math.ceil(blocks.length/BATCH)} (${batch.length} blocks)\n`);
  } catch (e) {
    // retry once
    execSync(
      `npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`,
      { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
    );
    process.stdout.write(`✓ Batch ${Math.floor(i/BATCH)+1} (retry)\n`);
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

console.log(`\n✓ Chapter 3 Phase 3 DONE: ${blocks.length} blocks updated`);
