export const GUEST_SCANNER_SLUGS = [
  'loi-nhu-quan-check',
  'linh-hon-check',
  'startup-check',
  'total-os-diagnostic',
] as const;

export type GuestScannerSlug = (typeof GUEST_SCANNER_SLUGS)[number];

export function isGuestScannerSlug(slug: string): slug is GuestScannerSlug {
  return (GUEST_SCANNER_SLUGS as readonly string[]).includes(slug);
}

export const GUEST_SCANNER_NEXT_STEPS: Record<GuestScannerSlug, { href: string; eyebrow: string; title: string; description: string; cta: string }> = {
  'loi-nhu-quan-check': {
    href: '/scanner/linh-hon-check',
    eyebrow: 'Bước 2 trong lộ trình nền tảng',
    title: 'Tiếp tục Linh Hồn Check',
    description: 'Làm rõ sứ mệnh, tầm nhìn và giá trị cốt lõi trước khi chọn cách vận hành hoặc phát triển phòng khám.',
    cta: 'Khám phá Linh Hồn Check',
  },
  'linh-hon-check': {
    href: '/lo-trinh-scanner',
    eyebrow: 'Bước 3 trong lộ trình nền tảng',
    title: 'Chọn lộ trình vận hành phù hợp',
    description: 'Chọn giai đoạn của phòng khám để tiếp tục với Bảng Start Up hoặc Bảng Tổng Hợp.',
    cta: 'Chọn lộ trình',
  },
  'startup-check': {
    href: '/scanner',
    eyebrow: 'Bước tiếp theo',
    title: 'Đi sâu vào điểm cần ưu tiên',
    description: 'Bạn đã có bức tranh sẵn sàng khởi động. Hãy chọn một Scanner chuyên sâu theo nhu cầu hiện tại.',
    cta: 'Khám phá Scanner chuyên sâu',
  },
  'total-os-diagnostic': {
    href: '/scanner',
    eyebrow: 'Bước tiếp theo',
    title: 'Đi sâu vào điểm cần ưu tiên',
    description: 'Bạn đã có bức tranh toàn cảnh. Hãy chọn Scanner chuyên sâu theo hệ thống cần củng cố trước.',
    cta: 'Khám phá Scanner chuyên sâu',
  },
};
