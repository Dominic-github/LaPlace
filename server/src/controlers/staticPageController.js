import { static_pages } from '../models/index.js'
import { v4 as uuidv4 } from 'uuid'

export const getStaticPages = async (req, res) => {
  try {
    const { title, sortValue, sortType, page, limit } = req.query
    let query = {}

    // basic filter by title
    if (title) {
      query.title = { [require('sequelize').Op.like]: `%${title}%` }
    }

    const currentPage = parseInt(page) || 1
    const size = parseInt(limit) || 10
    const offset = (currentPage - 1) * size

    const { count, rows } = await static_pages.findAndCountAll({
      where: query,
      order: [
        [sortValue || 'order', sortType || 'ASC'],
        ['createdAt', 'DESC']
      ],
      offset,
      limit: size
    })

    const totalPages = Math.ceil(count / size)

    return res.status(200).json({
      data: rows,
      total: count,
      pagination: {
        page: currentPage,
        limit: size,
        totalPages
      }
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getStaticPageById = async (req, res) => {
  try {
    const { id } = req.params
    const page = await static_pages.findOne({ where: { static_page_id: id } })
    if (!page) return res.status(404).json({ message: 'Static page not found' })

    return res.status(200).json({ data: page })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getStaticPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    const page = await static_pages.findOne({ where: { slug, isActive: true } })
    if (!page) return res.status(404).json({ message: 'Static page not found' })

    return res.status(200).json({ data: page })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const createStaticPage = async (req, res) => {
  try {
    const { title, slug, excerpt, content, metaTitle, metaDescription, metaKeywords, order, isActive } = req.body

    // Validate slug uniqueness
    if (slug) {
      const existing = await static_pages.findOne({ where: { slug } });
      if (existing) return res.status(400).json({ message: 'Slug already exists' });
    }

    const newPage = await static_pages.create({
      static_page_id: uuidv4(),
      title,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      metaKeywords,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    })

    return res.status(201).json({ message: 'Static page created successfully', data: newPage })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const updateStaticPage = async (req, res) => {
  try {
    const { id } = req.params
    const { title, slug, excerpt, content, metaTitle, metaDescription, metaKeywords, order, isActive } = req.body

    const page = await static_pages.findOne({ where: { static_page_id: id } })
    if (!page) return res.status(404).json({ message: 'Static page not found' })

    if (slug && slug !== page.slug) {
      const existing = await static_pages.findOne({ where: { slug } });
      if (existing) return res.status(400).json({ message: 'Slug already exists' });
    }

    await page.update({
      title,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      metaKeywords,
      order,
      isActive
    })

    return res.status(200).json({ message: 'Static page updated successfully', data: page })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteStaticPage = async (req, res) => {
  try {
    const { id } = req.params
    const page = await static_pages.findOne({ where: { static_page_id: id } })
    if (!page) return res.status(404).json({ message: 'Static page not found' })

    await page.destroy()

    return res.status(200).json({ message: 'Static page deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
