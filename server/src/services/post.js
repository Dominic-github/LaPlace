import models from '@/models'

const { posts, post_categories, users } = models

class PostService {
  getAllPosts = async (query = {}) => {
    const { category, page = 1, limit = 9, featured, status = 'published' } = query
    const where = { status }
    const order = [['createdAt', 'DESC']]

    if (category) {
      const cat = await post_categories.findOne({ where: { slug: category } })
      if (cat) where.category_id = cat.category_id
    }
    if (featured === 'true') where.is_featured = true

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const parsedLimit = parseInt(limit)

    const { count, rows } = await posts.findAndCountAll({
      where,
      include: [
        { model: post_categories, as: 'category', attributes: ['category_id', 'name', 'slug'] },
        { model: users, as: 'author', attributes: ['user_id', 'fullname', 'image'] }
      ],
      order,
      offset,
      limit: parsedLimit,
      distinct: true
    })

    return {
      items: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parsedLimit,
        totalPages: Math.ceil(count / parsedLimit)
      }
    }
  }

  getPostBySlug = async (slug) => {
    const post = await posts.findOne({
      where: { slug },
      include: [
        { model: post_categories, as: 'category', attributes: ['category_id', 'name', 'slug'] },
        { model: users, as: 'author', attributes: ['user_id', 'fullname', 'image'] }
      ]
    })
    if (!post) throw new Error('Post not found')

    // Increment views
    await posts.update({ views: post.views + 1 }, { where: { post_id: post.post_id } })

    return post
  }

  getCategories = async () => {
    return post_categories.findAll({
      attributes: ['category_id', 'name', 'slug', 'description'],
      order: [['name', 'ASC']]
    })
  }

  createPost = async (data) => {
    return posts.create(data)
  }

  updatePost = async (post_id, data) => {
    const post = await posts.findByPk(post_id)
    if (!post) throw new Error('Post not found')
    return posts.update(data, { where: { post_id } })
  }

  deletePost = async (post_id) => {
    const post = await posts.findByPk(post_id)
    if (!post) throw new Error('Post not found')
    return posts.destroy({ where: { post_id } })
  }
}

export default new PostService()
