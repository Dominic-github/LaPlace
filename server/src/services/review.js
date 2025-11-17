import models from '@/models'
const { reviews } = models

class ReviewService {
  createReview = async ({ rating, comment, user_id, property_id }) => {
    const newReview = await reviews.create({
      rating: rating,
      comment: comment,
      user_id: user_id,
      property_id: property_id
    })
    return newReview
  }
  getReviewById = async (review_id) => {
    const review = await reviews.findByPk(review_id)
    return review
  }
  deleteReview = async (review_id) => {
    const deleted = await reviews.destroy({ where: { review_id } })
    return deleted
  }
  updateReview = async (review_id, { rating, comment }) => {
    const updated = await reviews.update(
      { rating, comment },
      { where: { review_id } }
    )
    return updated
  }
}
export default new ReviewService()
