// Seed: Thích Ứng Check — khả năng thích ứng và chuyển đổi số (order 31)
// Free scanner (is_free: 1), đánh giá adaptability và digital transformation.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const THICH_UNG_DUNG_CHECK_SEED: SeedScanner = {
  id: 'thich-ung-dung-check',
  slug: 'thich-ung-dung-check',
  title_vi: 'Thích Ứng Check',
  title_en: 'Adaptability Check',
  description_vi: 'Thị trường nha khoa thay đổi nhanh chóng. Bạn thích ứng được với xu hướng mới và công nghệ mới không? Kiểm tra khả năng thích ứng.',
  description_en: 'The dental market changes quickly. Can you adapt to new trends and technology? Check your adaptability.',
  subtitle_vi: 'Đánh giá khả năng thích ứng và chuyển đổi số',
  subtitle_en: 'Assess adaptability and digital transformation',
  chapter_refs: ['Ch.STARTUP'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 31,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Thích Ứng Check', intro_desc: 'Kiểm tra khả năng thích ứng và chuyển đổi số.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Adaptability Check', intro_desc: 'Check your adaptability and digital transformation.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'adapt', name_vi: 'Thích ứng', name_en: 'Adaptability', question_ids: ['tu_q1', 'tu_q2', 'tu_q3', 'tu_q4', 'tu_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia thích ứng và đổi mới nha khoa. Dựa trên kết quả Thích Ứng Check (điểm {{SCORE_ADAPT}}/100 kèm 2 câu open-ended), phân tích khả năng thích ứng và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyến khích.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental adaptability and innovation expert. Based on the Adaptability Check score ({{SCORE_ADAPT}}/100 with 2 open-ended answers), analyze adaptability and suggest 3 improvements. English, practical tone.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_ADAPT}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày tăng khả năng thích ứng.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_ADAPT}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to increase adaptability.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ KHẢ NĂNG THÍCH ỨNG',
      title_en: 'PART 1: ADAPTABILITY EVALUATION',
      subtitle_vi: '5 chiều đánh giá: công nghệ, xu hướng, mô hình, đội ngũ, và tâm lý.',
      subtitle_en: '5 evaluation dimensions: technology, trends, models, team, and mindset.',
      ref: 'Thích Ứng',
      icon: 'autorenew',
      questions: [
        { question_id: 'tu_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám có cập nhật và áp dụng công nghệ mới khi cần không?', label_en: 'Does your clinic update and apply new technology when needed?', scale_labels_vi: { '1': 'Không theo dõi công nghệ mới, dùng công nghệ cũ', '2': 'Biết công nghệ mới nhưng ngại thay đổi', '3': 'Thỉnh thoảng cập nhật khi bắt buộc', '4': 'Chủ động theo dõi và áp dụng công nghệ mới có chọn lọc', '5': 'Chiến lược công nghệ: research + evaluate + adopt + train + measure ROI' }, scale_labels_en: { '1': 'Not following new technology, using old technology', '2': 'Know new technology but reluctant to change', '3': 'Occasionally update when forced', '4': 'Proactively following and selectively adopting new technology', '5': 'Technology strategy: research + evaluate + adopt + train + measure ROI' }, dimension: 'adapt' },
        { question_id: 'tu_q2', order_idx: 1, type: 'select', label_vi: 'Bạn có theo dõi và phản ứng với xu hướng thị trường nha khoa không — giá cả, dịch vụ mới, kỳ vọng bệnh nhân thay đổi?', label_en: 'Do you follow and react to dental market trends — pricing, new services, changing patient expectations?', scale_labels_vi: { '1': 'Không theo dõi xu hướng, giữ nguyên mô hình cũ', '2': 'Biết có thay đổi nhưng phản ứng chậm', '3': 'Thỉnh thoảng điều chỉnh khi thấy rõ vấn đề', '4': 'Chủ động theo dõi và điều chỉnh theo xu hướng', '5': 'Strategic awareness: trend monitoring + market intelligence + proactive adaptation' }, scale_labels_en: { '1': 'Not following trends, keeping old model', '2': 'Know changes but slow to react', '3': 'Occasionally adjust when problems become clear', '4': 'Proactively following and adjusting to trends', '5': 'Strategic awareness: trend monitoring + market intelligence + proactive adaptation' }, dimension: 'adapt' },
        { question_id: 'tu_q3', order_idx: 2, type: 'select', label_vi: 'Bạn có sẵn sàng thay đổi mô hình kinh doanh hoặc dịch vụ khi thị trường yêu cầu không?', label_en: 'Are you willing to change your business model or services when the market requires it?', scale_labels_vi: { '1': 'Không muốn thay đổi, giữ nguyên như cũ', '2': 'Chỉ thay đổi khi bị ép buộc', '3': 'Sẵn sàng thay đổi nhưng cần thời gian dài', '4': 'Thay đổi linh hoạt khi cần, có kế hoạch chuyển đổi', '5': 'Agile transformation: fast decision-making + experiment + pivot + scale' }, scale_labels_en: { '1': 'Do not want to change, keeping the same', '2': 'Only change when forced', '3': 'Willing to change but needs long time', '4': 'Flexibly changing when needed, with transition plan', '5': 'Agile transformation: fast decision-making + experiment + pivot + scale' }, dimension: 'adapt' },
        { question_id: 'tu_q4', order_idx: 3, type: 'select', label_vi: 'Đội ngũ của bạn có khả năng học hỏi và thích ứng với quy trình mới không?', label_en: 'Does your team have the ability to learn and adapt to new processes?', scale_labels_vi: { '1': 'Đội ngũ kháng cự thay đổi, không muốn học cái mới', '2': 'Một số người chịu thích ứng, phần lớn kháng cự', '3': 'Đội ngũ cơ bản thích ứng nhưng cần thời gian và hướng dẫn', '4': 'Đội ngũ thích ứng tốt, có văn hoá học tập', '5': 'Learning culture: training + mentorship + psychological safety + continuous improvement' }, scale_labels_en: { '1': 'Team resists change, does not want to learn new things', '2': 'Some people willing to adapt, majority resists', '3': 'Team basically adapts but needs time and guidance', '4': 'Team adapts well, has learning culture', '5': 'Learning culture: training + mentorship + psychological safety + continuous improvement' }, dimension: 'adapt' },
        { question_id: 'tu_q5', order_idx: 4, type: 'select', label_vi: 'Bạn có tìm kiếm và học hỏi từ những nguồn mới — khóa học, cộng đồng, mentors — để phát triển phòng khám không?', label_en: 'Do you seek and learn from new sources — courses, communities, mentors — to develop your clinic?', scale_labels_vi: { '1': 'Không tìm kiếm nguồn học mới, tự làm theo kinh nghiệm', '2': 'Thỉnh thoảng đọc bài viết nhưng không có hệ thống', '3': 'Tham gia một vài khóa học hoặc cộng đồng', '4': 'Chủ động học hỏi: khóa học + community + mentorship + benchmarking', '5': 'Learning system: regular education + peer network + expert mentorship + industry conferences' }, scale_labels_en: { '1': 'Not seeking new learning sources, working by experience', '2': 'Occasionally read articles but no system', '3': 'Participating in some courses or communities', '4': 'Proactively learning: courses + community + mentorship + benchmarking', '5': 'Learning system: regular education + peer network + expert mentorship + industry conferences' }, dimension: 'adapt' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-EFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào khả năng thích ứng.',
      subtitle_en: 'Two open questions to look deeply into your adaptability.',
      ref: 'Thích Ứng',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'tu_open1', order_idx: 0, type: 'textarea', label_vi: 'Kể về một lần phòng khám phải thay đổi lớn — vì covid, vì đối thủ, vì công nghệ. Bạn đã phản ứng như thế nào?', label_en: 'Tell about a time when your clinic had to make a big change — due to covid, competitors, or technology. How did you react?', placeholder_vi: 'Nghĩ về một thay đổi lớn mà phòng khám phải trải qua. Bạn đã thích ứng nhanh hay chậm? Điều gì giúp hoặc cản trở bạn?', placeholder_en: 'Think about a major change your clinic had to go through. Did you adapt quickly or slowly? What helped or hindered you?' },
        { question_id: 'tu_open2', order_idx: 1, type: 'textarea', label_vi: 'Công nghệ hoặc xu hướng nào trong nha khoa mà bạn thấy hứa hẹn nhưng chưa áp dụng? Điều gì ngăn cản bạn?', label_en: 'What dental technology or trend do you find promising but have not applied? What is preventing you?', placeholder_vi: 'Ví dụ: AI diagnosis, teledentistry, digital marketing, membership plans, new treatment techniques... Điều gì khiến bạn chưa nhảy vào?', placeholder_en: 'Examples: AI diagnosis, teledentistry, digital marketing, membership plans, new treatment techniques... What makes you hesitant to jump in?' },
      ],
    },
  ],
};
