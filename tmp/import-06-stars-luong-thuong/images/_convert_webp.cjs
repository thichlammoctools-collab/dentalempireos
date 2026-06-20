
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "UcbKbNX8yolYYuxiFu6jI6HLpVb", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_01.png"}, {"index": 2, "src": "J8mRbg27PourMXxn9KHjg1Q9pMf", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_02.png"}, {"index": 3, "src": "LhujbVmuJovatexRE8MjjG4Ap6e", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_03.png"}, {"index": 4, "src": "K38vbH3Y4oVNVgxOR6EjYw45p7e", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_04.png"}, {"index": 5, "src": "WaZabqZHVoy3YtxDbjxjKopmppd", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_05.png"}, {"index": 6, "src": "KX9obv3T1o38Pdxp7QdjaNIWpSd", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_06.png"}, {"index": 7, "src": "IHEwb8Bs7oEIdUxYbgqjF2vIpAg", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_07.png"}, {"index": 8, "src": "LBQebd6r4obcZEx9xtTj8YRlpjb", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_08.png"}, {"index": 9, "src": "U5Cob1PiloXMLXxH6iJjN2sDpLg", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_09.png"}, {"index": 10, "src": "Pl9VbJpfqoiSb9xlII7jLbf5pKd", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_10.png"}, {"index": 11, "src": "Y68zbhsq8oi3S0xSAXDj9JnWpec", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_11.png"}, {"index": 12, "src": "V364bfC1Coebt3xIlcVjpqhhpYb", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_12.png"}, {"index": 13, "src": "FjEibjmzVorkoVxh21Gjhkm5pec", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_13.png"}, {"index": 14, "src": "SqsVbz0VNotAP0xunSpjnPnrp8d", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_14.png"}, {"index": 15, "src": "CgBbblrKToWprnxJxjtjV3y4psg", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_15.png"}, {"index": 16, "src": "M5GJbRwSboUrCPxFvSMjXO7epYc", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_16.png"}, {"index": 17, "src": "Lo6SbXs90oS5bgxvIgvjk6xupab", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_17.png"}, {"index": 18, "src": "JJbub5M6IokM0xx8qNXj3pZDp2b", "name": "image.png", "local": "tmp/import-06-stars-luong-thuong\\images\\img_18.png"}];
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
  fs.writeFileSync('tmp/import-06-stars-luong-thuong\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
