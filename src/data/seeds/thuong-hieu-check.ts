// Seed: Thương Hiệu Check — based on Tier 1, Ch.10
// Premium scanner, paid AI analysis (is_free: 0), status: active.
// 2 sections: 5 select (dimension) + 2 open-ended, bám sát Chương 10.

import type { SeedScanner } from './registry';

export const THUONG_HIEU_CHECK_SEED: SeedScanner = {
  id: 'thuong-hieu-check',
  slug: 'thuong-hieu-check',
  title_vi: 'Thương Hiệu Check',
  title_en: 'Brand Check',
  description_vi: 'Thương hiệu mạnh = bệnh nhân nhớ đến khi cần. 7 câu hỏi giúp bạn đánh giá mức độ nhận diện và uy tín thương hiệu phòng khám.',
  description_en: 'Strong brand = patients remember you when they need care. 7 questions to assess brand recognition and reputation.',
  subtitle_vi: 'Chẩn đoán nhanh theo Chương 10 — Xây Dựng Thương Hiệu',
  subtitle_en: 'Quick diagnosis based on Chapter 10 — Brand Building',
  chapter_refs: ['Ch.10'],
  status: 'active',
  is_free: 0,
  survey_type: 'mini',
  order_index: 10,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Thương Hiệu Check', intro_desc: 'Thương hiệu mạnh = bệnh nhân nhớ đến khi cần. 7 câu hỏi giúp bạn đánh giá mức độ nhận diện và uy tín thương hiệu phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Brand Check', intro_desc: 'Strong brand = patients remember you when they need care. 7 questions to assess brand recognition and reputation.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'brand', name_vi: 'Thương hiệu & Nhận diện', name_en: 'Brand & Recognition', question_ids: ['th_q1', 'th_q2', 'th_q3', 'th_q4', 'th_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Thương Hiệu Check (điểm {{SCORE_BRAND}}/100 kèm 2 câu open-ended), phân tích mức độ nhận diện thương hiệu và đưa ra 3 đề xuất xây dựng thương hiệu. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the Brand Check score ({{SCORE_BRAND}}/100 with 2 open-ended answers), analyze brand recognition and suggest 3 brand-building actions. English, candid and warm tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_THUONG_HIEU}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_THUONG_HIEU}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ THƯƠNG HIỆU',
      title_en: 'PART 1: BRAND EVALUATION',
      subtitle_vi: '5 chiều đánh giá: nhận diện, nhất quán, review, hiện diện online, và khác biệt hóa.',
      subtitle_en: '5 evaluation dimensions: recognition, consistency, reviews, online presence, and differentiation.',
      ref: 'Ch.10 — Xây Dựng Thương Hiệu',
      icon: 'stars',
      questions: [
        { question_id: 'th_q1', order_idx: 0, type: 'select', label_vi: 'Người trong khu vực (bán kính 5km) có biết phòng khám của bạn không?', label_en: 'Do people in your area (5km radius) know your clinic?', scale_labels_vi: { '1': 'Không ai biết, chưa ai nhắc', '2': 'Vài người quen biết', '3': 'Biết đến nhưng không nhớ rõ dịch vụ', '4': 'Nhớ tên + dịch vụ chính + vị trí', '5': 'Top-of-mind trong khu vực + NPS cao' }, scale_labels_en: { '1': 'Nobody knows, no referrals', '2': 'Some acquaintances know', '3': 'Heard of but unclear on services', '4': 'Remembers name + main services + location', '5': 'Top-of-mind in the area + high NPS' }, dimension: 'brand' },
        { question_id: 'th_q2', order_idx: 1, type: 'select', label_vi: 'Phòng khám có nhận diện thương hiệu (logo, màu sắc, slogan) nhất quán không?', label_en: 'Does your clinic have consistent brand identity (logo, colors, slogan)?', scale_labels_vi: { '1': 'Không có, mỗi nơi một kiểu', '2': 'Có logo cơ bản, không có guideline', '3': 'Có nhận diện cơ bản, dùng không nhất quán', '4': 'Brand guideline đầy đủ + nhất quán trên mọi touchpoint', '5': 'Professional brand identity + digital + offline consistency' }, scale_labels_en: { '1': 'No identity, everything inconsistent', '2': 'Basic logo, no guidelines', '3': 'Basic identity but inconsistently used', '4': 'Full brand guideline + consistent on all touchpoints', '5': 'Professional brand identity + digital + offline consistency' }, dimension: 'brand' },
        { question_id: 'th_q3', order_idx: 2, type: 'select', label_vi: 'Phòng khám có đánh giá / review online (Google, Facebook, Zalo) và quản lý không?', label_en: 'Does your clinic manage online reviews (Google, Facebook, Zalo)?', scale_labels_vi: { '1': 'Không có, không theo dõi', '2': 'Có ít review nhưng không trả lời', '3': 'Trả lời khi có review mới', '4': 'Chủ động xin review + trả lời tất cả + phân tích', '5': 'Full review management + sentiment analysis + proactive' }, scale_labels_en: { '1': 'No reviews, no tracking', '2': 'Some reviews but no responses', '3': 'Responds when new reviews appear', '4': 'Proactively asks for reviews + responds + analyzes', '5': 'Full review management + sentiment analysis + proactive' }, dimension: 'brand' },
        { question_id: 'th_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có sự hiện diện online (website, Google Business, mạng xã hội) mạnh không?', label_en: 'Does your clinic have a strong online presence (website, Google Business, social media)?', scale_labels_vi: { '1': 'Không có website / chỉ có trang Facebook cơ bản', '2': 'Website cơ bản + Facebook nhưng ít cập nhật', '3': 'Website + Google Business + Facebook active', '4': 'Full online presence + regular content + SEO', '5': 'Integrated digital brand + content strategy + analytics' }, scale_labels_en: { '1': 'No website / only basic Facebook page', '2': 'Basic website + Facebook but rarely updated', '3': 'Website + Google Business + active Facebook', '4': 'Full online presence + regular content + SEO', '5': 'Integrated digital brand + content strategy + analytics' }, dimension: 'brand' },
        { question_id: 'th_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có chiến lược xây dựng uy tín (educational content, KOL, partnership) để tạo niềm tin dài hạn không?', label_en: 'Does your clinic have a strategy to build credibility (educational content, KOL, partnerships) for long-term trust?', scale_labels_vi: { '1': 'Không có chiến lược này', '2': 'Có đôi chút nhưng không có chiến lược', '3': 'Có content đều đặn nhưng chưa có chiến lược rõ', '4': 'Chiến lược rõ + content + partnership', '5': 'Full authority building: content + community + thought leadership' }, scale_labels_en: { '1': 'No such strategy', '2': 'Some effort but no strategy', '3': 'Regular content but no clear strategy', '4': 'Clear strategy + content + partnerships', '5': 'Full authority building: content + community + thought leadership' }, dimension: 'brand' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn thẳng vào vị thế thương hiệu.',
      subtitle_en: 'Two open questions to face your brand position honestly.',
      ref: 'Ch.10 — Xây Dựng Thương Hiệu',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'th_open1', order_idx: 0, type: 'textarea', label_vi: 'Cạnh tranh trực tiếp với phòng khám nào trong khu vực và điều gì khiến bạn khác biệt? Điều gì khiến bệnh nhân chọn bạn thay vì đối thủ?',
          label_en: 'Who are your direct competitors in the area and what makes you different? What makes patients choose you over competitors?',
          placeholder_vi: 'Liệt kê 1-2 đối thủ chính và 1-2 điều khiến phòng khám của bạn khác biệt.',
          placeholder_en: 'List 1-2 main competitors and 1-2 things that make your clinic different.' },
        { question_id: 'th_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu bạn phải mô tả thương hiệu phòng khám bằng 3 từ, bạn sẽ chọn 3 từ nào? Những từ đó có đúng với thực tế không?',
          label_en: 'If you had to describe your clinic brand in 3 words, which 3 words would you choose? Do those words match reality?',
          placeholder_vi: 'Ví dụ: "Uy tín — Tận tâm — Chuyên nghiệp" — hãy đánh giá thực tế mỗi từ.',
          placeholder_en: 'e.g.: "Trusted — Caring — Professional" — rate how true each word is in reality.' },
      ],
    },
  ],
};
