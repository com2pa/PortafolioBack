import { Router } from 'express'
import { getContent, updateContent } from '../controllers/content.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import {
  uploadCvPdf,
  validateUploadedFiles,
} from '../middleware/upload.middleware.js'

const router = Router()

router.get('/', getContent)
router.get('/main', getContent)

const withPdf = [
  protect,
  uploadCvPdf.single('pdf'),
  validateUploadedFiles('pdf'),
  updateContent,
]

router.put('/', ...withPdf)
router.put('/main', ...withPdf)
router.patch('/', ...withPdf)
router.patch('/main', ...withPdf)

export default router
