// Seed: Văn Hóa Check — based on Tier 1, Ch.9
// Premium scanner, paid AI analysis (is_free: 0), status: draft.

import type { SeedScanner } from './registry';

export const VAN_HOA_CHECK_SEED: SeedScanner = {
  id: 'van-hoa-check',
  slug: 'van-hoa-check',
  title_vi: 'Văn Hóa Check',
  title_en: 'Culture Check',
  description_vi: 'Văn hóa là DNA của phòng khám. 5 câu hỏi giúp bạn đánh giá sức khỏe văn hóa nội bộ và mức độ gắn kết nhân viên.',
  description_en: 'Culture is the DNA of your clinic. 5 questions to assess internal culture health and staff engagement.',
  subtitle_vi: 'Chẩn đoán nhanh theo Chương 9 — Văn Hóa Phòng Khám',
  subtitle_en: 'Quick diagnosis based on Chapter 9 — Clinic Culture',
  chapter_refs: ['Ch.9'],
  status: 'draft',
  is_free: 0,
  survey_type: 'mini',
  order_index: 9,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Văn Hóa Check', intro_desc: 'Văn hóa là DNA của phòng khám. 5 câu hỏi giúp bạn đánh giá sức khỏe văn hóa nội bộ và mức độ gắn kết nhân viên.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Culture Check', intro_desc: 'Culture is the DNA of your clinic. 5 questions to assess internal culture health and staff engagement.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'culture', name_vi: 'Văn hóa nội bộ', name_en: 'Internal Culture', question_ids: ['vh_q1', 'vh_q2', 'vh_q3', 'vh_q4'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Văn Hóa Check (điểm {{SCORE_CULTURE}}/100 và câu trả lời open), phân tích ngắn gọn sức khỏe văn hóa nội bộ và đưa ra 3 đề xuất cải thiện. Dùng tiếng Việt, giọng thẳng thắn ấm áp.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the Culture Check score ({{SCORE_CULTURE}}/100 and open answer), briefly analyze internal culture health and suggest 3 improvements. English, candid and warm tone.',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [{
    order_idx: 0,
    title_vi: '5 CÂU HỎI VỀ VĂN HÓA',
    title_en: '5 QUESTIONS ABOUT CULTURE',
    subtitle_vi: 'Nhân viên có tự hào khi giới thiệu nơi làm việc không?',
    subtitle_en: 'Are staff proud to introduce where they work?',
    ref: 'Ch.9 — Văn Hóa Phòng Khám',
    icon: 'diversity_3',
    questions: [
      { question_id: 'vh_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám có "giá trị cốt lõi" (core values) rõ ràng và được nhân viên biết không?', label_en: 'Does your clinic have clear core values that staff know and follow?', scale_labels_vi: { '1': 'Không có, chưa bao giờ nói về giá trị', '2': 'Có treo tường nhưng ít ai nhớ', '3': 'Giá trị cơ bản, nhắc nhở thỉnh thoảng', '4': 'Giá trị rõ ràng + tích hợp vào đánh giá', '5': 'Core values-driven culture + recruitment + recognition' }, scale_labels_en: { '1': 'No core values defined', '2': 'Posted on wall but rarely remembered', '3': 'Basic values, occasionally referenced', '4': 'Clear values + integrated in performance reviews', '5': 'Core values-driven culture + recruitment + recognition' }, dimension: 'culture' },
      { question_id: 'vh_q2', order_idx: 1, type: 'select', label_vi: 'Nhân viên có được lắng nghe và tham gia vào quyết định không?', label_en: 'Are staff listened to and included in decision-making?', scale_labels_vi: { '1': 'Mọi quyết định đều từ chủ / quản lý', '2': 'Ít khi, chỉ hỏi ý kiến cho form', '3': 'Thỉnh thoảng hỏi nhưng không theo quy trình', '4': 'Có quy trình lấy ý kiến + feedback loop', '5': 'Democratic culture + empowerment + innovation' }, scale_labels_en: { '1': 'All decisions from owner/manager', '2': 'Rarely, only formal consultations', '3': 'Sometimes asked but no process', '4': 'Process for input + feedback loop', '5': 'Democratic culture + empowerment + innovation' }, dimension: 'culture' },
      { question_id: 'vh_q3', order_idx: 2, type: 'select', label_vi: 'Tỷ lệ nghỉ việc / thay đổi nhân sự trong 12 tháng qua là bao nhiêu?', label_en: 'What is your staff turnover rate in the past 12 months?', scale_labels_vi: { '1': 'Trên 50% — thay đổi liên tục', '2': '30-50% — khá cao', '3': '15-30% — bình thường với ngành', '4': '5-15% — có một số vị trí khó giữ', '5': 'Dưới 5% — nhân sự ổn định' }, scale_labels_en: { '1': 'Over 50% — constant turnover', '2': '30-50% — quite high', '3': '15-30% — normal for the industry', '4': '5-15% — some hard-to-retain positions', '5': 'Under 5% — stable team' }, dimension: 'culture' },
      { question_id: 'vh_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có chế độ đãi ngộ và phúc lợi (ngoài lương) rõ ràng không?', label_en: 'Does your clinic have clear compensation and benefits (beyond salary)?', scale_labels_vi: { '1': 'Chỉ có lương, không có phúc lợi', '2': 'Phúc lợi ad-hoc, không có quy định', '3': 'Có phúc lợi cơ bản (BHXH, BHYT)', '4': 'Phúc lợi đầy đủ + thưởng KPI + team building', '5': 'Full package + career path + professional development' }, scale_labels_en: { '1': 'Salary only, no benefits', '2': 'Ad-hoc benefits, no policy', '3': 'Basic benefits (social insurance, health insurance)', '4': 'Full benefits + KPI bonus + team building', '5': 'Full package + career path + professional development' }, dimension: 'culture' },
      { question_id: 'vh_q5', order_idx: 4, type: 'textarea', label_vi: 'Văn hóa nào đang "xung đột" hoặc không phù hợp với định hướng phòng khám?', label_en: 'What cultural aspect is "conflicting" or not aligned with your clinic direction?', placeholder_vi: 'Mô tả ngắn gọn — ví dụ: "nói một đằng làm một nẻo", "không ai dám nói thẳng", "thiếu teamwork"...', placeholder_en: 'Brief description — e.g. "say one thing, do another", "no one speaks up", "lack of teamwork"...' },
    ],
  }],
};
