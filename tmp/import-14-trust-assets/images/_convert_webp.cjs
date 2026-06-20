
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "OOOdbVqrgoIYS6xIX9WjkKWJp1c", "name": "image.png", "local": "tmp/import-14-trust-assets\\images\\img_01.png"}, {"index": 2, "src": "U2kqbB4lSoq3R2xBZP4jgXHnpPe", "name": "image.png", "local": "tmp/import-14-trust-assets\\images\\img_02.png"}, {"index": 3, "src": "QyjWbfzGmozspVx2DKqjpKPMpDd", "name": "image.png", "local": "tmp/import-14-trust-assets\\images\\img_03.png"}, {"index": 4, "src": "FrBVbqpjmoHbJ0xXoEPjV3OSpYd", "name": "image.png", "local": "tmp/import-14-trust-assets\\images\\img_04.png"}, {"index": 5, "src": "SGwfbkjS8opSEaxy8LNjjfzBpgh", "name": "image.png", "local": "tmp/import-14-trust-assets\\images\\img_05.png"}, {"index": 6, "src": "QR38b729cojFfIx5wyqjU4bYpVr", "name": "image.png", "local": "tmp/import-14-trust-assets\\images\\img_06.png"}, {"index": 7, "src": "G2pDbny7YozRnixSsTRjE1DVp9f", "name": "image.png", "local": "tmp/import-14-trust-assets\\images\\img_07.png"}];
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
  fs.writeFileSync('tmp/import-14-trust-assets\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
