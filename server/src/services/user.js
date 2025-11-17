import models from '@/models'
const { users } = models

import { findUserById, findUserByEmail } from '@/models/repository/user'

class UserService {
  createUser = async ({ email, fullname, password }) => {
    const findUser = await findUserByEmail(email)
    if (findUser) {
      throw new Error('User already exists')
    }

    return users.create({ email, fullname, password })
  }
  getUserById = async (user_id) => {
    const findUser = users.findOne(
      { where: { user_id } },
      { attributes: { exclude: ['password'] } }
    )
    if (!findUser) {
      throw new Error('User not found')
    }
    return findUser
  }
  updateUser = async (user_id, data) => {
    const findUser = await findUserById(user_id)
    if (!findUser) {
      throw new Error('User not found')
    }
    return users.update(data, { where: { user_id } })
  }
  deleteUser = async (user_id) => {
    const findUser = await findUserById(user_id)
    if (!findUser) {
      throw new Error('User not found')
    }
    const updatedUser = users.update({ status: '' }, { where: { user_id } })

    return updatedUser
  }
}

export default new UserService()
