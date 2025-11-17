import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'
import authService from '@/services/auth.js'

class AuthController {
  registerUser = catchAsync(async (req, res) => {
    CREATED(
      res,
      'User registered successfully',
      await authService.register(req.body)
    )
  })

  login = catchAsync(async (req, res) => {
    OK(res, 'User logged in successfully', await authService.login(req.body))
  })

  refreshToken = catchAsync(async (req, res) => {
    OK(
      res,
      'Token refreshed successfully',
      await authService.refreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    )
  })

  logout = catchAsync(async (req, res) => {
    OK(
      res,
      'User logged out successfully',
      await authService.logout(req.user.user_id)
    )
  })
}
export default new AuthController()
