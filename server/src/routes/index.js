import express from 'express'
import health from './health/index.js'
import auth from './auth/index.js'
import user from './user/index.js'
import role from './role/index.js'
import permission from './permission/index.js'
import accommodation from './accommodation/index.js'
import payment from './payment/index.js'
import setting from './setting/index.js'
import post from './post/index.js'
import videoReview from './videoReview/index.js'
import location from './location/index.js'
import stats from './stats/index.js'
import staticPage from './staticPage/index.js'

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
router.use('/api/settings', setting)
router.use('/api/posts', post)
router.use('/api/video-reviews', videoReview)
router.use('/api/locations', location)
router.use('/api/stats', stats)
router.use('/api/static-pages', staticPage)

export default router

