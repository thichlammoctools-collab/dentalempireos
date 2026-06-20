
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "VNhhbOhZWoke1UxKSImjcDv6pvc", "name": "image.png", "local": "tmp/import-16-patient-experience\\images\\img_01.png"}, {"index": 2, "src": "DAhQbgYSPoPuXpxphssjmpVIpmg", "name": "image.png", "local": "tmp/import-16-patient-experience\\images\\img_02.png"}, {"index": 3, "src": "Rj46bMgFgo58Lxx84zcj44ispNe", "name": "image.png", "local": "tmp/import-16-patient-experience\\images\\img_03.png"}, {"index": 4, "src": "Ik62bfeaaoa8qnxaw9LjTi4Upbh", "name": "image.png", "local": "tmp/import-16-patient-experience\\images\\img_04.png"}, {"index": 5, "src": "S1q6by3bKoIuFMxICRZjtut7pIh", "name": "image.png", "local": "tmp/import-16-patient-experience\\images\\img_05.png"}, {"index": 6, "src": "FB7nbbtrKoq4lox5VW0jXNdnpTh", "name": "image.png", "local": "tmp/import-16-patient-experience\\images\\img_06.png"}, {"index": 7, "src": "NXxHbxXozo6qR7xvjS9j3rgapDh", "name": "image.png", "local": "tmp/import-16-patient-experience\\images\\img_07.png"}, {"index": 8, "src": "AKZwbS3fHozGZTxADIYjAN3WpYg", "name": "image.png", "local": "tmp/import-16-patient-experience\\images\\img_08.png"}, {"index": 9, "src": "LhG6bRoeDotmSRxUFAhjaSmepLg", "name": "image.png", "local": "tmp/import-16-patient-experience\\images\\img_09.png"}];
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
  fs.writeFileSync('tmp/import-16-patient-experience\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
