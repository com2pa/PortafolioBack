import { SiteContent } from '../models/SiteContent.js'
import { DEFAULT_SITE_CONTENT } from '../seed/defaultContent.js'
import { assertOptionalSafeHttpUrl } from '../utils/validators.js'

function parseMaybeJson(value) {
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function safePdfDisplayName(original = '') {
  const cleaned = String(original)
    .replace(/[^\w.\- ()áéíóúÁÉÍÓÚñÑ]/gi, '')
    .trim()
    .slice(0, 120)
  return cleaned || 'cv.pdf'
}

export async function getSiteContent() {
  let content = await SiteContent.findOne({ key: 'main' })
  if (!content) {
    content = await SiteContent.create(DEFAULT_SITE_CONTENT)
  }
  return content
}

export async function updateSiteContent(payload = {}, uploadedPdf) {
  const content = await getSiteContent()
  const body = { ...payload }

  if (typeof body.cv === 'string') {
    body.cv = parseMaybeJson(body.cv)
  }

  if (body.about) {
    const about = parseMaybeJson(body.about) || {}
    if (about.title !== undefined) content.about.title = about.title
    if (about.lead !== undefined) content.about.lead = about.lead
    if (about.cards !== undefined) content.about.cards = about.cards
  }

  if (body.cv) {
    const cv = parseMaybeJson(body.cv) || {}
    if (cv.title !== undefined) content.cv.title = cv.title
    if (cv.lead !== undefined) content.cv.lead = cv.lead
    if (cv.name !== undefined) content.cv.name = cv.name
    if (cv.role !== undefined) content.cv.role = cv.role
    if (cv.profile !== undefined) content.cv.profile = cv.profile
    if (cv.skills !== undefined) {
      content.cv.skills = Array.isArray(cv.skills)
        ? cv.skills
        : String(cv.skills)
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
    }
    if (cv.downloadNote !== undefined) content.cv.downloadNote = cv.downloadNote
    if (cv.fileContent !== undefined) {
      content.cv.fileContent = String(cv.fileContent).slice(0, 50_000)
    }
  }

  if (uploadedPdf) {
    content.cv.pdfUrl = `/uploads/${uploadedPdf.filename}`
    content.cv.pdfName = safePdfDisplayName(uploadedPdf.originalname)
  }

  if (body.contact) {
    const contact = parseMaybeJson(body.contact) || {}
    if (contact.title !== undefined) content.contact.title = contact.title
    if (contact.lead !== undefined) content.contact.lead = contact.lead
    if (contact.linkedinUrl !== undefined) {
      content.contact.linkedinUrl = assertOptionalSafeHttpUrl(
        contact.linkedinUrl,
        'LinkedIn',
      )
    }
    if (contact.youtubeUrl !== undefined) {
      content.contact.youtubeUrl = assertOptionalSafeHttpUrl(
        contact.youtubeUrl,
        'YouTube',
      )
    }
  }

  await content.save()
  return content
}
