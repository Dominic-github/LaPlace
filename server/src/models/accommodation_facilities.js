'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Accommodation_facilities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Accommodation_facilities.init(
    {
      facility_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        foreginKey: true,
        allowNull: false
      },
      accommodation_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        foreginKey: true,
        allowNull: false,
        references: {
          model: 'accommodations',
          key: 'accommodation_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }
    },
    {
      sequelize,
      modelName: 'accommodation_facilities'
    }
  )
  return Accommodation_facilities
}
