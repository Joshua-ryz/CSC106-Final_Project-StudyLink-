/**
 * Environment Configuration
 * Validates and exports all environment variables
 */

import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
  port: number
  nodeEnv: string
  databaseUrl: string
  jwtSecret: string
  jwtExpiresIn: string
  refreshTokenSecret: string
  refreshTokenExpiresIn: string
  frontendUrl: string
  smtp: {
    host: string
    port: number
    user: string
    pass: string
    from: string
  }
}

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env: EnvConfig = {
  port: parseInt(getEnv('PORT', '3001'), 10),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  databaseUrl: getEnv('DATABASE_URL'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '15m'),
  refreshTokenSecret: getEnv('REFRESH_TOKEN_SECRET'),
  refreshTokenExpiresIn: getEnv('REFRESH_TOKEN_EXPIRES_IN', '7d'),
  frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:5173'),
  smtp: {
    host: getEnv('SMTP_HOST', 'smtp.example.com'),
    port: parseInt(getEnv('SMTP_PORT', '587'), 10),
    user: getEnv('SMTP_USER', ''),
    pass: getEnv('SMTP_PASS', ''),
    from: getEnv('EMAIL_FROM', 'StudyLink <noreply@studylink.edu.ph>'),
  },
}

export const isProduction = env.nodeEnv === 'production'
export const isDevelopment = env.nodeEnv === 'development'

// Validate secrets in production
const placeholderWords = ['change', 'secret', 'example', 'placeholder', 'your-', 'REPLACE_ME']
const minSecretLength = 32

if (isProduction) {
  if (env.jwtSecret.length < minSecretLength || placeholderWords.some(w => env.jwtSecret.toLowerCase().includes(w))) {
    throw new Error('JWT_SECRET must be at least 32 characters and not contain placeholder words in production')
  }
  if (env.refreshTokenSecret.length < minSecretLength || placeholderWords.some(w => env.refreshTokenSecret.toLowerCase().includes(w))) {
    throw new Error('REFRESH_TOKEN_SECRET must be at least 32 characters and not contain placeholder words in production')
  }
}