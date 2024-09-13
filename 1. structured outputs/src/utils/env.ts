import { configDotenv } from 'dotenv';
import { logger } from './logger.js';

export const requiredEnvVars = { ImageGenerator: ['OPENAI_API_KEY'] } as const;

export function verifyEnvVars() {
  configDotenv();
  const missingEnvVars = new Map<string, Set<string>>();
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    value.forEach((envVar) => {
      if (!process.env[envVar]) {
        if (!missingEnvVars.has(key)) {
          missingEnvVars.set(key, new Set());
        }
        missingEnvVars.get(key)?.add(envVar);
      }
    });
  }

  if (missingEnvVars.size) {
    for (const [key, value] of missingEnvVars.entries()) {
      logger.error(`Missing required environment variables for ${key}: ${[...value].join(', ')}`);
    }
    process.exit(1);
  }
}
