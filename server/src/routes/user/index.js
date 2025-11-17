import { authentication } from '@/middlewares/authentication'
import express from 'express'
import user from '@/controlers/user'

const router = express.Router()

router.use(authentication)

// router.get('/:user_id', user.getUserById)

export default router
