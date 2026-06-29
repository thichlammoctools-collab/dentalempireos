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
      { href: '/admin',          label: 'Bảng điều khiển', icon: 'dashboard',     match: '/admin' },
      { href: '/admin/scanners', label: 'Máy quét',        icon: 'fact_check',    match: '/admin/scanners' },
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
    key: 'community',
    label: 'CỘNG ĐỒNG',
    items: [
      { href: '/admin/questions', label: 'Hỏi đáp',    icon: 'question_answer', match: '/admin/questions' },
      { href: '/admin/users',     label: 'Người dùng', icon: 'people',          match: '/admin/users' },
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
    key: 'system',
    label: 'HỆ THỐNG & AI',
    items: [
      { href: '/admin/apps',         label: 'Ứng dụng AI', icon: 'smart_toy', match: '/admin/apps' },
      { href: '/admin/ai-settings',  label: 'Cài đặt AI',  icon: 'tune',      match: '/admin/ai-settings' },
    ],
  },
];
