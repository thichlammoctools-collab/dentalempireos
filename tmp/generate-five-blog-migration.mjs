import { readFile, writeFile } from 'node:fs/promises';

const posts = [
  {
    file: 'tmp/5-sop-phong-kham-moi-nen-viet-truoc-khi-tuyen-them-nguoi.md',
    id: 'post-sop-foundation',
    description: 'Chọn 5 SOP nền tảng cho phòng khám mới: tiếp nhận, lịch hẹn, chuẩn bị ca, thanh toán và xử lý phản hồi.',
    category: 'cat-van-hanh', scanner: 'quy-trinh-check',
    images: ['blog-sop-workflow.svg', 'blog-sop-handoff.svg', 'blog-sop-template.svg'],
    tags: [['tag-quy-trinh', 'Quy Trình', 'quy-trinh'], ['tag-sop', 'SOP', 'sop'], ['tag-phong-kham-moi', 'Phòng Khám Mới', 'phong-kham-moi'], ['tag-van-hanh', 'Vận Hành', 'van-hanh']],
  },
  {
    file: 'tmp/onboarding-14-ngay-nhan-su-moi-phong-kham-nha-khoa.md',
    id: 'post-onboarding-14-ngay',
    description: 'Khung onboarding 14 ngày cho phòng khám nha khoa: từ giới thiệu văn hóa, học quy trình đến thực hành có giám sát.',
    category: 'cat-nhan-su', scanner: 'dao-tao-check',
    images: ['blog-onboarding-role-map.svg', 'blog-onboarding-learning-path.svg', 'blog-onboarding-review.svg'],
    tags: [['tag-nhan-su', 'Nhân Sự', 'nhan-su'], ['tag-dao-tao', 'Đào Tạo', 'dao-tao'], ['tag-onboarding', 'Onboarding', 'onboarding'], ['tag-phong-kham-moi', 'Phòng Khám Mới', 'phong-kham-moi']],
  },
  {
    file: 'tmp/tu-tin-nhan-den-lich-hen-he-thong-tiep-don-phong-kham.md',
    id: 'post-he-thong-tiep-don',
    title: 'Từ Tin Nhắn Đến Lịch Hẹn: Thiết Kế Hệ Thống Tiếp Đón Nhất Quán',
    slug: 'tu-tin-nhan-den-lich-hen-he-thong-tiep-don-phong-kham',
    description: 'Thiết kế luồng tiếp đón phòng khám từ liên hệ đầu tiên, xác nhận lịch, đón khách đến follow-up mà không phụ thuộc vào trí nhớ.',
    category: 'cat-van-hanh', scanner: 'tiep-don-check',
    images: ['blog-reception-touchpoints.svg', 'blog-reception-flow.svg', 'blog-reception-shared-data.svg'],
    tags: [['tag-tiep-don', 'Tiếp Đón', 'tiep-don'], ['tag-lich-hen', 'Lịch Hẹn', 'lich-hen'], ['tag-trai-nghiem-benh-nhan', 'Trải Nghiệm Bệnh Nhân', 'trai-nghiem-benh-nhan'], ['tag-quy-trinh', 'Quy Trình', 'quy-trinh']],
  },
  {
    file: 'tmp/bang-dong-tien-hang-tuan-cho-chu-phong-kham.md',
    id: 'post-dong-tien-hang-tuan',
    title: 'Bảng Dòng Tiền Hàng Tuần Cho Chủ Phòng Khám: Theo Dõi Gì Trước?',
    slug: 'bang-dong-tien-hang-tuan-cho-chu-phong-kham',
    description: 'Khung theo dõi dòng tiền hàng tuần cho phòng khám: tách tiền cá nhân, thu-chi, khoản phải trả và lịch ra quyết định.',
    category: 'cat-tai-chinh', scanner: 'tai-chinh-check',
    images: ['blog-finance-cashflow.svg', 'blog-finance-four-groups.svg', 'blog-finance-review-cycle.svg'],
    tags: [['tag-tai-chinh', 'Tài Chính', 'tai-chinh'], ['tag-dong-tien', 'Dòng Tiền', 'dong-tien'], ['tag-quan-tri', 'Quản Trị', 'quan-tri'], ['tag-phong-kham-moi', 'Phòng Khám Mới', 'phong-kham-moi']],
  },
  {
    file: 'tmp/quan-ly-vat-tu-phong-kham-muc-ton-toi-thieu-lich-kiem-ke.md',
    id: 'post-quan-ly-vat-tu',
    description: 'Khung quản lý vật tư phòng khám: danh mục thiết yếu, mức tồn tối thiểu, người đặt hàng, lịch kiểm kê và nhật ký thiết bị.',
    category: 'cat-van-hanh', scanner: 'kho-vat-tu-check',
    images: ['blog-inventory-dashboard.svg', 'blog-inventory-levels.svg', 'blog-inventory-check-cycle.svg'],
    tags: [['tag-vat-tu', 'Vật Tư', 'vat-tu'], ['tag-thiet-bi', 'Thiết Bị', 'thiet-bi'], ['tag-van-hanh', 'Vận Hành', 'van-hanh'], ['tag-checklist', 'Checklist', 'checklist']],
  },
];

const escape = (value) => value.replaceAll("'", "''");
const unquote = (value) => value.replace(/^"|"$/g, '');
let sql = `-- Five Tier 1 satellite Blog drafts with three original illustrations each.\n\n`;
const allTags = new Map();
for (const post of posts) for (const tag of post.tags) allTags.set(tag[0], tag);
sql += `INSERT OR IGNORE INTO "blog_tag" ("id","name","slug","post_count","created_at") VALUES\n`;
sql += [...allTags.values()].map(([id, name, slug]) => `  ('${id}','${name}','${slug}',0,'2026-08-14T00:00:00Z')`).join(',\n') + ';\n\n';

for (const post of posts) {
  let source = await readFile(post.file, 'utf8');
  let frontmatter = {};
  if (source.startsWith('---')) {
    const end = source.indexOf('\n---', 3);
    const raw = source.slice(3, end).trim();
    for (const line of raw.split('\n')) {
      const match = /^([\w_]+):\s*(.+)$/.exec(line);
      if (match) frontmatter[match[1]] = unquote(match[2].trim());
    }
    source = source.slice(end + 4).trim();
  }
  const title = post.title ?? frontmatter.title;
  const slug = post.slug ?? frontmatter.slug;
  source = source.replace(/^# .+\n+/, '');
  post.images.forEach((image, index) => {
    const url = `/media/blog/ai/${image}`;
    const alt = `${title} — minh họa ${index + 1}`;
    source = source.replace(`{{IMAGE:0${index + 1}}}`, `![${alt}](${url})`);
  });
  source = source.replace('href="#tiep-don-check"', 'href="/scanner/tiep-don-check"');
  source = source.replace('href="#tai-chinh-check"', 'href="/scanner/tai-chinh-check"');
  const cover = `/media/blog/ai/${post.images[0]}`;
  sql += `INSERT OR IGNORE INTO "blog_post" ("id","title","slug","description","content_md","cover_url","cover_alt","category_id","author_name","status","is_featured","is_pinned","is_recommended","read_time_minutes","view_count","published_at","chapter_id","scanner_id","created_at","updated_at","access_tier")\n`;
  sql += `VALUES ('${post.id}','${escape(title)}','${slug}','${escape(post.description)}','${escape(source)}','${cover}','${escape(`${title} — minh họa hệ thống vận hành`)}','${post.category}','Dental Empire','draft',0,0,1,10,0,NULL,NULL,CASE WHEN EXISTS (SELECT 1 FROM "survey_definition" WHERE "id" = '${post.scanner}') THEN '${post.scanner}' ELSE NULL END,'2026-08-14T00:00:00Z','2026-08-14T00:00:00Z','free');\n\n`;
  sql += `INSERT OR IGNORE INTO "blog_post_tag" ("post_id","tag_id") VALUES\n`;
  sql += post.tags.map(([id]) => `  ('${post.id}','${id}')`).join(',\n') + ';\n\n';
}
sql += `UPDATE "blog_tag" SET "post_count" = (SELECT COUNT(*) FROM "blog_post_tag" WHERE "tag_id" = "blog_tag"."id");\n`;
await writeFile('migrations/0090_seed_tier_1_satellite_blogs.sql', sql, 'utf8');
