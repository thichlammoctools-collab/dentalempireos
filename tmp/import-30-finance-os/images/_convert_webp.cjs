
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "AmDLb6zCVoVxwyxx6AbjIdFqpVf", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_01.png"}, {"index": 2, "src": "VdItbIZV6oscDBxmxafjAxhOpJh", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_02.png"}, {"index": 3, "src": "RhtPbFGreo3PkOxgQhqja5sGpK3", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_03.png"}, {"index": 4, "src": "NqzLbXJ2uodLiIx5gSzjvMvfpfd", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_04.png"}, {"index": 5, "src": "YidxbwkccoSFK6xuMQyjSgMIp2d", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_05.png"}, {"index": 6, "src": "RBHlbyqWnoI0i3xvJwIjBQeVpKc", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_06.png"}, {"index": 7, "src": "TFDVbsQAJoWinVx1SfAjfGY9pgd", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_07.png"}, {"index": 8, "src": "OerTbPW9ooFpbmxkLJljJwY9puc", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_08.png"}, {"index": 9, "src": "TwPmb9NQ7or20Zx9PbzjEAx6pkc", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_09.png"}, {"index": 10, "src": "HclFbEUv3oycEQxWmVPj7kTxpue", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_10.png"}, {"index": 11, "src": "NffQbMOA3oLSX0xOvVdjD5JHpgg", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_11.png"}, {"index": 12, "src": "WyEEbv7utof8uDxlW1Aj7Rx7piO", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_12.png"}, {"index": 13, "src": "COiBbrnlkoSMEVxE83YjzcFrpwf", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_13.png"}, {"index": 14, "src": "UgdUb1idJonN2PxvQJnjZEXNpve", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_14.png"}, {"index": 15, "src": "RdKabz4YQowcuVxYtUAjf7fVpuV", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_15.png"}, {"index": 16, "src": "I1AbbVOu3o9AKrxcROKjRQCdpfd", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_16.png"}, {"index": 17, "src": "Hwxjb2iuioeySmxU4A7jzGRLplb", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_17.png"}, {"index": 18, "src": "RhIHbwr2NootjZxcBYujfH73pHd", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_18.png"}, {"index": 19, "src": "G5z1blBXPoYKWexM7ICjZgTxpeG", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_19.png"}, {"index": 20, "src": "RJSobbDlwo4kxDxfVhdj3qxzptd", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_20.png"}, {"index": 21, "src": "ECpibDzfXoOQ80xFWgqjWxbLpDe", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_21.png"}, {"index": 22, "src": "XhUobW2zqoTeL3x0eMQjOyAepid", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_22.png"}, {"index": 23, "src": "L9E1bgIN9oOUNtxF3vsjSv23pIc", "name": "image.png", "local": "tmp/import-30-finance-os\\images\\img_23.png"}];
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
  fs.writeFileSync('tmp/import-30-finance-os\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
