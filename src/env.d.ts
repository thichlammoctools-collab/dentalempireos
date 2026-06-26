/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    SESSION: KVNamespace;
    MEDIA: R2Bucket;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    RESEND_API_KEY: string;
    ADMIN_EMAILS: string;
    CF_API_TOKEN: string;
    CF_ZONE_ID: string;
    PAYOS_CLIENT_ID: string;
    PAYOS_API_KEY: string;
    PAYOS_CHECKSUM_KEY: string;
    PAYOS_WEBHOOK_URL: string;
  }
}

declare namespace App {
  interface Locals {
    cfContext: ExecutionContext;
    user: (import('better-auth').User & { is_active?: number }) | null;
    session: import('better-auth').Session | null;
  }
}
