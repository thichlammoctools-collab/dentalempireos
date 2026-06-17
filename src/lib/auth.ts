import { betterAuth } from 'better-auth';
import { D1Dialect } from 'kysely-d1';

export function createAuth(env: Cloudflare.Env) {
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
  });
}

export type Auth = ReturnType<typeof createAuth>;
