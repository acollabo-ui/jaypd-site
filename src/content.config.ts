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
  }),
});

export const collections = { blog };
