import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'
import userService from '@/services/user.js'

class UserController {
  getUserById = catchAsync(async (req, res) => {
    OK(
      res,
      'User fetched successfully',
      await userService.getUserById(req.params.user_id)
    )
  })

  createUser = catchAsync(async (req, res) => {
    CREATED(
      res,
      'User created successfully',
      await userService.createUser(req.body)
    )
  })

  updateUser = catchAsync(async (req, res) => {
    OK(res, 'User updated successfully', await userService.updateUser(req.body))
  })

  deleteUser = catchAsync(async (req, res) => {
    OK(
      res,
      'User deleted successfully',
      await userService.deleteUser(req.params.user_id)
    )
  })
  getAllUsers = catchAsync(async (req, res) => {
    OK(res, 'Users fetched successfully', await userService.getAllUsers())
  })
}
export default new UserController()
