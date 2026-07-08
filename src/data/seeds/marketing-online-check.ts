// Seed: Marketing Online Check — đánh giá digital presence và online presence (order 29)
// Free scanner (is_free: 1), đánh giá digital marketing và online presence.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const MARKETING_ONLINE_CHECK_SEED: SeedScanner = {
  id: 'marketing-online-check',
  slug: 'marketing-online-check',
  title_vi: 'Marketing Online Check',
  title_en: 'Online Marketing Check',
  description_vi: 'Bệnh nhân tìm bạn trên Google, Facebook, TikTok như thế nào? Kiểm tra digital presence của phòng khám.',
  description_en: 'How do patients find you on Google, Facebook, TikTok? Check your clinic digital presence.',
  subtitle_vi: 'Đánh giá digital presence và online marketing',
  subtitle_en: 'Assess digital presence and online marketing',
  chapter_refs: ['Ch.BRAND'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 29,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Marketing Online Check', intro_desc: 'Kiểm tra digital presence và online marketing của phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Online Marketing Check', intro_desc: 'Check your clinic digital presence and online marketing.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'digital', name_vi: 'Digital presence', name_en: 'Digital Presence', question_ids: ['mo_q1', 'mo_q2', 'mo_q3', 'mo_q4', 'mo_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia digital marketing nha khoa. Dựa trên kết quả Marketing Online Check (điểm {{SCORE_DIGITAL}}/100 kèm 2 câu open-ended), phân tích digital presence và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyẾn khích.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental digital marketing expert. Based on the Online Marketing Check score ({{SCORE_DIGITAL}}/100 with 2 open-ended answers), analyze digital presence and suggest 3 improvements. English, practical tone.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_DIGITAL}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày cải thiện digital presence.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_DIGITAL}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to improve digital presence.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ DIGITAL PRESENCE',
      title_en: 'PART 1: DIGITAL PRESENCE EVALUATION',
      subtitle_vi: '5 chiều đánh giá: website, Google, social media, content, và reputation.',
      subtitle_en: '5 evaluation dimensions: website, Google, social media, content, and reputation.',
      ref: 'Marketing Online',
      icon: 'language',
      questions: [
        { question_id: 'mo_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám có website riêng chuyên nghiệp không? Website đó tối ưu cho di động và có thông tin đầy đủ không?', label_en: 'Does your clinic have a professional website? Is it mobile-optimized and has complete information?', scale_labels_vi: { '1': 'Không có website hoặc website rất sơ sài', '2': 'Có website nhưng thiếu thông tin, không được cập nhật', '3': 'Có website cơ bản với thông tin chính', '4': 'Website tốt: thông tin đầy đủ, mobile-friendly, fast loading', '5': 'Website xuất sắc: SEO tốt, booking online, patient education content, testimonials' }, scale_labels_en: { '1': 'No website or very basic website', '2': 'Has website but missing information, not updated', '3': 'Basic website with main information', '4': 'Good website: complete info, mobile-friendly, fast loading', '5': 'Excellent website: good SEO, online booking, patient education content, testimonials' }, dimension: 'digital' },
        { question_id: 'mo_q2', order_idx: 1, type: 'select', label_vi: 'Phòng khám có Google Business Profile và được quản lý tốt không?', label_en: 'Does your clinic have a Google Business Profile and is it well managed?', scale_labels_vi: { '1': 'Không có Google Business Profile', '2': 'Có nhưng thông tin không đầy đủ và không được cập nhật', '3': 'Có Google Business Profile với thông tin cơ bản được cập nhật', '4': 'Google Business Profile tốt: thông tin đầy đủ, hình ảnh, review được trả lời', '5': 'Google Business Profile xuất sắc: posts thường xuyên, reviews cao, Q&A active, photos updated' }, scale_labels_en: { '1': 'No Google Business Profile', '2': 'Has one but information incomplete and not updated', '3': 'Google Business Profile with basic updated information', '4': 'Good Google Business Profile: complete info, photos, reviews responded to', '5': 'Excellent Google Business Profile: regular posts, high reviews, active Q&A, photos updated' }, dimension: 'digital' },
        { question_id: 'mo_q3', order_idx: 2, type: 'select', label_vi: 'Phòng khám có active trên mạng xã hội không? Nội dung có được đăng đều đặn và chất lượng không?', label_en: 'Is your clinic active on social media? Is content posted regularly and of good quality?', scale_labels_vi: { '1': 'Không có mạng xã hội hoặc có nhưng bỏ hoang', '2': 'Có social media nhưng đăng không đều và nội dung yếu', '3': 'Đăng nội dung tương đối đều nhưng chưa có chiến lược rõ ràng', '4': 'Active trên 1-2 nền tảng với nội dung có chiến lược', '5': 'Multi-platform presence với content strategy: educational + engagement + community building' }, scale_labels_en: { '1': 'No social media or abandoned accounts', '2': 'Has social media but posting inconsistent and weak content', '3': 'Relatively regular posting but no clear strategy', '4': 'Active on 1-2 platforms with strategic content', '5': 'Multi-platform presence with content strategy: educational + engagement + community building' }, dimension: 'digital' },
        { question_id: 'mo_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có online reputation tốt — reviews, testimonials — không?', label_en: 'Does your clinic have good online reputation — reviews, testimonials?', scale_labels_vi: { '1': 'Không có reviews hoặc toàn review tiêu cực', '2': 'Ít reviews và chưa chủ động thu thập testimonials', '3': 'Có reviews tích cực nhưng chưa chủ động xây dựng', '4': 'Chủ động thu thập reviews và có chiến lược xây dựng reputation', '5': 'Reputation system: chủ động thu thập, phản hồi tất cả reviews, showcase testimonials' }, scale_labels_en: { '1': 'No reviews or all negative reviews', '2': 'Few reviews and not proactively collecting testimonials', '3': 'Have positive reviews but not proactively building', '4': 'Proactively collecting reviews and building reputation strategy', '5': 'Reputation system: proactive collection, respond to all reviews, showcase testimonials' }, dimension: 'digital' },
        { question_id: 'mo_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có chiến lược digital marketing rõ ràng — biết đối tượng mục tiêu, kênh ưu tiên, và content plan — không?', label_en: 'Does your clinic have a clear digital marketing strategy — target audience, priority channels, and content plan?', scale_labels_vi: { '1': 'Không có chiến lược digital marketing, cứ đăng gì thì đăng', '2': 'Có một vài nỗ lực digital nhưng không có chiến lược', '3': 'Có hiểu biết cơ bản nhưng chưa có kế hoạch cụ thể', '4': 'Có chiến lược digital marketing cơ bản với target audience và kênh ưu tiên', '5': 'Chiến lược digital toàn diện: audience segmentation, content calendar, channel strategy, analytics' }, scale_labels_en: { '1': 'No digital marketing strategy, posting whatever', '2': 'Some digital efforts but no strategy', '3': 'Basic understanding but no specific plan', '4': 'Basic digital marketing strategy with target audience and priority channels', '5': 'Comprehensive digital strategy: audience segmentation, content calendar, channel strategy, analytics' }, dimension: 'digital' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào digital presence.',
      subtitle_en: 'Two open questions to look deeply into your digital presence.',
      ref: 'Marketing Online',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'mo_open1', order_idx: 0, type: 'textarea', label_vi: 'Khi một bệnh nhân mới tìm phòng khám nha khoa trên Google, điều gì khiến họ chọn bạn thay vì đối thủ? Điều đó có hiển thị online không?', label_en: 'When a new patient searches for a dental clinic on Google, what makes them choose you over a competitor? Is that reflected online?', placeholder_vi: 'Nghĩ về "why us" của phòng khám. Nếu bạn là bệnh nhân tìm kiếm online, bạn sẽ thấy điều đó ở đâu trên internet?', placeholder_en: 'Think about the "why us" of your clinic. If you were a patient searching online, where would you see that on the internet?' },
        { question_id: 'mo_open2', order_idx: 1, type: 'textarea', label_vi: 'Bạn đã thử những kênh digital marketing nào? Kênh nào hiệu quả nhất và kênh nào chưa hoạt động tốt?', label_en: 'What digital marketing channels have you tried? Which works best and which has not performed well?', placeholder_vi: 'Liệt kê: Facebook, Google Ads, TikTok, Website, Zalo OA, SEO... Đâu là kênh mang lại bệnh nhân thực sự?', placeholder_en: 'List: Facebook, Google Ads, TikTok, Website, Zalo OA, SEO... Which channel brings real patients?' },
      ],
    },
  ],
};
