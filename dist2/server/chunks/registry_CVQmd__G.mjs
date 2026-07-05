globalThis.process ??= {};
globalThis.process.env ??= {};
import { H as HO_SO_GOC_RE_SEED } from "./ho-so-goc-re_Ngf1_kpb.mjs";
const HE_THONG_CHECK_SEED = {
  id: "he-thong-check",
  slug: "he-thong-check",
  title_vi: "Hệ Thống Check",
  title_en: "Systems Check",
  description_vi: "Phòng khám của bạn đã thực sự là một hệ thống chưa? 7 câu hỏi giúp bạn nhìn rõ mức độ hệ thống hóa hiện tại — và đâu là điểm cần ưu tiên xây dựng ngay.",
  description_en: "Is your clinic truly a system? 7 questions to see your current systemization level — and what to prioritize building first.",
  subtitle_vi: "Chẩn đoán nhanh theo Chương 1 — Triển Khai Hệ Thống",
  subtitle_en: "Quick diagnosis based on Chapter 1 — System Deployment",
  chapter_refs: ["Ch.1"],
  status: "active",
  is_free: 1,
  survey_type: "mini",
  order_index: 1,
  lead_fields: {
    clinic_name: {
      label_vi: "Tên phòng khám",
      label_en: "Clinic name",
      required: true,
      placeholder_vi: "Nha Khoa ABC",
      type: "text"
    },
    email: {
      label_vi: "Email liên hệ",
      label_en: "Contact email",
      required: true,
      placeholder_vi: "ban@email.com",
      type: "email"
    }
  },
  translations_vi: {
    submitButton: "Xem kết quả",
    submitting: "Đang xử lý...",
    required: "bắt buộc",
    start: "Bắt đầu →",
    back: "← Quay lại",
    next: "Tiếp tục →",
    prev: "← Quay lại",
    intro_title: "Hệ Thống Check",
    intro_desc: "Trước khi vận hành hiệu quả, phòng khám cần có HỆ THỐNG. 7 câu hỏi giúp bạn nhìn rõ mức độ hệ thống hóa — và những điểm cần soi chiếu ngay.",
    restore_draft: "Bạn có bản nháp chưa hoàn thành.",
    clear_draft: "Xoá & bắt đầu lại",
    submit_title: "Sẵn sàng xem kết quả?",
    submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.",
    step_label: "Phần",
    submit_label: "Gửi"
  },
  translations_en: {
    submitButton: "See Result",
    submitting: "Processing...",
    required: "required",
    start: "Start →",
    back: "← Back",
    next: "Next →",
    prev: "← Back",
    intro_title: "Systems Check",
    intro_desc: "Before running efficiently, your clinic needs SYSTEMS. 7 questions to see your systemization level — and what needs immediate illumination.",
    restore_draft: "You have an unfinished draft.",
    clear_draft: "Clear & start over",
    submit_title: "Ready to see results?",
    submit_desc: "We will calculate and display your score immediately.",
    step_label: "Part",
    submit_label: "Submit"
  },
  scoring_rules: {
    dimensions: [
      {
        id: "systems",
        name_vi: "Hệ thống hóa",
        name_en: "Systemization",
        question_ids: ["sys_q1", "sys_q2", "sys_q3", "sys_q4", "sys_q5"],
        formula: "avg"
      }
    ],
    total_formula: "average",
    thresholds: {
      excellent: 75,
      good: 55,
      needs_work: 35,
      critical: 0
    }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Hệ Thống Check (điểm {{SCORE_SYSTEMS}}/100 kèm 2 câu open-ended), phân tích ngắn gọn mức độ hệ thống hóa và đưa ra 3 hành động ưu tiên trong tuần này. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended của họ.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Systems Check score ({{SCORE_SYSTEMS}}/100 with 2 open-ended answers), briefly analyze the systemization level and suggest 3 priority actions this week. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_HE_THONG}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_HE_THONG}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: MỨC ĐỘ HỆ THỐNG HÓA",
      title_en: "PART 1: SYSTEMIZATION LEVEL",
      subtitle_vi: "Đánh giá 5 chiều hệ thống — tài liệu, vận hành, công cụ, ra quyết định, và học từ sai sót.",
      subtitle_en: "Evaluate 5 system dimensions — documentation, operations, tools, decision-making, and learning from mistakes.",
      ref: "Ch.1 — Triển Khai Hệ Thống",
      icon: "settings",
      questions: [
        {
          question_id: "sys_q1",
          order_idx: 0,
          type: "select",
          label_vi: "Phòng khám đã có quy trình vận hành được viết ra (SOP) cho các hoạt động chính chưa?",
          label_en: "Has your clinic written SOPs for its main operations?",
          scale_labels_vi: {
            "1": "Chưa có gì",
            "2": "Vài quy trình trong đầu, chưa viết",
            "3": "Có viết nhưng nằm trên giấy, ít ai dùng",
            "4": "Có, mọi người đều biết và dùng",
            "5": "Đầy đủ, sống trong văn hóa làm việc"
          },
          scale_labels_en: {
            "1": "Nothing yet",
            "2": "Some in our heads, not written",
            "3": "Written but on paper, few use them",
            "4": "Yes, everyone knows and uses them",
            "5": "Complete, alive in our work culture"
          },
          dimension: "systems"
        },
        {
          question_id: "sys_q2",
          order_idx: 1,
          type: "select",
          label_vi: "Khi một nhân sự nghỉ đột ngột, phòng khám có thể tiếp tục vận hành bình thường trong bao lâu?",
          label_en: "When a staff member leaves abruptly, how long can the clinic keep operating normally?",
          scale_labels_vi: {
            "1": "Ngay lập tức khủng hoảng",
            "2": "1-2 tuần lộn xộn",
            "3": "1 tháng",
            "4": "1-3 tháng",
            "5": "Trên 3 tháng — hệ thống tự vận hành"
          },
          scale_labels_en: {
            "1": "Immediate crisis",
            "2": "1-2 weeks of chaos",
            "3": "1 month",
            "4": "1-3 months",
            "5": "Over 3 months — system runs itself"
          },
          dimension: "systems"
        },
        {
          question_id: "sys_q3",
          order_idx: 2,
          type: "select",
          label_vi: "Bạn có đang sử dụng công cụ quản lý (phần mềm, app, sheet) để theo dõi công việc hàng ngày không?",
          label_en: "Do you use management tools (software, app, sheets) to track daily work?",
          scale_labels_vi: {
            "1": "Chỉ dùng giấy/Excel rời rạc",
            "2": "Vài công cụ nhưng không liên kết",
            "3": "Có phần mềm chính + Excel phụ",
            "4": "Có hệ thống liên kết, mọi người dùng",
            "5": "Tích hợp đầy đủ, dữ liệu chảy tự động"
          },
          scale_labels_en: {
            "1": "Only paper/scattered Excel",
            "2": "Some tools but not linked",
            "3": "Main software + Excel helpers",
            "4": "Linked system, everyone uses",
            "5": "Fully integrated, automatic data flow"
          },
          dimension: "systems"
        },
        {
          question_id: "sys_q4",
          order_idx: 3,
          type: "select",
          label_vi: "Các quyết định quan trọng trong phòng khám được đưa ra như thế nào?",
          label_en: "How are important decisions made in your clinic?",
          scale_labels_vi: {
            "1": "Tôi quyết một mình, mọi người chờ",
            "2": "Tôi hỏi vài người rồi quyết",
            "3": "Có cuộc họp nhưng quyết cuối vẫn là tôi",
            "4": "Có quy trình ra quyết định rõ ràng",
            "5": "Mọi người có thẩm quyền tự quyết trong phạm vi"
          },
          scale_labels_en: {
            "1": "I decide alone, everyone waits",
            "2": "I ask a few, then decide",
            "3": "Meetings happen but I decide",
            "4": "Clear decision-making process",
            "5": "People have authority in their scope"
          },
          dimension: "systems"
        },
        {
          question_id: "sys_q5",
          order_idx: 4,
          type: "select",
          label_vi: "Khi có sự cố (tai biến, khiếu nại, sai sót), phòng khám có quy trình xử lý và học từ đó không?",
          label_en: "When incidents happen (adverse events, complaints, errors), do you have a process to handle and learn from them?",
          scale_labels_vi: {
            "1": "Không có quy trình, mỗi lần xử lý khác nhau",
            "2": "Xử lý xong rồi thôi, không học",
            "3": "Có họp rút kinh nghiệm nhưng không có hệ thống",
            "4": "Có quy trình xử lý + học từ lỗi",
            "5": "Có hệ thống root-cause analysis, cải tiến liên tục"
          },
          scale_labels_en: {
            "1": "No process, each case handled differently",
            "2": "Handle and forget, no learning",
            "3": "Sometimes debrief but no system",
            "4": "Process + learn from errors",
            "5": "Root-cause analysis + continuous improvement"
          },
          dimension: "systems"
        }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế — và chọn điểm ưu tiên xây dựng trước.",
      subtitle_en: "Two open questions to face the reality — and choose what to build first.",
      ref: "Ch.1 — Triển Khai Hệ Thống",
      icon: "psychology_alt",
      questions: [
        {
          question_id: "sys_open1",
          order_idx: 0,
          type: "textarea",
          label_vi: "Hệ thống nào trong phòng khám đang gây ra nhiều vấn đề nhất? Mô tả một tình huống cụ thể gần đây mà hệ thống yếu đã ảnh hưởng đến bệnh nhân hoặc nhân sự.",
          label_en: "Which system in your clinic is causing the most problems? Describe a recent specific situation where a weak system affected a patient or staff member.",
          placeholder_vi: 'Ví dụ: "Ca tết nhân sự bị lỗi vì không ai biết rõ SOP tiếp nhận BN mới..."',
          placeholder_en: 'e.g.: "The New Year patient case failed because no one knew the new patient intake SOP..."'
        },
        {
          question_id: "sys_open2",
          order_idx: 1,
          type: "textarea",
          label_vi: "Nếu bạn có 1 tháng để cải thiện hệ thống phòng khám, bạn sẽ làm gì đầu tiên? Tại sao lại chọn điều đó?",
          label_en: "If you had 1 month to improve your clinic systems, what would you do first? Why that choice?",
          placeholder_vi: "Mô tả ngắn gọn — không cần hoàn hảo, chỉ cần thật.",
          placeholder_en: "Brief description — perfect not required, just honest."
        }
      ]
    }
  ]
};
const NHAN_SU_CHECK_SEED = {
  id: "nhan-su-check",
  slug: "nhan-su-check",
  title_vi: "Nhân Sự Check",
  title_en: "People Check",
  description_vi: "Đội ngũ là xương sống phòng khám. 7 câu hỏi giúp bạn nhìn rõ sức khỏe đội ngũ — và đâu là điểm cần ưu tiên cải thiện.",
  description_en: "Your team is the backbone of the clinic. 7 questions to see your team health — and what needs priority improvement.",
  subtitle_vi: "Chẩn đoán nhanh theo Chương 2 — Quản Trị Nhân Sự",
  subtitle_en: "Quick diagnosis based on Chapter 2 — People Management",
  chapter_refs: ["Ch.2"],
  status: "active",
  is_free: 1,
  survey_type: "mini",
  order_index: 2,
  lead_fields: {
    clinic_name: {
      label_vi: "Tên phòng khám",
      label_en: "Clinic name",
      required: true,
      placeholder_vi: "Nha Khoa ABC",
      type: "text"
    },
    email: {
      label_vi: "Email liên hệ",
      label_en: "Contact email",
      required: true,
      placeholder_vi: "ban@email.com",
      type: "email"
    },
    staff_count: {
      label_vi: "Số nhân sự hiện tại",
      label_en: "Current staff count",
      required: false,
      placeholder_vi: "8",
      type: "number"
    }
  },
  translations_vi: {
    submitButton: "Xem kết quả",
    submitting: "Đang xử lý...",
    required: "bắt buộc",
    start: "Bắt đầu →",
    back: "← Quay lại",
    next: "Tiếp tục →",
    prev: "← Quay lại",
    intro_title: "Nhân Sự Check",
    intro_desc: "7 câu hỏi giúp bạn nhìn rõ sức khỏe đội ngũ — tuyển dụng, đào tạo, giữ chân, và mức độ alignment giữa các thành viên.",
    restore_draft: "Bạn có bản nháp chưa hoàn thành.",
    clear_draft: "Xoá & bắt đầu lại",
    submit_title: "Sẵn sàng xem kết quả?",
    submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.",
    step_label: "Phần",
    submit_label: "Gửi"
  },
  translations_en: {
    submitButton: "See Result",
    submitting: "Processing...",
    required: "required",
    start: "Start →",
    back: "← Back",
    next: "Next →",
    prev: "← Back",
    intro_title: "People Check",
    intro_desc: "7 questions to see your team health — hiring, training, retention, and team alignment.",
    restore_draft: "You have an unfinished draft.",
    clear_draft: "Clear & start over",
    submit_title: "Ready to see results?",
    submit_desc: "We will calculate and display your score immediately.",
    step_label: "Part",
    submit_label: "Submit"
  },
  scoring_rules: {
    dimensions: [
      {
        id: "people",
        name_vi: "Sức khỏe đội ngũ",
        name_en: "Team health",
        question_ids: ["ppl_q1", "ppl_q2", "ppl_q3", "ppl_q4", "ppl_q5"],
        formula: "avg"
      }
    ],
    total_formula: "average",
    thresholds: {
      excellent: 75,
      good: 55,
      needs_work: 35,
      critical: 0
    }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Nhân Sự Check (điểm {{SCORE_PEOPLE}}/100 kèm 2 câu open-ended), phân tích ngắn gọn sức khỏe đội ngũ và đưa ra 3 hành động ưu tiên trong 2 tuần tới. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the People Check score ({{SCORE_PEOPLE}}/100 with 2 open-ended answers), briefly analyze team health and suggest 3 priority actions in 2 weeks. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_NHAN_SU}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_NHAN_SU}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ ĐỘI NGŨ",
      title_en: "PART 1: TEAM EVALUATION",
      subtitle_vi: "5 chiều đánh giá: tuyển dụng, onboarding, đào tạo, giữ chân, và alignment giá trị.",
      subtitle_en: "5 evaluation dimensions: hiring, onboarding, training, retention, and values alignment.",
      ref: "Ch.2 — Quản Trị Nhân Sự",
      icon: "groups",
      questions: [
        {
          question_id: "ppl_q1",
          order_idx: 0,
          type: "select",
          label_vi: "Bạn có quy trình tuyển dụng rõ ràng (JD, phỏng vấn nhiều vòng, test thực tế) không?",
          label_en: "Do you have a clear hiring process (JD, multi-round interviews, practical tests)?",
          scale_labels_vi: {
            "1": "Tuyển ai đó quen, không quy trình",
            "2": "Phỏng vấn 1 lần rồi quyết",
            "3": "Có JD, phỏng vấn 2 vòng",
            "4": "Quy trình đầy đủ, đánh giá cả giá trị lẫn năng lực",
            "5": "Đầy đủ + theo dõi hiệu quả sau 1-3-6 tháng"
          },
          scale_labels_en: {
            "1": "Hire someone we know, no process",
            "2": "One interview, decide",
            "3": "JD + 2-round interview",
            "4": "Full process, evaluate both values and skills",
            "5": "Full + track effectiveness at 1-3-6 months"
          },
          dimension: "people"
        },
        {
          question_id: "ppl_q2",
          order_idx: 1,
          type: "select",
          label_vi: "Khi nhân sự mới vào, có chương trình onboarding rõ ràng (training, mentorship, đánh giá) không?",
          label_en: "When new staff join, is there a clear onboarding program (training, mentorship, evaluation)?",
          scale_labels_vi: {
            "1": "Không có, học theo người cũ",
            "2": "Có nhưng không bài bản",
            "3": "Onboarding 1-2 tuần, có checklist",
            "4": "30-60-90 ngày có lộ trình rõ ràng",
            "5": "90 ngày + mentor + đánh giá 360 feedback"
          },
          scale_labels_en: {
            "1": "None, learn from seniors",
            "2": "Some but not systematic",
            "3": "1-2 weeks onboarding with checklist",
            "4": "30-60-90 days clear roadmap",
            "5": "90 days + mentor + 360 feedback"
          },
          dimension: "people"
        },
        {
          question_id: "ppl_q3",
          order_idx: 2,
          type: "select",
          label_vi: "Phòng khám có đánh giá hiệu quả nhân sự định kỳ (hàng quý/6 tháng) không?",
          label_en: "Do you have periodic performance reviews (quarterly/6-monthly)?",
          scale_labels_vi: {
            "1": "Không bao giờ",
            "2": "Khi có vấn đề mới đánh giá",
            "3": "Có nhưng không thường xuyên",
            "4": "Đánh giá định kỳ 6 tháng/lần",
            "5": "Đánh giá KPI + phát triển + lương thưởng liên kết"
          },
          scale_labels_en: {
            "1": "Never",
            "2": "Only when problems arise",
            "3": "Sometimes",
            "4": "Every 6 months",
            "5": "KPI review + development + comp linked"
          },
          dimension: "people"
        },
        {
          question_id: "ppl_q4",
          order_idx: 3,
          type: "select",
          label_vi: "Tỷ lệ nhân sự nghỉ việc trong 12 tháng qua khoảng bao nhiêu?",
          label_en: "What is your staff turnover rate in the last 12 months?",
          scale_labels_vi: {
            "1": "Trên 50% — bất ổn",
            "2": "30-50% — đáng lo",
            "3": "15-30% — chấp nhận được",
            "4": "5-15% — ổn định",
            "5": "Dưới 5% — gắn bó cao"
          },
          scale_labels_en: {
            "1": "Over 50% — unstable",
            "2": "30-50% — concerning",
            "3": "15-30% — acceptable",
            "4": "5-15% — stable",
            "5": "Under 5% — highly committed"
          },
          dimension: "people"
        },
        {
          question_id: "ppl_q5",
          order_idx: 4,
          type: "select",
          label_vi: "Khi nhân sự có vấn đề (vi phạm SOP, thái độ, chậm tiến), bạn xử lý như thế nào?",
          label_en: "When staff have issues (SOP violations, attitude, stagnation), how do you handle it?",
          scale_labels_vi: {
            "1": "Xử lý cảm tính, tùy trường hợp",
            "2": "Phạt nhẹ rồi thôi, không theo dõi",
            "3": "Có quy trình kỷ luật nhưng không nhất quán",
            "4": "Quy trình rõ ràng + coaching + theo dõi",
            "5": "Quy trình + coaching + kết nối với giá trị — mọi người hiểu TẠI SAO"
          },
          scale_labels_en: {
            "1": "Intuitive handling, case by case",
            "2": "Light punishment, then forget",
            "3": "Discipline process exists but inconsistent",
            "4": "Clear process + coaching + tracking",
            "5": "Process + coaching + values connection — everyone understands WHY"
          },
          dimension: "people"
        }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế đội ngũ.",
      subtitle_en: "Two open questions to face the team reality honestly.",
      ref: "Ch.2 — Quản Trị Nhân Sự",
      icon: "psychology_alt",
      questions: [
        {
          question_id: "ppl_open1",
          order_idx: 0,
          type: "textarea",
          label_vi: 'Trong đội ngũ hiện tại, người nào là "người phù hợp nhất với giá trị" và tại sao? Và người nào cần được phát triển thêm?',
          label_en: 'In your current team, who is "most aligned with values" and why? And who needs more development?',
          placeholder_vi: "Không cần nêu tên — chỉ mô tả vai trò và lý do cảm nhận.",
          placeholder_en: "No names needed — just describe the role and the reason for your assessment."
        },
        {
          question_id: "ppl_open2",
          order_idx: 1,
          type: "textarea",
          label_vi: "Bạn đang gặp khó khăn lớn nhất gì với đội ngũ hiện tại? Tại sao bạn nghĩ điều đó xảy ra?",
          label_en: "What is the biggest challenge with your current team? Why do you think it happens?",
          placeholder_vi: "Mô tả ngắn gọn — thiếu người, thiếu kỹ năng, không alignment giá trị, lương thưởng...?",
          placeholder_en: "Brief — understaffed, skill gaps, value misalignment, compensation...?"
        }
      ]
    }
  ]
};
const QUY_TRINH_CHECK_SEED = {
  id: "quy-trinh-check",
  slug: "quy-trinh-check",
  title_vi: "Quy Trình Check",
  title_en: "Processes Check",
  description_vi: 'Quy trình là xương sống vận hành. 7 câu hỏi giúp bạn nhìn rõ mức độ chuẩn hóa — và đâu là "nỗi đau" cần ưu tiên xây dựng ngay.',
  description_en: 'Processes are the backbone of operations. 7 questions to see your standardization level — and which "pain point" needs priority building.',
  subtitle_vi: "Chẩn đoán nhanh theo Chương 3 — Triển Khai Quy Trình",
  subtitle_en: "Quick diagnosis based on Chapter 3 — Process Deployment",
  chapter_refs: ["Ch.3"],
  status: "active",
  is_free: 1,
  survey_type: "mini",
  order_index: 3,
  lead_fields: {
    clinic_name: {
      label_vi: "Tên phòng khám",
      label_en: "Clinic name",
      required: true,
      placeholder_vi: "Nha Khoa ABC",
      type: "text"
    },
    email: {
      label_vi: "Email liên hệ",
      label_en: "Contact email",
      required: true,
      placeholder_vi: "ban@email.com",
      type: "email"
    },
    years_in_operation: {
      label_vi: "Số năm hoạt động",
      label_en: "Years in operation",
      required: false,
      placeholder_vi: "3",
      type: "number"
    }
  },
  translations_vi: {
    submitButton: "Xem kết quả",
    submitting: "Đang xử lý...",
    required: "bắt buộc",
    start: "Bắt đầu →",
    back: "← Quay lại",
    next: "Tiếp tục →",
    prev: "← Quay lại",
    intro_title: "Quy Trình Check",
    intro_desc: 'Không có quy trình thì mỗi lần một kiểu. 7 câu hỏi giúp bạn nhìn rõ quy trình nào đã chuẩn, quy trình nào còn "nỗi đau" và đâu là điểm cần ưu tiên xây dựng trong tháng tới.',
    restore_draft: "Bạn có bản nháp chưa hoàn thành.",
    clear_draft: "Xoá & bắt đầu lại",
    submit_title: "Sẵn sàng xem kết quả?",
    submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.",
    step_label: "Phần",
    submit_label: "Gửi"
  },
  translations_en: {
    submitButton: "See Result",
    submitting: "Processing...",
    required: "required",
    start: "Start →",
    back: "← Back",
    next: "Next →",
    prev: "← Back",
    intro_title: "Processes Check",
    intro_desc: 'Without processes, each time is different. 7 questions to see which processes are standardized, which are still "pain points", and where to prioritize building next month.',
    restore_draft: "You have an unfinished draft.",
    clear_draft: "Clear & start over",
    submit_title: "Ready to see results?",
    submit_desc: "We will calculate and display your score immediately.",
    step_label: "Part",
    submit_label: "Submit"
  },
  scoring_rules: {
    dimensions: [
      {
        id: "processes",
        name_vi: "Chuẩn hóa quy trình",
        name_en: "Process standardization",
        question_ids: ["qt_q1", "qt_q2", "qt_q3", "qt_q4", "qt_q5"],
        formula: "avg"
      }
    ],
    total_formula: "average",
    thresholds: {
      excellent: 75,
      good: 55,
      needs_work: 35,
      critical: 0
    }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Quy Trình Check (điểm {{SCORE_PROCESSES}}/100 kèm 2 câu open-ended), phân tích mức độ chuẩn hóa quy trình và đưa ra 3 quy trình cần ưu tiên xây dựng. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Processes Check score ({{SCORE_PROCESSES}}/100 with 2 open-ended answers), analyze process standardization and suggest 3 processes to prioritize. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_QUY_TRINH}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_QUY_TRINH}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ QUY TRÌNH",
      title_en: "PART 1: PROCESS EVALUATION",
      subtitle_vi: "5 chiều đánh giá: tiếp đón, tài chính, vô trùng, chuyển bệnh nhân, và đo lường cải tiến.",
      subtitle_en: "5 evaluation dimensions: reception, finance, sterilization, patient handoff, and improvement measurement.",
      ref: "Ch.3 — Triển Khai Quy Trình",
      icon: "account_tree",
      questions: [
        {
          question_id: "qt_q1",
          order_idx: 0,
          type: "select",
          label_vi: "Quy trình tiếp đón bệnh nhân mới có được viết (SOP), đào tạo, và đánh giá định kỳ không?",
          label_en: "Is the new patient reception process written (SOP), trained, and reviewed periodically?",
          scale_labels_vi: {
            "1": "Không có, mỗi nhân viên tự xử lý",
            "2": "Có nhưng nằm trong đầu, chưa viết",
            "3": "Có viết, nhưng ít ai đọc lại",
            "4": "SOP đầy đủ, có đào tạo khi vào",
            "5": "SOP + đào tạo + audit mỗi quý + cải tiến liên tục"
          },
          scale_labels_en: {
            "1": "None, each staff handles their own way",
            "2": "Some in heads, not written",
            "3": "Written but rarely re-read",
            "4": "Full SOP + onboarding training",
            "5": "SOP + training + quarterly audit + continuous improvement"
          },
          dimension: "processes"
        },
        {
          question_id: "qt_q2",
          order_idx: 1,
          type: "select",
          label_vi: "Quy trình thanh toán & xử lý khiếu nại tài chính với bệnh nhân đang vận hành thế nào?",
          label_en: "How does the payment and financial complaint handling process work?",
          scale_labels_vi: {
            "1": "Mỗi lần một kiểu, không có quy trình",
            "2": "Có hướng dẫn miệng, không nhất quán",
            "3": "Có quy trình viết, thu ngân theo",
            "4": "Có SOP + báo cáo hàng tuần + escalation rõ ràng",
            "5": "Tự động hóa + báo cáo realtime + liên tục tối ưu"
          },
          scale_labels_en: {
            "1": "Each time different, no process",
            "2": "Verbal guidance only, inconsistent",
            "3": "Written, cashier follows",
            "4": "SOP + weekly report + clear escalation",
            "5": "Automated + realtime report + continuous optimization"
          },
          dimension: "processes"
        },
        {
          question_id: "qt_q3",
          order_idx: 2,
          type: "select",
          label_vi: "Quy trình vô trùng dụng cụ có đạt chuẩn Bộ Y Tế và được kiểm tra định kỳ không?",
          label_en: "Does the instrument sterilization process meet MOH standards and get audited regularly?",
          scale_labels_vi: {
            "1": "Chưa kiểm tra, vô trùng theo cảm tính",
            "2": "Có quy trình nhưng không ai giám sát",
            "3": "Có SOP + checklist hàng ngày",
            "4": "Đạt chuẩn Bộ Y Tế + audit nội bộ hàng quý",
            "5": "Đạt ISO + tracking từng mẻ + culture an toàn bệnh nhân"
          },
          scale_labels_en: {
            "1": "Not checked, intuition-based",
            "2": "Process exists but no supervision",
            "3": "SOP + daily checklist",
            "4": "MOH standard + internal quarterly audit",
            "5": "ISO + batch tracking + patient safety culture"
          },
          dimension: "processes"
        },
        {
          question_id: "qt_q4",
          order_idx: 3,
          type: "select",
          label_vi: "Khi bệnh nhân chuyển tay giữa các bộ phận (lễ tân → bác sĩ → thu ngân), quy trình chuyển tiếp có rõ ràng không?",
          label_en: "When patients move between departments (reception → doctor → cashier), is the handoff process clear?",
          scale_labels_vi: {
            "1": "Bệnh nhân phải tự hỏi, ai rảnh đón",
            "2": "Có hướng dẫn miệng, hay sót",
            "3": "Có checklist ngầm, hầu hết thuộc",
            "4": "Quy trình chuẩn + giám sát chéo",
            "5": "Quy trình chuẩn + mọi người thuộc lòng + cải tiến từ feedback"
          },
          scale_labels_en: {
            "1": "Patients ask, whoever is free helps",
            "2": "Verbal guidance, often missed",
            "3": "Implicit checklist, mostly known",
            "4": "Standard process + cross-supervision",
            "5": "Standard + everyone knows + improved from feedback"
          },
          dimension: "processes"
        },
        {
          question_id: "qt_q5",
          order_idx: 4,
          type: "select",
          label_vi: "Các quy trình quan trọng có được đo lường hiệu quả và cải tiến định kỳ không?",
          label_en: "Are key processes measured for effectiveness and improved periodically?",
          scale_labels_vi: {
            "1": "Không đo, không cải tiến",
            "2": "Có cảm nhận nhưng không đo lường",
            "3": "Có đo nhưng không phân tích",
            "4": "Đo lường + họp review định kỳ",
            "5": "Đo lường + review + cải tiến liên tục (PDCA)"
          },
          scale_labels_en: {
            "1": "No measurement, no improvement",
            "2": "Feelings but no measurement",
            "3": "Measured but not analyzed",
            "4": "Measured + periodic review meetings",
            "5": "Measured + review + continuous improvement (PDCA)"
          },
          dimension: "processes"
        }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế quy trình.",
      subtitle_en: "Two open questions to face process reality honestly.",
      ref: "Ch.3 — Triển Khai Quy Trình",
      icon: "psychology_alt",
      questions: [
        {
          question_id: "qt_open1",
          order_idx: 0,
          type: "textarea",
          label_vi: 'Quy trình nào đang là "nỗi đau" lớn nhất của phòng khám? Mô tả một tình huống cụ thể gần đây mà quy trình yếu gây ảnh hưởng đến bệnh nhân.',
          label_en: 'Which process is the biggest "pain point" in your clinic? Describe a recent specific situation where a weak process affected a patient.',
          placeholder_vi: 'Ví dụ: "BN phàn nàn vì không ai thông báo bác sĩ vắng mặt, phải chờ 45 phút..."',
          placeholder_en: 'e.g.: "Patient complained because no one informed them the doctor was absent, waited 45 minutes..."'
        },
        {
          question_id: "qt_open2",
          order_idx: 1,
          type: "textarea",
          label_vi: "Nếu bạn phải chuẩn hóa chỉ 1 quy trình trong tháng tới, bạn sẽ chọn quy trình nào? Tại sao?",
          label_en: "If you had to standardize only 1 process next month, which would you choose? Why?",
          placeholder_vi: "Mô tả ngắn gọn — quy trình nào gây nhiều vấn đề nhất hoặc ảnh hưởng bệnh nhân nhiều nhất.",
          placeholder_en: "Brief — which process causes the most problems or impacts patients the most."
        }
      ]
    }
  ]
};
const TIEP_DON_CHECK_SEED = {
  id: "tiep-don-check",
  slug: "tiep-don-check",
  title_vi: "Tiếp Đón Check",
  title_en: "Patient Reception Check",
  description_vi: "Trải nghiệm bệnh nhân bắt đầu từ khoảnh khắc đặt chân vào phòng khám. 7 câu hỏi giúp bạn nhìn rõ thực tế tiếp đón — và đâu là điểm cần cải thiện ngay.",
  description_en: "Patient experience starts the moment they step into your clinic. 7 questions to see your current reception reality — and what needs immediate improvement.",
  subtitle_vi: "Chẩn đoán nhanh theo Chương 4 — Trải Nghiệm Bệnh Nhân",
  subtitle_en: "Quick diagnosis based on Chapter 4 — Patient Experience",
  chapter_refs: ["Ch.4"],
  status: "active",
  is_free: 1,
  survey_type: "mini",
  order_index: 4,
  lead_fields: {
    clinic_name: {
      label_vi: "Tên phòng khám",
      label_en: "Clinic name",
      required: true,
      placeholder_vi: "Nha Khoa ABC",
      type: "text"
    },
    email: {
      label_vi: "Email liên hệ",
      label_en: "Contact email",
      required: true,
      placeholder_vi: "ban@email.com",
      type: "email"
    },
    staff_count: {
      label_vi: "Số bệnh nhân trung bình / tháng",
      label_en: "Average patients per month",
      required: false,
      placeholder_vi: "200",
      type: "number"
    }
  },
  translations_vi: {
    submitButton: "Xem kết quả",
    submitting: "Đang xử lý...",
    required: "bắt buộc",
    start: "Bắt đầu →",
    back: "← Quay lại",
    next: "Tiếp tục →",
    prev: "← Quay lại",
    intro_title: "Tiếp Đón Check",
    intro_desc: "Bệnh nhân đánh giá phòng khám qua cảm nhận 5 giây đầu tiên. 7 câu hỏi giúp bạn nhìn rõ thực tế tiếp đón — và 3 điểm cần cải thiện ngay trong tuần.",
    restore_draft: "Bạn có bản nháp chưa hoàn thành.",
    clear_draft: "Xoá & bắt đầu lại",
    submit_title: "Sẵn sàng xem kết quả?",
    submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.",
    step_label: "Phần",
    submit_label: "Gửi"
  },
  translations_en: {
    submitButton: "See Result",
    submitting: "Processing...",
    required: "required",
    start: "Start →",
    back: "← Back",
    next: "Next →",
    prev: "← Back",
    intro_title: "Patient Reception Check",
    intro_desc: "Patients judge your clinic in the first 5 seconds. 7 questions to see your reception reality — and 3 things to improve this week.",
    restore_draft: "You have an unfinished draft.",
    clear_draft: "Clear & start over",
    submit_title: "Ready to see results?",
    submit_desc: "We will calculate and display your score immediately.",
    step_label: "Part",
    submit_label: "Submit"
  },
  scoring_rules: {
    dimensions: [
      {
        id: "experience",
        name_vi: "Trải nghiệm bệnh nhân",
        name_en: "Patient experience",
        question_ids: ["td_q1", "td_q2", "td_q3", "td_q4", "td_q5"],
        formula: "avg"
      }
    ],
    total_formula: "average",
    thresholds: {
      excellent: 75,
      good: 55,
      needs_work: 35,
      critical: 0
    }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Tiếp Đón Check (điểm {{SCORE_EXPERIENCE}}/100 kèm 2 câu open-ended), phân tích trải nghiệm bệnh nhân và đưa ra 3 điểm cần cải thiện ngay trong tuần. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Patient Reception Check score ({{SCORE_EXPERIENCE}}/100 with 2 open-ended answers), analyze patient experience and suggest 3 things to improve this week. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_TIEP_DON}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_TIEP_DON}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ TRẢI NGHIỆM",
      title_en: "PART 1: EXPERIENCE EVALUATION",
      subtitle_vi: "5 chiều đánh giá: chào đón, thời gian chờ, follow-up, xử lý phàn nàn, và cảm nhận tổng thể.",
      subtitle_en: "5 evaluation dimensions: welcoming, wait time, follow-up, complaint handling, and overall perception.",
      ref: "Ch.4 — Trải Nghiệm Bệnh Nhân",
      icon: "sentiment_satisfied",
      questions: [
        {
          question_id: "td_q1",
          order_idx: 0,
          type: "select",
          label_vi: "Khi bệnh nhân bước vào phòng khám, họ được chào đón như thế nào?",
          label_en: "When patients walk into your clinic, how are they welcomed?",
          scale_labels_vi: {
            "1": "Không ai đón, phải tự hỏi",
            "2": "Có người đón nhưng lạnh lùng, qua loa",
            "3": "Chào hỏi lịch sự, có chỉ dẫn",
            "4": "Chào tên + nụ cười + hỏi thăm tình hình",
            "5": "Chào tên + giới thiệu phương pháp + chỗ ngồi riêng"
          },
          scale_labels_en: {
            "1": "No one greets, must ask around",
            "2": "Someone greets but coldly",
            "3": "Polite greeting + direction",
            "4": "Greet by name + smile + ask about them",
            "5": "Greet by name + introduce process + private seating"
          },
          dimension: "experience"
        },
        {
          question_id: "td_q2",
          order_idx: 1,
          type: "select",
          label_vi: "Thời gian chờ trung bình từ khi bệnh nhân đến → gặp bác sĩ là bao lâu?",
          label_en: "How long do patients wait on average from arrival to seeing the doctor?",
          scale_labels_vi: {
            "1": "Trên 30 phút, hay phải chờ",
            "2": "20-30 phút",
            "3": "10-20 phút",
            "4": "5-10 phút",
            "5": "Dưới 5 phút + thông báo trước khi có delay"
          },
          scale_labels_en: {
            "1": "Over 30 min, often waiting",
            "2": "20-30 minutes",
            "3": "10-20 minutes",
            "4": "5-10 minutes",
            "5": "Under 5 min + advance notice if delayed"
          },
          dimension: "experience"
        },
        {
          question_id: "td_q3",
          order_idx: 2,
          type: "select",
          label_vi: "Sau khi khám xong, phòng khám có quy trình follow-up (24h, 7 ngày, 30 ngày) với bệnh nhân không?",
          label_en: "After treatment, does the clinic follow up with patients (24h, 7 days, 30 days)?",
          scale_labels_vi: {
            "1": "Không có, bệnh nhân tự quay lại nếu cần",
            "2": "Có nhắc lịch tái khám nhưng không nhất quán",
            "3": "Có nhắc lịch + gọi hỏi thăm 1 lần",
            "4": "Có hệ thống nhắc Zalo/SMS + theo dõi",
            "5": "Tự động hóa đầy đủ + cá nhân hóa theo case"
          },
          scale_labels_en: {
            "1": "No follow-up, patient returns if needed",
            "2": "Recall sometimes, not consistent",
            "3": "Recall + one check-in call",
            "4": "Zalo/SMS system + tracking",
            "5": "Full automation + personalization by case"
          },
          dimension: "experience"
        },
        {
          question_id: "td_q4",
          order_idx: 3,
          type: "select",
          label_vi: "Khi bệnh nhân phàn nàn hoặc không hài lòng, phòng khám tiếp nhận và xử lý qua kênh nào?",
          label_en: "When patients complain, how does the clinic receive and handle feedback?",
          scale_labels_vi: {
            "1": "Chỉ gặp mặt trực tiếp bác sĩ, hay bị bỏ qua",
            "2": "Có người tiếp nhận nhưng xử lý tùy hứng",
            "3": "Có quy trình tiếp nhận + xin lỗi",
            "4": "CRM tracking + escalation rõ ràng + rút kinh nghiệm",
            "5": "CRM + phân tích root cause + cải tiến quy trình liên tục"
          },
          scale_labels_en: {
            "1": "Only face-to-face with doctor, often missed",
            "2": "Someone receives but handles ad-hoc",
            "3": "Process + apology",
            "4": "CRM tracking + escalation + learning",
            "5": "CRM + root cause + continuous improvement"
          },
          dimension: "experience"
        },
        {
          question_id: "td_q5",
          order_idx: 4,
          type: "select",
          label_vi: "Bệnh nhân có cảm nhận rằng phòng khám quan tâm đến họ vượt ngoài việc điều trị không?",
          label_en: "Do patients feel that the clinic cares about them beyond just treatment?",
          scale_labels_vi: {
            "1": "Không, chỉ thấy dịch vụ y tế",
            "2": "Thỉnh thoảng được hỏi thăm",
            "3": "Có quan tâm nhưng không nhất quán",
            "4": "Được quan tâm trong hầu hết tương tác",
            "5": "Được quan tâm cá nhân hóa — cảm giác như người thân"
          },
          scale_labels_en: {
            "1": "No, only feel the medical service",
            "2": "Sometimes asked about their wellbeing",
            "3": "Cared for but inconsistently",
            "4": "Cared for in most interactions",
            "5": "Individually cared for — feels like family"
          },
          dimension: "experience"
        }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn từ góc nhìn bệnh nhân.",
      subtitle_en: "Two open questions to see from the patient perspective.",
      ref: "Ch.4 — Trải Nghiệm Bệnh Nhân",
      icon: "psychology_alt",
      questions: [
        {
          question_id: "td_open1",
          order_idx: 0,
          type: "textarea",
          label_vi: "Bệnh nhân hay phàn nàn điều gì nhất về phòng khám? Kể một tình huống cụ thể mà bạn nhớ rõ.",
          label_en: "What do patients complain about most? Share one specific situation you clearly remember.",
          placeholder_vi: "Chỉ ra 1-2 điều bệnh nhân hay phàn nàn nhất — chờ lâu, giá cao, không tư vấn rõ, không follow-up...?",
          placeholder_en: "Top 1-2 complaints — long wait, price, unclear consultation, no follow-up...?"
        },
        {
          question_id: "td_open2",
          order_idx: 1,
          type: "textarea",
          label_vi: "Nếu bạn là bệnh nhân bước vào phòng khám của chính mình, bạn sẽ cảm thấy điều gì? Điều gì khiến bạn hài lòng? Điều gì khiến bạn không hài lòng?",
          label_en: "If you were a patient walking into your own clinic, what would you feel? What would satisfy you? What would dissatisfy you?",
          placeholder_vi: "Hãy trung thực — đặt mình vào vị trí bệnh nhân lần đầu.",
          placeholder_en: "Be honest — put yourself in the shoes of a first-time patient."
        }
      ]
    }
  ]
};
const TAI_CHINH_CHECK_SEED = {
  id: "tai-chinh-check",
  slug: "tai-chinh-check",
  title_vi: "Tài Chính Check",
  title_en: "Finance Check",
  description_vi: "Tiền vào ra không kiểm soát = phòng khám đi đến bờ vực mà không biết. 7 câu hỏi giúp bạn nhìn rõ sức khỏe tài chính và chỉ số cần theo dõi ngay.",
  description_en: "Untracked cash flow = clinic heading to the edge without knowing. 7 questions to see your financial health and key metrics to monitor now.",
  subtitle_vi: "Chẩn đoán nhanh theo Chương 5 — Quản Trị Tài Chính Cơ Bản",
  subtitle_en: "Quick diagnosis based on Chapter 5 — Basic Finance Management",
  chapter_refs: ["Ch.5"],
  status: "active",
  is_free: 1,
  survey_type: "mini",
  order_index: 5,
  lead_fields: {
    clinic_name: {
      label_vi: "Tên phòng khám",
      label_en: "Clinic name",
      required: true,
      placeholder_vi: "Nha Khoa ABC",
      type: "text"
    },
    email: {
      label_vi: "Email liên hệ",
      label_en: "Contact email",
      required: true,
      placeholder_vi: "ban@email.com",
      type: "email"
    },
    years_in_operation: {
      label_vi: "Doanh thu trung bình / tháng (triệu VND)",
      label_en: "Average monthly revenue (M VND)",
      required: false,
      placeholder_vi: "500",
      type: "number"
    }
  },
  translations_vi: {
    submitButton: "Xem kết quả",
    submitting: "Đang xử lý...",
    required: "bắt buộc",
    start: "Bắt đầu →",
    back: "← Quay lại",
    next: "Tiếp tục →",
    prev: "← Quay lại",
    intro_title: "Tài Chính Check",
    intro_desc: "Không biết tiền vào ra = không kiểm soát được tương lai. 7 câu hỏi giúp bạn nhìn rõ sức khỏe tài chính — và 3 chỉ số cần theo dõi sát trong tháng tới.",
    restore_draft: "Bạn có bản nháp chưa hoàn thành.",
    clear_draft: "Xoá & bắt đầu lại",
    submit_title: "Sẵn sàng xem kết quả?",
    submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.",
    step_label: "Phần",
    submit_label: "Gửi"
  },
  translations_en: {
    submitButton: "See Result",
    submitting: "Processing...",
    required: "required",
    start: "Start →",
    back: "← Back",
    next: "Next →",
    prev: "← Back",
    intro_title: "Finance Check",
    intro_desc: "Without knowing cash flow = no control over your future. 7 questions to see your financial health — and 3 key metrics to track closely next month.",
    restore_draft: "You have an unfinished draft.",
    clear_draft: "Clear & start over",
    submit_title: "Ready to see results?",
    submit_desc: "We will calculate and display your score immediately.",
    step_label: "Part",
    submit_label: "Submit"
  },
  scoring_rules: {
    dimensions: [
      {
        id: "finance",
        name_vi: "Sức khỏe tài chính",
        name_en: "Financial health",
        question_ids: ["tc_q1", "tc_q2", "tc_q3", "tc_q4", "tc_q5"],
        formula: "avg"
      }
    ],
    total_formula: "average",
    thresholds: {
      excellent: 75,
      good: 55,
      needs_work: 35,
      critical: 0
    }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Tài Chính Check (điểm {{SCORE_FINANCE}}/100 kèm 2 câu open-ended), phân tích sức khỏe tài chính và đưa ra 3 chỉ số cần theo dõi sát. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Finance Check score ({{SCORE_FINANCE}}/100 with 2 open-ended answers), analyze financial health and suggest 3 metrics to track closely. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_TAI_CHINH}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_TAI_CHINH}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ TÀI CHÍNH",
      title_en: "PART 1: FINANCIAL EVALUATION",
      subtitle_vi: "5 chiều đánh giá: P&L, cash flow, phân loại chi phí, quỹ dự phòng, và lập kế hoạch.",
      subtitle_en: "5 evaluation dimensions: P&L, cash flow, expense categorization, emergency fund, and planning.",
      ref: "Ch.5 — Quản Trị Tài Chính Cơ Bản",
      icon: "payments",
      questions: [
        {
          question_id: "tc_q1",
          order_idx: 0,
          type: "select",
          label_vi: "Bạn có theo dõi doanh thu - chi phí - lợi nhuận hàng tháng không?",
          label_en: "Do you track revenue - expenses - profit monthly?",
          scale_labels_vi: {
            "1": "Không biết, chỉ nhìn số dư cuối ngày",
            "2": "Có nhưng rời rạc, không hệ thống",
            "3": "Có báo cáo hàng tháng cơ bản",
            "4": "Báo cáo P&L đầy đủ, hàng tuần cập nhật",
            "5": "P&L hàng tuần + dashboard realtime + phân tích biên lợi nhuận"
          },
          scale_labels_en: {
            "1": "Don't know, just see end-of-day balance",
            "2": "Some but scattered, not systematic",
            "3": "Basic monthly report",
            "4": "Full P&L, updated weekly",
            "5": "Weekly P&L + realtime dashboard + margin analysis"
          },
          dimension: "finance"
        },
        {
          question_id: "tc_q2",
          order_idx: 1,
          type: "select",
          label_vi: "Báo cáo dòng tiền (cash flow) được cập nhật khi nào?",
          label_en: "When is the cash flow report updated?",
          scale_labels_vi: {
            "1": "Không có, không biết cash flow là gì",
            "2": "Ngân hàng có nhưng không theo dõi",
            "3": "Có theo dõi hàng tháng",
            "4": "Cập nhật hàng tuần",
            "5": "Hàng ngày + dự báo dòng tiền 3 tháng tới"
          },
          scale_labels_en: {
            "1": "None, don't know cash flow",
            "2": "Bank has it but not tracked",
            "3": "Monthly tracking",
            "4": "Weekly updates",
            "5": "Daily + 3-month forecast"
          },
          dimension: "finance"
        },
        {
          question_id: "tc_q3",
          order_idx: 2,
          type: "select",
          label_vi: "Chi phí được phân loại (cố định, biến đổi, marketing, nhân sự) rõ ràng chưa?",
          label_en: "Are expenses clearly categorized (fixed, variable, marketing, payroll)?",
          scale_labels_vi: {
            "1": "Tính chung, không phân loại",
            "2": "Có chia nhưng không rõ ràng",
            "3": "Phân loại cơ bản 3-4 nhóm",
            "4": "Chi tiết theo từng danh mục + so sánh ngân sách",
            "5": "Chi tiết + gắn với KPI + phân tích chi phí trên doanh thu"
          },
          scale_labels_en: {
            "1": "All together, no categorization",
            "2": "Some division but unclear",
            "3": "Basic 3-4 categories",
            "4": "Detailed by category + budget vs actual",
            "5": "Detailed + KPI-linked + cost-to-revenue analysis"
          },
          dimension: "finance"
        },
        {
          question_id: "tc_q4",
          order_idx: 3,
          type: "select",
          label_vi: "Phòng khám có quỹ dự phòng cho 3-6 tháng khó khăn không?",
          label_en: "Does the clinic have a 3-6 month emergency fund?",
          scale_labels_vi: {
            "1": "Không có, dùng tiền đến đâu chi đến đó",
            "2": "Có nhưng chung với tiền hoạt động",
            "3": "Có tách riêng nhưng chỉ 1-2 tháng chi phí",
            "4": "Có 3-6 tháng chi phí, để riêng",
            "5": "6 tháng chi phí + tự động tách % doanh thu hàng tháng"
          },
          scale_labels_en: {
            "1": "No fund, spend as you earn",
            "2": "Some but mixed with operating cash",
            "3": "Separated but only 1-2 months expenses",
            "4": "3-6 months expenses, separated",
            "5": "6 months + auto-allocate % of monthly revenue"
          },
          dimension: "finance"
        },
        {
          question_id: "tc_q5",
          order_idx: 4,
          type: "select",
          label_vi: "Bạn có kế hoạch tài chính (ngân sách, mục tiêu lợi nhuận) cho 6-12 tháng tới không?",
          label_en: "Do you have a financial plan (budget, profit targets) for the next 6-12 months?",
          scale_labels_vi: {
            "1": "Không có kế hoạch",
            "2": "Có mục tiêu chung nhưng không chi tiết",
            "3": "Có ngân sách cơ bản cho từng tháng",
            "4": "Có kế hoạch chi tiết + theo dõi sát",
            "5": "Kế hoạch + scenario planning + dự báo"
          },
          scale_labels_en: {
            "1": "No financial plan",
            "2": "Vague goals but no detail",
            "3": "Basic monthly budget",
            "4": "Detailed plan + close tracking",
            "5": "Plan + scenario planning + forecasting"
          },
          dimension: "finance"
        }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế tài chính.",
      subtitle_en: "Two open questions to face financial reality honestly.",
      ref: "Ch.5 — Quản Trị Tài Chính Cơ Bản",
      icon: "psychology_alt",
      questions: [
        {
          question_id: "tc_open1",
          order_idx: 0,
          type: "textarea",
          label_vi: 'Khó khăn tài chính lớn nhất của phòng khám bạn hiện tại là gì? Mô tả một tình huống cụ thể — ví dụ: "Dòng tiền tháng vừa qua bị căng thẳng vì..."',
          label_en: 'What is the biggest financial challenge of your clinic right now? Describe a specific situation — e.g.: "Cash flow last month was tight because..."',
          placeholder_vi: "Mô tả ngắn gọn — thiếu vốn, dòng tiền bấp bênh, chi phí tăng, không biết lỗ/lãi...?",
          placeholder_en: "Brief — capital shortage, cash flow volatility, rising costs, no profit visibility...?"
        },
        {
          question_id: "tc_open2",
          order_idx: 1,
          type: "textarea",
          label_vi: "Nếu bạn phải chọn chỉ 1 chỉ số tài chính để theo dõi sát nhất, bạn sẽ chọn chỉ số nào? Tại sao?",
          label_en: "If you had to choose only 1 financial metric to track most closely, which would it be? Why?",
          placeholder_vi: "Ví dụ: biên lợi nhuận, cash flow, hay doanh thu per bác sĩ...?",
          placeholder_en: "e.g.: profit margin, cash flow, or revenue per doctor...?"
        }
      ]
    }
  ]
};
const AN_TOAN_CHECK_SEED = {
  id: "an-toan-check",
  slug: "an-toan-check",
  title_vi: "An Toàn Check",
  title_en: "Safety Check",
  description_vi: "An toàn là nền tảng không thể thương lượng. 7 câu hỏi giúp bạn đánh giá mức độ tuân thủ quy chuẩn an toàn trong phòng khám.",
  description_en: "Safety is non-negotiable. 7 questions to assess your clinic safety compliance level.",
  subtitle_vi: "Chẩn đoán nhanh theo Chương 6 — An Toàn & Tuân Thủ",
  subtitle_en: "Quick diagnosis based on Chapter 6 — Safety & Compliance",
  chapter_refs: ["Ch.6"],
  status: "active",
  is_free: 0,
  survey_type: "mini",
  order_index: 6,
  lead_fields: {
    clinic_name: { label_vi: "Tên phòng khám", label_en: "Clinic name", required: true, placeholder_vi: "Nha Khoa ABC", type: "text" },
    email: { label_vi: "Email liên hệ", label_en: "Contact email", required: true, placeholder_vi: "ban@email.com", type: "email" }
  },
  translations_vi: { submitButton: "Xem kết quả", submitting: "Đang xử lý...", required: "bắt buộc", start: "Bắt đầu →", back: "← Quay lại", next: "Tiếp tục →", prev: "← Quay lại", intro_title: "An Toàn Check", intro_desc: "An toàn là nền tảng không thể thương lượng. 7 câu hỏi giúp bạn đánh giá mức độ tuân thủ và an toàn trong phòng khám.", restore_draft: "Bạn có bản nháp chưa hoàn thành.", clear_draft: "Xoá & bắt đầu lại", submit_title: "Sẵn sàng xem kết quả?", submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.", step_label: "Phần", submit_label: "Gửi" },
  translations_en: { submitButton: "See Result", submitting: "Processing...", required: "required", start: "Start →", back: "← Back", next: "Next →", prev: "← Back", intro_title: "Safety Check", intro_desc: "Safety is non-negotiable. 7 questions to assess your clinic safety compliance level.", restore_draft: "You have an unfinished draft.", clear_draft: "Clear & start over", submit_title: "Ready to see results?", submit_desc: "We will calculate and display your score immediately.", step_label: "Part", submit_label: "Submit" },
  scoring_rules: {
    dimensions: [{ id: "safety", name_vi: "An toàn & Tuân thủ", name_en: "Safety & Compliance", question_ids: ["at_q1", "at_q2", "at_q3", "at_q4", "at_q5"], formula: "avg" }],
    total_formula: "average",
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả An Toàn Check (điểm {{SCORE_SAFETY}}/100 kèm 2 câu open-ended), phân tích mức độ tuân thủ an toàn và đưa ra 3 hành động ưu tiên để cải thiện trong tháng tới. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Safety Check score ({{SCORE_SAFETY}}/100 with 2 open-ended answers), analyze safety compliance and suggest 3 priority actions. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_AN_TOAN}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_AN_TOAN}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ AN TOÀN",
      title_en: "PART 1: SAFETY EVALUATION",
      subtitle_vi: "5 chiều đánh giá: giấy phép, vô trùng, PCCC, quản lý thuốc, và đào tạo khẩn cấp.",
      subtitle_en: "5 evaluation dimensions: licensing, sterilization, fire safety, drug management, and emergency training.",
      ref: "Ch.6 — An Toàn & Tuân Thủ",
      icon: "health_and_safety",
      questions: [
        { question_id: "at_q1", order_idx: 0, type: "select", label_vi: "Phòng khám có giấy phép hoạt động còn hiệu lực và đạt tiêu chuẩn PCCC không?", label_en: "Does your clinic have a valid operating license and fire safety certification?", scale_labels_vi: { "1": "Không rõ / chưa kiểm tra", "2": "Có nhưng chưa đầy đủ", "3": "Giấy phép có, PCCC cơ bản", "4": "Đầy đủ giấy phép + PCCC + kiểm tra định kỳ", "5": "Tất cả đạt + tự động nhắc gia hạn" }, scale_labels_en: { "1": "Don't know / not checked", "2": "Some but incomplete", "3": "License yes, basic fire safety", "4": "Full license + fire safety + periodic inspection", "5": "All compliant + auto-renewal reminders" }, dimension: "safety" },
        { question_id: "at_q2", order_idx: 1, type: "select", label_vi: "Quy trình vô trùng & khử khuẩn dụng cụ đạt chuẩn Bộ Y Tế và được ghi nhận không?", label_en: "Does instrument sterilization meet MOH standards and is it documented?", scale_labels_vi: { "1": "Theo cảm tính, không có checklist", "2": "Có quy trình nhưng không ghi nhận", "3": "Có SOP + checklist hàng ngày", "4": "Đạt chuẩn + tracking từng mẻ", "5": "ISO + tracking từng mẻ + audit nội bộ" }, scale_labels_en: { "1": "Intuition-based, no checklist", "2": "Process exists but not documented", "3": "SOP + daily checklist", "4": "Compliant + batch tracking", "5": "ISO + batch tracking + internal audit" }, dimension: "safety" },
        { question_id: "at_q3", order_idx: 2, type: "select", label_vi: "Nhân viên được đào tạo về xử lý tình huống khẩn cấp (cháy nổ, cấp cứu) chưa?", label_en: "Are staff trained on emergency response (fire, medical emergency)?", scale_labels_vi: { "1": "Không có, chưa từng tập", "2": "Một số người lớn tuổi có kinh nghiệm", "3": "Có hướng dẫn cơ bản", "4": "Đào tạo định kỳ + có kế hoạch sơ tán", "5": "Tập trung định kỳ + đánh giá + cập nhật" }, scale_labels_en: { "1": "No training ever", "2": "Some senior staff have experience", "3": "Basic guidelines exist", "4": "Regular training + evacuation plan", "5": "Regular drills + evaluation + updates" }, dimension: "safety" },
        { question_id: "at_q4", order_idx: 3, type: "select", label_vi: "Thuốc và vật tư y tế được quản lý theo quy định (nhiệt độ, hạn dùng, kê đơn) như thế nào?", label_en: "How are medicines and medical supplies managed (temperature, expiry, prescriptions)?", scale_labels_vi: { "1": "Không theo dõi, dùng đến đâu hay đến đó", "2": "Có nhưng không nhất quán", "3": "Kiểm tra nhiệt độ + hạn dùng cơ bản", "4": "Hệ thống theo dõi + kê đơn đầy đủ", "5": "Tự động nhắc hạn + báo cáo định kỳ" }, scale_labels_en: { "1": "Not tracked, use until gone", "2": "Some tracking but inconsistent", "3": "Basic temperature + expiry check", "4": "Monitoring system + full prescriptions", "5": "Auto expiry alerts + periodic reports" }, dimension: "safety" },
        { question_id: "at_q5", order_idx: 4, type: "select", label_vi: "Phòng khám có SOP cho tai biến y khoa (what to do when something goes wrong) chưa?", label_en: "Does your clinic have a SOP for medical adverse events (what to do when something goes wrong)?", scale_labels_vi: { "1": "Không có SOP, xử lý tùy tình huống", "2": "Có hướng dẫn miệng", "3": "Có SOP nhưng ít ai nhớ", "4": "Có SOP + đào tạo + ghi nhận", "5": "SOP + đào tạo + ghi nhận + root-cause analysis + cải tiến" }, scale_labels_en: { "1": "No SOP, handled case-by-case", "2": "Verbal guidance only", "3": "SOP exists but few remember it", "4": "SOP + training + documentation", "5": "SOP + training + documentation + root-cause analysis + improvement" }, dimension: "safety" }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào lỗ hổng an toàn.",
      subtitle_en: "Two open questions to face safety gaps honestly.",
      ref: "Ch.6 — An Toàn & Tuân Thủ",
      icon: "psychology_alt",
      questions: [
        { question_id: "at_open1", order_idx: 0, type: "textarea", label_vi: 'An toàn nào là "lỗ hổng" lớn nhất của phòng khám hiện tại? Mô tả một tình huống cụ thể gần đây liên quan đến an toàn mà bạn nhớ rõ.', label_en: "What is the biggest safety gap in your clinic right now? Describe a recent specific safety-related situation you clearly remember.", placeholder_vi: "Mô tả ngắn gọn — giấy phép, vô trùng, PCCC, quản lý thuốc, hay đào tạo nhân sự?", placeholder_en: "Brief — license, sterilization, fire safety, drug management, or staff training?" },
        { question_id: "at_open2", order_idx: 1, type: "textarea", label_vi: "Nếu cơ quan chức năng đến kiểm tra bất ngờ vào ngày mai, bạn có tự tin không? Điều gì khiến bạn lo nhất?", label_en: "If regulators came for an unannounced inspection tomorrow, would you be confident? What worries you most?", placeholder_vi: "Hãy trung thực — đây là câu hỏi để bạn tự đánh giá mức độ sẵn sàng.", placeholder_en: "Be honest — this is a self-assessment of your readiness level." }
      ]
    }
  ]
};
const MARKETING_CHECK_SEED = {
  id: "marketing-check",
  slug: "marketing-check",
  title_vi: "Marketing Check",
  title_en: "Marketing Check",
  description_vi: "Không có marketing = không có bệnh nhân mới. 7 câu hỏi giúp bạn đánh giá chiến lược tiếp cận và giữ chân bệnh nhân của phòng khám.",
  description_en: "No marketing = no new patients. 7 questions to assess your patient acquisition and retention strategy.",
  subtitle_vi: "Chẩn đoán nhanh theo Chương 7 — Marketing Phòng Khám",
  subtitle_en: "Quick diagnosis based on Chapter 7 — Clinic Marketing",
  chapter_refs: ["Ch.7"],
  status: "active",
  is_free: 0,
  survey_type: "mini",
  order_index: 7,
  lead_fields: {
    clinic_name: { label_vi: "Tên phòng khám", label_en: "Clinic name", required: true, placeholder_vi: "Nha Khoa ABC", type: "text" },
    email: { label_vi: "Email liên hệ", label_en: "Contact email", required: true, placeholder_vi: "ban@email.com", type: "email" }
  },
  translations_vi: { submitButton: "Xem kết quả", submitting: "Đang xử lý...", required: "bắt buộc", start: "Bắt đầu →", back: "← Quay lại", next: "Tiếp tục →", prev: "← Quay lại", intro_title: "Marketing Check", intro_desc: "Không có marketing = không có bệnh nhân mới. 7 câu hỏi giúp bạn đánh giá chiến lược tiếp cận và giữ chân bệnh nhân của phòng khám.", restore_draft: "Bạn có bản nháp chưa hoàn thành.", clear_draft: "Xoá & bắt đầu lại", submit_title: "Sẵn sàng xem kết quả?", submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.", step_label: "Phần", submit_label: "Gửi" },
  translations_en: { submitButton: "See Result", submitting: "Processing...", required: "required", start: "Start →", back: "← Back", next: "Next →", prev: "← Back", intro_title: "Marketing Check", intro_desc: "No marketing = no new patients. 7 questions to assess your patient acquisition and retention strategy.", restore_draft: "You have an unfinished draft.", clear_draft: "Clear & start over", submit_title: "Ready to see results?", submit_desc: "We will calculate and display your score immediately.", step_label: "Part", submit_label: "Submit" },
  scoring_rules: {
    dimensions: [{ id: "marketing", name_vi: "Chiến lược Marketing", name_en: "Marketing Strategy", question_ids: ["mkt_q1", "mkt_q2", "mkt_q3", "mkt_q4", "mkt_q5"], formula: "avg" }],
    total_formula: "average",
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Marketing Check (điểm {{SCORE_MARKETING}}/100 kèm 2 câu open-ended), phân tích chiến lược marketing và đưa ra 3 hành động cải thiện trong tháng tới. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Marketing Check score ({{SCORE_MARKETING}}/100 with 2 open-ended answers), analyze marketing strategy and suggest 3 improvement actions. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số Marketing: {{SCORE_MARKETING}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Marketing Score: {{SCORE_MARKETING}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ MARKETING",
      title_en: "PART 1: MARKETING EVALUATION",
      subtitle_vi: "5 chiều đánh giá: kênh tiếp cận, giữ chân, ROI, USP, và hiện diện online.",
      subtitle_en: "5 evaluation dimensions: acquisition channels, retention, ROI, USP, and online presence.",
      ref: "Ch.7 — Marketing Phòng Khám",
      icon: "campaign",
      questions: [
        { question_id: "mkt_q1", order_idx: 0, type: "select", label_vi: "Phòng khám tiếp cận bệnh nhân mới qua những kênh nào?", label_en: "What channels does your clinic use to reach new patients?", scale_labels_vi: { "1": "Chỉ qua giới thiệu miệng / khách quen", "2": "Có Facebook/Zalo nhưng không có chiến lược", "3": "Chạy quảng cáo Facebook/Google nhưng không đo ROI", "4": "Có chiến lược đa kênh + đo hiệu quả", "5": "Đa kênh + content marketing + CRM tự động" }, scale_labels_en: { "1": "Only word of mouth / regulars", "2": "Facebook/Zalo but no strategy", "3": "Running ads but not measuring ROI", "4": "Multi-channel strategy + ROI tracking", "5": "Multi-channel + content marketing + auto CRM" }, dimension: "marketing" },
        { question_id: "mkt_q2", order_idx: 1, type: "select", label_vi: "Bạn có hệ thống chăm sóc và giữ chân bệnh nhân cũ không?", label_en: "Do you have a system to care for and retain existing patients?", scale_labels_vi: { "1": "Không có, bệnh nhân quay lại tự nhiên", "2": "Có gọi nhắc lịch nhưng không nhất quán", "3": "Có chương trình chăm sóc định kỳ", "4": "CRM + chương trình loyalty + theo dõi LTV", "5": "Tự động hóa đầy đủ + phân tích LTV + upsell" }, scale_labels_en: { "1": "No system, patients return naturally", "2": "Recall calls but inconsistent", "3": "Periodic care program", "4": "CRM + loyalty program + LTV tracking", "5": "Full automation + LTV analysis + upsell" }, dimension: "marketing" },
        { question_id: "mkt_q3", order_idx: 2, type: "select", label_vi: "Chi phí marketing / doanh thu hàng tháng được theo dõi không?", label_en: "Is marketing spend as a % of revenue tracked monthly?", scale_labels_vi: { "1": "Không theo dõi, không biết bao nhiêu", "2": "Có tính tổng nhưng không chi tiết", "3": "Theo dõi cơ bản theo tổng", "4": "Chi tiết theo từng kênh + so sánh hiệu quả", "5": "Real-time dashboard + tối ưu hóa liên tục" }, scale_labels_en: { "1": "Don't track, don't know how much", "2": "Total known but no detail", "3": "Basic total tracking", "4": "Detailed per channel + ROI comparison", "5": "Real-time dashboard + continuous optimization" }, dimension: "marketing" },
        { question_id: "mkt_q4", order_idx: 3, type: "select", label_vi: 'Phòng khám có "USP" (điểm bán hàng độc nhất) rõ ràng không?', label_en: "Does your clinic have a clear Unique Selling Proposition (USP)?", scale_labels_vi: { "1": "Không biết USP là gì", "2": "Có nhưng chưa rõ ràng", "3": "Có USP cơ bản, dùng trong giới thiệu", "4": "USP rõ ràng + tích hợp vào mọi touchpoint", "5": "Brand identity mạnh + USP + storytelling" }, scale_labels_en: { "1": "Don't know what USP is", "2": "Some but not clear", "3": "Basic USP, used in introductions", "4": "Clear USP + integrated into every touchpoint", "5": "Strong brand identity + USP + storytelling" }, dimension: "marketing" },
        { question_id: "mkt_q5", order_idx: 4, type: "select", label_vi: "Phòng khám có chiến lược content (blog, video, educational) để xây dựng uy tín chuyên môn không?", label_en: "Does your clinic have a content strategy (blog, video, educational) to build professional credibility?", scale_labels_vi: { "1": "Không có content", "2": "Đăng bài ad-hoc, không có chiến lược", "3": "Có đăng đều nhưng không có chiến lược rõ", "4": "Content strategy + đều đặn + có KPI", "5": "Content machine + SEO + social proof + authority" }, scale_labels_en: { "1": "No content", "2": "Post ad-hoc, no strategy", "3": "Post regularly but no clear strategy", "4": "Content strategy + consistent + KPIs", "5": "Content machine + SEO + social proof + authority" }, dimension: "marketing" }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế marketing.",
      subtitle_en: "Two open questions to face marketing reality honestly.",
      ref: "Ch.7 — Marketing Phòng Khám",
      icon: "psychology_alt",
      questions: [
        { question_id: "mkt_open1", order_idx: 0, type: "textarea", label_vi: "Kênh marketing nào đang hoạt động tốt nhất và kênh nào đang lãng phí ngân sách? Mô tả một tình huống cụ thể.", label_en: "Which marketing channel is working best and which is wasting budget? Describe a specific situation.", placeholder_vi: "Liệt kê 1-2 kênh hiệu quả nhất và 1-2 kênh cần cải thiện hoặc loại bỏ.", placeholder_en: "List 1-2 best performing channels and 1-2 that need improvement or removal." },
        { question_id: "mkt_open2", order_idx: 1, type: "textarea", label_vi: "Nếu bạn có ngân sách marketing 10 triệu/tháng và chỉ tập trung vào 1 kênh, bạn sẽ chọn kênh nào? Tại sao?", label_en: "If you had a 10M VND/month marketing budget and could only focus on 1 channel, which would you choose? Why?", placeholder_vi: "Nghĩ về kênh nào mang lại bệnh nhân chất lượng nhất, không chỉ nhiều nhất.", placeholder_en: "Think about which channel brings the highest quality patients, not just the most." }
      ]
    }
  ]
};
const CSKH_CHECK_SEED = {
  id: "cskh-check",
  slug: "cskh-check",
  title_vi: "CSKH Check",
  title_en: "Customer Service Check",
  description_vi: "Dịch vụ khách hàng quyết định bệnh nhân quay lại hay không. 7 câu hỏi giúp bạn đánh giá chất lượng CSKH thực tế.",
  description_en: "Customer service determines whether patients return. 7 questions to assess your real CS quality.",
  subtitle_vi: "Chẩn đoán nhanh theo Chương 8 — Dịch Vụ Khách Hàng",
  subtitle_en: "Quick diagnosis based on Chapter 8 — Customer Service",
  chapter_refs: ["Ch.8"],
  status: "active",
  is_free: 0,
  survey_type: "mini",
  order_index: 8,
  lead_fields: {
    clinic_name: { label_vi: "Tên phòng khám", label_en: "Clinic name", required: true, placeholder_vi: "Nha Khoa ABC", type: "text" },
    email: { label_vi: "Email liên hệ", label_en: "Contact email", required: true, placeholder_vi: "ban@email.com", type: "email" }
  },
  translations_vi: { submitButton: "Xem kết quả", submitting: "Đang xử lý...", required: "bắt buộc", start: "Bắt đầu →", back: "← Quay lại", next: "Tiếp tục →", prev: "← Quay lại", intro_title: "CSKH Check", intro_desc: "Dịch vụ khách hàng quyết định bệnh nhân quay lại hay không. 7 câu hỏi giúp bạn đánh giá chất lượng CSKH thực tế.", restore_draft: "Bạn có bản nháp chưa hoàn thành.", clear_draft: "Xoá & bắt đầu lại", submit_title: "Sẵn sàng xem kết quả?", submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.", step_label: "Phần", submit_label: "Gửi" },
  translations_en: { submitButton: "See Result", submitting: "Processing...", required: "required", start: "Start →", back: "← Back", next: "Next →", prev: "← Back", intro_title: "CSKH Check", intro_desc: "Customer service determines whether patients return. 7 questions to assess your real CS quality.", restore_draft: "You have an unfinished draft.", clear_draft: "Clear & start over", submit_title: "Ready to see results?", submit_desc: "We will calculate and display your score immediately.", step_label: "Part", submit_label: "Submit" },
  scoring_rules: {
    dimensions: [{ id: "service", name_vi: "Chất lượng CSKH", name_en: "Customer Service Quality", question_ids: ["cskh_q1", "cskh_q2", "cskh_q3", "cskh_q4", "cskh_q5"], formula: "avg" }],
    total_formula: "average",
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả CSKH Check (điểm {{SCORE_SERVICE}}/100 kèm 2 câu open-ended), phân tích chất lượng dịch vụ khách hàng và đưa ra 3 điểm cần cải thiện ngay. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the CSKH Check score ({{SCORE_SERVICE}}/100 with 2 open-ended answers), analyze customer service quality and suggest 3 immediate improvements. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_CSKH}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_CSKH}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ CSKH",
      title_en: "PART 1: CS EVALUATION",
      subtitle_vi: "5 chiều đánh giá: tốc độ phản hồi, đào tạo nhân sự, thu thập feedback, xử lý khiếu nại, và follow-up.",
      subtitle_en: "5 evaluation dimensions: response speed, staff training, feedback collection, complaint handling, and follow-up.",
      ref: "Ch.8 — Dịch Vụ Khách Hàng",
      icon: "support_agent",
      questions: [
        { question_id: "cskh_q1", order_idx: 0, type: "select", label_vi: "Thời gian phản hồi trung bình khi bệnh nhân liên hệ (Zalo, điện thoại, email) là bao lâu?", label_en: "What is the average response time when patients contact you (Zalo, phone, email)?", scale_labels_vi: { "1": "Không phản hồi / trả lời rất chậm (2-3 ngày+)", "2": "1-2 ngày", "3": "Vài giờ đến 1 ngày", "4": "Trong giờ làm việc, dưới 2 giờ", "5": "Tự động phản hồi ngay + theo dõi SLA" }, scale_labels_en: { "1": "No response / very slow (2-3 days+)", "2": "1-2 days", "3": "A few hours to 1 day", "4": "Within working hours, under 2 hours", "5": "Instant auto-response + SLA tracking" }, dimension: "service" },
        { question_id: "cskh_q2", order_idx: 1, type: "select", label_vi: "Nhân viên CSKH được đào tạo về kỹ năng giao tiếp và xử lý khiếu nại chưa?", label_en: "Are CS staff trained on communication skills and complaint handling?", scale_labels_vi: { "1": "Không có đào tạo", "2": "Đào tạo cơ bản khi vào làm", "3": "Có đào tạo định kỳ 1-2 lần/năm", "4": "Training chuyên sâu + role-play + feedback", "5": "Continuous training + QA + coaching" }, scale_labels_en: { "1": "No training", "2": "Basic onboarding only", "3": "Periodic training 1-2x/year", "4": "Deep training + role-play + feedback", "5": "Continuous training + QA + coaching" }, dimension: "service" },
        { question_id: "cskh_q3", order_idx: 2, type: "select", label_vi: "Phòng khám có thu thập và phân tích phản hồi bệnh nhân (NPS, survey) không?", label_en: "Does your clinic collect and analyze patient feedback (NPS, survey)?", scale_labels_vi: { "1": "Không có, không thu thập", "2": "Có nghe phản hồi nhưng không hệ thống", "3": "Survey định kỳ 1-2 lần/năm", "4": "NPS hàng quý + phân tích root cause", "5": "Real-time feedback + NPS + action plan" }, scale_labels_en: { "1": "No collection at all", "2": "Informal feedback only", "3": "Periodic survey 1-2x/year", "4": "Quarterly NPS + root cause analysis", "5": "Real-time feedback + NPS + action plan" }, dimension: "service" },
        { question_id: "cskh_q4", order_idx: 3, type: "select", label_vi: "Khi có khiếu nại, quy trình xử lý và bồi thường ra sao?", label_en: "When a complaint arises, what is the handling process and compensation like?", scale_labels_vi: { "1": "Xử lý tùy tình huống, không có quy trình", "2": "Có quy trình nhưng không nhất quán", "3": "Có SOP xử lý khiếu nại + bồi thường theo quy định", "4": "SOP + compensation + rút kinh nghiệm + cải tiến", "5": "Full CRM + proactive resolution + recovery flowchart" }, scale_labels_en: { "1": "Handled case-by-case, no process", "2": "Process exists but inconsistent", "3": "SOP + compensation per policy", "4": "SOP + compensation + learning + improvement", "5": "Full CRM + proactive resolution + recovery flowchart" }, dimension: "service" },
        { question_id: "cskh_q5", order_idx: 4, type: "select", label_vi: 'Nhân viên có được train để "thấu cảm" với bệnh nhân (put yourself in their shoes) không?', label_en: "Are staff trained to empathize with patients (put yourself in their shoes)?", scale_labels_vi: { "1": "Không có đào tạo về thấu cảm", "2": "Có nhắc nhưng không có đào tạo chính thức", "3": "Đào tạo cơ bản về thấu cảm", "4": "Training chuyên sâu + role-play + đánh giá", "5": "Thấu cảm là văn hóa — mọi người tự nhiên thể hiện" }, scale_labels_en: { "1": "No empathy training", "2": "Reminded but no formal training", "3": "Basic empathy training", "4": "Deep training + role-play + evaluation", "5": "Empathy is the culture — everyone naturally demonstrates it" }, dimension: "service" }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn từ góc nhìn bệnh nhân.",
      subtitle_en: "Two open questions to see from the patient perspective.",
      ref: "Ch.8 — Dịch Vụ Khách Hàng",
      icon: "psychology_alt",
      questions: [
        { question_id: "cskh_open1", order_idx: 0, type: "textarea", label_vi: "Điều gì khiến bệnh nhân KHÔNG quay lại phòng khám của bạn? Kể một tình huống cụ thể mà bạn biết hoặc nghe được.", label_en: "What makes patients NOT return to your clinic? Describe a specific situation you know or heard about.", placeholder_vi: "Mô tả ngắn gọn — thái độ, thời gian chờ, giá cả, hay vấn đề khác?", placeholder_en: "Brief — attitude, wait time, pricing, or other issues?" },
        { question_id: "cskh_open2", order_idx: 1, type: "textarea", label_vi: "Kể một tình huống mà nhân viên của bạn đã xử lý khiếu nại hoặc làm bệnh nhân cực kỳ hài lòng. Điều gì đã làm nên sự khác biệt?", label_en: "Describe a situation where your staff handled a complaint or made a patient extremely satisfied. What made the difference?", placeholder_vi: "Có thể trích dẫn tin nhắn, review, hoặc lời kể của nhân viên.", placeholder_en: "You can quote a message, review, or staff story." }
      ]
    }
  ]
};
const VAN_HOA_CHECK_SEED = {
  id: "van-hoa-check",
  slug: "van-hoa-check",
  title_vi: "Văn Hóa Check",
  title_en: "Culture Check",
  description_vi: "Văn hóa là DNA của phòng khám. 7 câu hỏi giúp bạn đánh giá sức khỏe văn hóa nội bộ và mức độ gắn kết nhân viên.",
  description_en: "Culture is the DNA of your clinic. 7 questions to assess internal culture health and staff engagement.",
  subtitle_vi: "Chẩn đoán nhanh theo Chương 9 — Văn Hóa Phòng Khám",
  subtitle_en: "Quick diagnosis based on Chapter 9 — Clinic Culture",
  chapter_refs: ["Ch.9"],
  status: "active",
  is_free: 0,
  survey_type: "mini",
  order_index: 9,
  lead_fields: {
    clinic_name: { label_vi: "Tên phòng khám", label_en: "Clinic name", required: true, placeholder_vi: "Nha Khoa ABC", type: "text" },
    email: { label_vi: "Email liên hệ", label_en: "Contact email", required: true, placeholder_vi: "ban@email.com", type: "email" }
  },
  translations_vi: { submitButton: "Xem kết quả", submitting: "Đang xử lý...", required: "bắt buộc", start: "Bắt đầu →", back: "← Quay lại", next: "Tiếp tục →", prev: "← Quay lại", intro_title: "Văn Hóa Check", intro_desc: "Văn hóa là DNA của phòng khám. 7 câu hỏi giúp bạn đánh giá sức khỏe văn hóa nội bộ và mức độ gắn kết nhân viên.", restore_draft: "Bạn có bản nháp chưa hoàn thành.", clear_draft: "Xoá & bắt đầu lại", submit_title: "Sẵn sàng xem kết quả?", submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.", step_label: "Phần", submit_label: "Gửi" },
  translations_en: { submitButton: "See Result", submitting: "Processing...", required: "required", start: "Start →", back: "← Back", next: "Next →", prev: "← Back", intro_title: "Culture Check", intro_desc: "Culture is the DNA of your clinic. 7 questions to assess internal culture health and staff engagement.", restore_draft: "You have an unfinished draft.", clear_draft: "Clear & start over", submit_title: "Ready to see results?", submit_desc: "We will calculate and display your score immediately.", step_label: "Part", submit_label: "Submit" },
  scoring_rules: {
    dimensions: [{ id: "culture", name_vi: "Văn hóa nội bộ", name_en: "Internal Culture", question_ids: ["vh_q1", "vh_q2", "vh_q3", "vh_q4", "vh_q5"], formula: "avg" }],
    total_formula: "average",
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Văn Hóa Check (điểm {{SCORE_CULTURE}}/100 kèm 2 câu open-ended), phân tích sức khỏe văn hóa nội bộ và đưa ra 3 đề xuất cải thiện. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Culture Check score ({{SCORE_CULTURE}}/100 with 2 open-ended answers), analyze internal culture health and suggest 3 improvements. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_VAN_HOA}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_VAN_HOA}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ VĂN HÓA",
      title_en: "PART 1: CULTURE EVALUATION",
      subtitle_vi: "5 chiều đánh giá: core values, lắng nghe, retention, đãi ngộ, và communication.",
      subtitle_en: "5 evaluation dimensions: core values, listening, retention, compensation, and communication.",
      ref: "Ch.9 — Văn Hóa Phòng Khám",
      icon: "diversity_3",
      questions: [
        { question_id: "vh_q1", order_idx: 0, type: "select", label_vi: 'Phòng khám có "giá trị cốt lõi" (core values) rõ ràng và được nhân viên biết không?', label_en: "Does your clinic have clear core values that staff know and follow?", scale_labels_vi: { "1": "Không có, chưa bao giờ nói về giá trị", "2": "Có treo tường nhưng ít ai nhớ", "3": "Giá trị cơ bản, nhắc nhở thỉnh thoảng", "4": "Giá trị rõ ràng + tích hợp vào đánh giá", "5": "Core values-driven culture + recruitment + recognition" }, scale_labels_en: { "1": "No core values defined", "2": "Posted on wall but rarely remembered", "3": "Basic values, occasionally referenced", "4": "Clear values + integrated in performance reviews", "5": "Core values-driven culture + recruitment + recognition" }, dimension: "culture" },
        { question_id: "vh_q2", order_idx: 1, type: "select", label_vi: "Nhân viên có được lắng nghe và tham gia vào quyết định không?", label_en: "Are staff listened to and included in decision-making?", scale_labels_vi: { "1": "Mọi quyết định đều từ chủ / quản lý", "2": "Ít khi, chỉ hỏi ý kiến cho form", "3": "Thỉnh thoảng hỏi nhưng không theo quy trình", "4": "Có quy trình lấy ý kiến + feedback loop", "5": "Democratic culture + empowerment + innovation" }, scale_labels_en: { "1": "All decisions from owner/manager", "2": "Rarely, only formal consultations", "3": "Sometimes asked but no process", "4": "Process for input + feedback loop", "5": "Democratic culture + empowerment + innovation" }, dimension: "culture" },
        { question_id: "vh_q3", order_idx: 2, type: "select", label_vi: "Tỷ lệ nghỉ việc / thay đổi nhân sự trong 12 tháng qua là bao nhiêu?", label_en: "What is your staff turnover rate in the past 12 months?", scale_labels_vi: { "1": "Trên 50% — thay đổi liên tục", "2": "30-50% — khá cao", "3": "15-30% — bình thường với ngành", "4": "5-15% — có một số vị trí khó giữ", "5": "Dưới 5% — nhân sự ổn định" }, scale_labels_en: { "1": "Over 50% — constant turnover", "2": "30-50% — quite high", "3": "15-30% — normal for the industry", "4": "5-15% — some hard-to-retain positions", "5": "Under 5% — stable team" }, dimension: "culture" },
        { question_id: "vh_q4", order_idx: 3, type: "select", label_vi: "Phòng khám có chế độ đãi ngộ và phúc lợi (ngoài lương) rõ ràng không?", label_en: "Does your clinic have clear compensation and benefits (beyond salary)?", scale_labels_vi: { "1": "Chỉ có lương, không có phúc lợi", "2": "Phúc lợi ad-hoc, không có quy định", "3": "Có phúc lợi cơ bản (BHXH, BHYT)", "4": "Phúc lợi đầy đủ + thưởng KPI + team building", "5": "Full package + career path + professional development" }, scale_labels_en: { "1": "Salary only, no benefits", "2": "Ad-hoc benefits, no policy", "3": "Basic benefits (social insurance, health insurance)", "4": "Full benefits + KPI bonus + team building", "5": "Full package + career path + professional development" }, dimension: "culture" },
        { question_id: "vh_q5", order_idx: 4, type: "select", label_vi: "An toàn tâm lý (psychological safety) trong phòng khám như thế nào? Nhân viên có dám nói thẳng khi có vấn đề không?", label_en: "What is the psychological safety level in your clinic? Do staff dare to speak up when there is an issue?", scale_labels_vi: { "1": "Không ai dám nói thẳng, sợ bị phạt", "2": "Chỉ một vài người dám, phần lớn im lặng", "3": "Cố gắng xây dựng nhưng chưa thành", "4": "Phần lớn an toàn, có thể nói thẳng", "5": "An toàn tâm lý cao — mọi người nói thẳng vì tin tưởng" }, scale_labels_en: { "1": "No one dares to speak up, afraid of punishment", "2": "Only a few dare, most stay silent", "3": "Trying to build but not yet there", "4": "Most feel safe, can speak up", "5": "High psychological safety — everyone speaks up because of trust" }, dimension: "culture" }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào văn hóa nội bộ.",
      subtitle_en: "Two open questions to face internal culture honestly.",
      ref: "Ch.9 — Văn Hóa Phòng Khám",
      icon: "psychology_alt",
      questions: [
        { question_id: "vh_open1", order_idx: 0, type: "textarea", label_vi: 'Văn hóa nào đang "xung đột" hoặc không phù hợp với định hướng phòng khám? Mô tả một tình huống cụ thể mà bạn nhớ rõ.', label_en: 'What cultural aspect is "conflicting" or not aligned with your clinic direction? Describe a specific situation you remember.', placeholder_vi: 'Ví dụ: "nói một đằng làm một nẻo", "không ai dám nói thẳng", "thiếu teamwork"...', placeholder_en: 'e.g. "say one thing, do another", "no one speaks up", "lack of teamwork"...' },
        { question_id: "vh_open2", order_idx: 1, type: "textarea", label_vi: "Nhân viên có tự hào khi giới thiệu nơi làm việc cho bạn bè/người thân không? Tại sao bạn nghĩ vậy?", label_en: "Are staff proud to introduce their workplace to friends/family? Why do you think so?", placeholder_vi: "Hãy trung thực — đây là dấu hiệu quan trọng nhất của văn hóa lành mạnh.", placeholder_en: "Be honest — this is the most important sign of a healthy culture." }
      ]
    }
  ]
};
const THUONG_HIEU_CHECK_SEED = {
  id: "thuong-hieu-check",
  slug: "thuong-hieu-check",
  title_vi: "Thương Hiệu Check",
  title_en: "Brand Check",
  description_vi: "Thương hiệu mạnh = bệnh nhân nhớ đến khi cần. 7 câu hỏi giúp bạn đánh giá mức độ nhận diện và uy tín thương hiệu phòng khám.",
  description_en: "Strong brand = patients remember you when they need care. 7 questions to assess brand recognition and reputation.",
  subtitle_vi: "Chẩn đoán nhanh theo Chương 10 — Xây Dựng Thương Hiệu",
  subtitle_en: "Quick diagnosis based on Chapter 10 — Brand Building",
  chapter_refs: ["Ch.10"],
  status: "active",
  is_free: 0,
  survey_type: "mini",
  order_index: 10,
  lead_fields: {
    clinic_name: { label_vi: "Tên phòng khám", label_en: "Clinic name", required: true, placeholder_vi: "Nha Khoa ABC", type: "text" },
    email: { label_vi: "Email liên hệ", label_en: "Contact email", required: true, placeholder_vi: "ban@email.com", type: "email" }
  },
  translations_vi: { submitButton: "Xem kết quả", submitting: "Đang xử lý...", required: "bắt buộc", start: "Bắt đầu →", back: "← Quay lại", next: "Tiếp tục →", prev: "← Quay lại", intro_title: "Thương Hiệu Check", intro_desc: "Thương hiệu mạnh = bệnh nhân nhớ đến khi cần. 7 câu hỏi giúp bạn đánh giá mức độ nhận diện và uy tín thương hiệu phòng khám.", restore_draft: "Bạn có bản nháp chưa hoàn thành.", clear_draft: "Xoá & bắt đầu lại", submit_title: "Sẵn sàng xem kết quả?", submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.", step_label: "Phần", submit_label: "Gửi" },
  translations_en: { submitButton: "See Result", submitting: "Processing...", required: "required", start: "Start →", back: "← Back", next: "Next →", prev: "← Back", intro_title: "Brand Check", intro_desc: "Strong brand = patients remember you when they need care. 7 questions to assess brand recognition and reputation.", restore_draft: "You have an unfinished draft.", clear_draft: "Clear & start over", submit_title: "Ready to see results?", submit_desc: "We will calculate and display your score immediately.", step_label: "Part", submit_label: "Submit" },
  scoring_rules: {
    dimensions: [{ id: "brand", name_vi: "Thương hiệu & Nhận diện", name_en: "Brand & Recognition", question_ids: ["th_q1", "th_q2", "th_q3", "th_q4", "th_q5"], formula: "avg" }],
    total_formula: "average",
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Thương Hiệu Check (điểm {{SCORE_BRAND}}/100 kèm 2 câu open-ended), phân tích mức độ nhận diện thương hiệu và đưa ra 3 đề xuất xây dựng thương hiệu. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Brand Check score ({{SCORE_BRAND}}/100 with 2 open-ended answers), analyze brand recognition and suggest 3 brand-building actions. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_THUONG_HIEU}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_THUONG_HIEU}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ THƯƠNG HIỆU",
      title_en: "PART 1: BRAND EVALUATION",
      subtitle_vi: "5 chiều đánh giá: nhận diện, nhất quán, review, hiện diện online, và khác biệt hóa.",
      subtitle_en: "5 evaluation dimensions: recognition, consistency, reviews, online presence, and differentiation.",
      ref: "Ch.10 — Xây Dựng Thương Hiệu",
      icon: "stars",
      questions: [
        { question_id: "th_q1", order_idx: 0, type: "select", label_vi: "Người trong khu vực (bán kính 5km) có biết phòng khám của bạn không?", label_en: "Do people in your area (5km radius) know your clinic?", scale_labels_vi: { "1": "Không ai biết, chưa ai nhắc", "2": "Vài người quen biết", "3": "Biết đến nhưng không nhớ rõ dịch vụ", "4": "Nhớ tên + dịch vụ chính + vị trí", "5": "Top-of-mind trong khu vực + NPS cao" }, scale_labels_en: { "1": "Nobody knows, no referrals", "2": "Some acquaintances know", "3": "Heard of but unclear on services", "4": "Remembers name + main services + location", "5": "Top-of-mind in the area + high NPS" }, dimension: "brand" },
        { question_id: "th_q2", order_idx: 1, type: "select", label_vi: "Phòng khám có nhận diện thương hiệu (logo, màu sắc, slogan) nhất quán không?", label_en: "Does your clinic have consistent brand identity (logo, colors, slogan)?", scale_labels_vi: { "1": "Không có, mỗi nơi một kiểu", "2": "Có logo cơ bản, không có guideline", "3": "Có nhận diện cơ bản, dùng không nhất quán", "4": "Brand guideline đầy đủ + nhất quán trên mọi touchpoint", "5": "Professional brand identity + digital + offline consistency" }, scale_labels_en: { "1": "No identity, everything inconsistent", "2": "Basic logo, no guidelines", "3": "Basic identity but inconsistently used", "4": "Full brand guideline + consistent on all touchpoints", "5": "Professional brand identity + digital + offline consistency" }, dimension: "brand" },
        { question_id: "th_q3", order_idx: 2, type: "select", label_vi: "Phòng khám có đánh giá / review online (Google, Facebook, Zalo) và quản lý không?", label_en: "Does your clinic manage online reviews (Google, Facebook, Zalo)?", scale_labels_vi: { "1": "Không có, không theo dõi", "2": "Có ít review nhưng không trả lời", "3": "Trả lời khi có review mới", "4": "Chủ động xin review + trả lời tất cả + phân tích", "5": "Full review management + sentiment analysis + proactive" }, scale_labels_en: { "1": "No reviews, no tracking", "2": "Some reviews but no responses", "3": "Responds when new reviews appear", "4": "Proactively asks for reviews + responds + analyzes", "5": "Full review management + sentiment analysis + proactive" }, dimension: "brand" },
        { question_id: "th_q4", order_idx: 3, type: "select", label_vi: "Phòng khám có sự hiện diện online (website, Google Business, mạng xã hội) mạnh không?", label_en: "Does your clinic have a strong online presence (website, Google Business, social media)?", scale_labels_vi: { "1": "Không có website / chỉ có trang Facebook cơ bản", "2": "Website cơ bản + Facebook nhưng ít cập nhật", "3": "Website + Google Business + Facebook active", "4": "Full online presence + regular content + SEO", "5": "Integrated digital brand + content strategy + analytics" }, scale_labels_en: { "1": "No website / only basic Facebook page", "2": "Basic website + Facebook but rarely updated", "3": "Website + Google Business + active Facebook", "4": "Full online presence + regular content + SEO", "5": "Integrated digital brand + content strategy + analytics" }, dimension: "brand" },
        { question_id: "th_q5", order_idx: 4, type: "select", label_vi: "Phòng khám có chiến lược xây dựng uy tín (educational content, KOL, partnership) để tạo niềm tin dài hạn không?", label_en: "Does your clinic have a strategy to build credibility (educational content, KOL, partnerships) for long-term trust?", scale_labels_vi: { "1": "Không có chiến lược này", "2": "Có đôi chút nhưng không có chiến lược", "3": "Có content đều đặn nhưng chưa có chiến lược rõ", "4": "Chiến lược rõ + content + partnership", "5": "Full authority building: content + community + thought leadership" }, scale_labels_en: { "1": "No such strategy", "2": "Some effort but no strategy", "3": "Regular content but no clear strategy", "4": "Clear strategy + content + partnerships", "5": "Full authority building: content + community + thought leadership" }, dimension: "brand" }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào vị thế thương hiệu.",
      subtitle_en: "Two open questions to face your brand position honestly.",
      ref: "Ch.10 — Xây Dựng Thương Hiệu",
      icon: "psychology_alt",
      questions: [
        {
          question_id: "th_open1",
          order_idx: 0,
          type: "textarea",
          label_vi: "Cạnh tranh trực tiếp với phòng khám nào trong khu vực và điều gì khiến bạn khác biệt? Điều gì khiến bệnh nhân chọn bạn thay vì đối thủ?",
          label_en: "Who are your direct competitors in the area and what makes you different? What makes patients choose you over competitors?",
          placeholder_vi: "Liệt kê 1-2 đối thủ chính và 1-2 điều khiến phòng khám của bạn khác biệt.",
          placeholder_en: "List 1-2 main competitors and 1-2 things that make your clinic different."
        },
        {
          question_id: "th_open2",
          order_idx: 1,
          type: "textarea",
          label_vi: "Nếu bạn phải mô tả thương hiệu phòng khám bằng 3 từ, bạn sẽ chọn 3 từ nào? Những từ đó có đúng với thực tế không?",
          label_en: "If you had to describe your clinic brand in 3 words, which 3 words would you choose? Do those words match reality?",
          placeholder_vi: 'Ví dụ: "Uy tín — Tận tâm — Chuyên nghiệp" — hãy đánh giá thực tế mỗi từ.',
          placeholder_en: 'e.g.: "Trusted — Caring — Professional" — rate how true each word is in reality.'
        }
      ]
    }
  ]
};
const SEED_REGISTRY = {
  [HO_SO_GOC_RE_SEED.id]: HO_SO_GOC_RE_SEED,
  [HE_THONG_CHECK_SEED.id]: HE_THONG_CHECK_SEED,
  [NHAN_SU_CHECK_SEED.id]: NHAN_SU_CHECK_SEED,
  [QUY_TRINH_CHECK_SEED.id]: QUY_TRINH_CHECK_SEED,
  [TIEP_DON_CHECK_SEED.id]: TIEP_DON_CHECK_SEED,
  [TAI_CHINH_CHECK_SEED.id]: TAI_CHINH_CHECK_SEED,
  [AN_TOAN_CHECK_SEED.id]: AN_TOAN_CHECK_SEED,
  [MARKETING_CHECK_SEED.id]: MARKETING_CHECK_SEED,
  [CSKH_CHECK_SEED.id]: CSKH_CHECK_SEED,
  [VAN_HOA_CHECK_SEED.id]: VAN_HOA_CHECK_SEED,
  [THUONG_HIEU_CHECK_SEED.id]: THUONG_HIEU_CHECK_SEED
};
export {
  SEED_REGISTRY as S
};
