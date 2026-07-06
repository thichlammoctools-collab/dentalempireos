globalThis.process ??= {};
globalThis.process.env ??= {};
const resourceCategories = [
  { id: "all", label: "Tất cả", defaultIcon: "apps" },
  { id: "bieu_mau", label: "Biểu mẫu", defaultIcon: "description" },
  { id: "checklist", label: "Checklist", defaultIcon: "checklist" },
  { id: "sops", label: "SOPs", defaultIcon: "rule" },
  { id: "cong_cu", label: "Công cụ", defaultIcon: "construction" },
  { id: "tham_khao", label: "Tham khảo", defaultIcon: "menu_book" }
];
const resources = [
  {
    id: "sop-checklist",
    title: "Quy trình đón tiếp bệnh nhân",
    description: "Bộ quy trình chuẩn hóa từ tiếp đón, tư vấn, điều trị đến tái khám. Áp dụng cho mọi phòng khám.",
    icon: "rule",
    fileExt: "pdf",
    category: "sops",
    tier: "free",
    updated: "2 ngày trước",
    tag: "Vận hành"
  },
  {
    id: "kpi-dashboard",
    title: "Bảng tính lương & KPI bác sĩ",
    description: "Bảng đo lường hiệu suất phòng khám — theo dõi doanh thu, khách hàng mới, tỷ lệ giữ chân và lợi nhuận ròng.",
    icon: "construction",
    fileExt: "xlsx",
    category: "cong_cu",
    tier: "premium",
    updated: "1 tuần trước",
    tag: "Tài chính"
  },
  {
    id: "video-lay-dau",
    title: "Video hướng dẫn lấy dấu mẫu",
    description: "Hướng dẫn chi tiết quy trình lấy dấu mẫu chuẩn cho phụ tá nha khoa, kèm checklist kiểm tra chất lượng.",
    icon: "rule",
    fileExt: "mp4",
    category: "sops",
    tier: "free",
    updated: "2 tuần trước",
    tag: "Đào tạo"
  },
  {
    id: "hop-dong-template",
    title: "Mẫu hợp đồng nha khoa",
    description: "Bộ mẫu hợp đồng dịch vụ, cam kết bảo hành và biên bản nghiệm thu chuẩn pháp lý cho phòng khám.",
    icon: "description",
    fileExt: "docx",
    category: "bieu_mau",
    tier: "free",
    updated: "1 tháng trước",
    tag: "Pháp lý"
  },
  {
    id: "crm-tracker",
    title: "CRM Khách Hàng Tracker",
    description: "Theo dõi hành trình khách hàng từ lần đầu liên hệ đến điều trị duy trì. Tích hợp nhắc lịch tái khám tự động.",
    icon: "construction",
    fileExt: "xlsx",
    category: "cong_cu",
    tier: "free",
    updated: "3 ngày trước",
    tag: "Khách hàng"
  },
  {
    id: "marketing-plan",
    title: "Kế hoạch Marketing 90 ngày",
    description: "Bản kế hoạch marketing chi tiết cho 90 ngày đầu — từ social media, Google Ads đến chương trình khuyến mãi.",
    icon: "menu_book",
    fileExt: "pdf",
    category: "tham_khao",
    tier: "premium",
    updated: "5 ngày trước",
    tag: "Marketing"
  },
  {
    id: "tuyen-dung-template",
    title: "Mẫu Tuyển Dụng Nhân Sự",
    description: "Bộ mẫu tin tuyển dụng, bảng đánh giá phỏng vấn và phiếu thử việc cho vị trí bác sĩ, phụ tá, lễ tân.",
    icon: "checklist",
    fileExt: "pdf",
    category: "checklist",
    tier: "free",
    updated: "2 tuần trước",
    tag: "Nhân sự"
  },
  {
    id: "financial-report",
    title: "Báo cáo tài chính tháng",
    description: "Mẫu báo cáo tài chính hàng tháng — dòng tiền, chi phí cố định, biến động và dự báo 3 tháng tới.",
    icon: "checklist",
    fileExt: "xlsx",
    category: "checklist",
    tier: "premium",
    updated: "1 tuần trước",
    tag: "Tài chính"
  }
];
export {
  resources as a,
  resourceCategories as r
};
