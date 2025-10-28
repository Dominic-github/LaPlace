import express from 'express'
import { authentication } from '@/middlewares/authentication.js'
const router = express.Router()

router.use(authentication)

export default router
