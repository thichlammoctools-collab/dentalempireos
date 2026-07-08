// Seed: Cơ Sở Vật Chất Check — cơ sở vật chất và trải nghiệm bệnh nhân (order 26)
// Free scanner (is_free: 1), đánh giá cơ sở vật chất và không gian phòng khám.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const CO_SO_VAT_CHAT_CHECK_SEED: SeedScanner = {
  id: 'co-so-vat-chat-check',
  slug: 'co-so-vat-chat-check',
  title_vi: 'Cơ Sở Vật Chất Check',
  title_en: 'Facility Check',
  description_vi: 'Không gian phòng khám ảnh hưởng trực tiếp đến cảm nhận của bệnh nhân về chất lượng dịch vụ. Kiểm tra cơ sở vật chất của bạn.',
  description_en: 'The clinic space directly affects patient perception of service quality. Check your facility.',
  subtitle_vi: 'Đánh giá cơ sở vật chất và không gian phòng khám',
  subtitle_en: 'Assess clinic facility and space',
  chapter_refs: ['Ch.SYSTEM'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 26,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Cơ Sở Vật Chất Check', intro_desc: 'Kiểm tra cơ sở vật chất và không gian phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Facility Check', intro_desc: 'Check your clinic facility and space.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'facility', name_vi: 'Cơ sở vật chất', name_en: 'Facility', question_ids: ['cs_q1', 'cs_q2', 'cs_q3', 'cs_q4', 'cs_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia vận hành phòng khám. Dựa trên kết quả Cơ Sở Vật Chất Check (điểm {{SCORE_FACILITY}}/100 kèm 2 câu open-ended), phân tích cơ sở vật chất và đưa ra 3 gợi ý ưu tiên. Tiếng Việt, giọng thực tế, khuyẾn khích.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, clinic operations expert. Based on the Facility Check score ({{SCORE_FACILITY}}/100 with 2 open-ended answers), analyze clinic facility and suggest 3 priority improvements. English, practical tone.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_FACILITY}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày cải thiện cơ sở vật chất.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_FACILITY}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to improve clinic facility.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ CƠ SỞ VẬT CHẤT',
      title_en: 'PART 1: FACILITY EVALUATION',
      subtitle_vi: '5 chiều đánh giá: không gian, thiết bị, vệ sinh, tiện nghi, và an toàn.',
      subtitle_en: '5 evaluation dimensions: space, equipment, hygiene, amenities, and safety.',
      ref: 'Cơ Sở Vật Chất',
      icon: 'domain',
      questions: [
        { question_id: 'cs_q1', order_idx: 0, type: 'select', label_vi: 'Không gian phòng khám — sạch sẽ, thoáng mát, và thoải mái cho bệnh nhân không?', label_en: 'Is the clinic space — clean, comfortable, and welcoming for patients?', scale_labels_vi: { '1': 'Không gian chật hẹp, không thoáng, bệnh nhân ngồi chờ trong điều kiện không thoải mái', '2': 'Có không gian nhưng chưa được tối ưu về bố trí và cảm giác', '3': 'Không gian cơ bản sạch sẽ nhưng chưa tạo ấn tượng đặc biệt', '4': 'Không gian được thiết kế tốt, sạch sẽ, và tạo cảm giác chuyên nghiệp', '5': 'Không gian xuất sắc: thiết kế chu đáo, sạch sẽ, tiện nghi, và tạo trải nghiệm tích cực' }, scale_labels_en: { '1': 'Cramped, not airy, patients uncomfortable waiting', '2': 'Has space but not optimized for layout and feel', '3': 'Basic clean space but no special impression', '4': 'Well-designed space, clean, creates professional feel', '5': 'Excellent space: thoughtful design, clean, amenities, positive experience' }, dimension: 'facility' },
        { question_id: 'cs_q2', order_idx: 1, type: 'select', label_vi: 'Thiết bị và ghế nha khoa được bảo trì và cập nhật tốt không?', label_en: 'Are equipment and dental chairs well maintained and updated?', scale_labels_vi: { '1': 'Thiết bị cũ, hỏng, hoặc thiếu thường xuyên', '2': 'Có thiết bị cơ bản nhưng chưa được bảo trì tốt', '3': 'Thiết bị được bảo trì nhưng chưa cập nhật công nghệ mới', '4': 'Thiết bị tốt, được bảo trì định kỳ và cập nhật khi cần', '5': 'Thiết bị hiện đại, được bảo trì chu đáo, và luôn sẵn sàng cho mọi ca điều trị' }, scale_labels_en: { '1': 'Old equipment, frequently broken or missing', '2': 'Have basic equipment but not well maintained', '3': 'Equipment maintained but not updated with new technology', '4': 'Good equipment, regularly maintained and updated as needed', '5': 'Modern equipment, meticulously maintained, always ready for every case' }, dimension: 'facility' },
        { question_id: 'cs_q3', order_idx: 2, type: 'select', label_vi: 'Tiêu chuẩn vệ sinh và khử khuẩn của phòng khám như thế nào?', label_en: 'What are your clinic hygiene and sterilization standards?', scale_labels_vi: { '1': 'Tiêu chuẩn vệ sinh cơ bản, có thể còn thiếu sót', '2': 'Có quy trình vệ sinh nhưng chưa hệ thống và nhất quán', '3': 'Quy trình vệ sinh cơ bản được tuân thủ', '4': 'Quy trình vệ sinh nghiêm ngặt, được đào tạo và theo dõi', '5': 'Tiêu chuẩn vô trùng cao nhất: quy trình chuẩn quốc tế, audit định kỳ, minh bạch với bệnh nhân' }, scale_labels_en: { '1': 'Basic hygiene standards, possibly with gaps', '2': 'Have hygiene process but not systematic and consistent', '3': 'Basic hygiene process being followed', '4': 'Strict hygiene process, trained and monitored', '5': 'Highest sterilization standards: international protocols, regular audits, transparent to patients' }, dimension: 'facility' },
        { question_id: 'cs_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có đủ tiện nghi cho bệnh nhân chờ đợi — nước uống, wifi, sạc điện thoại, v.v. không?', label_en: 'Does your clinic have enough amenities for waiting patients — water, wifi, phone charging, etc.?', scale_labels_vi: { '1': 'Không có tiện nghi cho bệnh nhân chờ', '2': 'Có ghế ngồi cơ bản, không có tiện nghi khác', '3': 'Có một vài tiện nghi cơ bản nhưng không được duy trì tốt', '4': 'Đủ tiện nghi cơ bản: wifi, nước uống, và sạc điện thoại', '5': 'Trải nghiệm chờ đợi tốt: wifi, nước uống, sạc, tạp chí, và có thông tin giáo dục bệnh nhân' }, scale_labels_en: { '1': 'No amenities for waiting patients', '2': 'Basic seating only, no other amenities', '3': 'Some basic amenities but not well maintained', '4': 'Enough basic amenities: wifi, water, phone charging', '5': 'Great waiting experience: wifi, water, charging, magazines, and patient education materials' }, dimension: 'facility' },
        { question_id: 'cs_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có vị trí thuận tiện, dễ tìm, và có chỗ đỗ xe không?', label_en: 'Is your clinic conveniently located, easy to find, and with parking?', scale_labels_vi: { '1': 'Vị trí khó tìm, không có chỗ đỗ xe', '2': 'Vị trí khó tìm nhưng có chỗ đỗ xe', '3': 'Vị trí khá thuận tiện hoặc có chỗ đỗ xe', '4': 'Vị trí thuận tiện, có chỗ đỗ xe, và có biển chỉ dẫn rõ ràng', '5': 'Vị trí lý tưởng: dễ tìm, đỗ xe thuận tiện, có biển chỉ dẫn rõ ràng, và bản đồ online' }, scale_labels_en: { '1': 'Hard to find location, no parking', '2': 'Hard to find but has parking', '3': 'Fairly convenient location or has parking', '4': 'Convenient location, parking available, clear signage', '5': 'Ideal location: easy to find, convenient parking, clear signage, and online map' }, dimension: 'facility' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào cơ sở vật chất.',
      subtitle_en: 'Two open questions to look deeply into your facility.',
      ref: 'Cơ Sở Vật Chất',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'cs_open1', order_idx: 0, type: 'textarea', label_vi: 'Bệnh nhân thường phàn nàn hoặc khen ngợi điều gì về không gian phòng khám của bạn?', label_en: 'What do patients usually complain about or praise regarding your clinic space?', placeholder_vi: 'Nghĩ về phản hồi gần nhất từ bệnh nhân về không gian, thiết bị, hoặc tiện nghi. Điều gì họ hay nhắc đến?', placeholder_en: 'Think about the most recent patient feedback about space, equipment, or amenities. What do they often mention?' },
        { question_id: 'cs_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu bạn có thể thay đổi một điều về cơ sở vật chất phòng khám ngay lập tức (không tốn chi phí), bạn sẽ chọn gì?', label_en: 'If you could change one thing about your clinic facility immediately (at no cost), what would you choose?', placeholder_vi: 'Nghĩ về những thay đổi "miễn phí" có thể làm ngay — như dọn dẹp, sắp xếp lại, thay đổi cách bố trí, hay thêm thông tin cho bệnh nhân.', placeholder_en: 'Think about "free" changes you could make immediately — like cleaning, reorganizing, changing layout, or adding patient information.' },
      ],
    },
  ],
};
