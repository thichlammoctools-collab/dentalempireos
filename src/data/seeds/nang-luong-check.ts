// Seed: Năng Lượng Check — năng lượng cá nhân, sức bền, và động lực (order 21)
// Free scanner (is_free: 1), giúp bác sĩ/chủ phòng khám hiểu và quản lý năng lượng của mình.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const NANG_LUONG_CHECK_SEED: SeedScanner = {
  id: 'nang-luong-check',
  slug: 'nang-luong-check',
  title_vi: 'Năng Lượng Check',
  title_en: 'Energy Check',
  description_vi: 'Năng lượng của bạn quyết định chất lượng làm việc, sự hạnh phúc, và thu nhập. Kiểm tra mức năng lượng và cách quản lý nó.',
  description_en: 'Your energy determines work quality, happiness, and income. Check your energy level and how you manage it.',
  subtitle_vi: 'Đánh giá năng lượng cá nhân và sức bền',
  subtitle_en: 'Assess personal energy and resilience',
  chapter_refs: ['Ch.ENERGY'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 21,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Năng Lượng Check', intro_desc: 'Năng lượng của bạn quyết định mọi thứ. Kiểm tra mức năng lượng của bạn.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Energy Check', intro_desc: 'Your energy determines everything. Check your energy level.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'energy', name_vi: 'Năng lượng', name_en: 'Energy', question_ids: ['nl_q1', 'nl_q2', 'nl_q3', 'nl_q4', 'nl_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Năng Lượng Check (điểm {{SCORE_ENERGY}}/100 kèm 2 câu open-ended), phân tích mức năng lượng và đưa ra 3 gợi ý để quản lý năng lượng tốt hơn. Dùng tiếng Việt, giọng thấu hiểu, động viên. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant. Based on the Energy Check score ({{SCORE_ENERGY}}/100 with 2 open-ended answers), analyze your energy level and suggest 3 ways to manage it better. English, empathetic and motivating tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_ENERGY}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo kế hoạch 30 ngày quản lý năng lượng.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, động viên\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_ENERGY}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to manage your energy better.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and motivating tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ NĂNG LƯỢNG',
      title_en: 'PART 1: ENERGY EVALUATION',
      subtitle_vi: '5chiều đánh giá: thể chất, cảm xúc, tinh thần, xã hội, và nghề nghiệp.',
      subtitle_en: '5 evaluation dimensions: physical, emotional, mental, social, and vocational.',
      ref: 'Năng lượng — Energy',
      icon: 'bolt',
      questions: [
        { question_id: 'nl_q1', order_idx: 0, type: 'select', label_vi: 'Mức năng lượng thể chất của bạn hàng ngày như thế nào — sức bền, giấc ngủ, dinh dưỡng?', label_en: 'How is your daily physical energy — stamina, sleep, nutrition?', scale_labels_vi: { '1': 'Thường xuyên mệt, ngủ ít và không chất lượng, ăn uống tùy hứng', '2': 'Thỉnh thoảng mệt, ngủ không đều, ăn uống chưa tốt', '3': 'Khá ổn nhưng có lúc mệt không rõ lý do', '4': 'Năng lượng thể chất tốt, ngủ được, ăn uống khá đều', '5': 'Năng lượng thể chất dồi dào, ngủ ngon, ăn uống có kế hoạch' }, scale_labels_en: { '1': 'Frequently tired, poor sleep, eating haphazardly', '2': 'Sometimes tired, irregular sleep, diet not great', '3': 'Fairly okay but sometimes tired for no clear reason', '4': 'Good physical energy, sleeping well, fairly regular diet', '5': 'Abundant physical energy, great sleep, planned nutrition' }, dimension: 'energy' },
        { question_id: 'nl_q2', order_idx: 1, type: 'select', label_vi: 'Bạn có thường xuyên cảm thấy căng thẳng, lo âu, hoặc kiệt sức trong công việc không?', label_en: 'Do you frequently feel stressed, anxious, or burned out at work?', scale_labels_vi: { '1': 'Thường xuyên kiệt sức, cảm giác "cháy" bên trong', '2': 'Thường xuyên căng thẳng và lo âu', '3': 'Thỉnh thoảng căng thẳng, đặc biệt khi bận', '4': 'Căng thẳng ở mức chấp nhận được, có cách xử lý', '5': 'Kiểm soát căng thẳng tốt, có phương pháp giữ bình tĩnh' }, scale_labels_en: { '1': 'Frequently burned out, feeling "burnt" inside', '2': 'Frequently stressed and anxious', '3': 'Sometimes stressed, especially when busy', '4': 'Acceptable stress level, have coping mechanisms', '5': 'Good stress control, have methods to stay calm' }, dimension: 'energy' },
        { question_id: 'nl_q3', order_idx: 2, type: 'select', label_vi: 'Bạn có thời gian cho bản thân (nghỉ ngơi, sở thích, gia đình) ngoài công việc không?', label_en: 'Do you have time for yourself (rest, hobbies, family) outside of work?', scale_labels_vi: { '1': 'Gần như không có thời gian riêng, làm việc tất cả thời gian', '2': 'Ít thời gian riêng, hầu như tất cả thời gian cho công việc', '3': 'Có một chút thời gian riêng nhưng không đều đặn', '4': 'Có thời gian riêng đều đặn, cân bằng khá tốt', '5': 'Cân bằng xuất sắc giữa công việc và cuộc sống' }, scale_labels_en: { '1': 'Almost no personal time, working all the time', '2': 'Little personal time, almost all time for work', '3': 'Some personal time but not regular', '4': 'Regular personal time, fairly good balance', '5': 'Excellent work-life balance' }, dimension: 'energy' },
        { question_id: 'nl_q4', order_idx: 3, type: 'select', label_vi: 'Bạn có động lực và cảm hứng để tiếp tục phát triển trong nghề không?', label_en: 'Do you have motivation and inspiration to continue growing in your profession?', scale_labels_vi: { '1': 'Không còn động lực, chỉ làm vì áp lực tài chính', '2': 'Ít động lực, cảm thấy chán nản với công việc', '3': 'Động lực trung bình, có lúc hăng hái lúc chán', '4': 'Động lực tốt, có mục tiêu phát triển rõ ràng', '5': 'Động lực mạnh mẽ, liên tục học hỏi và phát triển' }, scale_labels_en: { '1': 'No motivation left, only working for financial pressure', '2': 'Little motivation, feeling bored with work', '3': 'Average motivation, sometimes enthusiastic, sometimes bored', '4': 'Good motivation, have clear development goals', '5': 'Strong motivation, continuously learning and growing' }, dimension: 'energy' },
        { question_id: 'nl_q5', order_idx: 4, type: 'select', label_vi: 'Bạn có cảm giác "sống có mục đích" trong công việc nha khoa không?', label_en: 'Do you feel "living with purpose" in your dental work?', scale_labels_vi: { '1': 'Cảm giác công việc vô nghĩa, chỉ là cách kiếm tiền', '2': 'Công việc là công việc, không có ý nghĩa đặc biệt', '3': 'Thỉnh thoảng cảm thấy có ý nghĩa, nhưng không thường xuyên', '4': 'Thường xuyên cảm thấy công việc có ý nghĩa với bệnh nhân', '5': 'Cảm giác sống có mục đích mạnh mẽ, công việc là sứ mệnh' }, scale_labels_en: { '1': 'Feeling work is meaningless, just a way to make money', '2': 'Work is just work, no special meaning', '3': 'Sometimes feel meaningful but not regularly', '4': 'Frequently feel work has meaning for patients', '5': 'Strong sense of purpose, work is a mission' }, dimension: 'energy' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào năng lượng của mình.',
      subtitle_en: 'Two open questions to look deeply into your energy.',
      ref: 'Năng lượng — Energy',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'nl_open1', order_idx: 0, type: 'textarea', label_vi: 'Khi nào bạn cảm thấy năng lượng cao nhất trong ngày? Điều gì làm bạn cảm thấy tràn đầy năng lượng?', label_en: 'When do you feel most energetic during the day? What makes you feel full of energy?', placeholder_vi: 'Nghĩ về những khoảnh khắc bạn cảm thấy tràn đầy năng lượng — có thể là khi gặp bệnh nhân khó, khi hoàn thành một ca khó, hay khi học được điều mới.', placeholder_en: 'Think about moments when you feel full of energy — maybe when treating a difficult patient, finishing a hard case, or learning something new.' },
        { question_id: 'nl_open2', order_idx: 1, type: 'textarea', label_vi: 'Điều gì "hút" năng lượng của bạn nhiều nhất trong công việc hàng ngày? (người, tình huống, thói quen)', label_en: 'What drains your energy the most in your daily work? (people, situations, habits)', placeholder_vi: 'Nghĩ về những thứ làm bạn mệt mỏi — có thể là bệnh nhân khó, nhân viên, quy trình, hay chính cách suy nghĩ của bạn.', placeholder_en: 'Think about what exhausts you — it could be difficult patients, staff, processes, or your own thought patterns.' },
      ],
    },
  ],
};
