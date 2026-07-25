import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
  },
  { _id: false },
)

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'main' },
    about: {
      title: { type: String, default: 'Sobre mí' },
      lead: { type: String, default: '' },
      cards: { type: [cardSchema], default: [] },
    },
    cv: {
      title: { type: String, default: 'Mi CV' },
      lead: { type: String, default: '' },
      name: { type: String, default: 'Merwil Vegas' },
      role: { type: String, default: 'Ingeniero en Informática' },
      profile: { type: String, default: '' },
      skills: { type: [String], default: [] },
      downloadNote: { type: String, default: '' },
      fileContent: { type: String, default: '' },
      pdfUrl: { type: String, default: '' },
      pdfName: { type: String, default: '' },
    },
    contact: {
      title: { type: String, default: 'Hablemos' },
      lead: { type: String, default: '' },
      linkedinUrl: { type: String, default: 'https://www.linkedin.com' },
      youtubeUrl: { type: String, default: 'https://www.youtube.com' },
    },
  },
  { timestamps: true },
)

export const SiteContent = mongoose.model('SiteContent', siteContentSchema)
