#!/usr/bin/env node
// Seed 3 new scanners into D1 using wrangler
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const DB = 'dentalempireos-db';
const REMOTE = '--remote';

// Helper to run wrangler
function run(cmd) {
  console.log('>', cmd);
  try {
    const out = execSync(cmd, { encoding: 'utf-8' });
    console.log(out);
    return out;
  } catch (e) {
    console.error(e.stdout || e.message);
    return null;
  }
}

// Read scanner seed files and extract JSON for upsert
// We'll use wrangler d1 execute to INSERT directly

// First check existing scanners
console.log('\n=== Current scanners in D1 ===');
run(`npx wrangler d1 execute ${DB} --command "SELECT id, slug FROM survey_definition" ${REMOTE}`);

// Insert tiep-don-check
console.log('\n=== Seeding tiep-don-check ===');
run(`npx wrangler d1 execute ${DB} --command "
INSERT OR REPLACE INTO survey_definition (id, slug, title_vi, title_en, description_vi, description_en, subtitle_vi, subtitle_en, chapter_refs, status, is_free, survey_type, lead_fields, scoring_rules, ai_config, translations_vi, translations_en, order_index, created_at)
VALUES (
  'tiep-don-check', 'tiep-don-check',
  'Tiếp Đón Check', 'Patient Reception Check',
  'Trải nghiệm bệnh nhân bắt đầu từ khoảnh khắc đặt chân vào phòng khám. 7 câu hỏi giúp bạn nhìn rõ thực tế tiếp đón — và đâu là điểm cần cải thiện ngay.',
  'Patient experience starts the moment they step into your clinic. 7 questions to see your current reception reality — and what needs immediate improvement.',
  'Chẩn đoán nhanh theo Chương 4 — Trải Nghiệm Bệnh Nhân',
  'Quick diagnosis based on Chapter 4 — Patient Experience',
  '[\"Ch.4\"]',
  'active', 1, 'mini',
  '{\"clinic_name\":{\"label_vi\":\"Tên phòng khám\",\"label_en\":\"Clinic name\",\"required\":true,\"placeholder_vi\":\"Nha Khoa ABC\",\"type\":\"text\"},\"email\":{\"label_vi\":\"Email\",\"label_en\":\"Email\",\"required\":true,\"placeholder_vi\":\"nhakhoa@email.com\",\"type\":\"email\"}}',
  NULL, NULL,
  '{\"submitting\":\"Đang xử lý...\",\"draft_restored\":\"Bạn có bản nháp chưa hoàn thành.\"}',
  '{}',
  4, datetime('now')
)
" ${REMOTE}`);

console.log('\n=== Done ===');
