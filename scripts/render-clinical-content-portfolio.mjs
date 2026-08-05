import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const sourceDir = resolve('artifacts/clinical-content-portfolio');
const publicDir = resolve('public/files');
await mkdir(publicDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  for (const lang of ['en', 'vi']) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    await page.goto(`file://${resolve(sourceDir, `portfolio-${lang}.html`)}`, { waitUntil: 'load' });
    await page.pdf({
      path: resolve(sourceDir, `portfolio-${lang}.pdf`),
      width: '13.333in',
      height: '7.5in',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    await page.close();
    await copyFile(resolve(sourceDir, `portfolio-${lang}.pdf`), resolve(publicDir, `dental-empire-os-clinical-content-portfolio-${lang}.pdf`));
  }
} finally {
  await browser.close();
}

console.log(`Rendered English and Vietnamese PDFs to ${publicDir}`);
