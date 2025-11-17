import models from '@/models'
import { getAllRoleFromUser, getRoleIdFromName } from '@/models/repository/role'
import { Api403Error } from '@/core/error'

const { roles, user_roles } = models

class RoleService {
  getAllRoles = async () => {
    return await roles.findAll()
  }

  getAllRolesFromUser = async (user_id) => {
    return await getAllRoleFromUser(user_id)
  }

  createRoleUser = async ({ user_id, type }) => {
    const roleId = await getRoleIdFromName(type)
    if (!roleId) {
      throw new Api403Error('Error role')
    }
    return await user_roles.create({ user_id, role_id: roleId })
  }
}

export default new RoleService()
