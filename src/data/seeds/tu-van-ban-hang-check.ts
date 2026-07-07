// Seed: Tư Vấn Bán Hàng Check — kỹ năng tư vấn và chốt deal (order 28)
// Free scanner (is_free: 1), đánh giá kỹ năng tư vấn bán hàng của nhân viên.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const TU_VAN_BAN_HANG_CHECK_SEED: SeedScanner = {
  id: 'tu-van-ban-hang-check',
  slug: 'tu-van-ban-hang-check',
  title_vi: 'Tư Vấn Bán Hàng Check',
  title_en: 'Sales & Consultation Check',
  description_vi: 'Nhiều phòng khám mất bệnh nhân vì nhân viên không biết cách tư vấn và chốt deal hiệu quả. Kiểm tra kỹ năng bán hàng của đội ngũ.',
  description_en: 'Many clinics lose patients because staff do not know how to consult and close deals effectively. Check your team sales skills.',
  subtitle_vi: 'Đánh giá kỹ năng tư vấn và chốt deal',
  subtitle_en: 'Assess consultation and closing skills',
  chapter_refs: ['Ch.CSKH'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 28,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Tư Vấn Bán Hàng Check', intro_desc: 'Kiểm tra kỹ năng tư vấn và chốt deal của đội ngũ.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Sales & Consultation Check', intro_desc: 'Check your team consultation and closing skills.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'sales', name_vi: 'Tư vấn bán hàng', name_en: 'Sales & Consultation', question_ids: ['tv_q1', 'tv_q2', 'tv_q3', 'tv_q4', 'tv_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia bán hàng nha khoa. Dựa trên kết quả Tư Vấn Bán Hàng Check (điểm {{SCORE_SALES}}/100 kèm 2 câu open-ended), phân tích kỹ năng tư vấn và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyến khích.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental sales expert. Based on the Sales & Consultation Check score ({{SCORE_SALES}}/100 with 2 open-ended answers), analyze consultation skills and suggest 3 improvements. English, practical tone.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_SALES}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày cải thiện kỹ năng tư vấn bán hàng.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_SALES}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to improve consultation and sales skills.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ KỸ NĂNG TƯ VẤN',
      title_en: 'PART 1: CONSULTATION SKILLS EVALUATION',
      subtitle_vi: '5 chiều đánh giá: lắng nghe, hiểu nhu cầu, giải pháp, chốt deal, và theo dõi.',
      subtitle_en: '5 evaluation dimensions: listening, understanding needs, solution, closing, and follow-up.',
      ref: 'Tư Vấn Bán Hàng',
      icon: 'handshake',
      questions: [
        { question_id: 'tv_q1', order_idx: 0, type: 'select', label_vi: 'Nhân viên có thường xuyên lắng nghe để hiểu nhu cầu thực sự của bệnh nhân trước khi đề xuất điều trị không?', label_en: 'Do staff regularly listen to understand the real needs of patients before proposing treatment?', scale_labels_vi: { '1': 'Thường nhảy vào đề xuất điều trị trước khi hiểu nhu cầu', '2': 'Đôi khi lắng nghe nhưng thường quên hỏi về nhu cầu thực sự', '3': 'Lắng nghe tương đối nhưng chưa có quy trình cụ thể', '4': 'Có kỹ thuật lắng nghe chủ động, hỏi câu hỏi mở để hiểu nhu cầu', '5': 'Quy trình lắng nghe chuẩn: câu hỏi mở + paraphrasing + empathy + needs identification' }, scale_labels_en: { '1': 'Usually jumping to propose treatment before understanding needs', '2': 'Sometimes listen but often forget to ask about real needs', '3': 'Relatively listening but no specific process', '4': 'Active listening techniques, asking open questions to understand needs', '5': 'Standard listening process: open questions + paraphrasing + empathy + needs identification' }, dimension: 'sales' },
        { question_id: 'tv_q2', order_idx: 1, type: 'select', label_vi: 'Nhân viên có biết cách trình bày giá và các phương án điều trị một cách rõ ràng, không gây áp lực không?', label_en: 'Do staff know how to present prices and treatment options clearly without pressure?', scale_labels_vi: { '1': 'Thường nói giá một cách đột ngột, gây áp lực cho bệnh nhân', '2': 'Trình bày giá nhưng không có cấu trúc hoặc không rõ ràng', '3': 'Có trình bày giá cơ bản nhưng chưa đủ chuyên nghiệp', '4': 'Có kịch bản trình bày giá rõ ràng, minh bạch, và không gây áp lực', '5': 'Quy trình trình bày giá chuyên nghiệp: value framing + transparent pricing + multiple options + no pressure' }, scale_labels_en: { '1': 'Usually announce price abruptly, causing patient pressure', '2': 'Present price but no structure or unclear', '3': 'Basic price presentation but not professional enough', '4': 'Clear pricing presentation script, transparent, no pressure', '5': 'Professional pricing process: value framing + transparent pricing + multiple options + no pressure' }, dimension: 'sales' },
        { question_id: 'tv_q3', order_idx: 2, type: 'select', label_vi: 'Nhân viên có kỹ năng xử lý objection — khi bệnh nhân nói "giá cao", "cần suy nghĩ", hoặc "đi đâu khám thêm" — không?', label_en: 'Do staff have objection handling skills — when patients say "too expensive", "need to think", or "will check elsewhere"?', scale_labels_vi: { '1': 'Không biết xử lý objection, thường để bệnh nhân ra về khi gặp phản đối', '2': 'Cố gắng thuyết phục bằng cách giảm giá ngay', '3': 'Biết một vài cách xử lý nhưng chưa có hệ thống', '4': 'Có kỹ thuật xử lý objection cơ bản được đào tạo', '5': 'Quy trình xử lý objection chuẩn: acknowledge + explore + address + confirm understanding' }, scale_labels_en: { '1': 'Do not know how to handle objections, usually let patients leave when faced with resistance', '2': 'Try to convince by reducing price immediately', '3': 'Know some ways but no system', '4': 'Basic objection handling techniques trained', '5': 'Standard objection handling process: acknowledge + explore + address + confirm understanding' }, dimension: 'sales' },
        { question_id: 'tv_q4', order_idx: 3, type: 'select', label_vi: 'Nhân viên có follow-up — liên hệ lại bệnh nhân sau khi họ ra về mà chưa quyết định — không?', label_en: 'Do staff follow up — contact patients after they leave without deciding?', scale_labels_vi: { '1': 'Không bao giờ follow-up, bệnh nhân ra về là thôi', '2': 'Thỉnh thoảng follow-up một cách không có hệ thống', '3': 'Có follow-up nhưng không có quy trình cụ thể và timing', '4': 'Có hệ thống follow-up: kịch bản gọi lại + timing chuẩn + CRM tracking', '5': 'Follow-up chiến lược: multi-channel (call + message + email) + timing tối ưu + personalization + tracking' }, scale_labels_en: { '1': 'Never follow up, patients leave and that is it', '2': 'Occasionally follow up without a system', '3': 'Follow up but no specific process and timing', '4': 'Follow-up system: call script + standard timing + CRM tracking', '5': 'Strategic follow-up: multi-channel (call + message + email) + optimal timing + personalization + tracking' }, dimension: 'sales' },
        { question_id: 'tv_q5', order_idx: 4, type: 'select', label_vi: 'Nhân viên được đào tạo về kỹ năng bán hàng và tư vấn nha khoa không?', label_en: 'Are staff trained in dental sales and consultation skills?', scale_labels_vi: { '1': 'Không có đào tạo bán hàng, ai tự làm theo cách của mình', '2': 'Đào tạo sơ lược về sản phẩm/dịch vụ nhưng không có kỹ năng bán hàng', '3': 'Có một vài buổi đào tạo nhưng không thường xuyên và không có thực hành', '4': 'Đào tạo bán hàng thường xuyên với role-play và feedback', '5': 'Chương trình đào tạo chuyên nghiệp: onboarding + ongoing training + role-play + coaching + KPI tracking' }, scale_labels_en: { '1': 'No sales training, everyone does it their own way', '2': 'Brief product/service training but no sales skills', '3': 'Some training sessions but not regular and no practice', '4': 'Regular sales training with role-play and feedback', '5': 'Professional training program: onboarding + ongoing training + role-play + coaching + KPI tracking' }, dimension: 'sales' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào kỹ năng bán hàng.',
      subtitle_en: 'Two open questions to look deeply into sales skills.',
      ref: 'Tư Vấn Bán Hàng',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'tv_open1', order_idx: 0, type: 'textarea', label_vi: 'Kể về một tình huống khi nhân viên mất bệnh nhân vì không chốt được deal. Điều gì đã xảy ra?', label_en: 'Describe a situation when a staff member lost a patient because they could not close the deal. What happened?', placeholder_vi: 'Nghĩ về một ca cụ thể. Bệnh nhân có vẻ quan tâm nhưng cuối cùng không làm. Điều gì có thể đã làm khác đi?', placeholder_en: 'Think about a specific case. The patient seemed interested but ultimately did not proceed. What could have been done differently?' },
        { question_id: 'tv_open2', order_idx: 1, type: 'textarea', label_vi: 'Bạn nghĩ nhân viên của bạn sợ điều gì nhất khi tư vấn bán hàng? Điều gì ngăn cản họ chốt deal tự tin?', label_en: 'What do you think your staff fears the most when consulting and selling? What prevents them from closing deals confidently?', placeholder_vi: 'Nghĩ về những rào cản tâm lý: sợ bệnh nhân không thích, sợ bị coi là "bán hàng", hay thiếu kiến thức về sản phẩm?', placeholder_en: 'Think about psychological barriers: fear of patient disapproval, fear of being seen as "selling", or lack of product knowledge?' },
      ],
    },
  ],
};
