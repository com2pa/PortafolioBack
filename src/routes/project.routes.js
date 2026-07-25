import { Router } from 'express'
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from '../controllers/project.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import {
  upload,
  validateUploadedFiles,
} from '../middleware/upload.middleware.js'

const router = Router()

router.get('/', getProjects)
router.get('/:id', getProject)
router.post(
  '/',
  protect,
  upload.array('images', 12),
  validateUploadedFiles('image'),
  createProject,
)
router.put(
  '/:id',
  protect,
  upload.array('images', 12),
  validateUploadedFiles('image'),
  updateProject,
)
router.delete('/:id', protect, deleteProject)

export default router
