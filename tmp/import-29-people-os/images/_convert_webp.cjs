
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "ZTQ2b84XVoRecKx8ZV3jBeJLpHf", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_01.png"}, {"index": 2, "src": "Tb0AbsBXuoR0aFxeOfFjqO6opxw", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_02.png"}, {"index": 3, "src": "IsW2bSFj4ohuWExyEqbjgNLQp3e", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_03.png"}, {"index": 4, "src": "Hs9lbhCUwoh45UxXmKFjlXz1p1e", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_04.png"}, {"index": 5, "src": "QNvebLQERoJ0RsxnkGij6qc3pCd", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_05.png"}, {"index": 6, "src": "BPrQbqQXvoGoVgxBYW7j0kmgpGg", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_06.png"}, {"index": 7, "src": "ZVJ0bUyQyol5IYxT3PJjeHALpxf", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_07.png"}, {"index": 8, "src": "Kw6PbRDvRog8eSx873vj0yuSpFb", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_08.png"}, {"index": 9, "src": "ZjcybWucBowjT2xPHBojVLvipyc", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_09.png"}, {"index": 10, "src": "ZXbsbZ0kloIg47xYxe7jcK4Npnd", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_10.png"}, {"index": 11, "src": "Qhk8bhSSuoW30uxJXQ6jXARvpmg", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_11.png"}, {"index": 12, "src": "O59rbjSuQo3Hh5xtz1NjezyRpHe", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_12.png"}, {"index": 13, "src": "VDKrbhgoDoEejyxT5u4jlzF7pWh", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_13.png"}, {"index": 14, "src": "RR2UbNDoWoZyc7xQdluj1oTLpBh", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_14.png"}, {"index": 15, "src": "ZRhMbpkPZo7iXkxACRQjOm97p4d", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_15.png"}, {"index": 16, "src": "Wowdb3yQKo3GfhxYv2yjBrqrpsc", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_16.png"}, {"index": 17, "src": "KV45bKnYTow3XWx4N5IjFrtfpAb", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_17.png"}, {"index": 18, "src": "AE83bKcT2oEOboxHkYJjDkhLp0c", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_18.png"}, {"index": 19, "src": "QWmRbCbnxolvbDxaDd3jXxZJpsc", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_19.png"}, {"index": 20, "src": "DgJXbrK4DoyvzyxO8CvjHzBSp6c", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_20.png"}, {"index": 21, "src": "WOKqbziZioM6QCxNdR9jNENXpqh", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_21.png"}, {"index": 22, "src": "OODpbZTBLoEpGJx5Pj8jmv01pMd", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_22.png"}, {"index": 23, "src": "KcGebuZ5noxhghxvIo6jJ8YqpFg", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_23.png"}, {"index": 24, "src": "MZPibPtyOonffixD8LZjAzrSpJc", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_24.png"}, {"index": 25, "src": "UYn0bJRA3ouE0tx4xhSj66z5pTf", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_25.png"}, {"index": 26, "src": "XaD7bF88FoYjNKx8nekj1Sfvplh", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_26.png"}, {"index": 27, "src": "Q5gcbmOYSox6kTxqf9fj3V1tpre", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_27.png"}, {"index": 28, "src": "Xu7gb7MJQoYXxUxCOlrjHzYZpCV", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_28.png"}, {"index": 29, "src": "VHOGb66syo9VRGx5LE5jHxmFpVf", "name": "image.png", "local": "tmp/import-29-people-os\\images\\img_29.png"}];
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
  fs.writeFileSync('tmp/import-29-people-os\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
