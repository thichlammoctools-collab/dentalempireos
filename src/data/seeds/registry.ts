// Registry of bundled scanner seeds.
// POST /api/admin/seed-scanner/[id] imports any of these into D1.
// GET lists all available seeds.
//
// To add a new seed:
//   1. Create the file with default export (see ho-so-goc-re.ts)
//   2. Import + add to SEED_REGISTRY below
//   3. POST to /api/admin/seed-scanner/<id> to apply

import { HO_SO_GOC_RE_SEED } from './ho-so-goc-re';
import { HE_THONG_CHECK_SEED } from './he-thong-check';
import { NHAN_SU_CHECK_SEED } from './nhan-su-check';
import { QUY_TRINH_CHECK_SEED } from './quy-trinh-check';
import { TIEP_DON_CHECK_SEED } from './tiep-don-check';
import { TAI_CHINH_CHECK_SEED } from './tai-chinh-check';
import { AN_TOAN_CHECK_SEED } from './an-toan-check';
import { MARKETING_CHECK_SEED } from './marketing-check';
import { CSKH_CHECK_SEED } from './cskh-check';
import { VAN_HOA_CHECK_SEED } from './van-hoa-check';
import { THUONG_HIEU_CHECK_SEED } from './thuong-hieu-check';
import { STARTUP_CHECK_SEED } from './startup-check';
import { CONTENT_FUNNEL_CHECK_SEED } from './content-funnel-check';
import { REFERRAL_CHECK_SEED } from './referral-check';
import { DO_LUONG_CHECK_SEED } from './do-luong-check';
import { KHO_VAT_TU_CHECK_SEED } from './kho-vat-tu-check';
import { LINH_HON_CHECK_SEED } from './linh-hon-check';
import { CHU_THE_HOA_CHECK_SEED } from './chu-the-hoa-check';
import { CASE_REFLECTION_CHECK_SEED } from './case-reflection-check';
import { NANG_LUONG_CHECK_SEED } from './nang-luong-check';
import { SO_HOA_CHECK_SEED } from './so-hoa-check';

export interface SeedQuestion {
  question_id: string;
  order_idx: number;
  type: 'textarea' | 'select' | 'radio' | 'yesno';
  label_vi: string;
  label_en?: string;
  placeholder_vi?: string;
  placeholder_en?: string;
  options_vi?: string[];
  options_en?: string[];
  scale_labels_vi?: Record<string, string>;
  scale_labels_en?: Record<string, string>;
  required?: number;
  anchor?: number;
  weight?: number | null;
  dimension?: string;
}

export interface SeedSection {
  order_idx: number;
  title_vi: string;
  title_en?: string;
  subtitle_vi?: string;
  subtitle_en?: string;
  ref?: string;
  icon?: string;
  questions: SeedQuestion[];
}

export interface SeedScanner {
  id: string;
  slug: string;
  title_vi: string;
  title_en?: string;
  description_vi?: string;
  description_en?: string;
  subtitle_vi?: string;
  subtitle_en?: string;
  chapter_refs?: string[];
  status?: 'draft' | 'active' | 'archived';
  is_free?: number;
  survey_type?: 'mini' | 'full' | 'checklist';
  lead_fields?: any;
  scoring_rules?: any;
  ai_config?: any;
  translations_vi?: any;
  translations_en?: any;
  order_index?: number;
  sections: SeedSection[];
}

export const SEED_REGISTRY: Record<string, SeedScanner> = {
  [HO_SO_GOC_RE_SEED.id as string]: HO_SO_GOC_RE_SEED as unknown as SeedScanner,
  [HE_THONG_CHECK_SEED.id as string]: HE_THONG_CHECK_SEED as unknown as SeedScanner,
  [NHAN_SU_CHECK_SEED.id as string]: NHAN_SU_CHECK_SEED as unknown as SeedScanner,
  [QUY_TRINH_CHECK_SEED.id as string]: QUY_TRINH_CHECK_SEED as unknown as SeedScanner,
  [TIEP_DON_CHECK_SEED.id as string]: TIEP_DON_CHECK_SEED as unknown as SeedScanner,
  [TAI_CHINH_CHECK_SEED.id as string]: TAI_CHINH_CHECK_SEED as unknown as SeedScanner,
  [AN_TOAN_CHECK_SEED.id as string]: AN_TOAN_CHECK_SEED as unknown as SeedScanner,
  [MARKETING_CHECK_SEED.id as string]: MARKETING_CHECK_SEED as unknown as SeedScanner,
  [CSKH_CHECK_SEED.id as string]: CSKH_CHECK_SEED as unknown as SeedScanner,
  [VAN_HOA_CHECK_SEED.id as string]: VAN_HOA_CHECK_SEED as unknown as SeedScanner,
  [THUONG_HIEU_CHECK_SEED.id as string]: THUONG_HIEU_CHECK_SEED as unknown as SeedScanner,
  [STARTUP_CHECK_SEED.id as string]: STARTUP_CHECK_SEED as unknown as SeedScanner,
  [CONTENT_FUNNEL_CHECK_SEED.id as string]: CONTENT_FUNNEL_CHECK_SEED as unknown as SeedScanner,
  [REFERRAL_CHECK_SEED.id as string]: REFERRAL_CHECK_SEED as unknown as SeedScanner,
  [DO_LUONG_CHECK_SEED.id as string]: DO_LUONG_CHECK_SEED as unknown as SeedScanner,
  [KHO_VAT_TU_CHECK_SEED.id as string]: KHO_VAT_TU_CHECK_SEED as unknown as SeedScanner,
  [LINH_HON_CHECK_SEED.id as string]: LINH_HON_CHECK_SEED as unknown as SeedScanner,
  [CHU_THE_HOA_CHECK_SEED.id as string]: CHU_THE_HOA_CHECK_SEED as unknown as SeedScanner,
  [CASE_REFLECTION_CHECK_SEED.id as string]: CASE_REFLECTION_CHECK_SEED as unknown as SeedScanner,
  [NANG_LUONG_CHECK_SEED.id as string]: NANG_LUONG_CHECK_SEED as unknown as SeedScanner,
  [SO_HOA_CHECK_SEED.id as string]: SO_HOA_CHECK_SEED as unknown as SeedScanner,
};