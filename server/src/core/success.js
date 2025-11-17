import { StatusCodes } from 'http-status-codes'
import { Response } from 'express'

class SuccessResponse {
  constructor(message, status = StatusCodes.OK, data = {}, options = {}) {
    this.message = message
    this.status = status
    this.data = data
    this.options = options
  }

  send(res) {
    return res.status(this.status).json(this)
  }
}

class Ok extends SuccessResponse {
  constructor(message, data, options = {}) {
    const status = StatusCodes.OK
    super(message, status, data, options)
  }
}

class Updated extends SuccessResponse {
  constructor(message, data = {}, options = {}) {
    const status = StatusCodes.OK
    super(message, status, data, options)
  }
}

class Create extends SuccessResponse {
  constructor(message, data = {}, options = {}) {
    const status = StatusCodes.CREATED
    super(message, status, data, options)
  }
}

export const CREATED = (res, message, data, options = {}) => {
  new Create(message, data, options).send(res)
}

export const UPDATED = (res, message, data, options = {}) => {
  new Updated(message, data, options).send(res)
}

export const OK = (res, message, data, options = {}) => {
  new Ok(message, data, options).send(res)
}
