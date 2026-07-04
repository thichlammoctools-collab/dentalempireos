// Seed: Marketing Check — based on Tier 1, Ch.7
// Premium scanner, paid AI analysis (is_free: 0), status: active.
// 2 sections: 5 select (dimension) + 2 open-ended, bám sát Chương 7.

import type { SeedScanner } from './registry';

export const MARKETING_CHECK_SEED: SeedScanner = {
  id: 'marketing-check',
  slug: 'marketing-check',
  title_vi: 'Marketing Check',
  title_en: 'Marketing Check',
  description_vi: 'Không có marketing = không có bệnh nhân mới. 7 câu hỏi giúp bạn đánh giá chiến lược tiếp cận và giữ chân bệnh nhân của phòng khám.',
  description_en: 'No marketing = no new patients. 7 questions to assess your patient acquisition and retention strategy.',
  subtitle_vi: 'Chẩn đoán nhanh theo Chương 7 — Marketing Phòng Khám',
  subtitle_en: 'Quick diagnosis based on Chapter 7 — Clinic Marketing',
  chapter_refs: ['Ch.7'],
  status: 'active',
  is_free: 0,
  survey_type: 'mini',
  order_index: 7,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Marketing Check', intro_desc: 'Không có marketing = không có bệnh nhân mới. 7 câu hỏi giúp bạn đánh giá chiến lược tiếp cận và giữ chân bệnh nhân của phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Marketing Check', intro_desc: 'No marketing = no new patients. 7 questions to assess your patient acquisition and retention strategy.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'marketing', name_vi: 'Chiến lược Marketing', name_en: 'Marketing Strategy', question_ids: ['mkt_q1', 'mkt_q2', 'mkt_q3', 'mkt_q4', 'mkt_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Marketing Check (điểm {{SCORE_MARKETING}}/100 kèm 2 câu open-ended), phân tích chiến lược marketing và đưa ra 3 hành động cải thiện trong tháng tới. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the Marketing Check score ({{SCORE_MARKETING}}/100 with 2 open-ended answers), analyze marketing strategy and suggest 3 improvement actions. English, candid and warm tone. Quote their open-ended answers.',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ MARKETING',
      title_en: 'PART 1: MARKETING EVALUATION',
      subtitle_vi: '5 chiều đánh giá: kênh tiếp cận, giữ chân, ROI, USP, và hiện diện online.',
      subtitle_en: '5 evaluation dimensions: acquisition channels, retention, ROI, USP, and online presence.',
      ref: 'Ch.7 — Marketing Phòng Khám',
      icon: 'campaign',
      questions: [
        { question_id: 'mkt_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám tiếp cận bệnh nhân mới qua những kênh nào?', label_en: 'What channels does your clinic use to reach new patients?', scale_labels_vi: { '1': 'Chỉ qua giới thiệu miệng / khách quen', '2': 'Có Facebook/Zalo nhưng không có chiến lược', '3': 'Chạy quảng cáo Facebook/Google nhưng không đo ROI', '4': 'Có chiến lược đa kênh + đo hiệu quả', '5': 'Đa kênh + content marketing + CRM tự động' }, scale_labels_en: { '1': 'Only word of mouth / regulars', '2': 'Facebook/Zalo but no strategy', '3': 'Running ads but not measuring ROI', '4': 'Multi-channel strategy + ROI tracking', '5': 'Multi-channel + content marketing + auto CRM' }, dimension: 'marketing' },
        { question_id: 'mkt_q2', order_idx: 1, type: 'select', label_vi: 'Bạn có hệ thống chăm sóc và giữ chân bệnh nhân cũ không?', label_en: 'Do you have a system to care for and retain existing patients?', scale_labels_vi: { '1': 'Không có, bệnh nhân quay lại tự nhiên', '2': 'Có gọi nhắc lịch nhưng không nhất quán', '3': 'Có chương trình chăm sóc định kỳ', '4': 'CRM + chương trình loyalty + theo dõi LTV', '5': 'Tự động hóa đầy đủ + phân tích LTV + upsell' }, scale_labels_en: { '1': 'No system, patients return naturally', '2': 'Recall calls but inconsistent', '3': 'Periodic care program', '4': 'CRM + loyalty program + LTV tracking', '5': 'Full automation + LTV analysis + upsell' }, dimension: 'marketing' },
        { question_id: 'mkt_q3', order_idx: 2, type: 'select', label_vi: 'Chi phí marketing / doanh thu hàng tháng được theo dõi không?', label_en: 'Is marketing spend as a % of revenue tracked monthly?', scale_labels_vi: { '1': 'Không theo dõi, không biết bao nhiêu', '2': 'Có tính tổng nhưng không chi tiết', '3': 'Theo dõi cơ bản theo tổng', '4': 'Chi tiết theo từng kênh + so sánh hiệu quả', '5': 'Real-time dashboard + tối ưu hóa liên tục' }, scale_labels_en: { '1': "Don't track, don't know how much", '2': 'Total known but no detail', '3': 'Basic total tracking', '4': 'Detailed per channel + ROI comparison', '5': 'Real-time dashboard + continuous optimization' }, dimension: 'marketing' },
        { question_id: 'mkt_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có "USP" (điểm bán hàng độc nhất) rõ ràng không?', label_en: 'Does your clinic have a clear Unique Selling Proposition (USP)?', scale_labels_vi: { '1': 'Không biết USP là gì', '2': 'Có nhưng chưa rõ ràng', '3': 'Có USP cơ bản, dùng trong giới thiệu', '4': 'USP rõ ràng + tích hợp vào mọi touchpoint', '5': 'Brand identity mạnh + USP + storytelling' }, scale_labels_en: { '1': "Don't know what USP is", '2': 'Some but not clear', '3': 'Basic USP, used in introductions', '4': 'Clear USP + integrated into every touchpoint', '5': 'Strong brand identity + USP + storytelling' }, dimension: 'marketing' },
        { question_id: 'mkt_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có chiến lược content (blog, video, educational) để xây dựng uy tín chuyên môn không?', label_en: 'Does your clinic have a content strategy (blog, video, educational) to build professional credibility?', scale_labels_vi: { '1': 'Không có content', '2': 'Đăng bài ad-hoc, không có chiến lược', '3': 'Có đăng đều nhưng không có chiến lược rõ', '4': 'Content strategy + đều đặn + có KPI', '5': 'Content machine + SEO + social proof + authority' }, scale_labels_en: { '1': 'No content', '2': 'Post ad-hoc, no strategy', '3': 'Post regularly but no clear strategy', '4': 'Content strategy + consistent + KPIs', '5': 'Content machine + SEO + social proof + authority' }, dimension: 'marketing' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế marketing.',
      subtitle_en: 'Two open questions to face marketing reality honestly.',
      ref: 'Ch.7 — Marketing Phòng Khám',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'mkt_open1', order_idx: 0, type: 'textarea', label_vi: 'Kênh marketing nào đang hoạt động tốt nhất và kênh nào đang lãng phí ngân sách? Mô tả một tình huống cụ thể.', label_en: 'Which marketing channel is working best and which is wasting budget? Describe a specific situation.', placeholder_vi: 'Liệt kê 1-2 kênh hiệu quả nhất và 1-2 kênh cần cải thiện hoặc loại bỏ.', placeholder_en: 'List 1-2 best performing channels and 1-2 that need improvement or removal.' },
        { question_id: 'mkt_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu bạn có ngân sách marketing 10 triệu/tháng và chỉ tập trung vào 1 kênh, bạn sẽ chọn kênh nào? Tại sao?', label_en: 'If you had a 10M VND/month marketing budget and could only focus on 1 channel, which would you choose? Why?', placeholder_vi: 'Nghĩ về kênh nào mang lại bệnh nhân chất lượng nhất, không chỉ nhiều nhất.', placeholder_en: 'Think about which channel brings the highest quality patients, not just the most.' },
      ],
    },
  ],
};
