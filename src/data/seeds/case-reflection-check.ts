// Seed: Case Reflection Check — thói quen soi chiếu ca điều trị (order 20)
// Free scanner (is_free: 1), giúp bác sĩ tự nâng cấp qua phân tích ca.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const CASE_REFLECTION_CHECK_SEED: SeedScanner = {
  id: 'case-reflection-check',
  slug: 'case-reflection-check',
  title_vi: 'Case Reflection Check',
  title_en: 'Case Reflection Check',
  description_vi: 'Bác sĩ giỏi không phải vì làm nhiều ca — mà vì biết học từ mỗi ca. Kiểm tra thói quen soi chiếu của bạn.',
  description_en: 'Good doctors aren\'t made by doing many cases — they\'re made by learning from each one. Check your case reflection habits.',
  subtitle_vi: 'Thói quen phân tích và rút kinh nghiệm từ ca điều trị',
  subtitle_en: 'Habit of analyzing and learning from treatment cases',
  chapter_refs: ['Ch.REFLECTION'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 20,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Case Reflection Check', intro_desc: 'Bác sĩ giỏi không phải vì làm nhiều ca — mà vì biết học từ mỗi ca.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Case Reflection Check', intro_desc: 'Good doctors aren\'t made by doing many cases — they\'re made by learning from each one.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'reflection', name_vi: 'Phản tư ca', name_en: 'Case Reflection', question_ids: ['cr_q1', 'cr_q2', 'cr_q3', 'cr_q4', 'cr_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Case Reflection Check (điểm {{SCORE_REFLECTION}}/100 kèm 2 câu open-ended), phân tích thói quen phản tư của bác sĩ và đưa ra 3 gợi ý để xây dựng thói quen học từ ca. Dùng tiếng Việt, giọng đồng nghiệp, thực tế. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant. Based on the Case Reflection Check score ({{SCORE_REFLECTION}}/100 with 2 open-ended answers), analyze the doctor reflection habits and suggest 3 ways to build case-based learning habits. English, collegial and practical tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_REFLECTION}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo kế hoạch 30 ngày xây dựng thói quen phản tư ca.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_REFLECTION}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to build case reflection habits.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ THÓI QUEN PHẢN TƯ',
      title_en: 'PART 1: REFLECTION HABITS EVALUATION',
      subtitle_vi: '5 chiều đánh giá: ghi chép, phân tích, thảo luận, cập nhật, và cải thiện.',
      subtitle_en: '5 evaluation dimensions: documentation, analysis, discussion, updating, and improving.',
      ref: 'Case Reflection',
      icon: 'psychology',
      questions: [
        { question_id: 'cr_q1', order_idx: 0, type: 'select', label_vi: 'Bạn có thói quen ghi chép và theo dõi diễn tiến của các ca điều trị phức tạp không?', label_en: 'Do you have a habit of documenting and tracking complex treatment cases?', scale_labels_vi: { '1': 'Không ghi chép gì, chỉ nhớ trong đầu', '2': 'Ghi chép sơ sài, không có hệ thống', '3': 'Ghi chép cho một số ca nhưng không đều đặn', '4': 'Có hệ thống ghi chép cho hầu hết ca phức tạp', '5': 'Hệ thống ghi chép chuẩn, có ảnh, timeline, và lesson learned' }, scale_labels_en: { '1': 'No documentation, just remembering in my head', '2': 'Sporadic notes, no system', '3': 'Documenting some cases but not regularly', '4': 'System for documenting most complex cases', '5': 'Standard documentation with photos, timeline, and lessons learned' }, dimension: 'reflection' },
        { question_id: 'cr_q2', order_idx: 1, type: 'select', label_vi: 'Sau mỗi ca điều trị, bạn có dành thời gian phân tích: ca nào tốt, ca nào cần cải thiện không?', label_en: 'After each treatment case, do you take time to analyze: what went well, what needs improvement?', scale_labels_vi: { '1': 'Không bao giờ phân tích, cứ thế làm ca tiếp theo', '2': 'Thỉnh thoảng nghĩ lại một chút nhưng không có thời gian cố định', '3': 'Có phân tích nhưng không có quy trình cụ thể', '4': 'Có thời gian cố định để phân tích sau ca', '5': 'Quy trình phân tích bài bản: đánh giá → học → cải thiện protocol' }, scale_labels_en: { '1': 'Never analyze, just move on to the next case', '2': 'Sometimes think back briefly but no fixed time', '3': 'Analyze but no specific process', '4': 'Fixed time set aside for post-case analysis', '5': 'Thorough process: evaluate → learn → improve protocol' }, dimension: 'reflection' },
        { question_id: 'cr_q3', order_idx: 2, type: 'select', label_vi: 'Bạn có thảo luận ca khó với đồng nghiệp hoặc tìm kiếm ý kiến thứ hai không?', label_en: 'Do you discuss difficult cases with colleagues or seek second opinions?', scale_labels_vi: { '1': 'Không thảo luận, tự giải quyết một mình', '2': 'Thỉnh thoảng hỏi ý kiến nhưng không chủ động', '3': 'Thảo luận khi gặp ca thực sự khó', '4': 'Thường xuyên thảo luận và học hỏi từ đồng nghiệp', '5': 'Case review meeting định kỳ, có quy trình thảo luận chuẩn' }, scale_labels_en: { '1': 'Don\'t discuss, solve alone', '2': 'Occasionally ask but not proactive', '3': 'Discuss when encountering truly difficult cases', '4': 'Regularly discuss and learn from colleagues', '5': 'Regular case review meetings with standard discussion process' }, dimension: 'reflection' },
        { question_id: 'cr_q4', order_idx: 3, type: 'select', label_vi: 'Bạn có theo dõi và cập nhật kiến thức chuyên môn mới từ các ca đã làm không?', label_en: 'Do you track and update clinical knowledge from cases you\'ve done?', scale_labels_vi: { '1': 'Không theo dõi, làm theo cách đã học từ trường', '2': 'Thỉnh thoảng đọc thêm nhưng không liên quan đến ca cụ thể', '3': 'Cập nhật khi có dịp nhưng không có hệ thống', '4': 'Có hệ thống cập nhật kiến thức dựa trên các ca gặp phải', '5': 'Học liên tục từ ca — mỗi ca là bài học, có database cá nhân' }, scale_labels_en: { '1': 'Not tracking, doing things the way I learned in school', '2': 'Occasionally read more but not related to specific cases', '3': 'Update when the opportunity arises but no system', '4': 'Systematic knowledge update based on cases encountered', '5': 'Continuous learning from cases — each case is a lesson, personal database' }, dimension: 'reflection' },
        { question_id: 'cr_q5', order_idx: 4, type: 'select', label_vi: 'Khi một ca gặp biến chứng hoặc không như kế hoạch, bạn xử lý và rút kinh nghiệm như thế nào?', label_en: 'When a case has complications or doesn\'t go as planned, how do you handle and learn from it?', scale_labels_vi: { '1': 'Xử lý qua loa, không phân tích nguyên nhân', '2': 'Xử lý xong rồi thôi, ít khi nghĩ lại', '3': 'Có suy nghĩ nhưng không ghi chép để rút kinh nghiệm', '4': 'Có phân tích nguyên nhân và rút kinh nghiệm có hệ thống', '5': 'Root cause analysis chuẩn + protocol update + shared with team' }, scale_labels_en: { '1': 'Handle casually, don\'t analyze the cause', '2': 'Handle it and move on, rarely reflect', '3': 'Think about it but don\'t document to learn', '4': 'Systematic root cause analysis and lessons learned', '5': 'Standard root cause analysis + protocol update + shared with team' }, dimension: 'reflection' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào thói quen học từ ca của mình.',
      subtitle_en: 'Two open questions to look deeply into your case-based learning habits.',
      ref: 'Case Reflection',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'cr_open1', order_idx: 0, type: 'textarea', label_vi: 'Kể về một ca điều trị gần đây mà bạn học được nhiều nhất. Điều gì đã xảy ra và bạn rút ra bài học gì?', label_en: 'Tell about a recent treatment case where you learned the most. What happened and what lesson did you take away?', placeholder_vi: 'Mô tả ca đó: ca gì, tình huống, kết quả, và quan trọng nhất — bạn học được gì từ nó.', placeholder_en: 'Describe the case: what type, situation, outcome, and most importantly — what you learned from it.' },
        { question_id: 'cr_open2', order_idx: 1, type: 'textarea', label_vi: 'Điều gì ngăn cản bạn dành nhiều thời gian hơn để phản tư và học hỏi từ các ca điều trị?', label_en: 'What prevents you from spending more time reflecting and learning from treatment cases?', placeholder_vi: 'Nghĩ về rào cản lớn nhất: thời gian, thói quen, hay động lực?', placeholder_en: 'Think about the biggest barrier: time, habits, or motivation?' },
      ],
    },
  ],
};
