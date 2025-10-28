import express from 'express'
import health from './health/index.js'
import auth from './auth/index.js'
// import user from './user/index.js'

const router = express.Router()

// health check application
router.use('/health', health)

// // api
router.use('/api/auth', auth)
// router.use('/api/user', user)

export default router
