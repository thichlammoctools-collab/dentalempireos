
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "UWi2bqBX3oInLjxUnGuj3YZfpHe", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_01.png"}, {"index": 2, "src": "TPn1bTQa1og7QNxDMgIjMKQipdf", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_02.png"}, {"index": 3, "src": "HgmEbo0y2oWrVYx9BgujHrzspNe", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_03.png"}, {"index": 4, "src": "JdSUb8V6eo9zALxwhI8jdWnDpRf", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_04.png"}, {"index": 5, "src": "I1zwbUUvWoKZvaxEbZijG4wKpEb", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_05.png"}, {"index": 6, "src": "FolgbCVOgozh9txgwkfjYlM6p4c", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_06.png"}, {"index": 7, "src": "HcEcbcGQtoxDpyxvaf2jSr8cp1y", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_07.png"}, {"index": 8, "src": "OyHYbiarcoaLCUx5pP6juJd8pZc", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_08.png"}, {"index": 9, "src": "PuD3bk1pKowvyLxTARIjUBa9phf", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_09.png"}, {"index": 10, "src": "IfRybpgYIoZql5xElWZjpKripgb", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_10.png"}, {"index": 11, "src": "OEvnb9LcQogtEUxSJipjFGM8pj4", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_11.png"}, {"index": 12, "src": "ZAE6bpexBo9HYHxM3ZcjjJQup8p", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_12.png"}, {"index": 13, "src": "QX89bpGHYoJLT2xatWZjge6DpWe", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_13.png"}, {"index": 14, "src": "KOoibTRUPof796xChTHj5O0sp7f", "name": "image.png", "local": "tmp/import-03-roadmap-to-be-sky\\images\\img_14.png"}];
const results = {};
let totalBefore = 0, totalAfter = 0;

(async () => {
  for (const img of manifest) {
    const src = path.resolve(img.local);
    const dst = src.replace('.png', '.webp');
    try {
      const before = fs.statSync(src).size;
      await sharp(src).webp({ quality: 80 }).toFile(dst);
      const after = fs.statSync(dst).size;
      results[img.src] = dst;
      totalBefore += before;
      totalAfter += after;
      const pct = before > 0 ? Math.round((1 - after/before) * 100) : 0;
      console.log(`  [$${img.index}] ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB (-$${pct}%)`);
    } catch (e) {
      console.error(`  [$${img.index}] WARN: ${e.message}`);
      results[img.src] = src;
    }
  }
  fs.writeFileSync('tmp/import-03-roadmap-to-be-sky\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
