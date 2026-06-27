import { betterAuth } from 'better-auth';
import { D1Dialect } from 'kysely-d1';

export function createAuth(env: Cloudflare.Env) {
  // Build socialProviders conditionally — only enable Google when both
  // clientId and clientSecret are present, so the app still boots without
  // Google OAuth configured.
  const socialProviders: Record<string, any> = {};
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  // Compute trusted origins from baseURL so dev + prod both work.
  // baseURL is required for OAuth flow (callback must match registered URI).
  const baseURL = env.BETTER_AUTH_URL;
  const trustedOrigins = [baseURL];
  try {
    const u = new URL(baseURL);
    trustedOrigins.push(`${u.protocol}//${u.host}`);
  } catch {
    // baseURL invalid — keep just the raw value
  }

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL,
    trustedOrigins,
    database: {
      dialect: new D1Dialect({ database: env.DB }),
      type: 'sqlite',
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      autoSignIn: true,
    },
    socialProviders,
  });
}

export type Auth = ReturnType<typeof createAuth>;