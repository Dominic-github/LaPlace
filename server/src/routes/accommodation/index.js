import express from 'express'
const router = express.Router()
import accommodation from '@/controlers/accommodation'
import { authentication } from '@/middlewares/authentication.js'

router.use(authentication)
// router.post('/create', accommodation.createAccommodation)

export default router
