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
         "name" = excluded."name",
         "clinic_name" = excluded."clinic_name",
         "clinic_address" = excluded."clinic_address",
         "phone" = excluded."phone",
         "logo_url" = excluded."logo_url",
         "updated_at" = datetime('now')`,
    )
    .bind(
      input.id,
      input.name ?? null,
      input.clinic_name ?? null,
      input.clinic_address ?? null,
      input.phone ?? null,
      input.logo_url ?? null,
    )
    .run();
}
