import * as contentService from '../services/content.service.js'
import { asyncHandler } from '../utils/helpers.js'

export const getContent = asyncHandler(async (_req, res) => {
  const content = await contentService.getSiteContent()
  res.json(content)
})

export const updateContent = asyncHandler(async (req, res) => {
  const content = await contentService.updateSiteContent(req.body, req.file)
  res.json(content)
})
