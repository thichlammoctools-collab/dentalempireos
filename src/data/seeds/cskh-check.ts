// Seed: CSKH Check (Customer Service Check) — based on Tier 1, Ch.8
// Premium scanner, paid AI analysis (is_free: 0), status: draft.

import type { SeedScanner } from './registry';

export const CSKH_CHECK_SEED: SeedScanner = {
  id: 'cskh-check',
  slug: 'cskh-check',
  title_vi: 'CSKH Check',
  title_en: 'Customer Service Check',
  description_vi: 'Dịch vụ khách hàng quyết định bệnh nhân quay lại hay không. 5 câu hỏi giúp bạn đánh giá chất lượng CSKH thực tế.',
  description_en: 'Customer service determines whether patients return. 5 questions to assess your real CS quality.',
  subtitle_vi: 'Chẩn đoán nhanh theo Chương 8 — Dịch Vụ Khách Hàng',
  subtitle_en: 'Quick diagnosis based on Chapter 8 — Customer Service',
  chapter_refs: ['Ch.8'],
  status: 'draft',
  is_free: 0,
  survey_type: 'mini',
  order_index: 8,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'CSKH Check', intro_desc: 'Dịch vụ khách hàng quyết định bệnh nhân quay lại hay không. 5 câu hỏi giúp bạn đánh giá chất lượng CSKH thực tế.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'CSKH Check', intro_desc: 'Customer service determines whether patients return. 5 questions to assess your real CS quality.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'service', name_vi: 'Chất lượng CSKH', name_en: 'Customer Service Quality', question_ids: ['cskh_q1', 'cskh_q2', 'cskh_q3', 'cskh_q4'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả CSKH Check (điểm {{SCORE_SERVICE}}/100 và câu trả lời open), phân tích ngắn gọn chất lượng dịch vụ khách hàng và đưa ra 3 điểm cần cải thiện ngay. Dùng tiếng Việt, giọng thẳng thắn ấm áp.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the CSKH Check score ({{SCORE_SERVICE}}/100 and open answer), briefly analyze customer service quality and suggest 3 immediate improvements. English, candid and warm tone.',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [{
    order_idx: 0,
    title_vi: '5 CÂU HỎI VỀ CSKH',
    title_en: '5 QUESTIONS ABOUT CUSTOMER SERVICE',
    subtitle_vi: 'Bệnh nhân nói gì về phòng khám khi bạn không nghe?',
    subtitle_en: 'What do patients say about your clinic when you are not listening?',
    ref: 'Ch.8 — Dịch Vụ Khách Hàng',
    icon: 'support_agent',
    questions: [
      { question_id: 'cskh_q1', order_idx: 0, type: 'select', label_vi: 'Thời gian phản hồi trung bình khi bệnh nhân liên hệ (Zalo, điện thoại, email) là bao lâu?', label_en: 'What is the average response time when patients contact you (Zalo, phone, email)?', scale_labels_vi: { '1': 'Không phản hồi / trả lời rất chậm (2-3 ngày+)', '2': '1-2 ngày', '3': 'Vài giờ đến 1 ngày', '4': 'Trong giờ làm việc, dưới 2 giờ', '5': 'Tự động phản hồi ngay + theo dõi SLA' }, scale_labels_en: { '1': 'No response / very slow (2-3 days+)', '2': '1-2 days', '3': 'A few hours to 1 day', '4': 'Within working hours, under 2 hours', '5': 'Instant auto-response + SLA tracking' }, dimension: 'service' },
      { question_id: 'cskh_q2', order_idx: 1, type: 'select', label_vi: 'Nhân viên CSKH được đào tạo về kỹ năng giao tiếp và xử lý khiếu nại chưa?', label_en: 'Are CS staff trained on communication skills and complaint handling?', scale_labels_vi: { '1': 'Không có đào tạo', '2': 'Đào tạo cơ bản khi vào làm', '3': 'Có đào tạo định kỳ 1-2 lần/năm', '4': 'Training chuyên sâu + role-play + feedback', '5': 'Continuous training + QA + coaching' }, scale_labels_en: { '1': 'No training', '2': 'Basic onboarding only', '3': 'Periodic training 1-2x/year', '4': 'Deep training + role-play + feedback', '5': 'Continuous training + QA + coaching' }, dimension: 'service' },
      { question_id: 'cskh_q3', order_idx: 2, type: 'select', label_vi: 'Phòng khám có thu thập và phân tích phản hồi bệnh nhân (NPS, survey) không?', label_en: 'Does your clinic collect and analyze patient feedback (NPS, survey)?', scale_labels_vi: { '1': 'Không có, không thu thập', '2': 'Có nghe phản hồi nhưng không hệ thống', '3': 'Survey định kỳ 1-2 lần/năm', '4': 'NPS hàng quý + phân tích root cause', '5': 'Real-time feedback + NPS + action plan' }, scale_labels_en: { '1': 'No collection at all', '2': 'Informal feedback only', '3': 'Periodic survey 1-2x/year', '4': 'Quarterly NPS + root cause analysis', '5': 'Real-time feedback + NPS + action plan' }, dimension: 'service' },
      { question_id: 'cskh_q4', order_idx: 3, type: 'select', label_vi: 'Khi có khiếu nại, quy trình xử lý và补偿 (đền bù) ra sao?', label_en: 'When a complaint arises, what is the handling process and compensation like?', scale_labels_vi: { '1': 'Xử lý tùy tình huống, không có quy trình', '2': 'Có quy trình nhưng không nhất quán', '3': 'Có SOP xử lý khiếu nại + bồi thường theo quy định', '4': 'SOP + compensation + rút kinh nghiệm + cải tiến', '5': 'Full CRM + proactive resolution + recovery flowchart' }, scale_labels_en: { '1': 'Handled case-by-case, no process', '2': 'Process exists but inconsistent', '3': 'SOP + compensation per policy', '4': 'SOP + compensation + learning + improvement', '5': 'Full CRM + proactive resolution + recovery flowchart' }, dimension: 'service' },
      { question_id: 'cskh_q5', order_idx: 4, type: 'textarea', label_vi: 'Điều gì khiến bệnh nhân KHÔNG quay lại phòng khám của bạn?', label_en: 'What makes patients NOT return to your clinic?', placeholder_vi: 'Mô tả ngắn gọn — thái độ, thời gian chờ, giá cả, hay vấn đề khác?', placeholder_en: 'Brief description — attitude, wait time, pricing, or other issues?' },
    ],
  }],
};
