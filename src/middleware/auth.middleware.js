import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { AppError } from '../utils/helpers.js'

export const AUTH_COOKIE = 'mv_auth_token'

export function getTokenFromRequest(req) {
  const header = req.headers.authorization || ''
  if (header.startsWith('Bearer ')) return header.slice(7)
  if (req.cookies?.[AUTH_COOKIE]) return req.cookies[AUTH_COOKIE]
  return null
}

export function setAuthCookie(res, token) {
  // En Render (front y API en dominios distintos) hace falta SameSite=None + Secure
  const sameSite =
    process.env.COOKIE_SAMESITE === 'lax'
      ? 'lax'
      : env.nodeEnv === 'production'
        ? 'none'
        : 'lax'

  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production' || sameSite === 'none',
    sameSite,
    maxAge: env.jwtExpiresMs,
    path: '/',
  })
}

export function clearAuthCookie(res) {
  const sameSite =
    process.env.COOKIE_SAMESITE === 'lax'
      ? 'lax'
      : env.nodeEnv === 'production'
        ? 'none'
        : 'lax'

  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    secure: env.nodeEnv === 'production' || sameSite === 'none',
    sameSite,
    path: '/',
  })
}

export async function protect(req, _res, next) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      throw new AppError('No autorizado. Token requerido.', 401)
    }

    let payload
    try {
      payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] })
    } catch {
      throw new AppError('Token inválido o expirado.', 401)
    }

    const user = await User.findById(payload.id).select('-password')
    if (!user) {
      throw new AppError('Usuario no encontrado o sesión inválida.', 401)
    }

    if (user.role !== 'admin') {
      throw new AppError('No tienes permisos de administrador.', 403)
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    }
    next()
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('No autorizado.', 401))
  }
}
