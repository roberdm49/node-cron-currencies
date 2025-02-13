import dotenv from 'dotenv'
dotenv.config()

export const GlobalEnv = {
  APP_RUNTIME_ENV: String(process.env.APP_RUNTIME_ENV),
  CRON_SECRET: String(process.env.CRON_SECRET),
  EXTERNAL_CURRENCY_API_BASE_URL: String(process.env.EXTERNAL_CURRENCY_API_BASE_URL),
  INTERNAL_CURRENCY_API_URL: String(process.env.INTERNAL_CURRENCY_API_URL)
} as const

export const CRON_INTERVALS = {
  EVERY_TEN_SECONDS: '*/10 * * * * *',
  EVERY_DAY_AT_MIDNIGHT: '0 0 * * * *'
}

export const CURRENCY_PATHS: { [key: string]: string } = {
  USD: 'dolares/blue',
  EUR: 'cotizaciones/eur',
  BRL: 'cotizaciones/brl'
} as const

export const ISO_NUMS: { [key: string]: string } = {
  USD: '840',
  EUR: '978',
  BRL: '986',
  ARS: '032'
} as const
