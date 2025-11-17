import express from 'express'
const router = express.Router()
import authController from '@/controlers/auth'
import authValidate from '@/middlewares/validations/auth'
import { authentication } from '@/middlewares/authentication.js'

// User
router.post('/register', authValidate.validateRegister, authController.register)
router.post('/login', authValidate.validateLogin, authController.login)

router.use(authentication)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', authController.logout)

export default router
