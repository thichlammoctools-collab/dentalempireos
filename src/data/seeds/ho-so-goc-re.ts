// Seed data for "Hồ Sơ Gốc Rễ" (Roots Profile) scanner.
// Mirrors the original survey-translations.ts content, restructured for the
// configurable survey_definition / survey_section / survey_question tables.
//
// To import, run the seed script (see src/scripts/seed-scanner.ts) or
// POST the JSON to /api/admin/scanner-definitions/[id]/import (admin endpoint).

import type {
  LeadFieldsConfig,
  ScoringRules,
  AiConfig,
  UiTranslations,
  SurveyDefinitionInput,
} from '../../lib/survey-config-db';

// ── Lead fields ──────────────────────────────────────────

export const LEAD_FIELDS: LeadFieldsConfig = {
  owner_name: {
    label_vi: 'Họ tên chủ phòng khám / Bác sĩ',
    label_en: 'Full name of clinic owner / Doctor',
    required: false,
    placeholder_vi: 'BS. Nguyễn Văn A',
    type: 'text',
  },
  clinic_name: {
    label_vi: 'Tên phòng khám',
    label_en: 'Clinic name',
    required: true,
    placeholder_vi: 'Nha Khoa ABC',
    type: 'text',
  },
  clinic_address: {
    label_vi: 'Địa chỉ',
    label_en: 'Address',
    required: false,
    placeholder_vi: 'Số 1, đường X, quận Y',
    type: 'text',
  },
  email: {
    label_vi: 'Email liên hệ',
    label_en: 'Contact email',
    required: true,
    placeholder_vi: 'ban@email.com',
    type: 'email',
  },
  years_in_operation: {
    label_vi: 'Số năm hoạt động',
    label_en: 'Years in operation',
    required: false,
    placeholder_vi: '5',
    type: 'number',
  },
  staff_count: {
    label_vi: 'Số nhân sự hiện tại',
    label_en: 'Current staff count',
    required: false,
    placeholder_vi: '8',
    type: 'number',
  },
};

// ── UI Translations ─────────────────────────────────────

export const TRANSLATIONS_VI: UiTranslations = {
  submitButton: 'Gửi Hồ Sơ',
  submitting: 'Đang xử lý...',
  required: 'bắt buộc',
  start: 'Bắt đầu →',
  back: '← Quay lại',
  next: 'Tiếp tục →',
  prev: '← Quay lại',
  intro_title: 'Hồ Sơ Gốc Rễ',
  intro_desc: 'Trước khi bắt đầu hành trình, hãy quay về gốc rễ. Khảo sát này giúp bạn và tư vấn viên thấy rõ bản sắc, giá trị và năng lực hiện có của phòng khám. Không có câu hỏi đúng/sai — chỉ có sự chân thật.',
  restore_draft: 'Bạn có bản nháp chưa hoàn thành.',
  clear_draft: 'Xoá & bắt đầu lại',
  submit_title: 'Sẵn sàng gửi?',
  submit_desc: 'Hệ thống sẽ lưu hồ sơ và bắt đầu phân tích...',
  step_label: 'Phần',
  submit_label: 'Gửi',
};

export const TRANSLATIONS_EN: UiTranslations = {
  submitButton: 'Submit Profile',
  submitting: 'Processing...',
  required: 'required',
  start: 'Start →',
  back: '← Back',
  next: 'Continue →',
  prev: '← Back',
  intro_title: 'Roots Profile',
  intro_desc: "Before starting the journey, let's return to the roots. This survey helps you and your consultant clearly see the identity, values, and current capabilities of your clinic. There are no right or wrong answers — only honesty.",
  restore_draft: 'You have an unfinished draft.',
  clear_draft: 'Clear & start over',
  submit_title: 'Ready to submit?',
  submit_desc: 'We will save your profile and begin the AI analysis...',
  step_label: 'Part',
  submit_label: 'Submit',
};

// ── Default scale labels ────────────────────────────────

export const DEFAULT_SCALE_VI: Record<string, string> = {
  '1': 'Chưa có',
  '2': 'Đang bắt đầu',
  '3': 'Đã có nhưng chưa ổn định',
  '4': 'Ổn định',
  '5': 'Đầu tàu và nhất quán',
};

export const DEFAULT_SCALE_EN: Record<string, string> = {
  '1': 'Not yet',
  '2': 'Starting',
  '3': 'Inconsistent',
  '4': 'Stable',
  '5': 'Exemplary',
};

// ── AI Prompts ──────────────────────────────────────────

const AI_PROMPT_VI = `Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa tại Việt Nam.

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

Phân tích bằng tiếng Việt.
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

const AI_PROMPT_EN = `You are Dr. Vinh — founder of Dental Empire OS, an expert in dental clinic management systems consulting in Vietnam.

# CORE PHILOSOPHY
- A clinic is a LIVING SYSTEM (people, processes, values, and data grow together)
- SKY (Sincerity–Kindness–Yielding) is the ETHICAL PILLAR: be sincere in consultations, kind to patients, willing to yield to prioritize what is right.
- S.T.A.R.S (Skills–Traits–Actions–Results–Synergy) is the CAPABILITY MAP: not just skilled, but aligned with values.
- R.O.A.D.M.A.P: Roots → One Light → Awaken → Deepen → Mature → Align → Prosper.
- "TO BE SKY" — lead from a "becoming" mindset, not a "have arrived" one.
- "Measurement is not for control, but to see the truth."

# CONTEXT
You are reading the "Roots Profile" survey result of a clinic owner.
Data you receive:
- Four dimension scores (ROOTS, SKY, S.T.A.R.S, Living System) on a 0–100 scale.
- Open answers: purpose, core values, real situations, team reality, current pressures, commitment...

Analyze in English.
Tone: candid, warm, address as "you". No judgment — only illumination.
Quote answers verbatim when needed (use *italic*).

# OUTPUT STRUCTURE (markdown, in this exact order)

## 1. Overview (2-3 sentences)
Summarize: what stage the clinic is in, the strongest core strength, and the biggest challenge. Based on ALL data, not just scores.

## 2. ROOTS Analysis ({{SCORE_ROOTS}}/100)
Based on answers about purpose, core values, value-standing situations.
What is clearest? What needs deeper excavation?
Cite 1–2 open answers as evidence.

## 3. SKY Analysis ({{SCORE_SKY}}/100)
Among 3 qualities (Sincerity, Kindness, Yielding):
- Which is most evident in their answers?
- Which needs more illumination?
Cite 1–2 open answers as evidence.

## 4. S.T.A.R.S Analysis ({{SCORE_STARS}}/100)
Among 5 dimensions (Skills, Traits, Actions, Results, Synergy):
- Which is the strongest foundation?
- Which is pulling down team capability?
Cite answers about team, hiring, skills to train.

## 5. Living System Analysis ({{SCORE_LIVING}}/100)
Self-learning? Psychological safety? Data-driven decisions?
Cite answers: "Living system or machine?", "Best/worst".

## 6. What's living well
3–5 specific points, each MUST cite 1 open answer.

## 7. What needs illumination
3–5 specific points. For each:
- What is the issue (cite answer)
- Why it matters
- What it is affecting

## 8. 5 priority actions (in order)
For each action:
- **Specific action** (what to do)
- **Why prioritized** (linked to their answers + framework)
- **Timeline** (1–2 weeks / 1 month / 3 months)
First action MUST be small, doable in 1–2 weeks — to build momentum.

## 9. Personal note
2–3 sentences addressed directly to the clinic owner. Candid, encouraging. High score → congratulate + "don't stop here". Low score → "this is your biggest opportunity".

# IMPORTANT RULES
- NEVER write "insufficient information" if the answer has content — analyze it.
- NEVER be vague ("you have great potential") — BE SPECIFIC ("you said XYZ, which shows ABC").
- When score = 100 → still analyze normally; 100 does not mean "no improvement needed".
- When score is low → this is an opportunity, not criticism.
- Cite using *italic*, e.g.: *born to help people have confident smiles*.
- Length: 1200–2000 words.
- If name is missing, call them "you" or "doctor".`;

export const AI_CONFIG: AiConfig = {
  prompt_vi: AI_PROMPT_VI,
  prompt_en: AI_PROMPT_EN,
  model_override: null,
  max_tokens_override: 4096,
  analysis_sections: [
    { id: 'overview',     title_vi: 'Tổng quan',                  title_en: 'Overview' },
    { id: 'roots',        title_vi: 'Phân tích ROOTS',             title_en: 'ROOTS Analysis' },
    { id: 'sky',          title_vi: 'Phân tích SKY',               title_en: 'SKY Analysis' },
    { id: 'stars',        title_vi: 'Phân tích S.T.A.R.S',         title_en: 'S.T.A.R.S Analysis' },
    { id: 'living',       title_vi: 'Phân tích Hệ thống sống',     title_en: 'Living System Analysis' },
    { id: 'strengths',    title_vi: 'Điều đang sống tốt nhất',     title_en: "What's living well" },
    { id: 'illuminate',   title_vi: 'Điều cần được soi chiếu',     title_en: 'What needs illumination' },
    { id: 'actions',      title_vi: '5 hành động ưu tiên',         title_en: '5 priority actions' },
    { id: 'note',         title_vi: 'Lời nhắn',                    title_en: 'Personal note' },
  ],
  plan_prompt_vi: 'Bạn là BS. Vinh — người sáng lập Dental Empire OS, chuyên gia tư vấn hệ thống quản trị phòng khám nha khoa.\n\n# DỮ LIỆU ĐẦU VÀO\n- Điểm số ROOTS: {{SCORE_ROOTS}}/100\n- Điểm số SKY: {{SCORE_SKY}}/100\n- Điểm số STARS: {{SCORE_STARS}}/100\n- Điểm số HỆ THỐNG SỐNG: {{SCORE_LIVING}}/100\n- Điểm số TỔNG: {{SCORE_TOTAL}}/100\n\n# NHIỆM VỤ\nDựa trên kết quả Hồ Sơ Gốc Rễ, tạo một kế hoạch 30 ngày theo 4 tuần.\nMỗi tuần 2-3 hành động CỤ THỂ. Ưu tiên tuần 1 bắt đầu bằng hành động nhỏ nhất — tạo momentum.\n\n# CẤU TRÚC ĐẦU RA\n## Tuần 1 (Ngày 1-7)\n- **Hành động 1:** ... — ... — Hoàn thành khi: ...\n\n## Tuần 2 (Ngày 8-14)\n...\n\n# QUY TẮC\n- Mỗi hành động: LÀM GÌ + TẠI SAO + DẤU HIỆU HOÀN THÀNH\n- Tiếng Việt, giọng ấm áp, thẳng thắn\n- Độ dài: 400-700 từ',
  plan_prompt_en: 'You are Dr. Vinh — founder of Dental Empire OS, dental clinic management consultant.\n\n# INPUT DATA\n- ROOTS Score: {{SCORE_ROOTS}}/100\n- SKY Score: {{SCORE_SKY}}/100\n- STARS Score: {{SCORE_STARS}}/100\n- LIVING SYSTEM Score: {{SCORE_LIVING}}/100\n- TOTAL Score: {{SCORE_TOTAL}}/100\n\n# TASK\nBased on the Roots Profile results, create a 30-day plan organized in 4 weeks.\nEach week: 2-3 SPECIFIC actions. Week 1 starts with the smallest action — build momentum.\n\n# OUTPUT STRUCTURE\n## Week 1 (Days 1-7)\n- **Action 1:** ... — ... — Complete when: ...\n\n## Week 2 (Days 8-14)\n...\n\n# RULES\n- Each action: WHAT + WHY + SIGN OF COMPLETION\n- English, warm and direct tone\n- Length: 400-700 words',
};

// ── Scoring Rules ──────────────────────────────────────

export const SCORING_RULES: ScoringRules = {
  dimensions: [
    {
      id: 'roots',
      name_vi: 'ROOTS',
      name_en: 'ROOTS',
      question_ids: ['roots_d1', 'roots_d2', 'roots_d3'],
      formula: 'avg',
    },
    {
      id: 'sky',
      name_vi: 'SKY',
      name_en: 'SKY',
      question_ids: ['sky_s_d1', 'sky_s_d2', 'sky_k_d1', 'sky_k_d2', 'sky_y_d1', 'sky_y_d2'],
      formula: 'avg',
    },
    {
      id: 'stars',
      name_vi: 'S.T.A.R.S',
      name_en: 'S.T.A.R.S',
      question_ids: ['stars_s_d', 'stars_t_d', 'stars_a_d', 'stars_r_d', 'stars_syn_d'],
      formula: 'avg',
    },
    {
      id: 'living',
      name_vi: 'Hệ thống sống',
      name_en: 'Living System',
      question_ids: ['living_d1', 'living_d2', 'living_d3', 'living_d4'],
      formula: 'avg',
    },
  ],
  total_formula: 'average',
  thresholds: {
    excellent: 75,
    good: 55,
    needs_work: 35,
    critical: 0,
  },
};

// ── Sections + Questions ───────────────────────────────

export interface SeedSection {
  order_idx: number;
  title_vi: string;
  title_en: string;
  subtitle_vi?: string;
  subtitle_en?: string;
  ref?: string;
  icon?: string;
  questions: SeedQuestion[];
}

export interface SeedQuestion {
  question_id: string;
  order_idx: number;
  type: 'textarea' | 'select' | 'radio' | 'yesno';
  label_vi: string;
  label_en: string;
  placeholder_vi?: string;
  placeholder_en?: string;
  options_vi?: string[];
  options_en?: string[];
  scale_labels_vi?: Record<string, string>;
  scale_labels_en?: Record<string, string>;
  required?: number;
  anchor?: number;
  weight?: number | null;
  dimension?: string;
}

export const SECTIONS: SeedSection[] = [
  // ── ROOTS ──
  {
    order_idx: 0,
    title_vi: 'PHẦN 1: GỐC RỄ — BẮT NỀN TẢNG',
    title_en: 'PART 1: ROOTS — BUILDING THE FOUNDATION',
    subtitle_vi: 'Xác định bản sắc phòng khám — là ai, sinh ra để phụng sự điều gì, giá trị nào không bao giờ được đánh đổi.',
    subtitle_en: "Define the clinic's identity — who you are, what you were born to serve, and which values can never be compromised.",
    ref: 'Chương 26 — R.O.A.D.M.A.P · ROOTS',
    icon: 'park',
    questions: [
      {
        question_id: 'roots_q1',
        order_idx: 0,
        type: 'textarea',
        label_vi: 'Nếu một ngày nào đó phòng khám không còn tồn tại, điều gì sẽ mất đi đối với bệnh nhân, đối với đội ngũ và đối với chính bạn?',
        label_en: 'If your clinic one day ceased to exist, what would be lost for your patients, for your team, and for yourself?',
        placeholder_vi: 'Hãy tưởng tượng phòng khám của bạn không còn ở đó. Điều gì bạn cảm thấy mất mát nhất?',
        placeholder_en: 'Imagine your clinic is no longer there. What would you feel the most loss about?',
        anchor: 1,
      },
      {
        question_id: 'roots_q2',
        order_idx: 1,
        type: 'textarea',
        label_vi: 'Phòng khám của bạn sinh ra để phụng sự điều gì? Viết một câu không quá 2 dòng.',
        label_en: 'What was your clinic born to serve? Write one sentence of no more than 2 lines.',
        placeholder_vi: 'Ví dụ: "Phòng khám sinh ra để giúp mọi người có nụ cười tự tin mà không cần lo lắng."',
        placeholder_en: 'e.g., "This clinic was born to help people have a confident smile without worry."',
      },
      {
        question_id: 'roots_q3',
        order_idx: 2,
        type: 'textarea',
        label_vi: 'Nếu phải chọn chỉ 3 giá trị không bao giờ được đánh đổi (dù có áp lực tài chính), bạn sẽ chọn giá trị nào? Tại sao?',
        label_en: 'If you could choose only 3 values that can never be compromised (even under financial pressure), which would you choose? Why?',
        placeholder_vi: 'Liệt kê 3 giá trị và giải thích ngắn gọn tại sao chúng không thể bị đánh đổi.',
        placeholder_en: 'List 3 values and briefly explain why they can never be compromised.',
      },
      {
        question_id: 'roots_q4',
        order_idx: 3,
        type: 'textarea',
        label_vi: 'Bạn có thể kể một tình huống mà bạn đã đứng vững giá trị, dù phải hy sinh lợi ích ngắn hạn? Điều đó đã đánh đổi bạn như thế nào?',
        label_en: 'Can you share a situation where you stood firm on a value, even though you had to sacrifice short-term benefit? How did that affect you?',
        placeholder_vi: 'Một câu chuyện thật — giá trị nào, lợi ích gì phải đánh đổi, và kết quả ra sao.',
        placeholder_en: 'A true story — which value, what benefit was sacrificed, and what was the outcome.',
      },
      {
        question_id: 'roots_d1',
        order_idx: 4,
        type: 'select',
        label_vi: 'Bạn có thể viết rõ tầm nhìn của phòng khám trong một câu không (không quá 15 từ)?',
        label_en: "Can you write your clinic's vision clearly in one sentence (no more than 15 words)?",
        scale_labels_vi: {
          '1': 'Không biết phải viết gì',
          '2': 'Có ý tưởng nhưng chưa rõ ràng',
          '3': 'Đã viết nhưng chưa tự tin',
          '4': 'Rõ ràng, có thể chia sẻ với mọi người',
          '5': 'Rất rõ ràng, có thể trích dẫn bất cứ lúc nào',
        },
        scale_labels_en: {
          '1': "Don't know what to write",
          '2': 'Have an idea but not clear yet',
          '3': 'Written but not fully confident',
          '4': 'Clear — can share with everyone',
          '5': 'Crystal clear — can quote it anytime',
        },
        dimension: 'roots',
      },
      {
        question_id: 'roots_d2',
        order_idx: 5,
        type: 'select',
        label_vi: 'Tất cả nhân sự trong phòng khám có hiểu và thể hiện được 3 giá trị cốt lõi không?',
        label_en: 'Do all staff in your clinic understand and embody the 3 core values?',
        scale_labels_vi: {
          '1': 'Không chắc họ hiểu',
          '2': 'Một vài người hiểu',
          '3': 'Đa số hiểu nhưng chưa nhất quán',
          '4': 'Mọi người hiểu và cố gắng thể hiện',
          '5': 'Mỗi người có thể giải thích và hành động theo giá trị',
        },
        scale_labels_en: {
          '1': 'Not sure they understand',
          '2': 'A few people understand',
          '3': 'Most understand but inconsistently',
          '4': 'Everyone understands and tries to embody them',
          '5': 'Each person can explain and act according to the values',
        },
        dimension: 'roots',
      },
      {
        question_id: 'roots_d3',
        order_idx: 6,
        type: 'select',
        label_vi: 'Quy trình quyết định hàng ngày của bạn có được thông nhất với giá trị cốt lõi không?',
        label_en: 'Are your daily decisions aligned with the core values?',
        scale_labels_vi: {
          '1': 'Thường xuyên mâu thuẫn',
          '2': 'Thỉnh thoảng mâu thuẫn',
          '3': 'Nỗ lực nhưng chưa ổn định',
          '4': 'Phần lớn nhất quán',
          '5': 'Luôn nhất quán — giá trị là la bàn',
        },
        scale_labels_en: {
          '1': 'Frequently misaligned',
          '2': 'Sometimes misaligned',
          '3': 'Making effort but inconsistent',
          '4': 'Largely aligned',
          '5': 'Always aligned — values are the compass',
        },
        dimension: 'roots',
      },
      {
        question_id: 'roots_q4_choice',
        order_idx: 7,
        type: 'radio',
        label_vi: 'Khi có mâu thuẫn giữa lợi ích tài chính và giá trị của phòng khám, bạn thường:',
        label_en: "When there's a conflict between financial benefit and your clinic's values, you usually:",
        options_vi: [
          'Đứng vững giá trị, dù phải hy sinh doanh thu',
          'Cân bằng lợi ích tài chính lên trên',
          'Cố gắng tìm cách cân bằng, nhưng thường là doanh thu trước',
          'Đang học cách cân bằng',
        ],
        options_en: [
          'Stand firm on values, even at the cost of revenue',
          'Prioritize financial benefit',
          'Try to balance, but revenue usually comes first',
          'Still learning how to balance',
        ],
      },
    ],
  },

  // ── SKY ──
  {
    order_idx: 1,
    title_vi: 'PHẦN 2: TRỤC ĐẠO ĐỨC — SKY',
    title_en: 'PART 2: ETHICAL PILLAR — SKY',
    subtitle_vi: 'Đo lường 3 phẩm chất đạo đức: Sincerity (Chân thành), Kindness (Tử tế), Yielding (Nhường mình).',
    subtitle_en: 'Measuring 3 ethical qualities: Sincerity, Kindness, Yielding.',
    ref: 'Chương 24 — TO BE SKY',
    icon: 'wb_sunny',
    questions: [
      {
        question_id: 'sky_sin_open',
        order_idx: 0,
        type: 'textarea',
        label_vi: 'Bạn có thể kể một ví dụ cụ thể mà phòng khám đã từ chối một dịch vụ/tư vấn vì lý do chân thành (không phải vì tài chính)? Nếu không, tại sao?',
        label_en: 'Can you share a specific example where your clinic refused a service/consultation for honest reasons (not financial)? If not, why?',
        placeholder_vi: 'Ví dụ: "BN muốn bọc sứ 8 răng nhưng BS chỉ tư vấn 4 răng vì thật sự không cần thiết."',
        placeholder_en: 'e.g., "The patient wanted 8 veneers but the doctor recommended only 4 — truly not needed."',
        anchor: 1,
      },
      {
        question_id: 'sky_s_d1',
        order_idx: 1,
        type: 'select',
        label_vi: 'Khi phát hiện bệnh nhân cần dịch vụ hơn nhưng không nhất thiết phải làm, bạn thường:',
        label_en: "When you discover a patient needs more services but doesn't necessarily need them, you usually:",
        scale_labels_vi: {
          '1': 'Thường tư vấn thêm để tăng doanh thu',
          '2': 'Thỉnh thoảng tư vấn thêm khi thấy cơ hội',
          '3': 'Nỗ lực nói đúng nhưng đôi khi bị áp lực',
          '4': 'Phần lớn nói đúng, dù mất doanh thu',
          '5': 'Luôn nói nội dung chính xác, dù mất doanh thu',
        },
        scale_labels_en: {
          '1': 'Often recommend additional services to increase revenue',
          '2': 'Sometimes recommend when you see an opportunity',
          '3': 'Try to be honest but sometimes pressured',
          '4': 'Largely honest, even at the cost of revenue',
          '5': 'Always accurate, even at the cost of revenue',
        },
        dimension: 'sky',
      },
      {
        question_id: 'sky_s_d2',
        order_idx: 2,
        type: 'select',
        label_vi: 'Nhân sự bạn quản lý có dám nói thẳng với bệnh nhân khi họ thắc mắc bất đồng không?',
        label_en: 'Can your staff be honest with patients when they have concerns or disagreements?',
        scale_labels_vi: {
          '1': 'Thường lúng túng, tránh né',
          '2': 'Cố gắng nhưng chưa tự tin',
          '3': 'Được đào tạo nhưng chưa thành thục',
          '4': 'Tự tin nói thẳng trong hầu hết tình huống',
          '5': 'Được đào tạo để nói thẳng một cách tự nhiên và tôn trọng',
        },
        scale_labels_en: {
          '1': 'Often awkward, avoid it',
          '2': 'Try but not confident',
          '3': 'Trained but not yet proficient',
          '4': 'Confident in most situations',
          '5': 'Trained to be honest naturally and respectfully',
        },
        dimension: 'sky',
      },
      {
        question_id: 'sky_k_open',
        order_idx: 3,
        type: 'textarea',
        label_vi: 'Bệnh nhân trong phòng khám của bạn thường mô tả họ cảm nhận như thế nào khi thoát khỏi ghế răng? Bạn biết điều đó như thế nào?',
        label_en: "How do patients in your clinic typically describe how they feel after leaving the dental chair? How do you know this?",
        placeholder_vi: 'Bạn có thể trích dẫn review, tin nhắn, hoặc cảm nhận thật sự từ bệnh nhân.',
        placeholder_en: 'You can quote reviews, messages, or genuine feelings from patients.',
      },
      {
        question_id: 'sky_k_d1',
        order_idx: 4,
        type: 'select',
        label_vi: 'Nhân sự phòng khám có thường xuyên được quan tâm đến cảm xúc (không chỉ là căn bệnh lý) của bệnh nhân không?',
        label_en: "Does your clinic staff regularly pay attention to patients' emotions (not just their clinical condition)?",
        scale_labels_vi: {
          '1': 'Hầu như không',
          '2': 'Thỉnh thoảng khi có vấn đề',
          '3': 'Nỗ lực nhưng chưa thành văn hóa',
          '4': 'Đây là thói quen trong hầu hết tương tác',
          '5': 'Đây là chuẩn mực — mỗi tương tác đều có sự quan tâm',
        },
        scale_labels_en: {
          '1': 'Almost never',
          '2': 'Sometimes when there\'s a problem',
          '3': 'Making effort but not yet a culture',
          '4': 'This is the habit in most interactions',
          '5': 'This is the standard — every interaction includes care',
        },
        dimension: 'sky',
      },
      {
        question_id: 'sky_k_d2',
        order_idx: 5,
        type: 'select',
        label_vi: 'Bạn có quan tâm đến sức khỏe tinh thần và sự phát triển cá nhân của nhân sự không, không chỉ là hiệu quả làm việc?',
        label_en: "Do you care about your staff's mental well-being and personal growth, not just their performance?",
        scale_labels_vi: {
          '1': 'Chỉ quan tâm khi có vấn đề',
          '2': 'Thỉnh thoảng hỏi thăm',
          '3': 'Nỗ lực nhưng chưa thường xuyên',
          '4': 'Đây là phần quan trọng trong quản lý',
          '5': 'Đây là nhiệm vụ của tôi — mỗi người đều cần được phát triển',
        },
        scale_labels_en: {
          '1': 'Only care when there\'s a problem',
          '2': 'Occasionally check in',
          '3': 'Making effort but not regularly',
          '4': 'This is an important part of management',
          '5': 'This is my duty — every person needs to grow',
        },
        dimension: 'sky',
      },
      {
        question_id: 'sky_y_open',
        order_idx: 6,
        type: 'textarea',
        label_vi: 'Lần gần nhất bạn thừa nhận mình sai với nhân sự hoặc bệnh nhân và thay đổi hành động? Điều đó khó khăn ở điểm nào?',
        label_en: 'The last time you admitted you were wrong to a staff member or patient and changed your action? What was the hardest part?',
        placeholder_vi: 'Một câu chuyện thật — bạn sai ở đâu, khó khăn nhất là điều gì, và kết quả ra sao.',
        placeholder_en: 'A true story — where you were wrong, what was hardest, and what happened.',
        anchor: 1,
      },
      {
        question_id: 'sky_y_d1',
        order_idx: 7,
        type: 'select',
        label_vi: 'Khi nhân sự phản hồi rằng quy trình không hợp lý, bạn thường:',
        label_en: "When staff feedback that a process isn't working, you usually:",
        scale_labels_vi: {
          '1': 'Khó chịu, thường bảo vệ quy trình',
          '2': 'Lắng nghe nhưng ít thay đổi',
          '3': 'Cân nhắc nhưng thường giữ nguyên',
          '4': 'Lắng nghe và sẵn sàng điều chỉnh',
          '5': 'Lắng nghe, cân nhắc và điều chỉnh nếu có lý',
        },
        scale_labels_en: {
          '1': 'Uncomfortable, usually defend the process',
          '2': 'Listen but rarely change',
          '3': 'Consider but usually keep things as is',
          '4': 'Listen and ready to adjust',
          '5': 'Listen, consider, and adjust if reasonable',
        },
        dimension: 'sky',
      },
      {
        question_id: 'sky_y_d2',
        order_idx: 8,
        type: 'select',
        label_vi: 'Có phải bạn thường là người cuối cùng trong phòng khám phải thay đổi ý kiến không?',
        label_en: 'Are you usually the last person in the clinic to change your mind?',
        scale_labels_vi: {
          '1': 'Rất khó thay đổi ý khi đã quyết',
          '2': 'Phải có lý do rất lớn mới thay đổi',
          '3': 'Cố gắng nhưng đôi khi cứng đầu',
          '4': 'Dễ thay đổi khi thấy thông tin hợp lý',
          '5': 'Luôn sẵn sàng thay đổi — đó là sức mạnh, không phải yếu đuối',
        },
        scale_labels_en: {
          '1': 'Very hard to change once decided',
          '2': 'Need very strong reasons to change',
          '3': 'Trying but sometimes stubborn',
          '4': 'Easy to change when seeing reasonable information',
          '5': "Always ready to change — that's strength, not weakness",
        },
        dimension: 'sky',
      },
    ],
  },

  // ── S.T.A.R.S ──
  {
    order_idx: 2,
    title_vi: 'PHẦN 3: BẢN ĐỒ NĂNG LỰC — S.T.A.R.S',
    title_en: 'PART 3: CAPABILITY MAP — S.T.A.R.S',
    subtitle_vi: 'Đánh giá 5 chiều năng lực: Skills, Traits, Actions, Results, Synergy.',
    subtitle_en: 'Evaluating 5 dimensions of capability: Skills, Traits, Actions, Results, Synergy.',
    ref: 'Chương 25 — S.T.A.R.S',
    icon: 'stars',
    questions: [
      {
        question_id: 'stars_s_d',
        order_idx: 0,
        type: 'select',
        label_vi: 'Đội ngũ chuyên môn của bạn (bác sĩ, phụ tá) có thể đảm bảo chất lượng điều trị ổn định không?',
        label_en: 'Can your clinical team (doctors, assistants) maintain consistent treatment quality?',
        scale_labels_vi: {
          '1': 'Rất phụ thuộc vào từng người',
          '2': 'Một vài người giỏi, phần còn lại yếu',
          '3': 'Ổn định nhưng chưa nhất quán',
          '4': 'Ổn định trong hầu hết tình huống',
          '5': 'Ổn định tuyệt đối — không phụ thuộc vào cá nhân',
        },
        scale_labels_en: {
          '1': 'Heavily dependent on individuals',
          '2': 'A few strong people, rest are weak',
          '3': 'Stable but not consistent',
          '4': 'Stable in most situations',
          '5': 'Absolutely stable — not dependent on any individual',
        },
        dimension: 'stars',
      },
      {
        question_id: 'stars_s_open',
        order_idx: 1,
        type: 'textarea',
        label_vi: 'Người nào trong đội ngũ của bạn hiện đang là người "đúng giá trị" nhất? Ai cần được phát triển thêm? Tại sao bạn nghĩ vậy?',
        label_en: 'Who in your team is currently "most aligned with values"? Who needs development? Why do you think so?',
        placeholder_vi: 'Liệt kê tên và lý do — không cần mô tả chi tiết, chỉ cần cảm nhận thật.',
        placeholder_en: 'List names and reasons — brief is fine.',
      },
      {
        question_id: 'stars_t_d',
        order_idx: 2,
        type: 'select',
        label_vi: 'Bạn đánh giá phong cách tuyển dụng hiện tại của mình: bạn có tuyển người "đúng giá trị" trước, "giỏi năng lực" sau không?',
        label_en: 'Your current hiring approach: do you hire for "values fit" first, "competence" second?',
        scale_labels_vi: {
          '1': 'Thường tuyển người giỏi trước',
          '2': 'Thấy cả hai nhưng thường thiên về năng lực',
          '3': 'Cố gắng nhưng chưa có quy tắc rõ ràng',
          '4': 'Phân biệt rõ — giá trị là tiêu chuẩn đầu tiên',
          '5': 'Luôn đặt giá trị lên hàng đầu — năng lực có thể đào tạo',
        },
        scale_labels_en: {
          '1': 'Usually hire for competence first',
          '2': 'See both but usually lean toward competence',
          '3': 'Trying but no clear rule yet',
          '4': 'Clear distinction — values are the first criterion',
          '5': 'Always values first — competence can be trained',
        },
        dimension: 'stars',
      },
      {
        question_id: 'stars_t_open',
        order_idx: 3,
        type: 'textarea',
        label_vi: 'Cho một ví dụ cụ thể mà đội ngũ đã hành động đúng, dù áp lực lớn. Và một ví dụ ngược lại.',
        label_en: 'Give a specific example where your team acted correctly under heavy pressure. And one example where they didn\'t.',
        placeholder_vi: 'Hai tình huống: một thành công, một chưa tốt — ngắn gọn.',
        placeholder_en: 'Two situations — one success, one needing improvement. Brief.',
        anchor: 1,
      },
      {
        question_id: 'stars_a_d',
        order_idx: 4,
        type: 'select',
        label_vi: 'Các quy trình quan trọng (tiếp đón, tư vấn, điều trị, CSKH) đã được chuẩn hóa và thực hiện nhất quán chưa?',
        label_en: 'Have your key processes (reception, consultation, treatment, aftercare) been standardized and consistently implemented?',
        scale_labels_vi: {
          '1': 'Chủ yếu tùy trường hợp',
          '2': 'Có quy trình trên giấy nhưng ít người tuân thủ',
          '3': 'Đang áp dụng nhưng chưa ổn định',
          '4': 'Có quy trình rõ ràng và được thực hiện',
          '5': 'Quy trình sống trong văn hóa — mọi người thực hiện vì hiểu, không vì ép',
        },
        scale_labels_en: {
          '1': 'Mostly situational',
          '2': 'Written down but few follow',
          '3': 'Being implemented but not yet stable',
          '4': 'Clear processes, consistently followed',
          '5': "Processes live in the culture — people follow because they understand, not because they're forced",
        },
        dimension: 'stars',
      },
      {
        question_id: 'stars_a_open',
        order_idx: 5,
        type: 'textarea',
        label_vi: 'Nếu chỉ có thể đào tạo thêm 1 kỹ năng cho toàn đội ngũ ngay bây giờ, bạn sẽ chọn kỹ năng gì? Tại sao?',
        label_en: 'If you could train just ONE more skill for your entire team right now, what would it be? Why?',
        placeholder_vi: 'Chỉ 1 — và giải thích lý do.',
        placeholder_en: 'Just one — and explain why.',
      },
      {
        question_id: 'stars_r_d',
        order_idx: 6,
        type: 'select',
        label_vi: 'Bạn có hệ thống đo lường kết quả không chỉ doanh thu, mà cả chất lượng điều trị, hài lòng bệnh nhân và sự phát triển của đội ngũ không?',
        label_en: 'Do you have a system to measure results beyond revenue — including treatment quality, patient satisfaction, and team growth?',
        scale_labels_vi: {
          '1': 'Chỉ đo doanh thu',
          '2': 'Đo thêm một vài chỉ số',
          '3': 'Cố gắng đo nhiều hơn nhưng chưa có hệ thống',
          '4': 'Có hệ thống đo đa chiều',
          '5': 'Hệ thống đo lường phản ánh SKY — không chỉ kết quả, mà còn cách đạt được',
        },
        scale_labels_en: {
          '1': 'Only measure revenue',
          '2': 'Measure a few additional metrics',
          '3': 'Trying to measure more but no system yet',
          '4': 'Have a multi-dimensional measurement system',
          '5': "Measurement reflects SKY — not just results, but how results are achieved",
        },
        dimension: 'stars',
      },
      {
        question_id: 'stars_syn_choice',
        order_idx: 7,
        type: 'radio',
        label_vi: 'Khi một thành viên trong đội ngũ hoàn thành ca điều trị, quá trình phối hợp giữa các bộ phận (tiếp đón, tư vấn, phụ tá, kế toán) đang:',
        label_en: 'When a team member completes a treatment, the coordination between departments (reception, consultation, assistants, billing) is:',
        options_vi: [
          'Rất tốn kém, thường mất thông tin',
          'Ổn định nhưng chưa trơn tru',
          'Tốt, mọi người hiểu vai trò của nhau',
          'Rất tốt, tạo ra giá trị vượt ngoài phần việc cá nhân',
        ],
        options_en: [
          'Very costly, information is often lost',
          'Stable but not yet smooth',
          "Good, everyone understands each other's roles",
          'Excellent, creating value beyond individual tasks',
        ],
      },
      {
        question_id: 'stars_syn_d',
        order_idx: 8,
        type: 'select',
        label_vi: 'Mối quan hệ giữa các bộ phận trong phòng khám có tạo ra sức mạnh lớn hơn tổng từng bộ phận riêng lẻ không?',
        label_en: 'Does the relationship between departments in your clinic create strength greater than the sum of individual parts?',
        scale_labels_vi: {
          '1': 'Mỗi phần hoạt động độc lập',
          '2': 'Thỉnh thoảng phối hợp nhưng chưa ăn ý',
          '3': 'Phối hợp được nhưng chưa tạo giá trị thêm',
          '4': 'Phối hợp tốt, tạo giá trị cộng thêm',
          '5': 'Luôn tạo ra giá trị vượt ngoài — cả nhóm mạnh hơn từng người',
        },
        scale_labels_en: {
          '1': 'Each part operates independently',
          '2': 'Sometimes coordinate but not yet in sync',
          '3': 'Can coordinate but doesn\'t create added value',
          '4': 'Coordinate well, creating added value',
          '5': 'Always creates value beyond — the team is stronger than any individual',
        },
        dimension: 'stars',
      },
      {
        question_id: 'stars_syn_open',
        order_idx: 9,
        type: 'textarea',
        label_vi: 'Điều gì bạn cảm thấy tự hào nhất về đội ngũ hiện tại? Điều gì khiến bạn lo lắng nhất?',
        label_en: 'What are you most proud of about your team? What worries you most?',
        placeholder_vi: 'Cả hai câu hỏi — tự hào và lo lắng. Chỉ cần viết cảm nhận thật.',
        placeholder_en: 'Both questions — pride and worry. Just write what you truly feel.',
      },
    ],
  },

  // ── Living System ──
  {
    order_idx: 3,
    title_vi: 'PHẦN 4: HỆ THỐNG SỐNG',
    title_en: 'PART 4: THE LIVING SYSTEM',
    subtitle_vi: 'Đo lường mức độ phòng khám đang vận hành như một "hệ thống sống" thay vì "cỗ máy".',
    subtitle_en: 'Measuring how much your clinic operates as a "living system" rather than a "machine".',
    ref: 'Chương 22 — Hệ Thống Sống',
    icon: 'eco',
    questions: [
      {
        question_id: 'living_o1',
        order_idx: 0,
        type: 'textarea',
        label_vi: 'Bạn tự đánh giá phòng khám của mình gần với "hệ thống sống" hơn hay "cỗ máy" hơn? Nếu phòng khám là một cơ sống, bạn nghĩ nó đang ở giai đoạn nào: còn mơ, đang lớn, hay đã chín?',
        label_en: 'Would you say your clinic is closer to a "living system" or a "machine"? If your clinic were a living organism, what stage would it be in: still dreaming, growing, or mature?',
        placeholder_vi: 'Hãy miêu tả tự nhiên — không cần lý thuyết, chỉ cần cảm nhận thật.',
        placeholder_en: 'Describe naturally — no theory needed, just what you truly feel.',
        anchor: 1,
      },
      {
        question_id: 'living_o2',
        order_idx: 1,
        type: 'textarea',
        label_vi: 'Điều gì trong phòng khám đang sống tốt nhất? Điều gì đang yếu nhất? Bạn thấy sự khác biệt giữa hai phần này?',
        label_en: "What in your clinic is working best right now? What's the weakest? Do you see the difference between these two?",
        placeholder_vi: 'Viết 2 ý: điều sống tốt nhất + điều yếu nhất.',
        placeholder_en: "Write two things: what's strongest + what's weakest.",
      },
      {
        question_id: 'living_d1',
        order_idx: 2,
        type: 'select',
        label_vi: 'Phòng khám có cơ chế "tự học hỏi" từ lỗi không? (Ví dụ: phân tích ca tai biến, học từ khi phàn nàn của bệnh nhân)',
        label_en: 'Does your clinic have a mechanism to "self-learn" from mistakes? (e.g., analyzing adverse events, learning from patient complaints)',
        scale_labels_vi: {
          '1': 'Không có',
          '2': 'Có nhưng chỉ khi có vấn đề lớn',
          '3': 'Đang cố gắng nhưng chưa thành thói quen',
          '4': 'Có và được thực hiện',
          '5': 'Có và thực sự dùng để cải thiện — đây là văn hóa',
        },
        scale_labels_en: {
          '1': 'No mechanism',
          '2': 'Yes, but only for major issues',
          '3': 'Trying but not yet habitual',
          '4': "Yes, and it's being implemented",
          '5': 'Yes, and genuinely used for improvement — this is the culture',
        },
        dimension: 'living',
      },
      {
        question_id: 'living_d2',
        order_idx: 3,
        type: 'select',
        label_vi: 'Dữ liệu về chất lượng (không chỉ tài chính) có được sử dụng để quyết định không?',
        label_en: 'Is non-financial quality data being used to make decisions?',
        scale_labels_vi: {
          '1': 'Hiếm khi',
          '2': 'Thỉnh thoảng xem xét',
          '3': 'Cố gắng thu thập nhưng chưa dùng',
          '4': 'Dùng để ra quyết định',
          '5': 'Luôn là cơ sở ra quyết định',
        },
        scale_labels_en: {
          '1': 'Rarely',
          '2': 'Sometimes reviewed',
          '3': 'Trying to collect but not yet using',
          '4': 'Used for decision-making',
          '5': 'Always the basis for decisions',
        },
        dimension: 'living',
      },
      {
        question_id: 'living_d3',
        order_idx: 4,
        type: 'select',
        label_vi: 'Nhân sự có cảm thấy an toàn để báo lỗi, để ý kiến và để học hỏi từ nhau không?',
        label_en: 'Do staff feel safe to report errors, give opinions, and learn from each other?',
        scale_labels_vi: {
          '1': 'Không, thường lo sợ',
          '2': 'Một vài người dám, phần lớn không',
          '3': 'Cố gắng xây dựng nhưng chưa thành',
          '4': 'Phần lớn an toàn',
          '5': 'Có, đây là văn hóa — mọi người học hỏi từ nhau',
        },
        scale_labels_en: {
          '1': "No, they're usually afraid",
          '2': 'A few people dare, most don\'t',
          '3': 'Trying to build but not yet there',
          '4': 'Most people feel safe',
          '5': 'Yes, this is the culture — everyone learns from each other',
        },
        dimension: 'living',
      },
      {
        question_id: 'living_d4',
        order_idx: 5,
        type: 'select',
        label_vi: 'Bạn có cảm nhận rằng mối quan hệ giữa bạn và đội ngũ đang trưởng thành không?',
        label_en: 'Do you feel that the relationship between you and your team is maturing?',
        scale_labels_vi: {
          '1': 'Khá tĩnh — không có gì mới',
          '2': 'Thỉnh thoảng có chuyển biến',
          '3': 'Đang dần tốt hơn',
          '4': 'Tốt — có sự tin tưởng và hiểu nhau',
          '5': 'Rất tốt — cả hai cùng lớn lên',
        },
        scale_labels_en: {
          '1': 'Quite static — nothing new',
          '2': 'Occasionally some change',
          '3': 'Gradually improving',
          '4': 'Good — there\'s trust and understanding',
          '5': 'Excellent — both sides are growing together',
        },
        dimension: 'living',
      },
    ],
  },

  // ── Future Potential ──
  {
    order_idx: 4,
    title_vi: 'PHẦN 5: TIỀM NĂNG & TƯƠNG LAI',
    title_en: 'PART 5: POTENTIAL & FUTURE',
    subtitle_vi: 'Hiểu tâm trạng, hy vọng và áp lực của chủ phòng khám — giúp tư vấn viên nắm bắt "khoảng cách" giữa hiện tại và tầm nhìn.',
    subtitle_en: "Understanding your mindset, hopes, and pressures — helping your consultant see the gap between current state and vision.",
    icon: 'auto_awesome',
    questions: [
      {
        question_id: 'future_o1',
        order_idx: 0,
        type: 'textarea',
        label_vi: 'Trong 3 năm tới, bạn thấy phòng khám này ở đâu? Mô tả khung cảnh: có bao nhiêu người, doanh thu mục tiêu, chất lượng trải nghiệm bệnh nhân, và tâm trạng của bạn.',
        label_en: 'In the next 3 years, where do you see this clinic? Describe the scene: how many people, target revenue, patient experience quality, and your mood.',
        placeholder_vi: 'Hãy tưởng tượng — không cần chính xác, chỉ cần thật.',
        placeholder_en: "Just imagine — doesn't need to be precise, just honest.",
        anchor: 1,
      },
      {
        question_id: 'future_o2',
        order_idx: 1,
        type: 'textarea',
        label_vi: 'Áp lực lớn nhất mà bạn đang phải đối mặt là gì? (tài chính, nhân sự, cạnh tranh, tại bản thân, hay khác?) Áp lực này ảnh hưởng đến quyết định của bạn như thế nào?',
        label_en: "What's the biggest pressure you're facing right now? (Financial, staffing, competition, personal, or other?) How does this pressure affect your decisions?",
        placeholder_vi: 'Viết tự nhiên — đây là nơi để bạn được "thở".',
        placeholder_en: 'Write naturally — this is your space to breathe.',
      },
      {
        question_id: 'future_o3',
        order_idx: 2,
        type: 'textarea',
        label_vi: 'Điều gì mà bạn đã thử nhiều lần mà chưa thành công? Bạn nghĩ tại sao?',
        label_en: "What have you tried many times but haven't succeeded? Why do you think that is?",
        placeholder_vi: 'Không cần phân tích — chỉ cần kể lại.',
        placeholder_en: 'No analysis needed — just tell the story.',
      },
    ],
  },

  // ── Commitment ──
  {
    order_idx: 5,
    title_vi: 'PHẦN 6: CAM KẾT — TRƯỚC BUỔI TƯ VẤN',
    title_en: 'PART 6: COMMITMENT — BEFORE THE CONSULTING SESSION',
    subtitle_vi: 'Tạo sự rõ ràng và động lực trước khi bắt đầu hành trình tư vấn.',
    subtitle_en: 'Creating clarity and motivation before starting the consulting journey.',
    icon: 'verified',
    questions: [
      {
        question_id: 'commit_o1',
        order_idx: 0,
        type: 'textarea',
        label_vi: 'Bạn có sẵn sàng nhìn thấy những điều không dễ chịu về phòng khám của bạn không? Những điều đó có thể khó chịu, nhưng nó là nền tảng để thay đổi thật sự. Điều gì khiến bạn lo lắng nhất khi nghĩ đến việc đó?',
        label_en: "Are you ready to see things about your clinic that aren't easy to face? These may be uncomfortable, but they're the foundation for real change. What worries you most about that?",
        placeholder_vi: 'Hãy thành thật — đây không phải câu hỏi để đánh giá.',
        placeholder_en: 'Be honest — this question is not for evaluation.',
        anchor: 1,
      },
      {
        question_id: 'commit_o2',
        order_idx: 1,
        type: 'textarea',
        label_vi: 'Bắt đầu từ ngày mai, bạn có thể làm ngay một điều nhỏ để thể hiện sự thay đổi không? Mô tả điều đó.',
        label_en: 'Starting tomorrow, can you do one small thing to show change? Describe that thing.',
        placeholder_vi: 'Một hành động nhỏ cụ thể — không cần lớn, chỉ cần thật.',
        placeholder_en: "One specific small action — doesn't need to be big, just real.",
      },
      {
        question_id: 'commit_choice',
        order_idx: 2,
        type: 'radio',
        label_vi: 'Bạn cam kết với bản thân rằng:',
        label_en: 'You commit to yourself that:',
        options_vi: [
          'Tôi muốn hiểu thấu phòng khám của mình từ gốc đến ngọn',
          'Tôi sẵn sàng thay đổi khi thấy thông tin đúng',
          'Tôi hiểu rằng thành công cần thời gian và tôi kiên nhẫn',
          'Tất cả trên',
        ],
        options_en: [
          'I want to deeply understand my clinic from root to surface',
          "I'm ready to change when I see the right information",
          "I understand that success takes time and I'm patient",
          'All of the above',
        ],
      },
    ],
  },
];

// ── Full definition ────────────────────────────────────

export const HO_SO_GOC_RE_SEED: SurveyDefinitionInput & {
  sections: SeedSection[];
} = {
  id: 'ho-so-goc-re',
  slug: 'ho-so-goc-re',
  title_vi: 'Hồ Sơ Gốc Rễ',
  title_en: 'Roots Profile',
  description_vi:
    'Trước khi bắt đầu hành trình, hãy quay về gốc rễ. Khảo sát này giúp bạn và tư vấn viên thấy rõ bản sắc, giá trị và năng lực hiện có của phòng khám.',
  description_en:
    "Before starting the journey, let's return to the roots. This survey helps you and your consultant clearly see the identity, values, and current capabilities of your clinic.",
  subtitle_vi: 'Khảo sát tự đánh giá 6 phần theo framework ROOTS, SKY, S.T.A.R.S, Hệ thống sống.',
  subtitle_en: '6-part self-assessment using ROOTS, SKY, S.T.A.R.S, Living System frameworks.',
  chapter_refs: ['Ch.22', 'Ch.24', 'Ch.25', 'Ch.26'],
  status: 'active',
  is_free: 0,
  survey_type: 'full',
  lead_fields: LEAD_FIELDS,
  scoring_rules: SCORING_RULES,
  ai_config: AI_CONFIG,
  translations_vi: TRANSLATIONS_VI,
  translations_en: TRANSLATIONS_EN,
  order_index: 0,
  sections: SECTIONS,
};