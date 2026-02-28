import catchAsync from '../helpers/catchAsync.js'
import { CREATED, OK } from '@/core/success.js'
import postService from '@/services/post.js'

class PostController {
  getAllPosts = catchAsync(async (req, res) => {
    OK(res, 'Posts fetched successfully', await postService.getAllPosts(req.query))
  })

  getPostBySlug = catchAsync(async (req, res) => {
    OK(res, 'Post fetched successfully', await postService.getPostBySlug(req.params.slug))
  })

  getCategories = catchAsync(async (req, res) => {
    OK(res, 'Categories fetched successfully', await postService.getCategories())
  })

  createPost = catchAsync(async (req, res) => {
    CREATED(res, 'Post created successfully', await postService.createPost(req.body))
  })

  updatePost = catchAsync(async (req, res) => {
    OK(res, 'Post updated successfully', await postService.updatePost(req.params.post_id, req.body))
  })

  deletePost = catchAsync(async (req, res) => {
    OK(res, 'Post deleted successfully', await postService.deletePost(req.params.post_id))
  })
}

export default new PostController()
