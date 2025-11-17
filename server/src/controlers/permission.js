import catchAsync from '../helpers/catchAsync.js'
import permissionService from '@/services/permission.js'
import { CREATED, OK } from '@/core/success.js'

class PermissionController {
  getAllPermissionsByRole = catchAsync(async (req, res) => {
    OK(
      res,
      'User fetched successfully',
      await permissionService.getAllPermissionsByRole(req.params.role_id)
    )
  })

  getAllPermissions = catchAsync(async (req, res) => {
    OK(
      res,
      'Permissions fetched successfully',
      await permissionService.getAllPermissions()
    )
  })
}
export default new PermissionController()
