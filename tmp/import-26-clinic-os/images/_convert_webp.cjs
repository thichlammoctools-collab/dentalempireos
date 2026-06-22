
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = [{"index": 1, "src": "ZCnwbRYrEo6HDExm81FjjC9kpp8", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_01.png"}, {"index": 2, "src": "FnsVbJ8DRozteGx7b0SjZphLp5d", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_02.png"}, {"index": 3, "src": "IgUZbse6uoNL6AxhULcjTxhbpxc", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_03.png"}, {"index": 4, "src": "Rop1bLvzuoVlEaxsMX9jaJzcptb", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_04.png"}, {"index": 5, "src": "R30WbqkvXobs09xep3tjPxWWpUg", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_05.png"}, {"index": 6, "src": "Nak3b14rEomUM6x2V9cjxGrppdg", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_06.png"}, {"index": 7, "src": "OA9Fbeog0owDeTx7ApAjlrVvpSf", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_07.png"}, {"index": 8, "src": "JaIbbvU6loBOZixsFnGj3NqupJp", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_08.png"}, {"index": 9, "src": "ELfHbrjI0okiF5xwZwKjKQLIpTY", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_09.png"}, {"index": 10, "src": "RL0RbP60polpBXxRENAjeL4Dpmf", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_10.png"}, {"index": 11, "src": "HyVnbF72Yo53fMxutk6jWsCPpBe", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_11.png"}, {"index": 12, "src": "C8qRbtMXGo1isYxfYSUjDFNxpHg", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_12.png"}, {"index": 13, "src": "SSAHbLtk8ox6hoxFTGnjQcHSpqf", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_13.png"}, {"index": 14, "src": "AfFXbLF5moaxQMxe8eijLanlpAe", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_14.png"}, {"index": 15, "src": "Asw6byvodoaJ9IxDCkTjgsX0pLb", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_15.png"}, {"index": 16, "src": "EoXXblfJjosRYuxmwbajofzvpkh", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_16.png"}, {"index": 17, "src": "T5YlbHgPRok0bGxNNB8jgDJHpth", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_17.png"}, {"index": 18, "src": "HvRobttnpo5LHJxp9nMjZR4EpZg", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_18.png"}, {"index": 19, "src": "C06ebQseMoN2wDx38ytj2VSBpjf", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_19.png"}, {"index": 20, "src": "P4bzbBtWzo40QdxttckjQW1qp7g", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_20.png"}, {"index": 21, "src": "XHe3burGko00XUxfnzZjscmJpUb", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_21.png"}, {"index": 22, "src": "LZCtbbSIZoA9E1xBr5qj4eY5puc", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_22.png"}, {"index": 23, "src": "PaWJbR9HRoH15zxJXzfjSJvPpu9", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_23.png"}, {"index": 24, "src": "EZ3rbJGLroCyjoxZVJtjERyJpZf", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_24.png"}, {"index": 25, "src": "X2E9b2y5hockhSxFjjLjtT6hpsf", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_25.png"}, {"index": 26, "src": "LZSebB1apoLfKSxgI5zjr15ppud", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_26.png"}, {"index": 27, "src": "J3XabQnTdo3s0exQoDijOuoop10", "name": "image.png", "local": "tmp/import-26-clinic-os\\images\\img_27.png"}];
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
  fs.writeFileSync('tmp/import-26-clinic-os\images\convert_output.json', JSON.stringify(results));
  const pct = totalBefore > 0 ? Math.round((1 - totalAfter/totalBefore) * 100) : 0;
  console.log(`  Total: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (-$${pct}%)`);
})().catch(e => { console.error(e.message); process.exit(1); });
