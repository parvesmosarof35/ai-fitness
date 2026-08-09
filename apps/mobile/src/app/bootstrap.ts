import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url().optional(), // Replace with required when backend URL is known
});

export function validateEnvironment() {
  const environment = {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  };

  const parsed = envSchema.safeParse(environment);

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      JSON.stringify(parsed.error.format(), null, 2)
    );
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

// Validate immediately on load
export const env = validateEnvironment();
