import * as authService from '../services/auth.service.js'
import {
  clearAuthCookie,
  setAuthCookie,
} from '../middleware/auth.middleware.js'
import { asyncHandler } from '../utils/helpers.js'

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body.email, req.body.password)
  setAuthCookie(res, result.token)
  res.json({ user: result.user })
})

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res)
  res.json({ ok: true })
})

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id)
  res.json({ user })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const result = await authService.updateProfile(req.user.id, req.body)
  setAuthCookie(res, result.token)
  res.json({ user: result.user })
})
