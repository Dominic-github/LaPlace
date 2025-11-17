import models from '@/models'
const { users } = models

export const findUserByEmail = async (email) => {
  return await users.findOne({ where: { email } })
}

export const findUserById = async (user_id) => {
  const user = await users.findByPk(user_id)
  if (!user) {
    return null
  }
  return user
}
