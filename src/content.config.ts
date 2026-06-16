import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const book = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/book' }),
  schema: z.object({
    title: z.string(),
    tier: z.number(),
    chapter: z.number(),
    description: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),
    // Optional: explicit module list for sidebar ordering
    modules: z.array(z.object({
      title: z.string(),
      slug: z.string(),
    })).optional(),
  }),
});

export const collections = { book };
