// Seed: Lời Như Quản Check — quản lý phòng khám như một doanh nghiệp (order 24)
// Free scanner (is_free: 1), đánh giá business mindset của chủ phòng khám.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const LOI_NHU_QUAN_CHECK_SEED: SeedScanner = {
  id: 'loi-nhu-quan-check',
  slug: 'loi-nhu-quan-check',
  title_vi: 'Lời Như Quản Check',
  title_en: 'Business Mindset Check',
  description_vi: 'Nhiều bác sĩ giỏi nhưng phòng khám không phát triển vì thiếu mindset kinh doanh. Kiểm tra cách bạn quản lý phòng khám như một doanh nghiệp.',
  description_en: 'Many good doctors but clinics that do not grow because of a lack of business mindset. Check how you manage your clinic as a business.',
  subtitle_vi: 'Đánh giá mindset kinh doanh của chủ phòng khám',
  subtitle_en: 'Assess the business mindset of clinic owners',
  chapter_refs: ['Ch.STARTUP'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 24,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Lời Như Quản Check', intro_desc: 'Quản lý phòng khám như doanh nghiệp — kiểm tra business mindset của bạn.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Business Mindset Check', intro_desc: 'Managing your clinic as a business — check your business mindset.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'business', name_vi: 'Business mindset', name_en: 'Business Mindset', question_ids: ['ln_q1', 'ln_q2', 'ln_q3', 'ln_q4', 'ln_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia quản lý phòng khám. Dựa trên kết quả Lời Như Quản Check (điểm {{SCORE_BUSINESS}}/100 kèm 2 câu open-ended), phân tích business mindset và đưa ra 3 gợi ý. Tiếng Việt, giọng thực tế, động viên.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, clinic management expert. Based on the Business Mindset Check score ({{SCORE_BUSINESS}}/100 with 2 open-ended answers), analyze business mindset and suggest 3 improvements. English, practical and motivating tone.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_BUSINESS}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nTạo kế hoạch 30 ngày xây dựng business mindset.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_BUSINESS}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to build your business mindset.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ BUSINESS MINDSET',
      title_en: 'PART 1: BUSINESS MINDSET EVALUATION',
      subtitle_vi: '5 chiều đánh giá: tài chính, chiến lược, marketing, nhân sự, và hệ thống.',
      subtitle_en: '5 evaluation dimensions: finance, strategy, marketing, people, and systems.',
      ref: 'Business Mindset',
      icon: 'trending_up',
      questions: [
        { question_id: 'ln_q1', order_idx: 0, type: 'select', label_vi: 'Bạn biết chính xác doanh thu, chi phí, và lợi nhuận hàng tháng của phòng khám không?', label_en: 'Do you know exactly your monthly revenue, costs, and profit?', scale_labels_vi: { '1': 'Không theo dõi tài chính, không biết lời lỗ thế nào', '2': 'Biết tổng thể nhưng không có số liệu cụ thể', '3': 'Theo dõi doanh thu nhưng chưa rõ chi phí và lợi nhuận', '4': 'Có báo cáo tài chính hàng tháng, biết P&L', '5': 'Hệ thống tài chính minh bạch: doanh thu, chi phí, lợi nhuận, và xu hướng' }, scale_labels_en: { '1': 'Not tracking finances, do not know profit/loss', '2': 'Know overall but no specific numbers', '3': 'Tracking revenue but unclear on costs and profit', '4': 'Monthly financial reports, know P&L', '5': 'Transparent financial system: revenue, costs, profit, and trends' }, dimension: 'business' },
        { question_id: 'ln_q2', order_idx: 1, type: 'select', label_vi: 'Phòng khám có kế hoạch phát triển rõ ràng cho 1-3 năm tới không?', label_en: 'Does your clinic have a clear development plan for the next 1-3 years?', scale_labels_vi: { '1': 'Không có kế hoạch, sống ngày nào hay ngày đó', '2': 'Có mục tiêu chung nhưng không có kế hoạch cụ thể', '3': 'Có kế hoạch sơ lược nhưng không theo dõi tiến độ', '4': 'Có kế hoạch chi tiết với KPI và milestone', '5': 'Kế hoạch chiến lược rõ ràng: vision, 1-3 năm, quarterly OKR' }, scale_labels_en: { '1': 'No plan, living day to day', '2': 'Have general goals but no specific plan', '3': 'Have outline plan but not tracking progress', '4': 'Detailed plan with KPIs and milestones', '5': 'Clear strategic plan: vision, 1-3 years, quarterly OKRs' }, dimension: 'business' },
        { question_id: 'ln_q3', order_idx: 2, type: 'select', label_vi: 'Bạn dành bao nhiêu thời gian cho việc quản lý kinh doanh (thay vì chỉ làm việc lâm sàng)?', label_en: 'How much time do you spend on business management (instead of just clinical work)?', scale_labels_vi: { '1': 'Gần như 100% thời gian cho lâm sàng, không có thời gian kinh doanh', '2': 'Ít thời gian cho kinh doanh, chủ yếu giải quyết vấn đề tức thì', '3': 'Khoảng 10-20% thời gian cho quản lý', '4': '20-30% thời gian cho kinh doanh và phát triển', '5': 'Có thời gian cố định hàng tuần cho chiến lược, tài chính, và phát triển' }, scale_labels_en: { '1': 'Nearly 100% clinical time, no time for business', '2': 'Little business time, mostly firefighting', '3': 'About 10-20% time for management', '4': '20-30% time for business and development', '5': 'Fixed weekly time for strategy, finance, and development' }, dimension: 'business' },
        { question_id: 'ln_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có hệ thống để thu hút và giữ chân bệnh nhân không?', label_en: 'Does your clinic have systems to attract and retain patients?', scale_labels_vi: { '1': 'Không có hệ thống, phụ thuộc vào khách cũ giới thiệu', '2': 'Có một số nỗ lực marketing nhưng không có hệ thống', '3': 'Có chiến lược thu hút bệnh nhân nhưng chưa chặt chẽ', '4': 'Có hệ thống: marketing + referral + retention + follow-up', '5': 'Hệ thống toàn diện: acquisition + experience + loyalty + recovery' }, scale_labels_en: { '1': 'No systems, relying on word of mouth', '2': 'Some marketing efforts but no system', '3': 'Patient attraction strategy but not rigorous', '4': 'Systems in place: marketing + referral + retention + follow-up', '5': 'Comprehensive system: acquisition + experience + loyalty + recovery' }, dimension: 'business' },
        { question_id: 'ln_q5', order_idx: 4, type: 'select', label_vi: 'Bạn có đầu tư vào việc học hỏi kinh doanh và phát triển bản thân với tư cách chủ doanh nghiệp không?', label_en: 'Do you invest in learning business and developing yourself as a business owner?', scale_labels_vi: { '1': 'Không đầu tư thời gian hoặc tiền bạc vào việc học kinh doanh', '2': 'Thỉnh thoảng đọc bài viết nhưng không có hệ thống', '3': 'Tham gia một vài khóa học hoặc cộng đồng', '4': 'Đầu tư đều đặn: sách, khóa học, cộng đồng doanh nhân', '5': 'Học tập liên tục với hệ thống: mentorship, coaching, mastermind group' }, scale_labels_en: { '1': 'Not investing time or money in learning business', '2': 'Occasionally reading articles but no system', '3': 'Participating in some courses or communities', '4': 'Regular investment: books, courses, entrepreneur communities', '5': 'Continuous learning with system: mentorship, coaching, mastermind group' }, dimension: 'business' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào mindset kinh doanh.',
      subtitle_en: 'Two open questions to look deeply into your business mindset.',
      ref: 'Business Mindset',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'ln_open1', order_idx: 0, type: 'textarea', label_vi: 'Bạn tự nhận mình là một người làm kinh doanh hay một người làm nghề? Điều gì khiến bạn nghĩ như vậy?', label_en: 'Do you see yourself as a business person or a practitioner? What makes you think so?', placeholder_vi: 'Nghĩ về cách bạn nhìn nhận công việc của mình — là một nghề nghiệp hay một doanh nghiệp, hay cả hai?', placeholder_en: 'Think about how you view your work — as a profession or a business, or both?' },
        { question_id: 'ln_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu phòng khám của bạn phải tự trả tiền thuê, tiền lương, và chi phí — không có lương bác sĩ — thì nó có lời không?', label_en: 'If your clinic had to pay its own rent, salaries, and expenses — no doctor salary — would it be profitable?', placeholder_vi: 'Thử tính toán đơn giản: tổng thu nhập từ bệnh nhân trừ tất cả chi phí vận hành. Kết quả là gì?', placeholder_en: 'Try a simple calculation: total patient income minus all operating costs. What is the result?' },
      ],
    },
  ],
};
