globalThis.process ??= {};
globalThis.process.env ??= {};
const STARTUP_CHECK_SEED = {
  id: "startup-check",
  slug: "startup-check",
  title_vi: "Startup Check",
  title_en: "Startup Check",
  description_vi: "Mới mở phòng khám hoặc dưới 3 năm? Đánh giá ngay 5 khía cạnh quan trọng nhất để khởi đầu vững chắc.",
  description_en: "New clinic or under 3 years old? Assess the 5 most critical areas for a solid start.",
  subtitle_vi: "Chẩn đoán nhanh cho phòng khám mới thành lập",
  subtitle_en: "Quick diagnosis for newly established clinics",
  chapter_refs: ["Ch.MỚI"],
  status: "active",
  is_free: 1,
  survey_type: "mini",
  order_index: 11,
  lead_fields: {
    clinic_name: { label_vi: "Tên phòng khám", label_en: "Clinic name", required: true, placeholder_vi: "Nha Khoa ABC", type: "text" },
    email: { label_vi: "Email liên hệ", label_en: "Contact email", required: true, placeholder_vi: "ban@email.com", type: "email" },
    years_in_operation: { label_vi: "Số năm hoạt động", label_en: "Years in operation", required: false, placeholder_vi: "1", type: "text" }
  },
  translations_vi: { submitButton: "Xem kết quả", submitting: "Đang xử lý...", required: "bắt buộc", start: "Bắt đầu →", back: "← Quay lại", next: "Tiếp tục →", prev: "← Quay lại", intro_title: "Startup Check", intro_desc: "Mới mở phòng khám hoặc dưới 3 năm? Đánh giá ngay 5 khía cạnh quan trọng nhất để khởi đầu vững chắc.", restore_draft: "Bạn có bản nháp chưa hoàn thành.", clear_draft: "Xoá & bắt đầu lại", submit_title: "Sẵn sàng xem kết quả?", submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.", step_label: "Phần", submit_label: "Gửi" },
  translations_en: { submitButton: "See Result", submitting: "Processing...", required: "required", start: "Start →", back: "← Back", next: "Next →", prev: "← Back", intro_title: "Startup Check", intro_desc: "New clinic or under 3 years old? Assess the 5 most critical areas for a solid start.", restore_draft: "You have an unfinished draft.", clear_draft: "Clear & start over", submit_title: "Ready to see results?", submit_desc: "We will calculate and display your score immediately.", step_label: "Part", submit_label: "Submit" },
  scoring_rules: {
    dimensions: [{ id: "startup", name_vi: "Mức độ khởi đầu", name_en: "Startup Readiness", question_ids: ["st_q1", "st_q2", "st_q3", "st_q4", "st_q5"], formula: "avg" }],
    total_formula: "average",
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Startup Check (điểm {{SCORE_STARTUP}}/100 kèm 2 câu open-ended), phân tích mức độ sẵn sàng của phòng khám mới và đưa ra 3 hành động ưu tiên trong 90 ngày đầu. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant. Based on the Startup Check score ({{SCORE_STARTUP}}/100 with 2 open-ended answers), analyze the clinic's readiness and suggest 3 priority actions for the first 90 days. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_STARTUP}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 90 ngày đầu cho phòng khám mới.\nMỗi tuần 2-3 hành động CỤ THỂ. Ưu tiên những gì tạo nền tảng trước.\n\n# CẤU TRÚC ĐẦU RA\n## Giai đoạn 1 (Ngày 1-30)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Giai đoạn 2 (Ngày 31-60)\n...\n\n## Giai đoạn 3 (Ngày 61-90)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_STARTUP}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 90-day plan for a new clinic.\nEach week: 2-3 SPECIFIC actions. Prioritize foundation-building actions first.\n\n# OUTPUT STRUCTURE\n## Phase 1 (Days 1-30)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Phase 2 (Days 31-60)\n...\n\n## Phase 3 (Days 61-90)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ KHỞI ĐẦU",
      title_en: "PART 1: STARTUP EVALUATION",
      subtitle_vi: "5 chiều đánh giá: legal, vị trí, thiết bị, quy trình, và đội ngũ.",
      subtitle_en: "5 evaluation dimensions: legal, location, equipment, processes, and team.",
      ref: "Phòng khám mới — Startup",
      icon: "rocket_launch",
      questions: [
        { question_id: "st_q1", order_idx: 0, type: "select", label_vi: "Phòng khám đã đủ giấy phép hoạt động, PCCC, và các thủ tục pháp lý cần thiết chưa?", label_en: "Does your clinic have all necessary operating licenses, fire safety, and legal permits?", scale_labels_vi: { "1": "Còn thiếu nhiều giấy tờ quan trọng", "2": "Có giấy phép cơ bản nhưng chưa đầy đủ", "3": "Đủ giấy phép chính, đang hoàn thiện phụ", "4": "Đầy đủ tất cả giấy phép + định kỳ gia hạn", "5": "Hoàn hảo — mọi thứ gọn gàng, có lịch gia hạn tự động" }, scale_labels_en: { "1": "Missing many important documents", "2": "Basic license only, not fully compliant", "3": "Main permits ok, secondary pending", "4": "All permits complete + periodic renewal", "5": "Perfect — everything organized with auto-renewal" }, dimension: "startup" },
        { question_id: "st_q2", order_idx: 1, type: "select", label_vi: "Vị trí và cơ sở vật chất của phòng khám đã phù hợp với đối tượng khách hàng mục tiêu chưa?", label_en: "Is your clinic's location and facilities suitable for your target patients?", scale_labels_vi: { "1": "Chưa ổn định, đang tìm chỗ", "2": "Có chỗ nhưng chưa phù hợp với đối tượng", "3": "Vị trí tạm được, đang cải thiện dần", "4": "Vị trí tốt, dễ tìm, phù hợp với khách hàng", "5": "Vị trí lý tưởng + không gian chuyên nghiệp" }, scale_labels_en: { "1": "Not stable, still searching for location", "2": "Have space but not suitable for target audience", "3": "Temporary location, gradually improving", "4": "Good location, easy to find, suitable for patients", "5": "Ideal location + professional space" }, dimension: "startup" },
        { question_id: "st_q3", order_idx: 2, type: "select", label_vi: "Thiết bị và công nghệ của phòng khám đã đáp ứng được các dịch vụ cơ bản chưa?", label_en: "Does your clinic's equipment and technology meet basic service needs?", scale_labels_vi: { "1": "Thiếu nhiều thiết bị cần thiết, chưa thể hoạt động đầy đủ", "2": "Có thiết bị cơ bản nhưng thiếu nhiều dịch vụ chính", "3": "Đủ cho dịch vụ cơ bản, đang tích lũy thêm", "4": "Có đủ thiết bị cho các dịch vụ chính + vài thiết bị nâng cao", "5": "Trang bị đầy đủ + công nghệ hiện đại cho hầu hết dịch vụ" }, scale_labels_en: { "1": "Missing essential equipment, can't operate fully", "2": "Basic equipment only, missing many key services", "3": "Enough for basic services, accumulating more", "4": "Full equipment for main services + some advanced tools", "5": "Fully equipped + modern technology for most services" }, dimension: "startup" },
        { question_id: "st_q4", order_idx: 3, type: "select", label_vi: "Quy trình khám chữa và vận hành cơ bản đã được thiết lập chưa?", label_en: "Have basic examination and operational procedures been established?", scale_labels_vi: { "1": "Chưa có quy trình, hoạt động tùy hứng", "2": "Có vài quy trình nhưng chưa chuẩn hóa", "3": "Quy trình cơ bản có, đang dần chuẩn hóa", "4": "Quy trình chuẩn cho hầu hết các hoạt động chính", "5": "Hệ thống SOP đầy đủ, nhân viên được đào tạo bài bản" }, scale_labels_en: { "1": "No procedures, running ad-hoc", "2": "Some procedures exist but not standardized", "3": "Basic procedures exist, gradually standardizing", "4": "Standard procedures for most main operations", "5": "Complete SOP system, staff fully trained" }, dimension: "startup" },
        { question_id: "st_q5", order_idx: 4, type: "select", label_vi: "Đội ngũ nhân viên đã ổn định và được đào tạo để phục vụ bệnh nhân chưa?", label_en: "Is your team stable and trained to serve patients?", scale_labels_vi: { "1": "Đội ngũ chưa tuyển đủ, thiếu nhân sự trầm trọng", "2": "Tuyển được nhưng chưa ổn định, hay nghỉ", "3": "Đội ngũ cơ bản đủ, cần thêm thời gian gắn kết", "4": "Đội ngũ ổn định, được đào tạo cơ bản", "5": "Đội ngũ gắn bó, được đào tạo bài bản, có văn hóa làm việc" }, scale_labels_en: { "1": "Team not complete, severe staff shortage", "2": "Recruited but unstable, high turnover", "3": "Basic team complete, needs more time to bond", "4": "Stable team with basic training", "5": "Committed team, fully trained, strong work culture" }, dimension: "startup" }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế khởi nghiệp.",
      subtitle_en: "Two open questions to face your startup reality honestly.",
      ref: "Phòng khám mới — Startup",
      icon: "psychology_alt",
      questions: [
        { question_id: "st_open1", order_idx: 0, type: "textarea", label_vi: "Thách thức lớn nhất của bạn trong giai đoạn đầu là gì? Kể một tình huống cụ thể gần đây.", label_en: "What is your biggest challenge in the early stage? Describe a recent specific situation.", placeholder_vi: "Có thể là tài chính, nhân sự, bệnh nhân, quy trình... Mô tả ngắn gọn một tình huống cụ thể.", placeholder_en: "It could be finance, staff, patients, processes... Briefly describe a specific situation." },
        { question_id: "st_open2", order_idx: 1, type: "textarea", label_vi: "Nếu bạn có thể thay đổi một điều về phòng khám ngay bây giờ, bạn sẽ chọn điều gì? Tại sao?", label_en: "If you could change one thing about your clinic right now, what would it be? Why?", placeholder_vi: "Nghĩ về điều có tác động lớn nhất đến sự phát triển của phòng khám trong 6 tháng tới.", placeholder_en: "Think about what would have the biggest impact on your clinic's growth in the next 6 months." }
      ]
    }
  ]
};
const CONTENT_FUNNEL_CHECK_SEED = {
  id: "content-funnel-check",
  slug: "content-funnel-check",
  title_vi: "Content Funnel Check",
  title_en: "Content Funnel Check",
  description_vi: "Content là cách tiếp cận bệnh nhân hiệu quả nhất hiện nay. 7 câu hỏi giúp bạn đánh giá chiến lược content của phòng khám.",
  description_en: "Content is the most effective way to reach patients today. 7 questions to assess your clinic's content strategy.",
  subtitle_vi: "Chẩn đoán nhanh chiến lược content marketing",
  subtitle_en: "Quick diagnosis of your content marketing strategy",
  chapter_refs: ["Ch.7"],
  status: "active",
  is_free: 1,
  survey_type: "mini",
  order_index: 12,
  lead_fields: {
    clinic_name: { label_vi: "Tên phòng khám", label_en: "Clinic name", required: true, placeholder_vi: "Nha Khoa ABC", type: "text" },
    email: { label_vi: "Email liên hệ", label_en: "Contact email", required: true, placeholder_vi: "ban@email.com", type: "email" }
  },
  translations_vi: { submitButton: "Xem kết quả", submitting: "Đang xử lý...", required: "bắt buộc", start: "Bắt đầu →", back: "← Quay lại", next: "Tiếp tục →", prev: "← Quay lại", intro_title: "Content Funnel Check", intro_desc: "Content là cách tiếp cận bệnh nhân hiệu quả nhất hiện nay. 7 câu hỏi giúp bạn đánh giá chiến lược content của phòng khám.", restore_draft: "Bạn có bản nháp chưa hoàn thành.", clear_draft: "Xoá & bắt đầu lại", submit_title: "Sẵn sàng xem kết quả?", submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.", step_label: "Phần", submit_label: "Gửi" },
  translations_en: { submitButton: "See Result", submitting: "Processing...", required: "required", start: "Start →", back: "← Back", next: "Next →", prev: "← Back", intro_title: "Content Funnel Check", intro_desc: "Content is the most effective way to reach patients today. 7 questions to assess your clinic's content strategy.", restore_draft: "You have an unfinished draft.", clear_draft: "Clear & start over", submit_title: "Ready to see results?", submit_desc: "We will calculate and display your score immediately.", step_label: "Part", submit_label: "Submit" },
  scoring_rules: {
    dimensions: [{ id: "content", name_vi: "Chiến lược Content", name_en: "Content Strategy", question_ids: ["cf_q1", "cf_q2", "cf_q3", "cf_q4", "cf_q5"], formula: "avg" }],
    total_formula: "average",
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Content Funnel Check (điểm {{SCORE_CONTENT}}/100 kèm 2 câu open-ended), phân tích chiến lược content marketing và đưa ra 3 hành động cải thiện content funnel. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Content Funnel Check score ({{SCORE_CONTENT}}/100 with 2 open-ended answers), analyze content marketing strategy and suggest 3 improvements. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_CONTENT}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày để cải thiện content funnel.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_CONTENT}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan to improve your content funnel.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ CONTENT",
      title_en: "PART 1: CONTENT EVALUATION",
      subtitle_vi: "5 chiều đánh giá: chiến lược, SEO, social media, email, và referral loop.",
      subtitle_en: "5 evaluation dimensions: strategy, SEO, social media, email, and referral loop.",
      ref: "Ch.7 — Marketing Phòng Khám",
      icon: "article",
      questions: [
        { question_id: "cf_q1", order_idx: 0, type: "select", label_vi: "Phòng khám có chiến lược content (content strategy) rõ ràng với lịch đăng bài không?", label_en: "Does your clinic have a clear content strategy with a posting schedule?", scale_labels_vi: { "1": "Không có chiến lược, đăng bài tùy hứng", "2": "Đăng bài đều nhưng không có chiến lược rõ", "3": "Có lịch đăng bài cơ bản, chưa phân chia nội dung", "4": "Có chiến lược content + lịch + phân chia chủ đề", "5": "Content strategy đầy đủ: lịch, phân loại, KPIs, analytics" }, scale_labels_en: { "1": "No strategy, posting ad-hoc", "2": "Posting regularly but no clear strategy", "3": "Basic posting schedule, no content segmentation", "4": "Content strategy + schedule + topic segmentation", "5": "Full content strategy: schedule, segmentation, KPIs, analytics" }, dimension: "content" },
        { question_id: "cf_q2", order_idx: 1, type: "select", label_vi: "Phòng khám có website với nội dung SEO (blog, bài viết, từ khóa) để bệnh nhân tìm thấy tự nhiên không?", label_en: "Does your clinic website have SEO content (blog, articles, keywords) for organic discovery?", scale_labels_vi: { "1": "Không có website hoặc website tĩnh không có nội dung", "2": "Website có trang chủ nhưng không có nội dung SEO", "3": "Có blog nhưng đăng bài không đều, SEO yếu", "4": "Blog hoạt động + SEO cơ bản, có từ khóa target", "5": "Website với content hub + SEO mạnh + local SEO + analytics" }, scale_labels_en: { "1": "No website or static site with no content", "2": "Website with homepage only, no SEO content", "3": "Blog exists but irregular, weak SEO", "4": "Active blog + basic SEO with target keywords", "5": "Website with content hub + strong SEO + local SEO + analytics" }, dimension: "content" },
        { question_id: "cf_q3", order_idx: 2, type: "select", label_vi: "Phòng khám có sự hiện diện active trên mạng xã hội (Facebook, TikTok, YouTube) với nội dung giáo dục không?", label_en: "Does your clinic have an active social media presence (Facebook, TikTok, YouTube) with educational content?", scale_labels_vi: { "1": "Không có hoặc có nhưng bỏ bê", "2": "Có Facebook nhưng chủ yếu quảng cáo, ít nội dung giá trị", "3": "Active trên 1 nền tảng với nội dung giáo dục đều đặn", "4": "Active trên 2+ nền tảng với content mix (giáo dục + entertainment)", "5": "Đa nền tảng + content strategy + engagement cao + community" }, scale_labels_en: { "1": "None or completely neglected", "2": "Facebook only, mostly ads, little valuable content", "3": "Active on 1 platform with regular educational content", "4": "Active on 2+ platforms with content mix (educational + entertainment)", "5": "Multi-platform + content strategy + high engagement + community" }, dimension: "content" },
        { question_id: "cf_q4", order_idx: 3, type: "select", label_vi: "Phòng khám có hệ thống email nurture (bản tin, sequence, automated) để giữ liên lạc với bệnh nhân không?", label_en: "Does your clinic have an email nurture system (newsletter, sequences, automated) to stay in touch with patients?", scale_labels_vi: { "1": "Không có email marketing gì cả", "2": "Có gửi tin nhắn Zalo/SMS nhưng không có email", "3": "Có bản tin email thỉnh thoảng, không có sequence", "4": "Có email list + bản tin đều đặn + basic automation", "5": "Email marketing đầy đủ: list segmentation, drip campaigns, automation" }, scale_labels_en: { "1": "No email marketing at all", "2": "Zalo/SMS messages only, no email", "3": "Irregular newsletter, no sequences", "4": "Email list + regular newsletter + basic automation", "5": "Full email marketing: list segmentation, drip campaigns, automation" }, dimension: "content" },
        { question_id: "cf_q5", order_idx: 4, type: "select", label_vi: "Phòng khám có content referral loop (khuyến khích bệnh nhân chia sẻ, UGC, review) không?", label_en: "Does your clinic have a content referral loop (encouraging patient sharing, UGC, reviews)?", scale_labels_vi: { "1": "Không có gì để bệnh nhân chia sẻ", "2": "Có một vài bài hay nhưng không khuyến khích chia sẻ", "3": "Có chương trình xin review cơ bản", "4": "Chủ động xin review + có UGC campaign + incentivize sharing", "5": "Full referral content loop: UGC, reviews, testimonials, social sharing" }, scale_labels_en: { "1": "Nothing for patients to share", "2": "Some good content but no sharing encouragement", "3": "Basic review request program", "4": "Proactive review requests + UGC campaign + incentivized sharing", "5": "Full referral content loop: UGC, reviews, testimonials, social sharing" }, dimension: "content" }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn vào thực tế content marketing.",
      subtitle_en: "Two open questions to face your content marketing reality.",
      ref: "Ch.7 — Marketing Phòng Khám",
      icon: "psychology_alt",
      questions: [
        { question_id: "cf_open1", order_idx: 0, type: "textarea", label_vi: "Loại content nào (video, bài viết, hình ảnh, case study) đang mang lại phản hồi tốt nhất từ bệnh nhân? Kể một ví dụ cụ thể.", label_en: "What type of content (video, article, image, case study) gets the best patient response? Give a specific example.", placeholder_vi: "Mô tả loại content nào bệnh nhân tương tác nhiều nhất và tại sao.", placeholder_en: "Describe which content type patients interact with most and why." },
        { question_id: "cf_open2", order_idx: 1, type: "textarea", label_vi: "Nếu bạn phải chọn 1 kênh content duy nhất để đầu tư trong 3 tháng tới, bạn sẽ chọn kênh nào? Tại sao kênh đó?", label_en: "If you had to pick 1 single content channel to invest in for the next 3 months, which would it be? Why that channel?", placeholder_vi: "Nghĩ về kênh nào có tiềm năng mang lại bệnh nhân mới với ít thời gian nhất.", placeholder_en: "Think about which channel has the highest potential to bring new patients with the least time investment." }
      ]
    }
  ]
};
const REFERRAL_CHECK_SEED = {
  id: "referral-check",
  slug: "referral-check",
  title_vi: "Referral Check",
  title_en: "Referral Check",
  description_vi: "Bệnh nhân giới thiệu bệnh nhân là nguồn khách chất lượng cao nhất. 7 câu hỏi giúp bạn đánh giá hệ thống referral của phòng khám.",
  description_en: "Patient referrals are the highest quality patient source. 7 questions to assess your clinic's referral system.",
  subtitle_vi: "Chẩn đoán nhanh hệ thống giới thiệu bệnh nhân",
  subtitle_en: "Quick diagnosis of your patient referral system",
  chapter_refs: ["Ch.7"],
  status: "active",
  is_free: 1,
  survey_type: "mini",
  order_index: 13,
  lead_fields: {
    clinic_name: { label_vi: "Tên phòng khám", label_en: "Clinic name", required: true, placeholder_vi: "Nha Khoa ABC", type: "text" },
    email: { label_vi: "Email liên hệ", label_en: "Contact email", required: true, placeholder_vi: "ban@email.com", type: "email" }
  },
  translations_vi: { submitButton: "Xem kết quả", submitting: "Đang xử lý...", required: "bắt buộc", start: "Bắt đầu →", back: "← Quay lại", next: "Tiếp tục →", prev: "← Quay lại", intro_title: "Referral Check", intro_desc: "Bệnh nhân giới thiệu bệnh nhân là nguồn khách chất lượng cao nhất. 7 câu hỏi giúp bạn đánh giá hệ thống referral của phòng khám.", restore_draft: "Bạn có bản nháp chưa hoàn thành.", clear_draft: "Xoá & bắt đầu lại", submit_title: "Sẵn sàng xem kết quả?", submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.", step_label: "Phần", submit_label: "Gửi" },
  translations_en: { submitButton: "See Result", submitting: "Processing...", required: "required", start: "Start →", back: "← Back", next: "Next →", prev: "← Back", intro_title: "Referral Check", intro_desc: "Patient referrals are the highest quality patient source. 7 questions to assess your clinic's referral system.", restore_draft: "You have an unfinished draft.", clear_draft: "Clear & start over", submit_title: "Ready to see results?", submit_desc: "We will calculate and display your score immediately.", step_label: "Part", submit_label: "Submit" },
  scoring_rules: {
    dimensions: [{ id: "referral", name_vi: "Hệ thống Referral", name_en: "Referral System", question_ids: ["rf_q1", "rf_q2", "rf_q3", "rf_q4", "rf_q5"], formula: "avg" }],
    total_formula: "average",
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Referral Check (điểm {{SCORE_REFERRAL}}/100 kèm 2 câu open-ended), phân tích hệ thống referral và đưa ra 3 cách tăng số lượng bệnh nhân giới thiệu. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Referral Check score ({{SCORE_REFERRAL}}/100 with 2 open-ended answers), analyze your referral system and suggest 3 ways to increase referral patients. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_REFERRAL}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày để tăng số lượng bệnh nhân giới thiệu.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_REFERRAL}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan to increase referral patients.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ REFERRAL",
      title_en: "PART 1: REFERRAL EVALUATION",
      subtitle_vi: "5 chiều đánh giá: chương trình, incentive, tracking, chăm sóc, và đo lường.",
      subtitle_en: "5 evaluation dimensions: program, incentives, tracking, care, and measurement.",
      ref: "Ch.7 — Marketing Phòng Khám",
      icon: "group_add",
      questions: [
        { question_id: "rf_q1", order_idx: 0, type: "select", label_vi: "Phòng khám có chương trình khuyến khích bệnh nhân giới thiệu (referral program) rõ ràng không?", label_en: "Does your clinic have a clear patient referral incentive program?", scale_labels_vi: { "1": "Không có chương trình referral nào", "2": "Có một vài ưu đãi nhưng không có chương trình chính thức", "3": "Có chương trình cơ bản: ưu đãi cho người giới thiệu", "4": "Chương trình đầy đủ: cho cả người giới thiệu và người được giới thiệu", "5": "Chương trình VIP: tiered rewards + benefits + recognition" }, scale_labels_en: { "1": "No referral program at all", "2": "Some ad-hoc incentives but no formal program", "3": "Basic program: benefit for referrer only", "4": "Full program: benefits for both referrer and referred", "5": "VIP program: tiered rewards + benefits + recognition" }, dimension: "referral" },
        { question_id: "rf_q2", order_idx: 1, type: "select", label_vi: "Phòng khám có theo dõi và phân loại nguồn bệnh nhân để biết tỷ lệ referral không?", label_en: "Does your clinic track and categorize patient sources to know referral rate?", scale_labels_vi: { "1": "Không theo dõi, không biết bệnh nhân đến từ đâu", "2": "Hỏi khi đăng ký nhưng không phân tích", "3": "Ghi nhận nguồn đến cơ bản, có số tổng", "4": "Theo dõi chi tiết + phân tích theo tháng", "5": "Full attribution: track every referral source + ROI analysis" }, scale_labels_en: { "1": "No tracking, don't know where patients come from", "2": "Ask at registration but don't analyze", "3": "Basic source recording with totals", "4": "Detailed tracking + monthly analysis", "5": "Full attribution: track every referral source + ROI analysis" }, dimension: "referral" },
        { question_id: "rf_q3", order_idx: 2, type: "select", label_vi: "Bác sĩ và nhân viên có được khen thưởng/recognize khi có bệnh nhân referral không?", label_en: "Are doctors and staff recognized/rewarded when they bring in referral patients?", scale_labels_vi: { "1": "Không có gì, referral là chuyện bình thường", "2": "Có khen thưởng nhưng không nhất quán", "3": "Có chương trình khen thưởng nhân viên theo tháng", "4": "Full recognition: bonus + public acknowledgment + team celebration", "5": "Culture of referral: everyone actively asks + team incentives" }, scale_labels_en: { "1": "Nothing, referrals are just normal", "2": "Irregular recognition", "3": "Monthly staff reward program", "4": "Full recognition: bonus + public acknowledgment + team celebration", "5": "Culture of referral: everyone actively asks + team incentives" }, dimension: "referral" },
        { question_id: "rf_q4", order_idx: 3, type: "select", label_vi: 'Phòng khám có chăm sóc "người giới thiệu" (bệnh nhân thân thiết giới thiệu nhiều) như một nhóm VIP không?', label_en: 'Does your clinic treat "referrers" (loyal patients who refer many) as a VIP group?', scale_labels_vi: { "1": "Không phân biệt, tất cả bệnh nhân như nhau", "2": "Biết có người giới thiệu nhiều nhưng không chăm sóc đặc biệt", "3": "Có gọi/cảm ơn nhưng không có chương trình VIP", "4": "Có chương trình VIP cho top referrers + benefits đặc biệt", "5": "Full VIP program: exclusive benefits, early access, special events" }, scale_labels_en: { "1": "No distinction, all patients treated equally", "2": "Aware of top referrers but no special care", "3": "Thank-you calls but no VIP program", "4": "VIP program for top referrers + special benefits", "5": "Full VIP program: exclusive benefits, early access, special events" }, dimension: "referral" },
        { question_id: "rf_q5", order_idx: 4, type: "select", label_vi: "Tỷ lệ bệnh nhân mới đến từ referral so với các nguồn khác (quảng cáo, tự nhiên) là bao nhiêu?", label_en: "What is the ratio of referral patients to other sources (ads, organic)?", scale_labels_vi: { "1": "Ít hơn 10%, hầu hết đến từ quảng cáo", "2": "Khoảng 10-20%, đang tăng dần", "3": "Khoảng 20-30%, referral là nguồn thứ 2", "4": "Khoảng 30-50%, referral là nguồn chính", "5": "Hơn 50%, referral là nguồn chính + chi phí acquisition thấp" }, scale_labels_en: { "1": "Less than 10%, most come from ads", "2": "About 10-20%, gradually increasing", "3": "About 20-30%, referral is the #2 source", "4": "About 30-50%, referral is a primary source", "5": "Over 50%, referral is primary source + low acquisition cost" }, dimension: "referral" }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào nguồn referral.",
      subtitle_en: "Two open questions to face your referral sources honestly.",
      ref: "Ch.7 — Marketing Phòng Khám",
      icon: "psychology_alt",
      questions: [
        { question_id: "rf_open1", order_idx: 0, type: "textarea", label_vi: "Ai là nguồn referral tốt nhất của phòng khám? (Bệnh nhân cũ, bác sĩ, nha sĩ khác, công ty,...) Tại sao?", label_en: "Who is your best referral source? (Old patients, doctors, other dentists, companies,...) Why?", placeholder_vi: "Mô tả ngắn về nguồn referral tốt nhất và tại sao họ giới thiệu nhiều.", placeholder_en: "Briefly describe your best referral source and why they refer a lot." },
        { question_id: "rf_open2", order_idx: 1, type: "textarea", label_vi: "Điều gì ngăn bệnh nhân giới thiệu nhiều hơn? Hay nói cách khác: làm sao để họ giới thiệu dễ dàng hơn?", label_en: "What prevents patients from referring more? Or: what would make it easier for them to refer?", placeholder_vi: "Nghĩ về cả rào cản (không có chương trình, không biết ai để giới thiệu, không tiện) và động lực (điều gì sẽ khiến họ hào hứng giới thiệu).", placeholder_en: "Think about barriers (no program, don't know who to refer, inconvenient) and motivators (what would excite them to refer)." }
      ]
    }
  ]
};
const DO_LUONG_CHECK_SEED = {
  id: "do-luong-check",
  slug: "do-luong-check",
  title_vi: "Đo Lường Check",
  title_en: "Metrics Check",
  description_vi: "Không đo lường = không cải thiện được. 7 câu hỏi giúp bạn đánh giá văn hóa đo lường của phòng khám.",
  description_en: "No measurement = no improvement. 7 questions to assess your clinic's measurement culture.",
  subtitle_vi: "Chẩn đoán nhanh văn hóa đo lường & data",
  subtitle_en: "Quick diagnosis of measurement & data culture",
  chapter_refs: ["Ch.4"],
  status: "active",
  is_free: 1,
  survey_type: "mini",
  order_index: 14,
  lead_fields: {
    clinic_name: { label_vi: "Tên phòng khám", label_en: "Clinic name", required: true, placeholder_vi: "Nha Khoa ABC", type: "text" },
    email: { label_vi: "Email liên hệ", label_en: "Contact email", required: true, placeholder_vi: "ban@email.com", type: "email" }
  },
  translations_vi: { submitButton: "Xem kết quả", submitting: "Đang xử lý...", required: "bắt buộc", start: "Bắt đầu →", back: "← Quay lại", next: "Tiếp tục →", prev: "← Quay lại", intro_title: "Đo Lường Check", intro_desc: "Không đo lường = không cải thiện được. 7 câu hỏi giúp bạn đánh giá văn hóa đo lường của phòng khám.", restore_draft: "Bạn có bản nháp chưa hoàn thành.", clear_draft: "Xoá & bắt đầu lại", submit_title: "Sẵn sàng xem kết quả?", submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.", step_label: "Phần", submit_label: "Gửi" },
  translations_en: { submitButton: "See Result", submitting: "Processing...", required: "required", start: "Start →", back: "← Back", next: "Next →", prev: "← Back", intro_title: "Metrics Check", intro_desc: "No measurement = no improvement. 7 questions to assess your clinic's measurement culture.", restore_draft: "You have an unfinished draft.", clear_draft: "Clear & start over", submit_title: "Ready to see results?", submit_desc: "We will calculate and display your score immediately.", step_label: "Part", submit_label: "Submit" },
  scoring_rules: {
    dimensions: [{ id: "metrics", name_vi: "Văn hóa Đo lường", name_en: "Measurement Culture", question_ids: ["dl_q1", "dl_q2", "dl_q3", "dl_q4", "dl_q5"], formula: "avg" }],
    total_formula: "average",
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Đo Lường Check (điểm {{SCORE_METRICS}}/100 kèm 2 câu open-ended), phân tích văn hóa data-driven và đưa ra 3 cách xây dựng thói quen đo lường. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Metrics Check score ({{SCORE_METRICS}}/100 with 2 open-ended answers), analyze your data-driven culture and suggest 3 ways to build measurement habits. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_METRICS}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày để xây dựng văn hóa đo lường.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_METRICS}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan to build a measurement culture.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ ĐO LƯỜNG",
      title_en: "PART 1: MEASUREMENT EVALUATION",
      subtitle_vi: "5 chiều đánh giá: KPI tracking, dashboard, data-driven decisions, reporting, và forecasting.",
      subtitle_en: "5 evaluation dimensions: KPI tracking, dashboard, data-driven decisions, reporting, and forecasting.",
      ref: "Ch.4 — Quản Trị Phòng Khám",
      icon: "analytics",
      questions: [
        { question_id: "dl_q1", order_idx: 0, type: "select", label_vi: "Phòng khám có theo dõi các chỉ số KPI cốt lõi (doanh thu, bệnh nhân mới, chi phí) hàng tuần/tháng không?", label_en: "Does your clinic track core KPIs (revenue, new patients, costs) weekly/monthly?", scale_labels_vi: { "1": "Không theo dõi, chỉ biết khi cần nộp thuế", "2": "Biết doanh thu tổng nhưng không có KPI chi tiết", "3": "Theo dõi 1-2 chỉ số cơ bản, không nhất quán", "4": "Có dashboard cơ bản với 5-10 KPIs theo dõi đều đặn", "5": "Full KPI dashboard: 10+ metrics, real-time, automated" }, scale_labels_en: { "1": "No tracking, only know when filing taxes", "2": "Know total revenue but no detailed KPIs", "3": "Track 1-2 basic metrics, inconsistent", "4": "Basic dashboard with 5-10 KPIs tracked regularly", "5": "Full KPI dashboard: 10+ metrics, real-time, automated" }, dimension: "metrics" },
        { question_id: "dl_q2", order_idx: 1, type: "select", label_vi: "Quyết định kinh doanh của bạn được đưa ra dựa trên dữ liệu hay trực giác (gut feeling) nhiều hơn?", label_en: "Are your business decisions based more on data or gut feeling?", scale_labels_vi: { "1": "Hoàn toàn gut feeling, không có dữ liệu", "2": "Chủ yếu gut feeling, có vài con số tham khảo", "3": "Kết hợp gut feeling và dữ liệu, ưu tiên gut", "4": "Dữ liệu làm cơ sở chính, gut feeling bổ sung", "5": "Hoàn toàn data-driven: mọi quyết định đều có data backing" }, scale_labels_en: { "1": "Completely gut feeling, no data", "2": "Mostly gut feeling, a few numbers for reference", "3": "Mix of gut and data, gut is priority", "4": "Data is the main basis, gut feeling supplements", "5": "Completely data-driven: every decision has data backing" }, dimension: "metrics" },
        { question_id: "dl_q3", order_idx: 2, type: "select", label_vi: "Nhân viên (bác sĩ, lễ tân) có được tham gia vào việc theo dõi KPIs không?", label_en: "Are staff (doctors, receptionists) involved in tracking KPIs?", scale_labels_vi: { "1": "Không, chỉ chủ phòng khám biết số liệu", "2": "Biết vài con số tổng nhưng không hiểu KPIs", "3": "Biết KPIs cơ bản, xem báo cáo tháng", "4": "Được đào tạo hiểu KPIs + có KPIs cá nhân để theo dõi", "5": "Team data culture: everyone tracks personal KPIs + weekly review" }, scale_labels_en: { "1": "No, only the owner knows the numbers", "2": "Know a few totals but don't understand KPIs", "3": "Know basic KPIs, see monthly reports", "4": "Trained to understand KPIs + have personal KPIs to track", "5": "Team data culture: everyone tracks personal KPIs + weekly review" }, dimension: "metrics" },
        { question_id: "dl_q4", order_idx: 3, type: "select", label_vi: "Phòng khám có lịch báo cáo định kỳ (hàng tuần/tháng) để review số liệu không?", label_en: "Does your clinic have a regular reporting schedule (weekly/monthly) to review numbers?", scale_labels_vi: { "1": "Không có lịch, xem số liệu tùy hứng", "2": "Thỉnh thoảng xem khi rảnh", "3": "Có họp tháng cơ bản để xem số liệu", "4": "Weekly review meetings với data cập nhật", "5": "Full rhythm: daily standup + weekly deep-dive + monthly strategy" }, scale_labels_en: { "1": "No schedule, look at numbers ad-hoc", "2": "Occasionally check when free", "3": "Basic monthly meeting to review numbers", "4": "Weekly review meetings with updated data", "5": "Full rhythm: daily standup + weekly deep-dive + monthly strategy" }, dimension: "metrics" },
        { question_id: "dl_q5", order_idx: 4, type: "select", label_vi: "Phòng khám có sử dụng dữ liệu để lập kế hoạch và dự báo (forecasting) cho tương lai không?", label_en: "Does your clinic use data to plan and forecast for the future?", scale_labels_vi: { "1": "Không dự báo, sống từ ngày qua ngày", "2": "Có ước lượng sơ bộ nhưng không có base data", "3": "Có kế hoạch tháng/quý dựa trên data quá khứ", "4": "Data-driven forecasting với scenario planning", "5": "Full forecasting: predictive analytics + goal-setting + accountability" }, scale_labels_en: { "1": "No forecasting, living day-to-day", "2": "Rough estimates but no base data", "3": "Monthly/quarterly plans based on past data", "4": "Data-driven forecasting with scenario planning", "5": "Full forecasting: predictive analytics + goal-setting + accountability" }, dimension: "metrics" }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế đo lường.",
      subtitle_en: "Two open questions to face your measurement reality.",
      ref: "Ch.4 — Quản Trị Phòng Khám",
      icon: "psychology_alt",
      questions: [
        { question_id: "dl_open1", order_idx: 0, type: "textarea", label_vi: "Chỉ số (metric) nào quan trọng nhất với bạn trong việc đánh giá sức khỏe phòng khám? Tại sao chỉ số đó?", label_en: "What metric is most important to you in assessing your clinic's health? Why that metric?", placeholder_vi: "Nghĩ về chỉ số nào giúp bạn biết phòng khám đang đi đúng hướng hay cần thay đổi.", placeholder_en: "Think about which metric helps you know if the clinic is on the right track or needs change." },
        { question_id: "dl_open2", order_idx: 1, type: "textarea", label_vi: "Bạn đang theo dõi (hoặc muốn theo dõi) những metrics nào mà hiện tại chưa có trong hệ thống?", label_en: "What metrics are you tracking (or want to track) that you don't currently have in your system?", placeholder_vi: "Liệt kê 1-3 metrics bạn muốn có nhưng chưa đo lường được. Điều gì ngăn bạn theo dõi chúng?", placeholder_en: "List 1-3 metrics you want but are not currently tracking. What's preventing you from tracking them?" }
      ]
    }
  ]
};
const KHO_VAT_TU_CHECK_SEED = {
  id: "kho-vat-tu-check",
  slug: "kho-vat-tu-check",
  title_vi: "Kho Vật Tư Check",
  title_en: "Inventory Check",
  description_vi: "Quản lý vật tư kém = lãng phí tiền và thời gian. 7 câu hỏi giúp bạn đánh giá hệ thống kho vật tư của phòng khám.",
  description_en: "Poor inventory management = wasted money and time. 7 questions to assess your clinic's inventory system.",
  subtitle_vi: "Chẩn đoán nhanh hệ thống kho vật tư",
  subtitle_en: "Quick diagnosis of your inventory management system",
  chapter_refs: ["Ch.5"],
  status: "active",
  is_free: 1,
  survey_type: "mini",
  order_index: 15,
  lead_fields: {
    clinic_name: { label_vi: "Tên phòng khám", label_en: "Clinic name", required: true, placeholder_vi: "Nha Khoa ABC", type: "text" },
    email: { label_vi: "Email liên hệ", label_en: "Contact email", required: true, placeholder_vi: "ban@email.com", type: "email" }
  },
  translations_vi: { submitButton: "Xem kết quả", submitting: "Đang xử lý...", required: "bắt buộc", start: "Bắt đầu →", back: "← Quay lại", next: "Tiếp tục →", prev: "← Quay lại", intro_title: "Kho Vật Tư Check", intro_desc: "Quản lý vật tư kém = lãng phí tiền và thời gian. 7 câu hỏi giúp bạn đánh giá hệ thống kho vật tư của phòng khám.", restore_draft: "Bạn có bản nháp chưa hoàn thành.", clear_draft: "Xoá & bắt đầu lại", submit_title: "Sẵn sàng xem kết quả?", submit_desc: "Hệ thống sẽ tính điểm và hiển thị ngay.", step_label: "Phần", submit_label: "Gửi" },
  translations_en: { submitButton: "See Result", submitting: "Processing...", required: "required", start: "Start →", back: "← Back", next: "Next →", prev: "← Back", intro_title: "Inventory Check", intro_desc: "Poor inventory management = wasted money and time. 7 questions to assess your clinic's inventory system.", restore_draft: "You have an unfinished draft.", clear_draft: "Clear & start over", submit_title: "Ready to see results?", submit_desc: "We will calculate and display your score immediately.", step_label: "Part", submit_label: "Submit" },
  scoring_rules: {
    dimensions: [{ id: "inventory", name_vi: "Quản lý Kho Vật Tư", name_en: "Inventory Management", question_ids: ["kvt_q1", "kvt_q2", "kvt_q3", "kvt_q4", "kvt_q5"], formula: "avg" }],
    total_formula: "average",
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 }
  },
  ai_config: {
    prompt_vi: "Bạn là BS. Vinh — chuyên gia tư vấn phòng khám nha khoa. Dựa trên kết quả Kho Vật Tư Check (điểm {{SCORE_INVENTORY}}/100 kèm 2 câu open-ended), phân tích hệ thống quản lý vật tư và đưa ra 3 cách giảm lãng phí. Dùng tiếng Việt, giọng thẳng thắn ấm áp. Trích dẫn câu trả lời open-ended.",
    prompt_en: "You are Dr. Vinh — dental clinic management consultant. Based on the Inventory Check score ({{SCORE_INVENTORY}}/100 with 2 open-ended answers), analyze inventory management and suggest 3 ways to reduce waste. English, candid and warm tone. Quote their open-ended answers.",
    plan_prompt_vi: "Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số: {{SCORE_INVENTORY}}/100\n- Câu trả lời mở: {{OPEN_RESPONSES}}\n\n# NHIỆM VỤ\nDựa trên dữ liệu trên, tạo một kế hoạch 30 ngày để cải thiện quản lý vật tư.\nMỗi tuần 2-3 hành động CỤ THỂ. Tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ",
    plan_prompt_en: "You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- Score: {{SCORE_INVENTORY}}/100\n- Open-ended answers: {{OPEN_RESPONSES}}\n\n# TASK\nBased on the data above, create a 30-day plan to improve inventory management.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words",
    model_override: null,
    max_tokens_override: 2048
  },
  sections: [
    {
      order_idx: 0,
      title_vi: "PHẦN 1: ĐÁNH GIÁ KHO",
      title_en: "PART 1: INVENTORY EVALUATION",
      subtitle_vi: "5 chiều đánh giá: tracking, ordering, expiry, vendors, và waste.",
      subtitle_en: "5 evaluation dimensions: tracking, ordering, expiry, vendors, and waste.",
      ref: "Ch.5 — Vận Hành Phòng Khám",
      icon: "inventory_2",
      questions: [
        { question_id: "kvt_q1", order_idx: 0, type: "select", label_vi: "Phòng khám có hệ thống theo dõi tồn kho (vật tư đang có, số lượng, vị trí) không?", label_en: "Does your clinic have a system to track inventory (what's in stock, quantities, locations)?", scale_labels_vi: { "1": "Không theo dõi, biết tồn kho trong đầu", "2": "Có danh sách giấy nhưng không cập nhật thường xuyên", "3": "Có bảng Excel theo dõi cơ bản, cập nhật thủ công", "4": "Có phần mềm/công cụ theo dõi + có người phụ trách", "5": "Full inventory system: software + real-time tracking + automated alerts" }, scale_labels_en: { "1": "No tracking, know stock levels in head", "2": "Paper list but not updated regularly", "3": "Basic Excel tracking, manually updated", "4": "Software/tool tracking + dedicated person responsible", "5": "Full inventory system: software + real-time tracking + automated alerts" }, dimension: "inventory" },
        { question_id: "kvt_q2", order_idx: 1, type: "select", label_vi: "Quy trình đặt hàng vật tư (ordering) của phòng khám như thế nào?", label_en: "How does your clinic's ordering process work?", scale_labels_vi: { "1": "Không có quy trình, đặt khi hết thì thôi", "2": "Đặt khi gần hết, không có kế hoạch", "3": "Có đặt định kỳ nhưng không tối ưu về số lượng/giá", "4": "Có quy trình đặt hàng chuẩn + reorder points + safety stock", "5": "Full procurement: vendor contracts + volume discounts + auto-reorder" }, scale_labels_en: { "1": "No process, order when running out", "2": "Order when almost empty, no planning", "3": "Periodic ordering but not optimized for quantity/price", "4": "Standard ordering process + reorder points + safety stock", "5": "Full procurement: vendor contracts + volume discounts + auto-reorder" }, dimension: "inventory" },
        { question_id: "kvt_q3", order_idx: 2, type: "select", label_vi: "Phòng khám có quản lý hạn sử dụng vật tư (dược phẩm, vật liệu) để tránh lãng phí không?", label_en: "Does your clinic manage expiry dates of supplies (pharmaceuticals, materials) to avoid waste?", scale_labels_vi: { "1": "Không theo dõi hạn sử dụng, dùng đến đâu hay đến đó", "2": "Biết có vật tư hết hạn nhưng không có hệ thống kiểm tra", "3": "Kiểm tra tay thỉnh thoảng khi nhớ", "4": "Có kiểm tra định kỳ + có FEFO (first-expire-first-out)", "5": "Full expiry management: FEFO + automated alerts + disposal SOP" }, scale_labels_en: { "1": "No expiry tracking, use until done", "2": "Aware of expired items but no checking system", "3": "Manual checking occasionally", "4": "Regular checking + FEFO (first-expire-first-out)", "5": "Full expiry management: FEFO + automated alerts + disposal SOP" }, dimension: "inventory" },
        { question_id: "kvt_q4", order_idx: 3, type: "select", label_vi: "Phòng khám có mối quan hệ với nhà cung cấp (vendors) để được giá tốt và giao hàng nhanh không?", label_en: "Does your clinic have vendor relationships for good prices and fast delivery?", scale_labels_vi: { "1": "Mua ở đâu rẻ ở đó, không có mối quan hệ", "2": "Có 1-2 vendors quen nhưng không có deal đặc biệt", "3": "Có vendors chính với giá thỏa thuận cơ bản", "4": "Có vendor partnerships + volume discounts + priority delivery", "5": "Full vendor management: contracts + best pricing + contingency suppliers" }, scale_labels_en: { "1": "Buy wherever is cheap, no relationships", "2": "Have 1-2 regular vendors but no special deals", "3": "Have main vendors with basic price agreements", "4": "Vendor partnerships + volume discounts + priority delivery", "5": "Full vendor management: contracts + best pricing + contingency suppliers" }, dimension: "inventory" },
        { question_id: "kvt_q5", order_idx: 4, type: "select", label_vi: "Lãng phí vật tư (hết hạn, hư, thất lạc, mua dư) của phòng khám ở mức nào?", label_en: "What is your clinic's level of inventory waste (expired, damaged, lost, over-purchased)?", scale_labels_vi: { "1": "Lãng phí cao — không biết bao nhiêu%, có thể 10-20%+", "2": "Có lãng phí nhưng không theo dõi cụ thể", "3": "Biết có lãng phí, ước lượng khoảng 5-10%", "4": "Theo dõi lãng phí, dưới 5% và đang giảm", "5": "Near-zero waste: tracked + <2% + continuous improvement system" }, scale_labels_en: { "1": "High waste — don't know how much, possibly 10-20%+", "2": "Some waste but not tracked specifically", "3": "Aware of waste, estimate about 5-10%", "4": "Waste tracked, under 5% and decreasing", "5": "Near-zero waste: tracked + <2% + continuous improvement system" }, dimension: "inventory" }
      ]
    },
    {
      order_idx: 1,
      title_vi: "PHẦN 2: TỰ SOI CHIẾU",
      title_en: "PART 2: SELF-REFLECTION",
      subtitle_vi: "Hai câu hỏi mở giúp bạn nhìn thẳng vào thực tế kho vật tư.",
      subtitle_en: "Two open questions to face your inventory reality.",
      ref: "Ch.5 — Vận Hành Phòng Khám",
      icon: "psychology_alt",
      questions: [
        { question_id: "kvt_open1", order_idx: 0, type: "textarea", label_vi: "Vấn đề vật tư lớn nhất bạn đang gặp phải là gì? (Hết hàng khi cần, dư thừa, hỏng nhiều, giá cao...) Kể một tình huống cụ thể gần đây.", label_en: "What is your biggest inventory problem? (Running out when needed, overstocking, lots of damage, high prices...) Describe a recent specific situation.", placeholder_vi: "Mô tả ngắn gọn vấn đề vật tư gây ảnh hưởng nhiều nhất đến công việc hàng ngày.", placeholder_en: "Briefly describe the inventory problem that affects your daily work the most." },
        { question_id: "kvt_open2", order_idx: 1, type: "textarea", label_vi: "Nếu bạn có thể tối ưu hóa một điều về quản lý vật tư ngay bây giờ, bạn sẽ chọn điều gì? Nó sẽ tiết kiệm được bao nhiêu/tháng?", label_en: "If you could optimize one thing about inventory management right now, what would it be? How much would it save per month?", placeholder_vi: "Nghĩ về điều đơn giản nhất có thể làm ngay để giảm lãng phí hoặc tiết kiệm chi phí.", placeholder_en: "Think about the simplest thing you could do right away to reduce waste or save costs." }
      ]
    }
  ]
};
export {
  CONTENT_FUNNEL_CHECK_SEED as C,
  DO_LUONG_CHECK_SEED as D,
  KHO_VAT_TU_CHECK_SEED as K,
  REFERRAL_CHECK_SEED as R,
  STARTUP_CHECK_SEED as S
};
