export const globalErrHandler = (err, req, res, next) => {
  const stack = err?.stack
  const statusCode = err?.statusCode ? err?.statusCode : 500
  const message = err?.message

  res.status(statusCode).json({
    statusCode,
    message,
    stack,
  })
}

// notfound error handler 404

export const notFound = (req, res, next) => {
  const error = new Error(`Route - ${req.originalUrl} not found`)
  res.status(404)
  next(error)
}
