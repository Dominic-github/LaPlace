import express from 'express'

const router = express.Router()

// health check application
router.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' })
})

export default router
