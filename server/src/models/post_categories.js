'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PostCategories extends Model {
    static associate(models) {
      PostCategories.hasMany(models.posts, { foreignKey: 'category_id', as: 'posts' })
    }
  }
  PostCategories.init(
    {
      category_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'post_categories'
    }
  )
  return PostCategories
}
