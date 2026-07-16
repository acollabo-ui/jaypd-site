import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 카테고리 목록 — 여기에 추가하면 /posts 필터 탭과 Decap 선택지가 같이 늘어난다.
export const CATEGORIES = ['믹싱지식', '평론', '소식'] as const;

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(CATEGORIES).default('믹싱지식'),
    series: z.string().default('차트인 인디 프로듀서의 음악팁'),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(), // 글 대표 이미지 (홈 카드용)
  }),
});

export const collections = { posts };
