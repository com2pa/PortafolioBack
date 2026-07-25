import 'dotenv/config'

const required = ['MONGO_URI_TEST', 'ACCESS_TOKEN_SECRET']

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Variable de entorno requerida: ${key}`)
  }
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
const nodeEnv = process.env.NODE_ENV || 'development'

if (!contactEmails.length && nodeEnv === 'production') {
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
  mongoUri: process.env.MONGO_URI_TEST,
  jwtSecret: process.env.ACCESS_TOKEN_SECRET,
  jwtExpiresIn,
  jwtExpiresMs,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
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
