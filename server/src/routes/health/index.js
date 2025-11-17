import express from 'express'
import { checkDBConnection } from '@/database/connect.js'

const router = express.Router()

// health check application
router.get('/', async (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: (await checkDBConnection()) ? 'Connected' : 'Disconnected'
  })
})

export default router
