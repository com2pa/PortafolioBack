import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { env } from '../config/env.js'
import { AppError } from '../utils/helpers.js'
import {
  assertPasswordStrength,
  normalizeEmail,
  sanitizePersonName,
} from '../utils/validators.js'

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn, algorithm: 'HS256' },
  )
}

export async function loginUser(email, password) {
  if (!email || !password) {
    throw new AppError('Email y contraseña son requeridos.', 400)
  }

  const normalizedEmail = normalizeEmail(email)
  const user = await User.findOne({ email: normalizedEmail })
  if (!user) throw new AppError('Credenciales inválidas.', 401)

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new AppError('Credenciales inválidas.', 401)

  if (user.role !== 'admin') {
    throw new AppError('Credenciales inválidas.', 401)
  }

  return {
    token: signToken(user),
    user: user.toSafeJSON(),
  }
}

export async function getUserById(id) {
  const user = await User.findById(id).select('-password')
  if (!user) throw new AppError('Usuario no encontrado.', 404)
  return user.toSafeJSON()
}

export async function updateProfile(userId, payload = {}) {
  const { name, email, currentPassword, newPassword } = payload
  const user = await User.findById(userId)
  if (!user) throw new AppError('Usuario no encontrado.', 404)

  if (!currentPassword) {
    throw new AppError('Debes confirmar tu contraseña actual.', 400)
  }

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) throw new AppError('La contraseña actual es incorrecta.', 401)

  if (name !== undefined) {
    user.name = sanitizePersonName(name)
  }

  if (email !== undefined) {
    const nextEmail = normalizeEmail(email)
    const taken = await User.findOne({
      email: nextEmail,
      _id: { $ne: user._id },
    })
    if (taken) throw new AppError('Ese correo ya está en uso.', 409)
    user.email = nextEmail
  }

  if (newPassword) {
    assertPasswordStrength(newPassword, 'La nueva contraseña')
    user.password = await bcrypt.hash(String(newPassword), 10)
  }

  await user.save()

  return {
    token: signToken(user),
    user: user.toSafeJSON(),
  }
}
