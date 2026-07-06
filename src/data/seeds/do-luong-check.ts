// Seed: Đo Lường Check — metrics & measurement culture
// Free scanner (is_free: 1), lead magnet để thu hút phòng khám muốn quản lý bằng data.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const DO_LUONG_CHECK_SEED: SeedScanner = {
  id: 'do-luong-check',
  slug: 'do-luong-check',
  title_vi: 'Đo Lường Check',
  title_en: 'Metrics Check',
  description_vi: 'Không đo lường = không cải thiện được. 7 câu hỏi giúp bạn đánh giá văn hóa đo lường của phòng khám.',
  description_en: 'No measurement = no improvement. 7 questions to assess your clinic\'s measurement culture.',
  subtitle_vi: 'Chẩn đoán nhanh văn hóa đo lường & data',
  subtitle_en: 'Quick diagnosis of measurement & data culture',
  chapter_refs: ['Ch.4'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 14,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Đo Lường Check', intro_desc: 'Không đo lường = không cải thiện được. 7 câu hỏi giúp bạn đánh giá văn hóa đo lường của phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Metrics Check', intro_desc: 'No measurement = no improvement. 7 questions to assess your clinic\'s measurement culture.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'metrics', name_vi: 'Văn hóa Đo lường', name_en: 'Measurement Culture', question_ids: ['dl_q1', 'dl_q2', 'dl_q3', 'dl_q4', 'dl_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Đo Lường Check (điểm {{SCORE_METRICS}}/100 kèm 2 câu open-ended), phân tích văn hóa data-driven và đưa ra 3 cách xây dựng thói quen đo lường. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the Metrics Check score ({{SCORE_METRICS}}/100 with 2 open-ended answers), analyze your data-driven culture and suggest 3 ways to build measurement habits. English, candid and warm tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_METRICS}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày để xây dựng văn hóa đo lường.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_METRICS}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan to build a measurement culture.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ ĐO LƯỜNG',
      title_en: 'PART 1: MEASUREMENT EVALUATION',
      subtitle_vi: '5 chiều đánh giá: KPI tracking, dashboard, data-driven decisions, reporting, và forecasting.',
      subtitle_en: '5 evaluation dimensions: KPI tracking, dashboard, data-driven decisions, reporting, and forecasting.',
      ref: 'Ch.4 — Quản Trị Phòng Khám',
      icon: 'analytics',
      questions: [
        { question_id: 'dl_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám có theo dõi các chỉ số KPI cốt lõi (doanh thu, bệnh nhân mới, chi phí) hàng tuần/tháng không?', label_en: 'Does your clinic track core KPIs (revenue, new patients, costs) weekly/monthly?', scale_labels_vi: { '1': 'Không theo dõi, chỉ biết khi cần nộp thuế', '2': 'Biết doanh thu tổng nhưng không có KPI chi tiết', '3': 'Theo dõi 1-2 chỉ số cơ bản, không nhất quán', '4': 'Có dashboard cơ bản với 5-10 KPIs theo dõi đều đặn', '5': 'Full KPI dashboard: 10+ metrics, real-time, automated' }, scale_labels_en: { '1': 'No tracking, only know when filing taxes', '2': 'Know total revenue but no detailed KPIs', '3': 'Track 1-2 basic metrics, inconsistent', '4': 'Basic dashboard with 5-10 KPIs tracked regularly', '5': 'Full KPI dashboard: 10+ metrics, real-time, automated' }, dimension: 'metrics' },
        { question_id: 'dl_q2', order_idx: 1, type: 'select', label_vi: 'Quyết định kinh doanh của bạn được đưa ra dựa trên dữ liệu hay trực giác (gut feeling) nhiều hơn?', label_en: 'Are your business decisions based more on data or gut feeling?', scale_labels_vi: { '1': 'Hoàn toàn gut feeling, không có dữ liệu', '2': 'Chủ yếu gut feeling, có vài con số tham khảo', '3': 'Kết hợp gut feeling và dữ liệu, ưu tiên gut', '4': 'Dữ liệu làm cơ sở chính, gut feeling bổ sung', '5': 'Hoàn toàn data-driven: mọi quyết định đều có data backing' }, scale_labels_en: { '1': 'Completely gut feeling, no data', '2': 'Mostly gut feeling, a few numbers for reference', '3': 'Mix of gut and data, gut is priority', '4': 'Data is the main basis, gut feeling supplements', '5': 'Completely data-driven: every decision has data backing' }, dimension: 'metrics' },
        { question_id: 'dl_q3', order_idx: 2, type: 'select', label_vi: 'Nhân viên (bác sĩ, lễ tân) có được tham gia vào việc theo dõi KPIs không?', label_en: 'Are staff (doctors, receptionists) involved in tracking KPIs?', scale_labels_vi: { '1': 'Không, chỉ chủ phòng khám biết số liệu', '2': 'Biết vài con số tổng nhưng không hiểu KPIs', '3': 'Biết KPIs cơ bản, xem báo cáo tháng', '4': 'Được đào tạo hiểu KPIs + có KPIs cá nhân để theo dõi', '5': 'Team data culture: everyone tracks personal KPIs + weekly review' }, scale_labels_en: { '1': 'No, only the owner knows the numbers', '2': 'Know a few totals but don\'t understand KPIs', '3': 'Know basic KPIs, see monthly reports', '4': 'Trained to understand KPIs + have personal KPIs to track', '5': 'Team data culture: everyone tracks personal KPIs + weekly review' }, dimension: 'metrics' },
        { question_id: 'dl_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có lịch báo cáo định kỳ (hàng tuần/tháng) để review số liệu không?', label_en: 'Does your clinic have a regular reporting schedule (weekly/monthly) to review numbers?', scale_labels_vi: { '1': 'Không có lịch, xem số liệu tùy hứng', '2': 'Thỉnh thoảng xem khi rảnh', '3': 'Có họp tháng cơ bản để xem số liệu', '4': 'Weekly review meetings với data cập nhật', '5': 'Full rhythm: daily standup + weekly deep-dive + monthly strategy' }, scale_labels_en: { '1': 'No schedule, look at numbers ad-hoc', '2': 'Occasionally check when free', '3': 'Basic monthly meeting to review numbers', '4': 'Weekly review meetings with updated data', '5': 'Full rhythm: daily standup + weekly deep-dive + monthly strategy' }, dimension: 'metrics' },
        { question_id: 'dl_q5', order_idx: 4, type: 'select', label_vi: 'Phòng khám có sử dụng dữ liệu để lập kế hoạch và dự báo (forecasting) cho tương lai không?', label_en: 'Does your clinic use data to plan and forecast for the future?', scale_labels_vi: { '1': 'Không dự báo, sống từ ngày qua ngày', '2': 'Có ước lượng sơ bộ nhưng không có base data', '3': 'Có kế hoạch tháng/quý dựa trên data quá khứ', '4': 'Data-driven forecasting với scenario planning', '5': 'Full forecasting: predictive analytics + goal-setting + accountability' }, scale_labels_en: { '1': 'No forecasting, living day-to-day', '2': 'Rough estimates but no base data', '3': 'Monthly/quarterly plans based on past data', '4': 'Data-driven forecasting with scenario planning', '5': 'Full forecasting: predictive analytics + goal-setting + accountability' }, dimension: 'metrics' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế đo lường.',
      subtitle_en: 'Two open questions to face your measurement reality.',
      ref: 'Ch.4 — Quản Trị Phòng Khám',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'dl_open1', order_idx: 0, type: 'textarea', label_vi: 'Chỉ số (metric) nào quan trọng nhất với bạn trong việc đánh giá sức khỏe phòng khám? Tại sao chỉ số đó?', label_en: 'What metric is most important to you in assessing your clinic\'s health? Why that metric?', placeholder_vi: 'Nghĩ về chỉ số nào giúp bạn biết phòng khám đang đi đúng hướng hay cần thay đổi.', placeholder_en: 'Think about which metric helps you know if the clinic is on the right track or needs change.' },
        { question_id: 'dl_open2', order_idx: 1, type: 'textarea', label_vi: 'Bạn đang theo dõi (hoặc muốn theo dõi) những metrics nào mà hiện tại chưa có trong hệ thống?', label_en: 'What metrics are you tracking (or want to track) that you don\'t currently have in your system?', placeholder_vi: 'Liệt kê 1-3 metrics bạn muốn có nhưng chưa đo lường được. Điều gì ngăn bạn theo dõi chúng?', placeholder_en: 'List 1-3 metrics you want but are not currently tracking. What\'s preventing you from tracking them?' },
      ],
    },
  ],
};
