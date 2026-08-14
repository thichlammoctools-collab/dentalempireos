import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import ExcelJS from 'exceljs';
import { chromium } from 'playwright';
import { CLINIC_RESOURCE_MANIFEST } from '../src/data/resources/clinic-resource-manifest.ts';

const outputDir = resolve('artifacts/clinic-resources');
await mkdir(outputDir, { recursive: true });

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function resourceHtml(resource) {
  const sections = resource.pdf.sections.map((section) => `<section><h2>${escapeHtml(section.title)}</h2><ul>${section.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul></section>`).join('');
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><style>
    @font-face { font-family: BeVietnam; src: url('file://${resolve('src/lib/fonts/BeVietnamPro-Regular.ttf').replace(/\\/g, '/')}'); }
    @font-face { font-family: BeVietnam; src: url('file://${resolve('src/lib/fonts/BeVietnamPro-Bold.ttf').replace(/\\/g, '/')}'); font-weight: 700; }
    @page { size: A4; margin: 18mm; } body { font-family: BeVietnam, sans-serif; color:#102a43; font-size:11pt; line-height:1.6; } h1 { font-size:28pt; line-height:1.15; margin:0; color:#0b2745; } h2 { font-size:15pt; margin:22px 0 8px; color:#0d5c91; } .eyebrow { color:#d97706; font-weight:700; text-transform:uppercase; letter-spacing:.08em; font-size:9pt; } .box { background:#f0f7fb; border-left:4px solid #0d5c91; padding:12px 16px; margin:18px 0; } footer { margin-top:28px; padding-top:12px; border-top:1px solid #ccd6dd; color:#52616b; font-size:9pt; } li { margin:5px 0; }
  </style></head><body><p class="eyebrow">Dental Empire OS · Resource Kit · Version ${resource.version}</p><h1>${escapeHtml(resource.title)}</h1><p><strong>Dành cho:</strong> ${escapeHtml(resource.pdf.audience)}</p><div class="box"><strong>Mục tiêu triển khai</strong><ul>${resource.pdf.objectives.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>${sections}<div class="box"><strong>Checklist triển khai</strong><ol><li>Chỉ định owner cho từng hạng mục.</li><li>Thiết lập SLA và bằng chứng hoàn thành.</li><li>Review KPI và ngoại lệ hằng tuần.</li></ol></div><footer><strong>Lưu ý:</strong> Đây là framework vận hành, script và trường dữ liệu. Không thay thế tư vấn chuyên môn, phác đồ hoặc hướng dẫn điều trị. ${resource.reviewFlags.map(escapeHtml).join(' ')}</footer></body></html>`;
}

async function generatePdf(resource) {
  const htmlPath = resolve(outputDir, `${resource.id}.html`);
  const pdfPath = resolve(outputDir, resource.pdf.filename);
  await writeFile(htmlPath, resourceHtml(resource), 'utf8');
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'load' });
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, margin: { top: '18mm', right: '18mm', bottom: '18mm', left: '18mm' } });
  } finally { await browser.close(); }
  return pdfPath;
}

async function generateWorkbook(resource) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Dental Empire OS';
  workbook.properties.title = resource.title;
  const readme = workbook.addWorksheet('README');
  readme.columns = [{ width: 28 }, { width: 100 }];
  readme.addRows([['Tài liệu', resource.title], ['Phiên bản', String(resource.version)], ['Hướng dẫn', 'Các dòng mẫu chỉ dùng để minh họa; hãy thay bằng dữ liệu vận hành đã được phòng khám phê duyệt.'], ['Disclaimer', `Framework vận hành. ${resource.reviewFlags.join(' ')}`]]);
  readme.getColumn(1).font = { bold: true };
  readme.views = [{ state: 'frozen', ySplit: 1 }];
  for (const sheetDef of resource.workbook.sheets) {
    const sheet = workbook.addWorksheet(sheetDef.name);
    sheet.columns = sheetDef.columns.map((header) => ({ header, key: header, width: Math.max(15, Math.min(30, header.length + 8)) }));
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D5C91' } };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
    sheetDef.sampleRows.forEach((row) => sheet.addRow(row));
    for (const dropdown of sheetDef.dropdowns ?? []) {
      const column = sheet.getColumn(dropdown.column).number;
      for (let row = 2; row <= 500; row += 1) sheet.getCell(row, column).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${dropdown.values.join(',')}"`] };
    }
    sheet.autoFilter = { from: 'A1', to: `${String.fromCharCode(64 + sheetDef.columns.length)}1` };
  }
  const path = resolve(outputDir, resource.workbook.filename);
  await workbook.xlsx.writeFile(path);
  return path;
}

const outputs = [];
for (const resource of CLINIC_RESOURCE_MANIFEST) {
  const files = await Promise.all([generatePdf(resource), generateWorkbook(resource)]);
  for (const path of files) {
    const content = await readFile(path);
    outputs.push({ resourceId: resource.id, filename: path.split(/[/\\]/).pop(), path, byteSize: content.byteLength, sha256: createHash('sha256').update(content).digest('hex') });
  }
}
await writeFile(resolve(outputDir, 'manifest-output.json'), `${JSON.stringify(outputs, null, 2)}\n`, 'utf8');
console.log(`Generated ${outputs.length} resource assets in ${outputDir}`);
