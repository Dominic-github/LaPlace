import models from '@/models'
import { getRoleId } from '@/models/repository/role'

const { permissions, role_permissions } = models

class PermissionService {
  getAllPermissions = async () => {
    return await permissions.findAll()
  }

  createPermission = async ({ name, description }) => {
    return await permissions.create({ name, description })
  }

  addPermissionsToRole = async (type, permissions) => {
    const role_id = await getRoleId(type)

    const rolePermissions = permissions.map((permission_id) => ({
      role_id,
      permission_id
    }))
    return await role_permissions.bulkCreate(rolePermissions)
  }

  getAllPermissionsByRole = async (role_id) => {
    const permissionIds = await role_permissions.findAll({
      where: { role_id },
      attributes: ['permission_id']
    })

    const permissionIdList = permissionIds.map((rp) => rp.permission_id)

    return await permissions.findAll({
      where: { permission_id: permissionIdList }
    })
  }

  removePermissionFromRole = async (role_id, permission_id) => {
    return await role_permissions.destroy({
      where: { role_id, permission_id }
    })
  }
}
export default new PermissionService()
