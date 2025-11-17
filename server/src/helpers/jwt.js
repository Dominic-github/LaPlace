import JWT from 'jsonwebtoken'
// import { VerifyErrors } from 'jsonwebtoken'

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-refresh-token',
  BEARER: 'Bearer '
}

export const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // auth token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1 days'
    })

    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days'
    })

    // verify key
    verifyJwt(accessToken, publicKey)

    return {
      accessToken,
      refreshToken
    }
  } catch (error) {
    console.error(`createTokenPair error:: `, error)
  }
}

/**
 * This module used for verify jwt token
 * @param {*} token
 * @param {*} keySecret
 */
export const verifyJwt = (token, keySecret) => {
  try {
    return JWT.verify(token, keySecret)
  } catch (err) {
    console.error('Verify error:', err)
    return null
  }
}

export const extractToken = (tokenHeader) => {
  if (!tokenHeader) return ''
  return tokenHeader.replace(HEADER.BEARER, '')
}

export const parseJwt = (token) => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}
