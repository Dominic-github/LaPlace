import catchAsync from '../helpers/catchAsync.js'
import { OK } from '@/core/success.js'
import models from '@/models'

const sequelize = models.sequelize

class StatsController {
  getOverview = catchAsync(async (req, res) => {
    const [[accResult]] = await sequelize.query(
      `SELECT COUNT(*) as total FROM accommodations WHERE status = 'active'`
    )
    const [[provinceResult]] = await sequelize.query(
      `SELECT COUNT(DISTINCT province_code) as total FROM accommodations WHERE status = 'active' AND province_code IS NOT NULL`
    )
    const [[reviewResult]] = await sequelize.query(
      `SELECT AVG(ratting) as avg_rating, COUNT(*) as total FROM reviews`
    )
    const [[userResult]] = await sequelize.query(
      `SELECT COUNT(*) as total FROM users WHERE status = 'active'`
    )

    OK(res, 'Stats fetched successfully', {
      total_accommodations: parseInt(accResult.total) || 0,
      total_provinces: parseInt(provinceResult.total) || 0,
      total_users: parseInt(userResult.total) || 0,
      avg_rating: parseFloat(reviewResult.avg_rating || 0).toFixed(1),
      total_reviews: parseInt(reviewResult.total) || 0,
      satisfaction_rate: reviewResult.avg_rating ? Math.round((parseFloat(reviewResult.avg_rating) / 5) * 100) : 95
    })
  })
}

export default new StatsController()
