import { AppError } from './helpers.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Rechaza caracteres de control / CRLF (inyección de cabeceras). */
export function assertNoControlChars(value, label = 'Campo') {
  if (/[\r\n\0\x08\x1b]/.test(String(value))) {
    throw new AppError(`${label} contiene caracteres no permitidos.`, 400)
  }
}

export function normalizeEmail(email) {
  const value = String(email || '')
    .toLowerCase()
    .trim()
  assertNoControlChars(value, 'Email')
  if (!EMAIL_RE.test(value) || value.length > 254) {
    throw new AppError('Email inválido.', 400)
  }
  return value
}

export function sanitizePersonName(name, { max = 120 } = {}) {
  const value = String(name || '').trim()
  assertNoControlChars(value, 'Nombre')
  if (!value) throw new AppError('El nombre es requerido.', 400)
  if (value.length > max) {
    throw new AppError(`El nombre no puede superar ${max} caracteres.`, 400)
  }
  return value
}

export function sanitizeMessage(message, { max = 5000 } = {}) {
  const value = String(message || '').trim()
  if (!value) throw new AppError('El mensaje es requerido.', 400)
  if (value.length > max) {
    throw new AppError(`El mensaje no puede superar ${max} caracteres.`, 400)
  }
  return value
}

/** Solo http(s). Rechaza javascript:, data:, etc. */
export function assertSafeHttpUrl(raw, label = 'URL') {
  const value = String(raw || '').trim()
  if (!value) throw new AppError(`${label} es requerida.`, 400)
  assertNoControlChars(value, label)

  let parsed
  try {
    parsed = new URL(value)
  } catch {
    throw new AppError(`${label} no es válida.`, 400)
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new AppError(`${label} debe usar http o https.`, 400)
  }

  return parsed.toString()
}

export function assertOptionalSafeHttpUrl(raw, label = 'URL') {
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return ''
  }
  return assertSafeHttpUrl(raw, label)
}

/** Solo rutas locales de uploads o URLs http(s). */
export function assertSafeImageRef(raw) {
  const value = String(raw || '').trim()
  if (!value) return null

  if (/^\/uploads\/[A-Za-z0-9._-]+$/.test(value)) {
    return value
  }

  return assertSafeHttpUrl(value, 'Imagen')
}

export function assertPasswordStrength(password, label = 'Contraseña') {
  const value = String(password || '')
  if (value.length < 8) {
    throw new AppError(`${label} debe tener al menos 8 caracteres.`, 400)
  }
  if (value.length > 128) {
    throw new AppError(`${label} es demasiado larga.`, 400)
  }
  return value
}
