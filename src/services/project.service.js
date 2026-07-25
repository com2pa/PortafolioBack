import { Project } from '../models/Project.js'
import { AppError, parseStack } from '../utils/helpers.js'
import {
  assertSafeHttpUrl,
  assertSafeImageRef,
} from '../utils/validators.js'

function parseExistingImages(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.filter(Boolean)
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return String(raw)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
}

function sanitizeImages(list = []) {
  return list
    .map((item) => {
      try {
        return assertSafeImageRef(item)
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

function filesToUrls(files = []) {
  return files.map((file) => `/uploads/${file.filename}`)
}

export async function listProjects() {
  const projects = await Project.find().sort({ createdAt: -1 })
  return projects.map((project) => {
    const doc = project.toObject()
    if (!doc.images?.length && doc.imageUrl) {
      doc.images = [doc.imageUrl]
    }
    return doc
  })
}

export async function getProjectById(id) {
  const project = await Project.findById(id)
  if (!project) throw new AppError('Proyecto no encontrado.', 404)
  if (!project.images?.length && project.imageUrl) {
    project.images = [project.imageUrl]
  }
  return project
}

export async function createProject(payload, uploadedFiles = []) {
  const { title, category, description, demoUrl } = payload
  const existingImages = sanitizeImages(
    parseExistingImages(payload.existingImages || payload.images),
  )
  const uploaded = filesToUrls(uploadedFiles)
  const images = [...existingImages, ...uploaded]

  if (!title || !category || !description || !demoUrl) {
    throw new AppError('Faltan campos obligatorios.', 400)
  }

  if (!images.length) {
    throw new AppError('Debes subir o indicar al menos una imagen.', 400)
  }

  const safeDemoUrl = assertSafeHttpUrl(demoUrl, 'URL demo')

  return Project.create({
    title: String(title).trim().slice(0, 200),
    category: String(category).trim().slice(0, 120),
    description: String(description).trim().slice(0, 5000),
    images,
    imageUrl: images[0],
    demoUrl: safeDemoUrl,
    stack: parseStack(category),
  })
}

export async function updateProject(id, payload, uploadedFiles = []) {
  const project = await getProjectById(id)
  const { title, category, description, demoUrl } = payload

  if (title !== undefined) project.title = String(title).trim().slice(0, 200)
  if (category !== undefined) {
    project.category = String(category).trim().slice(0, 120)
    project.stack = parseStack(category)
  }
  if (description !== undefined) {
    project.description = String(description).trim().slice(0, 5000)
  }
  if (demoUrl !== undefined) {
    project.demoUrl = assertSafeHttpUrl(demoUrl, 'URL demo')
  }

  const keptImages = sanitizeImages(parseExistingImages(payload.existingImages))
  const uploaded = filesToUrls(uploadedFiles)
  const nextImages = [...keptImages, ...uploaded]

  if (nextImages.length) {
    project.images = nextImages
    project.imageUrl = nextImages[0]
  } else if (!project.images?.length) {
    throw new AppError('El proyecto debe conservar al menos una imagen.', 400)
  }

  await project.save()
  return project
}

export async function removeProject(id) {
  const project = await Project.findByIdAndDelete(id)
  if (!project) throw new AppError('Proyecto no encontrado.', 404)
  return project
}
