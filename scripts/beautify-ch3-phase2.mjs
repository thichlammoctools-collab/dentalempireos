import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';
const blocks = [];

function b(id, text) { blocks.push({ id, text: text.replace(/'/g, "''") }); }

// ===== LAYER 1: R - ROOTS =====
b('6fc90e5c-7f42-43ad-9ada-f3df6c4d9e93', `**Nền tảng căn bản nhất trả lời câu hỏi: "Chúng ta là ai và tại sao chúng ta tồn tại?"**`);

b('b4f361d5-9488-4fab-9861-aea989eb1f50', `Ca dao Việt Nam có câu:`);
b('73159bc9-ad5d-4191-a7fe-361fe1bd5805', `*"Cây có gốc mới nở ngành xanh ngọn*`);
b('dba2dcae-dbf1-4300-807c-cc37bf24a8f9', `*Nước có nguồn mới bể rộng sông sâu*`);
b('9d6300a6-ce4d-40f4-83e2-21c45ff7edda', `*Người ta nguồn gốc từ đâu*`);
b('75ae99cf-038b-4db2-a3c6-a4346c2f1ede', `*Có tổ tiên trước rồi sau có mình."*`);

b('fa5ccefb-c191-4d57-b2d4-f61f24eb56c6', `Bất cứ một cái cây nào dù sinh sản bằng hạt hay bằng thân thì điều kiện đầu tiên để nó bắt đầu một sự sống là **tạo rễ**. Một cái cây muốn vươn cao, tỏa bóng mát và chống chọi được giông bão thương trường thì bộ rễ phải cắm thật sâu vào lòng đất. Thân thì luôn đi lên, cành lá thì luôn tìm nơi có ánh sáng nhưng rễ lại khác. Rễ chấp nhận đi vào nơi tối tăm nhất, dơ bẩn nhất, chật chội nhất để tìm nguồn nước, dưỡng chất, giữ cho cái cây luôn vững chãi.`);

b('56a0df5a-51b3-44aa-a407-4bc7d5e1e461', `**Đối với cá nhân**, đi vào gốc rễ là đi khám phá **chân tâm** của mình. Hành trình tu sửa của mỗi người bản chất là hành trình **soi sáng** những nơi tối tăm nhất của tâm hồn, tu sửa những điều sai trái, và nuôi dưỡng lương tri bằng những điều cao đẹp.`);

b('e59ccde4-3fbc-4584-92c1-2bfc78d4ab68', `**Đối với tổ chức**, dù nhỏ hay lớn, nếu muốn trường tồn thì phải có bản sắc đủ sâu, phải luôn có một nền tảng vững chắc để làm điểm tựa cho việc **luôn làm đúng** ngay cả trong những hoàn cảnh ngặt nghèo nhất.`);

// === Radicle ===
b('2d3a9645-9ca1-4902-90f6-eff6098e8ce7', `**Rễ mầm — Bộ gen quyết định cấu trúc và cũng là "Linh Hồn" của tổ chức.**`);

b('e5214019-d872-4d7c-900b-59a6ca3abd16', `Trong sinh học, **radicle** là chiếc rễ mầm đầu tiên chọc thủng lớp vỏ hạt để lao xuống lòng đất. Đó là phản xạ sinh tồn nguyên thủy nhất của một mầm sống: trước khi vươn lên ánh sáng, nó phải tìm được điểm bám sâu vào đất mẹ. Từ hình ảnh đó, **Radicle** trong hệ điều hành **R.O.A.D.M.A.P** được dùng để chỉ phần gốc nguyên bản nhất của một tổ chức: lý do sâu xa khiến nó được khai sinh, sẵn sàng đánh đổi nguồn lực, thời gian và cả những tổn thất vô hình để tồn tại và lớn lên.`);

b('8b2888b4-4263-4c61-bde7-48c72253c310', `Ở cấp độ quản trị, **Radicle** không phải là một khẩu hiệu truyền thông. Nó là câu trả lời cho câu hỏi nền tảng nhất: **vì sao phòng khám này phải tồn tại?** Nếu câu trả lời ấy mờ nhạt, toàn bộ kiến trúc bên trên sẽ sớm trở nên mong manh. Nếu lý do bắt đầu đủ mạnh, đủ thật và đủ sâu, nó sẽ trở thành chiếc rễ cọc cứng cáp, từ đó các "rễ phụ" như văn hóa, chiến lược, đội ngũ, cơ chế và tăng trưởng mới có chỗ bám để phát triển.`);

b('aaa4a35f-d099-4dc2-94a4-eb7e5fdbd940', `Chính vì vậy, **Radicle** gắn trực tiếp với khái niệm **Sứ mệnh (Mission)**. Sứ mệnh không phải là phần trang trí treo tường, mà là logic tồn tại của doanh nghiệp. Nó xác định doanh nghiệp đang lấy nỗi đau nào của thị trường làm điểm xuất phát, đang giải quyết điều gì có ý nghĩa thật, và đang cam kết tạo ra giá trị gì đủ lớn để được thị trường nuôi sống lâu dài.`);

b('45d18d7b-37d7-4a1a-ab22-52bbce9e6a31', `**Sứ mệnh cộng sinh**`);

b('6ee50e71-fa88-426f-8078-8fe68828d7c0', `Một cái cây không tồn tại tách rời khỏi trời đất. Nó sống được nhờ đất, nước, khí trời; nhưng đồng thời cũng trả lại bóng mát, độ ẩm, sự che chở và dưỡng chất cho hệ sinh thái xung quanh. Tổ chức cũng vận hành theo quy luật cộng sinh tương tự: không có doanh nghiệp nào tồn tại nếu không được nuôi sống bởi thị trường; và cũng không có thị trường nào tiếp tục nuôi một doanh nghiệp nếu doanh nghiệp ấy không còn tạo ra giá trị thật.`);

b('01c7454b-bae3-41bf-8786-a0dda08e1f17', `Trong ngữ cảnh phòng khám, khách hàng chính là "đất trời" nuôi sống tổ chức. Họ là người trao dòng tiền, niềm tin và cơ hội tồn tại cho phòng khám. Nhưng điều họ trả tiền không phải là để nuôi giấc mơ của người sáng lập, càng không phải để duy trì sự hiện diện hình thức của một thương hiệu. Họ chỉ sẵn sàng chi trả khi phòng khám thực sự giúp họ giảm bớt nỗi đau, xoa dịu nỗi sợ và cải thiện chất lượng cuộc sống.`);

b('ef2ad5ea-935c-4ea4-aaa6-6fae1569579d', `Từ đó có thể rút ra một nguyên tắc quản trị rất thực tế: sứ mệnh chỉ có giá trị khi nó gắn với một nỗi đau có thật của thị trường. Những câu chữ hoa mỹ, những tuyên ngôn nghe lớn lao nhưng tách rời thực tiễn thường không đủ sức dẫn dắt tổ chức trong những thời điểm khó khăn. Khi áp lực doanh thu, nhân sự và vận hành đồng loạt xuất hiện, thứ giữ cho tổ chức không lệch hướng không phải là ngôn từ đẹp, mà là một lý do tồn tại đủ thật để mọi người còn muốn tiếp tục tin và đi cùng.`);

b('e8e15a8d-3ad8-4fc3-a983-64fa6a0feb48', `Vì vậy, câu hỏi cốt lõi của **Radicle** không phải là "phòng khám muốn trở thành điều gì", mà là: **nỗi đau cốt lõi nào ngoài thị trường đang nhức nhối đến mức phòng khám này buộc phải xuất hiện để giải quyết?**`);

b('18d3301c-2421-4b24-a4bb-6b9c483962e7', `**Đủ gần, đủ thật**`);

b('1d5d36f3-477d-4c88-8662-b0323cdfb797', `Một sai lầm phổ biến của nhiều tổ chức non trẻ là xây dựng sứ mệnh theo kiểu vĩ cuồng: muốn giải cứu cả thế giới, muốn thay đổi toàn ngành ngay từ ngày đầu, muốn ôm lấy những mục tiêu vượt xa năng lực thực tế của mình. Nhưng trong quy luật tự nhiên, một cái cây chỉ có thể sống tốt trên đúng mảnh đất nơi bộ rễ của nó cắm xuống. Nó không thể đồng thời nuôi sống cả một hệ sinh thái cách nó nửa vòng trái đất.`);

b('437c3048-15e6-4ba2-91ba-d72cf726a947', `Tương tự, một phòng khám chỉ nên bắt đầu từ mảnh đất thật mà mình đang đứng trên đó: địa bàn phục vụ, tệp bệnh nhân cụ thể, loại nỗi đau cụ thể và năng lực chữa lành thực tế mà đội ngũ đang sở hữu. Sứ mệnh không cần phô trương để gây ấn tượng với toàn thế giới. Điều cần thiết hơn là phải trở thành một điểm tựa đủ rõ, đủ khác biệt và đủ đáng tin trong lòng những người thực sự sẵn sàng trao tiền bạc và niềm tin để đổi lấy sự an tâm.`);

b('3242a32e-9784-423f-ab85-e9b3a79e0ba3', `Ở đây, "khác biệt" không đồng nghĩa với lập dị hay phô diễn thương hiệu. Khác biệt ở tầng **Radicle** là sự khác biệt về lý do tồn tại và về lời hứa giá trị. Tổ chức không cần cố gắng trở nên đặc biệt trong mắt tất cả mọi người; tổ chức chỉ cần trở nên không thể thay thế trong tâm trí đúng nhóm khách hàng mà mình cam kết phục vụ.`);

b('207e3ed8-37ea-4399-90f1-45b32b31f671', `**Ví dụ ứng dụng**`);
b('83ef4e4d-0a72-4c91-8a06-ba8b1002f508', `Một ví dụ điển hình cho việc xác lập **Radicle** là lựa chọn theo đuổi hệ giá trị **"Nha khoa Bảo tồn"**. Trong bối cảnh thị trường hiện nay, đây không chỉ là một định vị chuyên môn, mà còn là một tuyên ngôn quản trị.`);

b('25070391-ed63-49aa-a3b7-d19509587678', `**1. Vùng tối thị trường**`);

b('ee6fb870-7756-4c82-b167-7ec0cd70e475', `Thực trạng "nha khoa chộp giật" là hệ quả của việc đặt doanh số ngắn hạn lên trên đạo đức nghề nghiệp và lợi ích sinh học dài hạn của bệnh nhân. Việc lạm dụng chỉ định, đặc biệt trong các dịch vụ thẩm mỹ như mài răng thật để bọc sứ một cách thiếu kiểm soát, không chỉ gây tổn hại mô răng mà còn làm xói mòn lòng tin xã hội đối với ngành nha khoa.`);

b('715026e8-18bb-477c-96aa-03a4373479d0', `Dưới góc độ quản trị, đây không đơn thuần là sai lệch chuyên môn. Nó phản ánh sự thất bại trong việc thiết lập tính chính trực ở tầng gốc của doanh nghiệp. Khi một tổ chức bắt đầu nhìn khách hàng như "mã doanh thu", tổ chức ấy đồng thời tự cắt đứt mối liên kết bền vững với thị trường và tự đẩy mình vào nguy cơ khủng hoảng danh tiếng dài hạn.`);

b('2ec61fe5-7dd1-437b-987b-4778e1a200d6', `**2. Radicle bảo tồn**`);

b('c78496de-f705-4ff5-a8ad-084194812d99', `Trong bối cảnh đó, lựa chọn "Nha khoa Bảo tồn" chính là hành động xác lập **Radicle**. Thay vì chọn con đường doanh thu nhanh, phòng khám xác định rõ vai trò của mình là một lực cản cần thiết trước xu hướng điều trị thiên lệch vì lợi nhuận. Nói cách khác, tổ chức quyết định đứng về phía bảo vệ giá trị sinh học thật của bệnh nhân, ngay cả khi lựa chọn ấy khó hơn, chậm hơn và đòi hỏi nhiều kỷ luật đạo đức hơn.`);

b('8fa70e87-9024-40a8-ac29-de83bcf623f5', `Khi tuyên ngôn "bảo vệ tài sản răng thật của khách hàng" được xác lập, nó trở thành chiếc rễ cọc của toàn hệ thống. Mọi hoạt động chuyên môn, tư vấn, truyền thông và quản trị từ đó không còn là những hành vi rời rạc, mà được quy tụ vào cùng một lời hứa trung tâm. Từ đây, điều trị không chỉ là giao dịch, mà trở thành sự thực thi một cam kết.`);

b('01e6667e-cd5b-4a59-b1e2-5823cebe7a37', `Sâu hơn nữa, lựa chọn này đồng nghĩa với việc doanh nghiệp chấp nhận gắn mình với trách nhiệm trọn đời đối với niềm tin. Mỗi lần kiên nhẫn giữ răng, mỗi lần từ chối một chỉ định dễ sinh tiền nhưng không chính đáng, phòng khám đang tích lũy một loại tài sản vô hình nhưng bền vững hơn mọi chiến dịch quảng cáo: **vốn niềm tin**. Trong các ngành dịch vụ y tế, đây chính là loại tài sản quyết định khả năng sống sót qua biến động thị trường.`);

b('493f728d-cad6-46af-92c7-563bc2af7479', `**3. Giá trị chiến lược**`);
b('e2d01cb6-56d8-4c7c-b1bf-a309e774e5bf', `Việc xác lập sứ mệnh dựa trên nỗi đau cốt lõi không chỉ tạo ra ý nghĩa biểu tượng. Nó còn mang lại những lợi thế quản trị cụ thể.`);

b('b87174d0-22ae-4045-a5fe-4b1682bc2cb1', `- **Định hướng chính sách**: **Nguyên tắc** bảo tồn được đặt ra trước các quyết định kinh doanh, từ đó hình thành một lằn ranh đỏ rõ ràng cho mọi chiến lược doanh thu.
- **Sàng lọc nhân sự**: Một sứ mệnh đủ rõ sẽ thu hút những bác sĩ và cộng sự có cùng hệ giá trị, đồng thời tự động loại trừ những cá nhân mang tư duy trục lợi hoặc thiếu phù hợp văn hóa.
- **Tăng hiệu quả tổ chức dài hạn**: Khi đội ngũ hành động trong một môi trường có chính trực và nhất quán, niềm tin nội bộ và niềm tin khách hàng sẽ cùng tăng. Đây là nền móng của lợi thế cạnh tranh bền vững.`);

b('572d3b4f-c0f7-4da5-bb9f-91051e97cfc5', `Nhìn ở tầng sâu hơn, **Radicle** không chỉ quyết định tổ chức "làm gì", mà còn quyết định tổ chức "không làm gì", dù điều đó có thể đem lại dòng tiền ngắn hạn. Và trong quản trị, chính những giới hạn đạo đức được xác lập rõ ràng ấy mới là thứ định hình bản lĩnh của một thương hiệu.`);

b('8c847020-8a60-4eb1-9c9c-9e3ef3329d61', `**Kết luận**`);

b('21c1a5dd-8391-4872-a8e3-f016aa8d422c', `Chiếc rễ mầm của một phòng khám không chỉ quyết định hướng đi ban đầu; nó quyết định toàn bộ phẩm chất phát triển về sau. Nếu **Radicle** yếu, doanh nghiệp có thể vẫn lớn lên về bề ngang nhưng sẽ rỗng ở bên trong. Nếu **Radicle** đủ sâu, toàn bộ hệ thống sẽ có lực bám để đứng vững trước cạnh tranh, biến động và cám dỗ của tăng trưởng lệch chuẩn.`);

b('b6d521bc-b26f-4be2-a3cd-320dc2cf13cd', `Trong trường hợp của "Nha khoa Bảo tồn", chiếc rễ mầm ấy không chỉ nhằm cứu những chiếc răng thật. Ở bình diện lớn hơn, nó còn là nỗ lực cứu lại niềm tin dành cho một ngành nghề. Khi một phòng khám dám gọi đúng tên nỗi đau của khách hàng và kiên trì giải quyết nó từ gốc, phòng khám ấy không chỉ đang xây một cơ sở kinh doanh. Nó đang đặt viên đá đầu tiên cho một hệ điều hành chính trực và một di sản nghề nghiệp có khả năng đi rất xa.`);

// === Operating Code ===
b('6b114478-fd78-4fc0-bb45-47dcef3ee6a8', `**Mã nguồn vận hành — Đỉnh cao của tự vận hành**`);

b('f1a20556-3c21-4837-b4cf-d2089ef04b57', `Nếu **Radicle** trả lời câu hỏi "vì sao tổ chức phải tồn tại", thì **Operating Code** trả lời câu hỏi "tổ chức sẽ vận hành theo hệ quy chiếu nào để không phản bội lý do tồn tại ấy". Đây là tầng chuẩn hóa phần mềm tư duy của tổ chức. Nó không chỉ tạo ra sự đồng nhất trong hành vi, mà còn tạo ra sự đồng nhất trong cách hiểu, cách tin, cách ra quyết định và cách giữ khí chất vận hành dưới áp lực.`);

b('be4d5236-8d38-4a9b-9f00-36f0ccc8d000', `Ở cấp độ Framework, **Operating Code** được cấu thành bởi **5 trục nền tảng**: **Quy luật — Nguyên lý — Nguyên tắc — Quan niệm — Tâm thái**. Năm trục này đi từ tầng khách quan của thực tại đến tầng chủ quan của nội tâm, từ những điều tổ chức phải hiểu đến những điều tổ chức phải sống. Chúng tạo thành mã nguồn vận hành chung cho toàn bộ hệ thống, bảo đảm rằng từ ghế lâm sàng đến bộ phận gián tiếp, mọi vị trí đều không chỉ làm đúng việc mà còn làm đúng theo cùng một logic.`);

// Quy luật
b('b2b8b103-58b1-4547-bc35-0edfae25463c', `**Quy luật** là những sự thật khách quan đang chi phối tổ chức, bất kể tổ chức có muốn thừa nhận hay không. Đây là tầng giúp doanh nghiệp thoát khỏi ngây thơ vận hành. Khi nắm được quy luật, người lãnh đạo ngừng phản ứng với bề mặt và bắt đầu nhìn thấy căn nguyên.`);

b('98c5aad4-27c0-4c62-820a-c58aaf0ed30c', `**Câu hỏi cốt lõi:**`);
b('9e6ba705-a981-44e4-8b51-e0f447c954aa', `- Tổ chức này đang bị chi phối bởi những quy luật sống còn nào?
- Điều gì luôn đúng trong thực tế vận hành, dù con người có thích hay không?
- Những hệ quả nào sẽ tất yếu xảy ra nếu tổ chức làm sai?`);
b('5bca4cdf-5fbb-4445-9076-926c0d793e91', `Ví dụ:`);
b('f6ded440-425d-477a-9f13-70c0b9cead0c', `- Niềm tin của bệnh nhân tích lũy chậm nhưng có thể sụp đổ rất nhanh.
- Chất lượng chuyên môn sai lệch sẽ để lại hậu quả dài hơn rất nhiều so với lợi ích doanh thu ngắn hạn.
- Trải nghiệm bệnh nhân là kết quả của toàn chuỗi điểm chạm, không phải của riêng một cá nhân.
- Tăng trưởng càng nhanh, các lỗ hổng ở tầng gốc càng dễ bị phơi bày.
- Một tổ chức thiếu chính trực có thể tăng doanh thu ngắn hạn nhưng sẽ hao mòn vốn niềm tin dài hạn.`);
b('0584f86f-1573-47d6-a194-2e2600a4c468', `**Ý nghĩa quản trị:**`);
b('a36de876-ee35-44b3-b7c5-d45dff24c1ae', `Nắm được quy luật giúp tổ chức thôi ảo tưởng rằng mọi thứ có thể được giải quyết bằng nỗ lực đơn lẻ hay ý chí cá nhân. Nó buộc hệ thống phải khiêm tốn trước thực tế và xây dựng mô hình vận hành phù hợp với bản chất của đời sống, thay vì phù hợp với mong muốn chủ quan của người đứng đầu.`);

// Nguyên lý
b('634434bc-a747-4d1d-8350-ddb8375a77c0', `**Nguyên lý** là những chân lý vận hành nền tảng mà tổ chức lựa chọn làm trục ổn định cho mọi quyết định. Nếu quy luật là cái khách quan đang diễn ra, thì nguyên lý là điều tổ chức chủ động chọn để không bị sống theo tình huống.`);
b('31986b40-f23f-4d6e-a089-e8c34d9f76b7', `**Câu hỏi cốt lõi:**`);
b('8c57dc28-316c-4f96-8b04-3d3ac5e00d60', `- Chúng ta lấy điều gì làm nền bất biến khi hoàn cảnh thay đổi?
- Khi đứng trước xung đột lợi ích, đâu là chân lý dẫn đường?
- Điều gì phải luôn đúng trong cách tổ chức này hành động?`);
b('2128a2b4-a7d4-4415-8a3e-47dde7779b23', `Ví dụ:`);
b('a5ca839b-2f33-417b-9eaf-50d16c64d805', `- Luôn bảo vệ lợi ích dài hạn của bệnh nhân trước lợi ích doanh thu ngắn hạn.
- Luôn xử lý từ gốc thay vì chữa cháy trên bề mặt.
- Luôn ưu tiên sự thật chuyên môn hơn sự dễ nghe trong giao tiếp.
- Luôn xem niềm tin là tài sản cốt lõi của tổ chức.
- Luôn hiểu rằng tăng trưởng đúng phải đi cùng trưởng thành nội lực.`);
b('b437c2e5-622b-4d65-b9ce-f373abc908bb', `**Ý nghĩa quản trị:**`);
b('b42d3a57-a9d6-48cd-bbc7-5fd55a12b175', `Nguyên lý tạo ra trục nhất quán cho tổ chức. Khi chưa có nguyên lý, doanh nghiệp thường vận hành theo tâm trạng, áp lực và biến động ngắn hạn. Khi nguyên lý được xác lập rõ, tổ chức bắt đầu có "xương sống nhận thức", nhờ đó không dễ bị cuốn trôi bởi những lựa chọn tiện lợi nhưng lệch chuẩn.`);

// Nguyên tắc
b('70a84f32-1315-4bdd-be49-8f9030aa5107', `**Nguyên tắc** là sự chuyển hóa của nguyên lý thành các quy ước hành động cụ thể. Nếu nguyên lý trả lời "điều gì luôn đúng", thì nguyên tắc trả lời "vì điều đúng ấy, trong thực tế chúng ta sẽ hành xử như thế nào".`);
b('0be11c5a-48bf-471d-9975-f4785d1c7101', `Câu hỏi cốt lõi:`);
b('d7357074-e979-45ad-b3a5-ff1d8f1eb075', `- Trong các tình huống thường gặp, chúng ta sẽ xử lý theo chuẩn nào?
- Điều gì được phép và điều gì không được phép trong vận hành hằng ngày?
- Khi các bộ phận phối hợp với nhau, chuẩn hành xử chung là gì?`);
b('7102f464-1896-4a41-b093-261b1a3892be', `Ví dụ:`);
b('45460b31-0169-43f4-ac6f-004b54b437d6', `- Không chỉ định quá mức để đổi lấy doanh số.
- Không hứa điều chưa chắc chắn về mặt chuyên môn.
- Không để bệnh nhân đi qua nhiều điểm chạm mà nhận các thông điệp mâu thuẫn.
- Không đẩy lỗi hệ thống cho một cá nhân gánh chịu.
- Không ra quyết định lớn khi thiếu dữ liệu và thiếu đối thoại liên chức năng.`);
b('5ece69f4-2adf-4c93-895d-a05f3e44b78e', `**Ý nghĩa quản trị:**`);
b('95076cfa-5c6f-43d6-8f24-4935d2010e8f', `**Nguyên tắc** giúp tổ chức đi từ tầng nhận thức xuống tầng hành vi. Nó giảm sự tùy hứng trong ra quyết định, tạo ra chuẩn chung để các vị trí khác nhau vẫn có thể phối hợp theo cùng một logic. Đây là lớp trung gian quan trọng nối triết lý với thực thi.`);

// Quan niệm
b('e1944569-3436-40c0-8116-58bdbc6492ea', `**Quan niệm** là cách tổ chức hiểu bản chất của công việc, của khách hàng, của đội ngũ, của tăng trưởng và của chính mình. Đây là tầng định hình thế giới quan vận hành. Nhiều tổ chức có quy trình nhưng vẫn rối loạn vì quan niệm nền tảng bị lệch ngay từ đầu.`);
b('e4671bc9-69ff-4e81-8b00-9f76b8c584ae', `Câu hỏi cốt lõi:`);
b('931c6323-7e13-440e-ae4a-5be38b6ff88a', `- Chúng ta thật sự nhìn bệnh nhân là ai?
- Chúng ta hiểu bản chất của tăng trưởng là gì?
- Chúng ta nhìn nhân sự như nguồn lực khai thác hay con người cần được dẫn dắt để trưởng thành?
- Chúng ta hiểu thương hiệu là hình ảnh hay là lời hứa được thực hiện nhất quán?`);
b('540d7a55-73ec-4470-b9a3-596afbe03642', `Ví dụ:`);
b('f3edb9f8-bb17-4540-8d37-43e2bef7dc5f', `- Bệnh nhân không phải "mã doanh thu", mà là người đang mang nỗi đau và trao niềm tin.
- Sai sót không chỉ là lỗi cá nhân, mà còn là dữ liệu để nhìn lại hệ thống.
- Nhân sự không chỉ là người làm việc, mà là chủ thể cùng mang giá trị nghề nghiệp.
- Tăng trưởng không phải là phình to nhanh, mà là lớn lên mà không đánh mất phẩm chất.
- Thương hiệu không nằm ở quảng cáo đẹp, mà nằm ở độ trùng khớp giữa lời hứa và trải nghiệm thật.`);
b('2eaa6478-e7fb-43a6-a6f2-5844ba52aea2', `**Ý nghĩa quản trị:**`);
b('b5800cf0-d607-437d-894e-7e5da5564b00', `**Quan niệm** quyết định chiều sâu văn hóa vận hành. Một quan niệm sai sẽ làm mọi tầng phía dưới bị lệch, kể cả khi quy trình được viết rất chỉnh chu. Bởi suy cho cùng, con người hành động lâu dài theo điều họ thật sự tin, không phải theo những gì chỉ được phát biểu cho đúng.`);

// Tâm thái
b('acce1e4b-9628-4e8a-839b-dc955655b5e4', `**Tâm thái** là trạng thái nội tâm mà tổ chức chủ động nuôi dưỡng khi làm việc, phục vụ và ra quyết định. Đây là tầng khí chất (năng lượng) vận hành. Nếu bốn trục trên giúp tổ chức biết phải nghĩ gì và làm gì, thì tâm thái quyết định tổ chức sẽ hiện diện như thế nào trong từng hành động.`);
b('b4705182-15d8-4210-a86b-fa2d2aa89bb5', `**Câu hỏi cốt lõi:**`);
b('d4a37967-5b91-4776-9077-0e1937c6a049', `- Chúng ta muốn đội ngũ làm việc với trạng thái nội tâm nào?
- Trước áp lực, sai sót, xung đột hay cám dỗ, tổ chức này sẽ giữ tâm thế gì?
- **Khí chất** cốt lõi mà tổ chức muốn bảo tồn là gì?`);
b('0feaa35b-3fb2-48b8-9fa3-fd668b8aedb8', `Ví dụ:`);
b('0befa6bd-2324-477c-8733-8466f2336b0b', `- Bình tĩnh trước áp lực, không phản ứng hoảng loạn theo sự cố.
- Khiêm tốn trước chuyên môn, không tự mãn với kinh nghiệm cũ.
- Chính trực trước cám dỗ doanh thu, không bẻ cong chuẩn mực vì lợi ích ngắn hạn.
- Tận tâm với bệnh nhân, không làm cho xong việc.
- Cầu thị trước sai sót, không đổ lỗi hay phòng thủ bản ngã.
- Kiên nhẫn trong xây dựng niềm tin, không nóng vội đòi kết quả tức thời.`);
b('e9f1724b-165a-4faa-a01f-c528a7d4c2dd', `**Ý nghĩa quản trị:**`);
b('168ee0ff-8159-4a37-8241-f1cec03f9f29', `**Tâm thái** là phần làm nên trạng thái tinh thần của tổ chức. Một hệ thống có thể đúng về quy trình nhưng vẫn thất bại nếu tâm thái vận hành sai lệch: nóng vội, tự mãn, vô cảm hoặc phòng thủ. Vì vậy, muốn tổ chức trưởng thành thật sự, **Operating Code** phải chạm tới phần nội tâm này, thay vì chỉ dừng ở các quy chuẩn kỹ thuật.`);

b('19194172-c7c9-40e4-a21f-515fe1fed60d', `**Ma trận 5 trục**`);
b('f2d4f991-e6f4-4cd2-baa1-c7b8889bd1bb', `**Operating Code** không phải là một bộ nội quy mở rộng. Nó là mã nguồn tư duy của tổ chức. Một hệ điều hành chỉ thật sự trưởng thành khi toàn bộ đội ngũ cùng hiểu quy luật, cùng bám nguyên lý, cùng hành xử theo nguyên tắc, cùng chia sẻ một quan niệm đúng về công việc và cùng nuôi dưỡng một tâm thái xứng đáng với sứ mệnh mà mình đang theo đuổi.`);

// === Outreach ===
b('66eb20ca-df05-4c7f-b95f-c00ef58732b2', `**Biên độ cắm rễ — Tư duy ngược về tầm nhìn (Vision)**`);

b('bfb8bd50-a04b-4d01-87e9-d2e77d2f8c39', `Nếu **Radicle** trả lời câu hỏi tổ chức sinh ra để làm gì, và **Operating Code** xác lập cách tổ chức phải vận hành để trung thành với lý do tồn tại ấy, thì **Outreach** trả lời một câu hỏi khác ở tầng phát triển: tổ chức này muốn vươn xa đến đâu, và từ hôm nay phải mở rộng phần gốc ngầm đến biên độ nào để chống đỡ được tương lai đó.`);

b('6dfd960e-59ff-410b-940d-3c4d660be823', `Trong logic của **R.O.A.D.M.A.P**, **Outreach** chính là cách diễn giải lại khái niệm **Vision** dưới một ngôn ngữ hữu cơ hơn. Tầm nhìn không được hiểu như một bức tranh viễn tưởng đẹp đẽ, càng không phải một con số doanh thu treo trước mắt để kích thích ý chí. Ở cấp độ quản trị trưởng thành, tầm nhìn là sự xác định trước **biên độ phát triển tương lai** và đồng thời là cam kết mở rộng **năng lực chịu tải ở tầng gốc** để tương xứng với biên độ ấy.`);

b('53336a16-585d-4bdd-aa35-0be49ea2ddf5', `Trong quy luật sinh học, không có cái cây nào có thể sở hữu một tán lớn mà lại mang một bộ rễ nhỏ. Tán cây muốn vươn rộng bao nhiêu mét, bộ rễ dưới đất phải lan rộng ít nhất với biên độ tương ứng để giữ cân bằng, hút đủ dưỡng chất và chống chịu được gió bão. Nếu phần trên phát triển quá nhanh so với phần dưới, cây có thể trông rất mạnh trong điều kiện bình thường nhưng sẽ bật gốc ngay khi gặp một cú va đập đủ lớn.`);

b('c6535e8a-f754-467b-8980-e31d8c0a0e8d', `Tổ chức cũng như vậy. Rất nhiều doanh nghiệp thất bại không phải vì thiếu khát vọng mở rộng, mà vì tầm nhìn của họ chỉ phình ra ở phần "tán cây" — doanh thu, chi nhánh, thương hiệu, quy mô — trong khi phần "rễ ngầm" lại không được chuẩn bị tương xứng. Họ muốn tăng trưởng nhanh nhưng chưa chuẩn hóa SOP. Họ muốn giữ bác sĩ giỏi nhưng chưa có khung năng lực và cơ chế đãi ngộ đủ công bằng. Họ muốn điều hành theo dữ liệu nhưng thông tin vẫn nằm rải rác trên giấy tờ, file cá nhân hoặc trí nhớ của từng người.`);

b('dc15ae5f-0969-42d1-8cce-6633e28ad26b', `Chính vì vậy, cần có **Outreach**. Tầng này buộc người lãnh đạo phải nhìn tầm nhìn như một bài toán năng lực chịu tải, không phải như một bài toán mơ ước. Nó chuyển câu hỏi từ "ta muốn lớn đến đâu?" sang "ta phải chuẩn bị phần gốc ngầm đến mức nào để xứng đáng với độ lớn đó?".`);

b('4ea7843b-5f30-409c-ba4e-858d6f2f91be', `**Không phải mơ lớn**`);
b('97879a14-401d-41dd-901c-16a3596c0cad', `Một trong những ngộ nhận phổ biến nhất về Vision là đồng nhất nó với tham vọng. Nhưng tham vọng chỉ là năng lượng kéo tổ chức tiến về phía trước; còn **Outreach** mới là phần đo lường mức độ chuẩn bị để tương lai ấy có thể đứng vững.`);

b('d26994bb-5634-4112-ac81-11fbf4180e38', `Nói cách khác, **Outreach** không hỏi tổ chức muốn sở hữu điều gì, mà hỏi tổ chức phải mở rộng trước những gì ở tầng nền để không bị tương lai nuốt chửng. Vì thế, **Outreach** là một dạng Vision mang tính cấu trúc: nó quy định ngay từ hiện tại biên độ mà hệ thống rễ ngầm phải cắm ra, bao gồm quy trình, năng lực con người, năng lực điều hành, hệ thống dữ liệu, công nghệ quản trị, cấu trúc phối hợp và khả năng chuẩn hóa tri thức.`);

b('e88335c3-6356-4118-b503-48f00d3b425f', `Ở đây, tầm nhìn không còn là một khẩu hiệu đầy cảm hứng. Nó trở thành một cam kết rất cụ thể: nếu 3 đến 5 năm tới tổ chức muốn có một "tán cây" lớn hơn, thì ngay hôm nay phải mở rộng phần gốc đến đúng biên độ tương xứng. Không có ngoại lệ cho quy luật này.`);

b('a0ddd40b-a25f-462c-8a69-e9f26373a53b', `Ở cấp độ ứng dụng, **Outreach** không đo bằng cảm xúc mà đo bằng năng lực nền cần phải hình thành trước khi tổ chức bước vào một quy mô mới. Thông thường, biên độ cắm rễ của một phòng khám hoặc chuỗi nha khoa sẽ phải được nhìn qua ít nhất năm lớp chuẩn bị.`);

b('d8b79d24-51b4-4775-98b4-721725960518', `**1. Biên độ quy trình**`);
b('c14eb028-c094-4fd5-a7fe-1dd308f661eb', `Tổ chức phải xác định mức độ chuẩn hóa vận hành cần đạt để chịu được quy mô tương lai. Điều này bao gồm SOP lâm sàng, SOP tư vấn, SOP chăm sóc khách hàng, SOP giao ban, SOP xử lý sự cố và SOP kiểm soát chất lượng. Nếu quy trình chưa được đóng gói, tổ chức càng mở rộng càng tăng độ lệch.`);

b('dc81fe1f-13cc-416a-95a2-4f5e852c9a51', `**2. Biên độ năng lực con người**`);
b('9e70b1d6-b6f7-4072-a206-6271c062d88c', `Tầm nhìn mở rộng chỉ có ý nghĩa khi đội ngũ đủ sức gánh nó. **Outreach** ở tầng này đòi hỏi phải làm rõ khung năng lực cho từng vị trí, cơ chế đánh giá, lộ trình phát triển nghề nghiệp và hệ thống đãi ngộ đủ tốt để thu hút và giữ chân đúng người. Một tầm nhìn lớn không thể đứng trên một đội ngũ mơ hồ về vai trò và bất an về tương lai.`);

b('c732e22b-7d15-4783-aafb-7c7eec2d87cb', `**3. Biên độ dữ liệu và công nghệ quản trị**`);
b('9e2e3f49-3870-47f5-9d72-a2981d033126', `Khi quy mô tăng lên, trí nhớ cá nhân và quản lý cảm tính sẽ nhanh chóng sụp đổ. Vì vậy, **Outreach** phải bao gồm cả việc số hóa dữ liệu, chuẩn hóa dashboard, xây dựng cơ chế theo dõi **KPI**, đồng bộ luồng thông tin liên phòng ban và hình thành hạ tầng quản trị dựa trên dữ liệu. Không có dữ liệu chuẩn, tăng trưởng sẽ sớm biến thành hỗn loạn có quy mô lớn hơn.`);

b('3d0eacbf-e344-4db3-915b-d95a59486018', `**4. Biên độ phối hợp hệ thống**`);
b('ed236b41-0eb0-4b8e-b673-815d933643da', `Một phòng khám nhỏ có thể vận hành dựa nhiều vào cá nhân chủ chốt, nhưng một hệ thống muốn mở rộng bắt buộc phải học cách vận hành theo cấu trúc. **Outreach** vì thế phải đo cả khả năng phối hợp giữa các bộ phận, khả năng phân quyền, chất lượng bàn giao, năng lực quản lý trung gian và mức độ phụ thuộc vào founder. Nếu tán cây lớn dần mà bộ rễ vẫn chỉ hút dinh dưỡng qua một điểm, sụp đổ là điều tất yếu.`);

b('8a4bcab0-dcb2-45d9-a444-abd72a66ee92', `**5. Biên độ văn hóa và bản sắc**`);
b('d9778722-2a2a-46b6-ac83-0408d8d73953', `Mở rộng không chỉ là nhân bản cơ sở vật chất, mà còn là nhân bản bản sắc. Nếu phòng khám muốn đi xa, **Outreach** phải bao gồm việc đóng gói được văn hóa phục vụ, triết lý chuyên môn và chuẩn hành xử cốt lõi để khi tổ chức mở thêm người, thêm điểm chạm hay thêm chi nhánh, phần hồn ban đầu không bị pha loãng.`);

b('9be35298-8af0-4bc6-96e9-30786fd17919', `**Ví dụ ứng dụng**`);
b('3c354af2-7e8a-4076-b728-62b755756307', `Giả sử mục tiêu 3 năm tới của một phòng khám là mở rộng quy mô vận hành, gia tăng năng lực phục vụ và sẵn sàng bước sang mô hình đa cơ sở. Nếu chỉ diễn đạt tầm nhìn theo kiểu "trở thành chuỗi nha khoa hàng đầu" hoặc "đạt mức doanh thu X", đó mới chỉ là phần tán cây được tưởng tượng ra ở phía trên.`);

b('b7238ade-79f0-4db5-a179-fadd91b574a2', `Câu hỏi của **Outreach** sẽ khác. Nó buộc tổ chức phải trả lời: để chống đỡ được quy mô ấy, phần rễ ngầm phải được cắm rộng đến đâu ngay từ bây giờ?`);

b('227a1c7b-2573-43ae-a436-597c15d6dbbe', `Trong trường hợp này, **Outreach** của giai đoạn 3 năm có thể được cụ thể hóa thành ba nhiệm vụ nền tảng:`);

b('3703a589-38bd-475d-8859-47260400722a', `- **Đóng gói hoàn chỉnh 100% hệ thống SOP lâm sàng và vận hành cốt lõi**, để tri thức không còn phụ thuộc vào cá nhân và có thể nhân rộng mà không làm lệch chuẩn.
- **Hoàn thiện khung năng lực và cơ chế đãi ngộ tự động hóa**, ví dụ một file Excel hoặc hệ thống quản trị đủ thông minh để đánh giá năng lực, tính lương và giữ chân bác sĩ giỏi một cách minh bạch, công bằng.
- **Chuyển đổi số toàn bộ dữ liệu quản trị**, từ dữ liệu bệnh nhân, vận hành, tài chính đến dữ liệu nhân sự, để việc ra quyết định không còn dựa trên cảm giác hay sự chắp vá thủ công.`);

b('ff0fba27-1bde-4426-be9f-93a949d758f7', `Nhìn theo logic này, **Outreach** không phải là mục tiêu "mở rộng phòng khám", mà là **biên độ chuẩn bị của bộ rễ** để việc mở rộng ấy không làm bật gốc hệ thống khi gặp áp lực thị trường, sai lệch vận hành hoặc biến động nhân sự.`);

b('ec06191c-0919-498f-9e08-7f4610e83de7', `Ở tầng chiến lược, **Outreach** mang lại ít nhất bốn giá trị rất quan trọng.`);
b('dc0fd8bb-0612-4ce2-9887-642df3a9c4e4', `- **Biến tầm nhìn thành năng lực chuẩn bị**: giúp tổ chức ngừng mơ theo cảm hứng và bắt đầu xây nền theo logic chịu tải.
- **Ngăn tăng trưởng vượt quá sức chứa**: tránh tình trạng phần trên phình to quá nhanh trong khi phần dưới chưa đủ sức chống đỡ.
- **Định hướng đầu tư đúng chỗ**: thay vì chỉ đầu tư vào mặt tiền tăng trưởng, tổ chức biết phải ưu tiên nguồn lực cho SOP, con người, dữ liệu và cấu trúc quản trị.
- **Giảm rủi ro bật gốc khi gặp biến động**: một hệ thống rễ đủ rộng sẽ hấp thụ sốc tốt hơn khi đối diện với khủng hoảng nhân sự, lỗi chuyên môn, áp lực dòng tiền hoặc biến động thị trường.`);

b('929f9c31-7649-4f8e-a6b8-6e92c286deec', `Nói ngắn gọn, **Outreach** là tầng khiến Vision trở nên có trách nhiệm. Nó nhắc người lãnh đạo rằng quyền được mơ lớn luôn đi kèm nghĩa vụ phải cắm rễ sâu hơn.`);

b('dd989c2d-a6e7-412a-a1a9-3030e48a8bf7', `**Outreach** là biên độ cắm rễ của tầm nhìn. Nó buộc tổ chức phải hiểu rằng tương lai không được chống đỡ bằng ý chí, mà bằng năng lực nền được chuẩn bị từ sớm. Muốn có một tán cây lớn hơn trong 3 đến 5 năm tới, phòng khám phải mở rộng trước phần rễ ngầm của mình: quy trình, con người, dữ liệu, công nghệ quản trị, cấu trúc phối hợp và bản sắc vận hành.`);

// === Tenacity ===
b('c2682584-437f-44ba-b115-751200e6e7f6', `**Khí chất và giá trị cốt lõi — Sức mạnh vô hình không thể khuất phục**`);

b('4b620ebf-1c78-4af6-972a-a540e5b714bd', `Nếu **Radicle** trả lời câu hỏi tổ chức sinh ra để làm gì, **Operating Code** xác lập hệ quy chiếu vận hành, và **Outreach** mở ra biên độ phát triển của tương lai, thì **Tenacity** đi thẳng vào một tầng khác: tổ chức này muốn được cấu thành bởi những con người mang khí chất gì.`);

b('b0d211da-b6be-4b5c-b17f-fbcde4b1dbf2', `Đây là tầng nói về **tính cách cốt lõi của con người trong hệ thống**. Không phải kỹ năng, không phải vai trò, cũng không phải hiệu suất trước mắt, mà là phẩm chất nội tại quyết định cách mỗi cá nhân phản ứng trước áp lực, chướng ngại, sự thật khó nghe, sai sót nghề nghiệp và trách nhiệm với người khác. Khi những phẩm chất ấy được lặp đi lặp lại trong đủ nhiều con người, chúng không còn là tính cách cá nhân nữa; chúng tạo thành **cá tính của tổ chức**.`);

b('264fe2e9-8809-4ba8-8573-84c9c4d08dc8', `Vì vậy, **Tenacity** đồng thời là hai thứ: **Core Characters** và **Core Values**. Nó vừa là khí chất mà từng cá nhân phải có để được xem là phù hợp với đội ngũ; vừa là bộ giá trị cốt lõi mà tổ chức theo đuổi, được diễn đạt bằng những từ đơn giản nhưng phải được định nghĩa rõ ràng để mọi người cùng hiểu giống nhau, sống giống nhau và đo mình theo cùng một chuẩn.`);

b('07acc838-7118-4f67-b2cb-b2db4d59dbc7', `Trong tự nhiên, khi rễ cây đâm xuống lòng đất và gặp đá tảng, nó không quay đầu và cũng không tự gãy nát. Nó tìm đường khác, luồn qua khe nhỏ, bám vào từng khoảng hở, mài dần vật cản để tiếp tục đi xuống. Sức mạnh ấy không ồn ào, nhưng bền bỉ. Nó không hung hăng, nhưng không bỏ cuộc. Đó chính là hình ảnh gần nhất để nói về **Tenacity**: sự lì lợm có kỷ luật, sự dẻo dai có định hướng và khả năng giữ vững đường đi dù thực tại không thuận lợi.`);

b('d8e430eb-1423-4abd-a7e7-9b5642c0f522', `Trong môi trường phòng khám, khí chất này có ý nghĩa đặc biệt. Bởi tổ chức không chỉ đối diện với lịch hẹn, doanh thu hay chỉ số vận hành. Tổ chức còn đối diện với những thứ khó hơn nhiều: sai sót lâm sàng, bệnh nhân mất niềm tin, khiếu nại căng thẳng, áp lực phối hợp nội bộ, mâu thuẫn giữa đúng chuyên môn và dễ kiếm tiền, mệt mỏi cảm xúc và sức ép giữ chuẩn trong lúc thị trường ngày càng xô lệch. Những lúc như vậy, kỹ năng chỉ giải quyết được một phần. Phần còn lại phụ thuộc vào khí chất.`);

b('eb15db08-06ab-47fb-bd60-0772daa4e46d', `**Tenacity** vì thế là tầng giúp tổ chức trả lời câu hỏi: khi gặp sức ép, đội ngũ này sẽ **co rúm lại**, **lấp liếm đi**, **đổ lỗi cho nhau**, hay sẽ **nhìn thẳng vào sự thật và đi tiếp bằng bản lĩnh**?`);

b('affa7d79-ebed-4801-8b29-369956ef6bec', `**Tenacity** không nên bị hiểu hẹp như "cố gắng đến cùng" hay "chịu khó làm việc". Trong bối cảnh xây tổ chức, **Tenacity** là một cấu trúc khí chất gồm nhiều phẩm chất đi cùng nhau.`);
b('15533cf6-2ed5-48cd-b40a-f4dbffe70834', `Nó bao gồm:`);

b('4579836e-b211-4513-b5dc-11bda152afbd', `- **Lì lợm trước khó khăn** nhưng không cố chấp mù quáng.
- **Dẻo dai trước áp lực** nhưng không đánh mất chuẩn mực.
- **Thẳng thắn trước sự thật** nhưng không thô ráp hay làm tổn thương người khác.
- **Dám nhận trách nhiệm** nhưng không tự vệ bằng đổ lỗi.
- **Kiên định với điều đúng** dù phải trả giá ngắn hạn.`);

b('5a8d8c7f-ef8d-4ddb-9c5f-9200563288e1', `Ở tầng này, tổ chức bắt đầu định nghĩa rất rõ: người như thế nào thì phù hợp để đi cùng, và người như thế nào dù giỏi đến đâu cũng không thể trở thành một phần bền vững của hệ thống.`);

b('52143165-dcf9-445b-8726-bad1226e2722', `Không có tổ chức nào có cá tính riêng nếu đội ngũ bên trong là tập hợp rời rạc của những con người mang khí chất đối nghịch nhau. Một phòng khám muốn có bản sắc rõ không thể tuyển một bác sĩ trung thực, một lễ tân lấp liếm, một quản lý né trách nhiệm, một tư vấn viên chỉ giỏi ép chốt và một founder lại luôn nói về chính trực. Trong trường hợp đó, thương hiệu chỉ còn là lớp sơn bên ngoài; bên trong không có cá tính thật.`);

b('922758bd-23b5-4866-a48f-4ea315d5245c', `**Tenacity** là tầng tạo ra sự thống nhất về khí chất. Nó làm rõ rằng cá tính của tổ chức không được dựng nên bằng khẩu hiệu thương hiệu, mà bằng những phẩm chất được lặp lại trong hành vi hằng ngày của đội ngũ. Nếu đủ nhiều người trong cùng một hệ thống đều nói thật, đứng thẳng trước sai sót, không thao túng bệnh nhân, không bỏ cuộc trước áp lực và vẫn giữ được chuẩn nghề nghiệp khi thị trường xô lệch, thì chính những phẩm chất ấy sẽ trở thành "thương hiệu sống" của phòng khám.`);

b('84997477-da19-4881-b6ea-519d607c6d16', `Nói cách khác, **Tenacity** là phần biến giá trị cốt lõi từ chữ viết thành khí chất nhận diện được.`);

b('ea2a39b7-2f6f-44a6-864f-77864dd0c8fa', `Một lỗi phổ biến khi xây **Core Values** là dùng những từ rất đẹp như "chính trực", "tận tâm", "chuyên nghiệp", "trách nhiệm", nhưng không định nghĩa cụ thể. Kết quả là ai cũng tưởng mình hiểu, nhưng mỗi người lại sống theo một nghĩa khác nhau. Khi đó, giá trị cốt lõi chỉ còn là lớp ngôn ngữ trang trí, không đủ sức làm chuẩn cho tuyển dụng, đánh giá hay ra quyết định.`);

b('04996bd0-0eb1-42e1-90de-c0425a3d1f7e', `Vì vậy, ở tầng **Tenacity**, các giá trị cốt lõi nên được diễn đạt bằng **những từ ngắn, dễ nhớ, đời thường**, nhưng nhất định phải được gắn với một định nghĩa vận hành rõ ràng.`);

b('37b44c55-ce5f-4b1a-8e73-1107fb8ff872', `Ví dụ, một bộ **Tenacity** có thể gồm những từ như:`);

b('e0db8394-6a02-4b04-9bc7-5961988ac620', `- **Thẳng**: nói đúng sự thật, không vòng vo để lấy lòng, không bóp méo thông tin để chốt sale.
- **Lì**: gặp áp lực không bỏ cuộc, gặp sự cố không né tránh, gặp phản hồi khó không co rúm lại.
- **Sạch**: không kiếm tiền bằng cách bẻ cong y đức, không lấp liếm sai sót, không làm điều khuất tất sau lưng bệnh nhân.
- **Chắc**: làm gì cũng có căn cứ, có kiểm chứng, có trách nhiệm và có độ tin cậy.
- **Tử tế**: giao tiếp bằng sự tôn trọng, nhìn bệnh nhân như con người chứ không như hợp đồng doanh thu.`);

b('e9e7a545-e419-43f1-8857-ac235f76144a', `Khi các giá trị được viết như vậy, tổ chức mới có thể dùng chúng như tiêu chuẩn thật cho tuyển người, huấn luyện, phản hồi, đánh giá và giữ chuẩn văn hóa.`);

b('4e6b5c8d-5f99-4045-97db-fd5bd12a800e', `**1. Khí chất chuyên gia thẳng thắn**`);

b('274860a8-1866-40bd-a3c3-6d4eb8c80e4e', `Một phòng khám có **Tenacity** không giao tiếp với thị trường bằng giọng điệu thảo mai hoặc kỹ thuật thao túng cảm xúc. Họ cũng không dùng sự sợ hãi của bệnh nhân làm công cụ ép chốt sale. Thay vào đó, họ chọn cách nói thật, nói rõ và nói sao cho người nghe hiểu được bản chất vấn đề mà không bị dọa nạt.`);

b('404177b9-4b0e-43fb-9836-8c183459b9df', `Điều này đòi hỏi đội ngũ phải có khí chất của một **chuyên gia thẳng thắn**. Nghĩa là không lấy thuật ngữ làm quyền lực, không lấy mơ hồ làm công cụ, và không lấy sự hoảng sợ của bệnh nhân để thúc đẩy quyết định tài chính. Người làm nghề phải biết "dịch" ngôn ngữ chuyên môn sang ngôn ngữ đời thường để bệnh nhân hiểu và lựa chọn trong trạng thái sáng suốt.`);

b('d0b6c1ef-bbe2-412c-b6c4-3614f1daca04', `*Ví dụ*, thay vì nói "tiêu xương ổ răng do viêm nha chu trầm trọng", bác sĩ hoặc tư vấn viên có thể nói: "Phần đất giữ chân răng đang bị lở, mình cần xử lý sạch và gia cố lại để răng không bị lung lay thêm." Đó không phải là cách nói kém chuyên môn; ngược lại, đó là biểu hiện của chuyên môn đủ sâu để nói cho người khác hiểu mà không làm họ thấy mình bị áp đảo.`);

b('1ddcac1a-770b-4793-8c76-92206932bcfc', `**2. Khí chất lì lợm trước sự cố**`);

b('e544dfea-5dcc-4bdd-9a5e-5d0dc14a3ce4', `Biểu hiện thứ hai của **Tenacity** nằm ở cách tổ chức phản ứng khi mọi thứ không đi đúng kế hoạch. Một hệ thống yếu khí chất sẽ có xu hướng giấu sai, né trách nhiệm, lấp liếm với khách hàng và đẩy lỗi xuống mắt xích thấp nhất như phụ tá, lễ tân hoặc bộ phận chăm sóc khách hàng. Một hệ thống có **Tenacity** thì ngược lại: nhìn thẳng vào sự thật, giữ bình tĩnh, xác định trách nhiệm và xử lý theo đúng giao thức đạo đức nghề nghiệp.`);

b('26ac4671-bf44-4250-b095-7c5404192446', `Trong môi trường lâm sàng, điều này đặc biệt quan trọng. Khi xảy ra sai sót chuyên môn hoặc khách hàng khiếu nại, đội ngũ không được phép phản xạ bằng tự vệ bản ngã. Bác sĩ phải đủ bản lĩnh để đứng ra nhận trách nhiệm trong phạm vi chuyên môn của mình. Quản lý phải đủ vững để bảo vệ sự thật thay vì bảo vệ hình ảnh giả tạo. Tổ chức phải đủ sạch để đặt lợi ích bệnh nhân và sự chính trực lên trên tâm lý giữ thể diện.`);

b('70151324-7e1b-4320-ae7f-2b6883b761a7', `**Tenacity** ở đây không phải là lì để chống chế. Nó là lì để đứng vững trong sự thật, không trốn chạy khỏi hậu quả do chính mình tạo ra.`);

b('961c6953-3f11-473f-9382-8d002d424fd4', `Ở tầng quản trị, **Tenacity** mang lại ít nhất bốn giá trị lớn.`);

b('163a74d4-0125-4600-b23b-48b86db981db', `- **Làm rõ tiêu chuẩn con người phù hợp**: tổ chức không chỉ tuyển người có kỹ năng, mà tuyển người có khí chất phù hợp với đường dài.
- **Tạo bản sắc đội ngũ**: khi các phẩm chất cốt lõi được lặp lại đủ nhiều, chúng trở thành cá tính thật của tổ chức.
- **Tăng sức chống chịu văn hóa**: đội ngũ ít bị tan rã khi gặp khủng hoảng, vì họ có cùng một chuẩn phản ứng trước áp lực.
- **Bảo vệ thương hiệu từ bên trong**: thương hiệu không còn phụ thuộc hoàn toàn vào truyền thông, mà được chống đỡ bởi khí chất thật của con người bên trong hệ thống.`);

b('79dd3bec-9367-4f2c-b187-8c8b0803146f', `Nói cách khác, **Tenacity** là tầng giúp tổ chức trả lời câu hỏi: **chúng ta không chỉ làm điều gì, mà chúng ta là kiểu người như thế nào khi làm điều đó?**`);

b('3f7c9c4f-3f3c-4918-8ac0-4fe74647a8c1', `**Tenacity** là phần định hình Core Characters và **Core Values** của tổ chức. Nó không nói về kỹ thuật, mà nói về khí chất và giá trị. Nó xác định những phẩm chất mà một cá nhân phải có nếu muốn thực sự trở thành thành viên của hệ thống, đồng thời tạo nên cá tính riêng mà tổ chức mang ra đối diện với thị trường, với khủng hoảng và với chính những thử thách bên trong mình.`);

// === Standardized Statement ===
b('6d69e4e6-0fb0-40ea-ab21-663082fbcfb5', `**Tuyên ngôn tiêu chuẩn của tổ chức — Lời nói hiệu triệu lòng người**`);

b('4a054b7c-0d4a-48f5-82a6-54fb595a15aa', `Nếu **Radicle** là lý do khai sinh, **Operating Code** là mã nguồn vận hành, **Outreach** là biên độ cắm rễ cho tương lai, và **Tenacity** là khí chất cốt lõi của con người trong hệ thống, thì **Standardized Statement** là điểm hội tụ nơi toàn bộ những yếu tố ấy được nén lại thành một tuyên ngôn danh tính ngắn gọn, rõ ràng và không thể dịch chuyển.`);

b('b32d4aa4-8afb-4a13-9f70-66c6cd1c2789', `Đây không phải là một câu Slogan quảng cáo, càng không phải một đoạn ngôn ngữ trang trí cho đẹp thương hiệu. Ở cấp độ quản trị, **Standardized Statement** là **tuyên ngôn chuẩn hóa danh tính tổ chức**. Nó là phần kết tinh cô đọng nhất của toàn bộ lớp rễ nền: lý do tồn tại, cách vận hành, biên độ phát triển và khí chất con người. Khi bốn yếu tố ấy được phối trộn đủ chặt, chúng tạo ra một "vết hằn" trong lòng đất, một chuẩn nhận diện mà tổ chức có thể lặp đi lặp lại mà không lệch, nói đi nói lại mà không mệt mỏi, dùng đi dùng lại mà không sai trong mọi điểm chạm.`);

b('63eb6359-c899-412a-a82f-bafcc7066ab3', `Một tổ chức có thể có sứ mệnh đúng, mã vận hành rõ, tầm nhìn đủ sâu và khí chất đội ngũ tốt, nhưng nếu không cô đọng được tất cả thành một tuyên ngôn danh tính thống nhất, thì các tầng ý tưởng ấy vẫn rất dễ bị phân mảnh trong thực tế. Người sáng lập hiểu một kiểu, quản lý diễn giải một kiểu, nhân sự mới nhớ một kiểu, đội marketing viết một kiểu, còn bộ phận vận hành lại sống theo một kiểu khác. Khi đó, tổ chức có nền nhưng không có câu nói chung để khóa nền đó lại thành bản sắc nhất quán.`);

b('8f165717-0a59-4065-a79f-91f62fbdafc8', `**Standardized Statement** được tạo ra để giải quyết chính điểm đứt gãy này. Nó là một **câu nói chuẩn**, đủ ngắn để ghi nhớ, đủ rõ để lặp lại, đủ sâu để đại diện và đủ chuẩn để trở thành "khuôn nhận diện" cho toàn bộ hệ thống. Mục tiêu của tầng này không phải là gây ấn tượng, mà là tạo ra **sự đồng thanh trong bản sắc**.`);

b('ed4e2c12-f086-4fe5-b5ae-8efce076570a', `Trong hệ điều hành tổ chức, **Standardized Statement** có ít nhất bốn vai trò nền tảng.`);

b('87fe7322-7ccb-4f61-b8f4-9101ba7a6929', `- **Khóa lại danh tính tổ chức**: giúp toàn bộ đội ngũ luôn quay về cùng một định nghĩa cốt lõi về mình.
- **Chuẩn hóa thông điệp onboarding**: nhân sự mới ngay từ ngày đầu đã biết mình đang bước vào một hệ thống như thế nào.
- **Làm chuẩn cho tài liệu nội bộ**: có thể đặt ở trang đầu sổ tay nhân viên, handbook đào tạo, tài liệu văn hóa và các module định hướng.
- **Làm kim chỉ nam cho truyền thông đối ngoại**: mọi nội dung trên website, TikTok, Facebook hoặc các điểm chạm thương hiệu khác đều phải phản ánh cùng một tuyên ngôn gốc.`);

b('adadb72d-d39f-417b-ac18-ed8883daef89', `Điều này đặc biệt quan trọng với các phòng khám hoặc chuỗi nha khoa đang muốn xây thương hiệu bền vững. Bởi thương hiệu không chỉ được tạo bởi hình ảnh, màu sắc hay nội dung truyền thông. Thương hiệu được tạo bởi sự lặp lại nhất quán của cùng một bản sắc qua đủ nhiều điểm chạm. Nếu không có một tuyên ngôn tiêu chuẩn làm trục, mỗi điểm chạm sẽ nói một thứ khác nhau, và thương hiệu sẽ bị loãng từ bên trong.`);

b('c97edeec-f3a9-415d-9d99-841625f148aa', `Một **Standardized Statement** đúng nghĩa không nên dài dòng, cũng không nên tham nhồi nhét tất cả vào một câu. Nó phải ngắn đến mức người mới có thể nhớ sau vài lần đọc, nhưng đủ chặt để nói lên bốn thành phần cốt lõi đã được xây ở các tầng trước.`);

b('ecac4af4-ec18-40a8-8be0-218f49d4916d', `Về nguyên tắc, một tuyên ngôn tiêu chuẩn tốt nên phản ánh được:`);
b('a8fc9b60-7895-4d0d-a4c8-81e1e9c774fb', `- **Chúng ta là ai?** → danh tính tổ chức.
- **Chúng ta vận hành bằng điều gì?** → logic và tiêu chuẩn hành động.
- **Chúng ta ở đây để làm gì?** → nỗi đau hoặc giá trị cốt lõi mà tổ chức giải quyết.
- **Chúng ta mang khí chất nào?** → phẩm chất tinh thần và đạo đức của đội ngũ.`);

b('e54584bc-388e-49c8-853b-eba7d1591ac5', `Khi một câu tuyên ngôn trả lời được bốn lớp này trong một cấu trúc ngắn gọn, nó sẽ có giá trị như một "mã lệnh ngôn ngữ". Chỉ cần lặp lại đúng câu đó, toàn hệ thống sẽ được kéo về cùng một tâm thế và cùng một chuẩn danh tính.`);

b('8c601221-9560-47bd-bd01-4aa4ecc5a0e3', `Ví dụ`);
b('25b98753-62ea-4df9-a9ae-402a002b42cb', `Dựa trên logic đã xây từ các tầng trước, tuyên ngôn tiêu chuẩn có thể được xác lập như sau:`);

b('110eb574-c27d-42ca-b025-852f784e717f', `**"Chúng tôi là hệ thống nha khoa vận hành bằng tiêu chuẩn hóa và minh bạch. Chúng tôi ở đây để bình dân hóa kiến thức y khoa, giải quyết tận gốc nỗi sợ răng miệng của khách hàng và đồng hành cùng họ bằng khí chất chính trực của người thầy thuốc."**`);

b('f64018d5-6ad3-4055-8ca4-12aad5e8af56', `Câu tuyên ngôn này có cấu trúc tương đối đầy đủ.`);

b('828ee80b-ca04-4dc1-8eee-6f04acd9a1bc', `- Vế thứ nhất xác lập **danh tính vận hành**: đây là một hệ thống nha khoa, không phải một mô hình tự phát; và hệ thống ấy vận hành bằng tiêu chuẩn hóa cùng tính minh bạch của mã lệnh quản trị.
- Vế thứ hai xác lập **mục đích phục vụ**: bình dân hóa kiến thức y khoa và giải quyết tận gốc nỗi sợ răng miệng — tức không chỉ điều trị bệnh, mà còn chữa cả sự thiếu hiểu biết và sự bất an vốn khiến bệnh nhân trì hoãn chăm sóc.
- Phần cuối xác lập **khí chất tổ chức**: không chỉ đồng hành, mà đồng hành bằng khí chất chính trực của người thầy thuốc. Đây là lớp khóa lại phần **Tenacity** và đạo đức hành nghề.`);

b('caf03343-315f-44ad-ab62-98a27363e2f8', `Với độ dài khoảng mười giây khi đọc thành tiếng, câu này đủ ngắn để sử dụng trong môi trường đào tạo và đủ chuẩn để lặp lại trên các nền tảng truyền thông.`);

b('b6a275ff-1795-4178-9d49-ec960b604195', `**Standardized Statement** chỉ có giá trị khi được dùng như một chuẩn sống, chứ không phải một câu để treo cho đẹp. Vì vậy, tầng này cần được ứng dụng nhất quán ở ít nhất ba điểm.`);

b('2e8a74c3-9722-43ab-8999-aa4c16838fe2', `- **Trong onboarding nhân sự mới**`);
b('d0579e15-9940-45ee-968a-c3ccacd01103', `Ngày đầu tiên của nhân sự mới không nên bắt đầu bằng checklist thủ tục, mà nên bắt đầu bằng định vị: "anh/chị đang bước vào một hệ thống như thế nào?". **Standardized Statement** chính là câu mở đầu cho định vị đó. Nó giúp nhân sự mới hiểu rất nhanh rằng đây không chỉ là nơi làm việc, mà là một môi trường có danh tính rõ, có chuẩn vận hành rõ và có khí chất nghề nghiệp rõ.`);

b('eea36873-c4a7-44b2-93cf-47d797541379', `- **Trong sổ tay và tài liệu nội bộ**`);
b('4b6963be-0999-47e4-88ae-6b3d491fc240', `Tuyên ngôn tiêu chuẩn nên được đặt ở những vị trí mở đầu: trang đầu sổ tay nhân viên, handbook văn hóa, tài liệu orientation, module đào tạo quản lý và cả các tài liệu nền tảng của hệ điều hành. Khi được lặp lại đúng chỗ, câu tuyên ngôn này sẽ làm nhiệm vụ như một "chốt danh tính", giúp mọi người không quên mình đang thuộc về hệ nào.`);

b('526c3c58-e45a-45ef-842e-ede96ea5c4f5', `- **Trong truyền thông đối ngoại**`);
b('6589d5ce-a505-47b7-b956-e7499614cecc', `Mọi nội dung truyền thông trên website, TikTok, Facebook, YouTube hay các tài sản thương hiệu khác đều nên được kiểm tra ngược lại bằng **Standardized Statement**. Nếu nội dung nào khiến thương hiệu trở nên mập mờ, giật gân, thiếu minh bạch hoặc mất khí chất chính trực, nội dung đó đang đi lệch khỏi tuyên ngôn tiêu chuẩn. Khi dùng đúng, câu tuyên ngôn này sẽ giúp toàn bộ hoạt động truyền thông giữ được cùng một giọng nói gốc.`);

b('5bcf04eb-866f-456a-a169-d09308ebdb67', `**Mantra hành động**`);

b('1e1ec408-41ee-4819-ba79-694eebea48d4', `Nếu **Standardized Statement** là tuyên ngôn danh tính, thì **Mantra** là khẩu quyết tinh thần. Nó không thay thế tuyên ngôn, mà làm nhiệm vụ ngắn hơn, giàu nhịp hơn và dễ gọi dậy năng lượng hành động trong đội ngũ.`);

b('d07a0981-fd23-458a-b365-c5d9ba77a028', `**Standardized Statement** là tầng nén toàn bộ phần hồn của Layer 1 thành một câu danh tính có thể lặp lại, dùng được và sống được. Nó giúp hệ thống không chỉ có nền triết lý, mà còn có một biểu thức ngôn ngữ chuẩn để truyền thừa bản sắc cho nhân sự mới, khóa chuẩn cho tài liệu nội bộ và giữ trục nhất quán cho mọi hoạt động truyền thông.`);

b('65a71c43-60b7-42d5-b0c5-e44f5a702680', `Nếu **Radicle** là rễ cọc, **Operating Code** là mã vận hành, **Outreach** là biên độ cắm rễ cho tương lai, và **Tenacity** là khí chất của đội ngũ, thì **Standardized Statement** chính là câu nói đóng dấu toàn bộ danh tính ấy. Nhờ đó, tổ chức không chỉ biết mình là ai trong tư duy, mà còn có thể nói rõ mình là ai bằng một ngôn ngữ ngắn gọn, chính xác và không thể bị pha loãng.`);

console.log(`Phase 2: ${blocks.length} blocks to update`);

const BATCH = 10;
for (let i = 0; i < blocks.length; i += BATCH) {
  const batch = blocks.slice(i, i + BATCH);
  const sqls = batch.map(u => `UPDATE "block" SET "text_md" = '${u.text}' WHERE "id" = '${u.id}';`);
  const multi = sqls.join('\n');
  const tmpFile = join(tmpdir(), `c3p2_${Date.now()}.sql`);
  writeFileSync(tmpFile, multi);
  try {
    execSync(
      `npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`,
      { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
    );
    console.log(`✓ Batch ${Math.floor(i/BATCH)+1}/${Math.ceil(blocks.length/BATCH)} (${batch.length} blocks)`);
  } catch (e) {
    // retry once on rate limit
    console.log(`  Retrying...`);
    execSync(
      `npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`,
      { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
    );
    console.log(`  ✓ Batch ${Math.floor(i/BATCH)+1} done`);
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

console.log(`\n✓ Chapter 3 Phase 2 DONE: ${blocks.length} blocks updated`);
