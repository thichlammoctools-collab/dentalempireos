// Keyword auto-linking registry
// Keywords found in prose are automatically wrapped in <a> links

export interface KeywordDef {
  label: string;
  target: string;       // URL path to link target
  description?: string; // optional tooltip
}

export const keywords: Record<string, KeywordDef> = {
  // ═══════════════════════════════════════
  // Frameworks cốt lõi
  // ═══════════════════════════════════════
  'SKY': {
    label: 'SKY',
    target: '/book/tier-3/24-to-be-sky#sky-la-gi',
    description: 'Sincerity, Kindness, Yielding — Trục đạo đức',
  },
  'S.T.A.R.S': {
    label: 'S.T.A.R.S',
    target: '/book/tier-3/25-s-t-a-r-s',
    description: 'Skills, Traits, Actions, Results, Synergy — Bản đồ năng lực',
  },
  'S.T.A.R.S.': {
    label: 'S.T.A.R.S.',
    target: '/book/tier-3/25-s-t-a-r-s',
    description: 'Skills, Traits, Actions, Results, Synergy — Bản đồ năng lực',
  },
  'R.O.A.D.M.A.P': {
    label: 'R.O.A.D.M.A.P',
    target: '/book/tier-3/26-r-o-a-d-m-a-p',
    description: 'Roots, One Light, Awaken, Deepen, Mature, Align, Prosper',
  },
  'TO BE SKY': {
    label: 'TO BE SKY',
    target: '/book/tier-3/24-to-be-sky#to-be-sky',
    description: 'Tư tưởng cốt lõi: Transcend, Open, Beneath, Enlighten',
  },

  // ═══════════════════════════════════════
  // SKY Components
  // ═══════════════════════════════════════
  'Sincerity': {
    label: 'Sincerity',
    target: '/book/tier-3/24-to-be-sky#sincerity-su-chan-thanh',
    description: 'Sự chân thành và trung thực',
  },
  'Kindness': {
    label: 'Kindness',
    target: '/book/tier-3/24-to-be-sky#kindness-long-tu-te',
    description: 'Lòng tử tế và tinh thần nhân bản',
  },
  'Yielding': {
    label: 'Yielding',
    target: '/book/tier-3/24-to-be-sky#yielding-kha-nang-nhuong-minh',
    description: 'Khả năng nhường mình để ưu tiên điều đúng',
  },

  // ═══════════════════════════════════════
  // S.T.A.R.S Components
  // ═══════════════════════════════════════
  'Skills': {
    label: 'Skills',
    target: '/book/tier-3/25-s-t-a-r-s#skills-ky-nang',
    description: 'Năng lực chuyên môn, kỹ năng giao tiếp, vận hành',
  },
  'Traits': {
    label: 'Traits',
    target: '/book/tier-3/25-s-t-a-r-s#traits-to-chat',
    description: 'Khí chất tự nhiên, tố chất phù hợp vai trò',
  },
  'Actions': {
    label: 'Actions',
    target: '/book/tier-3/25-s-t-a-r-s#actions-kha-nang-hanh-dong',
    description: 'Tính chủ động, kỷ luật thực thi',
  },
  'Results': {
    label: 'Results',
    target: '/book/tier-3/25-s-t-a-r-s#results-ket-qua',
    description: 'Đầu ra thực tế, mức độ hoàn thành mục tiêu',
  },
  'Synergy': {
    label: 'Synergy',
    target: '/book/tier-3/25-s-t-a-r-s#synergy-cong-huong',
    description: 'Khả năng phối hợp, làm mạnh hệ thống',
  },

  // ═══════════════════════════════════════
  // R.O.A.D.M.A.P Components
  // ═══════════════════════════════════════
  'ROOTS': {
    label: 'ROOTS',
    target: '/book/tier-3/26-r-o-a-d-m-a-p#roots-goc-re',
    description: 'Gốc rễ bản sắc tổ chức',
  },
  'ONE LIGHT': {
    label: 'ONE LIGHT',
    target: '/book/tier-3/26-r-o-a-d-m-a-p#one-light-tam-go-dao-duc',
    description: 'Tâm gỗ đạo đức',
  },
  'AWAKEN': {
    label: 'AWAKEN',
    target: '/book/tier-3/26-r-o-a-d-m-a-p#awaken-tu-soi-chieu',
    description: 'Tự soi chiếu',
  },
  'DEEPEN': {
    label: 'DEEPEN',
    target: '/book/tier-3/26-r-o-a-d-m-a-p#deepen-dao-sau',
    description: 'Đào sâu chuẩn hóa năng lực',
  },
  'MATURE': {
    label: 'MATURE',
    target: '/book/tier-3/26-r-o-a-d-m-a-p#mature-nang-tang',
    description: 'Nâng tầng đội ngũ',
  },
  'ALIGN': {
    label: 'ALIGN',
    target: '/book/tier-3/26-r-o-a-d-m-a-p#align-dong-bo',
    description: 'Đồng bộ nguồn lực',
  },
  'PROSPER': {
    label: 'PROSPER',
    target: '/book/tier-3/26-r-o-a-d-m-a-p#prosper-thinh-vuong',
    description: 'Thịnh vượng có phẩm giá',
  },

  // ═══════════════════════════════════════
  // Quản trị concepts
  // ═══════════════════════════════════════
  'Patient Experience': {
    label: 'Patient Experience',
    target: '/book/tier-2/19-patient-experience',
    description: 'Trải nghiệm người bệnh toàn diện',
  },
  'Referral': {
    label: 'Referral',
    target: '/book/tier-2/18-referral-system',
    description: 'Hệ thống giới thiệu khách hàng',
  },
  'CRM': {
    label: 'CRM',
    target: '/book/tier-2/16-crm-tuong-tac',
    description: 'Quản trị quan hệ khách hàng',
  },
  'KPI': {
    label: 'KPI',
    target: '/book/tier-2/15-kpi-do-luong',
    description: 'Chỉ số hiệu suất then chốt',
  },
  'Y đức': {
    label: 'Y đức',
    target: '/book/tier-3/24-to-be-sky',
    description: 'Đạo đức nghề nghiệp y khoa',
  },
  'onboarding': {
    label: 'onboarding',
    target: '/book/tier-3/27-dao-tao',
    description: 'Chương trình đào tạo nhân viên mới',
  },
  'Dental Empire OS': {
    label: 'Dental Empire OS',
    target: '/book/tier-3/21-tong-quan-he-thong',
    description: 'Hệ điều hành quản trị nha khoa toàn diện',
  },
  'Dental Empire C++': {
    label: 'Dental Empire C++',
    target: '/book/',
    description: 'Tầng 1: Nền tảng chuyên môn và vận hành',
  },
  'Dental Empire U++': {
    label: 'Dental Empire U++',
    target: '/book/',
    description: 'Tầng 2: Nâng cấp và nhân bản',
  },
};

// Vietnamese keyword aliases (mapped to same targets)
export const keywordAliases: Record<string, string> = {
  'chân thành': 'Sincerity',
  'tử tế': 'Kindness',
  'nhường mình': 'Yielding',
  'kỹ năng': 'Skills',
  'tố chất': 'Traits',
  'hành động': 'Actions',
  'kết quả': 'Results',
  'cộng hưởng': 'Synergy',
  'gốc rễ': 'ROOTS',
  'tâm gỗ': 'ONE LIGHT',
  'tự soi chiếu': 'AWAKEN',
  'đào sâu': 'DEEPEN',
  'nâng tầng': 'MATURE',
  'đồng bộ': 'ALIGN',
  'thịnh vượng': 'PROSPER',
  'trải nghiệm người bệnh': 'Patient Experience',
  'giới thiệu khách hàng': 'Referral',
  'quản trị quan hệ khách hàng': 'CRM',
  'chỉ số hiệu suất': 'KPI',
};

