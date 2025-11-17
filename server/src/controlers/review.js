import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'

class ReviewController {
  createReview = catchAsync(async (req, res) => {
    CREATED(
      res,
      'Review created successfully',
      await reviewService.createReview(req.body)
    )
  })
  getReviewById = catchAsync(async (req, res) => {
    OK(
      res,
      'Review fetched successfully',
      await reviewService.getReviewById(req.params.review_id)
    )
  })
  updateReview = catchAsync(async (req, res) => {
    OK(
      res,
      'Review updated successfully',
      await reviewService.updateReview(req.params.review_id, req.body)
    )
  })
  deleteReview = catchAsync(async (req, res) => {
    OK(
      res,
      'Review deleted successfully',
      await reviewService.deleteReview(req.params.review_id)
    )
  })
  getReviewsByUserId = catchAsync(async (req, res) => {
    OK(
      res,
      'Reviews fetched successfully',
      await reviewService.getReviewsByUserId(req.params.user_id)
    )
  })
  getAllReviewsByAccommodationId = catchAsync(async (req, res) => {
    OK(
      res,
      'Reviews fetched successfully',
      await reviewService.getAllReviewsByAccommodationId(
        req.params.accommodation_id
      )
    )
  })
}
export default new ReviewController()
