// Seed: Số Hóa Check — mức độ số hóa phòng khám (order 22)
// Free scanner (is_free: 1), giúp đánh giá digital transformation của phòng khám.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const SO_HOA_CHECK_SEED: SeedScanner = {
  id: 'so-hoa-check',
  slug: 'so-hoa-check',
  title_vi: 'Số Hóa Check',
  title_en: 'Digital Check',
  description_vi: 'Số hóa không chỉ là phần mềm — đó là cách phòng khám dùng công nghệ để vận hành hiệu quả hơn. Kiểm tra mức độ số hóa của bạn.',
  description_en: 'Digitization is not just software — it is how your clinic uses technology to operate more efficiently. Check your digital level.',
  subtitle_vi: 'Đánh giá mức độ số hóa phòng khám',
  subtitle_en: 'Assess your clinic digital transformation level',
  chapter_refs: ['Ch.DIGITAL'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 22,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Số Hóa Check', intro_desc: 'Số hóa giúp phòng khám vận hành hiệu quả hơn. Kiểm tra mức độ số hóa của bạn.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'SẴn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Digital Check', intro_desc: 'Digitization helps clinics operate more efficiently. Check your digital level.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'digital', name_vi: 'Số hóa', name_en: 'Digital', question_ids: ['sh_q1', 'sh_q2', 'sh_q3', 'sh_q4', 'sh_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Số Hóa Check (điểm {{SCORE_DIGITAL}}/100 kèm 2 câu open-ended), phân tích mức độ số hóa phòng khám và đưa ra 3 gợi ý ưu tiên. Dùng tiếng Việt, giọng thực tế, khuyẾn khích. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant. Based on the Digital Check score ({{SCORE_DIGITAL}}/100 with 2 open-ended answers), analyze your clinic digitization level and suggest 3 priority improvements. English, practical and encouraging tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_DIGITAL}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo kế hoạch 30 ngày số hóa phòng khám.\nMỗi tuần 2-3 hành động CỤ THỂ.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thực tế\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS.\n\n# INPUT DATA\n- Score: {{SCORE_DIGITAL}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nCreate a 30-day plan to digitize your clinic.\nEach week: 2-3 SPECIFIC actions.\n\n# OUTPUT\n## Phase 1 (Days 1-30)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and practical tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ SỐ HÓA',
      title_en: 'PART 1: DIGITAL EVALUATION',
      subtitle_vi: '5 chiều đánh giá: phần mềm, dữ liệu, tiếp cận, marketing, và an ninh.',
      subtitle_en: '5 evaluation dimensions: software, data, communication, marketing, and security.',
      ref: 'Số hóa — Digital',
      icon: 'devices',
      questions: [
        { question_id: 'sh_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám sử dụng phần mềm quản lý nào — phần mềm nha khoa chuyên dụng, app đặt lịch, hay giải pháp số hóa khác?', label_en: 'What management software does your clinic use — dental software, scheduling app, or other digital solutions?', scale_labels_vi: { '1': 'Không dùng phần mềm, quản lý bằng sổ sách hoặc Excel', '2': 'Dùng Excel hoặc phần mềm không chuyên cho nha khoa', '3': 'Có phần mềm nha khoa cơ bản (quản lý bệnh nhân hoặc đặt lịch)', '4': 'Phần mềm nha khoa đầy đủ: bệnh nhân + lịch + tài chính + inventory', '5': 'Hệ thống tích hợp toàn diện — phần mềm + app + tự động hóa' }, scale_labels_en: { '1': 'No software, managing with paper or Excel', '2': 'Using Excel or non-dental software', '3': 'Basic dental software (patient management or scheduling)', '4': 'Full dental software: patients + scheduling + finance + inventory', '5': 'Fully integrated system — software + app + automation' }, dimension: 'digital' },
        { question_id: 'sh_q2', order_idx: 1, type: 'select', label_vi: 'Dữ liệu bệnh nhân được lưu trữ và quản lý bằng công nghệ như thế nào?', label_en: 'How are patient data stored and managed digitally?', scale_labels_vi: { '1': 'Lưu trữ giấy, không có backup số', '2': 'Số hóa một phần nhưng không có hệ thống', '3': 'Có phần mềm lưu trữ nhưng dữ liệu rời rạc', '4': 'Dữ liệu số tập trung, có backup, dễ truy xuất', '5': 'Hệ thống dữ liệu toàn diện: CRM, backup tự động, analytics' }, scale_labels_en: { '1': 'Paper storage, no digital backup', '2': 'Partially digitized but no system', '3': 'Software storage but data scattered', '4': 'Centralized digital data, backed up, easy to access', '5': 'Comprehensive data system: CRM, auto-backup, analytics' }, dimension: 'digital' },
        { question_id: 'sh_q3', order_idx: 2, type: 'select', label_vi: 'Phòng khám tiếp cận bệnh nhân và giao tiếp qua kênh số nào?', label_en: 'What digital channels does your clinic use to reach and communicate with patients?', scale_labels_vi: { '1': 'Không dùng kênh số để tiếp cận bệnh nhân', '2': 'Có Zalo/Facebook nhưng không có chiến lược', '3': 'Dùng Zalo, Facebook, có nội dung nhưng không đều đặn', '4': 'Có chiến lược nội dung đều đặn, có chatbot hoặc auto-reply', '5': 'Hệ thống tiếp cận số toàn diện: đa nền tảng + automation + CRM tích hợp' }, scale_labels_en: { '1': 'No digital channels to reach patients', '2': 'Have Zalo/Facebook but no strategy', '3': 'Using Zalo, Facebook, content but not regular', '4': 'Regular content strategy, chatbot or auto-reply', '5': 'Comprehensive digital outreach: multi-platform + automation + integrated CRM' }, dimension: 'digital' },
        { question_id: 'sh_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có dùng công cụ số để hỗ trợ điều trị — X-quang kỹ thuật số, camera nội soi, hay thiết bị công nghệ khác không?', label_en: 'Does your clinic use digital tools to support treatment — digital X-rays, intraoral cameras, or other tech?', scale_labels_vi: { '1': 'Không dùng công nghệ số trong điều trị', '2': 'Có X-quang kỹ thuật số nhưng ít dùng', '3': 'Dùng một vài thiết bị số nhưng chưa tích hợp', '4': 'Thiết bị số tốt, tích hợp vào quy trình điều trị', '5': 'Công nghệ tiên tiến: số hóa toàn diện quy trình điều trị + patient education tools' }, scale_labels_en: { '1': 'No digital technology used in treatment', '2': 'Have digital X-rays but rarely use them', '3': 'Using a few digital devices but not integrated', '4': 'Good digital devices, integrated into treatment workflow', '5': 'Advanced technology: fully digitized treatment workflow + patient education tools' }, dimension: 'digital' },
        { question_id: 'sh_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có biết và áp dụng các biện pháp an ninh số — backup, bảo mật, tuân thủ — không?', label_en: 'Is your clinic aware of and applying digital security measures — backup, security, compliance?', scale_labels_vi: { '1': 'Không có biện pháp an ninh số nào', '2': 'Biết có rủi ro nhưng chưa làm gì', '3': 'Backup thủ công thỉnh thoảng, không có kế hoạch', '4': 'Có backup định kỳ, mật khẩu cơ bản', '5': 'Hệ thống bảo mật tốt: backup tự động + mã hóa + training nhân viên' }, scale_labels_en: { '1': 'No digital security measures at all', '2': 'Know the risks but haven\'t done anything', '3': 'Occasional manual backup, no plan', '4': 'Regular backups, basic passwords', '5': 'Good security system: auto-backup + encryption + staff training' }, dimension: 'digital' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn sâu vào mức độ số hóa.',
      subtitle_en: 'Two open questions to look deeply into your digitalization level.',
      ref: 'Số hóa — Digital',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'sh_open1', order_idx: 0, type: 'textarea', label_vi: 'Công nghệ nào đã giúp phòng khám của bạn tiết kiệm thời gian hoặc cải thiện hiệu quả nhất? Kể một ví dụ cụ thể.', label_en: 'What technology has saved you the most time or improved efficiency the most? Give a specific example.', placeholder_vi: 'Nghĩ về một công cụ số hoặc phần mềm mà bạn dùng hàng ngày và thấy hữu ích nhất.', placeholder_en: 'Think about a digital tool or software you use daily and find most useful.' },
        { question_id: 'sh_open2', order_idx: 1, type: 'textarea', label_vi: 'Điều gì ngăn cản bạn số hóa phòng khám nhiều hơn? (thời gian, chi phí, kiến thức, hay không tin tưởng)', label_en: 'What prevents you from digitizing your clinic more? (time, cost, knowledge, or distrust)', placeholder_vi: 'Nghĩ về rào cản lớn nhất với số hóa — có thể là thời gian học, chi phí đầu tư, hay đơn giản là không biết bắt đầu từ đâu.', placeholder_en: 'Think about the biggest barrier to digitization — it could be learning time, investment cost, or simply not knowing where to start.' },
      ],
    },
  ],
};
