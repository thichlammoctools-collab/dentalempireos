// Seed: Thu Vi Trí Check — phân tích SWOT và chiến lược phòng khám (order 30)
// Free scanner (is_free: 1), đánh giá chiến lược phòng khám qua phân tích SWOT.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const THU_VI_TRI_CHECK_SEED: SeedScanner = {
  id: 'thu-vi-tri-check',
  slug: 'thu-vi-tri-check',
  title_vi: 'Thu Vi Trí Check',
  title_en: 'Competitive Position Check',
  description_vi: 'Phòng khám của bạn đang ở đâu so với đối thủ? Kiểm tra vị thế cạnh tranh và chiến lược phát triển.',
  description_en: 'Where does your clinic stand compared to competitors? Check competitive positioning and development strategy.',
  subtitle_vi: 'Phân tích SWOT và vị thế cạnh tranh',
  subtitle_en: 'SWOT analysis and competitive positioning',
  chapter_refs: ['Ch.STARTUP'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 30,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Thu Vi Trí Check', intro_desc: 'Kiểm tra vị thế cạnh tranh và chiến lược phát triển.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Competitive Position Check', intro_desc: 'Check competitive positioning and development strategy.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'position', name_vi: 'Vị thế cạnh tranh', name_en: 'Competitive Position', question_ids: ['tvtri_q1', 'tvtri_q2', 'tvtri_q3', 'tvtri_q4', 'tvtri_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia chiến lược phòng khám. Dựa trên kết quả Thu Vi Trí Check (điểm {{SCORE_POSITION}}/100 kèm 2 câu open-ended), phân tích vị thế cạnh tranh và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyẾn khích.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, clinic strategy expert. Based on the Competitive Position Check score ({{SCORE_POSITION}}/100 with 2 open-ended answers), analyze competitive positioning and suggest 3 improvements. English, practical tone.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_POSITION}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày cải thiện vị thế cạnh tranh.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_POSITION}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to improve competitive positioning.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ VỊ THẾ CẠNH TRANH',
      title_en: 'PART 1: COMPETITIVE POSITIONING EVALUATION',
      subtitle_vi: '5 chiều đánh giá: phân tích đối thủ, lợi thế, chiến lược, khác biệt, và tầm nhìn.',
      subtitle_en: '5 evaluation dimensions: competitor analysis, strengths, strategy, differentiation, and vision.',
      ref: 'Vị thế cạnh tranh',
      icon: 'compare_arrows',
      questions: [
        { question_id: 'tvtri_q1', order_idx: 0, type: 'select', label_vi: 'Bạn có biết rõ 3-5 đối thủ chính trong khu vực và điểm mạnh/yếu của họ không?', label_en: 'Do you clearly know the 3-5 main competitors in your area and their strengths/weaknesses?', scale_labels_vi: { '1': 'Không quan tâm hoặc không biết đối thủ là ai', '2': 'Biết tên một vài đối thủ nhưng không phân tích sâu', '3': 'Biết đối thủ chính nhưng không có thông tin chi tiết', '4': 'Có phân tích đối thủ cơ bản: giá, dịch vụ, vị trí', '5': 'Phân tích đối thủ toàn diện: SWOT, giá, chất lượng, marketing, USP, patient reviews' }, scale_labels_en: { '1': 'Not interested or do not know who competitors are', '2': 'Know names of some competitors but not deeply analyzed', '3': 'Know main competitors but no detailed information', '4': 'Basic competitor analysis: pricing, services, location', '5': 'Comprehensive competitor analysis: SWOT, pricing, quality, marketing, USP, patient reviews' }, dimension: 'position' },
        { question_id: 'tvtri_q2', order_idx: 1, type: 'select', label_vi: 'Bạn có biết chính xác điểm mạnh độc nhất của phòng khám mà đối thủ khó sao chép không?', label_en: 'Do you know the exact unique strengths of your clinic that competitors cannot easily copy?', scale_labels_vi: { '1': 'Không rõ điểm mạnh độc nhất, nghĩ mình giống đối thủ', '2': 'Có một vài ý nhưng chưa được xác định rõ ràng', '3': 'Biết điểm mạnh nhưng chưa khai thác tốt', '4': 'Có 1-2 điểm mạnh rõ ràng được truyền thông', '5': 'Core competencies rõ ràng: những gì chỉ mình làm được, khó sao chép, được khách hàng công nhận' }, scale_labels_en: { '1': 'Unclear about unique strengths, think you are similar to competitors', '2': 'Have some ideas but not clearly identified', '3': 'Know strengths but not well exploited', '4': 'Have 1-2 clear strengths communicated', '5': 'Clear core competencies: what only you can do, hard to copy, recognized by customers' }, dimension: 'position' },
        { question_id: 'tvtri_q3', order_idx: 2, type: 'select', label_vi: 'Phòng khám có chiến lược phát triển ngắn hạn và dài hạn rõ ràng không?', label_en: 'Does your clinic have clear short-term and long-term development strategies?', scale_labels_vi: { '1': 'Không có chiến lược, làm việc theo cảm tính', '2': 'Có mục tiêu chung nhưng không có chiến lược cụ thể', '3': 'Có kế hoạch ngắn hạn nhưng thiếu tầm nhìn dài hạn', '4': 'Có chiến lược rõ ràng cho 1-2 năm với action plan', '5': 'Chiến lược toàn diện: 3-5 năm vision + annual plan + quarterly OKRs + contingency' }, scale_labels_en: { '1': 'No strategy, working by intuition', '2': 'Have general goals but no specific strategy', '3': 'Have short-term plan but lack long-term vision', '4': 'Clear 1-2 year strategy with action plan', '5': 'Comprehensive strategy: 3-5 year vision + annual plan + quarterly OKRs + contingency' }, dimension: 'position' },
        { question_id: 'tvtri_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có khác biệt hoá được trong mắt bệnh nhân — họ chọn bạn vì lý do gì thay vì đối thủ?', label_en: 'Is your clinic differentiated in patients eyes — why do they choose you instead of competitors?', scale_labels_vi: { '1': 'Không có sự khác biệt rõ ràng, bệnh nhân chọn vì giá hoặc gần nhà', '2': 'Có một vài khác biệt nhưng chưa mạnh và chưa được nhận thức', '3': 'Có USP tiềm năng nhưng chưa được truyền thông hiệu quả', '4': 'Có USP rõ ràng và được truyền thông tốt đến bệnh nhân', '5': 'Brand differentiation mạnh: USP độc nhất, được truyền thông xuyên suốt, patient loyalty cao' }, scale_labels_en: { '1': 'No clear differentiation, patients choose based on price or proximity', '2': 'Have some differences but not strong and not perceived', '3': 'Have potential USP but not effectively communicated', '4': 'Have clear USP and well communicated to patients', '5': 'Strong brand differentiation: unique USP, consistently communicated, high patient loyalty' }, dimension: 'position' },
        { question_id: 'tvtri_q5', order_idx: 4, type: 'select', label_vi: 'Bạn có tầm nhìn rõ ràng về phòng khám trong 3-5 năm tới không — phát triển quy mô, chuyên môn hoá, hay tối ưu hoá?', label_en: 'Do you have a clear vision for your clinic in the next 3-5 years — scale up, specialize, or optimize?', scale_labels_vi: { '1': 'Không có tầm nhìn, sống ngày nào hay ngày đó', '2': 'Có ước mơ chung nhưng chưa có kế hoạch cụ thể', '3': 'Có định hướng nhưng chưa xác định rõ con đường', '4': 'Có tầm nhìn rõ ràng với các milestone cụ thể', '5': 'Tầm nhìn chiến lược rõ ràng: growth path + specialization + investment plan + exit strategy' }, scale_labels_en: { '1': 'No vision, living day to day', '2': 'Have general dreams but no specific plan', '3': 'Have direction but not clearly defined path', '4': 'Clear vision with specific milestones', '5': 'Clear strategic vision: growth path + specialization + investment plan + exit strategy' }, dimension: 'position' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào vị thế cạnh tranh.',
      subtitle_en: 'Two open questions to look deeply into your competitive positioning.',
      ref: 'Vị thế cạnh tranh',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'tvtri_open1', order_idx: 0, type: 'textarea', label_vi: 'Nếu một phòng khám mới với đầy đủ tiền và đội ngũ giỏi mở ngay cạnh bạn, điều gì khiến bệnh nhân hiện tại VẪN ở lại với bạn?', label_en: 'If a new clinic with full funding and a great team opened right next to you, what would make current patients STILL stay with you?', placeholder_vi: 'Nghĩ về những thứ KHÔNG thể mua bằng tiền — mối quan hệ, niềm tin, thời gian, hay kinh nghiệm mà bạn đã xây dựng với bệnh nhân.', placeholder_en: 'Think about things that CANNOT be bought with money — relationships, trust, time, or experience you have built with patients.' },
        { question_id: 'tvtri_open2', order_idx: 1, type: 'textarea', label_vi: 'Bạn thấy mình đang ở giai đoạn nào của vòng đời phòng khám — khởi đầu, tăng trưởng, ổn định, hay suy thoái? Điều gì cho thấy điều đó?', label_en: 'What stage of the clinic lifecycle do you think you are in — beginning, growth, stability, or decline? What indicates this?', placeholder_vi: 'Các dấu hiệu: doanh thu tăng/giảm, bệnh nhân mới, bệnh nhân cũ quay lại, đội ngũ ổn định, áp lực cạnh tranh...', placeholder_en: 'Signs: revenue growing/declining, new patients, returning patients, team stability, competitive pressure...' },
      ],
    },
  ],
};
