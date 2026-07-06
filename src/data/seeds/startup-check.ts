// Seed: Startup Check — phòng khám mới khởi nghiệp (1-3 năm đầu)
// Free scanner (is_free: 1), lead magnet để thu hút phòng khám mới thành lập.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const STARTUP_CHECK_SEED: SeedScanner = {
  id: 'startup-check',
  slug: 'startup-check',
  title_vi: 'Startup Check',
  title_en: 'Startup Check',
  description_vi: 'Mới mở phòng khám hoặc dưới 3 năm? Đánh giá ngay 5 khía cạnh quan trọng nhất để khởi đầu vững chắc.',
  description_en: 'New clinic or under 3 years old? Assess the 5 most critical areas for a solid start.',
  subtitle_vi: 'Chẩn đoán nhanh cho phòng khám mới thành lập',
  subtitle_en: 'Quick diagnosis for newly established clinics',
  chapter_refs: ['Ch.MỚI'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 11,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
    years_in_operation: { label_vi: 'Số năm hoạt động', label_en: 'Years in operation', required: false, placeholder_vi: '1', type: 'text' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Startup Check', intro_desc: 'Mới mở phòng khám hoặc dưới 3 năm? Đánh giá ngay 5 khía cạnh quan trọng nhất để khởi đầu vững chắc.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Startup Check', intro_desc: 'New clinic or under 3 years old? Assess the 5 most critical areas for a solid start.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'startup', name_vi: 'Mức độ khởi đầu', name_en: 'Startup Readiness', question_ids: ['st_q1', 'st_q2', 'st_q3', 'st_q4', 'st_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Startup Check (điểm {{SCORE_STARTUP}}/100 kèm 2 câu open-ended), phân tích mức độ sẵn sàng của phòng khám mới và đưa ra 3 hành động ưu tiên trong 90 ngày đầu. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant. Based on the Startup Check score ({{SCORE_STARTUP}}/100 with 2 open-ended answers), analyze the clinic\'s readiness and suggest 3 priority actions for the first 90 days. English, candid and warm tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_STARTUP}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 90 ngày đầu cho phòng khám mới.\nMỗi tuần 2-3 hành động CỤ THỂ. Ưu tiên những gì tạo nền tảng trước.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Giai đoạn 2 (Ngày 31-60)\n...\n\n## Giai đoạn 3 (Ngày 61-90)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_STARTUP}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 90-day plan for a new clinic.\nEach week: 2-3 SPECIFIC actions. Prioritize foundation-building actions first.\n\n# OUTPUT STRUCTURE\n## Phase 1 (Days 1-30)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Phase 2 (Days 31-60)\n...\n\n## Phase 3 (Days 61-90)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ KHỞI ĐẦU',
      title_en: 'PART 1: STARTUP EVALUATION',
      subtitle_vi: '5 chiều đánh giá: legal, vị trí, thiết bị, quy trình, và đội ngũ.',
      subtitle_en: '5 evaluation dimensions: legal, location, equipment, processes, and team.',
      ref: 'Phòng khám mới — Startup',
      icon: 'rocket_launch',
      questions: [
        { question_id: 'st_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám đã đủ giấy phép hoạt động, PCCC, và các thủ tục pháp lý cần thiết chưa?', label_en: 'Does your clinic have all necessary operating licenses, fire safety, and legal permits?', scale_labels_vi: { '1': 'Còn thiếu nhiều giấy tờ quan trọng', '2': 'Có giấy phép cơ bản nhưng chưa đầy đủ', '3': 'Đủ giấy phép chính, đang hoàn thiện phụ', '4': 'Đầy đủ tất cả giấy phép + định kỳ gia hạn', '5': 'Hoàn hảo — mọi thứ gọn gàng, có lịch gia hạn tự động' }, scale_labels_en: { '1': 'Missing many important documents', '2': 'Basic license only, not fully compliant', '3': 'Main permits ok, secondary pending', '4': 'All permits complete + periodic renewal', '5': 'Perfect — everything organized with auto-renewal' }, dimension: 'startup' },
        { question_id: 'st_q2', order_idx: 1, type: 'select', label_vi: 'Vị trí và cơ sở vật chất của phòng khám đã phù hợp với đối tượng khách hàng mục tiêu chưa?', label_en: 'Is your clinic\'s location and facilities suitable for your target patients?', scale_labels_vi: { '1': 'Chưa ổn định, đang tìm chỗ', '2': 'Có chỗ nhưng chưa phù hợp với đối tượng', '3': 'Vị trí tạm được, đang cải thiện dần', '4': 'Vị trí tốt, dễ tìm, phù hợp với khách hàng', '5': 'Vị trí lý tưởng + không gian chuyên nghiệp' }, scale_labels_en: { '1': 'Not stable, still searching for location', '2': 'Have space but not suitable for target audience', '3': 'Temporary location, gradually improving', '4': 'Good location, easy to find, suitable for patients', '5': 'Ideal location + professional space' }, dimension: 'startup' },
        { question_id: 'st_q3', order_idx: 2, type: 'select', label_vi: 'Thiết bị và công nghệ của phòng khám đã đáp ứng được các dịch vụ cơ bản chưa?', label_en: 'Does your clinic\'s equipment and technology meet basic service needs?', scale_labels_vi: { '1': 'Thiếu nhiều thiết bị cần thiết, chưa thể hoạt động đầy đủ', '2': 'Có thiết bị cơ bản nhưng thiếu nhiều dịch vụ chính', '3': 'Đủ cho dịch vụ cơ bản, đang tích lũy thêm', '4': 'Có đủ thiết bị cho các dịch vụ chính + vài thiết bị nâng cao', '5': 'Trang bị đầy đủ + công nghệ hiện đại cho hầu hết dịch vụ' }, scale_labels_en: { '1': 'Missing essential equipment, can\'t operate fully', '2': 'Basic equipment only, missing many key services', '3': 'Enough for basic services, accumulating more', '4': 'Full equipment for main services + some advanced tools', '5': 'Fully equipped + modern technology for most services' }, dimension: 'startup' },
        { question_id: 'st_q4', order_idx: 3, type: 'select', label_vi: 'Quy trình khám chữa và vận hành cơ bản đã được thiết lập chưa?', label_en: 'Have basic examination and operational procedures been established?', scale_labels_vi: { '1': 'Chưa có quy trình, hoạt động tùy hứng', '2': 'Có vài quy trình nhưng chưa chuẩn hóa', '3': 'Quy trình cơ bản có, đang dần chuẩn hóa', '4': 'Quy trình chuẩn cho hầu hết các hoạt động chính', '5': 'Hệ thống SOP đầy đủ, nhân viên được đào tạo bài bản' }, scale_labels_en: { '1': 'No procedures, running ad-hoc', '2': 'Some procedures exist but not standardized', '3': 'Basic procedures exist, gradually standardizing', '4': 'Standard procedures for most main operations', '5': 'Complete SOP system, staff fully trained' }, dimension: 'startup' },
        { question_id: 'st_q5', order_idx: 4, type: 'select', label_vi: 'Đội ngũ nhân viên đã ổn định và được đào tạo để phục vụ bệnh nhân chưa?', label_en: 'Is your team stable and trained to serve patients?', scale_labels_vi: { '1': 'Đội ngũ chưa tuyển đủ, thiếu nhân sự trầm trọng', '2': 'Tuyển được nhưng chưa ổn định, hay nghỉ', '3': 'Đội ngũ cơ bản đủ, cần thêm thời gian gắn kết', '4': 'Đội ngũ ổn định, được đào tạo cơ bản', '5': 'Đội ngũ gắn bó, được đào tạo bài bản, có văn hóa làm việc' }, scale_labels_en: { '1': 'Team not complete, severe staff shortage', '2': 'Recruited but unstable, high turnover', '3': 'Basic team complete, needs more time to bond', '4': 'Stable team with basic training', '5': 'Committed team, fully trained, strong work culture' }, dimension: 'startup' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế khởi nghiệp.',
      subtitle_en: 'Two open questions to face your startup reality honestly.',
      ref: 'Phòng khám mới — Startup',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'st_open1', order_idx: 0, type: 'textarea', label_vi: 'Thách thức lớn nhất của bạn trong giai đoạn đầu là gì? Kể một tình huống cụ thể gần đây.', label_en: 'What is your biggest challenge in the early stage? Describe a recent specific situation.', placeholder_vi: 'Có thể là tài chính, nhân sự, bệnh nhân, quy trình... Mô tả ngắn gọn một tình huống cụ thể.', placeholder_en: 'It could be finance, staff, patients, processes... Briefly describe a specific situation.' },
        { question_id: 'st_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu bạn có thể thay đổi một điều về phòng khám ngay bây giờ, bạn sẽ chọn điều gì? Tại sao?', label_en: 'If you could change one thing about your clinic right now, what would it be? Why?', placeholder_vi: 'Nghĩ về điều có tác động lớn nhất đến sự phát triển của phòng khám trong 6 tháng tới.', placeholder_en: 'Think about what would have the biggest impact on your clinic\'s growth in the next 6 months.' },
      ],
    },
  ],
};
