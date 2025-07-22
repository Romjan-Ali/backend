interface EnvConfig {
  PORT: string
  DB_URL: string
  NODE_ENV: 'development' | 'production'
  SUPER_ADMIN_EMAIL: string
  SUPER_ADMIN_PASSWORD: string
  BCRYPT_SALT_ROUND: string
  JWT_ACCESS_SECRET: string
  JWT_ACCESS_EXPIRES: string
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables = [
    'PORT',
    'DB_URL',
    'NODE_ENV',
    'SUPER_ADMIN_EMAIL',
    'SUPER_ADMIN_PASSWORD',
    'BCRYPT_SALT_ROUND',
    'JWT_ACCESS_SECRET',
    'JWT_ACCESS_EXPIRES'
  ]

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`)
    }
  })

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string
  }
}

export const envVars = loadEnvVariables()
