import express from 'express'
const router = express.Router()
import paymentController from '@/controlers/payment'
import { authentication } from '@/middlewares/authentication.js'

router.use(authentication)

export default router
