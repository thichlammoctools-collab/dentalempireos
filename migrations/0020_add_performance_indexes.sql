-- Performance indexes: missing indexes from existing query patterns
-- Note: Some indexes were already added in 0009_add_indexes.sql and 0014_create_payment_tables.sql
-- This migration adds the remaining ones.

-- blog_post: WHERE status = 'published'
CREATE INDEX IF NOT EXISTS idx_blog_post_status ON "blog_post"("status");

-- blog_post: WHERE status = 'published' AND category_id = ?
CREATE INDEX IF NOT EXISTS idx_blog_post_category_status ON "blog_post"("category_id", "status");

-- blog_post: WHERE status = 'published' AND is_featured = 1
CREATE INDEX IF NOT EXISTS idx_blog_post_featured ON "blog_post"("status", "is_featured");

-- blog_post: WHERE status = 'published' AND is_pinned = 1
CREATE INDEX IF NOT EXISTS idx_blog_post_pinned ON "blog_post"("status", "is_pinned");

-- blog_post: WHERE status = 'published' AND is_recommended = 1
CREATE INDEX IF NOT EXISTS idx_blog_post_recommended ON "blog_post"("status", "is_recommended");

-- blog_post_tag: join lookup by tag_id
CREATE INDEX IF NOT EXISTS idx_blog_post_tag_tag ON "blog_post_tag"("tag_id");

-- chapter: WHERE tier = ? AND status = 'published'
CREATE INDEX IF NOT EXISTS idx_chapter_tier_status ON "chapter"("tier", "status");

-- survey_responses: WHERE user_id = ? and WHERE status = ?
CREATE INDEX IF NOT EXISTS idx_survey_user ON "survey_responses"("user_id");
CREATE INDEX IF NOT EXISTS idx_survey_status ON "survey_responses"("status");
