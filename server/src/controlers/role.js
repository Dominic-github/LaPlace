import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'
import roleService from '@/services/role.js'

class RoleController {
  getAllRoles = catchAsync(async (req, res) => {
    OK(res, 'User fetched successfully', await roleService.getAllRoles())
  })
}
export default new RoleController()
