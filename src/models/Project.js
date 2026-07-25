import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: {
      type: [{ type: String, trim: true }],
      default: [],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'Se requiere al menos una imagen',
      },
    },
    /** @deprecated usar images[0]; se mantiene por compatibilidad */
    imageUrl: { type: String, trim: true, default: '' },
    demoUrl: { type: String, required: true, trim: true },
    stack: [{ type: String, trim: true }],
  },
  { timestamps: true },
)

projectSchema.pre('validate', function syncCover(next) {
  if (this.images?.length) {
    this.imageUrl = this.images[0]
  } else if (this.imageUrl && (!this.images || this.images.length === 0)) {
    this.images = [this.imageUrl]
  }
  next()
})

export const Project = mongoose.model('Project', projectSchema)
