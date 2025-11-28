import models from '@/models'
import { Api403Error } from '@/core/error'
import bcrypt from 'bcrypt'
import TokenService from '@/services/token'
import EmailService from '@/services/email'
import { createTokenPair } from '@/helpers/jwt'
import { findUserByEmail } from '@/models/repository/user'
import { createRoleUser } from '@/models/repository/role'
const { users } = models
class AuthService {
  register = async ({ fullname, email, password, type = 'user' }) => {
    const userExist = await findUserByEmail(email)
    if (userExist) {
      throw new Api403Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await users.create({
      fullname: fullname,
      email: email,
      password: hashedPassword
    })

    const { publicKey, privateKey } = await TokenService.createKey()
    const tokens = await createTokenPair(
      {
        user_id: newUser.user_id,
        email: email
      },
      publicKey,
      privateKey
    )

    const findUser = await users.findOne({
      where: { user_id: newUser.user_id },
      attributes: { exclude: ['password'] }
    })

    if (!findUser) {
      throw new Api403Error('User not found after registration')
    }

    await createRoleUser({ user_id: newUser.user_id, type })

    return {
      user: findUser,
      role: type,
      tokens
    }
  }

  login = async ({ email, password, type = 'user' }) => {
    const user = await users.findOne({ where: { email: email } })
    if (!user) {
      throw new Api403Error('Invalid email or password')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw new Api403Error('Invalid email or password')
    }
    delete user.password

    const { publicKey, privateKey } = await TokenService.createKey()

    const user_id = user.user_id
    const tokens = await createTokenPair(
      {
        user_id: user_id,
        email: email
      },
      publicKey,
      privateKey
    )

    if (!tokens) throw new Api403Error('Create token pair failed')

    await TokenService.createKeyToken({
      user_id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    return {
      user,
      role: type,
      tokens
    }
  }

  logout = async (user_id) => {
    const findUser = await users.findOne({
      where: { user_id: user_id },
      attributes: { exclude: ['password'] }
    })

    if (!findUser) {
      throw new Api403Error('User not found')
    }

    refre

    const delKey = await TokenService.deleteTokenById(user_id)
    if (delKey === 1) {
      return findUser
    }
    throw new Api403Error('Logout failed')
  }

  refreshToken = async ({ refreshToken, user, keyStore }) => {
    const existingToken = await TokenService.findTokenByRefreshTokenUsed(
      user.user_id,
      refreshToken
    )

    if (existingToken) {
      throw new Api403Error('Something went wrong. Please login again')
    }

    if (!keyStore || keyStore.refresh_token !== refreshToken) {
      throw new Api403Error('Invalid Authentication')
    }

    try {
      await TokenService.verifyRefreshToken(refreshToken, keyStore.private_key)
    } catch (err) {
      throw new Api403Error('Invalid or expired refresh token')
    }

    const findUser = await users.findOne({
      where: { user_id: user.user_id },
      attributes: { exclude: ['password'] }
    })

    if (!findUser) {
      throw new Api403Error('User not found')
    }

    const newToken = await createTokenPair(
      {
        user_id: findUser.user_id,
        email: findUser.email
      },
      keyStore.public_key,
      keyStore.private_key
    )

    if (!newToken) throw new Api403Error('Create token pair failed')

    await TokenService.addRefreshTokenUsed({
      user_id: findUser.user_id,
      token: refreshToken
    })

    await TokenService.updateTokenByUserId({
      user_id: findUser.user_id,
      public_key: keyStore.public_key,
      private_key: keyStore.private_key,
      refresh_token: newToken.refreshToken
    })

    return {
      user: findUser,
      tokens: newToken
    }
  }

  forgetPassword = async ({ email }) => {
    if (!email) {
      throw new Api403Error('Email is required')
    }

    const user = await users.findOne({
      where: { email }
    })

    if (!user) {
      throw new Api403Error('User with this email not found')
    }
    

    const email = await new EmailService({
      from: from,
      to: email,
      name: email,
      type: ''
    }).sendForgetPasswordMail({
      to: email,
      name: user.fullname || user.email,
    })

    return {
      message: 'Reset password instructions have been sent to your email.'
    }
  }
}

export default new AuthService()
