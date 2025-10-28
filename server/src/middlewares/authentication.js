import catchAsync from '@/helpers/catchAsync.js'
import { Api403Error, Api404Error, Api401Error } from '../core/error.js'
import TokenService from '@/services/token.js'
import { URL_WHITELIST } from '@/config/index.js'
import { verifyJwt, extractToken, parseJwt } from '../helpers/jwt.js'

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  GUEST_ID: 'x-guest-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-refresh-token',
  BEARER: 'Bearer '
}

const ignoreWhiteList = (request) => {
  return URL_WHITELIST.includes(request.url)
}

export const authentication = catchAsync(async (req, res, next) => {
  if (ignoreWhiteList(req)) return next()

  const clientId = req.headers[HEADER.CLIENT_ID]
  const refreshToken = extractToken(
    (req.headers[HEADER.REFRESH_TOKEN] ?? '').toString()
  )
  const accessToken = extractToken(
    (req.headers[HEADER.AUTHORIZATION] ?? '').toString()
  )

  // 1. check user id
  const obj = parseJwt(accessToken || refreshToken)

  if (!obj.user_id) throw new Api403Error('Invalid request')

  // 2. check user id
  const user_id = clientId || obj.user_id
  if (!user_id) throw new Api403Error('Invalid request')

  // 2. check keyStore by user_id
  const keyStore = await TokenService.findTokenByUserId(user_id)
  if (!keyStore) throw new Api404Error('Resource not found')

  // 3. get refreshToken
  if (refreshToken && keyStore.private_key) {
    try {
      const decodeUser = verifyJwt(refreshToken, keyStore.private_key)

      if (user_id !== decodeUser.user_id) throw new Api401Error('Unauthorized')
      req.user = decodeUser
      req.keyStore = keyStore
      req.refreshToken = refreshToken

      return next()
    } catch (error) {
      throw new Api401Error('Unauthorized')
    }
  }

  // 3. get auth token
  if (!accessToken) throw new Api403Error('Invalid request')

  // 4.
  try {
    if (keyStore.public_key) {
      const decodeUser = verifyJwt(accessToken, keyStore.public_key)
      if (user_id !== decodeUser.user_id) throw new Api401Error('Unauthorized')

      req.user = decodeUser
      req.keyStore = keyStore
    }

    return next()
  } catch (error) {
    throw new Api401Error('Unauthorized')
  }
})
