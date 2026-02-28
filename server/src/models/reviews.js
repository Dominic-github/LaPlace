'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reviews.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' })
      Reviews.belongsTo(models.accommodations, { foreignKey: 'accommodation_id', as: 'accommodation' })
    }
  }
  Reviews.init(
    {
      review_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'user_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      accommodation_id: {
        type: DataTypes.UUID,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'accommodations',
          key: 'accommodation_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      ratting: DataTypes.INTEGER,
      comment: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'reviews'
    }
  )
  return Reviews
}
