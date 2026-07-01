SELECT id, user_id, author_name, chapter_id, rating, title, substr(content,1,60) as preview FROM review ORDER BY createdAt DESC;
