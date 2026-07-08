-- Add vector_id column to content_chunk for storing Vectorize index IDs.
ALTER TABLE "content_chunk" ADD COLUMN "vector_id" TEXT;
