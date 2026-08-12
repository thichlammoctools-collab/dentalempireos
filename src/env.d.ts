/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

interface Window {
  dentalAnalytics?: {
    getAnonymousId?: () => string | null;
    getAttribution?: () => Record<string, string | null>;
    track?: (eventName: string, props?: Record<string, string>) => Promise<void>;
  };
}

declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    SESSION: KVNamespace;
    MEDIA: R2Bucket;
    VECTORIZE?: VectorizeIndex;
    SCANNER_AI_ANALYSIS_QUEUE: Queue<import('./lib/scanner-ai-queue').ScannerAiQueueMessage>;
    SCANNER_AI_PLAN_QUEUE: Queue<import('./lib/scanner-ai-queue').ScannerAiQueueMessage>;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_API_KEY?: string;
    RESEND_API_KEY: string;
    RESEND_FROM_EMAIL?: string;
    ADMIN_EMAILS: string;
    CF_API_TOKEN: string;
    CF_AI_GATEWAY_TOKEN: string;
    MOTAPIS_API_KEY: string;
    CF_ZONE_ID: string;
    PAYOS_CLIENT_ID: string;
    PAYOS_API_KEY: string;
    PAYOS_CHECKSUM_KEY: string;
    PAYOS_WEBHOOK_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_CHAT_ID: string;
  }
}

declare namespace App {
  interface Locals {
    cfContext: ExecutionContext;
    user: (import('better-auth').User & { is_active?: number }) | null;
    session: import('better-auth').Session | null;
  }
}
