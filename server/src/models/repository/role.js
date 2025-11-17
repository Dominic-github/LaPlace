import models from '@/models'
import { Api403Error } from '@/core/error'

const { roles, user_roles } = models

export const getRoleById = async (role_id) => {
  return await roles.findOne({ where: { role_id } })
}

export const getAllRoleFromUser = async (user_id, type) => {
  const user = await users.findOne({ where: { user_id } })
  if (!user) {
    throw new Api403Error('User not found')
  }
  const roles = await roles.findAll({
    where: { role_id: user.role_id, type: type }
  })
  if (!roles) {
    throw new Api403Error('Role not found')
  }
  return roles
}

export const createRoleUser = async ({ user_id, type }) => {
  const role_id = await getRoleIdFromName(type)
  return await user_roles.create({ user_id, role_id })
}

export const getUserRole = async (user_id) => {
  const userRole = await user_roles.findOne({
    where: { user_id }
  })

  if (!userRole) {
    throw new Api403Error('User role not found')
  }

  return await getRoleById(userRole.role_id)
}

export const getRoleIdFromName = async (name) => {
  const role = await roles.findOne({ where: { name } })

  if (!role) {
    throw new Api403Error('Role not found')
  }
  return role.role_id
}
