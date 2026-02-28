'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      Posts.belongsTo(models.post_categories, { foreignKey: 'category_id', as: 'category' })
      Posts.belongsTo(models.users, { foreignKey: 'author_id', as: 'author' })
    }
  }
  Posts.init(
    {
      post_id: {
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
      excerpt: DataTypes.TEXT,
      content: DataTypes.TEXT('long'),
      category_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      author_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      featured_image: DataTypes.STRING,
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      read_time: DataTypes.STRING,
      is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'published'
      }
    },
    {
      sequelize,
      modelName: 'posts'
    }
  )
  return Posts
}
