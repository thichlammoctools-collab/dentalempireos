import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';

const blocks = [];

// Helper
function b(id, text) {
  blocks.push({ id, text: text.replace(/'/g, "''") });
}

// Block 2: Mở đầu R.O.A.D.M.A.P
b('18047247-005b-4b47-aebc-dcb0f4e0a054', `Tôi đã dành nhiều ngày để nghiên cứu, viết ra, rồi lại bỏ xuống, viết lại, chỉnh sửa, và hoàn thiện. Đến khi **R.O.A.D.M.A.P** hoàn chỉnh, niềm vui của tôi không chỉ nằm ở việc kết thúc một bản thảo, mà nằm ở cảm giác rằng tất cả những gì tôi muốn truyền tải cuối cùng đã tìm được hình hài trọn vẹn. Mỗi từ, mỗi tầng, mỗi cấu trúc trong **R.O.A.D.M.A.P** đều không phải là những mảnh rời rạc, mà là những chặng đường nối tiếp nhau trong một hành trình lớn hơn, hành trình xây dựng một tổ chức có bản sắc, có đạo đức, có năng lực và có tương lai.`);

// Block 3-5: TO BE SKY, ROADMAP
b('d5aecf08-ac69-4a8d-90f9-656e56bdec3a', `**TO BE SKY là tinh thần**`);
b('80a59978-60e2-4462-8874-609455cf1fb7', `**R.O.A.D.M.A.P là lộ trình**.`);
b('17684551-5340-457c-b0b8-e84b6cba045a', `Nếu **SKY** là lời nhắc về điều đúng đắn, thì **R.O.A.D.M.A.P** là cách để điều đúng đắn ấy đi vào đời sống, thành hành động, thành hệ thống, và thành kết quả bền vững.`);

// Block 7: R.O.A.D.M.A.P - Hệ điều hành
b('348fb62e-e203-4a9d-8de7-8ec18b0ad555', `Khi nhìn lại hành trình xây dựng và điều hành tổ chức, tôi nhận ra hầu hết các mô hình quản trị đều vướng phải một điểm nghẽn chí mạng: *Lý thuyết thì rất hay, nhưng khi mang về áp dụng lại không biết phải bắt đầu từ đâu*. Chúng ta có những tầm nhìn vĩ đại, nhưng lại thiếu một hành trình từng bước để đạt được tầm nhìn ấy.`);

b('7a666f8d-9281-4833-b9cc-55a1de762b6a', `Đó là lý do tôi kiến tạo nên **R.O.A.D.M.A.P**. Đây không phải là một quy trình quản lý khô khan, mà là một **Hệ điều hành quản trị nội bộ** mang tính "Fractal" (mô hình lồng trong mô hình). Nó được sinh ra để đồng bộ trọn vẹn giữa con người và tổ chức.`);

b('2c849899-4c4b-4e65-a0d6-13ee397ac225', `**R.O.A.D.M.A.P** không phải là một đường thẳng có điểm kết thúc, mà là một vòng lặp tiến hóa khép kín gồm 7 tầng. Mỗi tầng vĩ mô lại cất giấu một bộ mã thực thi vi mô, dẫn dắt tổ chức đi từ bên trong nội tâm ra đến sự thịnh vượng bên ngoài:`);

// Block 10: 7 tầng
b('338fc39e-5344-4cc0-af08-e9742de7c013', `- **R — ROOTS (Bám rễ & Bản sắc):** Chúng ta bắt đầu bằng việc cắm những chiếc rễ sâu nhất vào giá trị lõi. Đây là nơi tổ chức định hình bản sắc, chuẩn hóa nguyên tắc vận hành (**Operating Code**) và rèn luyện sức bền để không bị bẻ gãy trước sóng gió.

- **O — ONE LIGHT (Định hướng & Chuẩn mực):** Khi đã có gốc, chúng ta cần một ngọn đèn soi đường. Tầng này nhắc nhở rằng chúng ta là một tập thể hợp nhất (**Oneness**), làm việc dựa trên phẩm giá (**Nobility**) và được dẫn dắt bởi những giá trị đạo đức (**Ethics**) không thể thỏa hiệp.

- **A — AWAKEN (Nhận thức & Chẩn đoán):** Đây là "mắt thần" của hệ thống. Trước khi vội vã hành động, tổ chức phải biết tự soi xét (**Audit**), quan sát thị trường, đào sâu nguyên nhân gốc rễ và nhạy bén nhận ra những điểm nghẽn dù là nhỏ nhất.

- **D — DEEPEN (Đào sâu & Chuẩn hóa):** Khi đã thấy rõ vấn đề, chúng ta không dừng lại ở lời nói. Đây là lúc bóc tách chi tiết, nâng cấp năng lực, đóng gói thành quy trình (SOP) và đưa vào kỷ luật thực thi để biến chuẩn mực thành nếp sống tự nhiên của tổ chức.

- **M — MATURE (Trưởng thành & Tối ưu):** Hệ thống lớn lên là chưa đủ, nó cần phải "chín". Tầng này tạo ra gia tốc (**Momentum**), chỉnh nhịp để toàn đội ngũ cùng tần số, hợp lực (**Unite**) và tinh chỉnh bộ máy để giảm thiểu mọi ma sát.

- **A — ALIGN (Đồng bộ & Tích hợp):** Để không trượt khỏi đường ray khi tăng trưởng nhanh, đây là lúc siết chặt đội hình. Chúng ta neo chặt mục tiêu, kết nối mọi nguồn lực và thu hẹp bớt những độ lệch pha giữa kế hoạch và thực tế.

- **P — PROSPER (Thịnh vượng & Kế thừa):** Tầng cuối cùng kích hoạt hiệu ứng bánh đà. Giá trị được sinh sôi (**Proliferate**), nguồn lực được tái đầu tư và hệ sinh thái được làm giàu. Quan trọng nhất, tổ chức liên tục tự làm mới (**Renew**) để không bao giờ già cỗi.`);

b('2263021b-50e5-42b8-8d95-eb7058692c9a', `Chữ **Renew** ở cuối hành trình chính là chìa khóa. Nó nối thẳng về lại chữ **ROOTS** ban đầu, tạo thành một vòng xoắn ốc đi lên vô tận.`);

b('449cd0f5-4433-4ada-8797-94471d59a384', `Với **R.O.A.D.M.A.P**, tôi tin rằng chúng ta không chỉ đang quản trị một công việc kinh doanh. Chúng ta đang kiến tạo một sinh thể sống minh bạch trong vận hành, rõ ràng trong phối hợp, có chiều sâu về văn hóa và sở hữu năng lực tiến hóa bền vững vượt thời gian.`);

// Block 13-18: Triết lý lõi
b('9df4acb6-afbb-4c87-9eb6-00290b40e832', `**R.O.A.D.M.A.P** được khơi nguồn từ một niềm tin kiên định: Một tổ chức vĩ đại không bao giờ định nghĩa sự bền vững chỉ bằng những con số trên báo cáo doanh thu. Sức mạnh thực sự của nó phải được bám rễ sâu vào bản sắc, ranh giới đạo đức, chiều sâu năng lực con người và khả năng tự học hỏi từ chính mình.`);

b('3af9b6eb-1c50-426a-9898-061ef0e07433', `Trong môi trường đặc thù như y tế, phòng khám nha khoa tuyệt đối không phải là một "cỗ máy sản xuất dịch vụ" vô tri. Nó là một **thực thể sống**. Ở đó, một chuỗi phản ứng dây chuyền luôn âm thầm diễn ra: Văn hóa định hình hành vi của bác sĩ và nhân viên; hành vi ấy trực tiếp chạm đến trải nghiệm của bệnh nhân; trải nghiệm kiến tạo nên uy tín; và cuối cùng, uy tín quay trở lại làm mạch máu nuôi sống toàn bộ hệ sinh thái.`);

b('c5ba757e-0c4d-46c9-a1bb-bb13981a1efa', `Đó là lý do **R.O.A.D.M.A.P** từ chối bắt đầu bằng những câu hỏi mang tính cơ giới như: *"Làm sao để tăng số ca điều trị?"*.`);

b('1c2438ad-1402-4343-8451-1da77d2a4466', `Thay vào đó, hệ thống buộc chúng ta phải đi tìm sự thật từ cội nguồn:`);

b('1eef0780-e875-47ef-881f-69cac0ce21d1', `- *Chúng ta là ai và phụng sự dựa trên giá trị nào?*
- *Những mảnh ghép nào thực sự phù hợp với văn hóa của tổ chức này?*
- *Hệ thống đang âm thầm tắc nghẽn ở đâu?*
- *Ai đang làm đúng vai trò của mình, và kết quả nào mới thực sự xứng đáng được tôn vinh?*`);

b('1036bacb-11df-45b4-bd96-e1a616eddb6e', `Sự khác biệt lớn nhất của **R.O.A.D.M.A.P** nằm ở đây: Nó vượt xa những chuỗi quy trình (workflow) hay bảng biểu **KPI** khô khan để trở thành một **kiến trúc quản trị có chiều sâu văn hóa và tính nhân bản sâu sắc**.`);

// Block 19-22: Mantra
b('7ef8922e-dc51-4da1-a50c-5f92a4b2ec05', `Đây là kim chỉ nam, là hệ tư tưởng xuyên suốt mà bất kỳ ai vận hành hệ thống này cũng phải nằm lòng:`);

b('37da3f17-2015-4475-a888-e509c406cb16', `"Một phòng khám nha khoa tầm thường cố quản lý con người bằng sự giám sát khắt khe và nỗi sợ hãi chặng ngắn.`);

b('d93a03b6-86bf-4c0f-aade-463c0fe55f39', `Nhưng một đế chế nha khoa vĩ đại sẽ điều hành tổ chức bằng một hệ mã nguồn liên thông nối liền từ gốc rễ tâm hồn cho đến từng hành động nhỏ nhất trên thực địa.`);

b('72230382-5aef-487c-92a5-96b906ef99f9', `Hãy để **R.O.A.D.M.A.P** trở thành thước đo của sự chuẩn mực, chiếc la bàn giữ gìn đạo đức, và là cỗ động cơ mạnh mẽ nhất thúc đẩy phòng khám của bạn không ngừng tự tiến hóa, vươn lên những đỉnh cao thịnh vượng mới."`);

// Block 23-25: Ba lăng kính
b('8ff6f97c-4d3b-4e61-b722-c1873406cf83', `Việc kiến tạo **R.O.A.D.M.A.P** không nên được hiểu như hành động xây thêm một bộ công cụ quản trị để áp đặt lên tổ chức. Ở cấp độ sâu hơn, đây là nỗ lực kiến tạo một cấu trúc tự soi chiếu, nơi bản thân hệ điều hành cũng phải chịu sự kiểm định nghiêm ngặt trước các câu hỏi nền tảng nhất về con người, tổ chức và quy luật vận động của sự phát triển.`);

b('f6e2a47c-69f0-4c47-a0fa-8e7e0723e780', `Một mô hình chỉ có thể đi đường dài khi nó không chỉ hiệu quả trong thực thi, mà còn đủ chiều sâu để tự phản biện. Chính vì vậy, **R.O.A.D.M.A.P** cần được đặt dưới ba lăng kính triết học cốt lõi nhằm kiểm định bản chất tư tưởng của nó: vũ trụ quan, nhân sinh quan và thế giới quan.`);

b('4203dda3-3c95-4f45-8d47-4190f407c392', `Ba lăng kính này lần lượt trả lời ba câu hỏi nền tảng. Thứ nhất, tổ chức được giả định là đang vận hành theo quy luật nào của đời sống? Thứ hai, con người trong hệ thống được nhìn nhận như thế nào: như một công cụ sản xuất hay như một chủ thể có phẩm giá và khả năng trưởng thành? Thứ ba, văn hóa, chiến lược và vận hành thực địa có được tích hợp thành một chỉnh thể nhất quán hay không?`);

// 4.1 Vũ trụ quan
b('5d49bca9-1308-4feb-a6c6-d821eb62c915', `Dưới lăng kính vũ trụ quan, **R.O.A.D.M.A.P** phản ánh rõ một tư duy biện chứng và hữu cơ. Mô hình này không xem tổ chức là tập hợp tĩnh của các phòng ban, cũng không hiểu doanh nghiệp như một cỗ máy vận hành thuần cơ giới. Trái lại, nó mặc định rằng tổ chức là một sinh thể sống, liên tục vận động, liên tục phát sinh mâu thuẫn nội tại và liên tục tự điều chỉnh để tiến hóa.`);

b('1c515c79-20c7-45a9-898a-54621a39f1fb', `Chuỗi phát triển từ **ROOTS → ONE LIGHT → AWAKEN → DEEPEN → MATURE → ALIGN → PROSPER** cho thấy một giả định trung tâm: phát triển không diễn ra theo đường thẳng, mà vận động thông qua nhận diện lệch pha, chuyển hóa điểm nghẽn, gia cố năng lực nền và tái đồng bộ toàn hệ thống. Nói cách khác, tăng trưởng bền vững không đến từ việc né tránh xung đột, mà đến từ khả năng đọc đúng mâu thuẫn và xử lý đúng mâu thuẫn.`);

b('884d2c14-56b8-4e78-8010-7b3ab65c63da', `Tinh thần này thể hiện đậm nhất ở tầng **AWAKEN** và **DEEPEN**. Trong logic của mô hình, các khoảng cách giữa thực trạng và mục tiêu, các điểm nghẽn vận hành, các sai lệch chuẩn hoặc tín hiệu cảnh báo sớm không phải là "lỗi" để che giấu, mà là nguồn dữ liệu sống để kích hoạt quá trình nâng cấp hệ thống. Chính điều này khiến **R.O.A.D.M.A.P** đặc biệt phù hợp với môi trường nha khoa, nơi chuyên môn lâm sàng, trải nghiệm bệnh nhân, dữ liệu vận hành, tài chính và niềm tin thương hiệu luôn tác động chéo lên nhau.`);

b('179ccbd3-9f17-4980-ac55-e6b5ee16427a', `Tuy nhiên, cùng với sức mạnh ấy là một nguy cơ nội tại. Khi mô hình đi xuống các tầng như **DEEPEN** hoặc **PROSPER**, đặc biệt tại các cơ chế như **Enforce** và **Optimize**, hệ điều hành rất dễ trượt sang quỹ đạo cơ giới hóa. Nếu người lãnh đạo đồng nhất quản trị với siết checklist, chuẩn hóa triệt để và đo lường quá dày đặc, tổ chức sẽ dần đánh mất bản chất sống động của mình. Trong bối cảnh y tế, rủi ro này đặc biệt nghiêm trọng vì nó có thể làm suy giảm không gian dành cho trực giác lâm sàng, phán đoán nghề nghiệp và y đức của bác sĩ.`);

b('0980c437-9d26-4d0d-8597-3e7e0991193e', `Vì vậy, xét ở bình diện vũ trụ quan, **R.O.A.D.M.A.P** là một mô hình đúng hướng về mặt tiến hóa, nhưng chỉ giữ được sức sống khi được vận hành như một cơ thể hữu cơ, không phải như một thiết bị kỹ trị.`);

// 4.2 Nhân sinh quan
b('3e0a6c0d-32f6-40ac-b553-6fda0281c7d9', `Nếu vũ trụ quan đặt câu hỏi về quy luật vận hành của tổ chức, thì nhân sinh quan buộc mô hình phải trả lời một câu hỏi sâu hơn: con người trong hệ điều hành này được định vị là ai.`);

b('0e3eea8f-962e-49ac-ae3d-f44f278f687e', `Ở điểm này, **R.O.A.D.M.A.P** thể hiện một lập trường rõ ràng: từ chối cách nhìn nhân sự như những đơn vị lao động bị quy giản thành **KPI**. Mô hình xuất phát từ giả định rằng con người là trung tâm tạo giá trị, là chủ thể có bản sắc, có nhân cách, có khả năng tự hoàn thiện và cần được đặt trong đúng môi trường để phần tốt đẹp nhất được khai mở.`);

b('7ce49c3f-6230-41d5-817f-33061fc0854b', `Chính vì thế, hai tầng đầu tiên của hệ điều hành là **ROOTS** và **ONE LIGHT** không khởi sự bằng câu hỏi "làm được gì", mà bằng những câu hỏi sâu hơn: nền giá trị nào đang định hình con người này, họ có cùng DNA cốt lõi với tổ chức hay không, họ có được dẫn dắt dưới ánh sáng của sự chính trực hay không, và họ có đang được đặt đúng vai để trưởng thành hay không. Đây là cách mô hình đưa phần sâu kín nhất của con người đi trước phần biểu hiện bề mặt của hiệu suất.`);

b('ec3b727d-6b49-486f-a0b3-e85aad167d19', `Đối với môi trường y tế và nha khoa, cách tiếp cận này có ý nghĩa đặc biệt. Bởi trong những hệ thống chăm sóc sức khỏe, giá trị của đội ngũ không thể chỉ được đo bằng sản lượng hay doanh thu. Một hệ điều hành đúng đắn phải đồng thời bảo vệ danh dự nghề nghiệp, lòng tự trọng chuyên môn, phẩm chất đạo đức và sự tử tế trong quan hệ giữa người làm nghề với bệnh nhân.`);

b('0e497d98-f99d-4f57-bba2-a53f5dd7058f', `Tuy nhiên, cũng như mọi hệ thống quản trị trưởng thành, thách thức lớn nhất không nằm ở phần tuyên ngôn, mà nằm ở phần thực thi. Khi mô hình dịch chuyển xuống các tầng như **DEEPEN**, **ALIGN** và **PROSPER**, tổ chức bắt đầu đi vào các cơ chế đánh giá, chuẩn hóa, xếp loại và tối ưu. Chính tại đây xuất hiện một nghịch lý quan trọng: công cụ được tạo ra để hỗ trợ con người có thể quay ngược lại để quy giản con người.`);

b('9ebc5cfb-520c-4b25-a066-aa7d7fa1d2b8', `Các chỉ số như Ethics Score, DNA Match hay bất kỳ hình thức lượng hóa nào khác chỉ có giá trị khi chúng đóng vai trò là tín hiệu khởi đầu cho đối thoại. Nếu chúng trở thành phán quyết cuối cùng về phẩm chất con người, hệ điều hành sẽ đánh mất chính nền tảng nhân văn mà nó tuyên bố bảo vệ. Bởi vậy, về mặt nhân sinh quan, **R.O.A.D.M.A.P** chỉ giữ được tính chính đáng khi sau mỗi chỉ số vẫn còn đối thoại, sau mỗi đánh giá vẫn còn mentoring, và sau mỗi cảnh báo vẫn còn chỗ cho sự thấu cảm của người dẫn dắt.`);

// 4.3 Thế giới quan
b('d433340a-d222-4164-bca7-7eae2d0ebab3', `Ở cấp độ thế giới quan, **R.O.A.D.M.A.P** không chỉ là một framework vận hành. Nó mang dáng dấp của một hệ tư tưởng quản trị hoàn chỉnh, trong đó tổ chức được nhìn như một chỉnh thể phải được hợp nhất từ gốc rễ đến thịnh vượng.`);

b('9f131dd2-8b65-4ea8-a8a4-2da78ea473ea', `Điểm cốt lõi của thế giới quan này là phủ nhận sự chia cắt giữa văn hóa, chiến lược và vận hành thực địa. Đây là một vấn đề phổ biến của nhiều doanh nghiệp: giá trị được phát biểu ở tầng truyền thông, chiến lược được thiết kế ở tầng lãnh đạo, còn thực địa lại vận hành theo một logic hoàn toàn khác. Sự đứt gãy ấy chính là nguồn gốc của mất phương hướng, mất niềm tin và mất năng lực tăng trưởng bền vững.`);

b('afa5153a-d01e-4fe8-8102-18122f198acd', `**R.O.A.D.M.A.P** được thiết kế để xử lý triệt để điểm đứt gãy này. Trong cấu trúc của nó, bản sắc phải nối được với đạo đức; đạo đức phải nối được với nhận thức; nhận thức phải chuyển hóa thành quy trình; quy trình phải đi vào sự trưởng thành hữu cơ của tổ chức; sự trưởng thành phải dẫn tới đồng bộ nguồn lực; và toàn bộ quá trình ấy phải mở ra thịnh vượng mà không đánh mất linh hồn ban đầu.`);

b('1b0306ff-a5ff-4e61-9384-338f5d9b4660', `Chính nhờ vậy, mô hình này đặc biệt có giá trị trong bối cảnh các chuỗi nha khoa đa chi nhánh. Khi quy mô gia tăng, sự phân mảnh không chỉ xuất hiện ở quy trình, mà còn xuất hiện ở tinh thần vận hành. Một đơn vị có thể tăng trưởng doanh thu nhưng suy giảm đạo đức. Một đội ngũ có thể tuân thủ SOP nhưng mất đi sự sống nghề nghiệp. Một bộ máy có thể hiệu quả về số liệu nhưng lại nghèo nàn về ý nghĩa. **R.O.A.D.M.A.P** được hình thành để chống lại kiểu tăng trưởng đánh đổi này.`);

// 4.4 Bản đồ giải phẫu
b('04d9a054-0a0b-4f23-8411-1a9614b87587', `**ROOTS**, **ONE LIGHT**, **AWAKEN** tạo thành "thượng tầng tư tưởng" của hệ điều hành, nơi phần hồn của tổ chức được hình thành. Ngược lại, **DEEPEN**, **MATURE**, **ALIGN**, **PROSPER** tạo thành "hạ tầng thực thi", nơi phần hồn ấy phải được chuyển hóa thành kỷ luật, cơ chế, hành động và kết quả.`);

b('f33196dc-a0c7-46ed-8083-a023136383c0', `Ý nghĩa của sự phân tầng này là rất rõ: nếu không có thượng tầng tư tưởng, hạ tầng thực thi sẽ trở thành kỹ trị lạnh lùng; nhưng nếu không có hạ tầng thực thi, thượng tầng tư tưởng sẽ chỉ dừng ở mức tuyên ngôn đạo đức. Giá trị của **R.O.A.D.M.A.P** nằm ở chỗ nó cố gắng nối hai miền ấy vào cùng một vòng sống.`);

// 4.5 Nhận định tổng hợp
b('591fe6f9-6f86-4b3a-bbdf-91670bd100ad', `Nhìn một cách tổng thể, **R.O.A.D.M.A.P** sở hữu cấu trúc tư tưởng khá vững chãi: mạch lạc về vũ trụ quan, có nền tảng rõ về nhân sinh quan và tương đối trọn vẹn về thế giới quan. Sức mạnh lớn nhất của mô hình không nằm ở việc tạo thêm một bộ công cụ quản lý, mà ở chỗ nó trả lời được những câu hỏi tối hậu của một tổ chức: quản trị để làm gì, con người mang danh dự gì trong hệ thống, sự tiến hóa diễn ra theo quy luật nào, và điểm nghẽn được chuyển hóa ra sao.`);

b('846e6ddd-2806-4915-84d1-8e2499826b0c', `Tuy nhiên, để chữ **Renew** ở cuối hành trình có thể thật sự quay lại nuôi dưỡng **ROOTS**, tạo thành một vòng xoắn ốc đi lên thay vì một chu kỳ lặp mòn, người đứng đầu phải giữ được ba điểm neo cân bằng.`);

b('a2acf945-a87c-455b-a481-4ed0b1844402', `- Thứ nhất, không để các tầng như **DEEPEN** và **PROSPER** trượt sang cơ giới hóa. Kỷ luật và tối ưu là cần thiết, nhưng không được làm đội ngũ trở thành những bánh răng vô hồn.

- Thứ hai, phải duy trì dòng chảy đối thoại sống ở các tầng như **MATURE** và **ALIGN**. Dashboard, score hay alert chỉ là tín hiệu tham chiếu; sự chỉnh nhịp thật sự luôn phải đi qua đối thoại, khai vấn và niềm tin giữa người với người.

- Thứ ba, phải bảo vệ thánh đường chuyên môn tại **AWAKEN** và trên toàn bộ trục vận hành. Dữ liệu chỉ nên đóng vai trò tham mưu; nó không được phép lấn át trực giác lâm sàng, phán đoán chuyên môn và y đức của bác sĩ trong thực hành.`);

b('62f9f916-b5e6-4f3c-af98-9b15b92b8b0f', `Nếu giữ được ba điểm neo này, **R.O.A.D.M.A.P** có thể vượt qua giới hạn của một framework quản trị thông thường. Khi đó, nó không chỉ là một hệ điều hành dành cho tăng trưởng, mà trở thành một triết lý điều hành tổ chức: chặt chẽ trong cấu trúc, mạnh mẽ trong thực thi, nhưng vẫn giữ được chiều sâu nhân bản và phẩm giá nghề nghiệp của ngành nha khoa.`);

console.log(`Total: ${blocks.length} blocks to update`);

// Batch update
const BATCH = 10;
for (let i = 0; i < blocks.length; i += BATCH) {
  const batch = blocks.slice(i, i + BATCH);
  const sqls = batch.map(u => `UPDATE "block" SET "text_md" = '${u.text}' WHERE "id" = '${u.id}';`);
  const multi = sqls.join('\n');
  const tmpFile = join(tmpdir(), `c3_${Date.now()}.sql`);
  writeFileSync(tmpFile, multi);
  try {
    execSync(
      `npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`,
      { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
    );
    console.log(`✓ Batch ${Math.floor(i/BATCH)+1}/${Math.ceil(blocks.length/BATCH)} (${batch.length} blocks)`);
  } catch (e) {
    // may have rate limit, retry once
    console.log(`  Retrying batch ${Math.floor(i/BATCH)+1}...`);
    execSync(
      `npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`,
      { encoding: 'utf-8', stdio: ['pipe','pipe','pipe'] }
    );
    console.log(`  ✓ Batch ${Math.floor(i/BATCH)+1} done`);
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

console.log(`\n✓ Chapter 3 Phase 1 DONE: ${blocks.length} blocks updated`);
