import {
  BaseError,
  BusinessLogicError,
  Api401Error,
  Api403Error
} from '@/core/error'

export const logError = (error) => {
  console.log('Error', error)
}

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.status || 500
  let error
  if (err instanceof BaseError) {
    error = handleError(err)
  } else {
    error = { ...err }
    if (err.name === 'CastError') error = handleCastErrorDB(err)
    if (err.name === 'JsonWebTokenError') error = handlerJWTError(err)
    if (err.name === 'TokenExpiredError') error = handlerJWTExpiredError(err)
  }
  return res.status(statusCode).json({
    status: statusCode,
    message: error.message || 'Internal server error',
    errors: error.errors
  })
}

export const isOperationalError = (error) => {
  if (error instanceof BaseError) {
    return error.isOperational
  }
  return false
}

const handleError = (err) => {
  const error = {}
  if (err instanceof BaseError) {
    error.name = err.name
    error.statusCode = err.status
    error.isOperational = err.isOperational
    error.message = err.message
    error.errors = err.errors
  }
  return error
}

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}.`
  return new BusinessLogicError(message)
}

const handlerJWTError = (error) => {
  console.error(error)
  const message = `Invalid token. Please login again!`
  return new Api401Error(message)
}

const handlerJWTExpiredError = (error) => {
  console.error(error)
  const message = `Your token has expired! Please log in again.`
  return new Api403Error(message)
}
