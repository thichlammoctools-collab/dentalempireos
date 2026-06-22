
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "TtiHbAvEMoajGNxeNGUjC6B8pxd", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_01.png"}, {"index": 2, "src": "XzBnbEPa5oInPBxODLijkUm4pV7", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_02.png"}, {"index": 3, "src": "Ynusb4GaooUIYHx7AwtjjNeXpAh", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_03.png"}, {"index": 4, "src": "GMxcbRYX8o2TRvxgarWjqLKSpGW", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_04.png"}, {"index": 5, "src": "Llk5bGxEQoCRzMxFCYvjAjzPpvT", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_05.png"}, {"index": 6, "src": "HDBwbbhgVo6dhjxHxkajqeSFpIh", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_06.png"}, {"index": 7, "src": "OMJFb7yBxoUAr7xdWXajkCsqpGb", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_07.png"}, {"index": 8, "src": "O9tdbQDDvoGxCQxEmqWj1dsApxS", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_08.png"}, {"index": 9, "src": "TTq4b5vy6oX4fTxIyT7jCOXzpTd", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_09.png"}, {"index": 10, "src": "VDhpbINYIoE1Vhxzf1pjqaFUp1b", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_10.png"}, {"index": 11, "src": "ES9bbJJpdoydPzxyX8ojCPMfpxl", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_11.png"}, {"index": 12, "src": "XjBybdsdFoq515xUtGajP5tNpJh", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_12.png"}, {"index": 13, "src": "E59ubKueooFNK0xQ82Ujsw6xpvg", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_13.png"}, {"index": 14, "src": "ITSCbOU9ropqWRxX1D8jYDPzpic", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_14.png"}, {"index": 15, "src": "IOGVb22VHoIn2xx9VNjjbqQspcg", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_15.png"}, {"index": 16, "src": "McfbbpVxaoX2FyxEJmAjDiKepeg", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_16.png"}, {"index": 17, "src": "JI0abiNIroZVhExyPHJjkakzpch", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_17.png"}, {"index": 18, "src": "RpufbtnFRoCPejxao1EjAnhppBh", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_18.png"}, {"index": 19, "src": "JeAfbV1Z6ouYxixohEyj9zPbpce", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_19.png"}, {"index": 20, "src": "LdaobjQgqoR0ffxz6LyjdTtWpwh", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_20.png"}, {"index": 21, "src": "RGTpbeXaxoW9prxBeuOjMDiHp9c", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_21.png"}, {"index": 22, "src": "XpncbE4HgoZLpmxGi67jqftIpDc", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_22.png"}, {"index": 23, "src": "I53AbXQNYoubcSxCxKkj6iDXp9L", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_23.png"}, {"index": 24, "src": "MO6FbXNcyoe5fuxtSInjvVCjpVf", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_24.png"}, {"index": 25, "src": "FjG3bRyXcoD27bx5ehJjPhTmpjb", "name": "image.png", "local": "tmp/import-25-sales-os\\images\\img_25.png"}];
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
  fs.writeFileSync('tmp/import-25-sales-os\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
