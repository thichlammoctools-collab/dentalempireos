
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "AVjebYnEko9J3px2fqVjOMOApLb", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_01.png"}, {"index": 2, "src": "TT4RbaZBXoH4mEx8QTqjwiJfpEh", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_02.png"}, {"index": 3, "src": "DxnMbbtueotW7vxafN5jduk1pjf", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_03.png"}, {"index": 4, "src": "UMAMbqTWWo0Y5OxzTLYjXbHpp5v", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_04.png"}, {"index": 5, "src": "L4ZabXIu9ocxOpxiOpVjJjfGpXe", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_05.png"}, {"index": 6, "src": "N6DSb7d3DokEpgx1dJRj0kmcpVh", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_06.png"}, {"index": 7, "src": "HUmMbxcyyohtJ0xswbZj5paKpkd", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_07.png"}, {"index": 8, "src": "HB9QbyRpXodWAnx21H2jtDgopRh", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_08.png"}, {"index": 9, "src": "L7Rtbsjemog27vxwtZTjEaVop0d", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_09.png"}, {"index": 10, "src": "Ajb2bRlk9oagUuxaYjAjHpHcp7f", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_10.png"}, {"index": 11, "src": "L7U5b0L4hoiicvxFbJujQED9pkg", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_11.png"}, {"index": 12, "src": "OhcHbyd08o2SZtxo0yIjQF3OpWg", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_12.png"}, {"index": 13, "src": "SRXebUyKyoaZ9JxitVXjXSSMpFv", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_13.png"}, {"index": 14, "src": "MyaBbdP0goqdG6xv4Fzjf7aGpuh", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_14.png"}, {"index": 15, "src": "VgzDbSR9cofzCrx3wwCjuIBJprc", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_15.png"}, {"index": 16, "src": "UokVbAlydoYpsfxO3xRjcAGkpne", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_16.png"}, {"index": 17, "src": "OZGSbl5dFo5D2ex69DQjj4jCpsJ", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_17.png"}, {"index": 18, "src": "UjQtbNJMEowu1ZxcEwfjAhP6pMd", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_18.png"}, {"index": 19, "src": "XNJsbDW05oAbAFxtbZKjiF7Apib", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_19.png"}, {"index": 20, "src": "ZbelbaJb8onI3yx9iV1jSpcVphb", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_20.png"}, {"index": 21, "src": "MfN5b9eARoEWgYxIzcZjijPGpKb", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_21.png"}, {"index": 22, "src": "IQjbbzw4IozVc1xGaFLjT31TpBh", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_22.png"}, {"index": 23, "src": "SKzsbDxxuoX7IYxcTAQj6jrmp7v", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_23.png"}, {"index": 24, "src": "NrMRbSgLPoH6bGx9pGbjWlktpRf", "name": "image.png", "local": "tmp/import-28-referral-os\\images\\img_24.png"}];
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
  fs.writeFileSync('tmp/import-28-referral-os\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
