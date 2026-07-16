#!/usr/bin/env node
/**
 * 발행 스크립트 — Rooms/blog/posts/ → src/content/posts/
 * 차단어 검출 방식: 분쟁 키워드가 하나라도 등장하면 그 글은 발행 차단 + 보고.
 * 사용: node scripts/publish.mjs [볼트 blog/posts 경로]
 */
import { readdirSync, readFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEST = resolve(__dirname, '../src/content/posts');
const SRC = resolve(
  process.argv[2] ?? 'C:/Users/sueng/Desktop/2026 Docunment/Rooms/blog/posts'
);

// 분쟁 키워드 (필수 게이트 — 추가는 자유, 삭제는 승재 승인 후)
const BLOCKED = [
  '정원희', '로봇콜렉션', '소송', '재판', '가처분', '내용증명',
  '마스터권', '정산 분쟁', '정산분쟁', '소장', '변호사', '법원',
  '원고', '피고', '판결', '조정기일',
];

const files = readdirSync(SRC).filter((f) => f.endsWith('.md'));
if (files.length === 0) {
  console.log(`발행할 글 없음: ${SRC}`);
  process.exit(0);
}

mkdirSync(DEST, { recursive: true });
const blocked = [];
const published = [];

for (const f of files) {
  const text = readFileSync(join(SRC, f), 'utf-8');
  const hits = BLOCKED.filter((kw) => text.includes(kw));
  if (hits.length > 0) {
    blocked.push({ file: f, hits });
  } else {
    copyFileSync(join(SRC, f), join(DEST, f));
    published.push(f);
  }
}

console.log(`✅ 발행 복사: ${published.length}건`);
published.forEach((f) => console.log(`   - ${f}`));
if (blocked.length > 0) {
  console.log(`\n🚫 차단: ${blocked.length}건 — 분쟁 키워드 검출. 발행하지 않음.`);
  blocked.forEach((b) => console.log(`   - ${b.file} → [${b.hits.join(', ')}]`));
  process.exitCode = 1; // CI에서 눈에 띄게
}
console.log('\n다음 단계: git add → commit → push 하면 Cloudflare Pages가 자동 배포.');
