// 빌드 후 dist/ 안의 이미지를 자동 압축한다.
// - 150KB 미만은 건드리지 않음
// - 폭 1600px 초과면 1600px로 축소
// - JPG/PNG/WebP 화질 80 (원본보다 커지면 원본 유지)
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('../dist', import.meta.url).pathname;
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_WIDTH = 1600;
const QUALITY = 80;
const MIN_BYTES = 150 * 1024;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let totalBefore = 0, totalAfter = 0, touched = 0;
for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!EXTS.has(ext)) continue;
  const before = (await stat(file)).size;
  if (before < MIN_BYTES) continue;

  try {
    const input = await readFile(file);
    let img = sharp(input).rotate(); // EXIF 회전 반영
    const meta = await img.metadata();
    if (meta.width && meta.width > MAX_WIDTH) img = img.resize({ width: MAX_WIDTH });

    let buf;
    if (ext === '.png') buf = await img.png({ compressionLevel: 9, palette: true }).toBuffer();
    else if (ext === '.webp') buf = await img.webp({ quality: QUALITY }).toBuffer();
    else buf = await img.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();

    if (buf.length < before) {
      await writeFile(file, buf);
      totalBefore += before; totalAfter += buf.length; touched++;
    }
  } catch (err) {
    console.warn(`skip ${file}: ${err.message}`);
  }
}
const mb = (n) => (n / 1024 / 1024).toFixed(2) + 'MB';
console.log(`[compress-images] ${touched}개 압축: ${mb(totalBefore)} → ${mb(totalAfter)}`);
