import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL starting with postgres:// or postgresql://' }),
  JWT_ACCESS_SECRET: z.string().min(8, { message: 'JWT_ACCESS_SECRET must be at least 8 characters long' }),
  JWT_REFRESH_SECRET: z.string().min(8, { message: 'JWT_REFRESH_SECRET must be at least 8 characters long' }),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  ADMIN_SECRET_KEY: z.string().min(8, { message: 'ADMIN_SECRET_KEY must be at least 8 characters long' }),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formattedErrors = parsed.error.format();
  throw new Error(`Environment validation failed: ${JSON.stringify(formattedErrors, null, 2)}`);
}

export const env = parsed.data;
export default env;
