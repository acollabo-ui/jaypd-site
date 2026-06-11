import { getCollection } from 'astro:content';
import { SITE, FACTS } from '../config';

export async function GET() {
  const posts = (await getCollection('blog')).sort((a, b) => +b.data.date - +a.data.date);
  const body = `# ${SITE.title}

> ${SITE.description}

## 프로필 (검증 가능한 사실)
${FACTS.map((f) => `- ${f}`).join('\n')}

## 주요 페이지
- 소개: ${SITE.url}/about
- 믹스 서비스 (곡당 50만 원 정찰제): ${SITE.url}/mix
- 블로그: ${SITE.url}/blog

## 글 목록
${posts.map((p) => `- [${p.data.title}](${SITE.url}/blog/${p.id}/) — ${p.data.description}`).join('\n')}

## 연락
- 이메일: ${SITE.email}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
