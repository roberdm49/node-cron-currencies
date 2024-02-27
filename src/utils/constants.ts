import dotenv from 'dotenv'
dotenv.config()

export const GlobalEnv = {
  NODE_ENV: String(process.env.NODE_ENV),
  CRON_SECRET: String(process.env.CRON_SECRET),
  EXTERNAL_CURRENCY_API_BASE_URL: String(process.env.EXTERNAL_CURRENCY_API_BASE_URL)
} as const

export const CURRENCY_PATHS = {
  USD: 'dolares/blue',
  EUR: 'cotizaciones/eur',
  BRL: 'cotizaciones/brl'
} as const

export const ISO_NUMS = {
  USD: '840',
  EUR: '978',
  BRL: '986',
  ARS: '032'
}
