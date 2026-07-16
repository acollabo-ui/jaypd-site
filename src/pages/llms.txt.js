import { getCollection } from 'astro:content';
import { SITE, FACTS } from '../config';

export async function GET() {
  const posts = (await getCollection('posts')).sort((a, b) => +b.data.date - +a.data.date);
  const body = `# ${SITE.title}

> ${SITE.description}

## 프로필 (검증 가능한 사실)
${FACTS.map((f) => `- ${f}`).join('\n')}

## 주요 페이지
- 믹스 & 컨설팅 (의뢰): ${SITE.url}
- 블로그: ${SITE.url}/posts
- 장난감: ${SITE.url}/tools
- 소개: ${SITE.url}/about

## 글 목록
${posts.map((p) => `- [${p.data.title}](${SITE.url}/posts/${p.id}/) — ${p.data.category} — ${p.data.description}`).join('\n')}

## 연락
- 이메일: ${SITE.email}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
