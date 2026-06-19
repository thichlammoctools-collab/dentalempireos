// Data access layer for user management.

export interface UserRow {
  id: string;
  name: string;
  email: string;
  is_active: number;
  createdAt: string;
}

/** List all users ordered by creation date (newest first). */
export async function listUsers(db: D1Database): Promise<UserRow[]> {
  const { results } = await db
    .prepare('SELECT "id", "name", "email", "is_active", "createdAt" FROM "user" ORDER BY "createdAt" DESC')
    .all<UserRow>();
  return results ?? [];
}

/** Get a single user by ID. */
export async function getUser(db: D1Database, userId: string): Promise<UserRow | null> {
  const row = await db
    .prepare('SELECT "id", "name", "email", "is_active", "createdAt" FROM "user" WHERE "id" = ?')
    .bind(userId)
    .first<UserRow>();
  return row ?? null;
}

/** Toggle a user's is_active flag (0 -> 1, 1 -> 0) and return the updated row. */
export async function toggleUserActive(db: D1Database, userId: string): Promise<UserRow | null> {
  await db
    .prepare('UPDATE "user" SET "is_active" = CASE WHEN "is_active" = 1 THEN 0 ELSE 1 END, "updatedAt" = ? WHERE "id" = ?')
    .bind(new Date().toISOString(), userId)
    .run();
  return getUser(db, userId);
}
