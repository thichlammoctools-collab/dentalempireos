// Data access layer for clinic_profile — per-user clinic info + logo.

export interface ClinicProfileRow {
  id: string;
  name: string | null;
  clinic_name: string | null;
  clinic_address: string | null;
  phone: string | null;
  logo_url: string | null;
  updated_at: string;
}

export async function getClinicProfile(
  db: D1Database,
  userId: string,
): Promise<ClinicProfileRow | null> {
  return db
    .prepare('SELECT * FROM "clinic_profile" WHERE "id" = ?')
    .bind(userId)
    .first<ClinicProfileRow>() ?? null;
}

export async function upsertClinicProfile(
  db: D1Database,
  input: {
    id: string;
    name?: string | null;
    clinic_name?: string | null;
    clinic_address?: string | null;
    phone?: string | null;
    logo_url?: string | null;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO "clinic_profile" ("id","name","clinic_name","clinic_address","phone","logo_url")
       VALUES (?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
          "name" = CASE WHEN ? THEN excluded."name" ELSE "clinic_profile"."name" END,
          "clinic_name" = CASE WHEN ? THEN excluded."clinic_name" ELSE "clinic_profile"."clinic_name" END,
          "clinic_address" = CASE WHEN ? THEN excluded."clinic_address" ELSE "clinic_profile"."clinic_address" END,
          "phone" = CASE WHEN ? THEN excluded."phone" ELSE "clinic_profile"."phone" END,
          "logo_url" = CASE WHEN ? THEN excluded."logo_url" ELSE "clinic_profile"."logo_url" END,
          "updated_at" = datetime('now')`,
    )
    .bind(
      input.id,
      input.name ?? null,
      input.clinic_name ?? null,
      input.clinic_address ?? null,
        input.phone ?? null,
        input.logo_url ?? null,
        input.name !== undefined ? 1 : 0,
        input.clinic_name !== undefined ? 1 : 0,
        input.clinic_address !== undefined ? 1 : 0,
        input.phone !== undefined ? 1 : 0,
        input.logo_url !== undefined ? 1 : 0,
      )
    .run();
}
