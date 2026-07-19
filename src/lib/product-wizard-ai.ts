// AI generation logic for the product creation wizard.
// Nhận ModelConfig từ caller — không phụ thuộc vào ai_settings legacy.

import { chatCompletion } from './ai-client';
import type { ModelConfig } from './ai-client';

interface WizardAnswers {
  // Step 2
  name?: string;
  description?: string;
  language?: 'vi' | 'en' | 'both';
  goals?: string;
  // Step 3
  sections_count?: string;
  topics?: string;
  needs_scoring?: boolean;
  dimensions?: Array<{ name: string; formula: 'avg' | 'sum' | 'count_if'; weight?: number }>;
  ebook_topic?: string;
  ebook_chapters?: number;
  ebook_depth?: string;
  ebook_audience?: string;
  course_topic?: string;
  course_lessons?: number;
  course_level?: string;
  course_formats?: string[];
  tool_purpose?: string;
  tool_input?: string;
  tool_output?: string;
  tool_store_results?: boolean;
  generator_content_type?: string;
  generator_use_case?: string;
  generator_tone?: string;
  generator_formats?: string[];
}

export interface GeneratedOutput {
  name: string;
  slug: string;
  description: string;
  status: 'draft';
  is_free: 0 | 1;
  config_json: {
    prompt_vi: string;
    prompt_en: string;
    analysis_sections: Array<{ id: string; title_vi: string; title_en: string }>;
    scanner_definition?: {
      title_vi: string;
      title_en: string;
      description_vi: string;
      survey_type: 'mini' | 'full' | 'checklist';
      scoring_rules: {
        dimensions: Array<{
          id: string;
          name_vi: string;
          question_ids: string[];
          formula: 'avg' | 'sum' | 'count_if';
          weight?: number;
        }>;
        total_formula: 'average' | 'weighted_average';
        thresholds: { excellent: number; good: number; needs_work: number; critical: number };
      };
      sections: Array<{
        title_vi: string;
        title_en: string;
        icon: string;
        questions: Array<{
          question_id: string;
          type: 'select' | 'textarea' | 'radio' | 'yesno';
          label_vi: string;
          label_en: string;
          scale_labels_vi?: Record<string, string>;
          options_vi?: string[];
          required: 0 | 1;
          dimension?: string;
          anchor?: 0 | 1;
          weight?: number;
        }>;
      }>;
    } | null;
  };
}

const DEFAULT_SCALE_LABELS_VI = {
  '1': 'Chưa có / Rất yếu',
  '2': 'Đang bắt đầu',
  '3': 'Đã có / Trung bình',
  '4': 'Ổn định',
  '5': 'Đầu tàu / Xuất sắc',
};

function buildSystemPrompt(type: string): string {
  return `Bạn là chuyên gia cấu hình sản phẩm AI cho nền tảng "Dental Empire OS" — hệ thống quản lý phòng khám nha khoa.

Nhiệm vụ: Dựa trên câu trả lời của admin về sản phẩm họ muốn tạo, hãy tạo một cấu hình hoàn chỉnh, sẵn sàng sản xuất.

Loại sản phẩm: ${type}
Ngôn ngữ chính: Tiếng Việt

---

QUY TẮC QUAN TRỌNG:
1. Trả về DUY NHẤT một JSON object hợp lệ — KHÔNG có markdown fence, KHÔNG có giải thích
2. prompt_vi phải viết bằng tiếng Việt, chuyên nghiệp, chi tiết (200-600 từ)
3. prompt_vi phải hướng dẫn AI behavior cụ thể cho sản phẩm này
4. Với survey: tạo scanner_definition ĐẦY ĐỦ với sections + questions + scoring_rules
5. question_id phải viết thường, không dấu, có gạch dưới, tối đa 40 ký tự
6. scoring_rules: mỗi dimension phải có question_ids phù hợp với questions trong sections
7. scale_labels_vi cho select: {"1":"...","2":"...","3":"...","4":"...","5":"..."} theo ngữ cảnh
8. Không bịa thông tin nhạy cảm
9. Sáng tạo nhưng bám sát câu trả lời của admin

---

SCHEMA OUTPUT (JSON):
{
  "name": "string",
  "slug": "string (URL-safe, chữ thường, gạch nối)",
  "description": "string (1-2 câu)",
  "status": "draft",
  "is_free": 0 | 1,
  "config_json": {
    "prompt_vi": "string (system prompt tiếng Việt 200-600 từ, mô tả rõ AI nên làm gì, cách phân tích, format output)",
    "prompt_en": "string (English version, có thể để trống)",
    "analysis_sections": [{ "id": "string", "title_vi": "string", "title_en": "string" }],
    "scanner_definition": {
      "title_vi": "string",
      "title_en": "string",
      "description_vi": "string",
      "survey_type": "mini" | "full" | "checklist",
      "scoring_rules": {
        "dimensions": [
          {
            "id": "string (viết thường, gạch dưới, trùng với question dimension)",
            "name_vi": "string",
            "question_ids": ["string", "string"],
            "formula": "avg" | "sum" | "count_if",
            "weight": number (tùy chọn, cho weighted_average)
          }
        ],
        "total_formula": "average" | "weighted_average",
        "thresholds": { "excellent": 75, "good": 55, "needs_work": 35, "critical": 0 }
      },
      "sections": [
        {
          "title_vi": "string",
          "title_en": "string",
          "icon": "string (Material Symbols name, ví dụ: medical_services, groups, payments)",
          "questions": [
            {
              "question_id": "string",
              "type": "select | textarea | radio | yesno",
              "label_vi": "string",
              "label_en": "string",
              "scale_labels_vi": {"1":"...","2":"...","3":"...","4":"...","5":"..."},
              "options_vi": ["string"] | null,
              "required": 0 | 1,
              "dimension": "string | null (trùng với dimension id)",
              "anchor": 0 | 1,
              "weight": number | null
            }
          ]
        }
      ]
    } | null (cho non-survey types)
  }
}`;
}

function buildUserMessage(type: string, answers: WizardAnswers): string {
  const lang = answers.language === 'both' ? 'VI + EN' : (answers.language === 'en' ? 'English' : 'Tiếng Việt');

  const base = {
    product_type: type,
    language: lang,
    name: answers.name ?? '',
    description: answers.description ?? '',
    goals: answers.goals ?? '',
  };

  if (type === 'survey') {
    return JSON.stringify({
      ...base,
      sections_count: answers.sections_count ?? 'mini',
      topics: (answers.topics ?? '').split(',').map(s => s.trim()).filter(Boolean),
      needs_scoring: answers.needs_scoring ?? true,
      dimensions: answers.dimensions ?? [],
    }, null, 2);
  }

  if (type === 'ebook_ai') {
    return JSON.stringify({
      ...base,
      topic: answers.ebook_topic ?? '',
      chapters: answers.ebook_chapters ?? 5,
      depth: answers.ebook_depth ?? 'Chi tiết',
      audience: answers.ebook_audience ?? '',
    }, null, 2);
  }

  if (type === 'course_ai') {
    return JSON.stringify({
      ...base,
      topic: answers.course_topic ?? '',
      lessons: answers.course_lessons ?? 5,
      level: answers.course_level ?? 'Intermediate',
      formats: answers.course_formats ?? [],
    }, null, 2);
  }

  if (type === 'tool') {
    return JSON.stringify({
      ...base,
      purpose: answers.tool_purpose ?? '',
      input: answers.tool_input ?? '',
      output: answers.tool_output ?? '',
      store_results: answers.tool_store_results ?? false,
    }, null, 2);
  }

  // generator
  return JSON.stringify({
    ...base,
    content_type: answers.generator_content_type ?? '',
    use_case: answers.generator_use_case ?? '',
    tone: answers.generator_tone ?? 'Chuyên nghiệp',
    formats: answers.generator_formats ?? [],
  }, null, 2);
}

function extractJson(text: string): Record<string, unknown> | null {
  // Try direct parse first
  try { return JSON.parse(text.trim()); } catch { /* fall through */ }

  // Try extract from markdown code fence
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()); } catch { /* fall through */ }
  }

  // Try find first { ... } block
  const firstBrace = text.indexOf('{');
  if (firstBrace !== -1) {
    try {
      // Find the matching closing brace
      let depth = 0;
      let end = firstBrace;
      for (let i = firstBrace; i < text.length; i++) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
      }
      return JSON.parse(text.slice(firstBrace, end));
    } catch { /* fall through */ }
  }

  return null;
}

function validateOutput(obj: unknown): GeneratedOutput {
  if (!obj || typeof obj !== 'object') throw new Error('Invalid JSON structure');

  const o = obj as Record<string, unknown>;

  if (!o.name || typeof o.name !== 'string') throw new Error('Missing or invalid "name"');
  if (!o.slug || typeof o.slug !== 'string') throw new Error('Missing or invalid "slug"');
  if (!o.description && typeof o.description !== 'string') throw new Error('Missing or invalid "description"');

  const configJson = o.config_json;
  if (!configJson || typeof configJson !== 'object') throw new Error('Missing or invalid "config_json"');

  const cfg = configJson as Record<string, unknown>;
  if (!cfg.prompt_vi || typeof cfg.prompt_vi !== 'string') throw new Error('Missing or invalid "prompt_vi"');
  if (cfg.prompt_vi.length < 50) throw new Error(`"prompt_vi" quá ngắn (${cfg.prompt_vi.length} chars, cần >= 50)`);

  return obj as unknown as GeneratedOutput;
}

export async function wizardGenerate(
  modelCfg: ModelConfig,
  type: string,
  answers: WizardAnswers,
): Promise<GeneratedOutput> {
  const systemPrompt = buildSystemPrompt(type);
  const userMessage = buildUserMessage(type, answers);

  const text = await chatCompletion(
    { ...modelCfg, max_tokens: modelCfg.max_tokens || 8192 },
    [{ role: 'user', content: userMessage }],
    systemPrompt,
  );

  if (!text) throw new Error('Empty response from AI provider');

  const parsed = extractJson(text);
  if (!parsed) {
    throw new Error('AI trả về định dạng không hợp lệ. Vui lòng thử lại.');
  }

  return validateOutput(parsed);
}
