
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "A2ZobmIQZo3a1uxEQ2CjXZIFphe", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_01.png"}, {"index": 2, "src": "EOvGb2UTeoyy1Vxd9Fhj5CC0prv", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_02.png"}, {"index": 3, "src": "SBarbZ0q4oCSSXxDxWojSptypTf", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_03.png"}, {"index": 4, "src": "HSUQb03djo8f97xb3nDjMHLlpbb", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_04.png"}, {"index": 5, "src": "LdQobxn5ToAcmbx2ivfjWT1Zpsf", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_05.png"}, {"index": 6, "src": "GTuWblYokobo8vxWVvAjbCglpEf", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_06.png"}, {"index": 7, "src": "Wg0GbsG57oSvKPxcuBdjlsyqpxb", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_07.png"}, {"index": 8, "src": "IogYbBZfBoO6Bmxr4vtjg4ktp2f", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_08.png"}, {"index": 9, "src": "UiGjbKKbGoWKl3xPdjDjMid5pPf", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_09.png"}, {"index": 10, "src": "FdCKbSTnZo7v4RxbDOujoSRtpKc", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_10.png"}, {"index": 11, "src": "LjtLbVa3AohZW9xYLVPjNr5Rpwh", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_11.png"}, {"index": 12, "src": "NYWJbjlsJo0Xbvx3g2ojPN8dp2d", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_12.png"}, {"index": 13, "src": "QA73bmac5oOgTDx5RMqjsNfJpJb", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_13.png"}, {"index": 14, "src": "Y5w5bhuGio6pVVxCHDdjqQ0opCb", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_14.png"}, {"index": 15, "src": "Dq9ibpzhBoueJWxlhsjjKJQipnB", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_15.png"}, {"index": 16, "src": "KSzAb6gc4oULw5x2vznjjMA5pfg", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_16.png"}, {"index": 17, "src": "XfdBbN4iYoACB7x15pfj0rSgpYJ", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_17.png"}, {"index": 18, "src": "TPmwbXqOaoIbWMxiWuxjzTK2pTd", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_18.png"}, {"index": 19, "src": "ZZP0bpseCoZeFPxCulwjko0qpI5", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_19.png"}, {"index": 20, "src": "L7qQbFQ6Motj4UxBHrPjCOm3prh", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_20.png"}, {"index": 21, "src": "GKoGbcTLSok62ZxM1jNjNwQAp8b", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_21.png"}, {"index": 22, "src": "LPEabxMojoz7UTxR7NNjP1BFpVh", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_22.png"}, {"index": 23, "src": "DZfCbPnKZoPkr7xssukjgV6fp6c", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_23.png"}, {"index": 24, "src": "FKCNb6KaIocVUGx4cdNjcypapWe", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_24.png"}, {"index": 25, "src": "EvOhbTi3woFO8Ax8gCej5QSWpRb", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_25.png"}, {"index": 26, "src": "J6QSb418tooo5dxYtqLjZhzhpac", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_26.png"}, {"index": 27, "src": "OcuKbQS2Uo36CqxGD9hjWf45pkg", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_27.png"}, {"index": 28, "src": "TvzZb4BNLoyT2ixHPTHj0L39pR6", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_28.png"}, {"index": 29, "src": "CgyBbbWfroovsCxAY1Ijfj1Zp4b", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_29.png"}, {"index": 30, "src": "Rc0KbJHJzoqCdsxgZE4jfWw3pbd", "name": "image.png", "local": "tmp/import-07-phu-luc\\images\\img_30.png"}];
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
  fs.writeFileSync('tmp/import-07-phu-luc\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
