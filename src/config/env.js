import 'dotenv/config'

const nodeEnv = process.env.NODE_ENV || 'development'
const isProd = nodeEnv === 'production'

// Prod: MONGO_URI_PROD, o la misma de pruebas si aún no separas DBs
const mongoUri = isProd
  ? process.env.MONGO_URI_PROD || process.env.MONGO_URI_TEST
  : process.env.MONGO_URI_TEST

if (!mongoUri) {
  throw new Error(
    isProd
      ? 'Variable de entorno requerida: MONGO_URI_PROD o MONGO_URI_TEST.'
      : 'Variable de entorno requerida: MONGO_URI_TEST (desarrollo).',
  )
}

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error('Variable de entorno requerida: ACCESS_TOKEN_SECRET')
}

if (!process.env.ADMIN_PASSWORD) {
  throw new Error(
    'Variable de entorno requerida: ADMIN_PASSWORD (mín. 8 caracteres, sin valor por defecto).',
  )
}

if (String(process.env.ADMIN_PASSWORD).length < 8) {
  throw new Error('ADMIN_PASSWORD debe tener al menos 8 caracteres.')
}

function parseEmails(value) {
  return String(value || '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
}

const contactEmails = parseEmails(process.env.CONTACT_EMAILS)

if (!contactEmails.length && isProd) {
  throw new Error('CONTACT_EMAILS es requerida en producción.')
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '12h'
const jwtExpiresMs = (() => {
  const match = String(jwtExpiresIn).match(/^(\d+)([smhd])$/i)
  if (!match) return 12 * 60 * 60 * 1000
  const n = Number(match[1])
  const unit = match[2].toLowerCase()
  const mult = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }
  return n * (mult[unit] || 3_600_000)
})()

export const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  mongoUri,
  jwtSecret: process.env.ACCESS_TOKEN_SECRET,
  jwtExpiresIn,
  jwtExpiresMs,
  clientUrl:
    process.env.CLIENT_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    'http://localhost:5173',

  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  contactEmails,
  admin: {
    email: (process.env.ADMIN_EMAIL || 'admin@merwilvegas.com')
      .toLowerCase()
      .trim(),
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME || 'Merwil Vegas',
  },
}
