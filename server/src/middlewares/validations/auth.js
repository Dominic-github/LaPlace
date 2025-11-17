import catchAsync from '@/helpers/catchAsync'
import { Api422Error } from '@/core/error'
import joi from 'joi'

const registerSchema = joi.object({
  fullname: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  type: joi.string().valid('user', 'landlord', 'admin', 'broker')
})

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  type: joi.string().valid('user', 'landlord', 'admin', 'broker')
})

const validateRegister = catchAsync(async (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body)
  if (error) {
    throw new Api422Error('Validation Error', error.details)
  }
  next()
})

const validateLogin = catchAsync(async (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body)
  if (error) {
    throw new Api422Error('Validation Error', error.details)
  }
  next()
})

export default {
  validateRegister,
  validateLogin
}
