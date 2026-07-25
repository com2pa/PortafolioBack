import { AppError } from '../utils/helpers.js'

export function notFound(_req, _res, next) {
  next(new AppError('Ruta no encontrada.', 404))
}

export function errorHandler(err, _req, res, _next) {
  if (err?.name === 'MulterError') {
    return res.status(400).json({
      message:
        err.code === 'LIMIT_FILE_SIZE'
          ? 'El archivo supera el tamaño permitido.'
          : 'Error al subir el archivo.',
    })
  }

  if (
    typeof err?.message === 'string' &&
    (err.message.startsWith('Solo se permiten') ||
      err.message.startsWith('Solo se permite'))
  ) {
    return res.status(400).json({ message: err.message })
  }

  const status = err.status || 500
  const message =
    err instanceof AppError || status < 500
      ? err.message
      : 'Error interno del servidor'

  if (status >= 500) console.error(err)

  res.status(status).json({ message })
}
