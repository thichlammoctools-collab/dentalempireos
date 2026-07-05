globalThis.process ??= {};
globalThis.process.env ??= {};
const DEFAULTS = {
  badge_text: "THE ULTIMATE KNOWLEDGE HUB",
  hero_title_line1: "Dental Empire OS:",
  hero_title_line2: "Hệ Điều Hành Quản Trị Nha Khoa Toàn Diện",
  hero_description: "Xây dựng đế chế nha khoa bền vững với hệ thống quản trị chuẩn mực, tối ưu hóa quy trình từ vận hành, nhân sự đến trải nghiệm khách hàng.",
  hero_cta_primary: "Đọc sách miễn phí ngay",
  hero_cta_secondary: "Tìm hiểu mô hình",
  hero_stats_text: "+500 Chủ phòng khám đã tin dùng",
  hero_image_url: "/images/book/cover.jpg",
  tier_section_heading: "3 Tầng Cốt Lõi Của Dental Empire",
  tier_section_subheading: "Lộ trình chuyển đổi từ chuyên môn thuần túy đến hệ thống quản trị nha khoa toàn diện.",
  tier1_name: "Dental Empire C++",
  tier1_subtitle: "Nền tảng chuyên môn và vận hành cơ bản",
  tier1_icon: "medical_services",
  tier2_name: "Dental Empire U++",
  tier2_subtitle: "Nâng cấp và nhân bản",
  tier2_icon: "trending_up",
  tier3_name: "Dental Empire OS",
  tier3_subtitle: "Hệ điều hành quản trị toàn diện",
  tier3_icon: "deployed_code",
  testimonial_section_heading: "Chia Sẻ Từ Đồng Nghiệp",
  testimonial_section_subheading: "Hơn 500 bác sĩ và chủ phòng khám đã thay đổi tư duy quản trị từ những kiến thức tại Dental Empire.",
  testimonial1_quote: "Hệ thống Dental Empire OS đã giúp tôi giải phóng hoàn toàn khỏi việc giám sát vặt tại phòng khám. Giờ đây tôi có thể tập trung vào chuyên môn và mở thêm cơ sở thứ 3.",
  testimonial1_name: "BS. Nguyễn Minh Tuấn",
  testimonial1_role: "Chủ hệ thống Nha Khoa Tâm Đức",
  testimonial1_avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
  testimonial2_quote: "Kiến thức về Marketing và Tài chính trong sách rất thực chiến. Tôi đã áp dụng ngay và thấy doanh thu tăng trưởng rõ rệt chỉ sau 3 tháng.",
  testimonial2_name: "BS. Phan Thùy Linh",
  testimonial2_role: "Giám đốc Nha Khoa Elite",
  testimonial2_avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
  testimonial3_quote: "Dental Empire không chỉ là một cộng đồng, đó là nơi những người làm nghề y học cách làm kinh doanh một cách tử tế và chuyên nghiệp.",
  testimonial3_name: "BS. Trần Hoàng Nam",
  testimonial3_role: "Founder Dental Connect",
  testimonial3_avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop",
  founder_badge: "VỀ NGƯỜI SÁNG LẬP",
  founder_heading: "Dr. Vinh – Sứ Mệnh Chuyên Nghiệp Hóa Ngành Nha",
  founder_bio: 'Với hơn 15 năm kinh nghiệm trong cả hai vai trò: Bác sĩ điều trị và Nhà quản trị hệ thống, Dr. Vinh đã đúc kết lộ trình "Dental Empire OS" để giúp các đồng nghiệp tránh khỏi những sai lầm đắt giá trong vận hành phòng khám.',
  founder_stat1_value: "15+",
  founder_stat1_label: "Năm kinh nghiệm thực chiến",
  founder_stat2_value: "500+",
  founder_stat2_label: "Học viên là chủ phòng khám",
  founder_name: "Dr. Vinh",
  founder_title: "Founder & Author",
  founder_image_url: "",
  founder_link_text: "Xem chi tiết hành trình",
  cta_heading: "Sẵn sàng để bắt đầu hành trình nâng tầm?",
  cta_subtext: "Tham gia cộng đồng 10.000+ bác sĩ hoặc tải ngay bộ Toolkit quản trị miễn phí của chúng tôi.",
  cta_primary_text: "Tham gia Community",
  cta_secondary_text: "Tải miễn phí Toolkit",
  cta_primary_icon: "groups",
  cta_secondary_icon: "download",
  cta_primary_link: "#",
  cta_secondary_link: "/resources",
  // About: Hero
  about_hero_badge: "System On · Next-Gen Clinical Sovereignty",
  about_hero_line1: "Về Chúng Tôi —",
  about_hero_line2: "Sứ Mệnh Chuyên Nghiệp Hóa Ngành Nha",
  about_hero_gradient: "Sứ Mệnh Chuyên Nghiệp Hóa Ngành Nha",
  about_hero_description: "Dental Empire OS không chỉ là một phần mềm quản lý. Chúng tôi là một hệ tư duy mới, tái định nghĩa cách các phòng khám vận hành thông qua sự kết hợp giữa y đức truyền thống và công nghệ tự động hóa tương lai.",
  about_hero_cta_primary: "Tham gia Cộng đồng",
  about_hero_cta_secondary: "Tìm hiểu Hệ thống",
  // About: Brand Story
  about_story_image_url: "/images/book/cover.jpg",
  about_story_heading: "Hành Trình Chuyển Đổi Số",
  about_story_para1: "Khởi nguồn từ trăn trở về việc tối ưu hóa hiệu suất lâm sàng, Dental Empire OS ra đời để giải quyết những nút thắt của các phòng khám truyền thống: sự phụ thuộc vào con người, quy trình rời rạc và thiếu hụt dữ liệu thực tế.",
  about_story_para2: 'Chúng tôi tin rằng mỗi bác sĩ xứng đáng có một "Hệ điều hành" để giải phóng họ khỏi những tác vụ quản trị thủ công, giúp họ tập trung hoàn toàn vào chuyên môn và sự hài lòng của bệnh nhân.',
  about_story_stat1_value: "15+",
  about_story_stat1_label: "Năm Kinh Nghiệm",
  about_story_stat2_value: "500+",
  about_story_stat2_label: "Phòng Khám Đối Tác",
  // About: Founder
  about_founder_image_url: "/images/founder.jpg",
  about_founder_name: "Dr. Nguyễn Phước Vinh",
  about_founder_title: "Founder & CEO",
  about_founder_quote: `"Hơn 15 năm đứng ghế và quản trị, tôi nhận ra rằng sự thành công của một nha khoa không nằm ở quy mô mặt bằng, mà ở hiệu suất của 'Hệ điều hành' đằng sau nó. Dental Empire OS là tâm huyết của tôi để mang lại sự tự do thực sự cho các đồng nghiệp."`,
  about_founder_role1_label: "Chuyên gia Quản trị",
  about_founder_role1_desc: "Chiến lược vận hành nha khoa",
  about_founder_role2_label: "Tác giả",
  about_founder_role2_desc: "Kiến trúc hệ thống Dental Empire",
  // About: Core Values
  about_values_heading: "Giá Trị Cốt Lõi",
  about_values_card1_title: "Clinical Excellence",
  about_values_card1_desc: "Chúng tôi không bao giờ đánh đổi chất lượng chuyên môn để lấy lợi nhuận. Mọi tính năng trong OS đều phục vụ kết quả điều trị tốt nhất.",
  about_values_card2_title: "Digital Sovereignty",
  about_values_card2_desc: "Chủ quyền số hóa, bảo mật tuyệt đối dữ liệu bệnh nhân và quyền sở hữu hệ thống của phòng khám.",
  about_values_card3_title: "Community Growth",
  about_values_card3_desc: "Phát triển cùng cộng đồng bác sĩ quản trị chuyên nghiệp.",
  about_values_card4_title: "Next-Gen Authority",
  about_values_card4_desc: "Xây dựng vị thế dẫn đầu thông qua công nghệ và sự chuẩn mực trong quản trị.",
  // About: Final CTA
  about_cta_line1: "Sẵn Sàng Để Làm Chủ",
  about_cta_line2: "Đế Chế Của Riêng Bạn?",
  about_cta_primary: "Bắt Đầu Ngay",
  about_cta_secondary: "Liên hệ Chuyên gia",
  about_cta_primary_link: "/book",
  about_cta_secondary_link: "#"
};
function getDefaults() {
  return { id: 1, ...DEFAULTS, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
}
const ALL_COLUMNS = Object.keys(DEFAULTS);
async function getHomepageSettings(db) {
  return db.prepare('SELECT * FROM "homepage_settings" WHERE "id" = 1').first();
}
async function upsertHomepageSettings(db, input) {
  const ts = (/* @__PURE__ */ new Date()).toISOString();
  if (Object.keys(input).length === 0) return;
  const fields = ['"updated_at" = ?'];
  const values = [ts];
  for (const key of ALL_COLUMNS) {
    if (key in input && input[key] !== void 0) {
      fields.push(`"${key}" = ?`);
      values.push(input[key]);
    }
  }
  await db.prepare(`UPDATE "homepage_settings" SET ${fields.join(", ")} WHERE "id" = 1`).bind(...values).run();
}
async function seedHomepageSettings(db) {
  const existing = await getHomepageSettings(db);
  if (existing) return;
  const cols = ['"id"', ...ALL_COLUMNS.map((c) => `"${c}"`)].join(", ");
  const placeholders = ALL_COLUMNS.map(() => "?").join(", ");
  const values = [1, ...ALL_COLUMNS.map((c) => DEFAULTS[c])];
  await db.prepare(`INSERT OR IGNORE INTO "homepage_settings" (${cols}) VALUES (1, ${placeholders})`).bind(...values).run();
}
export {
  getDefaults as a,
  getHomepageSettings as g,
  seedHomepageSettings as s,
  upsertHomepageSettings as u
};
