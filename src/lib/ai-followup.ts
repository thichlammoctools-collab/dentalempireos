// AI-generated follow-up suggestions cho website chat.
// Dựa vào câu trả lời vừa đưa và RAG context để gợi ý câu hỏi tiếp theo thông minh.

import { chatCompletion } from './ai-client';
import type { ModelConfig } from './ai-client';

const FOLLOWUP_SYSTEM = `Bạn là AI assistant. Dựa vào câu trả lời vừa đưa và ngữ cảnh, gợi ý 3 câu hỏi tiếp theo ngắn gọn (mỗi câu ≤12 từ) mà người dùng có thể muốn hỏi.

Quy tắc:
- Mỗi câu trên 1 dòng, không đánh số, không emoji
- Câu hỏi phải liên quan trực tiếp đến nội dung vừa trả lời
- Không hỏi lại điều đã trả lời
- Tập trung vào chi tiết, ví dụ, hoặc bước tiếp theo
- Câu hỏi phải tự nhiên, như người dùng thật sẽ hỏi

Ví dụ output:
Làm thế nào để áp dụng vào phòng khám nhỏ?
Có ví dụ cụ thể không?
Chi phí triển khai là bao nhiêu?`;

/**
 * Generate 3 follow-up questions dựa vào conversation context.
 * @param modelConfig - AI model configuration
 * @param lastUserMessage - Câu hỏi cuối của user
 * @param lastAssistantMessage - Câu trả lời cuối của AI
 * @param ragContext - Ngữ cảnh từ RAG (optional)
 * @returns Mảng 0-3 câu hỏi gợi ý
 */
export async function generateFollowupSuggestions(
  modelConfig: ModelConfig,
  lastUserMessage: string,
  lastAssistantMessage: string,
  ragContext?: string,
): Promise<string[]> {
  try {
    // Truncate để giảm token cost
    const truncatedResponse = lastAssistantMessage.slice(0, 500);
    const truncatedContext = ragContext ? ragContext.slice(0, 300) : '';

    const prompt = [
      `Câu hỏi người dùng: "${lastUserMessage}"`,
      `\nCâu trả lời AI: "${truncatedResponse}"`,
      truncatedContext ? `\n\nNgữ cảnh: ${truncatedContext}` : '',
      '\n\nGợi ý 3 câu hỏi tiếp theo:',
    ].join('');

    const response = await chatCompletion(
      modelConfig,
      [{ role: 'user', content: prompt }],
      FOLLOWUP_SYSTEM,
    );

    // Parse response - mỗi dòng là 1 câu hỏi
    const suggestions = response
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => {
        // Lọc: phải có độ dài hợp lý, không phải heading/number
        if (line.length < 10 || line.length > 120) return false;
        if (/^[\d\-\*#]/.test(line)) return false; // Bỏ bullets/numbers
        return true;
      })
      .slice(0, 3); // Chỉ lấy 3 câu đầu

    return suggestions;
  } catch (err) {
    console.warn('[followup] Generation failed:', err);
    return []; // Fallback to empty - không block UI
  }
}
