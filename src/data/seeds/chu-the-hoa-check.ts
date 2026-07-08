// Seed: Chủ Thể Hóa Check — biến bệnh nhân thành người tham gia chủ động (order 19)
// Free scanner (is_free: 1), lead magnet về patient engagement và treatment acceptance.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const CHU_THE_HOA_CHECK_SEED: SeedScanner = {
  id: 'chu-the-hoa-check',
  slug: 'chu-the-hoa-check',
  title_vi: 'Chủ Thể Hóa Check',
  title_en: 'Patient Agency Check',
  description_vi: 'Bệnh nhân không phải đối tượng thụ động — họ là đối tác chủ động trong hành trình sức khỏe. Kiểm tra mức độ "chủ thể hóa" phòng khám.',
  description_en: 'Patients are not passive subjects — they are active partners in their health journey. Check your clinic\'s level of "patient agency".',
  subtitle_vi: 'Mức độ chủ thể hóa bệnh nhân trong phòng khám',
  subtitle_en: 'Level of patient agency in your clinic',
  chapter_refs: ['Ch.PATIENT'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 19,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Chủ Thể Hóa Check', intro_desc: 'Bệnh nhân là đối tác chủ động, không phải đối tượng thụ động.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Patient Agency Check', intro_desc: 'Patients are active partners, not passive subjects.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'agency', name_vi: 'Chủ thể hóa', name_en: 'Patient Agency', question_ids: ['ct_q1', 'ct_q2', 'ct_q3', 'ct_q4', 'ct_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Chủ Thể Hóa Check (điểm {{SCORE_AGENCY}}/100 kèm 2 câu open-ended), phân tích mức độ biến bệnh nhân thành người tham gia chủ động và đưa ra 3 gợi ý. Dùng tiếng Việt, giọng nhẹ nhàng, trân trọng. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant. Based on the Patient Agency Check score ({{SCORE_AGENCY}}/100 with 2 open-ended answers), analyze the level of patient agency and suggest 3 improvements. English, gentle and respectful tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_AGENCY}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo kế hoạch 30 ngày tăng cường chủ thể hóa bệnh nhân.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, trân trọng\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_AGENCY}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to increase patient agency.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and respectful tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ CHỦ THỂ HÓA',
      title_en: 'PART 1: PATIENT AGENCY EVALUATION',
      subtitle_vi: '5chiều đánh giá: thông tin, lựa chọn, hợp tác, theo dõi, và phản hồi.',
      subtitle_en: '5 evaluation dimensions: information, choice, cooperation, tracking, and feedback.',
      ref: 'Chủ thể hóa — Patient Agency',
      icon: 'person',
      questions: [
        { question_id: 'ct_q1', order_idx: 0, type: 'select', label_vi: 'Bệnh nhân được cung cấp thông tin đầy đủ về tình trạng răng miệng và các phương án điều trị theo cách dễ hiểu chưa?', label_en: 'Are patients provided with adequate information about their dental condition and treatment options in an easy-to-understand way?', scale_labels_vi: { '1': 'Ít thông tin, bệnh nhân không hiểu rõ tình trạng', '2': 'Có giải thích nhưng bệnh nhân vẫn khó hiểu', '3': 'Giải thích khá đầy đủ, một số bệnh nhân hiểu được', '4': 'Có tài liệu và giải thích rõ ràng, đa số bệnh nhân hiểu', '5': 'Hệ thống thông tin chuẩn: giải thích + tài liệu + hỏi đáp' }, scale_labels_en: { '1': 'Little information, patients don\'t understand their condition', '2': 'Explained but patients still find it confusing', '3': 'Fairly thorough explanation, some patients understand', '4': 'Clear documentation and explanation, most patients understand', '5': 'Standard info system: explanation + materials + Q&A' }, dimension: 'agency' },
        { question_id: 'ct_q2', order_idx: 1, type: 'select', label_vi: 'Bệnh nhân được tham gia vào quyết định điều trị — chọn phương án phù hợp với tình trạng và ngân sách của họ?', label_en: 'Are patients involved in treatment decisions — choosing options that fit their condition and budget?', scale_labels_vi: { '1': 'Bác sĩ quyết định đơn phương, bệnh nhân thụ động', '2': 'Ít khi đưa ra lựa chọn cho bệnh nhân', '3': 'Có đưa ra lựa chọn nhưng chưa rõ ràng và đầy đủ', '4': 'Đưa ra 2-3 phương án với ưu nhược điểm rõ ràng', '5': 'Quy trình shared decision-making chuẩn, bệnh nhân hiểu và tự chọn' }, scale_labels_en: { '1': 'Doctor decides unilaterally, patient is passive', '2': 'Rarely offering choices to patients', '3': 'Offering choices but not clear and comprehensive enough', '4': 'Offering 2-3 options with clear pros and cons', '5': 'Standard shared decision-making process, patient understands and chooses' }, dimension: 'agency' },
        { question_id: 'ct_q3', order_idx: 2, type: 'select', label_vi: 'Bệnh nhân được khuyẾn khích hỏi và bày tỏ lo ngại trước khi điều trị không?', label_en: 'Are patients encouraged to ask questions and express concerns before treatment?', scale_labels_vi: { '1': 'Không khuyẾn khích, bệnh nhân ngại hỏi', '2': 'Ngồi chờ bệnh nhân hỏi nhưng không chủ động tạo không khí', '3': 'Có chủ động mời hỏi một lần nhưng chưa tạo không khí thoải mái', '4': 'Tạo không khí thoải mái, chủ động hỏi bệnh nhân có thắc mắc gì', '5': 'Không gian chủ động hỏi — booking có reminder, check-in hỏi, bắt đầu treatment hỏi lại' }, scale_labels_en: { '1': 'Not encouraged, patients are hesitant to ask', '2': 'Waiting for patients to ask but not proactively creating space', '3': 'Inviting questions once but not creating comfortable atmosphere', '4': 'Creating comfortable atmosphere, proactively asking if patient has concerns', '5': 'Proactive-asking space — booking reminder, check-in question, pre-treatment re-check' }, dimension: 'agency' },
        { question_id: 'ct_q4', order_idx: 3, type: 'select', label_vi: 'Bệnh nhân được theo dõi và nhắc nhở về lịch điều trị, tái khám, và chăm sóc tại nhà không?', label_en: 'Are patients tracked and reminded about treatment schedules, follow-ups, and home care?', scale_labels_vi: { '1': 'Không theo dõi, bệnh nhân tự nhớ lịch', '2': 'Nhắc lịch khi bệnh nhân hỏi', '3': 'Nhắc lịch cho một số bệnh nhân quan trọng', '4': 'Có hệ thống theo dõi và nhắc nhở đều đặn', '5': 'Hệ thống theo dõi toàn diện: SMS/chat reminder, recall system, home care instructions' }, scale_labels_en: { '1': 'No tracking, patients remember appointments themselves', '2': 'Remind when patients ask', '3': 'Remind for some important patients only', '4': 'Regular tracking and reminder system', '5': 'Comprehensive tracking: SMS/chat reminders, recall system, home care instructions' }, dimension: 'agency' },
        { question_id: 'ct_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có thu thập và phản hồi từ bệnh nhân về trải nghiệm điều trị không?', label_en: 'Does your clinic collect and act on patient feedback about their treatment experience?', scale_labels_vi: { '1': 'Không thu thập phản hồi', '2': 'Thu thập nhưng không phân tích hay hành động', '3': 'Thu thập thỉnh thoảng, có cải thiện một số vấn đề', '4': 'Có hệ thống thu thập phản hồi và cải thiện thường xuyên', '5': 'Phản hồi bệnh nhân là driver cốt lõi — NPS, review, action loop' }, scale_labels_en: { '1': 'No patient feedback collection', '2': 'Collecting but not analyzing or acting on it', '3': 'Occasionally collecting, improving some issues', '4': 'Regular feedback collection and improvement system', '5': 'Patient feedback is core driver — NPS, reviews, action loop' }, dimension: 'agency' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào mối quan hệ với bệnh nhân.',
      subtitle_en: 'Two open questions to look deeply into your relationship with patients.',
      ref: 'Chủ thể hóa — Patient Agency',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'ct_open1', order_idx: 0, type: 'textarea', label_vi: 'Kể về một tình huống gần đây khi bệnh nhân chủ động hỏi nhiều hoặc đưa ra quyết định khác với đề xuất của bạn. Bạn phản ứng thế nào?', label_en: 'Describe a recent situation when a patient proactively asked many questions or made a different decision from your recommendation. How did you respond?', placeholder_vi: 'Nghĩ về một trải nghiệm gần đây. Bệnh nhân có chủ động tham gia không? Bạn cảm thấy thế nào khi họ đặt câu hỏi hay chọn khác?', placeholder_en: 'Think about a recent experience. Was the patient actively engaged? How did you feel when they asked questions or chose differently?' },
        { question_id: 'ct_open2', order_idx: 1, type: 'textarea', label_vi: 'Theo bạn, điều gì làm bệnh nhân cảm thấy "được trao quyền" (empowered) trong phòng khám nha khoa?', label_en: 'In your opinion, what makes patients feel "empowered" in a dental clinic?', placeholder_vi: 'Nghĩ về trải nghiệm của bệnh nhân từ khi họ đặt lịch đến khi ra về. Điều gì tạo ra cảm giác được trao quyền?', placeholder_en: 'Think about the patient experience from booking to leaving. What creates a sense of empowerment?' },
      ],
    },
  ],
};
