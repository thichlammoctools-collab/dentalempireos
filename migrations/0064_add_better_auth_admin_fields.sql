-- Better Auth admin plugin requires these fields on existing auth tables.
ALTER TABLE "user" ADD COLUMN "role" text NOT NULL DEFAULT 'user';
ALTER TABLE "user" ADD COLUMN "banned" integer NOT NULL DEFAULT 0;
ALTER TABLE "user" ADD COLUMN "banReason" text;
ALTER TABLE "user" ADD COLUMN "banExpires" date;
ALTER TABLE "session" ADD COLUMN "impersonatedBy" text;
