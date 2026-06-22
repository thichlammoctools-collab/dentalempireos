
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "GshrbvNLBoosx4xKMPnjQvglpDd", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_01.png"}, {"index": 2, "src": "Ikxxbj8uZoX23VxpOtjj5dPQp3b", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_02.png"}, {"index": 3, "src": "Q9H5buVzDoGg1WxVQSNjwoSWpJb", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_03.png"}, {"index": 4, "src": "Nrr3butT9oC4ZDxs57ujcuNfppf", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_04.png"}, {"index": 5, "src": "JmEybjBlpo1U5lxCYzljIRahphb", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_05.png"}, {"index": 6, "src": "TeMqbIYUioDgmsxwjgkjmpwMpXd", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_06.png"}, {"index": 7, "src": "Eeikb3Ee4ofUalx70AbjGU55pxg", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_07.png"}, {"index": 8, "src": "G6MZbpoqMoFBsSxoIhzjWutrpUX", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_08.png"}, {"index": 9, "src": "CCtmbcC8Ao4JzPxTJotjCYCXpHh", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_09.png"}, {"index": 10, "src": "L91wb0pjFoMutCxcCMmjgyhHppd", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_10.png"}, {"index": 11, "src": "Yv2tbCvp5ovn0NxWNQ8jRrFNpFe", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_11.png"}, {"index": 12, "src": "E395bZJ7Boh2odxEV5ZjOxrKpld", "name": "image.png", "local": "tmp/import-17-referral-ecosystem\\images\\img_12.png"}];
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
  fs.writeFileSync('tmp/import-17-referral-ecosystem\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
