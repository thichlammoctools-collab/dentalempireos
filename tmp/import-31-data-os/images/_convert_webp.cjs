
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "FJuPbDqn1oel4pxg2qyjQlxXpnd", "name": "image.png", "local": "tmp/import-31-data-os\\images\\img_01.png"}, {"index": 2, "src": "IdodbHCmyoMDYmxukh5j3buKpdb", "name": "image.png", "local": "tmp/import-31-data-os\\images\\img_02.png"}, {"index": 3, "src": "SYgAbcQjdoJuXmxX4Urj6VYMpod", "name": "image.png", "local": "tmp/import-31-data-os\\images\\img_03.png"}, {"index": 4, "src": "BbUBbCaUIoHwHFx6Uv0jiLMSpbh", "name": "image.png", "local": "tmp/import-31-data-os\\images\\img_04.png"}, {"index": 5, "src": "C9r2bdDF4oSxV8x6AEFjuwxqpJ6", "name": "image.png", "local": "tmp/import-31-data-os\\images\\img_05.png"}, {"index": 6, "src": "JG90bGvqNos3RLxYWPyjIAr7pBd", "name": "image.png", "local": "tmp/import-31-data-os\\images\\img_06.png"}, {"index": 7, "src": "KuERbV7tJoRInixq5Fjj2YitpDf", "name": "image.png", "local": "tmp/import-31-data-os\\images\\img_07.png"}, {"index": 8, "src": "EtYnb0AhtoKcZBxmkgOjzU0gpze", "name": "image.png", "local": "tmp/import-31-data-os\\images\\img_08.png"}, {"index": 9, "src": "EcaWbtH5QorvnQxRNIjjsPdupnh", "name": "image.png", "local": "tmp/import-31-data-os\\images\\img_09.png"}, {"index": 10, "src": "BClmbDejNosmjvxgwCxj0itcpEc", "name": "image.png", "local": "tmp/import-31-data-os\\images\\img_10.png"}];
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
  fs.writeFileSync('tmp/import-31-data-os\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
