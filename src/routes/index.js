import { Router } from 'express'
import authRoutes from './auth.routes.js'
import projectRoutes from './project.routes.js'
import contentRoutes from './content.routes.js'
import contactRoutes from './contact.routes.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'portafolio-api' })
})

router.use('/auth', authRoutes)
router.use('/projects', projectRoutes)
router.use('/content', contentRoutes)
router.use('/contact', contactRoutes)

export default router
