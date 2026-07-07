// Seed: Phân Biệt Thương Hiệu Check — brand differentiation và định vị (order 27)
// Free scanner (is_free: 1), đánh giá brand positioning và differentiation.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const PHAN_BIET_THUONG_HIEU_CHECK_SEED: SeedScanner = {
  id: 'phan-biet-thuong-hieu-check',
  slug: 'phan-biet-thuong-hieu-check',
  title_vi: 'Phân Biệt Thương Hiệu Check',
  title_en: 'Brand Differentiation Check',
  description_vi: 'Trong thị trường nha khoa cạnh tranh gay gắt, điều khiến bệnh nhân chọn bạn thay vì phòng khám bên cạnh là gì? Kiểm tra brand differentiation.',
  description_en: 'In a fiercely competitive dental market, what makes patients choose you over the clinic next door? Check your brand differentiation.',
  subtitle_vi: 'Đánh giá brand positioning và differentiation',
  subtitle_en: 'Assess brand positioning and differentiation',
  chapter_refs: ['Ch.BRAND'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 27,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Phân Biệt Thương Hiệu Check', intro_desc: 'Kiểm tra brand positioning và differentiation của phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Brand Differentiation Check', intro_desc: 'Check your clinic brand positioning and differentiation.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'brand', name_vi: 'Brand', name_en: 'Brand', question_ids: ['pb_q1', 'pb_q2', 'pb_q3', 'pb_q4', 'pb_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia branding nha khoa. Dựa trên kết quả Phân Biệt Thương Hiệu Check (điểm {{SCORE_BRAND}}/100 kèm 2 câu open-ended), phân tích brand positioning và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyến khích.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental branding expert. Based on the Brand Differentiation Check score ({{SCORE_BRAND}}/100 with 2 open-ended answers), analyze brand positioning and suggest 3 improvements. English, practical tone.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_BRAND}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày xây dựng brand differentiation.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_BRAND}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to build brand differentiation.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ BRAND DIFFERENTIATION',
      title_en: 'PART 1: BRAND DIFFERENTIATION EVALUATION',
      subtitle_vi: '5chiều đánh giá: positioning, identity, message, experience, và reputation.',
      subtitle_en: '5 evaluation dimensions: positioning, identity, message, experience, and reputation.',
      ref: 'Brand Differentiation',
      icon: 'diamond',
      questions: [
        { question_id: 'pb_q1', order_idx: 0, type: 'select', label_vi: 'Bạn có thể nói trong 30 giây điều khiến phòng khám khác biệt với các phòng khám khác trong khu vực không?', label_en: 'Can you explain in 30 seconds what makes your clinic different from others in the area?', scale_labels_vi: { '1': 'Không rõ điều gì khác biệt, giá là yếu tố chính', '2': 'Có một vài điều khác biệt nhưng chưa rõ ràng và nhất quán', '3': 'Có positioning rõ ràng nhưng chưa được truyền tải tốt', '4': 'Có positioning rõ ràng và nhất quán, đội ngũ có thể diễn đạt', '5': 'Brand positioning mạnh mẽ: tagline, USP rõ ràng, và được truyền tải trong mọi touchpoint' }, scale_labels_en: { '1': 'Unclear what is different, price is the main factor', '2': 'Have some differences but not clear and consistent', '3': 'Have clear positioning but not well communicated', '4': 'Clear and consistent positioning, team can articulate it', '5': 'Strong brand positioning: clear tagline, USP, and communicated across every touchpoint' }, dimension: 'brand' },
        { question_id: 'pb_q2', order_idx: 1, type: 'select', label_vi: 'Phòng khám có brand identity rõ ràng — logo, màu sắc, typography, giọng điệu — nhất quán trên mọi nơi không?', label_en: 'Does your clinic have a clear brand identity — logo, colors, typography, tone — consistent everywhere?', scale_labels_vi: { '1': 'Không có brand identity rõ ràng, mỗi nơi một kiểu', '2': 'Có logo nhưng không có brand guide hoặc không nhất quán', '3': 'Có brand identity cơ bản nhưng chưa được áp dụng nhất quán', '4': 'Có brand guide và được áp dụng nhất quán ở hầu hết các điểm chạm', '5': 'Brand identity toàn diện: logo + màu + typography + giọng điệu + template, nhất quán mọi nơi' }, scale_labels_en: { '1': 'No clear brand identity, different styles everywhere', '2': 'Have logo but no brand guide or not consistent', '3': 'Have basic brand identity but not consistently applied', '4': 'Brand guide and consistently applied at most touchpoints', '5': 'Comprehensive brand identity: logo + colors + typography + tone + templates, consistent everywhere' }, dimension: 'brand' },
        { question_id: 'pb_q3', order_idx: 2, type: 'select', label_vi: 'Khi bệnh nhân nhắc đến phòng khám của bạn, họ thường dùng từ gì để mô tả?', label_en: 'When patients talk about your clinic, what words do they usually use to describe it?', scale_labels_vi: { '1': 'Không biết, không có phản hồi cụ thể về brand', '2': 'Chỉ biết giá rẻ hoặc gần nhà', '3': 'Biết một vài đặc điểm nhưng không có narrative rõ ràng', '4': 'Có một số từ khóa mà bệnh nhân thường nhắc đến', '5': 'Brand perception mạnh mẽ: bệnh nhân có thể mô tả phòng khám bằng 3-5 từ cụ thể và tích cực' }, scale_labels_en: { '1': 'Do not know, no specific feedback about brand', '2': 'Only know cheap or close to home', '3': 'Know some features but no clear narrative', '4': 'Have some keywords patients frequently mention', '5': 'Strong brand perception: patients can describe the clinic with 3-5 specific positive words' }, dimension: 'brand' },
        { question_id: 'pb_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có Unique Selling Proposition (USP) — một lợi thế cạnh tranh rõ ràng mà đối thủ khó sao chép — không?', label_en: 'Does your clinic have a Unique Selling Proposition (USP) — a clear competitive advantage that competitors cannot easily copy?', scale_labels_vi: { '1': 'Không có USP, cạnh tranh hoàn toàn bằng giá', '2': 'Có một vài lợi thế nhưng đối thủ có thể dễ dàng sao chép', '3': 'Có USP tiềm năng nhưng chưa được khai thác và truyền thông', '4': 'Có USP rõ ràng và được truyền thông đến bệnh nhân', '5': 'USP mạnh mẽ và bền vững: dịch vụ đặc biệt, công nghệ độc quyền, hoặc thương hiệu cá nhân mạnh' }, scale_labels_en: { '1': 'No USP, competing entirely on price', '2': 'Have some advantages but competitors can easily copy', '3': 'Have potential USP but not yet exploited and communicated', '4': 'Have clear USP and communicated to patients', '5': 'Strong and sustainable USP: special service, proprietary technology, or strong personal brand' }, dimension: 'brand' },
        { question_id: 'pb_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có storytelling — câu chuyện về tại sao bạn làm nghề và tại sao bệnh nhân nên chọn bạn — không?', label_en: 'Does your clinic have storytelling — a story about why you do dentistry and why patients should choose you?', scale_labels_vi: { '1': 'Không có storytelling, chỉ quảng bá dịch vụ', '2': 'Có một câu chuyện nhưng chưa được viết rõ và nhất quán', '3': 'Có storytelling cơ bản được chia sẻ bằng miệng', '4': 'Có storytelling rõ ràng được truyền tải qua nhiều kênh', '5': 'Storytelling mạnh mẽ: origin story + patient transformation stories + consistent narrative across all channels' }, scale_labels_en: { '1': 'No storytelling, only promoting services', '2': 'Have a story but not written clearly and consistently', '3': 'Have basic storytelling shared verbally', '4': 'Clear storytelling communicated through many channels', '5': 'Strong storytelling: origin story + patient transformation stories + consistent narrative across all channels' }, dimension: 'brand' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào brand positioning.',
      subtitle_en: 'Two open questions to look deeply into brand positioning.',
      ref: 'Brand Differentiation',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'pb_open1', order_idx: 0, type: 'textarea', label_vi: 'Khi bạn nói "đây là phòng khám của tôi" — điều gì khiến nó đáng tự hào và khác biệt?', label_en: 'When you say "this is my clinic" — what makes it worth being proud of and different?', placeholder_vi: 'Nghĩ về điều đặc biệt nhất ở phòng khám — có thể là kỹ năng đặc biệt, dịch vụ khách hàng, công nghệ, con người, hay triết lý.', placeholder_en: 'Think about the most special thing about your clinic — it could be special skills, customer service, technology, people, or philosophy.' },
        { question_id: 'pb_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu một phòng khám mới mở ngay cạnh bạn với giá rẻ hơn 30%, bạn sẽ làm gì để giữ bệnh nhân?', label_en: 'If a new clinic opened right next to you with 30% lower prices, what would you do to retain patients?', placeholder_vi: 'Nghĩ về những thứ KHÔNG thể sao chép bằng tiền — niềm tin, mối quan hệ, thương hiệu, hay trải nghiệm mà bạn đã xây dựng.', placeholder_en: 'Think about things that CANNOT be copied with money — trust, relationships, brand, or experience that you have built.' },
      ],
    },
  ],
};
