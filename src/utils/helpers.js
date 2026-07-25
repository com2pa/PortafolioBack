export class AppError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
    this.name = 'AppError'
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export function parseStack(category = '') {
  return String(category)
    .split(/[,|/]/)
    .map((item) => item.trim())
    .filter(Boolean)
}
