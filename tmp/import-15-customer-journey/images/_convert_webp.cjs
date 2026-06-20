
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "Tp2sbwqoioVxksxySOAj39A2p8J", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_01.png"}, {"index": 2, "src": "LifhbjIOpocEkmxACykjiRXWpPe", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_02.png"}, {"index": 3, "src": "HvqQbyXoYoDgpIxpJfgjmU4npjh", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_03.png"}, {"index": 4, "src": "QMRSbGsNwo4EMCxOJ9BjGml9pNf", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_04.png"}, {"index": 5, "src": "NpQBbdxCZobGP5xuxrFjyKe4p5g", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_05.png"}, {"index": 6, "src": "RV6qbsLclowdDNx2xcNjOB4Bp6V", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_06.png"}, {"index": 7, "src": "V3C1bRPW4oBl0sxxYMFjI2Lgpvg", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_07.png"}, {"index": 8, "src": "PVrCblOpeopkhcxFczcjJ2IKpHc", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_08.png"}, {"index": 9, "src": "QfFBbmKHHo2igwxAFmvjypJ9ptb", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_09.png"}, {"index": 10, "src": "GdkCbVWySo74GJxbRcwjqJZmpNf", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_10.png"}, {"index": 11, "src": "Jwf7bz0LzolFRcxxvQZjyOhipBc", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_11.png"}, {"index": 12, "src": "HlR8bMMF3oZ8vPx2YBlj18ftpbE", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_12.png"}, {"index": 13, "src": "ZXtDbECvAoHvOhxOrVvjqASvpvb", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_13.png"}, {"index": 14, "src": "TeUXbaKn4o5acvxObXajE8NkpYd", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_14.png"}, {"index": 15, "src": "ZnaybfM3YojIKHxfiJNjbN6Wpnc", "name": "image.png", "local": "tmp/import-15-customer-journey\\images\\img_15.png"}];
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
  fs.writeFileSync('tmp/import-15-customer-journey\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
