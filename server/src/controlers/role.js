import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'
import roleService from '@/services/role.js'

class RoleController {
  getAllRoles = catchAsync(async (req, res) => {
    OK(res, 'User fetched successfully', await roleService.getAllRoles())
  })
  getAllRolesFromUser = catchAsync(async (req, res) => {
    OK(
      res,
      'User roles fetched successfully',
      await roleService.getAllRolesFromUser(req.params.user_id)
    )
  })
  createRoleUser = catchAsync(async (req, res) => {
    CREATED(
      res,
      'Role user created successfully',
      await roleService.createRoleUser(req.body)
    )
  })
}
export default new RoleController()
