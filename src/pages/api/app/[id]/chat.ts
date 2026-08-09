import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { getApp, parseAppConfig } from '../../../../lib/app-db';
import { getCloudflareAiGatewayConfig, hasMotapisApiKey } from '../../../../lib/ai-gateway';
import { chatCompletionWithFallback } from '../../../../lib/ai-client';
import type { ModelConfig } from '../../../../lib/ai-client';
import { createAuth } from '../../../../lib/auth';
import {
  getActiveCreditPricingRule,
  getCreditBalance,
  InsufficientCreditsError,
  releaseReservation,
  reserveCredits,
  settleReservation,
} from '../../../../lib/credit-db';
import { canAccessAiApp } from '../../../../lib/entitlement-check';

export const prerender = false;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_SOP_TURNS = 6;

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

function creditsForTokens(tokens: number, tokensPerCredit: number): number {
  return Math.max(1, Math.ceil(tokens / tokensPerCredit));
}

function buildSystemPrompt(appName: string, promptVi: string, userTurn: number, isFinalTurn: boolean): string {
  const customContext = promptVi
    ? `\n\nCHỈ DẪN NGHIỆP VỤ TỪ ADMIN (đây là nguồn chỉ dẫn chính của ứng dụng; phải tuân thủ nội dung, giọng điệu, quy trình và định dạng được yêu cầu):\n---BEGIN-ADMIN-PROMPT---\n${promptVi}\n---END-ADMIN-PROMPT---\n`
    : '\n\nỨng dụng chưa có chỉ dẫn nghiệp vụ riêng từ admin. Hãy dùng các quy tắc SOP bên dưới.\n';
  const frame = `

FRAME HỘI THOẠI BẮT BUỘC:
 - Đây là một công cụ tạo SOP có giới hạn, không phải chat tự do.
 - Chỉ dẫn nghiệp vụ từ admin ở trên là nguồn sự thật cho mục tiêu và cách thực hiện. Không tự ý thay đổi, rút gọn hoặc thay thế chỉ dẫn đó bằng một quy trình mặc định khác.
 - Các quy tắc trong FRAME này chỉ bổ sung cho những phần admin prompt chưa quy định; nếu có xung đột, ưu tiên admin prompt, trừ yêu cầu an toàn hoặc yêu cầu hệ thống bắt buộc.
 - Tổng cộng tối đa ${MAX_SOP_TURNS} lượt trả lời của người dùng. Lượt hiện tại: ${userTurn}/${MAX_SOP_TURNS}.
 - Nếu admin prompt không yêu cầu một luồng khác, mỗi lượt chỉ hỏi đúng 1 câu hỏi ngắn. Không hỏi lại dữ liệu đã có và không mở rộng sang chủ đề ngoài SOP đang tạo.
 - Với luồng hỏi đáp mặc định, câu hỏi phải thu hẹp một trường thông tin còn thiếu theo thứ tự: (1) quy trình và kết quả cần đạt, (2) phạm vi, điểm bắt đầu/kết thúc và vai trò, (3) đầu vào/đầu ra/công cụ, (4) các bước và điểm quyết định, (5) tiêu chuẩn, checklist, KPI và ngoại lệ.
 - Nếu người dùng đã cung cấp đủ thông tin cho một trường, ghi nhận và chuyển ngay sang trường tiếp theo. Không hỏi để xác nhận lại cho đủ lượt.
 - Nếu còn thiếu chi tiết khi hết lượt, dùng giả định vận hành hợp lý và đánh dấu rõ [CẦN XÁC NHẬN] trong SOP.
 - Chỉ trả lời bằng tiếng Việt, ngắn gọn, thực tế, không giảng giải dài dòng, trừ khi admin prompt quy định khác.

QUY TẮC KẾT THÚC:
 - ${isFinalTurn ? `ĐÂY LÀ LƯỢT CUỐI (${MAX_SOP_TURNS}/${MAX_SOP_TURNS}). Không đặt câu hỏi, không đưa gợi ý, không viết lời dẫn. Bắt buộc xuất SOP hoàn chỉnh ngay trong phản hồi và kết thúc chính xác bằng ---END-SOP---.` : `Nếu chưa hoàn tất theo admin prompt, chỉ đặt 1 câu hỏi tiếp theo và thêm đúng một khối [data] với 3 lựa chọn ngắn. Nếu admin prompt yêu cầu xuất SOP ngay và dữ liệu đã đủ, xuất SOP, kết thúc chính xác bằng ---END-SOP--- và không thêm khối [data].`}
 - Nếu admin prompt không yêu cầu cấu trúc khác, khi xuất SOP dùng Markdown với các mục: # Tên SOP; ## 1. Mục đích; ## 2. Phạm vi; ## 3. Vai trò và trách nhiệm; ## 4. Đầu vào và đầu ra; ## 5. Quy trình thực hiện; ## 6. Điểm kiểm soát và ngoại lệ; ## 7. Checklist; ## 8. KPI/tiêu chí hoàn thành; ## 9. Biểu mẫu và hồ sơ; ## 10. Phiên bản và hiệu lực.
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

async function getModelConfigs(db: D1Database, configJson: string | null): Promise<ModelConfig[]> {
  const config = parseAppConfig(configJson);
  const modelOverride = config.model_override as string | undefined;
  const fallbackModelOverride = config.fallback_model_override as string | undefined;
  const maxTokensOverride = config.max_tokens_override;
  const maxTokens = typeof maxTokensOverride === 'number' && Number.isInteger(maxTokensOverride) && maxTokensOverride >= 256 && maxTokensOverride <= 32_768
    ? maxTokensOverride
    : undefined;
  const modelConfig = modelOverride && hasMotapisApiKey()
    ? {
        provider_id: 'motapis',
        base_url: 'https://motapis.com/v1',
        api_key: env.MOTAPIS_API_KEY,
        model_id: modelOverride,
      }
    : null;
  const primary = modelConfig && maxTokens ? { ...modelConfig, max_tokens: maxTokens } : modelConfig;
  const fallback = fallbackModelOverride
    ? await getCloudflareAiGatewayConfig(db, fallbackModelOverride)
    : null;

  const fallbackConfig = fallback && maxTokens ? { ...fallback, max_tokens: maxTokens } : fallback;
  return [primary, fallbackConfig].filter((item): item is ModelConfig =>
    item !== null && !(item.provider_id === primary?.provider_id && item.model_id === primary?.model_id),
  );
}

export const POST: APIRoute = async ({ request, params }) => {
  const appId = params.id;
  if (!appId) return badRequest('Missing app ID');

  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'Unauthorized' }, 401);

  const app = await getApp(env.DB, appId);
  if (!app) return json({ error: 'Ứng dụng không tồn tại' }, 404);
  if (app.status !== 'active') return json({ error: 'Ứng dụng chưa được kích hoạt' }, 403);
  if (!(await canAccessAiApp(env.DB, session.user.id, app.id))) {
     return json({ error: 'Ứng dụng AI này yêu cầu nâng cấp gói để sử dụng.', upgradeUrl: '/dich-vu', upgrade_url: '/dich-vu' }, 402);
  }

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
  const modelConfigs = await getModelConfigs(env.DB, app.config_json);

  if (!modelConfigs.length) {
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

  const primaryModel = modelConfigs[0];
  const pricingRule = await getActiveCreditPricingRule(env.DB, 'ai_app', app.id, primaryModel.model_id);
  const requestId = crypto.randomUUID();
  const inputTokens = estimateTokens(
    systemPrompt + messages.map((message) => message.content).join('\n'),
  );
  const creditsToReserve = pricingRule?.tokens_per_credit
    ? creditsForTokens(inputTokens + (primaryModel.max_tokens ?? 4096), pricingRule.tokens_per_credit)
    : pricingRule?.credit_amount ?? 0;
  let reservationId: string | null = null;

  if (creditsToReserve > 0) {
    try {
      const reservation = await reserveCredits(env.DB, {
        userId: session.user.id,
        amount: creditsToReserve,
        featureType: 'ai_app',
        businessObjectId: requestId,
        idempotencyKey: `ai-app:${requestId}`,
        metadata: { appId: app.id, model: primaryModel.model_id, ruleId: pricingRule?.id },
      });
      reservationId = reservation.reservation.id;
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        return json({ error: 'Bạn không đủ Credits để tạo phản hồi AI này.', code: 'insufficient_credits' }, 402);
      }
      throw error;
    }
  }

  try {
    const completion = await chatCompletionWithFallback(modelConfigs, messages, systemPrompt);
    const reply = completion.content;
    if (!reply) return json({ reply: 'Không có phản hồi.', full_sop_text: '', sop_complete: false });

    const result = userTurn >= MAX_SOP_TURNS
      ? forceSOPComplete(reply)
      : extractSOPComplete(reply);
    const outputTokens = estimateTokens(reply);
    const totalTokens = inputTokens + outputTokens;
    const creditsCharged = pricingRule?.tokens_per_credit
      ? creditsForTokens(totalTokens, pricingRule.tokens_per_credit)
      : pricingRule?.credit_amount ?? 0;

    if (reservationId) {
      await settleReservation(env.DB, {
        userId: session.user.id,
        reservationId,
        featureType: 'ai_app',
        businessObjectId: requestId,
        chargeType: 'chat_turn',
        credits: creditsCharged,
        priceSnapshot: {
          ruleId: pricingRule?.id,
          ruleVersion: pricingRule?.rule_version,
          tokensPerCredit: pricingRule?.tokens_per_credit,
          fixedCredits: pricingRule?.credit_amount,
          model: completion.config.model_id,
        },
        quantitySnapshot: { inputTokens, outputTokens, totalTokens },
      });
    }
    return json({
      reply: result.reply,
      full_sop_text: result.complete ? result.full_sop : '',
      sop_complete: result.complete,
      turn: userTurn,
      max_turns: MAX_SOP_TURNS,
      usage: { input_tokens: inputTokens, output_tokens: outputTokens, total_tokens: totalTokens, credits_charged: creditsCharged },
      balance: await getCreditBalance(env.DB, session.user.id),
    });
  } catch (err) {
    if (reservationId) {
      await releaseReservation(env.DB, {
        userId: session.user.id,
        reservationId,
        reason: 'ai_app_request_failed',
      }).catch(() => undefined);
    }
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: msg }, 500);
  }
};
