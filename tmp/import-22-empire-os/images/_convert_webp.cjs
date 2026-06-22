
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "A6HfbOlSLoYca5xBaHvjynQvpZf", "name": "image.png", "local": "tmp/import-22-empire-os\\images\\img_01.png"}, {"index": 2, "src": "XMVhba5qfoibhFxOMntjQQ7Jp7c", "name": "image.png", "local": "tmp/import-22-empire-os\\images\\img_02.png"}, {"index": 3, "src": "Jn5gbIjnJoQknKxLDzyjqO5hpyg", "name": "image.png", "local": "tmp/import-22-empire-os\\images\\img_03.png"}, {"index": 4, "src": "SfSbbVXhdoCFGfxFjIKj2GbspyW", "name": "image.png", "local": "tmp/import-22-empire-os\\images\\img_04.png"}];
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
  fs.writeFileSync('tmp/import-22-empire-os\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
