'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Accommodations_images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Accommodations_images.init(
    {
      accommodation_image_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      accommodation_id: {
        type: DataTypes.UUID,
        allowNull: false,
        foreginKey: true,
        references: {
          model: 'accommodations',
          key: 'accommodation_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      image_url: DataTypes.STRING,
      caption: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'accommodations_images'
    }
  )
  return Accommodations_images
}
