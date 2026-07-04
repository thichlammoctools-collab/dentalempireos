// Seed: Văn Hóa Check — based on Tier 1, Ch.9
// Premium scanner, paid AI analysis (is_free: 0), status: active.
// 2 sections: 5 select (dimension) + 2 open-ended, bám sát Chương 9.

import type { SeedScanner } from './registry';

export const VAN_HOA_CHECK_SEED: SeedScanner = {
  id: 'van-hoa-check',
  slug: 'van-hoa-check',
  title_vi: 'Văn Hóa Check',
  title_en: 'Culture Check',
  description_vi: 'Văn hóa là DNA của phòng khám. 7 câu hỏi giúp bạn đánh giá sức khỏe văn hóa nội bộ và mức độ gắn kết nhân viên.',
  description_en: 'Culture is the DNA of your clinic. 7 questions to assess internal culture health and staff engagement.',
  subtitle_vi: 'Chẩn đoán nhanh theo Chương 9 — Văn Hóa Phòng Khám',
  subtitle_en: 'Quick diagnosis based on Chapter 9 — Clinic Culture',
  chapter_refs: ['Ch.9'],
  status: 'active',
  is_free: 0,
  survey_type: 'mini',
  order_index: 9,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Văn Hóa Check', intro_desc: 'Văn hóa là DNA của phòng khám. 7 câu hỏi giúp bạn đánh giá sức khỏe văn hóa nội bộ và mức độ gắn kết nhân viên.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Culture Check', intro_desc: 'Culture is the DNA of your clinic. 7 questions to assess internal culture health and staff engagement.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'culture', name_vi: 'Văn hóa nội bộ', name_en: 'Internal Culture', question_ids: ['vh_q1', 'vh_q2', 'vh_q3', 'vh_q4', 'vh_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Văn Hóa Check (điểm {{SCORE_CULTURE}}/100 kèm 2 câu open-ended), phân tích sức khỏe văn hóa nội bộ và đưa ra 3 đề xuất cải thiện. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the Culture Check score ({{SCORE_CULTURE}}/100 with 2 open-ended answers), analyze internal culture health and suggest 3 improvements. English, candid and warm tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_VAN_HOA}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_VAN_HOA}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ VĂN HÓA',
      title_en: 'PART 1: CULTURE EVALUATION',
      subtitle_vi: '5 chiều đánh giá: core values, lắng nghe, retention, đãi ngộ, và communication.',
      subtitle_en: '5 evaluation dimensions: core values, listening, retention, compensation, and communication.',
      ref: 'Ch.9 — Văn Hóa Phòng Khám',
      icon: 'diversity_3',
      questions: [
        { question_id: 'vh_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám có "giá trị cốt lõi" (core values) rõ ràng và được nhân viên biết không?', label_en: 'Does your clinic have clear core values that staff know and follow?', scale_labels_vi: { '1': 'Không có, chưa bao giờ nói về giá trị', '2': 'Có treo tường nhưng ít ai nhớ', '3': 'Giá trị cơ bản, nhắc nhở thỉnh thoảng', '4': 'Giá trị rõ ràng + tích hợp vào đánh giá', '5': 'Core values-driven culture + recruitment + recognition' }, scale_labels_en: { '1': 'No core values defined', '2': 'Posted on wall but rarely remembered', '3': 'Basic values, occasionally referenced', '4': 'Clear values + integrated in performance reviews', '5': 'Core values-driven culture + recruitment + recognition' }, dimension: 'culture' },
        { question_id: 'vh_q2', order_idx: 1, type: 'select', label_vi: 'Nhân viên có được lắng nghe và tham gia vào quyết định không?', label_en: 'Are staff listened to and included in decision-making?', scale_labels_vi: { '1': 'Mọi quyết định đều từ chủ / quản lý', '2': 'Ít khi, chỉ hỏi ý kiến cho form', '3': 'Thỉnh thoảng hỏi nhưng không theo quy trình', '4': 'Có quy trình lấy ý kiến + feedback loop', '5': 'Democratic culture + empowerment + innovation' }, scale_labels_en: { '1': 'All decisions from owner/manager', '2': 'Rarely, only formal consultations', '3': 'Sometimes asked but no process', '4': 'Process for input + feedback loop', '5': 'Democratic culture + empowerment + innovation' }, dimension: 'culture' },
        { question_id: 'vh_q3', order_idx: 2, type: 'select', label_vi: 'Tỷ lệ nghỉ việc / thay đổi nhân sự trong 12 tháng qua là bao nhiêu?', label_en: 'What is your staff turnover rate in the past 12 months?', scale_labels_vi: { '1': 'Trên 50% — thay đổi liên tục', '2': '30-50% — khá cao', '3': '15-30% — bình thường với ngành', '4': '5-15% — có một số vị trí khó giữ', '5': 'Dưới 5% — nhân sự ổn định' }, scale_labels_en: { '1': 'Over 50% — constant turnover', '2': '30-50% — quite high', '3': '15-30% — normal for the industry', '4': '5-15% — some hard-to-retain positions', '5': 'Under 5% — stable team' }, dimension: 'culture' },
        { question_id: 'vh_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có chế độ đãi ngộ và phúc lợi (ngoài lương) rõ ràng không?', label_en: 'Does your clinic have clear compensation and benefits (beyond salary)?', scale_labels_vi: { '1': 'Chỉ có lương, không có phúc lợi', '2': 'Phúc lợi ad-hoc, không có quy định', '3': 'Có phúc lợi cơ bản (BHXH, BHYT)', '4': 'Phúc lợi đầy đủ + thưởng KPI + team building', '5': 'Full package + career path + professional development' }, scale_labels_en: { '1': 'Salary only, no benefits', '2': 'Ad-hoc benefits, no policy', '3': 'Basic benefits (social insurance, health insurance)', '4': 'Full benefits + KPI bonus + team building', '5': 'Full package + career path + professional development' }, dimension: 'culture' },
        { question_id: 'vh_q5', order_idx: 4, type: 'select', label_vi: 'An toàn tâm lý (psychological safety) trong phòng khám như thế nào? Nhân viên có dám nói thẳng khi có vấn đề không?', label_en: 'What is the psychological safety level in your clinic? Do staff dare to speak up when there is an issue?', scale_labels_vi: { '1': 'Không ai dám nói thẳng, sợ bị phạt', '2': 'Chỉ một vài người dám, phần lớn im lặng', '3': 'Cố gắng xây dựng nhưng chưa thành', '4': 'Phần lớn an toàn, có thể nói thẳng', '5': 'An toàn tâm lý cao — mọi người nói thẳng vì tin tưởng' }, scale_labels_en: { '1': 'No one dares to speak up, afraid of punishment', '2': 'Only a few dare, most stay silent', '3': 'Trying to build but not yet there', '4': 'Most feel safe, can speak up', '5': 'High psychological safety — everyone speaks up because of trust' }, dimension: 'culture' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn thẳng vào văn hóa nội bộ.',
      subtitle_en: 'Two open questions to face internal culture honestly.',
      ref: 'Ch.9 — Văn Hóa Phòng Khám',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'vh_open1', order_idx: 0, type: 'textarea', label_vi: 'Văn hóa nào đang "xung đột" hoặc không phù hợp với định hướng phòng khám? Mô tả một tình huống cụ thể mà bạn nhớ rõ.', label_en: 'What cultural aspect is "conflicting" or not aligned with your clinic direction? Describe a specific situation you remember.', placeholder_vi: 'Ví dụ: "nói một đằng làm một nẻo", "không ai dám nói thẳng", "thiếu teamwork"...', placeholder_en: 'e.g. "say one thing, do another", "no one speaks up", "lack of teamwork"...' },
        { question_id: 'vh_open2', order_idx: 1, type: 'textarea', label_vi: 'Nhân viên có tự hào khi giới thiệu nơi làm việc cho bạn bè/người thân không? Tại sao bạn nghĩ vậy?', label_en: 'Are staff proud to introduce their workplace to friends/family? Why do you think so?', placeholder_vi: 'Hãy trung thực — đây là dấu hiệu quan trọng nhất của văn hóa lành mạnh.', placeholder_en: 'Be honest — this is the most important sign of a healthy culture.' },
      ],
    },
  ],
};
