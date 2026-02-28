import express from 'express'
import {
  getStaticPages,
  getStaticPageById,
  getStaticPageBySlug,
  createStaticPage,
  updateStaticPage,
  deleteStaticPage
} from '../../controlers/staticPageController.js'
import { authentication as authMidleware } from '../../middlewares/authentication.js'

const router = express.Router()

// Client routes
router.get('/slug/:slug', getStaticPageBySlug)

// Admin CRUD routes
router.get('/', getStaticPages)
router.get('/:id', getStaticPageById)
router.post('/', authMidleware, createStaticPage)
router.patch('/:id', authMidleware, updateStaticPage)
router.delete('/:id', authMidleware, deleteStaticPage)

export default router
