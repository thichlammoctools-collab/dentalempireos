import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const DB = 'dentalempireos-db';
const UPDATES = [
  {
    id: 'a77efd95-746a-4b00-b4d4-9363480a3258',
    text: `Mọi tổ chức đều có một "mã nguồn" vô hình đứng sau cách nó vận hành. Đó không phải là sơ đồ tổ chức, cũng không phải Dashboard hay **KPI**, mà là tầng tư duy quyết định người lãnh đạo nhìn thị trường như thế nào, phản ứng với biến động ra sao và lựa chọn phát triển bằng bản năng hay bằng hệ thống.

Với **Dental Empire**, tầng mã nguồn ấy được gọi là **Empire C++**: triết lý nền tảng định hình cách một phòng khám đi từ mô hình dịch vụ đơn lẻ trở thành một hệ sinh thái tăng trưởng có thương hiệu, có dữ liệu, có đội ngũ và có khả năng mở rộng dài hạn.

**Empire C++** không được xây trên sự ổn định, bởi thị trường chưa bao giờ thực sự ổn định. Nó được xây trên khả năng đọc đúng hai biến số có tính quyết định trong quản trị hiện đại: **Change** và **Chance**.

**Change** là sự thay đổi liên tục của bối cảnh: hành vi bệnh nhân dịch chuyển, tiêu chuẩn trải nghiệm tăng cao, truyền thông thay đổi luật chơi, công nghệ lâm sàng phát triển, và áp lực cạnh tranh không ngừng tái cấu trúc mặt bằng thị trường.

**Chance** là lớp cơ hội chỉ xuất hiện với những tổ chức đủ nhạy bén để nhìn thấy khoảng trống, đủ chuẩn bị để hành động, và đủ nội lực để biến cơ hội thành lợi thế thật.

Vì vậy, điều phân tách một phòng khám bình thường với một **Dental Empire** không nằm ở việc ai chạy quảng cáo tốt hơn trong ngắn hạn. Sự khác biệt nằm ở chỗ ai xây được một hệ tư duy có thể thích ứng nhanh hơn, quyết định đúng hơn và cải tiến đều đặn hơn.

> Trong ngôn ngữ quản trị của **Dental Empire**, ký hiệu "**++**" không mang ý nghĩa trang trí. Nó đại diện cho nguyên tắc tăng trưởng gia tăng liên tục: tốt hơn một chút mỗi ngày, rõ hơn một chút mỗi tuần, mạnh hơn một chút mỗi tháng.

Một tổ chức chỉ có thể tăng trưởng bền vững khi người đứng đầu không điều hành bằng cảm xúc tức thời, mà bằng một lớp nhận thức đủ vững để dẫn dắt thay đổi thay vì chạy theo thay đổi.

**Để thực thi được điều này, Dental Empire cần nhiều lớp hệ điều hành chạy đồng thời:**

- **Data OS** — nhìn thấy sự thật thay vì đoán định bằng cảm giác
- **Finance OS** — tạo vùng an toàn tài chính và duy trì quyền chủ động trước cơ hội
- **People OS**, **S.T.A.R.S** và **S3** — biến năng lực cá nhân thành năng lực tổ chức

Khi những lớp này kết nối với nhau, tổ chức không còn phụ thuộc tuyệt đối vào Founder, không tăng trưởng bằng may mắn, và không bị kéo lệch bởi những biến động ngắn hạn của thị trường.

---

**Empire C++ MANTRA**

> Thế giới luôn thay đổi.
>
> Cơ hội không đến với tổ chức phản ứng chậm, mà đến với tổ chức đã chuẩn bị từ trước.
>
> Vì vậy, người lãnh đạo phải liên tục quan sát, liên tục tái cấu trúc và liên tục phát động những bước tăng trưởng nhỏ nhưng chính xác.
>
> Khi tư duy được lập trình đúng, hệ thống sẽ vận hành đúng.
>
> Khi hệ thống vận hành đúng, tăng trưởng sẽ không còn là may mắn, mà trở thành kết quả tất yếu của một tổ chức biết tiến hóa.`
  },
  {
    id: 'ff0ad62b-84ee-4dcb-b572-3e1ba554b8fe',
    text: `**Thị trường nha khoa đang bước vào một pha chuyển dịch có tính cấu trúc.**

Nếu giai đoạn trước được dẫn dắt chủ yếu bởi quảng cáo, khuyến mãi và khả năng mua lưu lượng truy cập, thì giai đoạn hiện tại đang dịch chuyển sang một mô hình cạnh tranh tinh vi hơn: cạnh tranh bằng **niềm tin**, **trải nghiệm** và **năng lực vận hành hệ thống**.

Sự thay đổi này không diễn ra vì quảng cáo mất tác dụng, mà vì khách hàng ngày càng có nhiều công cụ để kiểm chứng thông tin, so sánh lựa chọn và đánh giá độ tin cậy của phòng khám trước khi ra quyết định.

Nói cách khác, thị trường không còn thưởng nhiều cho đơn vị chỉ biết thu hút sự chú ý. Thị trường bắt đầu thưởng cho đơn vị biết chuyển sự chú ý đó thành **uy tín**, rồi chuyển uy tín thành **trải nghiệm thật**, và cuối cùng tích lũy trải nghiệm ấy thành **tài sản thương hiệu** dài hạn.

> Đó là lý do vì sao cùng một ngân sách marketing, có phòng khám chỉ mua được **lead** ngắn hạn, còn có phòng khám lại xây được một vòng quay tăng trưởng bền vững dựa trên **review**, **referral**, cộng đồng bệnh nhân và sự hiện diện số đồng nhất.`
  },
  {
    id: '9793b879-b31b-446f-84e8-03c70f5f46da',
    text: `Tôi viết chương này không phải để kể chuyện khó khăn cho có, mà để gọi đúng tên những điều mà rất nhiều phòng khám đang âm thầm đi qua mỗi ngày.

Có thể mỗi nơi một kiểu, mỗi người một vị trí, nhưng cảm giác chung thì rất giống nhau: phòng khám nào cũng đang chạy, nhưng không phải phòng khám nào cũng đang thật sự đi lên.

Và chính vì nó không ồn ào, nên nỗi đau này thường bị xem nhẹ cho đến khi đã thành nếp.

Điều tôi nhận ra khi đi làm cho các phòng khám đó là: **nỗi đau của chủ phòng khám không đứng riêng, nỗi đau của đội ngũ không đứng riêng, và nỗi đau của vận hành cũng không đứng riêng.** Chúng nối với nhau thành một chuỗi rất chặt:

- Khi hệ thống không rõ → con người sẽ mệt mỏi
- Khi con người mệt mỏi → hệ thống lại càng lệch
- Khi cả hai cùng lệch → phòng khám bắt đầu trả giá bằng thời gian, tiền bạc, tinh thần và cả cơ hội tăng trưởng

> Tôi vẫn nghĩ, một phòng khám chỉ thật sự lớn lên khi nó dám nhìn thẳng vào những chỗ đang làm mình mệt nhất. Không phải để trách ai, mà để biết mình đang sửa cái gì, và vì sao mình phải sửa từ gốc.`
  },
  {
    id: '214ed2db-daf4-4db3-877c-3f42de858ed6',
    text: `Có một sự thật mà chỉ khi ngồi ở vị trí **chủ phòng khám**, người ta mới cảm hết được: làm chủ không phải lúc nào cũng là cảm giác tự do, mà nhiều khi là cảm giác phải chịu trách nhiệm cho tất cả những thứ không nằm gọn trong chuyên môn.

Chủ phòng khám không chỉ nghĩ về ca điều trị hay chất lượng chuyên môn. Họ còn phải nghĩ về doanh thu, chi phí, lương, mặt bằng, thiết bị, marketing, nhân sự, khiếu nại, và cả những ngày mà phòng khám vẫn đông nhưng cảm giác vẫn chưa an toàn.

### Hai áp lực kéo cùng lúc

Một bên là **áp lực tài chính** rất thật: chi phí tăng, biên lợi nhuận mỏng, bệnh nhân nhạy cảm hơn với giá và bảo hiểm, còn các khoản đầu tư công nghệ và vận hành thì không thể trì hoãn mãi.

Một bên là **áp lực tổ chức**: giữ người, giữ văn hóa, giữ chuẩn làm việc, giữ sự ổn định để phòng khám không vận hành bằng cảm xúc.

Hai áp lực này kéo cùng lúc, nên chủ phòng khám rất dễ rơi vào trạng thái lúc nào cũng phải ra quyết định, nhưng hiếm khi được thật sự thở.

### Sự thật khó nói

Càng muốn phòng khám đi xa, càng phải chấp nhận rằng mình không thể là trung tâm của mọi thứ mãi. Nếu cứ quen với việc mình là người quyết cuối cùng, người chữa cháy cuối cùng, người sửa sai cuối cùng, thì phòng khám sẽ lớn lên theo cách rất mệt.

> Làm chủ vì thế không chỉ là nắm quyền, mà là học cách xây một hệ thống để mình không phải gồng mọi thứ bằng chính sức mình.

### Nỗi đau nằm ở đâu?

Nỗi đau làm chủ không chỉ nằm ở tiền hay ở áp lực điều hành. Nó nằm ở chỗ người chủ phải sống với một câu hỏi rất dài: làm sao để phòng khám vừa có doanh thu, vừa có trật tự, vừa có niềm tin, vừa có tương lai.

Khi câu hỏi đó chưa có lời giải rõ ràng, người làm chủ sẽ luôn cảm thấy mình đang cầm lái một con tàu có tốc độ, nhưng chưa chắc có bản đồ.`
  },
  {
    id: '5758cf2b-f14b-4b70-b16f-f78ab0f230fa',
    text: `Nếu làm chủ là mang trên vai trách nhiệm của cả một hệ thống, thì **làm thuê** trong phòng khám lại là một kiểu mệt rất khác: mệt vì phải chạy trong một hệ thống chưa chắc đã rõ, nhưng vẫn phải giữ cho mình đủ ổn, đủ nhanh, đủ đúng và đủ chịu đựng.

Người làm thuê thường không cầm toàn bộ bức tranh tài chính hay chiến lược, nhưng họ lại là người chạm vào phần nặng nhất của công việc mỗi ngày: lịch hẹn, khách hàng, bàn giao, nhắc việc, xử lý phát sinh. Và cũng là người cảm nhận sớm nhất khi hệ thống bắt đầu có vấn đề.

### Ba lớp mệt của người làm thuê

**1. Mệt vì phải đoán ý**

Tôi từng thấy rất nhiều nhân sự đi làm trong một trạng thái khá giống nhau: làm hết sức nhưng không thấy yên tâm. Họ sống trong một môi trường mà quy trình chưa đủ rõ, vai trò chưa đủ minh bạch, và tiêu chuẩn thì thay đổi theo người quản lý.

Hôm nay làm như thế này là đúng, mai có thể lại bị nhắc là chưa đủ. Cái mệt của người làm thuê nằm ở chỗ phải đoán ý quá nhiều, trong khi công việc lẽ ra nên được dẫn bằng chuẩn.

**2. Mệt vì không thấy đường đi**

Nhiều người đi làm không chỉ cần tiền, họ cần nhìn thấy một lối lên, một sự ghi nhận, một tương lai mà mình có thể lớn dần. Nhưng trong nhiều phòng khám, người làm tốt chưa chắc đã được nhìn thấy đúng, còn người làm chưa phù hợp lại có thể tồn tại khá lâu nếu họ khéo, quen, hoặc được bao che bởi sự ngại va chạm.

Điều đó làm đội ngũ rất nhanh chán, vì họ cảm nhận rằng công sức của mình không được đặt trong một hệ thống công bằng.

**3. Mệt vì không có quyền thay đổi**

Người làm thuê thường là người chịu áp lực trực tiếp từ khách, từ sếp và từ nhịp công việc, nhưng lại ít có quyền thay đổi hệ thống khiến họ mệt.

Họ phải làm nhanh hơn, khéo hơn, mềm hơn, kiên nhẫn hơn — trong khi không phải lúc nào cũng có đủ công cụ, đủ phần mềm, đủ quy trình, đủ sự hỗ trợ để làm cho tử tế.

> Dần dần, họ không còn làm bằng sự chủ động nữa, mà làm bằng phản xạ tự vệ: làm sao cho qua, cho an toàn, cho ít bị nhắc nhất. Và khi một đội ngũ bắt đầu làm việc theo kiểu đó, phòng khám sẽ mất đi sự sống động rất quan trọng của một tổ chức khỏe.

### Nỗi đau lớn nhất

Người làm thuê thường không muốn đi, nhưng cũng không thấy đủ lý do để ở lại lâu. Họ muốn một nơi có trật tự, có tôn trọng, có đường đi rõ, và có cảm giác mình đang lớn lên cùng công việc.

Sự rời đi không phải lúc nào cũng ồn ào. Nó đến âm thầm bằng sự giảm nhiệt, bằng thái độ làm cho xong, rồi cuối cùng là rời khỏi phòng khám lúc nào không ai kịp nhận ra.`
  },
  {
    id: '2c8025a5-6d78-40c2-8ac4-a290d80947f0',
    text: `Khi nhìn toàn bộ phòng khám từ góc độ vận hành, nỗi đau thật sự không nằm riêng ở một bộ phận nào. Nó nằm ở chỗ **cả hệ thống đang phải chạy trong cùng một lực kéo**:

- **Chủ** thì áp doanh thu và giữ an toàn tài chính
- **Đội ngũ** thì chịu áp lực việc làm và cảm xúc
- **Người làm vận hành** thì phải ghép tất cả lại thành một dòng chảy đủ mượt để khách không thấy đứt gãy

Nói cách khác, nỗi đau vận hành chung là nơi hai nỗi đau kia gặp nhau và hiện hình thành những chuyện rất cụ thể: **lịch hẹn, bàn giao, chờ đợi, báo cáo, follow-up**.

### Vòng xoắn tiêu cực

Một sự thật rất rõ trong các phòng khám:

- Hệ thống không rõ → con người mệt mỏi
- Con người mệt mỏi → hệ thống càng rối
- Hệ thống càng rối → cả ba phía đều trả giá

> Khi phòng khám dùng Zalo cho công việc, giao việc bằng miệng, báo cáo bằng ảnh chụp, và xử lý mọi thứ theo cảm tính, thì cả chủ, nhân sự lẫn vận hành đều đang phải trả giá cho cùng một sự thiếu chuẩn.

### Nỗi đau nhỏ nhưng liên tục

Đáng lo nhất là nỗi đau vận hành chung thường không bùng lên thành một biến cố lớn ngay lập tức. Nó đi vào phòng khám bằng những thứ rất nhỏ:

- Một người quên follow-up
- Một lịch không được xác nhận đúng
- Một bàn giao không đủ rõ
- Một ca điều trị bị chậm
- Một khách phải hỏi lại nhiều lần

Mỗi lỗi nhìn qua tưởng riêng lẻ, nhưng cộng lại tạo ra một cảm giác: **phòng khám luôn bận, nhưng không bao giờ thật sự gọn**.

### Vì sao ba phần này phải đặt cạnh nhau

Nỗi đau làm chủ cho thấy áp lực từ phía quyết định. Nỗi đau làm thuê cho thấy áp lực từ phía thực thi. Còn nỗi đau vận hành chung cho thấy hai áp lực đó đang đi qua hệ thống như thế nào.

Khi nhìn riêng lẻ, ta dễ nghĩ vấn đề nằm ở người này hay người kia. Khi nhìn cùng một lúc, ta sẽ thấy vấn đề thật sự là **sự thiếu một cấu trúc đủ rõ** để mọi người có thể làm việc cùng nhau mà không phải mỏi quá nhiều.

> Vì thế, chuẩn hóa vận hành không còn là chuyện "làm cho đẹp". Nó là cách duy nhất để giảm ma sát giữa chủ, đội ngũ và hệ thống — để chủ bớt gánh, người làm thuê bớt mỏi, và phòng khám có thể lớn lên mà không tự làm nặng chính mình.`
  },
  {
    id: '4780783e-747b-468b-b433-011fb526948a',
    text: `Sau khi đã đi qua những nỗi đau của phòng khám, câu hỏi tiếp theo không còn là "chúng ta đã cố gắng đủ chưa", mà là **"chúng ta đang chạy trên một hệ điều hành nào"**.

Bởi trong bất kỳ hệ thống nào, **phần cứng tốt chưa bao giờ là đủ**. Phần cứng chỉ là điều kiện ban đầu; thứ quyết định trải nghiệm cuối cùng lại nằm ở phần mềm — ở cách các lớp bên dưới được thiết kế, kết nối và vận hành với nhau.

Một phòng khám cũng vậy: cùng mặt bằng, cùng thiết bị, cùng đội ngũ, nhưng nếu nền vận hành khác nhau thì trải nghiệm tạo ra sẽ rất khác nhau cho khách hàng.`
  },
  {
    id: 'f4fb7da0-7c8a-42d5-ab02-2b8fc18c68e3',
    text: `Tôi thường dùng hình ảnh một chiếc điện thoại để nghĩ về điều này.

**Phần cứng** có thể giống nhau trên cùng một dòng máy, nhưng trải nghiệm lại khác nhau rất nhiều chỉ vì **phần mềm** bên trong khác nhau.

- **iPhone** là ví dụ cho một hệ sinh thái được kiểm soát chặt: hệ điều hành, ứng dụng và tiêu chuẩn vận hành được thiết kế đồng bộ, nên máy cho cảm giác mượt, ổn định và nhất quán hơn.
- **Android** rộng mở hơn, linh hoạt hơn, nhiều lựa chọn hơn, nhưng mức độ tối ưu và độ đồng đều giữa các thiết bị có thể khác nhau rất lớn.

### Áp dụng vào phòng khám

Một tổ chức cũng vận hành như một chiếc máy có hệ điều hành riêng:

- **Phần cứng** = mặt bằng, thiết bị, ngân sách và con người
- **Phần mềm** = cách hệ thống giao tiếp, cách quy trình được nối với nhau, cách dữ liệu được ghi nhận, và cách toàn bộ phòng khám tạo ra một nhịp vận hành có liền lạc hay không

**Dental Empire OS** chính là lớp phần mềm đó — một hệ điều hành đủ chuẩn để nâng cấp phòng khám cũ, hoặc cài mới ngay từ đầu cho một dự án hoàn toàn mới.

> Từ đó, mỗi nhân sự trong tổ chức cũng giống như một ứng dụng được cài lên hệ điều hành. Ứng dụng tốt không chỉ cần mạnh; nó còn phải tương thích với nền tảng mà nó chạy trên.

**iPhone tự tạo ra sự sàng lọc** — người phù hợp chạy rất mượt, người không phù hợp sẽ tự bộc lộ rất nhanh. Một tổ chức có hệ điều hành tốt sẽ tự khắt khe với chất lượng con người, chất lượng quy trình và chất lượng thực thi của chính mình.

Vì vậy, tôi không nhìn phòng khám như một tập hợp những công việc rời rạc cần vá lại. Tôi nhìn nó như một hệ thống cần được cài đúng nền tảng để con người, quy trình, dữ liệu và tăng trưởng có thể tương thích với nhau.

> Khi nền tảng đủ tốt, phòng khám không chỉ chạy được. Nó bắt đầu chạy êm, chạy sâu và chạy dài.`
  },
  {
    id: 'fc39ed3f-ace9-4b8f-b133-e523a1276d88',
    text: `Từ góc nhìn của một con người, điều này càng dễ nhận ra hơn.

Mỗi người đều mang trong mình một **hệ điều hành riêng** — đó là **tâm** và **trí**:

- Khả năng phân biệt thật - giả, đúng - sai, nên - không nên
- Khả năng phân tích, phân biệt, cảm xúc và hành động

Khi tâm an, trí sáng, con người không còn phải tiêu hao quá nhiều năng lượng cho sự rối loạn bên ngoài. Họ trở nên trật tự hơn, ít bị cuốn vào nhiễu động hơn, và ra quyết định ổn định hơn — làm việc hiệu quả hơn và sống hạnh phúc hơn.`
  },
  {
    id: '743624ac-fdb3-4233-884d-162869d44c9d',
    text: `Trong một tổ chức cũng vậy. Tổ chức mạnh không chỉ cần người giỏi, mà cần một nền tảng đủ chuẩn để người phù hợp chạy rất mượt, còn người không tương thích sẽ tự bộc lộ rất nhanh.

> Tổ chức không chỉ tuyển người; tổ chức còn "chọn" người thông qua chính hệ điều hành của mình.

Khi hệ điều hành đủ tốt, nó không chỉ sắp xếp công việc. Nó sắp xếp cả nhịp sống, chất lượng hiện diện và cách con người đóng góp vào điều lớn hơn chính họ.

Tôi không nhìn **Dental Empire OS** như một khái niệm kỹ thuật đơn thuần. Tôi nhìn nó như một **hệ điều hành sống**:

- **Đủ rõ** để dẫn dắt con người
- **Đủ chặt** để bảo vệ tiêu chuẩn
- **Đủ linh hoạt** để phòng khám có thể lớn lên mà không vỡ cấu trúc

Khi hệ điều hành ấy được cài đúng, tổ chức không còn phải phụ thuộc quá nhiều vào cảm tính của từng cá nhân. Nó bắt đầu có một nhịp riêng, một logic riêng, và một khả năng tự vận hành sâu hơn chính nỗ lực của con người ở bên trong nó.`
  },
  {
    id: 'bdf677af-4408-4208-ae1f-79fe6bae63bc',
    text: `Thế giới không thay đổi trong một lần, mà đi qua nhiều lớp thời gian khác nhau.

Để hiểu vì sao doanh nghiệp hiện đại cần một **hệ điều hành tổ chức**, trước hết phải nhìn bối cảnh theo bốn mốc: **VUCA → BANI → TUNA → HAI**.

Đây là bốn cách gọi cho bốn giai đoạn mà môi trường sống, làm việc và quản trị ngày càng phức tạp hơn:

| Era | Mô tả |
|-----|--------|
| **VUCA** | Thế giới bắt đầu trở nên biến động và khó đoán |
| **BANI** | Hệ thống và con người cùng trở nên mong manh, lo âu và khó hiểu |
| **TUNA** | Tốc độ của cái mới và mức độ hỗn loạn ngày càng lớn |
| **HAI** | AI đã đi từ vai trò công cụ sang vai trò hạ tầng vận hành mới |`
  },
  {
    id: 'c3ced822-cb36-445e-9f51-16e681d1ef54',
    text: `**VUCA** là viết tắt của **Volatility, Uncertainty, Complexity, Ambiguity** — nghĩa là biến động, bất định, phức tạp và mơ hồ.

Khái niệm này thường được gắn với bối cảnh hậu Chiến tranh Lạnh, đặc biệt từ cuối thập niên 1980 trở đi, khi thế giới bắt đầu vận hành trong một trật tự ít ổn định hơn và khó dự đoán hơn.

### Đặc điểm của thời VUCA

Trong giai đoạn VUCA, các tổ chức nhận ra rằng kế hoạch dài hạn cứng nhắc không còn đủ hiệu quả. Một thị trường có thể thay đổi chỉ sau một biến động nhỏ về công nghệ, chính trị, hành vi người tiêu dùng hoặc cạnh tranh.

Điều này khiến doanh nghiệp phải học cách linh hoạt hơn, phản ứng nhanh hơn và giảm phụ thuộc vào giả định ổn định.

**VUCA không nói rằng mọi thứ vô vọng.** Nó nói rằng môi trường đã trở nên khó đoán hơn và tổ chức phải chuyển từ tư duy kiểm soát sang tư duy thích nghi.

Đây là bước đầu tiên khiến lãnh đạo bắt đầu quan tâm nhiều hơn đến khả năng điều chỉnh liên tục thay vì chỉ dựa vào kinh nghiệm quá khứ.`
  },
  {
    id: '6cef1e3c-ef62-41be-b7cf-4a552399f06a',
    text: `**BANI** là viết tắt của **Brittle, Anxious, Nonlinear, Incomprehensible** — nghĩa là mong manh, lo âu, phi tuyến tính và khó hiểu.

Nếu **VUCA** mô tả bối cảnh bên ngoài, thì **BANI** đi sâu hơn vào trạng thái bên trong của hệ thống và con người. Khái niệm này được phổ biến mạnh từ cuối thập niên 2010 và được nhắc đến rộng hơn trong giai đoạn 2020s.

### Đặc điểm của thời BANI

Ở giai đoạn BANI, nhiều tổ chức trông có vẻ mạnh nhưng thực ra rất dễ gãy:

- Một cú sốc nhỏ có thể làm lộ ra điểm yếu lớn
- Một thay đổi trong tâm lý nhân sự có thể ảnh hưởng đến cả đội ngũ
- Một sự kiện không lớn vẫn có thể dẫn đến hệ quả rất lớn, vì quan hệ nhân quả không còn theo đường thẳng như trước

### Con người là biến số trung tâm

BANI cũng cho thấy con người là biến số trung tâm của quản trị. Nhân viên không chỉ cần kỹ năng, mà còn cần sự rõ ràng, an toàn tâm lý và khả năng xử lý áp lực.

> Vì thế, lãnh đạo ở giai đoạn này không còn là người ra lệnh theo kiểu trên xuống, mà phải là người tạo kiên cường, giảm lo âu và giúp tổ chức hiểu được chính sự phức tạp của nó.

Thời BANI là thời của **quản trị kiên cường**: không chỉ thích nghi, mà còn phải hấp thụ được áp lực và giữ cho hệ thống không sụp đổ.`
  },
  {
    id: '478eaa91-13b6-49e7-a74b-c6d360c2fe23',
    text: `**TUNA** mô tả môi trường **Turbulent, Uncertain, Novel, Ambiguous** — tức hỗn loạn, bất định, mới lạ và mơ hồ.

TUNA được dùng nhiều trong các thảo luận gần đây để nhấn mạnh một đặc điểm rất quan trọng của thập niên 2020: **cái mới xuất hiện liên tục và tốc độ thay đổi ngày càng cao.**

### Đặc điểm của thời TUNA

Nếu VUCA nói rằng thế giới khó dự đoán, thì TUNA nói thêm rằng thế giới còn đang sinh ra những thứ chưa từng có trước đó:

- Công nghệ mới, nền tảng mới, hành vi tiêu dùng mới
- Công cụ mới và mô hình kinh doanh mới xuất hiện với tốc độ lớn

Điều này làm cho "biết thích nghi" chưa đủ. Tổ chức còn phải **"biết thử nghiệm"** và **"biết học nhanh"**.

### Chiến lược không thể cứng như trước

TUNA cũng là lời nhắc rằng chiến lược không thể cứng. Các tổ chức hiện đại phải:

- Chia nhỏ nhịp quản trị
- Liên tục kiểm tra giả định
- Chấp nhận rằng một số quyết định chỉ có thể tối ưu trong ngắn hạn

> Trong giai đoạn TUNA, lợi thế thuộc về tổ chức có **nhịp học nhanh hơn**, chứ không chỉ nhiều nguồn lực hơn.`
  },
  {
    id: '410a0eb4-892b-46cd-bf92-b87591b73644',
    text: `**HAI (Human-AI)** là cách gọi phù hợp cho giai đoạn mà AI trở thành **hạ tầng vận hành mới**.

Nếu ba giai đoạn trước chủ yếu mô tả mức độ bất định của thế giới, thì HAI mô tả một tầng thay đổi khác: **con người không còn làm việc một mình**, mà phải làm việc cùng trí tuệ nhân tạo, dữ liệu và tự động hóa.

### Từ 2024 đến nay

AI không còn là một công cụ phụ trợ để thử nghiệm. Nó đi vào:

- Tìm kiếm và phân tích
- Tạo nội dung
- Hỗ trợ chăm sóc khách hàng
- Dự báo và tối ưu quy trình

Điều này làm thay đổi bản chất năng lực cạnh tranh: không chỉ cần người giỏi, mà cần một hệ thống biết dùng AI để khuếch đại năng lực của người giỏi.

### HAI đặt ra yêu cầu mới

Nếu cấu trúc không rõ, dữ liệu không sạch và quy trình không thống nhất, AI sẽ không tạo ra trật tự mà chỉ làm hỗn loạn nhanh hơn.

> Vì vậy, HAI không chỉ là "dùng AI", mà là xây một **hệ điều hành đủ chuẩn** để AI có thể trở thành một phần của vận hành thông minh.`
  },
  {
    id: '8ab75c52-d95a-4b06-a262-43b1c7a86b70',
    text: `**Nhìn theo trục thời gian, bốn giai đoạn nối tiếp nhau:**

- **VUCA** — thế giới bắt đầu bất ổn
- **BANI** — hệ thống và con người bắt đầu mong manh hơn
- **TUNA** — cái mới xuất hiện nhanh hơn khả năng thích ứng của mô hình cũ
- **HAI** — AI bước vào lõi vận hành của tổ chức

**Điểm chung của cả bốn giai đoạn**

Mô hình quản trị cũ không còn đủ. Doanh nghiệp không thể chỉ dựa vào cảm tính, vài quy trình rời rạc hay một vài cá nhân xuất sắc.

Họ cần một hệ điều hành tổ chức có khả năng:

- **Giữ bản sắc** — không đổi thay theo thời cuộc
- **Phân vai rõ** — ai làm gì, ai chịu trách nhiệm gì
- **Đo lường được** — có KPI, có dữ liệu, có feedback
- **Phản hồi nhanh** — thích ứng kịp thời
- **Học từ thực tế** — liên tục cải tiến dựa trên data`
  },
  {
    id: 'cbf0b748-b267-47d0-b616-f27a59dbf44d',
    text: `Ở thời **VUCA**, mô hình phù hợp là **VUCA Prime** — một phản ứng lãnh đạo nhằm đối trọng với chính bốn đặc tính của VUCA bằng:

- **Vision** — tầm nhìn rõ
- **Understanding** — hiểu đúng bối cảnh
- **Clarity** — làm mọi thứ đơn giản hơn
- **Agility** — giữ được sự linh hoạt trong hành động

Nói đơn giản: khi thế giới biến động và khó đoán, tổ chức cần có tầm nhìn rõ, hiểu đúng bối cảnh, làm mọi thứ đơn giản hơn và giữ được sự linh hoạt.

> Đây là giai đoạn quản trị để thích nghi với biến động, nhưng vẫn còn dựa khá nhiều vào lãnh đạo con người, cấu trúc tương đối ổn định và khả năng phản ứng nhanh.`
  },
  {
    id: '2881e818-8c70-4ac5-ba2c-1fa757f49e84',
    text: `Sang thời **BANI**, mô hình quản trị chuyển sang **Adaptive Leadership** và **Resilient Organization** — vì vấn đề không còn chỉ là biến động, mà là:

- Hệ thống trở nên mong manh
- Con người lo âu
- Kết quả phi tuyến tính

Ở giai đoạn này, tổ chức cần:

- **An toàn tâm lý** — để nhân viên dám nói, dám thử
- **Phản hồi nhanh** — thích ứng kịp thời
- **Năng lực xử lý khủng hoảng** — chuẩn bị cho những cú sốc không lường trước
- **Văn hóa học liên tục** — không bị gãy khi gặp cú sốc

> Thời BANI là thời của **quản trị kiên cường**: không chỉ thích nghi, mà còn phải hấp thụ được áp lực và giữ cho hệ thống không sụp đổ.`
  },
  {
    id: 'd2fd4a03-ac0c-45a4-be02-3570833b2d73',
    text: `Ở thời **TUNA**, mô hình phù hợp là **Agile Management** hoặc **Experimental Operating Model** — dựa trên ba nguyên tắc:

- **Thử nghiệm** — thử nhanh, sai sớm, học sớm
- **Học nhanh** — rút kinh nghiệm từ thực tế, không từ giả định
- **Cải tiến liên tục** — luôn có nhịp để tốt lên

### Tại sao kế hoạch cứng không còn phù hợp

Vì cái mới xuất hiện quá nhanh, tổ chức không thể giữ kế hoạch cứng quá lâu. Họ phải:

- Chia nhỏ nhịp quản trị
- Kiểm tra giả định thường xuyên
- Ra quyết định ngắn hạn hơn

> Đây là giai đoạn mà tổ chức cần quản trị để **học nhanh hơn thay đổi**, chấp nhận thử-sai có kiểm soát thay vì cố tối ưu một lần cho thật hoàn hảo.`
  },
  {
    id: 'c3371c1c-8e24-4df6-9099-29f0d50701d4',
    text: `Ở thời **HAI**, mô hình quản trị chuyển sang **AI-Augmented OS** — hệ điều hành mà AI không thay thế con người, nhưng tăng cường khả năng của con người trong:

- **Ra quyết định** — AI hỗ trợ phân tích, con người quyết định
- **Tổ chức công việc** — AI tự động hóa những gì có thể tự động
- **Tạo giá trị** — AI mở rộng năng lực, không thay thế sáng tạo

### Operating model thời AI phải thay đổi

Các operating model thời AI phải thay đổi về:

- **Cấu trúc** — AI là một lớp xuyên suốt, không phải phòng ban
- **Vai trò** — nhân sự chuyển từ thực thi sang giám sát và điều phối
- **Trách nhiệm** — rõ ai chịu trách nhiệm cho quyết định do AI hỗ trợ
- **Năng lực** — cần kỹ năng prompt, đọc output, kiểm chứng
- **Văn hóa** — AI là đồng minh, không phải đối thủ

> Nói cách khác, đây là thời kỳ quản trị để **phối hợp người - dữ liệu - AI**, trong đó AI trở thành một phần của hệ thống chứ không chỉ là công cụ phụ trợ.`
  },
  {
    id: '1fd3b0f3-3cb5-499a-a774-8016062846a7',
    text: `**Không có một mô hình quản trị duy nhất cho mọi thời đại.** Mỗi thời kỳ có một logic vận hành riêng, và tổ chức chỉ có thể tồn tại bền vững nếu biết chuyển đúng lúc:

> VUCA Prime → Adaptive Leadership → Agile Operating Model → AI-Augmented OS

**Nhưng giữa mọi sự thay đổi ấy, vẫn có những giá trị bất biến:**

- Sự chân thành
- Đạo đức
- Chất lượng chuyên môn
- Niềm tin với bệnh nhân
- Tinh thần tôn trọng con người

Còn mô hình, quy trình, công cụ, cách phối hợp và cách ra quyết định thì phải thay đổi theo thời cuộc.

### Đặc biệt đúng trong ngành nha khoa

Tăng trưởng không thể chỉ dựa vào may mắn, tay nghề cá nhân hay một giai đoạn đầu thuận lợi. Khi phòng khám còn nhỏ, chủ phòng khám có thể tự xoay xở bằng kinh nghiệm, mối quan hệ và sự linh hoạt cá nhân. Nhưng khi bước sang giai đoạn phát triển, mọi thứ đòi hỏi một hệ thống có thể **lặp lại, đo lường và nhân rộng**.

**Dental Empire OS** không phải là một bộ công cụ rời rạc. Nó là một **hệ điều hành được xây để giữ vững phần bất biến và thay đổi phần cần thay đổi** — để phòng khám không chỉ sống qua giai đoạn khởi đầu, mà còn có thể đi xa, đi lâu và đi bền.`
  },
  {
    id: '9c3f4c75-5fe8-4876-9da9-9790f72382f9',
    text: `Trong nhiều năm, **quảng cáo** là công cụ tăng trưởng nhanh và dễ nhìn thấy nhất. Chỉ cần nội dung bắt mắt, ưu đãi hấp dẫn và ngân sách đủ mạnh, phòng khám có thể tạo ra dòng khách tương đối ổn định trong ngắn hạn.

Tuy nhiên, khi số lượng lựa chọn tăng lên và người dùng trở nên thận trọng hơn với các quyết định liên quan đến sức khỏe, hiệu quả của mô hình "đẩy thông điệp để lấy lịch hẹn" bắt đầu giảm dần.

**Khách hàng hôm nay không còn quyết định chỉ vì một lời hứa hấp dẫn.** Họ muốn biết:

- Ai là người điều trị?
- Chuyên môn có đủ sâu không?
- Kết quả có kiểm chứng được không?
- Quy trình có minh bạch không?
- Sau điều trị họ có được chăm sóc tử tế hay không?

Trong bối cảnh đó, **niềm tin trở thành đơn vị cạnh tranh mới.** Phòng khám không còn chỉ bán một dịch vụ nha khoa, mà đang bán một **cam kết tổng thể** về chuyên môn, sự an toàn, tính rõ ràng trong tư vấn và chất lượng trải nghiệm từ đầu đến cuối.

**Những yếu tố từng bị xem là "phụ trợ" nay đã trở thành tài sản chiến lược:**

- Hồ sơ bác sĩ
- Case điều trị thật
- **Review** thật
- Hình ảnh phòng khám
- Website rõ ràng
- Google Business Profile đầy đủ
- Khả năng phản hồi nhanh, nhất quán trên các kênh số

> Trong môi trường mới, đây không chỉ là vật liệu truyền thông. Đây là **hạ tầng niềm tin** của toàn bộ hệ thống tăng trưởng.`
  },
  {
    id: '0ae11a69-f515-4f10-9358-5020628e2f01',
    text: `Hành trình ra quyết định của khách hàng nha khoa hiện nay **dài hơn, phân mảnh hơn và ít tuyến tính hơn** trước.

Một video ngắn có thể tạo ra sự chú ý ban đầu, nhưng rất hiếm khi đủ để tạo ra quyết định đặt lịch ngay lập tức.

### Hành trình kiểm chứng nhiều lớp

Phần lớn khách hàng sẽ đi qua nhiều lớp trước khi ra quyết định:

1. Nhận diện vấn đề
2. Tìm hiểu phương án điều trị
3. Đọc đánh giá
4. Xem nội dung chuyên môn
5. Kiểm tra Google Map
6. Truy cập website
7. Nhắn Zalo, gọi điện hoặc để lại thông tin

### Sự thay đổi quản trị quan trọng

Phòng khám không thể tối ưu tăng trưởng bằng một điểm chạm đơn lẻ. Mỗi kênh có một vai trò riêng trong hành trình khách hàng:

- **TikTok, Reels, Shorts** — tạo traffic, bắt sự chú ý
- **Facebook, YouTube, nội dung chuyên sâu** — tạo trust, xây uy tín
- **Zalo, đội ngũ tư vấn** — duy trì relationship, xây kết nối
- **Google Map, website, review** — authority check, xác nhận đáng tin trước quyết định cuối cùng

> Nếu những điểm chạm đó rời rạc hoặc mâu thuẫn, khách hàng sẽ không cảm nhận được một thương hiệu đáng tin, dù ngân sách quảng cáo có lớn đến đâu.

**Khách hàng mới không chỉ "xem quảng cáo" — họ đang đọc cả hệ thống.** Họ đọc cách phòng khám xuất hiện trên môi trường số, cách bác sĩ thể hiện chuyên môn, cách đội ngũ trả lời, cách review được tích lũy và cách thông tin được lặp lại một cách nhất quán trên nhiều nền tảng.

Một thương hiệu mạnh trong giai đoạn này là thương hiệu tạo được **cảm giác đồng bộ** trước khi tạo được cảm giác thuyết phục.`
  },
  {
    id: '3c915831-5a39-4d68-8cba-c77f4b4e7a1b',
    text: `Một chuyển động lớn khác của thị trường là hành vi tìm kiếm không còn chỉ xoay quanh Google theo nghĩa truyền thống.

**Người dùng ngày càng quen với việc hỏi trực tiếp các công cụ AI** để so sánh lựa chọn, xin gợi ý địa điểm phù hợp, hoặc tóm tắt điểm mạnh và điểm yếu của một phòng khám.

Song song với đó, Google cũng đang đẩy mạnh **AI Overviews** — nơi câu trả lời không chỉ dựa trên một website đơn lẻ mà được tổng hợp từ nhiều tín hiệu: listing, review, citations và nội dung có cấu trúc.

### Điều này làm thay đổi bản chất của hiện diện số

SEO theo nghĩa cũ — chỉ tập trung vào thứ hạng từ khóa — không còn đủ để đảm bảo khả năng được khám phá.

Phòng khám cần một lớp hiện diện mới, nơi website, hồ sơ bác sĩ, câu hỏi thường gặp, case điều trị, review, Google Business Profile và các nền tảng bên thứ ba **cùng kể một câu chuyện thống nhất, rõ ràng và đáng kiểm chứng.**

Khi thông tin được cấu trúc tốt và nhất quán, thương hiệu không chỉ có cơ hội xuất hiện trong kết quả tìm kiếm, mà còn có cơ hội được AI **"đọc"**, **"hiểu"** và **ưu tiên trích xuất** trong các câu trả lời tổng hợp.

**Review và tín hiệu uy tín số không còn là "lớp trang trí" sau bán hàng.** Chúng là **bằng chứng xã hội** có ảnh hưởng trực tiếp đến khả năng chuyển đổi.

> Một phòng khám có nhiều đánh giá mới, chân thực, nhất quán với thông điệp trên website và phản ánh đúng trải nghiệm thực tế sẽ có lợi thế rõ rệt hơn một phòng khám chỉ mạnh ở quảng cáo nhưng yếu ở bằng chứng niềm tin.`
  },
  {
    id: '2624066d-e703-4f95-b17b-53d7eb270707',
    text: `Sự dịch chuyển của thị trường mở ra một **cơ hội rất lớn** cho những chủ phòng khám biết xây hệ thống.

Khi nội dung chuyên môn tốt, **Personal Brand** rõ ràng, **Trust Assets** đầy đủ, quy trình chăm sóc được chuẩn hóa và dữ liệu được theo dõi đúng — phòng khám có thể giảm dần sự lệ thuộc vào quảng cáo đơn thuần.

Tăng trưởng khi đó không còn đến từ việc "mua thêm lead", mà đến từ:

- **Gia tăng tỷ lệ chuyển đổi** — từ khách đã biết đến khách đặt lịch
- **Gia tăng tỷ lệ quay lại** — từ bệnh nhân cũ thành khách trung thành
- **Gia tăng review thật** — từ trải nghiệm thực tế thành tài sản uy tín
- **Gia tăng referral** — từ chính trải nghiệm điều trị tốt

### Mặt khác, khung pháp lý cũng đang buộc thị trường phải trưởng thành hơn

Việt Nam đã có các cập nhật mới về hướng dẫn và thủ tục liên quan đến quảng cáo trong lĩnh vực y tế. Các nguyên tắc cốt lõi về **minh bạch, không gây hiểu sai và không quảng bá vượt quá phạm vi cho phép** vẫn là điểm phải đặc biệt lưu ý với các dịch vụ chăm sóc sức khỏe.

Điều này có nghĩa: tăng trưởng trong giai đoạn mới **không thể dựa trên sự phóng đại, mập mờ hoặc chạy theo thông điệp giật mạnh.** Nội dung càng đi xa, hệ thống kiểm chứng càng phải mạnh; truyền thông càng mở rộng, kỷ luật chuyên môn càng phải chặt.

### Thách thức lớn nhất

Thách thức lớn nhất không nằm ở "chạy marketing khó hơn", mà ở chỗ chủ phòng khám phải nâng cấp vai trò của mình.

Họ không thể chỉ giao việc tăng trưởng cho một người chạy ads hay một kênh truyền thông. Họ buộc phải nhìn toàn bộ hành trình khách hàng như một **hệ thống liên thông** giữa:

- Thương hiệu
- Nội dung
- Tư vấn
- Vận hành lâm sàng
- Chăm sóc sau điều trị
- Dữ liệu
- Văn hóa đội ngũ

> Chỉ khi đó, phòng khám mới có thể **biến niềm tin thành tăng trưởng thật**, thay vì dừng lại ở sự chú ý nhất thời.`
  },
  {
    id: 'e1a44422-097e-4d9c-ae10-c10cd6682e80',
    text: `**Thị trường nha khoa đang đổi chiều theo hướng rất rõ:**

| Trước | Nay |
|-------|-----|
| Chạy quảng cáo | Xây niềm tin |
| Mua lead | Xây hệ sinh thái |
| Bán dịch vụ | Tích lũy tài sản thương hiệu và năng lực vận hành |

**Những thay đổi đang diễn ra:**

- Hành vi khách hàng đã trở nên nhiều lớp hơn
- **AI search** và **AI Overviews** đang làm thay đổi cách thương hiệu được khám phá
- **Review** và tín hiệu uy tín số ngày càng ảnh hưởng mạnh đến quyết định đặt lịch
- Môi trường pháp lý tiếp tục nhấn mạnh tính minh bạch và tuân thủ trong truyền thông y tế

### Chủ phòng khám nào hiểu đúng chuyển động này

Sẽ không nhìn marketing như một khoản chi ngắn hạn, mà như một **hệ thống đầu tư dài hạn** vào:

- **Niềm tin** — được xây từ nhất quán, chân thực và chuyên môn
- **Trải nghiệm** — được thiết kế từ đầu đến cuối hành trình khách hàng
- **Dữ liệu** — được thu thập, phân tích và dùng để cải tiến liên tục

> Trong giai đoạn mới, chính **năng lực xây hệ thống** đó sẽ quyết định ai chỉ hiện diện trên thị trường, và ai thật sự chiếm được vị trí trong **tâm trí khách hàng**.`
  }
];

console.log(`Updating ${UPDATES.length} blocks in Chapter 2...`);

for (let i = 0; i < UPDATES.length; i++) {
  const u = UPDATES[i];
  const sql = `UPDATE "block" SET "text_md" = '${u.text.replace(/'/g, "''")}' WHERE "id" = '${u.id}';`;
  const tmpFile = join(tmpdir(), `u2_${Date.now()}_${i}.sql`);
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

console.log(`\n✓ Chapter 2 beautified: ${UPDATES.length} blocks`);
