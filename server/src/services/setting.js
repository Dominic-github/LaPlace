import models from '@/models'
import { Op } from 'sequelize'

const { settings } = models

class SettingService {
  getAllSettings = async (query = {}) => {
    const { page = 1, limit = 1000, search } = query
    const where = {}

    if (search) {
      where.key = { [Op.like]: `%${search}%` }
    }

    const { rows, count } = await settings.findAndCountAll({
      where,
      order: [['group', 'ASC'], ['key', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    })

    // Map setting_id → id for frontend compatibility
    const data = rows.map(row => {
      const item = row.toJSON()
      item.id = item.setting_id
      return item
    })

    return {
      data,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
      }
    }
  }

  getSettingByKey = async (key) => {
    const setting = await settings.findOne({ where: { key } })
    if (!setting) return null
    const item = setting.toJSON()
    item.id = item.setting_id
    return item
  }

  getSettingsByGroup = async (group) => {
    const rows = await settings.findAll({
      where: { group },
      order: [['key', 'ASC']]
    })
    return rows.map(row => {
      const item = row.toJSON()
      item.id = item.setting_id
      return item
    })
  }

  updateSetting = async (key, value) => {
    const setting = await settings.findOne({ where: { key } })
    if (!setting) {
      return await settings.create({ key, value })
    }
    setting.value = value
    await setting.save()
    const item = setting.toJSON()
    item.id = item.setting_id
    return item
  }

  bulkUpdate = async (settingsData) => {
    const results = []
    for (const [key, value] of Object.entries(settingsData)) {
      const result = await this.updateSetting(key, value)
      results.push(result)
    }
    return results
  }

  createSetting = async (data) => {
    const created = await settings.create(data)
    const item = created.toJSON()
    item.id = item.setting_id
    return item
  }

  getById = async (id) => {
    const setting = await settings.findByPk(id)
    if (!setting) return null
    const item = setting.toJSON()
    item.id = item.setting_id
    return item
  }

  updateById = async (id, data) => {
    const setting = await settings.findByPk(id)
    if (!setting) return null
    await setting.update(data)
    const item = setting.toJSON()
    item.id = item.setting_id
    return item
  }

  deleteSetting = async (id) => {
    return await settings.destroy({ where: { setting_id: id } })
  }
}

export default new SettingService()
