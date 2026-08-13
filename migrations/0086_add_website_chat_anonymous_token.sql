-- Bind anonymous website-chat sessions to a client-held proof token.
-- Only a SHA-256 hash is persisted; the raw token lives in an HttpOnly cookie.

ALTER TABLE "website_chat_session" ADD COLUMN "anonymous_token_hash" TEXT;
