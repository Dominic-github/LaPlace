import models from '@/models'

const { video_reviews, accommodations } = models

class VideoReviewService {
  getAll = async (query = {}) => {
    const { province, page = 1, limit = 12 } = query
    const where = { status: 'active' }

    if (province) where.province_code = province

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const parsedLimit = parseInt(limit)

    const { count, rows } = await video_reviews.findAndCountAll({
      where,
      include: [
        { model: accommodations, as: 'accommodation', attributes: ['accommodation_id', 'name', 'price', 'location', 'type'] }
      ],
      order: [['createdAt', 'DESC']],
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

  getBySlug = async (slug) => {
    const video = await video_reviews.findOne({
      where: { slug },
      include: [
        { model: accommodations, as: 'accommodation', attributes: ['accommodation_id', 'name', 'price', 'location', 'type', 'thumbnail'] }
      ]
    })
    if (!video) throw new Error('Video review not found')
    await video_reviews.update({ views: video.views + 1 }, { where: { video_id: video.video_id } })
    return video
  }

  create = async (data) => {
    return video_reviews.create(data)
  }

  update = async (video_id, data) => {
    const video = await video_reviews.findByPk(video_id)
    if (!video) throw new Error('Video review not found')
    return video_reviews.update(data, { where: { video_id } })
  }

  remove = async (video_id) => {
    const video = await video_reviews.findByPk(video_id)
    if (!video) throw new Error('Video review not found')
    return video_reviews.destroy({ where: { video_id } })
  }
}

export default new VideoReviewService()
