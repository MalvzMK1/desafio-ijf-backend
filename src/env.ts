import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default("30m"),
  SALT_OR_ROUNDS: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
