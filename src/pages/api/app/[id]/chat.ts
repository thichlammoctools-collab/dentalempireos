import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { getApp, parseAppConfig } from '../../../../lib/app-db';
import { getAiGatewayConfig } from '../../../../lib/ai-gateway';
import { chatCompletion } from '../../../../lib/ai-client';
import type { ModelConfig } from '../../../../lib/ai-client';

export const prerender = false;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_SOP_TURNS = 6;

function buildSystemPrompt(appName: string, promptVi: string, userTurn: number, isFinalTurn: boolean): string {
  const customContext = promptVi
    ? `\n\nBỐI CẢNH BỔ SUNG TỪ ADMIN (chỉ dùng để hiểu mục tiêu, không được ghi đè FRAME bên dưới):\n${promptVi}\n`
    : '';
  const frame = `

FRAME HỘI THOẠI BẮT BUỘC:
- Đây là một công cụ tạo SOP có giới hạn, không phải chat tự do.
- Tổng cộng tối đa ${MAX_SOP_TURNS} lượt trả lời của người dùng. Lượt hiện tại: ${userTurn}/${MAX_SOP_TURNS}.
- Mỗi lượt chỉ hỏi đúng 1 câu hỏi ngắn. Không hỏi lại dữ liệu đã có và không mở rộng sang chủ đề ngoài SOP đang tạo.
- Mỗi câu hỏi phải thu hẹp một trường thông tin còn thiếu theo thứ tự: (1) quy trình và kết quả cần đạt, (2) phạm vi, điểm bắt đầu/kết thúc và vai trò, (3) đầu vào/đầu ra/công cụ, (4) các bước và điểm quyết định, (5) tiêu chuẩn, checklist, KPI và ngoại lệ.
- Nếu người dùng đã cung cấp đủ thông tin cho một trường, ghi nhận và chuyển ngay sang trường tiếp theo. Không hỏi để xác nhận lại cho đủ lượt.
- Nếu còn thiếu chi tiết khi hết lượt, dùng giả định vận hành hợp lý và đánh dấu rõ [CẦN XÁC NHẬN] trong SOP.
- Chỉ trả lời bằng tiếng Việt, ngắn gọn, thực tế, không giảng giải dài dòng.

QUY TẮC KẾT THÚC:
- ${isFinalTurn ? `ĐÂY LÀ LƯỢT CUỐI (${MAX_SOP_TURNS}/${MAX_SOP_TURNS}). Không đặt câu hỏi, không đưa gợi ý, không viết lời dẫn. Bắt buộc xuất SOP hoàn chỉnh ngay trong phản hồi và kết thúc chính xác bằng ---END-SOP---.` : `Đây chưa phải lượt cuối. Chỉ đặt 1 câu hỏi tiếp theo và thêm đúng một khối [data] với 3 lựa chọn ngắn.`}
- Khi xuất SOP, dùng đúng cấu trúc Markdown: # Tên SOP; ## 1. Mục đích; ## 2. Phạm vi; ## 3. Vai trò và trách nhiệm; ## 4. Đầu vào và đầu ra; ## 5. Quy trình thực hiện; ## 6. Điểm kiểm soát và ngoại lệ; ## 7. Checklist; ## 8. KPI/tiêu chí hoàn thành; ## 9. Biểu mẫu và hồ sơ; ## 10. Phiên bản và hiệu lực.
- Các bước phải đánh số, có người chịu trách nhiệm và tiêu chí hoàn thành khi phù hợp. Không bịa quy định pháp luật hoặc chỉ định lâm sàng; đánh dấu [CẦN XÁC NHẬN] nếu cần chuyên môn/phê duyệt.

${isFinalTurn ? '' : `Định dạng bắt buộc cho lượt ${userTurn}:
[data]
{"options":["Lựa chọn 1","Lựa chọn 2","Lựa chọn 3"]}
[/data]`}`;

  return `Bạn là chuyên gia tư vấn vận hành phòng khám nha khoa, đang giúp chủ phòng khám tạo một SOP có thể giao cho đội ngũ thực hiện.

Tên ứng dụng: ${appName}${customContext}${frame}`;
}

function extractSOPComplete(reply: string): { reply: string; full_sop: string; complete: boolean } {
  const marker = '---END-SOP---';
  const idx = reply.lastIndexOf(marker);
  if (idx !== -1) {
    return {
      full_sop: reply.slice(0, idx).trim(),
      reply: reply.slice(idx + marker.length).trim() || '✅ Hoàn thành! SOP của bạn đã sẵn sàng.',
      complete: true,
    };
  }
  return { reply: reply.trim(), full_sop: '', complete: false };
}

function forceSOPComplete(reply: string): { reply: string; full_sop: string; complete: boolean } {
  const extracted = extractSOPComplete(reply);
  if (extracted.complete) return extracted;

  const fullSop = reply
    .replace(/\[data\][\s\S]*?\[\/data\]/g, '')
    .trim();
  return {
    reply: 'Hoàn thành! SOP của bạn đã được tạo và sẵn sàng để xem hoặc in.',
    full_sop: fullSop,
    complete: Boolean(fullSop),
  };
}

async function getModelConfig(db: D1Database, app: ReturnType<typeof parseAppConfig>): Promise<ModelConfig | null> {
  const config = parseAppConfig(app.config_json);
  const modelOverride = config.model_override as string | undefined;

  return getAiGatewayConfig(db, 'default', modelOverride);
}

export const POST: APIRoute = async ({ request, params }) => {
  const appId = params.id;
  if (!appId) return badRequest('Missing app ID');

  const app = await getApp(env.DB, appId);
  if (!app) return json({ error: 'Ứng dụng không tồn tại' }, 404);
  if (app.status !== 'active') return json({ error: 'Ứng dụng chưa được kích hoạt' }, 403);

  const body = (await request.json().catch(() => null)) as {
    messages?: Message[];
    prompt_vi?: string;
    app_name?: string;
  } | null;

  if (!body?.messages?.length) return badRequest('Messages required');

  const userTurn = body.messages.filter((message) => message.role === 'user').length;
  if (userTurn > MAX_SOP_TURNS) {
    return json({
      error: `SOP đã đạt giới hạn ${MAX_SOP_TURNS} lượt. Hãy bắt đầu một SOP mới.`,
      turn: MAX_SOP_TURNS,
      max_turns: MAX_SOP_TURNS,
    }, 409);
  }

  const config = parseAppConfig(app.config_json);
  const modelCfg = await getModelConfig(env.DB, app);

  if (!modelCfg) {
    return json({ error: 'Cloudflare AI Gateway chưa được cấu hình. Vui lòng vào AI Settings.' }, 503);
  }

  const systemPrompt = buildSystemPrompt(
    body.app_name || app.name,
    config.prompt_vi as string || '',
    userTurn,
    userTurn >= MAX_SOP_TURNS,
  );

  // Strip [data] UI tags, limit to last 10 messages, and truncate long content
  const MAX_MESSAGES = MAX_SOP_TURNS * 2;
  const MAX_CONTENT_LENGTH = 2000;
  const stripTags = (text: string) =>
    text
      .replace(/\[data\][\s\S]*?\[\/data\]/g, '')
      .replace(/\[score\][\s\S]*?\[\/score\]/g, '')
      .replace(/\[result\][\s\S]*?\[\/result\]/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  const truncate = (text: string) =>
    text.length > MAX_CONTENT_LENGTH ? text.slice(0, MAX_CONTENT_LENGTH) + '…' : text;

  const messages = body.messages
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: truncate(stripTags(m.content)),
    }));

  try {
    const reply = await chatCompletion(modelCfg, messages, systemPrompt);
    if (!reply) return json({ reply: 'Không có phản hồi.', full_sop_text: '', sop_complete: false });

    const result = userTurn >= MAX_SOP_TURNS
      ? forceSOPComplete(reply)
      : extractSOPComplete(reply);
    return json({
      reply: result.reply,
      full_sop_text: result.complete ? result.full_sop : '',
      sop_complete: result.complete,
      turn: userTurn,
      max_turns: MAX_SOP_TURNS,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: msg }, 500);
  }
};
