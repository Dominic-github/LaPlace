'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class VideoReviews extends Model {
    static associate(models) {
      VideoReviews.belongsTo(models.accommodations, { foreignKey: 'accommodation_id', as: 'accommodation' })
    }
  }
  VideoReviews.init(
    {
      video_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      video_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      thumbnail: DataTypes.STRING,
      accommodation_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      province_code: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      duration: DataTypes.STRING,
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      }
    },
    {
      sequelize,
      modelName: 'video_reviews'
    }
  )
  return VideoReviews
}
