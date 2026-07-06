// Seed: Kho Vật Tư Check — inventory & supplies management
// Free scanner (is_free: 1), lead magnet để thu hút phòng khám quan tâm quản lý vật tư.
// 2 sections: 5 select (dimension) + 2 open-ended.

import type { SeedScanner } from './registry';

export const KHO_VAT_TU_CHECK_SEED: SeedScanner = {
  id: 'kho-vat-tu-check',
  slug: 'kho-vat-tu-check',
  title_vi: 'Kho Vật Tư Check',
  title_en: 'Inventory Check',
  description_vi: 'Quản lý vật tư kém = lãng phí tiền và thời gian. 7 câu hỏi giúp bạn đánh giá hệ thống kho vật tư của phòng khám.',
  description_en: 'Poor inventory management = wasted money and time. 7 questions to assess your clinic\'s inventory system.',
  subtitle_vi: 'Chẩn đoán nhanh hệ thống kho vật tư',
  subtitle_en: 'Quick diagnosis of your inventory management system',
  chapter_refs: ['Ch.5'],
  status: 'active',
  is_free: 1,
  survey_type: 'mini',
  order_index: 15,

  lead_fields: {
    clinic_name: { label_vi: 'Tên phòng khám', label_en: 'Clinic name', required: true, placeholder_vi: 'Nha Khoa ABC', type: 'text' },
    email: { label_vi: 'Email liên hệ', label_en: 'Contact email', required: true, placeholder_vi: 'ban@email.com', type: 'email' },
  },

  translations_vi: { submitButton: 'Xem kết quả', submitting: 'Đang xử lý...', required: 'bắt buộc', start: 'Bắt đầu →', back: '← Quay lại', next: 'Tiếp tục →', prev: '← Quay lại', intro_title: 'Kho Vật Tư Check', intro_desc: 'Quản lý vật tư kém = lãng phí tiền và thời gian. 7 câu hỏi giúp bạn đánh giá hệ thống kho vật tư của phòng khám.', restore_draft: 'Bạn có bản nháp chưa hoàn thành.', clear_draft: 'Xoá & bắt đầu lại', submit_title: 'Sẵn sàng xem kết quả?', submit_desc: 'Hệ thống sẽ tính điểm và hiển thị ngay.', step_label: 'Phần', submit_label: 'Gửi' },
  translations_en: { submitButton: 'See Result', submitting: 'Processing...', required: 'required', start: 'Start →', back: '← Back', next: 'Next →', prev: '← Back', intro_title: 'Inventory Check', intro_desc: 'Poor inventory management = wasted money and time. 7 questions to assess your clinic\'s inventory system.', restore_draft: 'You have an unfinished draft.', clear_draft: 'Clear & start over', submit_title: 'Ready to see results?', submit_desc: 'We will calculate and display your score immediately.', step_label: 'Part', submit_label: 'Submit' },

  scoring_rules: {
    dimensions: [{ id: 'inventory', name_vi: 'Quản lý Kho Vật Tư', name_en: 'Inventory Management', question_ids: ['kvt_q1', 'kvt_q2', 'kvt_q3', 'kvt_q4', 'kvt_q5'], formula: 'avg' }],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  },

  ai_config: {
    prompt_vi: 'Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Kho Vật Tư Check (điểm {{SCORE_INVENTORY}}/100 kèm 2 câu open-ended), phân tích hệ thống quản lý vật tư và đưa ra 3 cách giảm lãng phí. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.',
    prompt_en: 'You are Dr. Vinh — dental clinic management consultant. Based on the Inventory Check score ({{SCORE_INVENTORY}}/100 with 2 open-ended answers), analyze inventory management and suggest 3 ways to reduce waste. English, candid and warm tone. Quote their open-ended answers.',
    plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_INVENTORY}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày để cải thiện quản lý vật tư.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ',
    plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_INVENTORY}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan to improve inventory management.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words',
    model_override: null, max_tokens_override: 2048,
  },

  sections: [
    {
      order_idx: 0,
      title_vi: 'PHẦN 1: ĐÁNH GIÁ KHO',
      title_en: 'PART 1: INVENTORY EVALUATION',
      subtitle_vi: '5 chiều đánh giá: tracking, ordering, expiry, vendors, và waste.',
      subtitle_en: '5 evaluation dimensions: tracking, ordering, expiry, vendors, and waste.',
      ref: 'Ch.5 — Vận Hành Phòng Khám',
      icon: 'inventory_2',
      questions: [
        { question_id: 'kvt_q1', order_idx: 0, type: 'select', label_vi: 'Phòng khám có hệ thống theo dõi tồn kho (vật tư đang có, số lượng, vị trí) không?', label_en: 'Does your clinic have a system to track inventory (what\'s in stock, quantities, locations)?', scale_labels_vi: { '1': 'Không theo dõi, biết tồn kho trong đầu', '2': 'Có danh sách giấy nhưng không cập nhật thường xuyên', '3': 'Có bảng Excel theo dõi cơ bản, cập nhật thủ công', '4': 'Có phần mềm/công cụ theo dõi + có người phụ trách', '5': 'Full inventory system: software + real-time tracking + automated alerts' }, scale_labels_en: { '1': 'No tracking, know stock levels in head', '2': 'Paper list but not updated regularly', '3': 'Basic Excel tracking, manually updated', '4': 'Software/tool tracking + dedicated person responsible', '5': 'Full inventory system: software + real-time tracking + automated alerts' }, dimension: 'inventory' },
        { question_id: 'kvt_q2', order_idx: 1, type: 'select', label_vi: 'Quy trình đặt hàng vật tư (ordering) của phòng khám như thế nào?', label_en: 'How does your clinic\'s ordering process work?', scale_labels_vi: { '1': 'Không có quy trình, đặt khi hết thì thôi', '2': 'Đặt khi gần hết, không có kế hoạch', '3': 'Có đặt định kỳ nhưng không tối ưu về số lượng/giá', '4': 'Có quy trình đặt hàng chuẩn + reorder points + safety stock', '5': 'Full procurement: vendor contracts + volume discounts + auto-reorder' }, scale_labels_en: { '1': 'No process, order when running out', '2': 'Order when almost empty, no planning', '3': 'Periodic ordering but not optimized for quantity/price', '4': 'Standard ordering process + reorder points + safety stock', '5': 'Full procurement: vendor contracts + volume discounts + auto-reorder' }, dimension: 'inventory' },
        { question_id: 'kvt_q3', order_idx: 2, type: 'select', label_vi: 'Phòng khám có quản lý hạn sử dụng vật tư (dược phẩm, vật liệu) để tránh lãng phí không?', label_en: 'Does your clinic manage expiry dates of supplies (pharmaceuticals, materials) to avoid waste?', scale_labels_vi: { '1': 'Không theo dõi hạn sử dụng, dùng đến đâu hay đến đó', '2': 'Biết có vật tư hết hạn nhưng không có hệ thống kiểm tra', '3': 'Kiểm tra tay thỉnh thoảng khi nhớ', '4': 'Có kiểm tra định kỳ + có FEFO (first-expire-first-out)', '5': 'Full expiry management: FEFO + automated alerts + disposal SOP' }, scale_labels_en: { '1': 'No expiry tracking, use until done', '2': 'Aware of expired items but no checking system', '3': 'Manual checking occasionally', '4': 'Regular checking + FEFO (first-expire-first-out)', '5': 'Full expiry management: FEFO + automated alerts + disposal SOP' }, dimension: 'inventory' },
        { question_id: 'kvt_q4', order_idx: 3, type: 'select', label_vi: 'Phòng khám có mối quan hệ với nhà cung cấp (vendors) để được giá tốt và giao hàng nhanh không?', label_en: 'Does your clinic have vendor relationships for good prices and fast delivery?', scale_labels_vi: { '1': 'Mua ở đâu rẻ ở đó, không có mối quan hệ', '2': 'Có 1-2 vendors quen nhưng không có deal đặc biệt', '3': 'Có vendors chính với giá thỏa thuận cơ bản', '4': 'Có vendor partnerships + volume discounts + priority delivery', '5': 'Full vendor management: contracts + best pricing + contingency suppliers' }, scale_labels_en: { '1': 'Buy wherever is cheap, no relationships', '2': 'Have 1-2 regular vendors but no special deals', '3': 'Have main vendors with basic price agreements', '4': 'Vendor partnerships + volume discounts + priority delivery', '5': 'Full vendor management: contracts + best pricing + contingency suppliers' }, dimension: 'inventory' },
        { question_id: 'kvt_q5', order_idx: 4, type: 'select', label_vi: 'Lãng phí vật tư (hết hạn, hư, thất lạc, mua dư) của phòng khám ở mức nào?', label_en: 'What is your clinic\'s level of inventory waste (expired, damaged, lost, over-purchased)?', scale_labels_vi: { '1': 'Lãng phí cao — không biết bao nhiêu%, có thể 10-20%+', '2': 'Có lãng phí nhưng không theo dõi cụ thể', '3': 'Biết có lãng phí, ước lượng khoảng 5-10%', '4': 'Theo dõi lãng phí, dưới 5% và đang giảm', '5': 'Near-zero waste: tracked + <2% + continuous improvement system' }, scale_labels_en: { '1': 'High waste — don\'t know how much, possibly 10-20%+', '2': 'Some waste but not tracked specifically', '3': 'Aware of waste, estimate about 5-10%', '4': 'Waste tracked, under 5% and decreasing', '5': 'Near-zero waste: tracked + <2% + continuous improvement system' }, dimension: 'inventory' },
      ],
    },
    {
      order_idx: 1,
      title_vi: 'PHẦN 2: TỰ SOI CHIẾU',
      title_en: 'PART 2: SELF-REFLECTION',
      subtitle_vi: 'Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế kho vật tư.',
      subtitle_en: 'Two open questions to face your inventory reality.',
      ref: 'Ch.5 — Vận Hành Phòng Khám',
      icon: 'psychology_alt',
      questions: [
        { question_id: 'kvt_open1', order_idx: 0, type: 'textarea', label_vi: 'Vấn đề vật tư lớn nhất bạn đang gặp phải là gì? (Hết hàng khi cần, dư thừa, hỏng nhiều, giá cao...) Kể một tình huống cụ thể gần đây.', label_en: 'What is your biggest inventory problem? (Running out when needed, overstocking, lots of damage, high prices...) Describe a recent specific situation.', placeholder_vi: 'Mô tả ngắn gọn vấn đề vật tư gây ảnh hưởng nhiều nhất đến công việc hàng ngày.', placeholder_en: 'Briefly describe the inventory problem that affects your daily work the most.' },
        { question_id: 'kvt_open2', order_idx: 1, type: 'textarea', label_vi: 'Nếu bạn có thể tối ưu hóa một điều về quản lý vật tư ngay bây giờ, bạn sẽ chọn điều gì? Nó sẽ tiết kiệm được bao nhiêu/tháng?', label_en: 'If you could optimize one thing about inventory management right now, what would it be? How much would it save per month?', placeholder_vi: 'Nghĩ về điều đơn giản nhất có thể làm ngay để giảm lãng phí hoặc tiết kiệm chi phí.', placeholder_en: 'Think about the simplest thing you could do right away to reduce waste or save costs.' },
      ],
    },
  ],
};
