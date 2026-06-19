-- Performance indexes for query optimization
CREATE INDEX IF NOT EXISTS idx_block_section ON "block"("section_id");
CREATE INDEX IF NOT EXISTS idx_section_chapter ON "section"("chapter_id");
CREATE INDEX IF NOT EXISTS idx_chapter_status ON "chapter"("status");
CREATE INDEX IF NOT EXISTS idx_review_chapter_status ON "review"("chapter_id", "status");
