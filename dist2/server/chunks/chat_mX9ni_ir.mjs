globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { c as chatCompletion } from "./ai-client_CyIPqKQD.mjs";
import { g as getActiveModelsWithProvider } from "./ai-provider-db_DV3FpOjN.mjs";
import { g as getApp } from "./app-db_BINE4Y41.mjs";
const STOPWORDS = /* @__PURE__ */ new Set([
  "và",
  "của",
  "cho",
  "là",
  "có",
  "được",
  "trong",
  "với",
  "để",
  "tại",
  "này",
  "từ",
  "một",
  "các",
  "những",
  "cho",
  "đã",
  "không",
  "cũng",
  "nhưng",
  "hoặc",
  "vì",
  "nên",
  "khi",
  "đó",
  "sau",
  "trên",
  "dưới",
  "vào",
  "ra",
  "bởi",
  "đến",
  "về",
  "theo",
  "cho"
]);
function stripMarkdown(text) {
  return text.replace(/[#*_`~\[\]()>/|]/g, " ").replace(/\s+/g, " ").trim();
}
function extractKeywords(query) {
  return query.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
}
function scoreChunk(text, keywords, query) {
  const stripped = stripMarkdown(text.toLowerCase());
  let score = 0;
  for (const kw of keywords) {
    let pos = 0;
    while ((pos = stripped.indexOf(kw, pos)) !== -1) {
      score++;
      pos += kw.length;
    }
  }
  if (stripped.includes(query)) score += 5;
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 10) score *= 0.5;
  if (wordCount > 600) score *= 0.7;
  return score;
}
async function searchChunks(db, query, limit = 4, opts = {}) {
  const keywords = extractKeywords(query);
  if (keywords.length === 0) return [];
  const params = [];
  const conditions = ["1=1"];
  if (opts.chapterId) {
    conditions.push('"chapter_id" = ?');
    params.push(opts.chapterId);
  }
  const { results } = await db.prepare(
    `SELECT "id", "chapter_id", "section_id", "heading_path", "text"
       FROM "content_chunk"
       WHERE ${conditions.join(" AND ")}
       ORDER BY "updatedAt" DESC
       LIMIT 200`
  ).bind(...params).all();
  if (!results?.length) return [];
  const scored = results.map((row) => ({ ...row, score: scoreChunk(row.text, keywords, query.toLowerCase()) })).filter((c) => c.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
  return scored;
}
function buildRagContext(chunks) {
  if (!chunks.length) return "";
  return chunks.map((c) => {
    const heading = c.heading_path ?? "";
    return `[${heading}]
${stripMarkdown(c.text)}`.trim();
  }).join("\n\n---\n\n");
}
const prerender = false;
async function getAiModel() {
  const all = await getActiveModelsWithProvider(env.DB);
  for (const [, entry] of all) {
    const model = entry.models.find((m) => m.is_active);
    if (model) {
      return {
        base_url: entry.provider.base_url,
        api_key: entry.provider.api_key,
        model_id: model.model_id,
        max_tokens: model.max_tokens ?? 4096
      };
    }
  }
  return null;
}
const POST = async ({ request, locals }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }
  if (!body.messages?.length) return badRequest("messages required");
  const appSlug = body.app_slug ?? "ai-mentor";
  const app = await getApp(env.DB, appSlug);
  if (!app || app.status !== "active") {
    return json({ error: "AI Mentor chưa được kích hoạt." }, 403);
  }
  const modelCfg = await getAiModel();
  if (!modelCfg) {
    return json({ error: "Chưa có AI model nào được kích hoạt." }, 503);
  }
  const lastUserMsg = [...body.messages].reverse().find((m) => m.role === "user");
  const query = lastUserMsg?.content ?? "";
  const chunks = await searchChunks(env.DB, query, 4, { chapterId: body.chapter_id });
  const ragContext = buildRagContext(chunks);
  const systemPrompt = ragContext ? `Bạn là AI Mentor của Dental Empire OS — trợ lý AI chuyên về quản trị phòng khám nha khoa.

Sử dụng nội dung sách sau để trả lời câu hỏi của user. Nếu câu hỏi nằm NGOÀI phạm vi nội dung sách, hãy nói rõ điều đó.

--- NGỮ CẢNH TỪ SÁCH ---
${ragContext}
--- HẾT NGỮ CẢNH ---

Trả lời bằng tiếng Việt, ngắn gọn, có ví dụ cụ thể khi phù hợp. Đánh dấu các thuật ngữ quan trọng bằng **bold**.` : `Bạn là AI Mentor của Dental Empire OS — trợ lý AI chuyên về quản trị phòng khám nha khoa.

Trả lời bằng tiếng Việt, ngắn gọn, có ví dụ cụ thể khi phù hợp. Đánh dấu các thuật ngữ quan trọng bằng **bold**.

Nếu câu hỏi nằm ngoài phạm vi sách Dental Empire OS, hãy nói rõ điều đó.`;
  const MAX_LEN = 1500;
  const messages = body.messages.slice(-8).map((m) => ({
    role: m.role,
    content: m.content.length > MAX_LEN ? m.content.slice(0, MAX_LEN) + "…" : m.content
  }));
  try {
    const reply = await chatCompletion(modelCfg, messages, systemPrompt);
    return json({ reply, chunks_used: chunks.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return json({ error: msg }, 500);
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
