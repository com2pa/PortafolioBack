import { Router } from 'express'
import { login, logout, me, updateProfile } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { loginLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

router.post('/login', loginLimiter, login)
router.post('/logout', logout)
router.get('/me', protect, me)
router.put('/profile', protect, updateProfile)
router.patch('/profile', protect, updateProfile)

export default router
