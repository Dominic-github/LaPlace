'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Accommodations extends Model {
    static associate(models) {
      Accommodations.belongsTo(models.users, { foreignKey: 'landlord_id', as: 'landlord' })
      Accommodations.hasMany(models.accommodations_images, { foreignKey: 'accommodation_id', as: 'images' })
      Accommodations.hasMany(models.reviews, { foreignKey: 'accommodation_id', as: 'reviews' })
      Accommodations.hasMany(models.video_reviews, { foreignKey: 'accommodation_id', as: 'videoReviews' })
      Accommodations.belongsToMany(models.facilities, {
        through: models.accommodation_facilities,
        foreignKey: 'accommodation_id',
        otherKey: 'facility_id',
        as: 'facilities'
      })
    }
  }
  Accommodations.init(
    {
      accommodation_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      landlord_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.STRING,
      slot: DataTypes.INTEGER,
      location: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      area: DataTypes.STRING,
      bedrooms: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      bathrooms: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      deposit_months: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'pending'),
        defaultValue: 'active'
      },
      province_code: DataTypes.STRING(20),
      ward_code: DataTypes.STRING(20),
      latitude: DataTypes.DECIMAL(10, 8),
      longitude: DataTypes.DECIMAL(11, 8)
    },
    {
      sequelize,
      modelName: 'accommodations'
    }
  )
  return Accommodations
}
