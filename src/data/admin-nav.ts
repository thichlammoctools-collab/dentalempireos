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
      { href: '/admin/ebooks',    label: 'Sách điện tử', icon: 'menu_book',     match: '/admin/ebooks' },
      { href: '/admin/blog',      label: 'Bài viết',     icon: 'newsmode',      match: '/admin/blog' },
      { href: '/admin/resources', label: 'Tài liệu',     icon: 'folder_shared', match: '/admin/resources' },
      { href: '/admin/courses',   label: 'Khóa học',     icon: 'school',        match: '/admin/courses' },
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
      { href: '/admin/products',         label: 'Sản phẩm',         icon: 'inventory_2',         match: '/admin/products' },
      { href: '/admin/orders',           label: 'Đơn hàng',         icon: 'receipt_long',        match: '/admin/orders' },
      { href: '/admin/settings/payos',   label: 'Cổng thanh toán',  icon: 'payment',             match: '/admin/settings/payos' },
      { href: '/admin/settings/support', label: 'Ủng hộ tác giả',   icon: 'volunteer_activism',  match: '/admin/settings/support' },
    ],
  },
  {
    key: 'ai',
    label: 'AI & CẤU HÌNH',
    items: [
      { href: '/admin/scanners',    label: 'Máy quét',     icon: 'fact_check', match: '/admin/scanners' },
      { href: '/admin/apps',       label: 'Ứng dụng AI',  icon: 'smart_toy', match: '/admin/apps' },
      { href: '/admin/ai-settings', label: 'Cài đặt AI',  icon: 'tune',      match: '/admin/ai-settings' },
    ],
  },
];
