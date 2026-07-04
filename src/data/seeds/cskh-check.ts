// Seed: CSKH Check (Customer Service Check) — based on Tier 1, Ch.8
// Premium scanner, paid AI analysis (is_free: 0), status: active.
// 2 sections: 5 select (dimension) + 2 open-ended, bám sát Chương 8.

import type { SeedScanner } from './registry';

export const CSKH_CHECK_SEED: SeedScanner = {
  id: 'cskh-check',
  slug: 'cskh-check',
  title_vi: 'CSKH Check',
  title_en: 'Customer Service Check',
  description_vi: 'Dịch vụ khách hàng quyết định bệnh nhân quay lại hay không. 7 câu hỏi giúp bạn đánh giá chất lượng CSKH thực tế.',
  description_en: 'Customer service determines whether patients return. 7 questions to assess your real CS quality.',
  subtitle_vi: 'Chẩn đoán nhanh theo Chương 8 — Dịch Vụ Khách Hàng',
  subtitle_en: 'Quick diagnosis based on Chapter 8 — Customer Service',
  chapter_refs: ['Ch.8'],
  status: 'active',
  is_free: 0,
  survey_type: 'mini',
  order_index: 8,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'CSKH Check', intro_desc: 'Dịch vụ khách hàng quyết định bệnh nhân quay lại hay không. 7 câu hỏi giúp bạn đánh giá chất lượng CSKH thực tế.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'CSKH Check', intro_desc: 'Customer service determines whether patients return. 7 questions to assess your real CS quality.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'service', name_vi: 'Chất lượng CSKH', name_en: 'Customer Service Quality', question_ids: ['cskh_q1', 'cskh_q2', 'cskh_q3', 'cskh_q4', 'cskh_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả CSKH Check (điểm {{SCORE_SERVICE}}/100 kèm 2 câu open-ended), phân tích chất lượng dịch vụ khách hàng và đưa ra 3 điểm cần cải thiện ngay. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the CSKH Check score ({{SCORE_SERVICE}}/100 with 2 open-ended answers), analyze customer service quality and suggest 3 immediate improvements. English, candid and warm tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_CSKH}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_CSKH}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ CSKH',
      title_en: 'PART 1: CS EVALUATION',
      subtitle_vi: '5 chiều đánh giá: tốc độ phản hồi, đào tạo nhân sự, thu thập feedback, xử lý khiếu nại, và follow-up.',
      subtitle_en: '5 evaluation dimensions: response speed, staff training, feedback collection, complaint handling, and follow-up.',
      ref: 'Ch.8 — Dịch Vụ Khách Hàng',
      icon: 'support_agent',
      questions: [
        { question_id: 'cskh_q1', order_idx: 0, type: 'select', label_vi: 'Thời gian phản hồi trung bình khi bệnh nhân liên hệ (Zalo, điện thoại, email) là bao lâu?', label_en: 'What is the average response time when patients contact you (Zalo, phone, email)?', scale_labels_vi: { '1': 'Không phản hồi / trả lời rất chậm (2-3 ngày+)', '2': '1-2 ngày', '3': 'Vài giờ đến 1 ngày', '4': 'Trong giờ làm việc, dưới 2 giờ', '5': 'Tự động phản hồi ngay + theo dõi SLA' }, scale_labels_en: { '1': 'No response / very slow (2-3 days+)', '2': '1-2 days', '3': 'A few hours to 1 day', '4': 'Within working hours, under 2 hours', '5': 'Instant auto-response + SLA tracking' }, dimension: 'service' },
        { question_id: 'cskh_q2', order_idx: 1, type: 'select', label_vi: 'Nhân viên CSKH được đào tạo về kỹ năng giao tiếp và xử lý khiếu nại chưa?', label_en: 'Are CS staff trained on communication skills and complaint handling?', scale_labels_vi: { '1': 'Không có đào tạo', '2': 'Đào tạo cơ bản khi vào làm', '3': 'Có đào tạo định kỳ 1-2 lần/năm', '4': 'Training chuyên sâu + role-play + feedback', '5': 'Continuous training + QA + coaching' }, scale_labels_en: { '1': 'No training', '2': 'Basic onboarding only', '3': 'Periodic training 1-2x/year', '4': 'Deep training + role-play + feedback', '5': 'Continuous training + QA + coaching' }, dimension: 'service' },
        { question_id: 'cskh_q3', order_idx: 2, type: 'select', label_vi: 'Phòng khám có thu thập và phân tích phản hồi bệnh nhân (NPS, survey) không?', label_en: 'Does your clinic collect and analyze patient feedback (NPS, survey)?', scale_labels_vi: { '1': 'Không có, không thu thập', '2': 'Có nghe phản hồi nhưng không hệ thống', '3': 'Survey định kỳ 1-2 lần/năm', '4': 'NPS hàng quý + phân tích root cause', '5': 'Real-time feedback + NPS + action plan' }, scale_labels_en: { '1': 'No collection at all', '2': 'Informal feedback only', '3': 'Periodic survey 1-2x/year', '4': 'Quarterly NPS + root cause analysis', '5': 'Real-time feedback + NPS + action plan' }, dimension: 'service' },
        { question_id: 'cskh_q4', order_idx: 3, type: 'select', label_vi: 'Khi có khiếu nại, quy trình xử lý và bồi thường ra sao?', label_en: 'When a complaint arises, what is the handling process and compensation like?', scale_labels_vi: { '1': 'Xử lý tùy tình huống, không có quy trình', '2': 'Có quy trình nhưng không nhất quán', '3': 'Có SOP xử lý khiếu nại + bồi thường theo quy định', '4': 'SOP + compensation + rút kinh nghiệm + cải tiến', '5': 'Full CRM + proactive resolution + recovery flowchart' }, scale_labels_en: { '1': 'Handled case-by-case, no process', '2': 'Process exists but inconsistent', '3': 'SOP + compensation per policy', '4': 'SOP + compensation + learning + improvement', '5': 'Full CRM + proactive resolution + recovery flowchart' }, dimension: 'service' },
        { question_id: 'cskh_q5', order_idx: 4, type: 'select', label_vi: 'Nhân viên có được train để "thấu cảm" với bệnh nhân (put yourself in their shoes) không?', label_en: 'Are staff trained to empathize with patients (put yourself in their shoes)?', scale_labels_vi: { '1': 'Không có đào tạo về thấu cảm', '2': 'Có nhắc nhưng không có đào tạo chính thức', '3': 'Đào tạo cơ bản về thấu cảm', '4': 'Training chuyên sâu + role-play + đánh giá', '5': 'Thấu cảm là văn hóa — mọi người tự nhiên thể hiện' }, scale_labels_en: { '1': 'No empathy training', '2': 'Reminded but no formal training', '3': 'Basic empathy training', '4': 'Deep training + role-play + evaluation', '5': 'Empathy is the culture — everyone naturally demonstrates it' }, dimension: 'service' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn từ góc nhìn bệnh nhân.',
      subtitle_en: 'Two open questions to see from the patient perspective.',
      ref: 'Ch.8 — Dịch Vụ Khách Hàng',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'cskh_open1', order_idx: 0, type: 'textarea', label_vi: 'Điều gì khiến bệnh nhân KHÔNG quay lại phòng khám của bạn? Kể một tình huống cụ thể mà bạn biết hoặc nghe được.', label_en: 'What makes patients NOT return to your clinic? Describe a specific situation you know or heard about.', placeholder_vi: 'Mô tả ngắn gọn — thái độ, thời gian chờ, giá cả, hay vấn đề khác?', placeholder_en: 'Brief — attitude, wait time, pricing, or other issues?' },
        { question_id: 'cskh_open2', order_idx: 1, type: 'textarea', label_vi: 'Kể một tình huống mà nhân viên của bạn đã xử lý khiếu nại hoặc làm bệnh nhân cực kỳ hài lòng. Điều gì đã làm nên sự khác biệt?', label_en: 'Describe a situation where your staff handled a complaint or made a patient extremely satisfied. What made the difference?', placeholder_vi: 'Có thể trích dẫn tin nhắn, review, hoặc lời kể của nhân viên.', placeholder_en: 'You can quote a message, review, or staff story.' },
      ],
    },
  ],
};
