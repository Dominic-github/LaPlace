import express from 'express'
const router = express.Router()
import statsController from '@/controlers/stats'

router.get('/overview', statsController.getOverview)

export default router
