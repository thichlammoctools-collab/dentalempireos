
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "ABtIbsR87ovdXbx6sAejU9djpif", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_01.png"}, {"index": 2, "src": "Kz1wbxmW0ookC7x8MUwjlJOApCg", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_02.png"}, {"index": 3, "src": "EJu4bA8yVoqSbGxY5kZjOwZSp9d", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_03.png"}, {"index": 4, "src": "AQuLbN6epob6n9xA4HZjmhY3pJe", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_04.png"}, {"index": 5, "src": "OrJxbz5XroAmhAxFqiVjaagxpJd", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_05.png"}, {"index": 6, "src": "NH69bfsbEo9DKVxW6RpjbWuPpmc", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_06.png"}, {"index": 7, "src": "Wx50bD3Mto35TwxcLwhj6NnApjb", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_07.png"}, {"index": 8, "src": "LSLIb3UAro94jXxu5jXjTrOipzd", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_08.png"}, {"index": 9, "src": "HZcTbg4Lbol0kYxLKebj5dIZpnh", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_09.png"}, {"index": 10, "src": "CrImbdt5uomaigx2jWsj9uqwpfk", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_10.png"}, {"index": 11, "src": "MiUgbCanHosxLUxoMunjW1fBpId", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_11.png"}, {"index": 12, "src": "Q0qkb9TfRouj5UxrVJnjHt1Gpgd", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_12.png"}, {"index": 13, "src": "UtBybdCiMosrpYxUJYUjJpsOp0f", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_13.png"}, {"index": 14, "src": "V8CGbhrjRofgz6xB5vxj0IzDpHe", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_14.png"}, {"index": 15, "src": "ANBsbIM8hoeu2ZxzVwBjjLSipid", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_15.png"}, {"index": 16, "src": "HSbwbLuOsouzSHx5rnSjoJybpMd", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_16.png"}, {"index": 17, "src": "QfHPbGVEsoS0i1xHgWijlbTspxg", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_17.png"}, {"index": 18, "src": "LExibPSr7otcBPx7yrnjEJqaphb", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_18.png"}, {"index": 19, "src": "TbbHbDAJMoOCa6x7cqsjzEwnpAb", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_19.png"}, {"index": 20, "src": "OmTbbRopxoy5yrxtepXjmTNtpVh", "name": "image.png", "local": "tmp/import-04-ky-nang-ca-nhan\\images\\img_20.png"}];
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
  fs.writeFileSync('tmp/import-04-ky-nang-ca-nhan\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
