import { Api403Error } from '@/core/error'
import models from '@/models'
import crypto from 'crypto'
const { tokens, refresh_tokens_used } = models
import { verifyJwt } from '@/helpers/jwt'

class TokenService {
  createKey = async () => {
    // create private key, public key
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    })

    return { publicKey, privateKey }
  }

  createKeyToken = async ({ user_id, publicKey, privateKey, refreshToken }) => {
    try {
      const token = await tokens.upsert({
        user_id,
        public_key: publicKey,
        private_key: privateKey,
        refresh_token: refreshToken
      })
      return token ? token.public_key : null
    } catch (error) {
      throw new Api403Error('Account unauthorized')
    }
  }

  addRefreshTokenUsed = async ({ user_id, token }) => {
    return await refresh_tokens_used.create({ user_id, token })
  }

  updateTokenByUserId = async ({
    user_id,
    public_key,
    private_key,
    refresh_token
  }) => {
    return await tokens.update(
      {
        user_id,
        public_key,
        private_key,
        refresh_token
      },
      { where: { user_id } }
    )
  }

  findTokenByUserId = async (user_id) => {
    return await tokens.findOne({ where: { user_id } })
  }

  findTokenByRefreshTokenUsed = async (user_id, refreshToken) => {
    if (!refreshToken) return null
    const token = await refresh_tokens_used.findOne({
      where: { user_id, token: refreshToken }
    })
    return token
  }

  findTokenByRefreshToken = async (refreshToken) => {
    return await tokens.findOne({ where: { refresh_token: refreshToken } })
  }

  deleteTokenById = async (user_id) => {
    return await tokens.destroy({ where: { user_id } })
  }

  verifyRefreshToken = async (refreshToken, keySecret) => {
    return verifyJwt(refreshToken, keySecret)
  }
}

export default new TokenService()
