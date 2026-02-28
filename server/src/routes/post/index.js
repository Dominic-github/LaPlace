import express from 'express'
const router = express.Router()
import postController from '@/controlers/post'
import { authentication, checkPermission } from '@/middlewares/authentication.js'

// Public routes
router.get('/', postController.getAllPosts)
router.get('/categories', postController.getCategories)
router.get('/:slug', postController.getPostBySlug)

// Admin routes
router.use(authentication)
router.post('/', checkPermission(''), postController.createPost)
router.patch('/:post_id', checkPermission(''), postController.updatePost)
router.delete('/:post_id', checkPermission(''), postController.deletePost)

export default router
