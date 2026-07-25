import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { AppError } from '../utils/helpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const uploadsDir = path.join(__dirname, '../../uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const IMAGE_MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

const PDF_MIME = 'application/pdf'

function safeImageExt(mimetype) {
  return IMAGE_MIME_TO_EXT[mimetype] || null
}

function matchesMagic(buffer, signatures) {
  return signatures.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte),
  )
}

function isJpeg(buf) {
  return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
}

function isPng(buf) {
  return matchesMagic(buf, [
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  ])
}

function isGif(buf) {
  const header = buf.slice(0, 6).toString('ascii')
  return header === 'GIF87a' || header === 'GIF89a'
}

function isWebp(buf) {
  if (buf.length < 12) return false
  return (
    buf.slice(0, 4).toString('ascii') === 'RIFF' &&
    buf.slice(8, 12).toString('ascii') === 'WEBP'
  )
}

function isPdf(buf) {
  return buf.slice(0, 4).toString('ascii') === '%PDF'
}

function verifyImageMagic(filePath, mimetype) {
  const fd = fs.openSync(filePath, 'r')
  const buf = Buffer.alloc(16)
  try {
    fs.readSync(fd, buf, 0, 16, 0)
  } finally {
    fs.closeSync(fd)
  }

  switch (mimetype) {
    case 'image/jpeg':
      return isJpeg(buf)
    case 'image/png':
      return isPng(buf)
    case 'image/gif':
      return isGif(buf)
    case 'image/webp':
      return isWebp(buf)
    default:
      return false
  }
}

function verifyPdfMagic(filePath) {
  const fd = fs.openSync(filePath, 'r')
  const buf = Buffer.alloc(5)
  try {
    fs.readSync(fd, buf, 0, 5, 0)
  } finally {
    fs.closeSync(fd)
  }
  return isPdf(buf)
}

function unlinkQuiet(filePath) {
  try {
    fs.unlinkSync(filePath)
  } catch {
    /* ignore */
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext =
      file.mimetype === PDF_MIME
        ? '.pdf'
        : safeImageExt(file.mimetype) || '.bin'
    cb(null, `${unique}${ext}`)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) => {
    if (!safeImageExt(file.mimetype)) {
      return cb(new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF'))
    }
    cb(null, true)
  },
})

export const uploadCvPdf = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== PDF_MIME) {
      return cb(new Error('Solo se permite un archivo PDF'))
    }
    cb(null, true)
  },
})

/** Tras multer: valida magic bytes y elimina archivos inválidos. */
export function validateUploadedFiles(kind = 'image') {
  return (req, _res, next) => {
    const files = []
    if (req.file) files.push(req.file)
    if (Array.isArray(req.files)) files.push(...req.files)

    try {
      for (const file of files) {
        const fullPath = path.join(uploadsDir, file.filename)
        const ok =
          kind === 'pdf'
            ? file.mimetype === PDF_MIME && verifyPdfMagic(fullPath)
            : Boolean(safeImageExt(file.mimetype)) &&
              verifyImageMagic(fullPath, file.mimetype)

        if (!ok) {
          unlinkQuiet(fullPath)
          throw new AppError('Archivo rechazado: contenido no válido.', 400)
        }
      }
      next()
    } catch (error) {
      for (const file of files) {
        unlinkQuiet(path.join(uploadsDir, file.filename))
      }
      next(error instanceof AppError ? error : new AppError(error.message, 400))
    }
  }
}
