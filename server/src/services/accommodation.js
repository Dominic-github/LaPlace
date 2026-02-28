import models from '@/models'
import { Api403Error } from '@/core/error'
import { Op } from 'sequelize'

const { accommodations, accommodations_images, facilities, accommodation_facilities, reviews, users, favorites } = models

class AccommodationService {
  getAllAccommodations = async (query = {}) => {
    const { type, price_min, price_max, area_min, area_max, province, sort, page = 1, limit = 12, featured, search } = query
    const where = { status: 'active' }
    const order = []

    // Filters
    if (type) where.type = type
    if (province) where.province_code = province
    if (price_min || price_max) {
      where.price = {}
      if (price_min) where.price[Op.gte] = String(price_min)
      if (price_max) where.price[Op.lte] = String(price_max)
    }
    if (area_min || area_max) {
      where.area = {}
      if (area_min) where.area[Op.gte] = String(area_min)
      if (area_max) where.area[Op.lte] = String(area_max)
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ]
    }

    // Sort
    if (sort === 'price_asc') order.push(['price', 'ASC'])
    else if (sort === 'price_desc') order.push(['price', 'DESC'])
    else if (sort === 'newest') order.push(['createdAt', 'DESC'])
    else if (sort === 'area_asc') order.push(['area', 'ASC'])
    else order.push(['createdAt', 'DESC'])

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const parsedLimit = parseInt(limit)

    const { count, rows } = await accommodations.findAndCountAll({
      where,
      include: [
        { model: accommodations_images, as: 'images', attributes: ['image_url', 'caption'] },
        { model: facilities, as: 'facilities', attributes: ['facility_id', 'name'], through: { attributes: [] } },
        { model: users, as: 'landlord', attributes: ['user_id', 'fullname', 'phone', 'image'] }
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

  getFeatured = async (limit = 6) => {
    return accommodations.findAll({
      where: { status: 'active' },
      include: [
        { model: accommodations_images, as: 'images', attributes: ['image_url', 'caption'] },
        { model: facilities, as: 'facilities', attributes: ['facility_id', 'name'], through: { attributes: [] } },
        { model: users, as: 'landlord', attributes: ['user_id', 'fullname', 'phone', 'image'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    })
  }

  getAccommodationById = async (accommodation_id) => {
    const findAccommodation = await accommodations.findOne({
      where: { accommodation_id },
      include: [
        { model: accommodations_images, as: 'images', attributes: ['accommodation_image_id', 'image_url', 'caption'] },
        { model: facilities, as: 'facilities', attributes: ['facility_id', 'name'], through: { attributes: [] } },
        {
          model: reviews, as: 'reviews',
          include: [{ model: users, as: 'user', attributes: ['user_id', 'fullname', 'image'] }],
          order: [['createdAt', 'DESC']]
        },
        { model: users, as: 'landlord', attributes: ['user_id', 'fullname', 'phone', 'image', 'email'] }
      ]
    })
    if (!findAccommodation) {
      throw new Error('Accommodation not found')
    }
    return findAccommodation
  }

  createAccommodation = async (data) => {
    return accommodations.create(data)
  }

  updateAccommodation = async (accommodation_id, data) => {
    const findAccommodation = await accommodations.findOne({
      where: { accommodation_id }
    })
    if (!findAccommodation) {
      throw new Error('Accommodation not found')
    }
    return accommodations.update(data, { where: { accommodation_id } })
  }

  deleteAccommodation = async (accommodation_id) => {
    const findAccommodation = await accommodations.findOne({
      where: { accommodation_id }
    })
    if (!findAccommodation) {
      throw new Error('Accommodation not found')
    }
    return accommodations.destroy({ where: { accommodation_id } })
  }

  addAccommodationToFavourites = async (user_id, accommodation_id) => {
    const favorite = await favorites.create({ user_id, accommodation_id })
    if (!favorite) {
      throw new Api403Error('Could not add to favorites')
    }

    return favorite
  }
}

export default new AccommodationService()
