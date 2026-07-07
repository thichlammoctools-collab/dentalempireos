// Seed: Linh Hồn Check — sứ mệnh, tầm nhìn, giá trị cốt lõi (order 18)
// Free scanner (is_free: 1), lead magnet để khám phá "why" của phòng khám.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const LINH_HON_CHECK_SEED: SeedScanner = {
  id: 'linh-hon-check',
  slug: 'linh-hon-check',
  title_vi: 'Linh Hồn Check',
  title_en: 'Soul Check',
  description_vi: 'Sứ mệnh, tầm nhìn và giá trị cốt lõi là nền tảng của mọi phòng khám vĩnh viễn. Kiểm tra xem phòng khám của bạn đã có "linh hồn" chưa.',
  description_en: 'Mission, vision, and core values are the foundation of every lasting clinic. Check if your clinic already has a "soul".',
  subtitle_vi: 'Khám phá sứ mệnh và tầm nhìn phòng khám',
  subtitle_en: 'Explore your clinic mission and vision',
  chapter_refs: ['Ch.LINHHON'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 18,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Linh Hồn Check', intro_desc: 'Sứ mệnh, tầm nhìn và giá trị cốt lõi là nền tảng. Kiểm tra "linh hồn" phòng khám của bạn.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Soul Check', intro_desc: 'Mission, vision, and core values are the foundation. Check your clinic "soul".', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'soul', name_vi: 'Linh hồn phòng khám', name_en: 'Clinic Soul', question_ids: ['lh_q1', 'lh_q2', 'lh_q3', 'lh_q4', 'lh_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Linh Hồn Check (điểm {{SCORE_SOUL}}/100 kèm 2 câu open-ended), phân tích sứ mệnh và tầm nhìn phòng khám và đưa ra 3 gợi ý để củng cố "linh hồn" phòng khám. Dùng tiếng Việt, giọng trầm lắng, sâu sắc. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant. Based on the Soul Check score ({{SCORE_SOUL}}/100 with 2 open-ended answers), analyze the clinic mission and vision and suggest 3 ways to strengthen its "soul". English, contemplative and profound tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_SOUL}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo kế hoạch 30 ngày để củng cố linh hồn phòng khám.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, sâu sắc\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_SOUL}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to strengthen your clinic soul.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and contemplative tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ LINH HỒN',
      title_en: 'PART 1: SOUL EVALUATION',
      subtitle_vi: '5 chiều đánh giá: sứ mệnh, tầm nhìn, giá trị, câu chuyện, và lời hứa.',
      subtitle_en: '5 evaluation dimensions: mission, vision, values, story, and promise.',
      ref: 'Linh hồn — Soul',
      icon: 'auto_awesome',
      questions: [
        { question_id: 'lh_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám đã có sứ mệnh rõ ràng chưa — một câu statement ngắn gọn nói lên "TẠI SAO phòng khám tồn tại"?', label_en: 'Does your clinic have a clear mission — a concise statement explaining "WHY" the clinic exists?', scale_labels_vi: { '1': 'Không có sứ mệnh, hoạt động vì doanh thu', '2': 'Có ý tưởng sứ mệnh nhưng chưa viết ra rõ ràng', '3': 'Có sứ mệnh nhưng chưa được chia sẻ với đội ngũ', '4': 'Có sứ mệnh rõ ràng, đội ngũ biết và nhắc đến', '5': 'Sứ mệnh sâu sắc, được truyền cảm hứng, định hướng mọi quyết định' }, scale_labels_en: { '1': 'No mission, operating for revenue only', '2': 'Have a mission idea but not clearly written down', '3': 'Have a mission but not shared with the team', '4': 'Clear mission, team knows and references it', '5': 'Deep mission, inspiring, guiding every decision' }, dimension: 'soul' },
        { question_id: 'lh_q2', order_idx: 1, type: 'select', label_vi: 'Phòng khám có tầm nhìn rõ ràng về nơi muốn đến trong 3-5 năm tới chưa?', label_en: 'Does your clinic have a clear vision of where it wants to go in 3-5 years?', scale_labels_vi: { '1': 'Không có tầm nhìn, sống ngày nào hay ngày đó', '2': 'Có suy nghĩ về tương lai nhưng chưa định hình rõ', '3': 'Có tầm nhìn chung nhưng chưa chia sẻ với đội ngũ', '4': 'Có tầm nhìn rõ ràng, được bài bản hóa và theo dõi', '5': 'Tầm nhìn truyền cảm hứng, đội ngũ gắn kết vì tầm nhìn chung' }, scale_labels_en: { '1': 'No vision, living day to day', '2': 'Thinking about the future but not clearly defined', '3': 'Have a general vision but not shared with the team', '4': 'Clear vision, formalized and tracked', '5': 'Inspiring vision, team united by shared purpose' }, dimension: 'soul' },
        { question_id: 'lh_q3', order_idx: 2, type: 'select', label_vi: 'Phòng khám có 3-5 giá trị cốt lõi rõ ràng và được thể hiện trong hành vi hàng ngày chưa?', label_en: 'Does your clinic have 3-5 clear core values that are reflected in daily behavior?', scale_labels_vi: { '1': 'Không có giá trị cốt lõi được định nghĩa', '2': 'Có một vài giá trị nhưng chưa rõ ràng và nhất quán', '3': 'Có giá trị được viết ra nhưng chưa được đội ngũ thực sự hiểu', '4': 'Giá trị rõ ràng, được đào tạo và đo lường', '5': 'Giá trị sâu sắc, thấm nhuần vào mọi hành vi của đội ngũ' }, scale_labels_en: { '1': 'No defined core values', '2': 'Have some values but not clear and consistent', '3': 'Values written but not truly understood by the team', '4': 'Clear values, trained and measured', '5': 'Deep values, ingrained in every team behavior' }, dimension: 'soul' },
        { question_id: 'lh_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có câu chuyện (story) riêng — tại sao bạn làm nha khoa, tại sao mở phòng khám này?', label_en: 'Does your clinic have its own story — why you do dentistry, why you opened this clinic?', scale_labels_vi: { '1': 'Không có câu chuyện, chỉ là một phòng khám như bao phòng khám khác', '2': 'Có câu chuyện trong đầu nhưng chưa viết ra hoặc chia sẻ', '3': 'Có câu chuyện được chia sẻ nhưng chưa thực sự cảm hứng', '4': 'Câu chuyện được viết rõ, chia sẻ với bệnh nhân và đội ngũ', '5': 'Câu chuyện mạnh mẽ, truyền cảm hứng, là nền tảng thương hiệu' }, scale_labels_en: { '1': 'No story, just another clinic like any other', '2': 'Have a story in mind but not written or shared', '3': 'Story shared but not truly inspiring', '4': 'Story clearly written, shared with patients and team', '5': 'Powerful story, inspiring, foundation of the brand' }, dimension: 'soul' },
        { question_id: 'lh_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có "lời hứa" (promise) rõ ràng với bệnh nhân — điều họ có thể kỳ vọng mỗi lần đến?', label_en: 'Does your clinic have a clear "promise" to patients — what they can expect every visit?', scale_labels_vi: { '1': 'Không có lời hứa cụ thể, mọi thứ tùy thuộc vào từng người', '2': 'Có một số kỳ vọng chung nhưng chưa được công khai hóa', '3': 'Có lời hứa được viết ra nhưng đội ngũ không luôn giữ được', '4': 'Lời hứa rõ ràng, được đào tạo và theo dõi', '5': 'Lời hứa mạnh mẽ, đội ngũ tự hào và luôn giữ lời' }, scale_labels_en: { '1': 'No specific promise, everything depends on the person', '2': 'Have some general expectations but not publicly stated', '3': 'Promise written but team doesn\'t always keep it', '4': 'Clear promise, trained and tracked', '5': 'Strong promise, team proud and always delivers' }, dimension: 'soul' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào linh hồn phòng khám.',
      subtitle_en: 'Two open questions to look deeply into your clinic soul.',
      ref: 'Linh hồn — Soul',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'lh_open1', order_idx: 0, type: 'textarea', label_vi: 'Tại sao bạn làm nha khoa? Điều gì khiến bạn thức dậy mỗi sáng với công việc này?', label_en: 'Why do you do dentistry? What makes you wake up every morning for this work?', placeholder_vi: 'Nghĩ về động lực sâu nhất của bạn. Điều gì thực sự quan trọng với bạn trong nghề nha khoa?', placeholder_en: 'Think about your deepest motivation. What truly matters to you in dentistry?' },
        { question_id: 'lh_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu phòng khám của bạn tồn tại trong 50 năm tới, bạn muốn người ta nhớ đến nó vì điều gì?', label_en: 'If your clinic existed for another 50 years, what do you want people to remember it for?', placeholder_vi: 'Nghĩ về di sản (legacy) bạn muốn để lại. Điều gì sẽ làm cho phòng khám của bạn đáng nhớ?', placeholder_en: 'Think about the legacy you want to leave. What would make your clinic unforgettable?' },
      ],
    },
  ],
};
