/**
 * Single source of truth cho menu admin sidebar.
 * Thêm / sắp xếp / đổi nhãn mục tại đây, không cần sửa Sidebar.astro.
 */

export interface AdminNavItem {
  href: string;
  label: string;
  icon: string;       // Material Symbols ligature
  match?: string;     // pathname prefix đánh dấu active
}

export interface AdminNavSection {
  key: string;        // id duy nhất, vd 'overview'
  label: string;      // header hiển thị, vd 'TỔNG QUAN'
  items: AdminNavItem[];
}

export const adminNav: AdminNavSection[] = [
  {
    key: 'overview',
    label: 'TỔNG QUAN',
    items: [
      { href: '/admin', label: 'Bảng điều khiển', icon: 'dashboard', match: '/admin' },
    ],
  },
  {
    key: 'content',
    label: 'NỘI DUNG & ĐÀO TẠO',
    items: [
      { href: '/admin/ebooks',    label: 'Tài liệu điện tử', icon: 'menu_book',     match: '/admin/ebooks' },
      { href: '/admin/blog',      label: 'Bài viết',     icon: 'newsmode',      match: '/admin/blog' },
      { href: '/admin/resources', label: 'Tài liệu',     icon: 'folder_shared', match: '/admin/resources' },
      { href: '/admin/courses',   label: 'Khóa học',     icon: 'school',        match: '/admin/courses' },
      { href: '/admin/questions', label: 'Câu hỏi',      icon: 'forum',         match: '/admin/questions' },
      { href: '/admin/homepage',  label: 'Trang chủ',    icon: 'home',          match: '/admin/homepage' },
    ],
  },
  {
    key: 'auth',
    label: 'XÁC THỰC',
    items: [
      { href: '/admin/auth/users',  label: 'Người dùng', icon: 'people',       match: '/admin/auth/users' },
      { href: '/admin/auth/stats',  label: 'Thống kê',   icon: 'analytics',    match: '/admin/auth/stats' },
      { href: '/admin/auth/audit', label: 'Nhật ký',    icon: 'history_toggle_off', match: '/admin/auth/audit' },
    ],
  },
  {
    key: 'commerce',
    label: 'THƯƠNG MẠI',
    items: [
      { href: '/admin/credits',          label: 'Credits',          icon: 'account_balance_wallet', match: '/admin/credits' },
      { href: '/admin/credits/orders',   label: 'Đơn nạp Credits',  icon: 'receipt_long',           match: '/admin/credits/orders' },
      { href: '/admin/settings/payos',   label: 'Cổng thanh toán',  icon: 'payment',             match: '/admin/settings/payos' },
      { href: '/admin/settings/support', label: 'Ủng hộ tác giả',   icon: 'volunteer_activism',  match: '/admin/settings/support' },
    ],
  },
  {
    key: 'operations',
    label: 'VẬN HÀNH',
    items: [
      { href: '/admin/consultation-requests', label: 'Lead tư vấn', icon: 'contact_page', match: '/admin/consultation-requests' },
    ],
  },
  {
    key: 'ai',
    label: 'AI & CẤU HÌNH',
    items: [
      { href: '/admin/scanners',    label: 'Máy quét',     icon: 'fact_check', match: '/admin/scanners' },
      { href: '/admin/ai-usage',   label: 'Sử dụng AI',   icon: 'monitoring', match: '/admin/ai-usage' },
      { href: '/admin/ai-settings', label: 'Cài đặt AI',  icon: 'tune',      match: '/admin/ai-settings' },
    ],
  },
];
