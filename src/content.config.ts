import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    series: z.string().default('차트인 인디 프로듀서의 음악팁'),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(), // 글 대표 이미지 (홈 카드용)
  }),
});

// 김승재 인증클럽 — 직접 일해본 사람들
const club = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/club' }),
  schema: z.object({
    name: z.string(),
    photo: z.string().optional(), // /images/club/xxx.jpg
    instagram: z.string(),
    role: z.string().optional(), // 예: 싱어송라이터, 드러머
    order: z.number().default(99),
  }),
});

export const collections = { blog, club };
