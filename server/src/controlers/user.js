import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'

class UserController {
  getUser = catchAsync(async (req, res) => {
    OK(res, 'User fetched successfully', await req.user)
  })
  createUser = catchAsync(async (req, res) => {
    CREATED(res, 'User created successfully', await req.user)
  })
  updateUser = catchAsync(async (req, res) => {
    OK(res, 'User updated successfully', await req.user)
  })
  deleteUser = catchAsync(async (req, res) => {
    OK(res, 'User deleted successfully', await req.user)
  })
}
export default new UserController()
