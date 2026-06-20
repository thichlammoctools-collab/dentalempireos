
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "DN7FbIXULoHQnPxZQEVjzQo9pbe", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_01.png"}, {"index": 2, "src": "BORpbRwQpo4xaTxI1rxj4qzIpqc", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_02.png"}, {"index": 3, "src": "MV3xbyvRVoVJ7MxcXyvj0UMJpng", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_03.png"}, {"index": 4, "src": "O6mGbGERcoB1DPxBvb4jcOnspKc", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_04.png"}, {"index": 5, "src": "JrW7bHpc4oXADAxf40AjzHVCpPg", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_05.png"}, {"index": 6, "src": "A72Xbc8o9oaZK6xoHqEjyLpgpFf", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_06.png"}, {"index": 7, "src": "LZElb99W2os69jxgiJHjcaJEpUb", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_07.png"}, {"index": 8, "src": "PqIjbkbjsoXF6kxd8HWjuhJXpNc", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_08.png"}, {"index": 9, "src": "Ydd8bSfI9oqZ7LxIbM3juD4qp2c", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_09.png"}, {"index": 10, "src": "OnUNbZFu3ommQex9bjRjhARcpde", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_10.png"}, {"index": 11, "src": "QcEWbwNC8oiVdLxMVrVjL6Lap5n", "name": "Task-98961714-1-1.png", "local": "tmp/import-10-personal-brand\\images\\img_11.png"}, {"index": 12, "src": "EhWHbuz2EohwVKx1kGzjBne5pMf", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_12.png"}, {"index": 13, "src": "JkDfboLCDopTrsxfmsvjHpXhpOg", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_13.png"}, {"index": 14, "src": "LyW7btMraoYXNExUvTejPAQ2ptg", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_14.png"}, {"index": 15, "src": "WJhwb5dGWoASOAx0rWOjVy8Eprc", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_15.png"}, {"index": 16, "src": "EFUJblvgdoCJBex0lQajUbFYp8c", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_16.png"}, {"index": 17, "src": "XUfCbwXlvoZYIyxfF6UjuGCbpQg", "name": "image.png", "local": "tmp/import-10-personal-brand\\images\\img_17.png"}];
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
  fs.writeFileSync('tmp/import-10-personal-brand\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
