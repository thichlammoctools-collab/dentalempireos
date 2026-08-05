import { getApp } from './app-db';
import { getPostById } from './blog-db';
import { getCourse } from './course-db';
import { hasActiveEntitlementForContent } from './entitlement-db';
import { getResource } from './resource-db';
import { getSurveyDefinitionById } from './survey-config-db';

type UserId = string | null | undefined;

async function hasPaidAccess(
  db: D1Database,
  userId: UserId,
  contentType: 'book' | 'ai_app' | 'scanner' | 'course' | 'blog' | 'resource',
  contentId: string,
): Promise<boolean> {
  return userId ? hasActiveEntitlementForContent(db, userId, contentType, contentId) : false;
}

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
         AND pe."content_id" IN (?, '*')
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

  return hasPaidAccess(db, userId, 'book', chapterId);
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
  const hasConfiguredProduct = await hasActiveScannerProduct(db, scannerId);
  if (scanner.is_free === 1 && !hasConfiguredProduct) return true;
  if (!userId) return false;

  const [hasAllAccess, hasContentAccess] = await Promise.all([
    hasActiveEntitlementForContent(db, userId, 'scanner', '*'),
    hasActiveEntitlementForContent(db, userId, 'scanner', scannerId),
  ]);

  return hasAllAccess || hasContentAccess;
}

export async function canAccessCourse(
  db: D1Database,
  userId: UserId,
  courseId: string,
): Promise<boolean> {
  const course = await getCourse(db, courseId);
  if (!course) return false;
  if (course.access_tier === 'free') return true;
  return hasPaidAccess(db, userId, 'course', courseId);
}

export async function canAccessBlogPost(
  db: D1Database,
  userId: UserId,
  postId: string,
): Promise<boolean> {
  const post = await getPostById(db, postId);
  if (!post) return false;
  if (post.access_tier === 'free') return true;
  return hasPaidAccess(db, userId, 'blog', postId);
}

export async function canAccessResource(
  db: D1Database,
  userId: UserId,
  resourceId: string,
): Promise<boolean> {
  const resource = await getResource(db, resourceId);
  if (!resource) return false;
  if (resource.tier !== 'premium') return true;
  return hasPaidAccess(db, userId, 'resource', resourceId);
}
