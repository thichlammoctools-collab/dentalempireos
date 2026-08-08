-- Add parent_id to blog_category to support 2-level hierarchy (parent → child)
-- Allows nesting one category under another. ON DELETE SET NULL detaches children
-- instead of deleting them when a parent is removed.

ALTER TABLE "blog_category" ADD COLUMN "parent_id" text REFERENCES "blog_category" ("id") ON DELETE SET NULL;

-- Composite index for efficient sibling listing + ordering
DROP INDEX IF EXISTS "idx_cat_sort_order";
CREATE INDEX IF NOT EXISTS "idx_cat_sort_order" ON "blog_category" ("parent_id", "sort_order");
