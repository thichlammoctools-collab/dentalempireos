// Data access layer cho website chat sessions.
// Lưu conversation history trên D1, hỗ trợ cả authenticated và anonymous users.

export interface WebsiteChatMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface WebsiteChatSession {
  id: string;
  user_id: string | null;
  title: string;
  messages: WebsiteChatMessage[];
  context_chunk_ids: string[];
  page_type?: string;
  page_slug?: string;
  created_at: string;
  updated_at: string;
}

interface DbRow {
  id: string;
  user_id: string | null;
  anonymous_token_hash: string | null;
  title: string | null;
  messages: string;
  context_chunk_ids: string | null;
  page_type: string | null;
  page_slug: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Tạo session mới.
 * @param userId - User ID (null cho anonymous)
 * @param pageType - Loại trang nơi chat bắt đầu
 * @param pageSlug - Slug của trang
 * @returns session_id
 */
export interface CreatedWebsiteChatSession {
  id: string;
  anonymousToken: string | null;
}

export async function createSession(
  db: D1Database,
  userId: string | null = null,
  pageType?: string,
  pageSlug?: string,
): Promise<CreatedWebsiteChatSession> {
  const id = crypto.randomUUID();
  const anonymousToken = userId ? null : crypto.randomUUID();
  const anonymousTokenHash = anonymousToken ? await hashAnonymousToken(anonymousToken) : null;
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO "website_chat_session"
       ("id", "user_id", "anonymous_token_hash", "title", "messages", "page_type", "page_slug", "created_at", "updated_at")
       VALUES (?, ?, ?, '', '[]', ?, ?, ?, ?)`,
    )
    .bind(id, userId, anonymousTokenHash, pageType ?? null, pageSlug ?? null, now, now)
    .run();

  return { id, anonymousToken };
}

/**
 * Load session từ DB.
 * @param sessionId - Session ID
 * @param userId - User ID để verify ownership (null cho anonymous)
 * @returns session data hoặc null nếu không tìm thấy
 */
export async function loadSession(
  db: D1Database,
  sessionId: string,
  userId?: string | null,
  anonymousToken?: string | null,
): Promise<WebsiteChatSession | null> {
  const row = await db
    .prepare('SELECT * FROM "website_chat_session" WHERE "id" = ?')
    .bind(sessionId)
    .first<DbRow>();

  if (!row) return null;

  if (row.user_id) {
    if (!userId || row.user_id !== userId) return null;
  } else {
    if (!anonymousToken || !row.anonymous_token_hash) return null;
    const tokenHash = await hashAnonymousToken(anonymousToken);
    if (!constantTimeEqual(row.anonymous_token_hash, tokenHash)) return null;
  }

  try {
    return {
      id: row.id,
      user_id: row.user_id,
      title: row.title ?? '',
      messages: JSON.parse(row.messages) as WebsiteChatMessage[],
      context_chunk_ids: row.context_chunk_ids ? JSON.parse(row.context_chunk_ids) as string[] : [],
      page_type: row.page_type ?? undefined,
      page_slug: row.page_slug ?? undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Lưu messages mới vào session.
 * Auto-generate title từ first user message nếu chưa có.
 * @param sessionId - Session ID
 * @param messages - Mảng messages (giữ tối đa 50 messages gần nhất)
 * @param chunkIds - Context chunk IDs từ RAG
 */
export async function saveSession(
  db: D1Database,
  sessionId: string,
  messages: WebsiteChatMessage[],
  chunkIds: string[] = [],
): Promise<void> {
  const now = new Date().toISOString();
  const truncatedMessages = messages.slice(-50); // Giữ 50 messages gần nhất

  // Auto-generate title từ first user message nếu chưa có
  const firstUserMsg = truncatedMessages.find(m => m.role === 'user')?.content ?? '';
  const title = generateTitle(firstUserMsg);

  await db
    .prepare(
      `UPDATE "website_chat_session"
       SET "messages" = ?,
           "context_chunk_ids" = ?,
           "title" = CASE WHEN "title" IS NULL OR "title" = '' THEN ? ELSE "title" END,
           "updated_at" = ?
       WHERE "id" = ?`,
    )
    .bind(
      JSON.stringify(truncatedMessages),
      JSON.stringify(chunkIds),
      title,
      now,
      sessionId,
    )
    .run();
}

/**
 * List sessions của user (hoặc tất cả nếu không có userId).
 * @param userId - User ID (undefined = list all)
 * @param limit - Số lượng sessions trả về
 */
export async function listSessions(
  db: D1Database,
  userId?: string,
  limit = 10,
): Promise<Omit<WebsiteChatSession, 'messages' | 'context_chunk_ids'>[]> {
  let query = 'SELECT "id", "user_id", "title", "page_type", "page_slug", "created_at", "updated_at" FROM "website_chat_session"';
  const params: unknown[] = [];

  if (userId) {
    query += ' WHERE "user_id" = ?';
    params.push(userId);
  }

  query += ' ORDER BY "updated_at" DESC LIMIT ?';
  params.push(limit);

  const { results } = await db
    .prepare(query)
    .bind(...params)
    .all<{
      id: string;
      user_id: string | null;
      title: string | null;
      page_type: string | null;
      page_slug: string | null;
      created_at: string;
      updated_at: string;
    }>();

  return (results ?? []).map(row => ({
    id: row.id,
    user_id: row.user_id,
    title: row.title ?? '',
    page_type: row.page_type ?? undefined,
    page_slug: row.page_slug ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

/**
 * Xóa session.
 * @param sessionId - Session ID
 * @param userId - User ID để verify ownership (undefined = không check)
 */
export async function deleteSession(
  db: D1Database,
  sessionId: string,
  userId?: string,
): Promise<void> {
  let query = 'DELETE FROM "website_chat_session" WHERE "id" = ?';
  const params: unknown[] = [sessionId];

  if (userId !== undefined) {
    query += ' AND "user_id" = ?';
    params.push(userId);
  }

  await db
    .prepare(query)
    .bind(...params)
    .run();
}

async function hashAnonymousToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index++) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

/**
 * Generate title từ first user message (60 ký tự đầu).
 */
function generateTitle(message: string): string {
  if (!message) return 'Cuộc trò chuyện mới';
  const cleaned = message.trim().replace(/\s+/g, ' ');
  return cleaned.length > 60 ? cleaned.slice(0, 60) + '...' : cleaned;
}
