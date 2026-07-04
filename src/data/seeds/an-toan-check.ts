// Seed: An Toàn Check — based on Tier 1, Ch.6
// Premium scanner, paid AI analysis (is_free: 0), status: active.
// 2 sections: 5 select (dimension) + 2 open-ended, bám sát Chương 6.

import type { SeedScanner } from './registry';

export const AN_TOAN_CHECK_SEED: SeedScanner = {
  id: 'an-toan-check',
  slug: 'an-toan-check',
  title_vi: 'An Toàn Check',
  title_en: 'Safety Check',
  description_vi: 'An toàn là nền tảng không thể thương lượng. 7 câu hỏi giúp bạn đánh giá mức độ tuân thủ quy chuẩn an toàn trong phòng khám.',
  description_en: 'Safety is non-negotiable. 7 questions to assess your clinic safety compliance level.',
  subtitle_vi: 'Chẩn đoán nhanh theo Chương 6 — An Toàn & Tuân Thủ',
  subtitle_en: 'Quick diagnosis based on Chapter 6 — Safety & Compliance',
  chapter_refs: ['Ch.6'],
  status: 'active',
  is_free: 0,
  survey_type: 'mini',
  order_index: 6,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'An Toàn Check', intro_desc: 'An toàn là nền tảng không thể thương lượng. 7 câu hỏi giúp bạn đánh giá mức độ tuân thủ và an toàn trong phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Safety Check', intro_desc: 'Safety is non-negotiable. 7 questions to assess your clinic safety compliance level.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'safety', name_vi: 'An toàn & Tuân thủ', name_en: 'Safety & Compliance', question_ids: ['at_q1', 'at_q2', 'at_q3', 'at_q4', 'at_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả An Toàn Check (điểm {{SCORE_SAFETY}}/100 kèm 2 câu open-ended), phân tích mức độ tuân thủ an toàn và đưa ra 3 hành động ưu tiên để cải thiện trong tháng tới. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the Safety Check score ({{SCORE_SAFETY}}/100 with 2 open-ended answers), analyze safety compliance and suggest 3 priority actions. English, candid and warm tone. Quote their open-ended answers.',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ AN TOÀN',
      title_en: 'PART 1: SAFETY EVALUATION',
      subtitle_vi: '5 chiều đánh giá: giấy phép, vô trùng, PCCC, quản lý thuốc, và đào tạo khẩn cấp.',
      subtitle_en: '5 evaluation dimensions: licensing, sterilization, fire safety, drug management, and emergency training.',
      ref: 'Ch.6 — An Toàn & Tuân Thủ',
      icon: 'health_and_safety',
      questions: [
        { question_id: 'at_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám có giấy phép hoạt động còn hiệu lực và đạt tiêu chuẩn PCCC không?', label_en: 'Does your clinic have a valid operating license and fire safety certification?', scale_labels_vi: { '1': 'Không rõ / chưa kiểm tra', '2': 'Có nhưng chưa đầy đủ', '3': 'Giấy phép có, PCCC cơ bản', '4': 'Đầy đủ giấy phép + PCCC + kiểm tra định kỳ', '5': 'Tất cả đạt + tự động nhắc gia hạn' }, scale_labels_en: { '1': "Don't know / not checked", '2': 'Some but incomplete', '3': 'License yes, basic fire safety', '4': 'Full license + fire safety + periodic inspection', '5': 'All compliant + auto-renewal reminders' }, dimension: 'safety' },
        { question_id: 'at_q2', order_idx: 1, type: 'select', label_vi: 'Quy trình vô trùng & khử khuẩn dụng cụ đạt chuẩn Bộ Y Tế và được ghi nhận không?', label_en: 'Does instrument sterilization meet MOH standards and is it documented?', scale_labels_vi: { '1': 'Theo cảm tính, không có checklist', '2': 'Có quy trình nhưng không ghi nhận', '3': 'Có SOP + checklist hàng ngày', '4': 'Đạt chuẩn + tracking từng mẻ', '5': 'ISO + tracking từng mẻ + audit nội bộ' }, scale_labels_en: { '1': 'Intuition-based, no checklist', '2': 'Process exists but not documented', '3': 'SOP + daily checklist', '4': 'Compliant + batch tracking', '5': 'ISO + batch tracking + internal audit' }, dimension: 'safety' },
        { question_id: 'at_q3', order_idx: 2, type: 'select', label_vi: 'Nhân viên được đào tạo về xử lý tình huống khẩn cấp (cháy nổ, cấp cứu) chưa?', label_en: 'Are staff trained on emergency response (fire, medical emergency)?', scale_labels_vi: { '1': 'Không có, chưa từng tập', '2': 'Một số người lớn tuổi có kinh nghiệm', '3': 'Có hướng dẫn cơ bản', '4': 'Đào tạo định kỳ + có kế hoạch sơ tán', '5': 'Tập trung định kỳ + đánh giá + cập nhật' }, scale_labels_en: { '1': 'No training ever', '2': 'Some senior staff have experience', '3': 'Basic guidelines exist', '4': 'Regular training + evacuation plan', '5': 'Regular drills + evaluation + updates' }, dimension: 'safety' },
        { question_id: 'at_q4', order_idx: 3, type: 'select', label_vi: 'Thuốc và vật tư y tế được quản lý theo quy định (nhiệt độ, hạn dùng, kê đơn) như thế nào?', label_en: 'How are medicines and medical supplies managed (temperature, expiry, prescriptions)?', scale_labels_vi: { '1': 'Không theo dõi, dùng đến đâu hay đến đó', '2': 'Có nhưng không nhất quán', '3': 'Kiểm tra nhiệt độ + hạn dùng cơ bản', '4': 'Hệ thống theo dõi + kê đơn đầy đủ', '5': 'Tự động nhắc hạn + báo cáo định kỳ' }, scale_labels_en: { '1': 'Not tracked, use until gone', '2': 'Some tracking but inconsistent', '3': 'Basic temperature + expiry check', '4': 'Monitoring system + full prescriptions', '5': 'Auto expiry alerts + periodic reports' }, dimension: 'safety' },
        { question_id: 'at_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có SOP cho tai biến y khoa (what to do when something goes wrong) chưa?', label_en: 'Does your clinic have a SOP for medical adverse events (what to do when something goes wrong)?', scale_labels_vi: { '1': 'Không có SOP, xử lý tùy tình huống', '2': 'Có hướng dẫn miệng', '3': 'Có SOP nhưng ít ai nhớ', '4': 'Có SOP + đào tạo + ghi nhận', '5': 'SOP + đào tạo + ghi nhận + root-cause analysis + cải tiến' }, scale_labels_en: { '1': 'No SOP, handled case-by-case', '2': 'Verbal guidance only', '3': 'SOP exists but few remember it', '4': 'SOP + training + documentation', '5': 'SOP + training + documentation + root-cause analysis + improvement' }, dimension: 'safety' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn thẳng vào lỗ hổng an toàn.',
      subtitle_en: 'Two open questions to face safety gaps honestly.',
      ref: 'Ch.6 — An Toàn & Tuân Thủ',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'at_open1', order_idx: 0, type: 'textarea', label_vi: 'An toàn nào là "lỗ hổng" lớn nhất của phòng khám hiện tại? Mô tả một tình huống cụ thể gần đây liên quan đến an toàn mà bạn nhớ rõ.', label_en: 'What is the biggest safety gap in your clinic right now? Describe a recent specific safety-related situation you clearly remember.', placeholder_vi: 'Mô tả ngắn gọn — giấy phép, vô trùng, PCCC, quản lý thuốc, hay đào tạo nhân sự?', placeholder_en: 'Brief — license, sterilization, fire safety, drug management, or staff training?' },
        { question_id: 'at_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu cơ quan chức năng đến kiểm tra bất ngờ vào ngày mai, bạn có tự tin không? Điều gì khiến bạn lo nhất?', label_en: 'If regulators came for an unannounced inspection tomorrow, would you be confident? What worries you most?', placeholder_vi: 'Hãy trung thực — đây là câu hỏi để bạn tự đánh giá mức độ sẵn sàng.', placeholder_en: 'Be honest — this is a self-assessment of your readiness level.' },
      ],
    },
  ],
};
