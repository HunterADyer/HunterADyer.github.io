import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['professional', 'personal', 'random']),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    githubRepo: z.string().url().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    draft: z.boolean().default(false),
    unlisted: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    status: z.enum(['active', 'completed', 'archived', 'planned']),
    githubUrl: z.string().url().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    sortOrder: z.number().default(0),
  }),
});

const resume = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(z.record(z.any())),
  }),
});

export const collections = { blog, projects, resume };
