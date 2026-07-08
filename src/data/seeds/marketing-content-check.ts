// Seed: Marketing Content Check — chiến lược nội dung marketing (order 23)
// Free scanner (is_free: 1), đánh giá content marketing của phòng khám.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const MARKETING_CONTENT_CHECK_SEED: SeedScanner = {
  id: 'marketing-content-check',
  slug: 'marketing-content-check',
  title_vi: 'Marketing Content Check',
  title_en: 'Marketing Content Check',
  description_vi: 'Content marketing là cách phòng khám tiếp cận bệnh nhân mới một cách có giá trị. Kiểm tra chiến lược nội dung của bạn.',
  description_en: 'Content marketing is how your clinic reaches new patients with value. Check your content strategy.',
  subtitle_vi: 'Đánh giá chiến lược nội dung marketing',
  subtitle_en: 'Assess your content marketing strategy',
  chapter_refs: ['Ch.MARKETING'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 23,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Marketing Content Check', intro_desc: 'Content marketing giúp phòng khám tiếp cận bệnh nhân mới.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Marketing Content Check', intro_desc: 'Content marketing helps clinics reach new patients.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'content', name_vi: 'Content marketing', name_en: 'Content Marketing', question_ids: ['mc_q1', 'mc_q2', 'mc_q3', 'mc_q4', 'mc_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia marketing nha khoa. Dựa trên kết quả Marketing Content Check (điểm {{SCORE_CONTENT}}/100 kèm 2 câu open-ended), phân tích chiến lược content và đưa ra 3 gợi ý ưu tiên. Tiếng Việt, giọng thực tế, khuyẾn khích.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental marketing expert. Based on the Marketing Content Check score ({{SCORE_CONTENT}}/100 with 2 open-ended answers), analyze content strategy and suggest 3 priority improvements. English, practical tone.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_CONTENT}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày xây dựng content marketing.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_CONTENT}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day content marketing plan.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ CONTENT MARKETING',
      title_en: 'PART 1: CONTENT MARKETING EVALUATION',
      subtitle_vi: '5 chiều đánh giá: chiến lược, định kỳ, đa nền tảng, giá trị, và đo lường.',
      subtitle_en: '5 evaluation dimensions: strategy, consistency, multi-platform, value, and measurement.',
      ref: 'Content Marketing',
      icon: 'edit_note',
      questions: [
        { question_id: 'mc_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám có chiến lược content marketing rõ ràng — biết đăng gì, cho ai, và mục tiêu gì không?', label_en: 'Does your clinic have a clear content marketing strategy — knowing what to post, for whom, and the goal?', scale_labels_vi: { '1': 'Không có chiến lược, đăng bừa theo cảm hứng', '2': 'Có suy nghĩ nhưng không có kế hoạch cụ thể', '3': 'Có chiến lược chung nhưng chưa bài bản', '4': 'Có chiến lược rõ ràng với lịch content cụ thể', '5': 'Chiến lược content chuyên nghiệp: có content calendar, KPI, và review định kỳ' }, scale_labels_en: { '1': 'No strategy, posting randomly', '2': 'Have ideas but no specific plan', '3': 'General strategy but not systematic', '4': 'Clear strategy with specific content calendar', '5': 'Professional content strategy with calendar, KPIs, and regular review' }, dimension: 'content' },
        { question_id: 'mc_q2', order_idx: 1, type: 'select', label_vi: 'Phòng khám đăng content đều đặn trên các nền tảng số không?', label_en: 'Does your clinic post content regularly on digital platforms?', scale_labels_vi: { '1': 'Không đăng content thường xuyên', '2': 'Thỉnh thoảng đăng, không có lịch đều', '3': 'Đăng khá đều nhưng không theo kế hoạch', '4': 'Có lịch đăng đều đặn, duy trì tốt', '5': 'Đăng đều đặn với content calendar chuẩn, có auto-schedule' }, scale_labels_en: { '1': 'Not posting regularly', '2': 'Occasionally posting, no consistent schedule', '3': 'Posting fairly regularly but not planned', '4': 'Consistent posting schedule, well maintained', '5': 'Standard content calendar with auto-scheduling, consistently maintained' }, dimension: 'content' },
        { question_id: 'mc_q3', order_idx: 2, type: 'select', label_vi: 'Content của phòng khám có mang lại giá trị cho bệnh nhân — giáo dục, giải đáp thắc mắc, hay chỉ quảng cáo?', label_en: 'Does your content provide value to patients — education, answering questions, or just advertising?', scale_labels_vi: { '1': 'Chủ yếu quảng cáo, ít giá trị giáo dục', '2': 'Quảng cáo nhiều hơn giá trị', '3': 'Cân bằng giữa quảng cáo và giáo dục', '4': 'Nhiều content giá trị, ít quảng cáo trực tiếp', '5': 'Content chủ yếu giáo dục và giải đáp — xây dựng niềm tin trước' }, scale_labels_en: { '1': 'Mostly advertising, little educational value', '2': 'More advertising than value', '3': 'Balancing advertising and education', '4': 'Lots of valuable content, little direct advertising', '5': 'Content primarily educational and answering — building trust first' }, dimension: 'content' },
        { question_id: 'mc_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám đo lường hiệu quả content marketing như thế nào?', label_en: 'How does your clinic measure the effectiveness of content marketing?', scale_labels_vi: { '1': 'Không đo lường, không biết content nào hiệu quả', '2': 'Nhìn số lượt thích nhưng không phân tích sâu', '3': 'Theo dõi tương tác cơ bản trên một số nền tảng', '4': 'Có analytics cho tất cả nền tảng, theo dõi KPI', '5': 'Hệ thống đo lường toàn diện: reach, engagement, conversion, ROI' }, scale_labels_en: { '1': 'Not measuring, not knowing which content works', '2': 'Looking at likes but not analyzing deeply', '3': 'Tracking basic engagement on some platforms', '4': 'Analytics for all platforms, tracking KPIs', '5': 'Comprehensive measurement: reach, engagement, conversion, ROI' }, dimension: 'content' },
        { question_id: 'mc_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có kênh content riêng — blog, video, podcast — hay chỉ dựa vào mạng xã hội?', label_en: 'Does your clinic have owned content channels — blog, video, podcast — or only relying on social media?', scale_labels_vi: { '1': 'Không có kênh riêng, chỉ dựa vào mạng xã hội bừa bãi', '2': 'Có Facebook/Zalo nhưng không có chiến lược rõ ràng', '3': 'Có 1-2 kênh chính với nội dung khá ổn', '4': 'Có đa kênh: mạng xã hội + ít nhất 1 kênh riêng', '5': 'Hệ thống đa kênh: social + blog/video + email + SEO' }, scale_labels_en: { '1': 'No owned channels, only chaotic social media', '2': 'Have Facebook/Zalo but no clear strategy', '3': 'Have 1-2 main channels with fairly good content', '4': 'Multi-channel: social media + at least 1 owned channel', '5': 'Full multi-channel system: social + blog/video + email + SEO' }, dimension: 'content' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào chiến lược content.',
      subtitle_en: 'Two open questions to look deeply into your content strategy.',
      ref: 'Content Marketing',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'mc_open1', order_idx: 0, type: 'textarea', label_vi: 'Kể về một bài content mà bạn tự hào nhất. Điều gì làm nó thành công?', label_en: 'Describe a piece of content you are most proud of. What made it successful?', placeholder_vi: 'Mô tả bài content: loại nội dung, nền tảng, kết quả đạt được, và tại sao bạn tự hào về nó.', placeholder_en: 'Describe the content: type, platform, results achieved, and why you are proud of it.' },
        { question_id: 'mc_open2', order_idx: 1, type: 'textarea', label_vi: 'Điều gì ngăn cản bạn tạo content đều đặn và chất lượng hơn?', label_en: 'What prevents you from creating content more regularly and with better quality?', placeholder_vi: 'Nghĩ về rào cản lớn nhất: thời gian, ý tưởng, kỹ năng, hay động lực?', placeholder_en: 'Think about the biggest barrier: time, ideas, skills, or motivation?' },
      ],
    },
  ],
};
