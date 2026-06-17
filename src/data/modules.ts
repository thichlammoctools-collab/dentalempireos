// Full 32-chapter structure for Dental Empire OS
// Tier 1 (1-10): Dental Empire C++
// Tier 2 (11-20): Dental Empire U++
// Tier 3 (21-32): Dental Empire OS

export interface ChapterMeta {
  tier: number;
  chapter: number;
  title: string;
  slug: string;
  description: string;
  modules: string[]; // h2 heading titles within the chapter
  draft?: boolean;
}

export interface TierMeta {
  tier: number;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
}

export const tiers: TierMeta[] = [
  { tier: 1, name: 'Dental Empire C++', subtitle: 'Nền tảng chuyên môn và vận hành cơ bản', icon: 'medical_services', color: 'from-blue-500 to-blue-600' },
  { tier: 2, name: 'Dental Empire U++', subtitle: 'Nâng cấp và nhân bản', icon: 'trending_up', color: 'from-emerald-500 to-emerald-600' },
  { tier: 3, name: 'Dental Empire OS', subtitle: 'Hệ điều hành quản trị toàn diện', icon: 'deployed_code', color: 'from-amber-500 to-amber-600' },
];

// All 32 chapters (metadata — content to be added by BS. Vinh)
// Chapters with draft: true have no content yet
export const chapters: ChapterMeta[] = [
  // ═══════════════════════════════════════
  // TIER 1: Dental Empire C++ (Chapters 1-10)
  // ═══════════════════════════════════════
  { tier: 1, chapter: 1, title: 'Triển Khai Hệ Thống', slug: '01-trien-khai-he-thong', description: 'Các nguyên tắc cốt lõi để xây dựng hệ thống quản trị phòng khám từ ngày đầu.', modules: ['Tại Sao Cần Hệ Thống', '5 Nguyên Tắc Cốt Lõi', 'Bài Tập Thực Hành'] },
  { tier: 1, chapter: 2, title: 'Quản Trị Nhân Sự', slug: '02-quan-tri-nhan-su', description: 'Xây dựng cấu trúc phòng ban, tuyển dụng và đào tạo nhân sự nha khoa.', modules: ['Cấu Trúc Phòng Ban', 'Quy Trình Tuyển Dụng', 'Đào Tạo Nhân Viên Mới'] },
  { tier: 1, chapter: 3, title: 'Quy Trình Vận Hành', slug: '03-quy-trinh-van-hanh', description: 'Thiết lập quy trình chuẩn cho mọi hoạt động phòng khám.', modules: [], draft: true },
  { tier: 1, chapter: 4, title: 'Tiếp Đón & Tư Vấn', slug: '04-tiep-don-tu-van', description: 'Quy trình tiếp đón khách hàng và tư vấn điều trị hiệu quả.', modules: [], draft: true },
  { tier: 1, chapter: 5, title: 'Điều Trị & An Toàn', slug: '05-dieu-tri-an-toan', description: 'Chuẩn hóa quy trình điều trị và đảm bảo an toàn người bệnh.', modules: [], draft: true },
  { tier: 1, chapter: 6, title: 'Chăm Sóc Khách Hàng', slug: '06-cham-soc-khach-hang', description: 'Hệ thống CSKH trước, trong và sau điều trị.', modules: [], draft: true },
  { tier: 1, chapter: 7, title: 'Quản Lý Vật Tư', slug: '07-quan-ly-vat-tu', description: 'Quản lý kho vật tư, thiết bị và tiêu hao.', modules: [], draft: true },
  { tier: 1, chapter: 8, title: 'Kế Hoạch Tài Chính', slug: '08-ke-hoach-tai-chinh', description: 'Xây dựng kế hoạch tài chính và quản lý dòng tiền.', modules: [], draft: true },
  { tier: 1, chapter: 9, title: 'Văn Hóa Phòng Khám', slug: '09-van-hoa-phong-kham', description: 'Thiết lập văn hóa tổ chức và giá trị cốt lõi.', modules: [], draft: true },
  { tier: 1, chapter: 10, title: 'Checklist Khởi Đầu', slug: '10-checklist-khoi-dau', description: 'Bộ checklist tổng hợp cho phòng khám mới bắt đầu.', modules: [], draft: true },

  // ═══════════════════════════════════════
  // TIER 2: Dental Empire U++ (Chapters 11-20)
  // ═══════════════════════════════════════
  { tier: 2, chapter: 11, title: 'Marketing Y Khoa', slug: '11-marketing-y-khoa', description: 'Chiến lược marketing đặc thù cho ngành nha khoa.', modules: [], draft: true },
  { tier: 2, chapter: 12, title: 'Xây Dựng Thương Hiệu', slug: '12-xay-dung-thuong-hieu', description: 'Personal branding và brand building cho phòng khám.', modules: [], draft: true },
  { tier: 2, chapter: 13, title: 'Content Marketing', slug: '13-content-marketing', description: 'Chiến lược nội dung thu hút và chuyển đổi khách hàng.', modules: [], draft: true },
  { tier: 2, chapter: 14, title: 'Quản Trị Nhân Sự Nâng Cao', slug: '14-quan-tri-nhan-su-nang-cao', description: 'Tuyển dụng, đào tạo và giữ chân nhân tài.', modules: [], draft: true },
  { tier: 2, chapter: 15, title: 'KPI & Đo Lường', slug: '15-kpi-do-luong', description: 'Thiết lập hệ thống KPI cho mọi bộ phận.', modules: [], draft: true },
  { tier: 2, chapter: 16, title: 'CRM & Tương Tác', slug: '16-crm-tuong-tac', description: 'Hệ thống quản trị quan hệ khách hàng.', modules: [], draft: true },
  { tier: 2, chapter: 17, title: 'Tài Chính Nâng Cao', slug: '17-tai-chinh-nang-cao', description: 'P&L, ROI, pricing strategy và quản lý lợi nhuận.', modules: [], draft: true },
  { tier: 2, chapter: 18, title: 'Referral System', slug: '18-referral-system', description: 'Hệ thống giới thiệu khách hàng và referral loop.', modules: [], draft: true },
  { tier: 2, chapter: 19, title: 'Patient Experience', slug: '19-patient-experience', description: 'Nâng cấp trải nghiệm người bệnh toàn diện.', modules: [], draft: true },
  { tier: 2, chapter: 20, title: 'Mở Rộng Quy Mô', slug: '20-mo-rong-quy-mo', description: 'Chiến lược mở rộng từ 1 đến nhiều cơ sở.', modules: [], draft: true },

  // ═══════════════════════════════════════
  // TIER 3: Dental Empire OS (Chapters 21-32)
  // ═══════════════════════════════════════
  { tier: 3, chapter: 21, title: 'Tổng Quan Hệ Thống', slug: '21-tong-quan-he-thong', description: 'Giới thiệu tổng quan về hệ điều hành quản trị Dental Empire OS.', modules: ['Dental Empire OS là gì?', 'Tầm nhìn', 'Cấu Trúc 3 Tầng', 'Khởi Đầu Hành Trình'] },
  { tier: 3, chapter: 22, title: 'Hệ Thống Sống', slug: '22-he-thong-song', description: 'Tổ chức không phải là cỗ máy, mà là một hệ thống sống.', modules: ['Tổ Chức Không Phải Là Cỗ Máy', 'R.O.A.D.M.A.P Là Gì?', 'Vòng Lặp Học Hỏi'] },
  { tier: 3, chapter: 23, title: 'Con Người Là Chủ Thể', slug: '23-con-nguoi-la-chu-the', description: 'Con người không phải là nguồn lực, mà là chủ thể trưởng thành.', modules: ['Con Người Trong Tổ Chức', 'Tuyển Dụng Đúng Người', 'Tiến Trình Trưởng Thành'] },
  { tier: 3, chapter: 24, title: 'TO BE SKY', slug: '24-to-be-sky', description: 'Bầu trời đạo đức phía trên tổ chức — Sincerity, Kindness, Yielding.', modules: ['SKY Là Gì?', 'Sincerity — Sự Chân Thành', 'Kindness — Lòng Tử Tế', 'Yielding — Khả Năng Nhường Mình', 'TO BE SKY'] },
  { tier: 3, chapter: 25, title: 'S.T.A.R.S', slug: '25-s-t-a-r-s', description: 'Bản đồ năng lực của con người — Skills, Traits, Actions, Results, Synergy.', modules: ['SKY và S.T.A.R.S Song Song', 'Skills — Kỹ Năng', 'Traits — Tố Chất', 'Actions — Khả Năng Hành Động', 'Results — Kết Quả', 'Synergy — Cộng Hưởng'] },
  { tier: 3, chapter: 26, title: 'R.O.A.D.M.A.P', slug: '26-r-o-a-d-m-a-p', description: 'Con đường biến văn hóa thành hệ thống.', modules: ['Roots — Gốc Rễ', 'One Light — Tâm Gỗ Đạo Đức', 'Awaken — Tự Soi Chiếu', 'Deepen — Đào Sâu', 'Mature — Nâng Tầng', 'Align — Đồng Bộ', 'Prosper — Thịnh Vượng'] },
  { tier: 3, chapter: 27, title: 'Đào Tạo', slug: '27-dao-tao', description: 'Đào tạo là hạ tầng của sự trưởng thành.', modules: ['Đào Tạo Từ Ngày Đầu', 'Đào Tạo Liên Tục', 'Công Cụ Đào Tạo'] },
  { tier: 3, chapter: 28, title: 'Đo Lường', slug: '28-do-luong', description: 'Đo lường không phải để kiểm soát, mà để nhìn thấy sự thật.', modules: ['Đo Lường Đúng Cách', 'SKY Phản Chiếu KPI', 'Thưởng Phạt Công Bằng'] },
  { tier: 3, chapter: 29, title: 'Linh Hồn Phòng Khám', slug: '29-linh-hon-phong-kham', description: 'Phòng khám có thể lớn lên mà không đánh mất linh hồn.', modules: ['Linh Hồn Không Phải Cảm Xúc', 'Tăng Trưởng Có Trục', 'Đáng Tin Hơn'] },
  { tier: 3, chapter: 30, title: 'Case Study', slug: '30-case-study', description: 'Các bài học thực tế từ phòng khám đã áp dụng Dental Empire OS.', modules: [], draft: true },
  { tier: 3, chapter: 31, title: 'Bài Tập Thực Hành', slug: '31-bai-tap-thuc-hanh', description: 'Bộ bài tập tổng hợp giúp áp dụng toàn bộ hệ thống.', modules: [], draft: true },
  { tier: 3, chapter: 32, title: 'Roadmap Áp Dụng', slug: '32-roadmap-ap-dung', description: 'Lộ trình từng bước triển khai Dental Empire OS.', modules: [], draft: true },
];

// Testimonials for homepage social proof section
export const testimonials = [
  {
    quote: 'Hệ thống Dental Empire OS đã giúp tôi giải phóng hoàn toàn khỏi việc giám sát vặt tại phòng khám. Giờ đây tôi có thể tập trung vào chuyên môn và mở thêm cơ sở thứ 3.',
    name: 'BS. Nguyễn Minh Tuấn',
    role: 'Chủ hệ thống Nha Khoa Tâm Đức',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop',
  },
  {
    quote: 'Kiến thức về Marketing và Tài chính trong sách rất thực chiến. Tôi đã áp dụng ngay và thấy doanh thu tăng trưởng rõ rệt chỉ sau 3 tháng.',
    name: 'BS. Phan Thùy Linh',
    role: 'Giám đốc Nha Khoa Elite',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
  },
  {
    quote: 'Dental Empire không chỉ là một cộng đồng, đó là nơi những người làm nghề y học cách làm kinh doanh một cách tử tế và chuyên nghiệp.',
    name: 'BS. Trần Hoàng Nam',
    role: 'Founder Dental Connect',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop',
  },
] as const;
