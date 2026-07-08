// Seed: Content Funnel Check — content marketing & patient acquisition funnel
// Free scanner (is_free: 1), lead magnet để thu hút phòng khám quan tâm marketing.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const CONTENT_FUNNEL_CHECK_SEED: SeedScanner = {
  id: 'content-funnel-check',
  slug: 'content-funnel-check',
  title_vi: 'Content Funnel Check',
  title_en: 'Content Funnel Check',
  description_vi: 'Content là cách tiếp cận bệnh nhân hiệu quả nhất hiện nay. 7 câu hỏi giúp bạn đánh giá chiến lược content của phòng khám.',
  description_en: 'Content is the most effective way to reach patients today. 7 questions to assess your clinic\'s content strategy.',
  subtitle_vi: 'Chẩn đoán nhanh chiến lược content marketing',
  subtitle_en: 'Quick diagnosis of your content marketing strategy',
  chapter_refs: ['Ch.7'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 12,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Content Funnel Check', intro_desc: 'Content là cách tiếp cận bệnh nhân hiệu quả nhất hiện nay. 7 câu hỏi giúp bạn đánh giá chiến lược content của phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Content Funnel Check', intro_desc: 'Content is the most effective way to reach patients today. 7 questions to assess your clinic\'s content strategy.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'content', name_vi: 'Chiến lược Content', name_en: 'Content Strategy', question_ids: ['cf_q1', 'cf_q2', 'cf_q3', 'cf_q4', 'cf_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Content Funnel Check (điểm {{SCORE_CONTENT}}/100 kèm 2 câu open-ended), phân tích chiến lược content marketing và đưa ra 3 hành động cải thiện content funnel. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the Content Funnel Check score ({{SCORE_CONTENT}}/100 with 2 open-ended answers), analyze content marketing strategy and suggest 3 improvements. English, candid and warm tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_CONTENT}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày để cải thiện content funnel.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_CONTENT}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan to improve your content funnel.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ CONTENT',
      title_en: 'PART 1: CONTENT EVALUATION',
      subtitle_vi: '5 chiều đánh giá: chiến lược, SEO, social media, email, và referral loop.',
      subtitle_en: '5 evaluation dimensions: strategy, SEO, social media, email, and referral loop.',
      ref: 'Ch.7 — Marketing Phòng Khám',
      icon: 'article',
      questions: [
        { question_id: 'cf_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám có chiến lược content (content strategy) rõ ràng với lịch đăng bài không?', label_en: 'Does your clinic have a clear content strategy with a posting schedule?', scale_labels_vi: { '1': 'Không có chiến lược, đăng bài tùy hứng', '2': 'Đăng bài đều nhưng không có chiến lược rõ', '3': 'Có lịch đăng bài cơ bản, chưa phân chia nội dung', '4': 'Có chiến lược content + lịch + phân chia chủ đề', '5': 'Content strategy đầy đủ: lịch, phân loại, KPIs, analytics' }, scale_labels_en: { '1': 'No strategy, posting ad-hoc', '2': 'Posting regularly but no clear strategy', '3': 'Basic posting schedule, no content segmentation', '4': 'Content strategy + schedule + topic segmentation', '5': 'Full content strategy: schedule, segmentation, KPIs, analytics' }, dimension: 'content' },
        { question_id: 'cf_q2', order_idx: 1, type: 'select', label_vi: 'Phòng khám có website với nội dung SEO (blog, bài viết, từ khóa) để bệnh nhân tìm thấy tự nhiên không?', label_en: 'Does your clinic website have SEO content (blog, articles, keywords) for organic discovery?', scale_labels_vi: { '1': 'Không có website hoặc website tĩnh không có nội dung', '2': 'Website có trang chủ nhưng không có nội dung SEO', '3': 'Có blog nhưng đăng bài không đều, SEO yếu', '4': 'Blog hoạt động + SEO cơ bản, có từ khóa target', '5': 'Website với content hub + SEO mạnh + local SEO + analytics' }, scale_labels_en: { '1': 'No website or static site with no content', '2': 'Website with homepage only, no SEO content', '3': 'Blog exists but irregular, weak SEO', '4': 'Active blog + basic SEO with target keywords', '5': 'Website with content hub + strong SEO + local SEO + analytics' }, dimension: 'content' },
        { question_id: 'cf_q3', order_idx: 2, type: 'select', label_vi: 'Phòng khám có sự hiện diện active trên mạng xã hội (Facebook, TikTok, YouTube) với nội dung giáo dục không?', label_en: 'Does your clinic have an active social media presence (Facebook, TikTok, YouTube) with educational content?', scale_labels_vi: { '1': 'Không có hoặc có nhưng bỏ bê', '2': 'Có Facebook nhưng chủ yếu quảng cáo, ít nội dung giá trị', '3': 'Active trên 1 nền tảng với nội dung giáo dục đều đặn', '4': 'Active trên 2+ nền tảng với content mix (giáo dục + entertainment)', '5': 'Đa nền tảng + content strategy + engagement cao + community' }, scale_labels_en: { '1': 'None or completely neglected', '2': 'Facebook only, mostly ads, little valuable content', '3': 'Active on 1 platform with regular educational content', '4': 'Active on 2+ platforms with content mix (educational + entertainment)', '5': 'Multi-platform + content strategy + high engagement + community' }, dimension: 'content' },
        { question_id: 'cf_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có hệ thống email nurture (bản tin, sequence, automated) để giữ liên lạc với bệnh nhân không?', label_en: 'Does your clinic have an email nurture system (newsletter, sequences, automated) to stay in touch with patients?', scale_labels_vi: { '1': 'Không có email marketing gì cả', '2': 'Có gửi tin nhắn Zalo/SMS nhưng không có email', '3': 'Có bản tin email thỉnh thoảng, không có sequence', '4': 'Có email list + bản tin đều đặn + basic automation', '5': 'Email marketing đầy đủ: list segmentation, drip campaigns, automation' }, scale_labels_en: { '1': 'No email marketing at all', '2': 'Zalo/SMS messages only, no email', '3': 'Irregular newsletter, no sequences', '4': 'Email list + regular newsletter + basic automation', '5': 'Full email marketing: list segmentation, drip campaigns, automation' }, dimension: 'content' },
        { question_id: 'cf_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có content referral loop (khuyẾn khích bệnh nhân chia sẻ, UGC, review) không?', label_en: 'Does your clinic have a content referral loop (encouraging patient sharing, UGC, reviews)?', scale_labels_vi: { '1': 'Không có gì để bệnh nhân chia sẻ', '2': 'Có một vài bài hay nhưng không khuyẾn khích chia sẻ', '3': 'Có chương trình xin review cơ bản', '4': 'Chủ động xin review + có UGC campaign + incentivize sharing', '5': 'Full referral content loop: UGC, reviews, testimonials, social sharing' }, scale_labels_en: { '1': 'Nothing for patients to share', '2': 'Some good content but no sharing encouragement', '3': 'Basic review request program', '4': 'Proactive review requests + UGC campaign + incentivized sharing', '5': 'Full referral content loop: UGC, reviews, testimonials, social sharing' }, dimension: 'content' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn vào thực tế content marketing.',
      subtitle_en: 'Two open questions to face your content marketing reality.',
      ref: 'Ch.7 — Marketing Phòng Khám',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'cf_open1', order_idx: 0, type: 'textarea', label_vi: 'Loại content nào (video, bài viết, hình ảnh, case study) đang mang lại phản hồi tốt nhất từ bệnh nhân? Kể một ví dụ cụ thể.', label_en: 'What type of content (video, article, image, case study) gets the best patient response? Give a specific example.', placeholder_vi: 'Mô tả loại content nào bệnh nhân tương tác nhiều nhất và tại sao.', placeholder_en: 'Describe which content type patients interact with most and why.' },
        { question_id: 'cf_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu bạn phải chọn 1 kênh content duy nhất để đầu tư trong 3 tháng tới, bạn sẽ chọn kênh nào? Tại sao kênh đó?', label_en: 'If you had to pick 1 single content channel to invest in for the next 3 months, which would it be? Why that channel?', placeholder_vi: 'Nghĩ về kênh nào có tiềm năng mang lại bệnh nhân mới với ít thời gian nhất.', placeholder_en: 'Think about which channel has the highest potential to bring new patients with the least time investment.' },
      ],
    },
  ],
};
