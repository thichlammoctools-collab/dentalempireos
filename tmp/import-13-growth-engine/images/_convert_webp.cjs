
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "Eqk6b7YGooUIFsxMX94j3iAkpMe", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_01.png"}, {"index": 2, "src": "FrMRb7EsZo1YCuxLMBGjQqbEp1f", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_02.png"}, {"index": 3, "src": "RNOPbOf4zoSPKWx9unyjVj0Jpzd", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_03.png"}, {"index": 4, "src": "KO5tbgLzXojXAYxaTOKjpqMepac", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_04.png"}, {"index": 5, "src": "Os4vb2rF6oopjxx9bxAjtBjUp0d", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_05.png"}, {"index": 6, "src": "NnGYbLMbno5g0Wx9DL5jI5BtpVd", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_06.png"}, {"index": 7, "src": "APV5byWCqoExFix2SNuj4sLZpVg", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_07.png"}, {"index": 8, "src": "XxvqbYVryo4y3axr1RKjCmpDpLb", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_08.png"}, {"index": 9, "src": "SCmxbrr6koASyHxfmK1jr87dpab", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_09.png"}, {"index": 10, "src": "TgaGbfwMMopYeUxtBFPjOZiUp6b", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_10.png"}, {"index": 11, "src": "VuxSbp8oWomkfPxZMP2jat4Lpqe", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_11.png"}, {"index": 12, "src": "PtyFbUNp9ogqkfxBBV2j1JrDpQb", "name": "image.png", "local": "tmp/import-13-growth-engine\\images\\img_12.png"}];
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
  fs.writeFileSync('tmp/import-13-growth-engine\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
