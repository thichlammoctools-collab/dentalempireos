import { getApp } from './app-db';
import { getPostById } from './blog-db';
import { getCourse } from './course-db';
import { hasActiveEntitlementForContent } from './entitlement-db';
import { hasUserContentGrant } from './credit-db';
import { getResource } from './resource-db';
import { getSurveyDefinitionById } from './survey-config-db';

type UserId = string | null | undefined;

export async function hasActiveScannerProduct(
  db: D1Database,
  scannerId: string,
): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT 1
       FROM "product" p
       INNER JOIN "product_entitlement" pe ON pe."product_id" = p."id"
       WHERE p."is_active" = 1
          AND pe."content_type" = 'scanner'
          AND pe."content_id" = ?
       LIMIT 1`,
    )
    .bind(scannerId)
    .first();
  return row !== null;
}

export async function canAccessBook(
  db: D1Database,
  userId: UserId,
  chapterId: string,
): Promise<boolean> {
  const chapter = await db
    .prepare('SELECT "is_premium" FROM "chapter" WHERE "id" = ?')
    .bind(chapterId)
    .first<{ is_premium: number }>();

  if (!chapter) return false;
  if (chapter.is_premium !== 1) return true;
  if (!userId) return false;

  return hasUserContentGrant(db, userId, 'book', '*');
}

export async function canAccessAiApp(
  db: D1Database,
  userId: UserId,
  appId: string,
): Promise<boolean> {
  const app = await getApp(db, appId);
  if (!app || app.status !== 'active') return false;
  if (app.is_free === 1) return true;
  if (!userId) return false;

  const [hasAllAccess, hasContentAccess] = await Promise.all([
    hasActiveEntitlementForContent(db, userId, 'ai_app', '*'),
    hasActiveEntitlementForContent(db, userId, 'ai_app', appId),
  ]);
  return hasAllAccess || hasContentAccess;
}

export async function canAccessScanner(
  db: D1Database,
  userId: UserId,
  scannerId: string,
): Promise<boolean> {
  const scanner = await getSurveyDefinitionById(db, scannerId);
  if (!scanner || scanner.status !== 'active') return false;
  // Scanner attempts are authorized and charged at submission time. Results
  // remain available to their authenticated owner after creation.
  return Boolean(userId);
}

export async function canAccessCourse(
  db: D1Database,
  userId: UserId,
  courseId: string,
): Promise<boolean> {
  const course = await getCourse(db, courseId);
  if (!course) return false;
  if (course.access_tier === 'free') return true;
  return hasUserContentGrant(db, userId, 'course', courseId);
}

export async function canAccessBlogPost(
  db: D1Database,
  userId: UserId,
  postId: string,
): Promise<boolean> {
  const post = await getPostById(db, postId);
  if (!post) return false;
  if (post.access_tier === 'free') return true;
  return hasUserContentGrant(db, userId, 'blog', '*');
}

export async function canAccessResource(
  db: D1Database,
  userId: UserId,
  resourceId: string,
): Promise<boolean> {
  const resource = await getResource(db, resourceId);
  if (!resource) return false;
  if (resource.tier !== 'premium') return true;
  return hasUserContentGrant(db, userId, 'resource', resourceId);
}
