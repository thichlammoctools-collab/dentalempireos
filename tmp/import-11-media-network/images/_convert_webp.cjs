
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "R2MZbTUmfoxrpwxCOzVjt1FDpde", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_01.png"}, {"index": 2, "src": "KouTbr6nxoAKDXxutcqj6xaSp7e", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_02.png"}, {"index": 3, "src": "IPTVb7ZieoapI0xCozdjnQ2ypfd", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_03.png"}, {"index": 4, "src": "VLmObi6n2owTLTxwomHjlnVspjf", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_04.png"}, {"index": 5, "src": "OT5kbaE0MoAAUFxEG7Hj5zospMd", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_05.png"}, {"index": 6, "src": "WiClbPmJEof6guxOJWIjt40dpWe", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_06.png"}, {"index": 7, "src": "Im2pbL8QOo3lI1xrhKnjZlMtpQd", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_07.png"}, {"index": 8, "src": "YHY2bsUntowp8BxRUotjycwMpdg", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_08.png"}, {"index": 9, "src": "Q4GWbeZrQoaqtbxGj2RjVJT3pxA", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_09.png"}, {"index": 10, "src": "XiSwbmMnNoNgULx4bFnj00kwpje", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_10.png"}, {"index": 11, "src": "JbznbDIlIoDdbyxhhGmjQGQ3pdg", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_11.png"}, {"index": 12, "src": "MIaibcfH4ok3VwxrHPfjlTBUpCh", "name": "image.png", "local": "tmp/import-11-media-network\\images\\img_12.png"}];
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
  fs.writeFileSync('tmp/import-11-media-network\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
