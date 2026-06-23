// Test PDF generation with the built chunk
import fs from 'fs';
import { PDFDocument, rgb } from 'pdf-lib';
import { BE_VIETNAM_PRO_REGULAR, BE_VIETNAM_PRO_BOLD } from './src/lib/fonts/bvn-fonts.ts';

const row = {
  id: 1,
  created_at: '2026-06-23 22:00',
  lang: 'vi',
  owner_name: 'BS. Nguyễn Văn Test',
  clinic_name: 'Nha Khoa Test ABC',
  score_roots: 75, score_sky: 60, score_stars: 55, score_living: 50, score_total: 60,
  roots_q2: 'Phòng khám sinh ra để giúp mọi người có nụ cười khỏe đẹp',
  sky_sin_open: 'Từ chối tư vấn 1 ca veneer không cần thiết',
  sky_k_open: 'Bệnh nhân thường nói cảm thấy an tâm',
  sky_y_open: 'Lần cuối thừa nhận sai khi áp dụng quy trình mới quá sớm',
  stars_t_open: 'Team phối hợp tốt khi ca khó',
  stars_a_open: 'Cần đào tạo thêm kỹ năng giao tiếp',
  living_o1: 'Đang ở giai đoạn chuyển tiếp',
  ai_analysis: '## Tổng quan\n\nPhòng khám của bạn đang ở giai đoạn **chuyển tiếp**.\n\n## Điểm mạnh\n\n- Chuyên môn bác sĩ tốt\n- Đạo đức rõ ràng\n- Yêu thương bệnh nhân',
};

const doc = await PDFDocument.create();
const font = await doc.embedFont(new Uint8Array(BE_VIETNAM_PRO_REGULAR));
const fontBold = await doc.embedFont(new Uint8Array(BE_VIETNAM_PRO_BOLD));
const page = doc.addPage([595.28, 841.89]);

// Test Vietnamese text rendering
page.drawText('Hồ Sơ Gốc Rễ — Nha Khoa Test', {
  x: 50, y: 780, size: 20, font: fontBold, color: rgb(0.13, 0.27, 0.55),
});
page.drawText('Bệnh nhân rất hài lòng với dịch vụ chăm sóc tận tình', {
  x: 50, y: 740, size: 11, font, color: rgb(0.15, 0.15, 0.18),
});
page.drawText('Tổng điểm: 60/100', {
  x: 50, y: 700, size: 14, font: fontBold, color: rgb(0.96, 0.62, 0.04),
});

const pdfBytes = await doc.save();
fs.writeFileSync('test-output.pdf', pdfBytes);
console.log(`✓ Generated test PDF (${pdfBytes.length} bytes)`);
console.log('  Open: test-output.pdf');
