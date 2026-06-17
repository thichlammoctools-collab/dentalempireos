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
  }
}

declare namespace App {
  interface Locals {
    cfContext: ExecutionContext;
    user: import('better-auth').User | null;
    session: import('better-auth').Session | null;
  }
}
