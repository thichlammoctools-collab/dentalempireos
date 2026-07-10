#!/usr/bin/env node
// Script deploy an toàn: build → set secrets từ .env.production → deploy
// Usage: npm run deploy
// Requirements: .env.production chứa tất cả secrets cần thiết

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const dotenvPath = '.env.production';
const secrets = {};

try {
  const content = readFileSync(dotenvPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    secrets[key] = val;
  }
} catch {
  console.error(`❌ Không tìm thấy ${dotenvPath}`);
  console.error('   Tạo file .env.production từ .env.example rồi điền giá trị thật');
  process.exit(1);
}

const requiredSecrets = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'ADMIN_EMAILS',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'PAYOS_API_KEY',
  'PAYOS_CHECKSUM_KEY',
  'PAYOS_CLIENT_ID',
  'PAYOS_WEBHOOK_URL',
];

const missing = requiredSecrets.filter(k => !secrets[k]);
if (missing.length > 0) {
  console.error(`❌ Thiếu secrets trong ${dotenvPath}: ${missing.join(', ')}`);
  process.exit(1);
}

// 1. Build
console.log('📦 Building...');
execSync('npm run build', { stdio: 'inherit' });

// 2. Set secrets
console.log('🔑 Setting secrets...');
for (const key of requiredSecrets) {
  const val = secrets[key];
  if (!val || val.startsWith('your-') || val === 'dev-placeholder') {
    console.warn(`⚠️  Bỏ qua ${key} (giá trị placeholder)`);
    continue;
  }
  console.log(`   ${key}`);
  process.env[key] = val;
  try {
    execSync(`npx wrangler secret put ${key} --name dentalempireos`, {
      input: Buffer.from(val + '\n'),
      stdio: ['pipe', 'inherit', 'inherit'],
    });
  } catch (e) {
    console.error(`   ❌ Lỗi set ${key}`);
  }
}

// 3. Deploy
console.log('🚀 Deploying...');
execSync('npx wrangler deploy --config wrangler.jsonc', { stdio: 'inherit' });

console.log('✅ Deploy hoàn tất');
