import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import 'dotenv/config'

export class BaseError extends Error {
  constructor(message, status, errors, isOperational) {
    super(message)
    // if (process.env.NODE_ENV === 'production') {
    //   Object.setPrototypeOf(this, new.target.prototype)
    //   Error.captureStackTrace(this, this.constructor)
    // }
    this.status = status
    this.errors = errors
    this.isOperational = isOperational
  }

  static handle(error, res) {
    if (error instanceof BaseError) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
        statusCode: error.status,
        errors: error.errors
      })
    }

    console.error('Unhandled error:', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}

export class Api409Error extends BaseError {
  constructor(
    message = ReasonPhrases.CONFLICT,
    errors = [],
    status = StatusCodes.CONFLICT,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}

export class Api403Error extends BaseError {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    errors = [],
    status = StatusCodes.FORBIDDEN,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}

export class Api401Error extends BaseError {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    errors = [],
    status = StatusCodes.UNAUTHORIZED,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}

export class BusinessLogicError extends BaseError {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    errors = [],
    status = StatusCodes.BAD_REQUEST,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}

export class Api404Error extends BaseError {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    errors = [],
    status = StatusCodes.NOT_FOUND,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}

export class Api422Error extends BaseError {
  constructor(
    message = ReasonPhrases.UNPROCESSABLE_ENTITY,
    errors = [],
    status = StatusCodes.UNPROCESSABLE_ENTITY,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}
