// Generate PWA icons from source image
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outIconsDir = join(__dirname, '..', 'public', 'icons');
const rootDir = join(__dirname, '..', 'public');

// Find source file (user may save as pwa-icon.jpg, .png, etc.)
const candidates = [
  join(__dirname, '..', 'tmp', 'pwa-icon.jpg.png'),
  join(__dirname, '..', 'tmp', 'pwa-icon.jpg'),
  join(__dirname, '..', 'tmp', 'pwa-icon.png'),
  join(__dirname, '..', 'public', 'pwa-icon.jpg'),
  join(__dirname, '..', 'public', 'pwa-icon.png'),
  join(__dirname, '..', 'pwa-icon.jpg'),
  join(__dirname, '..', 'pwa-icon.png'),
];

const sourcePath = candidates.find((p) => existsSync(p));
if (!sourcePath) {
  console.error('❌ Không tìm thấy pwa-icon. Save ảnh vào tmp/pwa-icon.jpg hoặc public/pwa-icon.jpg');
  process.exit(1);
}
console.log(`📸 Source: ${sourcePath}`);

const sizes = {
  'icons/icon-192.png': 192,
  'icons/icon-512.png': 512,
  'icons/maskable-512.png': 512,
  'apple-touch-icon.png': 180,
  'favicon-192.png': 192,
};

for (const [name, size] of Object.entries(sizes)) {
  const out = join(rootDir, name);
  await sharp(sourcePath)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(out);
  console.log(`✓ ${name} (${size}×${size})`);
}

// favicon.ico — 32x32 multi-format
const ico32 = await sharp(sourcePath).resize(32, 32, { fit: 'cover' }).png().toBuffer();
const ico16 = await sharp(sourcePath).resize(16, 16, { fit: 'cover' }).png().toBuffer();
await sharp(ico32).toFile(join(rootDir, 'favicon-32.png'));
console.log('✓ favicon-32.png (32×32)');

console.log('\n✅ Done. Next:');
console.log('   1. Replace public/favicon.svg (optional)');
console.log('   2. Replace public/favicon.ico (optional)');
console.log('   3. Update public/site.webmanifest if needed');
console.log('   4. Rebuild + deploy');