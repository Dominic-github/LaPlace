import express from 'express'
import health from './health/index.js'
import auth from './auth/index.js'
import user from './user/index.js'
import role from './role/index.js'
import permission from './permission/index.js'
import accommodation from './accommodation/index.js'
import payment from './payment/index.js'

const router = express.Router()

// health check application
router.use('/health', health)

// api
router.use('/api/auth', auth)
router.use('/api/user', user)
router.use('/api/role', role)
router.use('/api/permission', permission)
router.use('/api/accommodation', accommodation)
router.use('/api/payment', payment)

export default router
