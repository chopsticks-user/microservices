import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const auth = betterAuth({
  database: new Pool({
    connectionString: process.env["SUPABASE_DATABASE_URL"],
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  secret: process.env["BETTER_AUTH_SECRET"],
  baseURL: process.env["BETTER_AUTH_URL"],
  session: {
    expiresIn: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    freshAge: 5 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
      strategy: "jwt",
      refreshCache: true,
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
  },
  plugins: [
    jwt({
      expiresIn: 15 * 60,
      jwks: {
        keyPairConfig: {
          alg: "RS256",
        },
      },
      rotationInterval: 30 * 24 * 60 * 60,
      gracePeriod: 7 * 24 * 60 * 60,
      definePayload: (user: any, session: any) => ({
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId: session.id,
      }),
    } as any),
  ],
});

export default auth;
