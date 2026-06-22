
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "HVcEbDZI2oTI3BxuKAFjQxwxpfh", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_01.png"}, {"index": 2, "src": "ONYobBLt6onpRnxLAfHjNcyppkc", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_02.png"}, {"index": 3, "src": "QVfwbnbV3o36mfxU5spjoqB3pSh", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_03.png"}, {"index": 4, "src": "TyMPb3Xcyonpp4xFw0KjEXypp4g", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_04.png"}, {"index": 5, "src": "T4Tjb8cALo23f5xaB4jj6kszpPc", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_05.png"}, {"index": 6, "src": "HKW9bTz12ozZMVxqXL4jlGgsptg", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_06.png"}, {"index": 7, "src": "FOa0b8tVmo9igJxNDgAjNmUupdc", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_07.png"}, {"index": 8, "src": "Fcf3be74AoeYCYxPzzsjzJ3KpTb", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_08.png"}, {"index": 9, "src": "Hs1QbieXMoobPbxxWpcjdvD7pCe", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_09.png"}, {"index": 10, "src": "RYZwbcdkBofisJx34B7jRqJtpqd", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_10.png"}, {"index": 11, "src": "RiizbALmjoc9GQx0WFajLbJ9pRe", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_11.png"}, {"index": 12, "src": "VjTvbgNeGoMXNxxwfLFjvZ9zpnh", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_12.png"}, {"index": 13, "src": "X1xjbGFv3ogOz6xVrMOjl5t4pKg", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_13.png"}, {"index": 14, "src": "Kd7abbbVloSqqkxSayNj4GTQpvd", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_14.png"}, {"index": 15, "src": "Im8Sbxy1Oon5Usxoudkj3jRWpLf", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_15.png"}, {"index": 16, "src": "JVvPbhlM0o3M3ax5TIejJgAOp7b", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_16.png"}, {"index": 17, "src": "TrR0bpivOo1Q7KxiS7UjvKNvpkf", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_17.png"}, {"index": 18, "src": "NjOVbXcAnocXGnxuMnLjODtTpie", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_18.png"}, {"index": 19, "src": "EdivbgJ0modLVMxJg5ZjWJUVpcv", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_19.png"}, {"index": 20, "src": "WQCwb7oUSonZyHxwglVjGCfcpWg", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_20.png"}, {"index": 21, "src": "HWSbbRi9YoyuxsxKSmpjxAsnpGf", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_21.png"}, {"index": 22, "src": "BQa6b7eJGo3zgAxRIGyj3F6Wp8e", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_22.png"}, {"index": 23, "src": "D5uCbaqTDo6LY7xQUOZjg546pWm", "name": "image.png", "local": "tmp/import-26-marketing-os\\images\\img_23.png"}];
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
  fs.writeFileSync('tmp/import-26-marketing-os\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
