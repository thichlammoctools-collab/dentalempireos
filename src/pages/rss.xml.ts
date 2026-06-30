import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { marked } from 'marked';
import { env } from 'cloudflare:workers';
import { listPosts } from '../lib/blog-db';
import { sanitizeRichHtml } from '../lib/sanitize';

export async function GET(context: APIContext) {
  const db = env.DB;
  const { posts } = await listPosts(db, { limit: 50, sort: 'recent' });

  return rss({
    title: 'Dental Empire Blog',
    description: 'Cập nhật tin mới nhất về quản trị nha khoa, mẹo vận hành, và chiến lược phát triển phòng khám.',
    site: context.site?.toString() ?? 'https://dentalempireos.com',
    trailingSlash: true,
    customData: `<language>vi</language>`,
    items: posts.map((post) => {
      const html = sanitizeRichHtml(marked.parse(post.content_md ?? '') as string);
      return {
        title: post.title,
        link: `/blog/${post.slug}/`,
        pubDate: new Date(post.published_at ?? post.created_at),
        description: post.description,
        content: html,
        categories: post.tags?.map((t) => t.name) ?? [],
        author: post.author_name,
        customData: post.cover_url
          ? `<enclosure url="${post.cover_url}" type="image/jpeg" length="0" />`
          : '',
      };
    }),
  });
}
