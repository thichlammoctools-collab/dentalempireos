
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "YBLSbMtwOoPC8cx0ApsjW02gpFe", "name": "image.png", "local": "tmp/import-12-clinic-system\\images\\img_01.png"}, {"index": 2, "src": "O0NfbQOhlorUZyxD8ZMjNQwWp2y", "name": "image.png", "local": "tmp/import-12-clinic-system\\images\\img_02.png"}, {"index": 3, "src": "Tpi1bv6CqoP10OxFQdtjfPD7pJd", "name": "image.png", "local": "tmp/import-12-clinic-system\\images\\img_03.png"}, {"index": 4, "src": "RTbabT9mxoPLRbxbBrzjlNG1p2g", "name": "image.png", "local": "tmp/import-12-clinic-system\\images\\img_04.png"}, {"index": 5, "src": "Ggv9bYVL9omF1wxK0qojT7U4pVg", "name": "image.png", "local": "tmp/import-12-clinic-system\\images\\img_05.png"}, {"index": 6, "src": "SOGdb0nQNoFHlrxqT29jOkzopRe", "name": "image.png", "local": "tmp/import-12-clinic-system\\images\\img_06.png"}];
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
  fs.writeFileSync('tmp/import-12-clinic-system\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
