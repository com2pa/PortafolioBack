import { Router } from 'express'
import { sendContact } from '../controllers/contact.controller.js'
import { contactLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

router.post('/', contactLimiter, sendContact)

export default router
