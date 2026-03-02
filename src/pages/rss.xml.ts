import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft && !data.unlisted);
  const sorted = posts.sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  return rss({
    title: "Hunter A. Dyer's Blog",
    description: 'Security research, reverse engineering, and random thoughts.',
    site: context.site!,
    items: sorted.map((post) => {
      const slug = post.id.replace(/^(professional|personal|random)\//, '').replace(/\.mdx?$/, '');
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.data.category}/${slug}/`,
      };
    }),
  });
}
