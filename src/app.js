import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import path from 'path'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { uploadsDir } from './middleware/upload.middleware.js'
import { apiLimiter } from './middleware/rateLimit.middleware.js'
import { errorHandler, notFound } from './middleware/error.middleware.js'

export function createApp() {
  const app = express()

  app.set('trust proxy', 1)

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  )

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  )
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  app.use(
    '/uploads',
    (_req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Content-Disposition', 'inline')
      res.setHeader('X-Frame-Options', 'DENY')
      next()
    },
    express.static(uploadsDir, {
      setHeaders(res, filePath) {
        const ext = path.extname(filePath).toLowerCase()
        const types = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.webp': 'image/webp',
          '.gif': 'image/gif',
          '.pdf': 'application/pdf',
        }
        if (types[ext]) {
          res.setHeader('Content-Type', types[ext])
        }
        if (ext === '.pdf') {
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="${path.basename(filePath)}"`,
          )
        }
      },
      fallthrough: false,
    }),
  )

  app.use('/api', apiLimiter, routes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
