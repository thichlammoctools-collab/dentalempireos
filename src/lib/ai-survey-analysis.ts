// AI Analysis for the Hồ Sơ Gốc Rễ Survey
// Calls Claude-compatible API to generate a structured analysis of the survey response.

import type { SurveyResponseRow } from './survey-db';

interface AnthropicResponse {
  content: Array<{ type: string; text?: string }>;
  stop_reason?: string;
  usage?: { input_tokens: number; output_tokens: number };
}

/**
 * Prompt gốc tiếng Việt.
 * Thay thế {{SCORE_*}} bằng điểm thật trước khi gửi.
 * Thay {{LANG}} bằng 'Việt' hoặc 'English'.
 */
const ANALYSIS_PROMPT = `Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa tại Việt Nam.

# TRIẾT LÝ CỐT LÕI
- Phòng khám là HỆ THỐNG SỐNG (con người, quy trình, giá trị, dữ liệu cùng nhau lớn lên)
- SKY (Sincerity–Kindness–Yielding) là TRỤC ĐẠO ĐỨC: chân thành trong tư vấn, tử tế với bệnh nhân, biết nhường mình để ưu tiên điều đúng.
- S.T.A.R.S (Skills–Traits–Actions–Results–Synergy) là BẢN ĐỒ NĂNG LỰC: không chỉ giỏi mà phải đúng giá trị.
- R.O.A.D.M.A.P: Roots → One Light → Awaken → Deepen → Mature → Align → Prosper.
- "TO BE SKY" — lãnh đạo ở tâm thái "đang trở thành", không phải "đã rồi".
- "Đo lường không phải để kiểm soát, mà để nhìn thấy sự thật".

# BỐI CẢNH
Bạn đang đọc kết quả khảo sát "Hồ Sơ Gốc Rễ" của một chủ phòng khám.
Dữ liệu bạn nhận được bao gồm:
- Điểm số 4 chiều (ROOTS, SKY, S.T.A.R.S, Hệ thống sống) trên thang 0–100.
- Câu trả lời mở: lý do tồn tại, giá trị cốt lõi, tình huống thực tế, tình hình đội ngũ, áp lực hiện tại, cam kết...

Phân tích bằng tiếng {{LANG}}.
Giọng văn: thẳng thắn, ấm, dùng "bạn". Không phán xét — chỉ soi chiếu.
Trích dẫn nguyên văn câu trả lời của họ khi cần (dùng *italic* cho quote).

# CẤU TRÚC ĐẦU RA (markdown, theo đúng thứ tự này)

## 1. Tổng quan (2-3 câu)
Tóm tắt: phòng khám đang ở giai đoạn nào, điểm mạnh cốt lõi nhất, và thử thách lớn nhất. Dựa trên TẤT CẢ dữ liệu, không chỉ điểm số.

## 2. Phân tích ROOTS ({{SCORE_ROOTS}}/100)
Dựa trên câu trả lời: lý do tồn tại, giá trị cốt lõi, tình huống đứng vững giá trị.
Điểm nào rõ ràng nhất? Điểm nào cần đào sâu thêm?
Trích dẫn 1–2 câu trả lời mở làm dẫn chứng.

## 3. Phân tích SKY ({{SCORE_SKY}}/100)
Trong 3 phẩm chất (Sincerity, Kindness, Yielding):
- Cái nào thể hiện rõ nhất qua câu trả lời?
- Cái nào cần được soi chiếu thêm?
Trích dẫn 1–2 câu trả lời mở làm dẫn chứng.

## 4. Phân tích S.T.A.R.S ({{SCORE_STARS}}/100)
Trong 5 chiều (Skills, Traits, Actions, Results, Synergy):
- Điểm nào đang là nền tảng vững nhất?
- Điểm nào đang kéo tụt năng lực đội ngũ?
Trích dẫn câu trả lời về đội ngũ, tuyển dụng, kỹ năng cần đào tạo.

## 5. Phân tích Hệ thống sống ({{SCORE_LIVING}}/100)
Tự học hỏi? An toàn tâm lý? Dữ liệu ra quyết định?
Trích dẫn câu trả lời: "Hệ thống sống hay cỗ máy?", "Sống tốt nhất / yếu nhất".

## 6. Điều đang sống tốt nhất
3–5 điểm cụ thể, mỗi điểm BẮT BUỘC phải trích dẫn 1 câu trả lời mở của họ.

## 7. Điều cần được soi chiếu
3–5 điểm cụ thể. Mỗi điểm:
- Vấn đề là gì (trích dẫn câu trả lời)
- Tại sao quan trọng
- Đang ảnh hưởng đến điều gì

## 8. 5 hành động ưu tiên (theo thứ tự)
Mỗi hành động:
- **Hành động cụ thể** (làm gì)
- **Tại sao là ưu tiên** (liên kết với câu trả lời của họ + framework)
- **Thời gian** (1–2 tuần / 1 tháng / 3 tháng)
Hành động đầu tiên PHẢI nhỏ, làm được trong 1–2 tuần — tạo momentum.

## 9. Lời nhắn
2–3 câu, nhắn nhủ trực tiếp đến chủ phòng khám. Thẳng thắn, khích lệ. Nếu điểm cao → chúc mừng + nhắc "đừng dừng lại". Nếu điểm thấp → "đây là cơ hội lớn nhất".

# QUY TẮC QUAN TRỌNG
- KHÔNG được viết "Chưa có đủ thông tin" nếu câu trả lời có nội dung — hãy phân tích nội dung đó.
- KHÔNG được viết chung chung ("bạn có tiềm năng lớn") — PHẢI cụ thể ("bạn nói rằng XYZ, điều này cho thấy ABC").
- Khi điểm = 100 → vẫn phân tích bình thường, vì điểm 100 không có nghĩa là "không cần cải thiện".
- Khi điểm thấp → đây là cơ hội, không phải lời chê.
- Trích dẫn bằng *italic*, ví dụ: *sinh ra để giúp mọi người có nụ cười tự tin*.
- Độ dài: 1200–2000 từ.
- Nếu thiếu tên → gọi là "bạn" hoặc "bác sĩ".`;

/**
 * Build English version from Vietnamese prompt via simple replacements.
 * For production-quality EN, maintain a separate English prompt.
 */
function getAnalysisPrompt(
  lang: 'vi' | 'en',
  cfg?: { prompt_vi?: string; prompt_en?: string } | null,
): string {
  // Prefer DB-stored prompt if available, fallback to hardcoded constant
  const basePrompt = lang === 'en'
    ? (cfg?.prompt_en ?? cfg?.prompt_vi ?? ANALYSIS_PROMPT)
    : (cfg?.prompt_vi ?? ANALYSIS_PROMPT);

  if (basePrompt !== ANALYSIS_PROMPT) {
    // Custom prompt from DB — use as-is
    return basePrompt;
  }

  if (lang === 'en') {
    return ANALYSIS_PROMPT
      .replace(/bằng tiếng \{\{LANG\}\}/, 'in English')
      .replace(/bạn — phòng khám của bạn/g, 'you — your clinic')
      .replace(/"đang trở thành"/g, '"becoming"')
      .replace(/Tuyệt đối KHÔNG/g, 'NEVER')
      .replace(/KHÔNG phán xét/g, 'NO judgment')
      .replace(/Trích dẫn nguyên văn câu trả lời của họ khi cần \(dùng \*italic\* cho quote\)/g, 'Quote their answers verbatim when needed (use *italic* for quotes)')
      .replace(/Trích dẫn 1–2 câu trả lời mở làm dẫn chứng\./g, 'Cite 1–2 of their open answers as evidence.')
      .replace(/Trích dẫn câu trả lời:/g, 'Cite their answers:')
      .replace(/Trích dẫn bằng \*italic\*, ví dụ:/g, 'Cite using *italic*, e.g.:')
      .replace(/Độ dài: 1200–2000 từ\./g, 'Total length: 1200–2000 words.')
      .replace(/Nếu thiếu tên → gọi là "bạn" hoặc "bác sĩ"\./g, 'If name is missing, call them "you" or "doctor".')
      .replace(/Lời nhắn từ BS\. Vinh/g, 'A note from Dr. Vinh')
      .replace(/2–3 câu, nhắn nhủ trực tiếp đến chủ phòng khám\. Thẳng thắn, khích lệ\. Nếu điểm cao → chúc mừng \+ nhắc "đừng dừng lại"\. Nếu điểm thấp → "đây là cơ hội lớn nhất"\./g, '2–3 sentences addressing the owner directly. Candid and encouraging. If high score → congratulations + "don\'t stop here". If low score → "this is your biggest opportunity".')
      .replace(/KHÔNG được viết "Chưa có đủ thông tin" nếu câu trả lời có nội dung — hãy phân tích nội dung đó\./g, 'NEVER write "insufficient information" if the answer has content — analyze it.')
      .replace(/KHÔNG được viết chung chung \("bạn có tiềm năng lớn"\) — PHẢI cụ thể \("bạn nói rằng XYZ, điều này cho thấy ABC"\)\./g, 'NEVER be vague ("you have great potential") — BE SPECIFIC ("you said XYZ, which shows ABC").')
      .replace(/Khi điểm = 100 → vẫn phân tích bình thường, vì điểm 100 không có nghĩa là "không cần cải thiện"\./g, 'When score = 100 → still analyze normally, because 100 doesn\'t mean "no room for improvement".')
      .replace(/Khi điểm thấp → đây là cơ hội, không phải lời chê\./g, 'When score is low → this is an opportunity, not criticism.')
      .replace(/Phân tích bằng tiếng \{\{LANG\}\}/, 'Analyze in English');
  }
  // vi
  return ANALYSIS_PROMPT;
}

/**
 * Call Claude-compatible API to analyze the survey response.
 * Returns markdown string.
 */
export async function analyzeSurvey(
  apiKey: string,
  row: SurveyResponseRow,
  context: Record<string, unknown>,
  opts: { baseUrl?: string; model?: string; maxTokens?: number; appConfig?: Record<string, unknown> | null } = {},
): Promise<string> {
  const lang = row.lang === 'en' ? 'en' : 'vi';
  const appCfg = opts.appConfig as Record<string, unknown> | null | undefined;
  const systemPrompt = getAnalysisPrompt(lang, appCfg as { prompt_vi?: string; prompt_en?: string } | null)
    .replace(/\{\{SCORE_ROOTS\}\}/g, String(row.score_roots ?? 0))
    .replace(/\{\{SCORE_SKY\}\}/g, String(row.score_sky ?? 0))
    .replace(/\{\{SCORE_STARS\}\}/g, String(row.score_stars ?? 0))
    .replace(/\{\{SCORE_LIVING\}\}/g, String(row.score_living ?? 0));

  const userMessage = JSON.stringify(context, null, 2);

  // Base URL: strip trailing slash, append /v1/messages
  const baseUrl = (opts.baseUrl ?? 'https://api.anthropic.com').replace(/\/+$/, '');
  const url = `${baseUrl}/v1/messages`;
  // App-level config can override model and max_tokens
  const model = (appCfg?.model_override as string) || opts.model || 'claude-sonnet-4-6';
  const maxTokens = (appCfg?.max_tokens_override as number) || opts.maxTokens || 4096;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error (${response.status}) [${baseUrl}]: ${errText}`);
  }

  const data = (await response.json()) as AnthropicResponse;
  const text = data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('\n');

  if (!text) {
    throw new Error('Empty response from Anthropic API');
  }

  return text;
}
