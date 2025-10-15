import crypto from 'crypto'

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

  createKeyToken = async ({
    user_id,
    publicKey,
    privateKey,
    refreshToken
  }) => {}

  findTokenByUserId = async (user_id) => {}

  findTokenByRefreshTokenUsed = async (refreshToken) => {
    return a
  }

  findTokenByRefreshToken = async (refreshToken) => {}

  deleteTokenById = async (user_id) => {}
}

export default new TokenService()
