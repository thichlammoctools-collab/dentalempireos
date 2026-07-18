// API: Website-wide AI chat (RAG on book + blog + resource).
// POST /api/website-chat
// Body: { message: string, page_type?: string, page_slug?: string }
// Auth: None (public)
// Response: text/event-stream

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { sseResponse } from '../../lib/sse';
import { chatCompletion } from '../../lib/ai-client';
import type { ChatMessage } from '../../lib/ai-client';
import { getAiSettings } from '../../lib/ai-settings-db';
import { getProviderById, listModels } from '../../lib/ai-provider-db';
import { searchWebsite, buildWebsiteContext, chunksToFormatted, type WebsiteChunk } from '../../lib/rag-website-search';

export const prerender = false;

function buildSystemPrompt(ragContext: string): string {
  return `Bạn là Dental Empire AI, trợ lý nội dung của Dental Empire OS về vận hành và quản trị phòng khám nha khoa tại Việt Nam.

Mục tiêu là giúp người đọc tìm đúng nội dung trên website và hiểu được bước tiếp theo có thể áp dụng. Giọng điệu chuyên nghiệp, thân thiện, thực tế; xưng "mình" hoặc "Dental Empire AI", gọi người dùng là "bạn".

${ragContext ? `--- NGỮ CẢNH ĐÃ KIỂM CHỨNG TỪ WEBSITE ---
${ragContext}
--- HẾT NGỮ CẢNH ---

` : ''}Quy tắc bắt buộc:
1. Trả lời hoàn toàn bằng tiếng Việt. Trả lời trực tiếp vào câu hỏi, không lặp lại câu hỏi và không mở đầu chung chung.
2. Ưu tiên thông tin trong ngữ cảnh. Chỉ khẳng định các chi tiết về sách, blog, tài nguyên, khóa học, giá, ưu đãi hoặc đường dẫn khi chúng có trong ngữ cảnh.
3. Nếu ngữ cảnh không có câu trả lời, nói rõ: "Mình chưa tìm thấy thông tin này trên Dental Empire OS." Sau đó chỉ đưa ra hướng dẫn chung có điều kiện, không suy đoán hoặc bịa đặt.
4. Với câu hỏi ngoài nội dung website, có thể trả lời bằng kiến thức tổng quát về quản trị phòng khám, nhưng phải nói rõ đó là gợi ý chung, không phải nội dung đã xác minh từ website.
5. Không tự tạo URL, tên sản phẩm, chương sách, chương trình miễn phí, ưu đãi, số liệu hoặc chính sách. Không yêu cầu người dùng truy cập URL trong phần trả lời vì giao diện tự hiển thị nguồn khi có.
6. Không chẩn đoán, tư vấn điều trị, kê đơn hoặc đưa khuyến nghị y khoa cá nhân.

Định dạng cho khung chat:
- Mặc định dài 2-5 câu, tối đa 120 từ.
- Nếu cần liệt kê, dùng tối đa 3 gạch đầu dòng ngắn.
- Chỉ dùng **in đậm** cho tối đa 2 cụm từ thật sự quan trọng. Không dùng tiêu đề Markdown, bảng, emoji hoặc phần "Hỏi tiếp".
- Khi thông tin có trong ngữ cảnh, nêu rõ đó là **Sách**, **Blog** hoặc **Tài nguyên** nếu phân loại này hữu ích.`;
}

export const POST: APIRoute = async (ctx) => {
  let body: { message: string; page_type?: string; page_slug?: string };
  try {
    body = (await ctx.request.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  if (!body.message?.trim()) {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const settings = await getAiSettings(env.DB);
  const hasChatModel = Boolean(settings.chat_provider_id && settings.chat_model_id);
  if ((!hasChatModel && (!settings.is_active || !settings.api_key))) {
    return new Response(JSON.stringify({ error: 'AI chưa được kích hoạt. Vui lòng liên hệ quản trị viên.' }), {
      status: 503, headers: { 'Content-Type': 'application/json' },
    });
  }

  let modelCfg = {
    provider_id: '1',
    base_url: settings.base_url,
    api_key: settings.api_key,
    model_id: settings.model,
    max_tokens: settings.max_tokens,
  };

  // A configured Chat Assistant model takes priority; legacy Wizard settings remain
  // available as a fallback until the admin selects a public-chat model.
  if (hasChatModel && settings.chat_provider_id && settings.chat_model_id) {
    const [provider, models] = await Promise.all([
      getProviderById(env.DB, settings.chat_provider_id),
      listModels(env.DB, settings.chat_provider_id),
    ]);
    const model = models.find((item) => item.id === settings.chat_model_id);
    if (!provider?.is_active || !provider.api_key || !model?.is_active) {
      return new Response(JSON.stringify({ error: 'Mô hình Chat Assistant chưa sẵn sàng. Vui lòng kiểm tra provider và model trong trang quản trị.' }), {
        status: 503, headers: { 'Content-Type': 'application/json' },
      });
    }
    modelCfg = {
      provider_id: String(provider.id),
      base_url: provider.base_url,
      api_key: provider.api_key,
      model_id: model.model_id,
      max_tokens: model.max_tokens ?? settings.max_tokens,
    };
  }

  const searchOpts: { contentType?: string } = {};
  if (body.page_type === 'book' && body.page_slug) {
    searchOpts.contentType = 'book';
  } else if (body.page_type === 'blog' && body.page_slug) {
    searchOpts.contentType = 'blog';
  }

  let chunks: WebsiteChunk[] = [];
  try {
    chunks = await searchWebsite(env.DB, body.message, 8, searchOpts, env);
  } catch (err) {
    console.warn('[website-chat] search failed:', err);
  }

  const ragContext = buildWebsiteContext(chunks);
  const systemPrompt = buildSystemPrompt(ragContext);
  const formattedChunks = chunksToFormatted(chunks);

  const userMsg: ChatMessage = { role: 'user', content: body.message.trim() };

  let aiResponse = '';
  let aiError: string | null = null;
  try {
    aiResponse = await chatCompletion(modelCfg, [userMsg], systemPrompt);
  } catch (err) {
    aiError = String(err);
    console.error('[website-chat] AI error:', err);
  }

  // Stream response word-by-word as they arrive
  const textEncoder = new TextEncoder();
  let wordIndex = 0;
  const words = aiResponse.split(/(\s+)/);

  const stream = new ReadableStream({
    pull(controller) {
      if (wordIndex === 0) {
        // First pull: send sources metadata
        const sourcesText = textEncoder.encode(
          `data: ${JSON.stringify({
            event: 'chunks_used',
            count: chunks.length,
            ids: chunks.map(c => c.id),
            sources: formattedChunks.map(c => ({ url: c.url, title: c.title, content_type: c.content_type })),
          })}\n\n`
        );
        controller.enqueue(sourcesText);
      }

      if (aiError) {
        controller.enqueue(
          textEncoder.encode(`data: ${JSON.stringify({ event: 'error', message: aiError })}\n\n`)
        );
        controller.close();
        return;
      }

      if (wordIndex < words.length) {
        const word = words[wordIndex++];
        if (word) {
          controller.enqueue(
            textEncoder.encode(`data: ${JSON.stringify({ event: 'chunk', text: word })}\n\n`)
          );
        }
        return;
      }

      // Done
      controller.enqueue(
        textEncoder.encode(
          `data: ${JSON.stringify({
            event: 'done',
            chunks_used: chunks.length,
            sources: formattedChunks.map(c => ({ url: c.url, title: c.title, content_type: c.content_type })),
          })}\n\n`
        )
      );
      controller.close();
    },
  });

  return sseResponse(stream);
};
