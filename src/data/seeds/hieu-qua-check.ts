// Seed: Hiệu Qua Check — năng suất và hiệu quả phòng khám (order 25)
// Free scanner (is_free: 1), đánh giá hiệu quả vận hành.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const HIEU_QUA_CHECK_SEED: SeedScanner = {
  id: 'hieu-qua-check',
  slug: 'hieu-qua-check',
  title_vi: 'Hiệu Qua Check',
  title_en: 'Efficiency Check',
  description_vi: 'Mỗi phòng khám có 24 giờ như nhau nhưng hiệu quả khác nhau. Kiểm tra mức độ hiệu quả vận hành của phòng khám bạn.',
  description_en: 'Every clinic has the same 24 hours but different efficiency. Check your clinic operational efficiency level.',
  subtitle_vi: 'Đánh giá hiệu quả vận hành phòng khám',
  subtitle_en: 'Assess your clinic operational efficiency',
  chapter_refs: ['Ch.SYSTEM'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 25,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Hiệu Qua Check', intro_desc: 'Kiểm tra mức độ hiệu quả vận hành phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Efficiency Check', intro_desc: 'Check your clinic operational efficiency.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'efficiency', name_vi: 'Hiệu quả', name_en: 'Efficiency', question_ids: ['hq_q1', 'hq_q2', 'hq_q3', 'hq_q4', 'hq_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia vận hành phòng khám. Dựa trên kết quả Hiệu Qua Check (điểm {{SCORE_EFFICIENCY}}/100 kèm 2 câu open-ended), phân tích hiệu quả vận hành và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, khuyẾn khích.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, clinic operations expert. Based on the Efficiency Check score ({{SCORE_EFFICIENCY}}/100 with 2 open-ended answers), analyze operational efficiency and suggest 3 improvements. English, practical tone.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_EFFICIENCY}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày tăng hiệu quả vận hành.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_EFFICIENCY}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to increase operational efficiency.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ HIỆU QUẢ',
      title_en: 'PART 1: EFFICIENCY EVALUATION',
      subtitle_vi: '5 chiều đánh giá: thời gian, quy trình, nhân sự, công nghệ, và chi phí.',
      subtitle_en: '5 evaluation dimensions: time, processes, people, technology, and cost.',
      ref: 'Hiệu quả — Efficiency',
      icon: 'speed',
      questions: [
        { question_id: 'hq_q1', order_idx: 0, type: 'select', label_vi: 'Thời gian trung bình một bệnh nhân ngồi chờ sau khi đến đúng giờ hẹn là bao lâu?', label_en: 'What is the average wait time for a patient who arrives on time for their appointment?', scale_labels_vi: { '1': 'Hơn 45 phút thường xuyên', '2': '30-45 phút thường xuyên', '3': '15-30 phút thỉnh thoảng', '4': 'Dưới 15 phút thường xuyên', '5': 'Đúng giờ hoặc dưới 10 phút, có hệ thống lên lịch thông minh' }, scale_labels_en: { '1': 'Over 45 minutes regularly', '2': '30-45 minutes regularly', '3': '15-30 minutes occasionally', '4': 'Under 15 minutes regularly', '5': 'On time or under 10 minutes, with smart scheduling system' }, dimension: 'efficiency' },
        { question_id: 'hq_q2', order_idx: 1, type: 'select', label_vi: 'Quy trình từ khi bệnh nhân gọi đặt lịch đến khi ra về sau điều trị được thiết kế tốt không?', label_en: 'Is the process from patient call to post-treatment departure well designed?', scale_labels_vi: { '1': 'Không có quy trình chuẩn, mỗi người làm một kiểu', '2': 'Có quy trình nhưng không được viết ra và không nhất quán', '3': 'Có quy trình cơ bản được viết ra nhưng chưa được tối ưu', '4': 'Có SOP rõ ràng và đội ngũ được đào tạo theo SOP', '5': 'Quy trình được thiết kế tối ưu: SOP + checklist + automation + feedback loop' }, scale_labels_en: { '1': 'No standard process, everyone does it differently', '2': 'Have a process but not written and inconsistent', '3': 'Basic process written but not optimized', '4': 'Clear SOP with trained team following SOP', '5': 'Optimized processes: SOP + checklist + automation + feedback loop' }, dimension: 'efficiency' },
        { question_id: 'hq_q3', order_idx: 2, type: 'select', label_vi: 'Nhân viên của bạn có biết chính xác trách nhiệm và quyền hạn của mình không?', label_en: 'Do your staff know exactly their responsibilities and authority?', scale_labels_vi: { '1': 'Không rõ ràng, mọi người tự quyết định hoặc chờ chỉ đạo', '2': 'Biết công việc chính nhưng không rõ quyền hạn', '3': 'Có mô tả công việc nhưng chưa đầy đủ', '4': 'Rõ ràng về trách nhiệm và có quy trình báo cáo', '5': 'Có RACI matrix, KPIs cá nhân, và quyền hạn rõ ràng cho từng vai trò' }, scale_labels_en: { '1': 'Unclear, everyone decides or waits for instructions', '2': 'Know main tasks but unclear about authority', '3': 'Job descriptions exist but not comprehensive', '4': 'Clear responsibilities and reporting process', '5': 'RACI matrix, individual KPIs, and clear authority for each role' }, dimension: 'efficiency' },
        { question_id: 'hq_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám sử dụng công nghệ để tự động hóa và giảm thời gian thủ công không?', label_en: 'Does your clinic use technology to automate and reduce manual time?', scale_labels_vi: { '1': 'Ít dùng công nghệ, hầu hết việc làm thủ công', '2': 'Dùng một vài công cụ số nhưng chưa kết nối', '3': 'Có phần mềm quản lý phòng khám nhưng chưa tận dụng hết tính năng', '4': 'Sử dụng tốt phần mềm, một số tự động hóa cơ bản', '5': 'Hệ thống tự động hóa toàn diện: đặt lịch, nhắc nhở, thanh toán, báo cáo' }, scale_labels_en: { '1': 'Little technology use, mostly manual work', '2': 'Using a few digital tools but not connected', '3': 'Have clinic management software but not fully utilized', '4': 'Good software usage, some basic automation', '5': 'Comprehensive automation: scheduling, reminders, payments, reporting' }, dimension: 'efficiency' },
        { question_id: 'hq_q5', order_idx: 4, type: 'select', label_vi: 'Chi phí vận hành được theo dõi và tối ưu hóa thường xuyên không?', label_en: 'Are operating costs tracked and optimized regularly?', scale_labels_vi: { '1': 'Không theo dõi chi phí cụ thể, chi gì tính gì', '2': 'Theo dõi chi phí lớn nhưng không chi tiết', '3': 'Có theo dõi chi phí hàng tháng nhưng chưa phân tích sâu', '4': 'Theo dõi chi tiết, phân tích chi phí theo từng hạng mục', '5': 'Hệ thống quản lý chi phí: budget, variance analysis, cost optimization' }, scale_labels_en: { '1': 'Not tracking specific costs, spending as it comes', '2': 'Tracking major costs but not detailed', '3': 'Monthly cost tracking but not deeply analyzed', '4': 'Detailed cost tracking, analyzing costs by category', '5': 'Cost management system: budget, variance analysis, cost optimization' }, dimension: 'efficiency' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào hiệu quả vận hành.',
      subtitle_en: 'Two open questions to look deeply into operational efficiency.',
      ref: 'Hiệu quả — Efficiency',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'hq_open1', order_idx: 0, type: 'textarea', label_vi: 'Điều gì làm bạn mất nhiều thời gian nhất mỗi ngày trong phòng khám — thứ không liên quan đến điều trị trực tiếp?', label_en: 'What takes the most time each day in your clinic — something not directly related to treatment?', placeholder_vi: 'Nghĩ về những công việc "giấy" hay "hành chính" mà bạn phải làm hàng ngày. Điều gì có thể được tự động hóa hoặc bỏ đi?', placeholder_en: 'Think about the "paperwork" or "admin" tasks you do daily. What could be automated or eliminated?' },
        { question_id: 'hq_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu bạn có thể tự động hóa một quy trình trong phòng khám, bạn sẽ chọn quy trình nào? Tại sao?', label_en: 'If you could automate one process in the clinic, which would you choose? Why?', placeholder_vi: 'Nghĩ về quy trình lặp đi lặp lại mà bạn hoặc đội ngũ phải làm mỗi ngày. Đâu là "công việc tẻ nhạt nhất" mà máy móc có thể thay thế?', placeholder_en: 'Think about repetitive processes you or the team do daily. What is the "most boring work" that machines could replace?' },
      ],
    },
  ],
};
