import express from 'express'
const router = express.Router()
import auth from '@/controlers/auth'
import authValidate from '@/middlewares/validations/auth'
import { authentication } from '@/middlewares/authentication.js'

// User
router.post('/register', authValidate.validateRegister, auth.registerUser)
router.post('/login', authValidate.validateLogin, auth.login)

router.use(authentication)
router.post('/refresh-token', auth.refreshToken)
router.post('/logout', auth.logout)

// Landlord
// router.post('/landlord/register', authValidate.validateLandlordRegister, auth.registerLandlord)
// router.post('/landlord/login', authValidate.validateLandlordLogin, auth.loginLandlord)

export default router
