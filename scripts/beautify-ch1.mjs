import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';
const UPDATES = [
  {
    id: '306a29a1-d209-4dd5-b3fe-cc7642478cab',
    text: `## Lời mở đầu

Tôi biết anh chị có thể đã nghe, đã học, thậm chí đã làm rất nhiều điều giống như những gì mà cuốn sách này trình bày. Và chính vì vậy, tôi không viết nó ra để nhắc lại những điều cũ theo một cách ồn ào hơn.

Trong thực hành, điều quan trọng không phải là biết bao nhiêu, mà là điều gì thật sự được giữ lại, được dùng đều, và được làm thành hệ thống.

Có những nguyên tắc ai cũng hiểu. Có những mô hình ai cũng từng nghe. Có những khái niệm như **Patient Experience**, **Referral**, **Testimonial** hay **CRM** không còn xa lạ với bất kỳ ai làm phòng khám hôm nay. Nhưng giữa "biết" và "làm thành nếp" là một quãng rất dài.

Tôi viết cuốn sách này từ chính khoảng cách đó — không phải để dạy lại những điều đã thuộc, mà để gom chúng về một trật tự rõ ràng hơn, gần hơn với vận hành thật, và đủ chặt để đi đường dài.

Tôi chọn làm lại, vì tôi tin rằng một điều đúng đắn nếu được đặt vào đúng ngữ cảnh, đúng ngôn ngữ, đúng người đọc, thì vẫn có thể trở nên mới. Nhất là trong nha khoa, nơi mọi thứ cuối cùng đều quay về con người, về niềm tin, về cách một phòng khám chăm sóc bệnh nhân và chăm sóc chính đội ngũ của mình.

> Nếu anh chị đã biết phần lớn những điều này rồi, thì cuốn sách không nhằm thay thế điều đó; nó chỉ mong giúp mọi thứ trở nên rõ hơn, mạch hơn, và có thể dùng được ngay trong thực tế.`
  },
  {
    id: '54a16f2c-6113-4be7-93c2-b14c9d2620cb',
    text: `## Hệ sinh thái tăng trưởng

Phòng khám cần một hệ sinh thái tăng trưởng — không phải để làm cho câu chuyện kinh doanh trở nên phức tạp hơn, mà để làm cho tăng trưởng bền vững hơn.

Trong bối cảnh thị trường nha khoa đang chuyển mạnh từ mô hình đơn lẻ sang chuỗi hóa, lợi thế không còn nằm ở việc có thật nhiều ghế hay chạy thật nhiều quảng cáo, mà nằm ở **năng lực xây dựng một dòng chảy niềm tin** đủ mạnh để mỗi trải nghiệm tốt tiếp tục sinh ra một cơ hội mới.

Hệ sinh thái ấy bắt đầu từ **Patient Experience**, nơi khách hàng cảm nhận được sự rõ ràng, tử tế và an toàn trong từng điểm chạm. Từ trải nghiệm đó, phòng khám mới có thể:

- Khơi mở **giới thiệu (Referral)**
- Ghi nhận **lời cảm nhận thật (Testimonial)**
- Chuyển hóa từng ca điều trị thành **nội dung (Content)**
- Theo dõi toàn bộ hành trình ấy bằng **quản trị quan hệ khách hàng (CRM)**

Khi năm yếu tố ấy gắn vào nhau, phòng khám không còn tăng trưởng bằng may mắn hay chiến dịch ngắn hạn, mà bằng một **cấu trúc có thể lặp lại, nhân rộng và bồi đắp theo thời gian**.

> Mỗi người được điều trị tốt không chỉ là một ca thành công, mà còn có thể trở thành một nguồn giới thiệu, một câu chuyện uy tín, một bằng chứng chuyên môn, và một mắt xích trong vòng lặp tăng trưởng tiếp theo.

Trong **Dental Empire OS**, tăng trưởng không được hiểu như một đường thẳng đi lên, mà như một hệ thống biết tự tái tạo niềm tin, tự nuôi dưỡng cộng đồng và tự mở rộng tương lai của chính mình.`
  },
  {
    id: 'c314e9f0-ded6-43dc-aa14-87bd6f5b941b',
    text: `## Hành trình cá nhân

Có những hành trình không kết thúc ở nơi ta tưởng. Có những vòng đi xa, những khúc quanh tưởng như rẽ khỏi con đường ban đầu, nhưng sau cùng lại đưa ta trở về đúng nơi mình thuộc về, với một tâm thế chín chắn hơn và một trái tim lắng lại hơn.

### Hành trình cá nhân

Với tôi, hành trình ấy bắt đầu từ Y khoa, từ những năm tháng học tập và trưởng thành trong khoa Răng Hàm Mặt ĐH Y Dược HCM, rồi tiếp tục đi qua những chặng đường rất khác so với bạn bè: thương trường, công nghệ, vận hành và xây dựng hệ thống.

Ở mỗi chặng, tôi học thêm một điều mới về con người, về tổ chức, về cách một mô hình doanh nghiệp có thể đứng vững hay đổ vỡ. Và cũng ở mỗi chặng, tôi càng hiểu rõ hơn rằng điều mình đang đi tìm không chỉ là thành công của riêng cá nhân, mà là một cách làm nghề có thể đi xa hơn, bền hơn và có ích hơn cho cộng đồng.

### Quay lại ngành Răng Hàm Mặt

Khi quay lại ngành Răng Hàm Mặt, tôi may mắn nhận được sự giúp đỡ của những người bạn cũ, của các anh chị em trong ngành, và của những người đã tin rằng tôi vẫn còn một vai trò để tiếp tục gắn bó với ngành Y tế.

Đó là một điều đáng quý — không phải ai cũng có cơ hội đi một vòng dài hơn 10 năm như thế rồi vẫn còn được trở về với điều mình thật sự muốn cống hiến.

### Ebook ra đời như thế nào

Cuốn ebook này ra đời từ sự gặp nhau của rất nhiều điều: kinh nghiệm tích lũy hơn 15 năm khởi nghiệp từ khi còn sinh viên, những quan sát thực tế trong quản trị, những lần thử - sai - sửa - làm lại, và cả sự đồng hành của công nghệ.

AI không thay thế trải nghiệm sống của tôi. AI giúp tôi hệ thống hóa trải nghiệm đó nhanh hơn, rõ hơn và mạch lạc hơn. Nhờ có một người bạn đồng hành như vậy, tôi có thể chắt lọc những điều đã đi qua thành một cấu trúc đủ gọn để đọc, đủ sâu để nghĩ, và đủ thực để dùng.

> Tôi mong muốn xây dựng một mô hình riêng của một bác sĩ làm quản trị Việt Nam, viết cho người Việt Nam, từ chính ngôn ngữ, văn hóa và thực tiễn của người Việt.

Nếu cuốn sách này có một điều tôi mong người đọc cảm nhận được trước tiên, thì đó là **sự chân thành**. Chân thành với nghề, với những người đã mở đường, với những người đang âm thầm làm việc mỗi ngày, và với chính hành trình của mình.

Tôi tin rằng, sau cùng, mọi hệ thống tốt đều bắt đầu từ một con người muốn làm điều đúng.`
  },
  {
    id: '56600ec1-7565-48d1-87d2-e4dfd76d5cce',
    text: `## Đối tượng đọc

Tôi viết cho những người đã đi đủ xa để hiểu rằng làm phòng khám không chỉ là làm **chuyên môn**, mà còn là làm con người, làm hệ thống, và làm niềm tin.

Tôi viết cho những anh chị đang ở vị trí phải quyết định:

- Quyết định ai sẽ đi cùng mình
- Quyết định quy trình nào cần giữ lại
- Quyết định tiêu chuẩn nào cần nâng lên
- Quyết định mức tăng trưởng nào là xứng đáng để đánh đổi

Tôi viết cho những người đang xây phòng khám quy mô nhỏ hoặc siêu nhỏ nhưng không muốn nó mãi nhỏ — những người hiểu rằng một tổ chức y tế muốn đi xa thì trước hết phải có một **ngôn ngữ quản trị** đủ rõ để mọi người cùng hiểu, cùng làm, cùng chịu trách nhiệm.

Tôi cũng viết cho những bác sĩ đã vững tay nghề nhưng bắt đầu nhìn thấy giới hạn của việc chỉ dựa vào chuyên môn. Họ cần thêm một lớp tư duy về:

- **Patient Experience**
- **Referral**
- **Testimonial**
- **CRM**

...để biến năng lực cá nhân thành năng lực của cả hệ thống.

> Cuốn sách này không dành cho sự vội vàng. Nó dành cho những người vẫn tin rằng điều tử tế, nếu được làm đều và làm đúng, sẽ trở thành nền của tăng trưởng bền vững.

Tôi không viết cho những ai đang tìm một công thức nhanh để phòng khám tăng trưởng mà không cần thay đổi gì bên trong. Tôi cũng không viết cho những ai chỉ muốn đọc để biết, nhưng không muốn đem điều mình đọc được trở lại bàn làm việc, trở lại checklist, trở lại từng cuộc gọi chăm sóc khách hàng (**CSKH**), từng ca điều trị, từng lần bàn giao và từng quyết định nhỏ trong phòng khám.`
  },
  {
    id: '08635cb6-478d-4119-b8bb-683c125bb2ca',
    text: `## Năm lớp cần thiết để tổ chức trưởng thành

Một phòng khám nha khoa không chỉ được tạo nên bởi ghế nha, máy móc, phòng điều trị, bảng giá, quy trình tiếp đón hay những chiến dịch marketing. Tất cả những điều đó là cần thiết, nhưng chưa đủ để tạo nên một tổ chức bền vững.

Một phòng khám thật sự trưởng thành phải có:

- **Bản sắc** — để biết mình là ai
- **Đạo đức** — để biết điều gì không được phép đánh đổi
- **Năng lực** — để thực thi lời hứa
- **Cơ chế** — để biến lý tưởng thành hành vi hằng ngày
- **Hệ đo lường** — để nhìn thấy sự thật, học từ sai lệch và tiến hóa theo thời gian

Từ niềm tin đó, **Dental Empire OS** được hình thành như một hệ điều hành quản trị dành cho phòng khám nha khoa hiện đại. Đây không đơn thuần là một bộ quy trình hay một tập hợp công cụ quản lý.

> **Dental Empire OS** là một cách nhìn về tổ chức: phòng khám không phải là một cỗ máy tuyến tính, mà là **một hệ thống sống**; không phải chỉ là nơi bán dịch vụ điều trị, mà là nơi gìn giữ niềm tin, phẩm giá nghề nghiệp và sức khỏe con người.

### Ba chiều không thể tách rời

Trong hệ thống ấy, hiệu suất không thể tách rời khỏi phẩm chất. Doanh thu không thể tách rời khỏi y đức. Quản trị không thể tách rời khỏi con người. Và tăng trưởng không thể được xem là thành công nếu cái giá phải trả là sự bào mòn niềm tin của bệnh nhân.

Câu hỏi nền tảng mà **Dental Empire OS** đặt ra: làm thế nào để một phòng khám nha khoa có thể tăng trưởng mà vẫn giữ được phẩm giá? Làm thế nào để một tổ chức có thể mở rộng mà không đánh mất linh hồn?

Câu trả lời nằm ở việc kiến tạo một hệ điều hành quản trị có đủ ba chiều: **văn hóa, năng lực và cơ chế**.`
  },
  {
    id: '0baf2b92-6a6d-4349-9c28-6d84439543f4',
    text: `## Tổ chức là hệ thống sống

Trong nhiều mô hình quản trị truyền thống, tổ chức thường được nhìn như một cỗ máy:

- Mỗi phòng ban là một bộ phận
- Mỗi nhân sự là một mắt xích
- Mỗi quy trình là một đường chuyền
- Mỗi chỉ số là một đồng hồ đo

Cách nhìn đó có một phần đúng, nhưng không đủ đối với một tổ chức y tế.

> Một phòng khám nha khoa không chỉ vận hành bằng quy trình. Nó vận hành bằng **niềm tin của bệnh nhân**, bằng **lương tâm nghề nghiệp của bác sĩ**, bằng sự phối hợp của đội ngũ, bằng thái độ của lễ tân, bằng sự trung thực của người tư vấn, bằng sự cẩn trọng của phụ tá, bằng sự nhất quán của từng điểm chạm nhỏ trong hành trình điều trị.

**Dental Empire OS** nhìn tổ chức như một **hệ thống sống** — phải có gốc rễ, phải biết tự nhận biết khi lệch hướng, có cơ chế tự điều chỉnh khi sai lệch xuất hiện, có khả năng học từ lỗi lầm, và có vòng phản hồi để không ngừng trưởng thành.

### R.O.A.D.M.A.P làm khung điều hành trung tâm

**R.O.A.D.M.A.P** là con đường giúp tổ chức đi từ gốc rễ đến thịnh vượng:

- **ROOTS** — nơi tổ chức xác định bản sắc và nền móng
- **ONE LIGHT** — nơi tổ chức thiết lập trục đạo đức và lằn ranh không được vượt qua
- **AWAKEN** — nơi tổ chức học cách tự nhận thức
- **DEEPEN** — nơi năng lực và quy trình được đào sâu
- **MATURE** — nơi đội ngũ trưởng thành
- **ALIGN** — nơi mục tiêu và nguồn lực được đồng bộ
- **PROSPER** — sự thịnh vượng có nền tảng, có phẩm giá và có khả năng duy trì lâu dài

Như vậy, **Dental Empire OS** không quản trị phòng khám bằng những **KPI** rời rạc. Nó quản trị bằng một **kiến trúc có tầng sâu, có trật tự và có vòng lặp học hỏi liên tục**.`
  },
  {
    id: '1d304fe1-9dd3-4b87-a766-c8c21cd094f1',
    text: `## Con người là nền tảng

Một tổ chức có thể mua được máy móc tốt. Có thể thuê được mặt bằng đẹp. Có thể đầu tư vào công nghệ hiện đại. Có thể chạy được quảng cáo mạnh. Nhưng chất lượng thật sự của một phòng khám vẫn được quyết định bởi **con người**.

Con người là nơi văn hóa trở thành hành vi.

Con người là nơi đạo đức được thử thách.

Con người là nơi quy trình được thực thi.

Con người là nơi bệnh nhân cảm nhận được tổ chức có đáng tin hay không.

Vì vậy, **Dental Empire OS** không xem nhân sự chỉ là "nguồn lực". Con người là **chủ thể** có bản sắc, có ý thức đạo đức, có khả năng học tập, có giới hạn, có tiềm năng và có nhu cầu được đặt vào đúng môi trường để phát triển.

### Tuyển dụng bắt đầu từ giá trị

Trong **Dental Empire OS**, tuyển dụng không bắt đầu bằng câu hỏi: "Người này có làm được việc không?" Câu hỏi đầu tiên phải là: **"Người này có phù hợp với hệ giá trị của tổ chức không?"**

Bởi vì một người giỏi nhưng lệch giá trị có thể tạo ra nhiều rủi ro hơn một người còn thiếu kỹ năng nhưng có tinh thần đúng và khả năng học hỏi. Năng lực có thể được đào tạo theo thời gian. Nhưng sự lệch pha về đạo đức, thái độ và thế giới quan có thể làm tổn thương văn hóa từ bên trong.

### Đặc biệt đúng trong ngành nha khoa

- Một bác sĩ giỏi chuyên môn nhưng xem nhẹ sự minh bạch có thể làm suy giảm niềm tin bệnh nhân
- Một nhân sự bán hàng có khả năng chốt lịch cao nhưng tư vấn thiếu trung thực có thể làm méo hình ảnh phòng khám
- Một quản lý vận hành giỏi kiểm soát con số nhưng thiếu lòng trắc ẩn có thể khiến đội ngũ kiệt sức

> Con người trong **Dental Empire OS** được nhìn trong một tiến trình dài: được chọn lọc, được hội nhập, được đào tạo, được soi chiếu, được phản hồi và được trưởng thành.

Mục tiêu không phải chỉ là tạo ra nhân sự biết làm việc. Mục tiêu là tạo ra những con người biết làm đúng việc, đúng cách, đúng chuẩn mực và đúng tinh thần của tổ chức.`
  },
  {
    id: 'd02dc40f-c115-4674-b936-10c28c019545',
    text: `## SKY — Trục đạo đức của hệ thống

Một tổ chức muốn đi xa cần có bầu trời để ngước nhìn.

Trong **Dental Empire OS**, bầu trời đó được gọi là **SKY** — viết tắt của **Sincerity, Kindness, Yielding**.

**SKY** là trục đạo đức cô đọng của hệ thống. Nó không phải là những từ đẹp để trang trí tài liệu văn hóa. Nó là bộ phẩm chất định hướng cách tổ chức đối xử với bệnh nhân, với đồng nghiệp, với cộng đồng và với chính mình.

### Sincerity — Sự chân thành và trung thực

Yêu cầu tổ chức bảo vệ sự thật, nói đúng điều cần nói, tư vấn đúng điều cần tư vấn và không bóp méo chuyên môn vì áp lực doanh thu. Trong nha khoa, **Sincerity** là hàng rào chống lại việc "vẽ bệnh", phóng đại nỗi sợ hoặc biến sự thiếu hiểu biết của bệnh nhân thành cơ hội kinh doanh.

### Kindness — Lòng tử tế và tinh thần nhân bản

Nhắc tổ chức rằng bệnh nhân không phải là một ca điều trị, một hóa đơn hay một dòng doanh thu. Bệnh nhân là một con người đang mang theo nỗi lo, sự kỳ vọng, cảm giác bất an và nhu cầu được chăm sóc một cách tử tế. **Kindness** cũng nhắc rằng nhân sự không phải là công cụ vận hành, mà là những con người cần được tôn trọng, hướng dẫn và phát triển.

### Yielding — Khả năng nhường mình để ưu tiên điều đúng

Đây không phải là sự yếu đuối. Đây là năng lực hạ thấp cái tôi khi cần thiết, lắng nghe phản hồi, thừa nhận sai sót và điều chỉnh vì lợi ích lớn hơn. Trong môi trường y tế, cái tôi chuyên môn, cái tôi chức vụ và cái tôi kinh doanh đều có thể trở thành nguy cơ nếu không được soi chiếu. **Yielding** giúp tổ chức biết dừng lại trước khi đi quá xa.

### TO BE SKY

Thay vì trở thành STARS (Ngôi Sao), hãy trở thành **SKY** (Bầu Trời) để tất cả các ngôi sao khác có thể tỏa sáng.

Người lãnh đạo phải luôn ở tâm thái "TO BE" — tâm thái trở thành, không phải "đã rồi". Hành trình TO BE của người lãnh đạo là hành trình từ bên trong:

- **T — Transcend** — luôn vươn lên trên cái cũ, vượt qua giới hạn hiện tại
- **O — Open** — sẵn sàng mở rộng không gian, tư duy và khả năng đón nhận cái mới
- **B — Beneath** — luôn đi xuống chiều sâu, chạm vào nền tảng và gốc rễ
- **E — Enlighten** — luôn mong muốn làm sáng tỏ, soi rõ mọi thứ để mang lại nhận thức đúng

> **SKY vì thế là bầu trời đạo đức phía trên toàn bộ Dental Empire OS.**`
  },
  {
    id: 'b1280f19-95d6-4873-aafe-0b4691f8dc6a',
    text: `## S.T.A.R.S — Bản đồ năng lực

Nếu **SKY** là bầu trời đạo đức, thì **S.T.A.R.S** là bản đồ những ngôi sao năng lực mà tổ chức cần quan sát, nuôi dưỡng và phát triển.

Một tổ chức không thể chỉ có đạo đức mà thiếu năng lực. Lòng tốt không thể thay thế chuyên môn. Sự tử tế không thể bù đắp cho sự cẩu thả.

Ngược lại, năng lực cao nhưng thiếu đạo đức cũng nguy hiểm không kém. Khi kỹ năng, công nghệ và khả năng thuyết phục không được dẫn dắt bởi y đức, chúng có thể trở thành công cụ để tối ưu hóa lợi ích ngắn hạn thay vì phụng sự bệnh nhân.

Vì vậo, **Dental Empire OS** đặt **SKY** và **S.T.A.R.S** song song với nhau:

- **SKY** bảo vệ phẩm chất
- **S.T.A.R.S** phát triển năng lực

### S.T.A.R.S nhìn năng lực con người qua năm chiều

1. **Skills** — kỹ năng: năng lực chuyên môn, kỹ năng giao tiếp, kỹ năng vận hành, kỹ năng xử lý tình huống
2. **Traits** — tố chất: khí chất tự nhiên, độ phù hợp với vai trò, khả năng chịu áp lực, mức độ cẩn trọng, tinh thần trách nhiệm
3. **Actions** — khả năng hành động: tính chủ động, kỷ luật thực thi, khả năng biến hiểu biết thành việc làm cụ thể
4. **Results** — kết quả: đầu ra thực tế, mức độ hoàn thành mục tiêu, chất lượng công việc và tác động tạo ra cho tổ chức
5. **Synergy** — khả năng cộng hưởng: khả năng phối hợp với người khác, làm mạnh hệ thống, tạo giá trị vượt ra ngoài phần việc cá nhân

### Trong phòng khám nha khoa

- Bác sĩ không chỉ được đánh giá bằng số ca thực hiện, mà còn bằng chất lượng chỉ định, sự an toàn của người bệnh, khả năng giải thích để bệnh nhân hiểu, và tinh thần học hỏi sau mỗi ca điều trị
- Nhân sự tư vấn không chỉ được đánh giá bằng số lịch hẹn chốt được, mà còn bằng sự trung thực, chất lượng thông tin truyền đạt và mức độ tạo dựng niềm tin
- Quản lý không chỉ được đánh giá bằng khả năng đạt **KPI**, mà còn bằng việc đội ngũ dưới quyền có trưởng thành hơn hay không

> **S.T.A.R.S** vì thế là cơ chế giúp **Dental Empire OS** phân vai đúng hơn, đào tạo sâu hơn, đánh giá công bằng hơn và phát triển con người bền vững hơn.`
  },
  {
    id: 'b819ea62-a729-4bf4-afee-0bb83ccf5977',
    text: `## Đào tạo là hạ tầng của quản trị

Trong **Dental Empire OS**, đào tạo không phải là hoạt động phụ. **Đào tạo là hạ tầng của quản trị.**

Một tổ chức không thể kỳ vọng nhân sự hành xử đúng nếu chưa từng dạy họ thế nào là đúng. Không thể đòi hỏi nhân sự giữ văn hóa nếu văn hóa chỉ được nói trong vài buổi họp. Không thể yêu cầu đội ngũ tự vận hành nếu hệ thống chưa từng cung cấp cho họ bản đồ, tiêu chuẩn, phản hồi và lộ trình phát triển.

### Onboarding — Bắt đầu từ ngày đầu tiên

Đào tạo trong **Dental Empire OS** bắt đầu ngay từ ngày đầu tiên một nhân sự bước vào tổ chức. Người mới cần hiểu:

- Lịch sử hình thành phòng khám
- Giá trị lõi và trục đạo đức
- Nguyên tắc vận hành
- Vai trò của mình và cách phối hợp với người khác
- Những hành vi được xem là đúng chuẩn

> Họ không chỉ học việc. Họ học cách tổ chức này suy nghĩ, lựa chọn và hành động.

### Đào tạo liên tục — Không dừng ở onboarding

Một tổ chức sống cần đào tạo liên tục. Nhân sự cũ cũng cần được tái đào tạo — không phải vì họ quên hết, mà vì môi trường thay đổi, áp lực thay đổi, vai trò thay đổi và những vùng xám đạo đức cũng thay đổi.

### Công cụ đào tạo trong hệ thống

Các công cụ như handbook, onboarding, mentoring, self-audit, role mapping, monthly review, compensation logic hay performance dashboard không phải là phụ kiện. Chúng là phương tiện để tổ chức chuyển hóa văn hóa thành năng lực thật.

Đào tạo đúng nghĩa không chỉ tạo ra người biết làm. Nó tạo ra người biết hiểu, biết chọn, biết sửa, biết lớn lên và biết giữ chuẩn trong lúc hành động.`
  },
  {
    id: '4b400b79-a530-4ca2-982d-48e5aedbf5ce',
    text: `## Đo lường đúng cách

Một tổ chức muốn trưởng thành phải dám đo lường. Nhưng đo lường cũng có thể trở thành nguy hiểm nếu nó làm nghèo đi cách ta nhìn con người.

### Bốn bẫy khi đo lường một chiều

- Nếu chỉ đo doanh thu → tổ chức sẽ dễ tạo ra những hành vi chạy theo doanh thu
- Nếu chỉ đo số lượng → tổ chức sẽ dễ hy sinh chất lượng
- Nếu chỉ đo tốc độ → tổ chức sẽ dễ xem nhẹ sự cẩn trọng
- Nếu chỉ đo kết quả → tổ chức sẽ dễ bỏ qua cách kết quả ấy được tạo ra

**Dental Empire OS** không từ chối đo lường. Ngược lại, hệ thống này xem đo lường là điều bắt buộc. Nhưng đo lường phải được đặt trong một hệ giá trị đúng:

- **S.T.A.R.S** phải đi cùng **SKY**
- Hiệu suất phải được nhìn cùng với đạo đức
- Kết quả phải được nhìn cùng với hành vi
- Thưởng phạt phải xét cả năng lực lẫn phẩm chất
- **KPI** phải được soi bởi y đức
- Dữ liệu phải phục vụ sự thật, không phục vụ việc che đậy hay tô đẹp bề mặt

> Đo lường đúng giúp con người nhìn thấy mình rõ hơn. Đo lường đúng giúp tổ chức sửa lỗi công bằng hơn. Đo lường đúng giúp tăng trưởng không bị mù đường.

Trong ngành nha khoa, điều này có ý nghĩa sống còn. **Dental Empire OS** chọn con đường mà doanh thu đến từ sự tin cậy, chỉ định đúng và trải nghiệm tốt — không phải từ phóng đại vấn đề, tư vấn quá mức hay đẩy bệnh nhân vào quyết định chưa thật sự cần thiết.`
  },
  {
    id: 'e59b4c27-caca-4d9f-acf2-b3cfc9fac85f',
    text: `## Tinh thần Dental Empire OS

**Dental Empire OS** là một lời khẳng định rằng phòng khám nha khoa có thể được xây dựng như một tổ chức có linh hồn.

Linh hồn ấy không phải là cảm xúc mơ hồ. Nó được tạo nên từ:

- **Bản sắc** rõ ràng
- **Đạo đức** vững chắc
- **Năng lực** thực thi
- **Cơ chế** công bằng
- **Khả năng** học hỏi liên tục

### Phòng khám có linh hồn là nơi:

- Bệnh nhân cảm nhận được sự chân thật trong tư vấn
- Đội ngũ hiểu rằng mình không chỉ đang làm một công việc, mà đang tham gia vào một sứ mệnh chăm sóc con người
- Founder không chỉ xây doanh thu, mà xây một hệ thống có thể đứng vững ngay cả khi thị trường biến động
- Quy trình không làm con người trở nên máy móc, mà giúp con người hành động đúng hơn
- Dữ liệu không làm mất tính nhân bản, mà giúp tổ chức nhìn thấy sự thật để trưởng thành

**Dental Empire OS** không phủ nhận mục tiêu tăng trưởng. Nhưng:

- Tăng trưởng phải có **trục**
- Hiệu suất phải có **đạo đức**
- Mở rộng phải có **gốc rễ**
- Thịnh vượng phải có **phẩm giá**

### Đó là tinh thần của Dental Empire OS

- Khi **ROOTS** đủ sâu → tổ chức không bị bật gốc trước biến động
- Khi **ONE LIGHT** đủ sáng → tổ chức không đánh mất phương hướng trước cám dỗ
- Khi **SKY** đủ cao → con người còn biết ngước nhìn phẩm chất
- Khi **S.T.A.R.S** đủ rõ → năng lực được phát triển đúng hướng
- Khi **R.O.A.D.M.A.P** đủ chặt → toàn bộ hệ thống có con đường để đi, có vòng lặp để học và có cơ chế để trưởng thành

> Một phòng khám như vậy không chỉ lớn hơn. Nó đúng hơn. Không chỉ hiệu quả hơn. Nó đáng tin hơn. Không chỉ có nhiều bệnh nhân hơn. Nó xứng đáng hơn với niềm tin mà bệnh nhân trao gửi.`
  },
  {
    id: '56fea697-b9e3-4211-8fc4-c4c74a483943',
    text: `> **Lưu ý:**
>
> Trong tài liệu này, tôi sẽ sử dụng một số thuật ngữ tiếng Anh ở các phần của mô hình. Tôi làm vậy không phải để "làm màu" hay tạo cảm giác khó gần, mà vì trong bối cảnh quản trị, vận hành và phát triển hệ thống, nhiều khái niệm tiếng Anh đã trở thành cách gọi quen thuộc, ngắn gọn và chính xác hơn cho các anh chị bác sĩ, chủ phòng khám và đội ngũ quản lý.
>
> Tôi là người yêu tiếng Việt. Ở những chỗ có thể diễn đạt tự nhiên bằng tiếng Việt, tôi vẫn ưu tiên tiếng Việt. Tuy nhiên, với một số thuật ngữ như operating model, leadership, workflow, dashboard, **KPI**, **CRM** hay referral, việc dịch hoàn toàn sang tiếng Việt đôi khi làm mất độ chính xác, hoặc tạo ra những cách hiểu không thống nhất trong quá trình dùng thực tế.
>
> Tôi chọn dùng song song tiếng Việt và tiếng Anh khi cần thiết: tiếng Việt để dễ đọc, dễ cảm, dễ nắm ý; tiếng Anh để giữ nguyên nghĩa chuyên môn và giúp mô hình được hiểu đúng trong môi trường làm việc thực tế.
>
> Nói ngắn gọn, việc dùng thuật ngữ tiếng Anh ở đây là do nhu cầu về độ chuẩn của khái niệm, không phải để thể hiện.`
  },
  {
    id: 'd2c0f907-145f-42a2-989a-1e95f04c59c4',
    text: `## R.O.A.D.M.A.P — Từ lý tưởng đến kiến trúc

Nếu **SKY** trả lời câu hỏi "chúng ta phải giữ phẩm chất gì", **S.T.A.R.S** trả lời "chúng ta cần phát triển năng lực ra sao", thì **R.O.A.D.M.A.P** trả lời câu hỏi lớn hơn: **"làm thế nào để tất cả những điều đó trở thành một hệ điều hành thật sự?"**

### Điểm khác biệt quan trọng

- Nhiều tổ chức có giá trị, nhưng giá trị chỉ nằm trên tường
- Nhiều tổ chức có quy trình, nhưng quy trình không chạm được vào tinh thần
- Nhiều tổ chức có **KPI**, nhưng **KPI** không phản ánh phẩm chất
- Nhiều tổ chức có đào tạo, nhưng đào tạo không kết nối với chiến lược dài hạn

**Dental Empire OS** không muốn văn hóa sống tách rời khỏi vận hành. Trong hệ thống này:

- Mọi giá trị phải đi qua cơ chế
- Mọi cơ chế phải đi vào hành vi
- Mọi hành vi phải được phản ánh qua dữ liệu
- Mọi dữ liệu phải quay trở lại giúp tổ chức học hỏi, điều chỉnh và trưởng thành

### Bảy tầng của R.O.A.D.M.A.P

**R.O.A.D.M.A.P** chính là con đường đó:

1. Bắt đầu từ **ROOTS** — gốc rễ bản sắc
2. Đi qua **ONE LIGHT** — tâm gỗ đạo đức
3. Thức tỉnh bằng **AWAKEN** — năng lực tự soi chiếu
4. Đào sâu qua **DEEPEN** — chuẩn hóa năng lực và quy trình
5. Trưởng thành bằng **MATURE** — nâng tầng đội ngũ
6. Đồng bộ qua **ALIGN** — neo mục tiêu và nguồn lực
7. Tiến đến **PROSPER** — sự thịnh vượng có phẩm giá

> **R.O.A.D.M.A.P** không phải là sơ đồ để nhìn. Nó là một vòng lặp để sống. Mỗi tầng không tồn tại rời rạc, mà liên tục nuôi dưỡng tầng sau và phản hồi về tầng trước.

**Một tổ chức không thể thịnh vượng thật sự nếu nó mất gốc. Không thể lớn lên bền vững nếu tâm gỗ bên trong bị rỗng. Không thể trưởng thành nếu không biết tự soi chiếu. Không thể mở rộng nếu năng lực chưa được đào sâu. Không thể vận hành mạnh nếu các phần trong hệ thống không được đồng bộ.**

**R.O.A.D.M.A.P** vì thế là cơ chế biến lý tưởng thành kiến trúc, biến kiến trúc thành hành vi, và biến hành vi thành sự trưởng thành có thể đo lường.`
  }
];

console.log(`Updating ${UPDATES.length} blocks in Chapter 1...`);

for (let i = 0; i < UPDATES.length; i++) {
  const u = UPDATES[i];
  const sql = `UPDATE "block" SET "text_md" = '${u.text.replace(/'/g, "''")}' WHERE "id" = '${u.id}';`;
  const tmpFile = join(tmpdir(), `u1_${Date.now()}_${i}.sql`);
  writeFileSync(tmpFile, sql);
  try {
    execSync(
      `npx wrangler d1 execute ${DB} --remote --file "${tmpFile}"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    console.log(`  ✓ Block ${i + 1}/${UPDATES.length} updated`);
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

console.log(`\n✓ Chapter 1 beautified: ${UPDATES.length} blocks`);
