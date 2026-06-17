-- Auto-generated seed from MDX files
-- Run: wrangler d1 execute DB --file=migrations/seed-books.sql

INSERT OR IGNORE INTO "chapter" ("id","tier","chapter_no","title","description","order","status","createdAt","updatedAt") VALUES ('01-trien-khai-he-thong',1,1,'Triển Khai Hệ Thống Quản Trị','Các nguyên tắc cốt lõi để xây dựng hệ thống quản trị phòng khám từ ngày đầu.',1,'published','2026-06-17T09:07:27.168Z','2026-06-17T09:07:27.168Z');
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('0005d23b-b094-4cce-a22f-4c6efacc69f9','01-trien-khai-he-thong',NULL,2,'Tại Sao Cần Hệ Thống?','tai-sao-can-he-thong',0);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('9d73309f-24bf-4fe1-ac6b-bc09e360757c','0005d23b-b094-4cce-a22f-4c6efacc69f9',1,'text','Nhiều chủ phòng khám mắc sai lầm lớn nhất khi bắt đầu: **làm mọi thứ theo cảm tính**. Không có quy trình, không có chuẩn mực — kết quả là nhân viên hoang mang, khách hàng thất vọng và bản thân kiệt sức.

Theo thống kê, 70% phòng khám nha khoa nhỏ tại Việt Nam đóng cửa trong 3 năm đầu vì thiếu hệ thống quản trị bài bản.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('910dfc35-8ecc-4310-a20b-3e1aed85d501','01-trien-khai-he-thong',NULL,2,'5 Nguyên Tắc Cốt Lõi','5-nguyen-tac-cot-loi',2);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('fd44c475-349d-4788-9050-2c6c2cab5cb2','01-trien-khai-he-thong','910dfc35-8ecc-4310-a20b-3e1aed85d501',3,'1. Chuẩn Hóa Trước, Tối Ưu Sau','1-chuan-hoa-truoc-toi-uu-sau',3);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('306a29a1-d209-4dd5-b3fe-cc7642478cab','910dfc35-8ecc-4310-a20b-3e1aed85d501',4,'text','Đừng cố gắng làm mọi thứ hoàn hảo ngay từ đầu. Hãy **đặt ra quy trình cơ bản** trước, sau đó liên tục cải thiện.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('7fb4cba2-864f-481e-8079-cee990b7e8cb','01-trien-khai-he-thong','910dfc35-8ecc-4310-a20b-3e1aed85d501',3,'2. Nhân Viên Phải Biết Rõ Nhiệm Vụ','2-nhan-vien-phai-biet-ro-nhiem-vu',5);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('3ead927b-1c11-4e34-ab8e-d8f20ec88348','910dfc35-8ecc-4310-a20b-3e1aed85d501',6,'text','Mỗi nhân viên cần có một bản mô tả công việc rõ ràng, biết chính xác họ cần làm gì, khi nào và như thế nào.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('28d945ba-638f-4960-b4fb-5024469ab947','01-trien-khai-he-thong','910dfc35-8ecc-4310-a20b-3e1aed85d501',3,'3. Đo Lường Được Mới Quản Lý Được','3-do-luong-duoc-moi-quan-ly-duoc',7);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('493c4f9e-606f-4c4a-aafa-d1174f51399c','910dfc35-8ecc-4310-a20b-3e1aed85d501',8,'text','Nếu bạn không thể đo lường, bạn không thể cải thiện. Thiết lập các chỉ số KPI cho từng bộ phận ngay từ ngày đầu.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('d31ce1b3-20b0-43da-b1bd-0e508d91fed7','01-trien-khai-he-thong','910dfc35-8ecc-4310-a20b-3e1aed85d501',3,'4. Hệ Thống Phải Chạy Tự Động','4-he-thong-phai-chay-tu-dong',9);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('571fe7d8-9794-4384-81ff-7b1c0f6cc84b','910dfc35-8ecc-4310-a20b-3e1aed85d501',10,'text','Mọi quy trình lặp đi lặp lại đều nên được tự động hóa hoặc chuẩn hóa thành checklist.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('fda5240b-4f82-4922-8cb8-cc6279b060c4','01-trien-khai-he-thong','910dfc35-8ecc-4310-a20b-3e1aed85d501',3,'5. Khách Hàng Là Trung Tâm','5-khach-hang-la-trung-tam',11);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('15f990ee-d87b-4f7b-a3da-c9b1cd6133e0','910dfc35-8ecc-4310-a20b-3e1aed85d501',12,'text','Mọi hệ thống đều hướng tới mục tiêu cuối cùng: **trải nghiệm khách hàng xuất sắc**.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('b595908d-d8e9-4346-b920-bdcdbd73adff','01-trien-khai-he-thong',NULL,2,'Bài Tập Thực Hành','bai-tap-thuc-hanh',13);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('33ad8ed4-2e48-48cd-a266-722a40238a05','b595908d-d8e9-4346-b920-bdcdbd73adff',14,'text','Hãy lập danh sách 5 quy trình quan trọng nhất trong phòng khám của bạn hiện tại. Đánh giá xem quy trình nào đã có sẵn và quy trình nào cần xây dựng.

Ở chương tiếp theo, chúng ta sẽ đi sâu vào cách thiết lập cấu trúc phòng ban hiệu quả.',NULL,NULL,NULL,NULL,NULL);

INSERT OR IGNORE INTO "chapter" ("id","tier","chapter_no","title","description","order","status","createdAt","updatedAt") VALUES ('02-quan-tri-nhan-su',1,2,'Quản Trị Nhân Sự Cơ Bản','Xây dựng cấu trúc phòng ban, tuyển dụng và đào tạo nhân sự nha khoa.',2,'published','2026-06-17T09:07:27.188Z','2026-06-17T09:07:27.188Z');
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('9f06947e-0989-4a2f-b68c-670f1d8b069a','02-quan-tri-nhan-su',NULL,2,'Cấu Trúc Phòng Ban','cau-truc-phong-ban',0);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('a77efd95-746a-4b00-b4d4-9363480a3258','9f06947e-0989-4a2f-b68c-670f1d8b069a',1,'text','Một phòng khám nha khoa hiệu quả cần có 3 bộ phận chính hoạt động phối hợp nhịp nhàng:',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('1c12f023-deaa-452a-927b-d66b5746fd41','02-quan-tri-nhan-su','9f06947e-0989-4a2f-b68c-670f1d8b069a',3,'Bộ Phận Điều Trị','bo-phan-dieu-tri',2);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('2416a3e3-5844-41ab-b20a-e0e1329d6f37','9f06947e-0989-4a2f-b68c-670f1d8b069a',3,'text','- Bác sĩ chính
- Phụ tá điều trị
- Tư vấn điều trị',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('a6bcd3c1-0a09-40c9-924c-9eec4372db72','02-quan-tri-nhan-su','9f06947e-0989-4a2f-b68c-670f1d8b069a',3,'Bộ Phận Hành Chính','bo-phan-hanh-chinh',4);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('29c580f3-ccfe-4aa1-ba64-9cc076655e4f','9f06947e-0989-4a2f-b68c-670f1d8b069a',5,'text','- Lễ tân / Tiếp đón
- Quản lý hồ sơ
- Thu ngân',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('cd85efab-68c3-4a20-88e4-315a1af6f01c','02-quan-tri-nhan-su','9f06947e-0989-4a2f-b68c-670f1d8b069a',3,'Bộ Phận Marketing','bo-phan-marketing',6);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('f3205a0c-9d8a-4081-9cc1-53b3c234a63a','9f06947e-0989-4a2f-b68c-670f1d8b069a',7,'text','- Chăm sóc khách hàng
- Quản lý mạng xã hội
- Hỗ trợ bán hàng

Với phòng khám mới bắt đầu, một người có thể kiêm nhiệm nhiều vai trò. Điều quan trọng là phải **phân chia rõ trách nhiệm** ngay cả khi một người đảm nhận nhiều vị trí.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('b4a9d49a-087f-4269-8f4e-8f68d12d9bf9','02-quan-tri-nhan-su',NULL,2,'Quy Trình Tuyển Dụng','quy-trinh-tuyen-dung',8);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('6bab7c1a-c968-407a-bf91-bfd18ad0e6cf','02-quan-tri-nhan-su','b4a9d49a-087f-4269-8f4e-8f68d12d9bf9',3,'Bước 1: Xác Định Vị Trong Cần Tuyển','buoc-1-xac-dinh-vi-trong-can-tuyen',9);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('ff0ad62b-84ee-4dcb-b572-3e1ba554b8fe','b4a9d49a-087f-4269-8f4e-8f68d12d9bf9',10,'text','- Viết rõ mô tả công việc
- Xác định yêu cầu kỹ năng tối thiểu
- Xác định mức lương phù hợp',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('65f9248e-9359-4799-9296-f3088f84f5f5','02-quan-tri-nhan-su','b4a9d49a-087f-4269-8f4e-8f68d12d9bf9',3,'Bước 2: Đăng Tuyển','buoc-2-dang-tuyen',11);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('695db004-c6c9-4c2f-9c4f-55b0aa736fe3','b4a9d49a-087f-4269-8f4e-8f68d12d9bf9',12,'text','- Sử dụng các nền tảng tuyển dụng uy tín
- Đăng trên các nhóm ngành nha khoa
- Nhờ giới thiệu từ mạng lưới quan hệ',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('48fbe9e7-47b8-4524-a710-bdde28f1a219','02-quan-tri-nhan-su','b4a9d49a-087f-4269-8f4e-8f68d12d9bf9',3,'Bước 3: Phỏng Vấn','buoc-3-phong-van',13);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('f3f180cd-5b2b-40e1-b2bb-7b13232df629','b4a9d49a-087f-4269-8f4e-8f68d12d9bf9',14,'text','- Phỏng vấn kỹ thuật (kiến thức chuyên môn)
- Phỏng vấn văn hóa (phù hợp với đội nhóm)
- Thử việc thực tế (1-2 tuần)

Đừng chỉ đánh giá kỹ năng. Hãy tìm người có **thái độ tốt** và **sẵn sàng học hỏi**. Kỹ năng có thể đào tạo, nhưng thái độ thì khó thay đổi.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('f349c26c-2b6c-45fb-828d-e94b32301c63','02-quan-tri-nhan-su',NULL,2,'Đào Tạo Nhân Viên Mới','dao-tao-nhan-vien-moi',15);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('397cc3d0-d532-4681-800c-afd8c6ff5f03','f349c26c-2b6c-45fb-828d-e94b32301c63',16,'text','Mỗi nhân viên mới cần trải qua chương trình đào tạo trong 2 tuần đầu:

1. **Ngày 1-3:** Giới thiệu văn hóa phòng khám, quy định nội bộ
2. **Ngày 4-7:** Đào tạo quy trình làm việc cụ thể
3. **Ngày 8-10:** Thực hành có giám sát
4. **Ngày 11-14:** Làm việc độc lập có hỗ trợ

Ở chương tiếp theo, chúng ta sẽ探讨 cách xây dựng quy trình chăm sóc khách hàng hiệu quả.',NULL,NULL,NULL,NULL,NULL);

INSERT OR IGNORE INTO "chapter" ("id","tier","chapter_no","title","description","order","status","createdAt","updatedAt") VALUES ('01-dental-empire-os',3,1,'Dental Empire OS: Tổng Quan Hệ Thống','Giới thiệu tổng quan về hệ điều hành quản trị Dental Empire OS — tầm nhìn, cấu trúc và cách vận hành.',1,'published','2026-06-17T09:07:27.190Z','2026-06-17T09:07:27.190Z');
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('2b97ea90-88a9-4761-b437-86ac78d5c1a0','01-dental-empire-os',NULL,2,'Dental Empire OS là gì?','dental-empire-os-la-gi',0);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('a56b8f6d-e69b-450c-9c0b-84d58a324dbf','2b97ea90-88a9-4761-b437-86ac78d5c1a0',1,'text','Dental Empire OS không chỉ là một cuốn sách — nó là một **hệ điều hành quản trị toàn diện** được thiết kế riêng cho ngành nha khoa. Mọi quy trình, mọi quyết định trong phòng khám đều được chuẩn hóa thành một hệ thống có thể vận hành tự động.

Giống như hệ điều hành máy tính điều phối mọi phần cứng và phần mềm, Dental Empire OS điều phối mọi hoạt động của phòng khám — từ nhân sự, tài chính đến trải nghiệm khách hàng.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('01785e1d-a8f6-43d0-b8a3-ac21376bd14a','01-dental-empire-os',NULL,2,'Tầm nhìn','tam-nhin',2);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('b7d892d9-4758-42bc-95bf-0cb3307513a2','01785e1d-a8f6-43d0-b8a3-ac21376bd14a',3,'text','Mục tiêu của Dental Empire OS là giúp mỗi chủ phòng khám trở thành **nhà quản trị hệ thống** thay vì phải giám sát từng chi tiết nhỏ. Khi hệ thống hoạt động đúng, bạn có thể:

- Tập trung vào chuyên môn điều trị
- Mở rộng thêm cơ sở mới
- Xây dựng đội ngũ lãnh đạo cấp 2
- Tạo ra thu nhập thụ động từ hệ thống',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('96f59176-df6a-4c1f-af28-3256cc3fbb46','01-dental-empire-os',NULL,2,'Cấu Trúc 3 Tầng','cau-truc-3-tang',4);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('d05bdcd9-22d3-4a27-82f6-161e7f9fcd4b','96f59176-df6a-4c1f-af28-3256cc3fbb46',5,'text','Hệ thống được chia thành 3 tầng, mỗi tầng xây dựng trên nền tảng của tầng trước:',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('362dbe9d-e1b2-4306-8e74-93148b199747','01-dental-empire-os','96f59176-df6a-4c1f-af28-3256cc3fbb46',3,'Tầng 1: Dental Empire C++','tang-1-dental-empire-c',6);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('b3ac1cda-0f6d-44dc-87e5-37379abea4a0','96f59176-df6a-4c1f-af28-3256cc3fbb46',7,'text','**Nền tảng chuyên môn và vận hành cơ bản.** Ở tầng này, bạn sẽ học cách chuẩn hóa kỹ thuật điều trị, thiết lập cấu trúc phòng ban và xây dựng các quy trình phối hợp nội bộ cốt lõi.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('43ed82fe-7897-4018-a990-9750224df060','01-dental-empire-os','96f59176-df6a-4c1f-af28-3256cc3fbb46',3,'Tầng 2: Dental Empire U++','tang-2-dental-empire-u',8);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('be1d3dff-6312-48d4-831a-b3204bf43a2a','96f59176-df6a-4c1f-af28-3256cc3fbb46',9,'text','**Nâng cấp và nhân bản.** Tầng tập trung vào Marketing y khoa, quản trị nhân sự tinh nhuệ và quy trình tài chính để sẵn sàng mở rộng quy mô.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('cc71cd72-16fe-430e-8429-78cbcad86023','01-dental-empire-os','96f59176-df6a-4c1f-af28-3256cc3fbb46',3,'Tầng 3: Dental Empire OS','tang-3-dental-empire-os',10);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('a74e0ba4-f4ff-4848-a532-bf835b30f7ef','96f59176-df6a-4c1f-af28-3256cc3fbb46',11,'text','**Hệ điều hành quản trị toàn diện.** Tầng cao nhất — tự động hóa vận hành, tối ưu hóa trải nghiệm khách hàng và ra quyết định dựa trên dữ liệu thực tế.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('50bd91ab-dacd-4c04-8e72-654f27971dfd','01-dental-empire-os',NULL,2,'Khởi Đầu Hành Trình','khoi-dau-hanh-trinh',12);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('d71757e1-557a-4d88-8e16-d9f1d935e307','50bd91ab-dacd-4c04-8e72-654f27971dfd',13,'text','Hãy đọc tuần tự từ Tầng 1 đến Tầng 3. Mỗi tầng đều có những bài tập thực hành giúp bạn áp dụng ngay kiến thức vào phòng khám.

Để bắt đầu, hãy đọc Tầng 1 — nơi đặt nền móng cho mọi hệ thống quản trị phòng khám hiệu quả.',NULL,NULL,NULL,NULL,NULL);

INSERT OR IGNORE INTO "chapter" ("id","tier","chapter_no","title","description","order","status","createdAt","updatedAt") VALUES ('22-he-thong-song',3,22,'Hệ Thống Sống','Tổ chức không phải là cỗ máy, mà là một hệ thống sống.',22,'published','2026-06-17T09:07:27.191Z','2026-06-17T09:07:27.191Z');
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('aae1c8af-8f8d-42ea-b0e5-b8cf89934fbe','22-he-thong-song',NULL,2,'Tổ Chức Không Phải Là Cỗ Máy','to-chuc-khong-phai-la-co-may',0);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('b36139dc-81a9-489b-99ae-462ed632bcd0','aae1c8af-8f8d-42ea-b0e5-b8cf89934fbe',1,'text','Trong nhiều mô hình quản trị truyền thống, tổ chức thường được nhìn như một cỗ máy. Mỗi phòng ban là một bộ phận. Mỗi nhân sự là một mắt xích. Mỗi quy trình là một đường chuyền. Mỗi chỉ số là một đồng hồ đo. Khi máy chạy chậm, người ta thay linh kiện. Khi kết quả không đạt, người ta siết kiểm soát.

Cách nhìn đó có một phần đúng, nhưng không đủ đối với một tổ chức y tế.

Một phòng khám nha khoa không chỉ vận hành bằng quy trình. Nó vận hành bằng niềm tin của bệnh nhân, bằng lương tâm nghề nghiệp của bác sĩ, bằng sự phối hợp của đội ngũ, bằng thái độ của lễ tân, bằng sự trung thực của người tư vấn, bằng sự cẩn trọng của phụ tá, bằng sự nhất quán của từng điểm chạm nhỏ trong hành trình điều trị.

Vì vậy, Dental Empire OS nhìn tổ chức như một hệ thống sống.

Một hệ thống sống phải có gốc rễ. Nó phải biết mình sinh ra để phụng sự điều gì. Nó phải có khả năng tự nhận biết khi lệch hướng. Nó phải có cơ chế tự điều chỉnh khi sai lệch xuất hiện. Nó phải có khả năng học từ lỗi lầm. Và nó phải có vòng phản hồi để không ngừng trưởng thành.

Một phòng khám không trở nên tốt hơn chỉ vì có thêm nhiều quy trình. Nó trở nên tốt hơn khi quy trình, con người, giá trị và dữ liệu được đặt trong cùng một hệ quy chiếu. Khi đó, quy trình không còn là thứ để ép buộc con người, mà trở thành đường ray giúp con người hành động đúng. Dữ liệu không còn là công cụ giám sát lạnh lùng, mà trở thành tấm gương phản chiếu sự thật. Văn hóa không còn là khẩu hiệu treo trên tường, mà trở thành tiêu chuẩn sống trong từng hành vi cụ thể.

Đó là lý do Dental Empire OS đặt R.O.A.D.M.A.P làm khung điều hành trung tâm.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('b9ac3ff9-b68f-4fc3-a2a4-73bdc825e480','22-he-thong-song',NULL,2,'R.O.A.D.M.A.P Là Gì?','r-o-a-d-m-a-p-la-gi',2);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('ba970a12-e715-4e27-86c2-270347310e65','b9ac3ff9-b68f-4fc3-a2a4-73bdc825e480',3,'text','R.O.A.D.M.A.P là con đường giúp tổ chức đi từ gốc rễ đến thịnh vượng. Nó bắt đầu bằng ROOTS, nơi tổ chức xác định bản sắc và nền móng. Nó tiếp tục bằng ONE LIGHT, nơi tổ chức thiết lập trục đạo đức và lằn ranh không được vượt qua. Nó đi qua AWAKEN, nơi tổ chức học cách tự nhận thức. Nó bước vào DEEPEN, nơi năng lực và quy trình được đào sâu. Nó trưởng thành qua MATURE, đồng bộ qua ALIGN, và cuối cùng tiến đến PROSPER — sự thịnh vượng có nền tảng, có phẩm giá và có khả năng duy trì lâu dài.

Như vậy, Dental Empire OS không quản trị phòng khám bằng những KPI rời rạc. Nó quản trị bằng một kiến trúc có tầng sâu, có trật tự và có vòng lặp học hỏi liên tục.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('71c5f258-4e03-4ba2-9932-f41054594c66','22-he-thong-song',NULL,2,'Vòng Lặp Học Hỏi','vong-lap-hoc-hoi',4);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('3bef4715-1296-4146-9a56-933f210d470f','71c5f258-4e03-4ba2-9932-f41054594c66',5,'text','Mỗi tầng trong R.O.A.D.M.A.P không tồn tại rời rạc, mà liên tục nuôi dưỡng tầng sau và phản hồi về tầng trước. Khi tổ chức phát triển, ROOTS cần được soi lại. ONE LIGHT cần được củng cố. AWAKEN cần được kích hoạt. DEEPEN cần được đào sâu. MATURE cần được nâng cấp. ALIGN cần được tái đồng bộ. Và PROSPER không phải điểm kết thúc, mà là bằng chứng cho thấy toàn bộ hệ thống đang sinh trưởng đúng hướng.

- Một tổ chức không thể thịnh vượng thật sự nếu nó mất gốc.
- Không thể lớn lên bền vững nếu tâm gỗ bên trong bị rỗng.
- Không thể trưởng thành nếu không biết tự soi chiếu.
- Không thể mở rộng nếu năng lực chưa được đào sâu.
- Không thể vận hành mạnh nếu các phần trong hệ thống không được đồng bộ.

R.O.A.D.M.A.P vì thế là cơ chế biến lý tưởng thành kiến trúc, biến kiến trúc thành hành vi, và biến hành vi thành sự trưởng thành có thể đo lường.',NULL,NULL,NULL,NULL,NULL);

INSERT OR IGNORE INTO "chapter" ("id","tier","chapter_no","title","description","order","status","createdAt","updatedAt") VALUES ('23-con-nguoi-la-chu-the',3,23,'Con Người Là Chủ Thể','Con người không phải là nguồn lực, mà là chủ thể trưởng thành.',23,'published','2026-06-17T09:07:27.192Z','2026-06-17T09:07:27.192Z');
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('8272cadd-daa3-4d26-9924-710dd9346dc1','23-con-nguoi-la-chu-the',NULL,2,'Con Người Trong Tổ Chức','con-nguoi-trong-to-chuc',0);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('a3668a21-4b33-447b-a852-6c4d23510505','8272cadd-daa3-4d26-9924-710dd9346dc1',1,'text','Một tổ chức có thể mua được máy móc tốt. Có thể thuê được mặt bằng đẹp. Có thể đầu tư vào công nghệ hiện đại. Có thể chạy được quảng cáo mạnh. Nhưng chất lượng thật sự của một phòng khám vẫn được quyết định bởi con người.

- Con người là nơi văn hóa trở thành hành vi.
- Con người là nơi đạo đức được thử thách.
- Con người là nơi quy trình được thực thi.
- Con người là nơi bệnh nhân cảm nhận được tổ chức có đáng tin hay không.

Vì vậy, Dental Empire OS không xem nhân sự chỉ là "nguồn lực". Con người không phải là một đơn vị lao động để phân bổ, đo lường và thay thế. Con người là chủ thể có bản s��c, có ý thức đạo đức, có khả năng học tập, có giới hạn, có tiềm năng và có nhu cầu được đặt vào đúng môi trường để phát triển.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('12f0e439-5a13-46ff-890d-6858eaf44bee','23-con-nguoi-la-chu-the',NULL,2,'Tuyển Dụng Đúng Người','tuyen-dung-dung-nguoi',2);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('2fd72798-02e9-495f-971b-7c7ded50d48b','12f0e439-5a13-46ff-890d-6858eaf44bee',3,'text','Một tổ chức bền vững không chỉ tuyển người giỏi. Nó cần tuyển đúng người, đặt đúng vai trò, huấn luyện đúng cách và đánh giá bằng một hệ tiêu chuẩn công bằng.

Trong Dental Empire OS, tuyển dụng không bắt đầu bằng câu hỏi: "Người này có làm được việc không?" Câu hỏi đầu tiên phải là: "Người này có phù hợp với hệ giá trị của tổ chức không?"

Bởi vì một người giỏi nhưng lệch giá trị có thể tạo ra nhiều rủi ro hơn một người còn thiếu kỹ năng nhưng có tinh thần đúng và khả năng học hỏi. Năng lực có thể được đào tạo theo thời gian. Nhưng sự lệch pha về đạo đức, thái độ và thế giới quan có thể làm tổn thương văn hóa từ bên trong.

Điều này đặc biệt đúng trong ngành nha khoa. Một bác sĩ giỏi chuyên môn nhưng xem nhẹ sự minh bạch có thể làm suy giảm niềm tin bệnh nhân. Một nhân sự bán hàng có khả năng chốt lịch cao nhưng tư vấn thiếu trung thực có thể làm méo hình ảnh phòng khám.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('5a5b1781-7b06-42d1-b257-c0b46db3def8','23-con-nguoi-la-chu-the',NULL,2,'Tiến Trình Trưởng Thành','tien-trinh-truong-thanh',4);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('a3c49cfe-e02d-4864-8baa-80ca935d2d9a','5a5b1781-7b06-42d1-b257-c0b46db3def8',5,'text','Vì vậy, con người trong Dental Empire OS được nhìn trong một tiến trình dài hơn: được chọn lọc, được hội nhập, được đào tạo, được soi chiếu, được phản hồi và được trưởng thành.

Mục tiêu không phải chỉ là tạo ra nhân sự biết làm việc. Mục tiêu là tạo ra những con người biết làm đúng việc, đúng cách, đúng chuẩn mực và đúng tinh thần của tổ chức.

Một bác sĩ không chỉ được đánh giá bằng số ca thực hiện, mà còn bằng chất lượng chỉ định, sự an toàn của người bệnh, khả năng giải thích để bệnh nhân hiểu và tinh thần học hỏi sau mỗi ca điều trị.

Một quản lý không chỉ được đánh giá bằng khả năng đạt KPI, mà còn bằng việc đội ngũ dưới quyền có trưởng thành hơn hay không.',NULL,NULL,NULL,NULL,NULL);

INSERT OR IGNORE INTO "chapter" ("id","tier","chapter_no","title","description","order","status","createdAt","updatedAt") VALUES ('24-to-be-sky',3,24,'TO BE SKY','Bầu trời đạo đức phía trên tổ chức — Sincerity, Kindness, Yielding.',24,'published','2026-06-17T09:07:27.195Z','2026-06-17T09:07:27.195Z');
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('2dc435d1-6121-436d-8c7a-426dc8be8580','24-to-be-sky',NULL,2,'SKY Là Gì?','sky-la-gi',0);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('27fb3346-4679-4409-be10-5cb48ff92a31','2dc435d1-6121-436d-8c7a-426dc8be8580',1,'text','Một tổ chức muốn đi xa cần có bầu trời để ngước nhìn.

Trong Dental Empire OS, bầu trời đó được gọi là SKY — viết tắt của Sincerity, Kindness, Yielding.

SKY là trục đạo đức cô đọng của hệ thống. Nó không phải là những từ đẹp để trang trí tài liệu văn hóa. Nó là bộ phẩm chất định hướng cách tổ chức đối xử với bệnh nhân, với đồng nghiệp, với cộng đồng và với chính mình.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('dcc61c35-4921-45e2-91a5-ad6344a8c219','24-to-be-sky',NULL,2,'Sincerity — Sự Chân Thành','sincerity-su-chan-thanh',2);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('6fda672c-e900-46bb-be17-08b000420738','dcc61c35-4921-45e2-91a5-ad6344a8c219',3,'text','Sincerity là sự chân thành và trung thực. Nó yêu cầu tổ chức bảo vệ sự thật, nói đúng điều cần nói, tư vấn đúng điều cần tư vấn và không bóp méo chuyên môn vì áp lực doanh thu.

Trong nha khoa, Sincerity là hàng rào chống lại việc "vẽ bệnh", phóng đại nỗi sợ hoặc biến sự thiếu hiểu biết của bệnh nhân thành cơ hội kinh doanh.

Một phòng khám có thể đạt doanh thu cao, nhưng nếu thiếu Sincerity, niềm tin sẽ bị bào mòn.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('17e48bc8-cd49-43b9-9fbc-804264f3bc30','24-to-be-sky',NULL,2,'Kindness — Lòng Tử Tế','kindness-long-tu-te',4);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('d42d99b3-1c40-43ae-8a7c-911093c4a2d1','17e48bc8-cd49-43b9-9fbc-804264f3bc30',5,'text','Kindness là lòng tử tế và tinh thần nhân bản. Nó nhắc tổ chức rằng bệnh nhân không phải là một ca điều trị, một hóa đơn hay một dòng doanh thu. Bệnh nhân là một con người đang mang theo nỗi lo, sự kỳ vọng, cảm giác bất an và nhu cầu được chăm sóc một cách tử tế.

Kindness cũng nhắc tổ chức rằng nhân sự không phải là công cụ vận hành, mà là những con người cần được tôn trọng, hướng dẫn và phát triển.

Một phòng khám có thể có quy trình tốt, nhưng nếu thiếu Kindness, trải nghiệm sẽ trở nên lạnh lùng.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('1f2a8be1-ee9a-4dd9-a44d-9f5178f72d4d','24-to-be-sky',NULL,2,'Yielding — Khả Năng Nhường Mình','yielding-kha-nang-nhuong-minh',6);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('fc3c5313-4d5f-4352-8f49-e18c56140da7','1f2a8be1-ee9a-4dd9-a44d-9f5178f72d4d',7,'text','Yielding là khả năng nhường mình để ưu tiên điều đúng. Đây không phải là sự yếu đuối. Đây là năng lực hạ thấp cái tôi khi cần thiết, lắng nghe phản hồi, thừa nhận sai sót và điều chỉnh vì lợi ích lớn hơn.

Trong môi trường y tế, cái tôi chuyên môn, cái tôi chức vụ và cái tôi kinh doanh đều có thể trở thành nguy cơ nếu không được soi chiếu. Yielding giúp tổ chức biết dừng lại trước khi đi quá xa.

Một phòng khám có thể có đội ngũ giỏi, nhưng nếu thiếu Yielding, cái tôi sẽ làm vỡ sự cộng hưởng.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('0590ec00-3471-4168-ac41-2de6ca93ddef','24-to-be-sky',NULL,2,'TO BE SKY','to-be-sky',8);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('cf5903c5-60cc-4951-bd0d-7bbeb7f392f1','0590ec00-3471-4168-ac41-2de6ca93ddef',9,'text','TO BE SKY là tư tưởng cốt lõi mà những người làm quản trị cần phải thực hành. Thay vì trở thành STARS (Ngôi Sao) thì hãy trở thành SKY (Bầu Trời) để tất cả các ngôi sao khác có thể tỏa sáng.

Người lãnh đạo phải luôn ở tâm thái TO BE — đó là tâm thái trở thành, chứ không phải "đã rồi". Hành trình TO BE của người lãnh đạo là hành trình từ bên trong:

- **T** — Transcend: luôn vươn lên trên cái cũ, vượt qua giới hạn hiện tại
- **O** — Open: sẵn sàng mở rộng không gian, tư duy và khả năng đón nhận cái mới
- **B** — Beneath: luôn đi xuống chiều sâu, chạm vào nền tảng và gốc rễ
- **E** — Enlighten: luôn mong muốn làm sáng tỏ, soi rõ mọi thứ để mang lại nhận thức đúng',NULL,NULL,NULL,NULL,NULL);

INSERT OR IGNORE INTO "chapter" ("id","tier","chapter_no","title","description","order","status","createdAt","updatedAt") VALUES ('25-s-t-a-r-s',3,25,'S.T.A.R.S','Bản đồ năng lực của con người — Skills, Traits, Actions, Results, Synergy.',25,'published','2026-06-17T09:07:27.196Z','2026-06-17T09:07:27.196Z');
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('025ee5b2-19f0-4d58-b42c-330c72df0a5e','25-s-t-a-r-s',NULL,2,'SKY và S.T.A.R.S Song Song','sky-va-s-t-a-r-s-song-song',0);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('3172d0fc-9276-428e-99f4-8926b9004de9','025ee5b2-19f0-4d58-b42c-330c72df0a5e',1,'text','Nếu SKY là bầu trời đạo đức, thì S.T.A.R.S là bản đồ những ngôi sao năng lực mà tổ chức cần quan sát, nuôi dưỡng và phát triển.

Một tổ chức không thể chỉ có đạo đức mà thiếu năng lực. Lòng tốt không thể thay thế chuyên môn. Sự tử tế không thể bù đắp cho sự cẩu thả. Một phòng khám có trái tim đúng nhưng tay nghề yếu, quy trình lỏng lẻo và năng lực phối hợp kém vẫn có thể gây tổn hại cho bệnh nhân.

Ngược lại, năng lực cao nhưng thiếu đạo đức cũng nguy hiểm không kém. Khi kỹ năng, công nghệ và khả năng thuyết phục không được dẫn dắt bởi y đức, chúng có thể trở thành công cụ để tối ưu hóa lợi ích ngắn hạn thay vì phụng sự bệnh nhân.

Vì vậy, Dental Empire OS đặt SKY và S.T.A.R.S song song với nhau:

- **SKY bảo vệ phẩm chất.**
- **S.T.A.R.S phát triển năng lực.**',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('1d96d31c-c9ef-4006-8622-9e7077967a9d','25-s-t-a-r-s',NULL,2,'Skills — Kỹ Năng','skills-ky-nang',2);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('2df70773-4925-45d6-aa2d-5b370ed2f41b','1d96d31c-c9ef-4006-8622-9e7077967a9d',3,'text','Skills là kỹ năng: năng lực chuyên môn, kỹ năng giao tiếp, kỹ năng vận hành, kỹ năng xử lý tình huống.

Một bác sĩ không chỉ cần tay nghề giỏi. Cần biết giải thích cho bệnh nhân hiểu. Cần biết phối hợp với phụ tá. Cần biết xử lý tình huống bất ngờ.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('d4a98afc-7c65-4c9a-a039-462bd65a2702','25-s-t-a-r-s',NULL,2,'Traits — Tố Chất','traits-to-chat',4);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('dd3e77d6-fe96-4316-a98a-3e5ca1c798b9','d4a98afc-7c65-4c9a-a039-462bd65a2702',5,'text','Traits là tố chất: khí chất tự nhiên, độ phù hợp với vai trò, khả năng chịu áp lực, mức độ cẩn trọng, tinh thần trách nhiệm.

Đôi khi tố chất quan trọng hơn kỹ năng. Một người có tố chất đúng sẽ học hỏi và phát triển nhanh hơn.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('196a8c31-2984-4c96-a769-27aae8c6bcdc','25-s-t-a-r-s',NULL,2,'Actions — Khả Năng Hành Động','actions-kha-nang-hanh-dong',6);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('51723687-3722-498a-8c83-6087aba003da','196a8c31-2984-4c96-a769-27aae8c6bcdc',7,'text','Actions là khả năng hành động: tính chủ động, kỷ luật thực thi, khả năng biến hiểu biết thành việc làm cụ thể.

Biết mà không làm thì cũng như không biết. Dental Empire OS đánh giá cao hành động hơn lời nói.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('02f6583d-4db9-442a-a14d-80bbfb1d14a6','25-s-t-a-r-s',NULL,2,'Results — Kết Quả','results-ket-qua',8);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('dbba3656-7d0d-4d7a-a20b-7063b871f126','02f6583d-4db9-442a-a14d-80bbfb1d14a6',9,'text','Results là kết quả: đầu ra thực tế, mức độ hoàn thành mục tiêu, chất lượng công việc và tác động tạo ra cho tổ chức.

Nhưng kết quả phải được nhìn cùng với SKY. Kết quả đúng cách mới là kết quả bền vững.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('5220221f-ed6f-4320-bd07-8ad6408c516d','25-s-t-a-r-s',NULL,2,'Synergy — Cộng Hưởng','synergy-cong-huong',10);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('2fc3458d-bb8b-4216-901a-5a61b8eeddfc','5220221f-ed6f-4320-bd07-8ad6408c516d',11,'text','Synergy là khả năng cộng hưởng: khả năng phối hợp với người khác, làm mạnh hệ thống, tạo giá trị vượt ra ngoài phần việc cá nhân.

Trong phòng khám, mỗi người giỏi thôi chưa đủ. Đội ngũ cần biết phối hợp để tạo ra kết quả lớn hơn tổng các phần.',NULL,NULL,NULL,NULL,NULL);

INSERT OR IGNORE INTO "chapter" ("id","tier","chapter_no","title","description","order","status","createdAt","updatedAt") VALUES ('26-r-o-a-d-m-a-p',3,26,'R.O.A.D.M.A.P','Con đường biến văn hóa thành hệ thống.',26,'published','2026-06-17T09:07:27.197Z','2026-06-17T09:07:27.197Z');
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('de14242e-20c1-4445-b7d7-11b4ae9f3005','26-r-o-a-d-m-a-p',NULL,2,'Roots — Gốc Rễ','roots-goc-re',0);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('06e31893-1292-4b09-bdd7-43afb01e3ab1','de14242e-20c1-4445-b7d7-11b4ae9f3005',1,'text','R.O.A.D.M.A.P bắt đầu bằng ROOTS — nơi tổ chức xác định bản sắc và nền móng.

Mỗi phòng khám cần biết mình là ai, mình sinh ra để phụng sự điều gì, và những giá trị nào không bao giờ được đánh đổi. ROOTS là gốc rễ mà mọi quyết định sau này đều quay về.

Không có ROOTS, tổ chức sẽ trôi dạt trước mọi cám dỗ của thị trường.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('d775ab47-cb44-4afe-90e6-ec75d705c4ee','26-r-o-a-d-m-a-p',NULL,2,'One Light — Tâm Gỗ Đạo đức','one-light-tam-go-dao-duc',2);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('c87d01e3-2939-4ea2-b217-b6beb9a8b44b','d775ab47-cb44-4afe-90e6-ec75d705c4ee',3,'text','ONE LIGHT là trục đạo đức — lằn ranh không được vượt qua.

Đó là SKY trong hành động cụ thể: Sincerity trong tư vấn, Kindness trong chăm sóc, Yielding trong lãnh đạo. ONE LIGHT giữ cho tổ chức không bị trượt khỏi phương hướng khi áp lực doanh thu lớn lên.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('98908933-430c-445a-becd-f4263f0e8738','26-r-o-a-d-m-a-p',NULL,2,'Awaken — Tự Soi Chiếu','awaken-tu-soi-chieu',4);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('b65067d3-0370-409c-b3ce-b71bee4b9c5e','98908933-430c-445a-becd-f4263f0e8738',5,'text','AWAKEN là năng lực tự nhận thức. Tổ chức cần biết nhìn vào bên trong để thấy mình đang ở đâu, đang sai ở đâu, và cần thay đổi gì.

AWAKEN không phải là tự chỉ trích. Đó là sự trung thực với chính mình — dám nhìn thấy sự thật để có thể tiến bộ.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('d2052cdf-6999-44b9-af30-5e77239c7b7f','26-r-o-a-d-m-a-p',NULL,2,'Deepen — Đào Sâu','deepen-dao-sau',6);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('baba94a5-c1b4-49a4-8a96-ccfbef797abe','d2052cdf-6999-44b9-af30-5e77239c7b7f',7,'text','DEEPEN là giai đoạn chuẩn hóa năng lực và quy trình. Khi đã biết gốc rễ và đạo đức, tổ chức cần đào sâu chuyên môn, chuẩn hóa từng quy trình và đảm bảo mọi hành vi đều nhất quán.

DEEPEN biến văn hóa từ khẩu hiệu thành hành vi có thể quan sát và đo lường.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('06ad6459-2c51-4115-808f-d1827a8ecaf6','26-r-o-a-d-m-a-p',NULL,2,'Mature — Nâng Tầng','mature-nang-tang',8);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('73a632a5-8820-4695-b21f-97d884cde8b9','06ad6459-2c51-4115-808f-d1827a8ecaf6',9,'text','MATURE là trưởng thành đội ngũ. Tổ chức lớn lên khi con người lớn lên. MATURE bao gồm đào tạo, mentoring, đánh giá và phát triển nhân sự liên tục.

Mục tiêu không phải tạo ra nhân sự biết làm việc, mà tạo ra những con người biết làm đúng việc, đúng cách và đúng tinh thần.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('ce02acd0-3e03-4402-aaa3-f2e5c9879505','26-r-o-a-d-m-a-p',NULL,2,'Align — Đồng Bộ','align-dong-bo',10);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('797a2e87-a6a1-48d2-9ffd-1345f9d70030','ce02acd0-3e03-4402-aaa3-f2e5c9879505',11,'text','ALIGN là đồng bộ mọi nguồn lực: con người, quy trình, công nghệ, tài chính và chiến lược.

Khi các phần trong hệ thống không đồng bộ, tổ chức sẽ có năng lượng bị phân tán. ALIGN giúp mọi thứ cùng hướng về một mục tiêu chung.',NULL,NULL,NULL,NULL,NULL);
INSERT OR IGNORE INTO "section" ("id","chapter_id","parent_id","level","title","slug","order") VALUES ('fd07764d-e1a8-4c1e-b9c0-0e5974ddc7a5','26-r-o-a-d-m-a-p',NULL,2,'Prosper — Thịnh Vượng','prosper-thinh-vuong',12);
INSERT OR IGNORE INTO "block" ("id","section_id","order","type","text_md","r2_key","filename","mime","alt","caption") VALUES ('b4be1f9c-ac24-43f7-b7c3-7be4499417b6','fd07764d-e1a8-4c1e-b9c0-0e5974ddc7a5',13,'text','PROSPER là sự thịnh vượng có nền tảng, có phẩm giá và có khả năng duy trì lâu dài.

Đây không phải là đích đến cuối cùng. PROSPER là bằng chứng cho thấy toàn bộ hệ thống đang sinh trưởng đúng hướng. Và khi PROSPER được duy trì, tổ chức cần quay về ROOTS để soi chiếu lại — vòng lặp không bao giờ kết thúc.',NULL,NULL,NULL,NULL,NULL);

