import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'
import videoReviewService from '@/services/videoReview.js'

class VideoReviewController {
  getAll = catchAsync(async (req, res) => {
    OK(res, 'Video reviews fetched successfully', await videoReviewService.getAll(req.query))
  })

  getBySlug = catchAsync(async (req, res) => {
    OK(res, 'Video review fetched successfully', await videoReviewService.getBySlug(req.params.slug))
  })

  create = catchAsync(async (req, res) => {
    CREATED(res, 'Video review created successfully', await videoReviewService.create(req.body))
  })

  update = catchAsync(async (req, res) => {
    OK(res, 'Video review updated successfully', await videoReviewService.update(req.params.video_id, req.body))
  })

  remove = catchAsync(async (req, res) => {
    OK(res, 'Video review deleted successfully', await videoReviewService.remove(req.params.video_id))
  })
}

export default new VideoReviewController()
