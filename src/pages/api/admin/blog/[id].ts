import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { upsertPost } from '../../../../lib/blog-db';

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Thiếu id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json() as {
      id?: string;
      title?: string;
      slug?: string;
      description?: string | null;
      content_md?: string | null;
      cover_url?: string | null;
      cover_alt?: string | null;
      category_id?: string | null;
      author_name?: string;
      status?: string;
      is_featured?: number | boolean;
      is_pinned?: number | boolean;
      is_recommended?: number | boolean;
    };

    if (!body.title || !body.slug) {
      return new Response(JSON.stringify({ error: 'Thiếu title hoặc slug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await upsertPost(env.DB, {
      id,
      title: body.title,
      slug: body.slug,
      description: body.description ?? undefined,
      content_md: body.content_md ?? undefined,
      cover_url: body.cover_url ?? undefined,
      cover_alt: body.cover_alt ?? undefined,
      category_id: body.category_id ?? undefined,
      author_name: body.author_name ?? 'Dental Empire',
      status: (body.status ?? 'draft') as 'draft' | 'published',
      is_featured: body.is_featured != null ? Boolean(body.is_featured) : undefined,
      is_pinned: body.is_pinned != null ? Boolean(body.is_pinned) : undefined,
      is_recommended: body.is_recommended != null ? Boolean(body.is_recommended) : undefined,
    });

    return new Response(JSON.stringify({ success: true, id, slug: body.slug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Blog PUT error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Thiếu id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const { deletePost } = await import('../../../../lib/blog-db');
    await deletePost(env.DB, id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Blog DELETE error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
