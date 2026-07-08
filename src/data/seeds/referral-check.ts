// Seed: Referral Check — patient referral system
// Free scanner (is_free: 1), lead magnet để thu hút phòng khám quan tâm referral.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const REFERRAL_CHECK_SEED: SeedScanner = {
  id: 'referral-check',
  slug: 'referral-check',
  title_vi: 'Referral Check',
  title_en: 'Referral Check',
  description_vi: 'Bệnh nhân giới thiệu bệnh nhân là nguồn khách chất lượng cao nhất. 7 câu hỏi giúp bạn đánh giá hệ thống referral của phòng khám.',
  description_en: 'Patient referrals are the highest quality patient source. 7 questions to assess your clinic\'s referral system.',
  subtitle_vi: 'Chẩn đoán nhanh hệ thống giới thiệu bệnh nhân',
  subtitle_en: 'Quick diagnosis of your patient referral system',
  chapter_refs: ['Ch.7'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 13,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Referral Check', intro_desc: 'Bệnh nhân giới thiệu bệnh nhân là nguồn khách chất lượng cao nhất. 7 câu hỏi giúp bạn đánh giá hệ thống referral của phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Referral Check', intro_desc: 'Patient referrals are the highest quality patient source. 7 questions to assess your clinic\'s referral system.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'referral', name_vi: 'Hệ thống Referral', name_en: 'Referral System', question_ids: ['rf_q1', 'rf_q2', 'rf_q3', 'rf_q4', 'rf_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Referral Check (điểm {{SCORE_REFERRAL}}/100 kèm 2 câu open-ended), phân tích hệ thống referral và đưa ra 3 cách tăng số lượng bệnh nhân giới thiệu. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the Referral Check score ({{SCORE_REFERRAL}}/100 with 2 open-ended answers), analyze your referral system and suggest 3 ways to increase referral patients. English, candid and warm tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_REFERRAL}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày để tăng số lượng bệnh nhân giới thiệu.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_REFERRAL}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan to increase referral patients.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ REFERRAL',
      title_en: 'PART 1: REFERRAL EVALUATION',
      subtitle_vi: '5 chiều đánh giá: chương trình, incentive, tracking, chăm sóc, và đo lường.',
      subtitle_en: '5 evaluation dimensions: program, incentives, tracking, care, and measurement.',
      ref: 'Ch.7 — Marketing Phòng Khám',
      icon: 'group_add',
      questions: [
        { question_id: 'rf_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám có chương trình khuyẾn khích bệnh nhân giới thiệu (referral program) rõ ràng không?', label_en: 'Does your clinic have a clear patient referral incentive program?', scale_labels_vi: { '1': 'Không có chương trình referral nào', '2': 'Có một vài ưu đãi nhưng không có chương trình chính thức', '3': 'Có chương trình cơ bản: ưu đãi cho người giới thiệu', '4': 'Chương trình đầy đủ: cho cả người giới thiệu và người được giới thiệu', '5': 'Chương trình VIP: tiered rewards + benefits + recognition' }, scale_labels_en: { '1': 'No referral program at all', '2': 'Some ad-hoc incentives but no formal program', '3': 'Basic program: benefit for referrer only', '4': 'Full program: benefits for both referrer and referred', '5': 'VIP program: tiered rewards + benefits + recognition' }, dimension: 'referral' },
        { question_id: 'rf_q2', order_idx: 1, type: 'select', label_vi: 'Phòng khám có theo dõi và phân loại nguồn bệnh nhân để biết tỷ lệ referral không?', label_en: 'Does your clinic track and categorize patient sources to know referral rate?', scale_labels_vi: { '1': 'Không theo dõi, không biết bệnh nhân đến từ đâu', '2': 'Hỏi khi đăng ký nhưng không phân tích', '3': 'Ghi nhận nguồn đến cơ bản, có số tổng', '4': 'Theo dõi chi tiết + phân tích theo tháng', '5': 'Full attribution: track every referral source + ROI analysis' }, scale_labels_en: { '1': 'No tracking, don\'t know where patients come from', '2': 'Ask at registration but don\'t analyze', '3': 'Basic source recording with totals', '4': 'Detailed tracking + monthly analysis', '5': 'Full attribution: track every referral source + ROI analysis' }, dimension: 'referral' },
        { question_id: 'rf_q3', order_idx: 2, type: 'select', label_vi: 'Bác sĩ và nhân viên có được khen thưởng/recognize khi có bệnh nhân referral không?', label_en: 'Are doctors and staff recognized/rewarded when they bring in referral patients?', scale_labels_vi: { '1': 'Không có gì, referral là chuyện bình thường', '2': 'Có khen thưởng nhưng không nhất quán', '3': 'Có chương trình khen thưởng nhân viên theo tháng', '4': 'Full recognition: bonus + public acknowledgment + team celebration', '5': 'Culture of referral: everyone actively asks + team incentives' }, scale_labels_en: { '1': 'Nothing, referrals are just normal', '2': 'Irregular recognition', '3': 'Monthly staff reward program', '4': 'Full recognition: bonus + public acknowledgment + team celebration', '5': 'Culture of referral: everyone actively asks + team incentives' }, dimension: 'referral' },
        { question_id: 'rf_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có chăm sóc "người giới thiệu" (bệnh nhân thân thiết giới thiệu nhiều) như một nhóm VIP không?', label_en: 'Does your clinic treat "referrers" (loyal patients who refer many) as a VIP group?', scale_labels_vi: { '1': 'Không phân biệt, tất cả bệnh nhân như nhau', '2': 'Biết có người giới thiệu nhiều nhưng không chăm sóc đặc biệt', '3': 'Có gọi/cảm ơn nhưng không có chương trình VIP', '4': 'Có chương trình VIP cho top referrers + benefits đặc biệt', '5': 'Full VIP program: exclusive benefits, early access, special events' }, scale_labels_en: { '1': 'No distinction, all patients treated equally', '2': 'Aware of top referrers but no special care', '3': 'Thank-you calls but no VIP program', '4': 'VIP program for top referrers + special benefits', '5': 'Full VIP program: exclusive benefits, early access, special events' }, dimension: 'referral' },
        { question_id: 'rf_q5', order_idx: 4, type: 'select', label_vi: 'Tỷ lệ bệnh nhân mới đến từ referral so với các nguồn khác (quảng cáo, tự nhiên) là bao nhiêu?', label_en: 'What is the ratio of referral patients to other sources (ads, organic)?', scale_labels_vi: { '1': 'Ít hơn 10%, hầu hết đến từ quảng cáo', '2': 'Khoảng 10-20%, đang tăng dần', '3': 'Khoảng 20-30%, referral là nguồn thứ 2', '4': 'Khoảng 30-50%, referral là nguồn chính', '5': 'Hơn 50%, referral là nguồn chính + chi phí acquisition thấp' }, scale_labels_en: { '1': 'Less than 10%, most come from ads', '2': 'About 10-20%, gradually increasing', '3': 'About 20-30%, referral is the #2 source', '4': 'About 30-50%, referral is a primary source', '5': 'Over 50%, referral is primary source + low acquisition cost' }, dimension: 'referral' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn thẳng vào nguồn referral.',
      subtitle_en: 'Two open questions to face your referral sources honestly.',
      ref: 'Ch.7 — Marketing Phòng Khám',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'rf_open1', order_idx: 0, type: 'textarea', label_vi: 'Ai là nguồn referral tốt nhất của phòng khám? (Bệnh nhân cũ, bác sĩ, nha sĩ khác, công ty,...) Tại sao?', label_en: 'Who is your best referral source? (Old patients, doctors, other dentists, companies,...) Why?', placeholder_vi: 'Mô tả ngắn về nguồn referral tốt nhất và tại sao họ giới thiệu nhiều.', placeholder_en: 'Briefly describe your best referral source and why they refer a lot.' },
        { question_id: 'rf_open2', order_idx: 1, type: 'textarea', label_vi: 'Điều gì ngăn bệnh nhân giới thiệu nhiều hơn? Hay nói cách khác: làm sao để họ giới thiệu dễ dàng hơn?', label_en: 'What prevents patients from referring more? Or: what would make it easier for them to refer?', placeholder_vi: 'Nghĩ về cả rào cản (không có chương trình, không biết ai để giới thiệu, không tiện) và động lực (điều gì sẽ khiến họ hào hứng giới thiệu).', placeholder_en: 'Think about barriers (no program, don\'t know who to refer, inconvenient) and motivators (what would excite them to refer).' },
      ],
    },
  ],
};
