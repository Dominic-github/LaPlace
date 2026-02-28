import models from '@/models'

const sequelize = models.sequelize

class LocationService {
  getProvinces = async () => {
    const [results] = await sequelize.query(`
      SELECT p.code, p.name, p.name_en, p.full_name, p.full_name_en, p.code_name,
             COALESCE(acc_count.total, 0) as accommodation_count
      FROM provinces p
      LEFT JOIN (
        SELECT province_code, COUNT(*) as total
        FROM accommodations
        WHERE status = 'active'
        GROUP BY province_code
      ) acc_count ON p.code = acc_count.province_code
      ORDER BY acc_count.total DESC, p.name ASC
    `)
    return results
  }

  getProvinceByCode = async (code_name) => {
    const [provinces] = await sequelize.query(`
      SELECT p.code, p.name, p.name_en, p.full_name, p.full_name_en, p.code_name,
             COALESCE(acc_count.total, 0) as accommodation_count
      FROM provinces p
      LEFT JOIN (
        SELECT province_code, COUNT(*) as total
        FROM accommodations
        WHERE status = 'active'
        GROUP BY province_code
      ) acc_count ON p.code = acc_count.province_code
      WHERE p.code_name = :code_name OR p.code = :code_name
      LIMIT 1
    `, { replacements: { code_name } })

    if (provinces.length === 0) throw new Error('Province not found')
    return provinces[0]
  }

  getWardsByProvince = async (province_code) => {
    const [wards] = await sequelize.query(`
      SELECT w.code, w.name, w.name_en, w.full_name, w.full_name_en, w.code_name,
             COALESCE(acc_count.total, 0) as accommodation_count
      FROM wards w
      LEFT JOIN (
        SELECT ward_code, COUNT(*) as total
        FROM accommodations
        WHERE status = 'active'
        GROUP BY ward_code
      ) acc_count ON w.code = acc_count.ward_code
      WHERE w.province_code = :province_code
      ORDER BY w.name ASC
    `, { replacements: { province_code } })
    return wards
  }
}

export default new LocationService()
