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

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.BETTER_AUTH_URL],
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