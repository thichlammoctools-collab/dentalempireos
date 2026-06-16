import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const book = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/book' }),
  schema: z.object({
    title: z.string(),
    tier: z.number().min(1).max(6),
    chapter: z.number(),
    description: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { book };
