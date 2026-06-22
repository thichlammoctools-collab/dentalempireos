
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "BjEobOwgqozPgDxfjpljd58Lp1e", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_01.png"}, {"index": 2, "src": "GBHfbvkPloKTnix5JkXjcmpFpCc", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_02.png"}, {"index": 3, "src": "QbmjbSsTUoXnCdxerlEjpV0bpQe", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_03.png"}, {"index": 4, "src": "W3BubMh0Nokdc1x6WmFjLDIrpjh", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_04.png"}, {"index": 5, "src": "FKCIbhgEKoYiypx5OXqjkLmkpQf", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_05.png"}, {"index": 6, "src": "JlFgbg3LuoF7XhxKqUYjbk31pXb", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_06.png"}, {"index": 7, "src": "IWGJbmqPKoGCMnxQdGajhiycpqd", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_07.png"}, {"index": 8, "src": "KV87bUzaSoFNOcxXl2hjIeNWpHn", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_08.png"}, {"index": 9, "src": "Lr22bxyt3oDwkMxguk4jS89upMb", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_09.png"}, {"index": 10, "src": "B33ebsSKeojjTexeo6UjlOrKpof", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_10.png"}, {"index": 11, "src": "R3NQbljJwo5miSxbrNhjQAfQp7c", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_11.png"}, {"index": 12, "src": "HHVjbUnARoqpJ3xmlvjjRnU8peC", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_12.png"}, {"index": 13, "src": "CZvnb8jjho7ldexYXjujIFC1pvb", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_13.png"}, {"index": 14, "src": "CHpMbdwPcoXA06xGRqSjC4Czp3Y", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_14.png"}, {"index": 15, "src": "Tojxb7CgKotjcwxvPmBjeznopKg", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_15.png"}, {"index": 16, "src": "EJVWbHogzoczExxkp34js2ukpIb", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_16.png"}, {"index": 17, "src": "VDPWbdc0IohEWCxTw8ej3I74pCf", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_17.png"}, {"index": 18, "src": "ZJijbhmGvoI33zxcE9ljTPSApGd", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_18.png"}, {"index": 19, "src": "XSwmbVS5MofHdDxOcBujnm3Xpqf", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_19.png"}, {"index": 20, "src": "SWxwbBOGSoEOMBxxTOUj4oSgpVb", "name": "image.png", "local": "tmp/import-19-education-product\\images\\img_20.png"}];
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
  fs.writeFileSync('tmp/import-19-education-product\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
