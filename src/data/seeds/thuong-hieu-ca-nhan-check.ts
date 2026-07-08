// Seed: Thương Hiệu Cá Nhân Check — đánh giá personal branding của chủ phòng khám (order 32)
// Free scanner (is_free: 1), đánh giá personal branding và authority của chủ phòng khám.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const THUONG_HIEU_CA_NHAN_CHECK_SEED: SeedScanner = {
  id: 'thuong-hieu-ca-nhan-check',
  slug: 'thuong-hieu-ca-nhan-check',
  title_vi: 'Thương Hiệu Cá Nhân Check',
  title_en: 'Personal Branding Check',
  description_vi: 'Trong thời đại mạng xã hội, thương hiệu cá nhân của chủ phòng khám là tài sản quý giá. Kiểm tra personal branding của bạn.',
  description_en: 'In the social media age, the personal brand of the clinic owner is a valuable asset. Check your personal branding.',
  subtitle_vi: 'Đánh giá personal branding và authority của chủ phòng khám',
  subtitle_en: 'Assess personal branding and authority of clinic owners',
  chapter_refs: ['Ch.BRAND'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 32,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Thương Hiệu Cá Nhân Check', intro_desc: 'Kiểm tra personal branding và authority của bạn.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Personal Branding Check', intro_desc: 'Check your personal branding and authority.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'personal', name_vi: 'Thương hiệu cá nhân', name_en: 'Personal Brand', question_ids: ['thcn_q1', 'thcn_q2', 'thcn_q3', 'thcn_q4', 'thcn_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia personal branding nha khoa. Dựa trên kết quả Thương Hiệu Cá Nhân Check (điểm {{SCORE_PERSONAL}}/100 kèm 2 câu open-ended), phân tích personal branding và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyẾn khích.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental personal branding expert. Based on the Personal Branding Check score ({{SCORE_PERSONAL}}/100 with 2 open-ended answers), analyze personal branding and suggest 3 improvements. English, practical tone.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_PERSONAL}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày xây dựng thương hiệu cá nhân.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_PERSONAL}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to build personal branding.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ THƯƠNG HIỆU CÁ NHÂN',
      title_en: 'PART 1: PERSONAL BRANDING EVALUATION',
      subtitle_vi: '5 chiều đánh giá: online presence, content, authority, network, và consistency.',
      subtitle_en: '5 evaluation dimensions: online presence, content, authority, network, and consistency.',
      ref: 'Thương Hiệu Cá Nhân',
      icon: 'person',
      questions: [
        { question_id: 'thcn_q1', order_idx: 0, type: 'select', label_vi: 'Bạn có online presence cá nhân mạnh — profile, hình ảnh chuyên nghiệp, và thông điệp rõ ràng — không?', label_en: 'Do you have a strong personal online presence — profile, professional photos, and clear messaging?', scale_labels_vi: { '1': 'Không có online presence cá nhân, hoàn toàn ẩn danh', '2': 'Có một vài tài khoản nhưng không được chăm chút', '3': 'Có online presence cơ bản với thông tin chính', '4': 'Online presence tốt: profile đầy đủ, hình ảnh chuyên nghiệp, thông điệp nhất quán', '5': 'Personal brand presence mạnh: consistent across platforms, professional photography, clear positioning statement' }, scale_labels_en: { '1': 'No personal online presence, completely anonymous', '2': 'Have some accounts but not well maintained', '3': 'Basic online presence with main information', '4': 'Good online presence: complete profile, professional photos, consistent messaging', '5': 'Strong personal brand presence: consistent across platforms, professional photography, clear positioning statement' }, dimension: 'personal' },
        { question_id: 'thcn_q2', order_idx: 1, type: 'select', label_vi: 'Bạn có chia sẻ nội dung chuyên môn — kiến thức nha khoa, case studies, insights — để xây dựng authority không?', label_en: 'Do you share professional content — dental knowledge, case studies, insights — to build authority?', scale_labels_vi: { '1': 'Không chia sẻ nội dung, không muốn công khai', '2': 'Thỉnh thoảng chia sẻ nhưng không có hệ thống', '3': 'Chia sẻ nội dung đều đặn nhưng chưa có chiến lược rõ ràng', '4': 'Content strategy hiệu quả: educational content + case studies + personal insights', '5': 'Authority content engine: consistent educational content + thought leadership + patient education + industry recognition' }, scale_labels_en: { '1': 'Do not share content, do not want to be public', '2': 'Occasionally share but no system', '3': 'Regular content sharing but no clear strategy', '4': 'Effective content strategy: educational content + case studies + personal insights', '5': 'Authority content engine: consistent educational content + thought leadership + patient education + industry recognition' }, dimension: 'personal' },
        { question_id: 'thcn_q3', order_idx: 2, type: 'select', label_vi: 'Bạn được công nhận là chuyên gia trong lĩnh vực nha khoa — bởi bệnh nhân, đồng nghiệp, hay cộng đồng — không?', label_en: 'Are you recognized as an expert in dentistry — by patients, peers, or the community?', scale_labels_vi: { '1': 'Không có recognition, chỉ là bác sĩ bình thường', '2': 'Được một số bệnh nhân biết đến nhưng không phải expert', '3': 'Có danh tiếng địa phương trong cộng đồng', '4': 'Được công nhận là chuyên gia trong một lĩnh vực chuyên môn cụ thể', '5': 'Thought leader: speaking engagements + publications + media coverage + professional awards' }, scale_labels_en: { '1': 'No recognition, just a regular doctor', '2': 'Known by some patients but not seen as an expert', '3': 'Have local reputation in the community', '4': 'Recognized as an expert in a specific professional area', '5': 'Thought leader: speaking engagements + publications + media coverage + professional awards' }, dimension: 'personal' },
        { question_id: 'thcn_q4', order_idx: 3, type: 'select', label_vi: 'Bạn có mạng lưới quan hệ mạnh — kết nối với các chuyên gia khác, tham gia cộng đồng nha khoa, xây dựng referral network — không?', label_en: 'Do you have a strong network — connections with other professionals, dental community involvement, referral network building?', scale_labels_vi: { '1': 'Không quan tâm đến networking, chỉ tập trung công việc', '2': 'Có một vài mối quan hệ nhưng không chủ động xây dựng', '3': 'Tham gia một vài cộng đồng nhưng chưa tích cực', '4': 'Chủ động xây dựng network: cộng đồng + referral partners + professional associations', '5': 'Strategic networking: mastermind groups + cross-referrals + industry events + mentorship network' }, scale_labels_en: { '1': 'Not interested in networking, only focused on work', '2': 'Have a few relationships but not proactively building', '3': 'Participating in some communities but not actively', '4': 'Proactively building network: communities + referral partners + professional associations', '5': 'Strategic networking: mastermind groups + cross-referrals + industry events + mentorship network' }, dimension: 'personal' },
        { question_id: 'thcn_q5', order_idx: 4, type: 'select', label_vi: 'Thông điệp và hình ảnh cá nhân của bạn có nhất quán trên mọi nền tảng và trong mọi tương tác không?', label_en: 'Is your personal messaging and image consistent across all platforms and in every interaction?', scale_labels_vi: { '1': 'Không quan tâm đến consistency, cứ tự nhiên', '2': 'Tương đối nhất quán nhưng không cố ý', '3': 'Có cố gắng nhất quán nhưng chưa có hệ thống', '4': 'Nhất quán tốt: messaging + visual identity + tone of voice', '5': 'Hoàn toàn nhất quán: personal brand guidelines + consistent storytelling + authentic presence' }, scale_labels_en: { '1': 'Not concerned about consistency, just being natural', '2': 'Relatively consistent but not intentional', '3': 'Trying to be consistent but no system', '4': 'Good consistency: messaging + visual identity + tone of voice', '5': 'Fully consistent: personal brand guidelines + consistent storytelling + authentic presence' }, dimension: 'personal' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào thương hiệu cá nhân.',
      subtitle_en: 'Two open questions to look deeply into your personal branding.',
      ref: 'Thương Hiệu Cá Nhân',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'thcn_open1', order_idx: 0, type: 'textarea', label_vi: 'Khi ai đó nhắc đến tên bạn trong cộng đồng nha khoa, họ thường nói gì về bạn? Điều đó có đúng với cách bạn muốn được nhìn nhận không?', label_en: 'When someone mentions your name in the dental community, what do they usually say about you? Does that match how you want to be perceived?', placeholder_vi: 'Nghĩ về "word of mouth" về bạn trong cộng đồng. Bệnh nhân, đồng nghiệp, và đối tác nói gì về bạn khi bạn không ở đó?', placeholder_en: 'Think about "word of mouth" about you in the community. What do patients, peers, and partners say about you when you are not there?' },
        { question_id: 'thcn_open2', order_idx: 1, type: 'textarea', label_vi: 'Bạn đã đầu tư bao nhiêu thời gian và nỗ lực vào việc xây dựng thương hiệu cá nhân? Bạn thấy kết quả như thế nào?', label_en: 'How much time and effort have you invested in building personal branding? How do you see the results?', placeholder_vi: 'Nghĩ về ROI của personal branding — có mang lại bệnh nhân mới, referral, hay cơ hội kinh doanh không? Điều gì đã hiệu quả và chưa hiệu quả?', placeholder_en: 'Think about the ROI of personal branding — does it bring new patients, referrals, or business opportunities? What has worked and what has not?' },
      ],
    },
  ],
};
