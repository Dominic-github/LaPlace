import express from 'express'
const router = express.Router()
import videoReviewController from '@/controlers/videoReview'
import { authentication, checkPermission } from '@/middlewares/authentication.js'

// Public routes
router.get('/', videoReviewController.getAll)
router.get('/:slug', videoReviewController.getBySlug)

// Admin routes
router.use(authentication)
router.post('/', checkPermission(''), videoReviewController.create)
router.patch('/:video_id', checkPermission(''), videoReviewController.update)
router.delete('/:video_id', checkPermission(''), videoReviewController.remove)

export default router
